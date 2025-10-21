import { NextResponse } from "next/server";
import { Buffer } from "buffer";
import * as cbor from "cbor";
import { ed25519 } from "@noble/curves/ed25519";
import { blake2b } from "blake2b";

async function verifyCIP8(
  coseSign1Hex: string,
  coseKeyHex: string,
  payloadDataHex?: string,
  validatePayloadMatch: boolean = false
): Promise<{ verified: boolean; error?: string }> {
  try {
    // Parse COSE_Key structure
    const coseKeyBuffer = Buffer.from(coseKeyHex, "hex");
    const coseKeyStructure = cbor.decode(coseKeyBuffer);

    if (!(coseKeyStructure instanceof Map) || coseKeyStructure.size < 4) {
      throw new Error(
        "COSE_Key is not valid. It must be a map with at least 4 entries: kty,alg,crv,x."
      );
    }

    if (coseKeyStructure.get(1) !== 1) {
      throw new Error("COSE_Key map key '1' (kty) is not '1' (OKP)");
    }

    if (coseKeyStructure.get(3) !== -8) {
      throw new Error("COSE_Key map key '3' (alg) is not '-8' (EdDSA)");
    }

    if (coseKeyStructure.get(-1) !== 6) {
      throw new Error("COSE_Key map key '-1' (crv) is not '6' (Ed25519)");
    }

    if (!coseKeyStructure.has(-2)) {
      throw new Error("COSE_Key map key '-2' (public key) is missing");
    }

    // Extract public key
    const pubKeyBuffer = coseKeyStructure.get(-2);
    if (!Buffer.isBuffer(pubKeyBuffer)) {
      throw new Error("PublicKey entry in the COSE_Key is not a bytearray");
    }
    const pubKey = pubKeyBuffer.toString("hex");

    // Parse COSE_Sign1 structure
    const coseSign1Buffer = Buffer.from(coseSign1Hex, "hex");
    const coseSign1Structure = cbor.decode(coseSign1Buffer);

    // Validate COSE_Sign1 structure
    if (!Array.isArray(coseSign1Structure) || coseSign1Structure.length !== 4) {
      throw new Error(
        "COSE_Sign1 is not a valid signature. It must be an array with 4 entries."
      );
    }

    // Extract components: [protectedHeader, unprotectedHeader, payload, signature]
    const [
      protectedHeaderBuffer,
      unprotectedHeader,
      payloadBuffer,
      signatureBuffer,
    ] = coseSign1Structure;

    // Parse protected header
    if (!Buffer.isBuffer(protectedHeaderBuffer)) {
      throw new Error("Protected header is not a bytearray (serialized) cbor");
    }

    const protectedHeader = cbor.decode(protectedHeaderBuffer);

    // Validate protected header
    if (!protectedHeader.has(1)) {
      throw new Error("Protected header map key '1' is missing");
    }

    if (protectedHeader.get(1) !== -8) {
      throw new Error("Protected header map key '1' (alg) is not '-8' (EdDSA)");
    }

    if (!protectedHeader.has("address")) {
      throw new Error("Protected header map key 'address' is missing");
    }

    // Parse unprotected header for hashed flag
    let unprotectedHeaderMap = unprotectedHeader;
    if (
      !(unprotectedHeader instanceof Map) &&
      typeof unprotectedHeader === "object"
    ) {
      unprotectedHeaderMap = new Map(Object.entries(unprotectedHeader));
    }

    if (!(unprotectedHeaderMap instanceof Map)) {
      throw new Error("Unprotected header is not a map");
    }

    if (!unprotectedHeaderMap.has("hashed")) {
      throw new Error("Unprotected header key 'hashed' is missing");
    }

    const isHashed = unprotectedHeaderMap.get("hashed");
    if (typeof isHashed !== "boolean") {
      throw new Error(
        "Unprotected header value in key 'hashed' is not a boolean"
      );
    }

    // Handle payload - prioritize embedded payload over external payload
    let finalPayloadHex = payloadDataHex;
    let embeddedPayload = null;

    // Check if payload is embedded in COSE_Sign1 structure
    if (Buffer.isBuffer(payloadBuffer)) {
      embeddedPayload = payloadBuffer.toString("utf8");
      finalPayloadHex = payloadBuffer.toString("hex");

      // If validatePayloadMatch is true, check if embedded payload matches external payload
      if (validatePayloadMatch && payloadDataHex) {
        const externalPayloadText = Buffer.from(payloadDataHex, "hex").toString(
          "utf8"
        );
        const prefix = "Cardano Signed Message:\n";
        const prefixedExternalPayload = prefix + externalPayloadText;

        const payloadMatches =
          embeddedPayload === externalPayloadText ||
          embeddedPayload === prefixedExternalPayload ||
          finalPayloadHex === payloadDataHex;

        if (!payloadMatches) {
          throw new Error(
            "Embedded payload does not match the provided external payload"
          );
        }
      }
    } else if (payloadBuffer === null) {
      // No embedded payload, use external payload
      if (!finalPayloadHex) {
        throw new Error(
          "There is no payload present in the COSE_Sign1 signature, please provide a payload via the data parameter"
        );
      }
    }

    if (!finalPayloadHex) {
      throw new Error("No payload data available for verification");
    }

    // Hash payload if needed
    if (finalPayloadHex && isHashed) {
      const payloadBytes = Buffer.from(finalPayloadHex, "hex");
      const hashedPayload = blake2b(28).update(payloadBytes).digest();
      finalPayloadHex = Buffer.from(hashedPayload).toString("hex");
    }

    // Extract signature
    if (!Buffer.isBuffer(signatureBuffer)) {
      throw new Error("Signature is not a bytearray");
    }
    const signatureHex = signatureBuffer.toString("hex");

    // Construct Sig_structure for verification
    // Sig_structure = ["Signature1", protectedHeaderBuffer, Buffer.from(''), payloadBuffer]
    const sigStructure = [
      "Signature1",
      protectedHeaderBuffer,
      Buffer.from(""),
      Buffer.from(finalPayloadHex, "hex"),
    ];

    const sigStructureCborHex = cbor.encode(sigStructure).toString("hex");

    // Verify signature using @noble/curves
    const verified = ed25519.verify(signatureHex, sigStructureCborHex, pubKey);

    return { verified };
  } catch (error) {
    return {
      verified: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Simple CIP-8 verification for raw signatures (64-byte hex)
function verifyRawCIP8(
  publicKeyHex: string,
  messageHex: string,
  signatureHex: string
) {
  try {
    const publicKey = Buffer.from(publicKeyHex, "hex");
    const message = Buffer.from(messageHex, "hex");
    const signature = Buffer.from(signatureHex, "hex");

    if (publicKey.length !== 32) {
      return { verified: false, error: "Invalid public key length" };
    }

    if (signature.length !== 64) {
      return { verified: false, error: "Invalid signature length" };
    }

    const isValid = ed25519.verify(signatureHex, messageHex, publicKeyHex);
    return {
      verified: isValid,
      error: isValid ? "" : "Raw signature verification failed",
    };
  } catch (error) {
    return {
      verified: false,
      error: error instanceof Error ? error.message : "Raw verification error",
    };
  }
}

// Check if signature is COSE format or raw
function isCoseSignature(signature: string): boolean {
  try {
    // A raw signature is exactly 128 hex chars (64 bytes)
    if (signature.length === 128) {
      return false; // Raw signature
    }

    // Try to decode as CBOR
    const buffer = Buffer.from(signature, "hex");
    const decoded = cbor.decode(buffer);

    // COSE_Sign1 should be an array with 4 elements
    return Array.isArray(decoded) && decoded.length === 4;
  } catch (error) {
    return false;
  }
}

// Convert hex message to payload format for CIP-8/30 verification
function messageToPayloadHex(message: string): string {
  // Convert message to hex bytes
  return Buffer.from(message, "utf8").toString("hex");
}

// Create standard COSE_Key from raw public key hex or extract from existing COSE_Key
function createCoseKey(publicKeyHex: string): string {
  // Check if this is already a COSE_Key structure
  if (
    publicKeyHex.length > 64 &&
    !publicKeyHex.startsWith("a4010103272006215820")
  ) {
    try {
      const buffer = Buffer.from(publicKeyHex, "hex");
      const decoded = cbor.decode(buffer);

      // If it's a valid COSE_Key structure, return as-is
      if (decoded instanceof Map && decoded.has(-2)) {
        return publicKeyHex;
      }
    } catch (error) {
      // Not a valid COSE structure, continue with extraction
    }
  }

  // Remove any COSE prefix if present
  let cleanPublicKey = publicKeyHex;
  if (publicKeyHex.startsWith("a4010103272006215820")) {
    cleanPublicKey = publicKeyHex.substring(20); // Remove the 20-char prefix
  }

  // Standard COSE_Key structure for Ed25519
  // kty (1) = OKP (1), alg (3) = EdDSA (-8), crv (-1) = Ed25519 (6), x (-2) = public key bytes
  const coseKeyMap = new Map()
    .set(1, 1) // kty: OKP
    .set(3, -8) // alg: EdDSA
    .set(-1, 6) // crv: Ed25519
    .set(-2, Buffer.from(cleanPublicKey, "hex")); // x: public key bytes

  return cbor.encode(coseKeyMap).toString("hex");
}

// Main verification function
async function performVerification(
  publicKey: string,
  message: string,
  signature: string
) {
  let isCip8Verified = false;
  let isCip30Verified = false;
  let isPrefixAppended = false;

  // Initialize with empty strings to prevent null errors in the frontend
  let error = { cip8: "", cip30: "" };

  // Check for empty values
  if (!publicKey || !message || !signature) {
    error = {
      cip8: "Missing required parameters",
      cip30: "Missing required parameters",
    };
    return {
      isCip8Verified,
      isCip30Verified,
      isPrefixAppended,
      error,
      signatureFormat: "Unknown",
      signatureStandard: "Unknown",
      messageHex: "",
      cleanPublicKey: "",
    };
  }

  let messageHex = message;
  let cleanPublicKey = publicKey;

  // Convert message to hex if it's not already
  if (message && !message.match(/^[0-9a-fA-F]+$/)) {
    messageHex = Buffer.from(message, "utf8").toString("hex");
  }

  // Clean the public key - remove any COSE formatting
  if (publicKey.startsWith("a4010103")) {
    // Extract the actual public key from COSE_Key structure
    try {
      const coseKeyBuffer = Buffer.from(publicKey, "hex");
      const coseKeyStructure = cbor.decode(coseKeyBuffer);
      if (coseKeyStructure instanceof Map && coseKeyStructure.has(-2)) {
        const keyData = coseKeyStructure.get(-2);
        if (keyData instanceof Uint8Array) {
          cleanPublicKey = Buffer.from(keyData).toString("hex");
        }
      }
    } catch (e) {
      // Failed to parse COSE key, using original
    }
  }

  // Determine if this is a COSE format signature
  const isCoseFormat = signature.startsWith("84");

  if (isCoseFormat) {
    try {
      const result = await verifyCIP8(signature, publicKey, messageHex, true);
      if (result.verified) {
        isCip8Verified = true;
      } else {
        error.cip8 = result.error || "CIP-8 verification failed";
      }
    } catch (err) {
      error.cip8 =
        err instanceof Error ? err.message : "CIP-8 verification error";
    }
  } else {
    try {
      const result = verifyRawCIP8(cleanPublicKey, messageHex, signature);
      if (result.verified) {
        isCip8Verified = true;
      } else {
        error.cip8 = result.error || "Raw CIP-8 verification failed";
      }
    } catch (err) {
      error.cip8 =
        err instanceof Error ? err.message : "Raw CIP-8 verification error";
    }
  }

  // If CIP-8 failed and we have a COSE format, try fallback with embedded payload
  if (!isCip8Verified && isCoseFormat) {
    try {
      // Try to decode COSE_Sign1 and check for embedded payload
      const coseBuffer = Buffer.from(signature, "hex");
      const coseArray = cbor.decode(coseBuffer);

      if (Array.isArray(coseArray) && coseArray.length >= 3) {
        const embeddedPayload = coseArray[2];
        if (embeddedPayload && embeddedPayload.length > 0) {
          const embeddedHex = Buffer.from(embeddedPayload).toString("hex");
          const embeddedText = Buffer.from(embeddedPayload).toString("utf8");

          // Check if embedded payload matches input message (with or without CIP-30 prefix)
          const prefix = "Cardano Signed Message:\n";
          const prefixedMessage = prefix + message;

          const messageMatches =
            embeddedText === message ||
            embeddedText === prefixedMessage ||
            embeddedHex === messageHex;

          if (messageMatches) {
            // Only verify if the embedded payload matches the input
            const result = await verifyCIP8(signature, publicKey, embeddedHex);
            if (result.verified) {
              isCip30Verified = true;
              isCip8Verified = true;
              isPrefixAppended = embeddedText === prefixedMessage;
              error.cip30 = ""; // Clear error since verification succeeded
              error.cip8 = "";
            }
          }
        }
      }
    } catch (err) {
      // Fallback failed
    }
  }

  // Prefix handling for CIP-30
  if (!isCip30Verified && !isCip8Verified) {
    const prefix = "Cardano Signed Message:\n";
    const prefixedMessage = prefix + message;
    const prefixedMessageHex = Buffer.from(prefixedMessage, "utf8").toString(
      "hex"
    );

    if (isCoseFormat) {
      try {
        const result = await verifyCIP8(
          signature,
          publicKey,
          prefixedMessageHex,
          true
        );
        if (result.verified) {
          isCip30Verified = true;
          isPrefixAppended = true;
        } else {
          error.cip30 =
            result.error || "CIP-30 verification with prefix failed";
        }
      } catch (err) {
        error.cip30 =
          err instanceof Error ? err.message : "CIP-30 verification error";
      }
    } else {
      try {
        const result = verifyRawCIP8(
          cleanPublicKey,
          prefixedMessageHex,
          signature
        );
        if (result.verified) {
          isCip30Verified = true;
          isPrefixAppended = true;
        } else {
          error.cip30 =
            result.error || "Raw CIP-30 verification with prefix failed";
        }
      } catch (err) {
        error.cip30 =
          err instanceof Error ? err.message : "Raw CIP-30 verification error";
      }
    }
  }

  // Final fallback: try alternative COSE parsing only if no embedded payload comparison was attempted
  if (!isCip8Verified && !isCip30Verified && isCoseFormat) {
    try {
      // Only use this fallback if there's no embedded payload that we should validate against
      const coseBuffer = Buffer.from(signature, "hex");
      const coseArray = cbor.decode(coseBuffer);

      // If there's an embedded payload, we shouldn't use this fallback as it bypasses message verification
      if (
        Array.isArray(coseArray) &&
        coseArray.length >= 3 &&
        coseArray[2] &&
        coseArray[2].length > 0
      ) {
        // There's an embedded payload - don't bypass message verification
        return {
          isCip8Verified,
          isCip30Verified,
          isPrefixAppended,
          error,
          signatureFormat: isCoseFormat ? "COSE_Sign1" : "Raw",
          signatureStandard: isCoseFormat ? "CIP-0030 version of CIP-0008" : "CIP-0008",
          messageHex,
          cleanPublicKey,
        };
      }

      // Only proceed if there's no embedded payload (payloadless signature)
      const result = await verifyCIP8(signature, publicKey);
      if (result.verified) {
        isCip30Verified = true;
        isCip8Verified = true;
        error.cip30 = ""; // Clear error since verification succeeded
        error.cip8 = "";
      }
    } catch (err) {
      error.cip30 =
        err instanceof Error
          ? err.message
          : "CIP-30 fallback verification error";
    }
  }

  // Ensure we have error messages when verification fails
  if (!isCip8Verified && !isCip30Verified) {
    if (!error.cip8 && !error.cip30) {
      error.cip8 = "Signature verification failed";
      error.cip30 = "Signature verification failed";
    }
  }

  return {
    isCip8Verified,
    isCip30Verified,
    isPrefixAppended,
    error,
    signatureFormat: isCoseFormat ? "COSE_Sign1" : "Raw",
    signatureStandard: isCoseFormat ? "CIP-0030 version of CIP-0008" : "CIP-0008",
    messageHex,
    cleanPublicKey,
  };
}

export async function GET(request) {
  const url = new URL(request.url);
  const { searchParams } = url;

  const publicKey = searchParams.get("publicKey");
  const message = searchParams.get("message");
  const signature = searchParams.get("signature");

  const result = await performVerification(publicKey, message, signature);

  return NextResponse.json({
    isCip8Verified: result.isCip8Verified,
    isCip30Verified: result.isCip30Verified,
    isPrefixAppended: result.isPrefixAppended,
    error: result.error,
    signatureFormat: result.signatureFormat,
    signatureStandard: result.signatureStandard,
    messageHex: result.messageHex,
    cleanPublicKey: result.cleanPublicKey,
  });
}

export async function POST(request: Request) {
  try {
    const { signature, key, payload } = await request.json();

    if (!signature || !key || payload === undefined) {
      return NextResponse.json(
        {
          valid: false,
          error: "Missing required fields: signature, key, and payload",
        },
        { status: 400 }
      );
    }

    const result = await performVerification(key, payload, signature);

    // Map the detailed result to our simple API format
    const valid = result.isCip8Verified || result.isCip30Verified;
    const signatureStandard =
      result.signatureStandard ||
      (result.isCip30Verified ? "CIP-0030 version of CIP-0008" : "CIP-0008");

    return NextResponse.json({
      valid,
      signatureStandard,
      error: valid
        ? undefined
        : result.error.cip8 || result.error.cip30 || "Verification failed",
    });
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
