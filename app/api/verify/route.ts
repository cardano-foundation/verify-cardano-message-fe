import { NextResponse } from "next/server";
import {
  Ed25519Signature,
  PublicKey,
} from "@emurgo/cardano-serialization-lib-asmjs";
import verifyDataSignature from "@cardano-foundation/cardano-verify-datasignature";
import { Buffer } from "buffer";
import * as cbor from "cbor";

function appendCborPrefix(publicKey: string) {
  // If the public key already has a CBOR prefix, return it as is
  if (publicKey.startsWith("a4010103272006215820")) {
    return publicKey;
  }
  // If it's a raw public key (32 bytes = 64 hex chars), add the prefix
  if (publicKey.length === 64) {
    return `a4010103272006215820${publicKey}`;
  }
  // For any other format, try to add the prefix
  return `a401010327200621${publicKey}`;
}

// Simple extraction method
function extractSignatureFromCbor(cborSignature: string): string {
  try {
    // Look for the "5840" prefix which is CBOR for a 64-byte byte string (the signature)
    const signatureIndex = cborSignature.indexOf("5840");
    if (
      signatureIndex !== -1 &&
      signatureIndex + 4 + 128 <= cborSignature.length
    ) {
      // Extract the 64-byte (128 hex characters) signature after the "5840" marker
      return cborSignature.substring(
        signatureIndex + 4,
        signatureIndex + 4 + 128
      );
    }

    if (cborSignature.length >= 128) {
      return cborSignature.slice(-128);
    }

    return cborSignature;
  } catch (error) {
    console.error("Error extracting signature:", error);
    return cborSignature;
  }
}

// Advanced extraction using CBOR library
async function extractSignatureWithCbor(cborHex: string): Promise<string> {
  try {
    const cborBuffer = Buffer.from(cborHex, "hex");
    const decoded = await cbor.decode(cborBuffer);
    console.log("Decoded CBOR structure:", JSON.stringify(decoded, null, 2));

    // Navigate through the CBOR structure
    // The CIP-30 signature structure typically has the signature as the last item
    if (Array.isArray(decoded)) {
      for (const item of decoded) {
        // Look for Buffer or Uint8Array which could be our signature
        if (Buffer.isBuffer(item) && item.length === 64) {
          return item.toString("hex");
        }

        // If it's an object with a buffer property
        if (typeof item === "object" && item !== null) {
          // If we find a 5840 property or similar signature marker
          for (const [key, value] of Object.entries(item)) {
            if (Buffer.isBuffer(value) && value.length === 64) {
              return value.toString("hex");
            }
          }
        }
      }

      // If we couldn't find a 64-byte buffer, try the last item
      const lastItem = decoded[decoded.length - 1];
      if (Buffer.isBuffer(lastItem)) {
        return lastItem.toString("hex");
      }
    }

    // If CBOR parsing doesn't yield results, fall back to simple extraction
    return extractSignatureFromCbor(cborHex);
  } catch (err) {
    console.error("CBOR parsing error:", err);
    return extractSignatureFromCbor(cborHex);
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const { searchParams } = url;

  const publicKey = searchParams.get("publicKey");
  const message = searchParams.get("message");
  const signature = searchParams.get("signature");

  let isCip8Verified = false;
  let isCip30Verified = false;
  let isPrefixAppended = false;

  // Initialize with empty strings to prevent null errors in the frontend
  let error = { cip8: "", cip30: "" };

  console.log("Received data:");
  console.log("Public key:", publicKey);
  console.log("Message:", message);
  console.log("Signature:", signature);

  // Check for empty values
  if (!publicKey || !message || !signature) {
    error = {
      cip8: "Missing required parameters",
      cip30: "Missing required parameters",
    };
    return NextResponse.json({
      isCip8Verified,
      isCip30Verified,
      isPrefixAppended,
      error,
    });
  }

  // Extract signature - first try simple extraction
  let rawSignature = extractSignatureFromCbor(signature);
  console.log("Simple extracted signature:", rawSignature);

  // Verify if it's CIP-8
  try {
    const publicKeyBytes = PublicKey.from_bytes(
      new Uint8Array(Buffer.from(publicKey, "hex"))
    );
    const signatureBytes = Ed25519Signature.from_bytes(
      new Uint8Array(Buffer.from(signature, "hex"))
    );
    const messageBytes = new Uint8Array(Buffer.from(message));

    // Try initial verification without prefix
    isCip8Verified = publicKeyBytes.verify(messageBytes, signatureBytes);
  } catch (err) {
    // First verification failed, try with CBOR prefix
    try {
      const cborPublicKeyBytes = PublicKey.from_bytes(
        new Uint8Array(Buffer.from(appendCborPrefix(publicKey), "hex"))
      );
      const signatureBytes = Ed25519Signature.from_bytes(
        new Uint8Array(Buffer.from(signature, "hex"))
      );
      const messageBytes = new Uint8Array(Buffer.from(message));

      isCip8Verified = cborPublicKeyBytes.verify(messageBytes, signatureBytes);
      isPrefixAppended = true;
    } catch (innerErr) {
      console.error(`Verification failed at CIP-8: ${innerErr}`);
      error.cip8 =
        innerErr instanceof Error ? innerErr.message : String(innerErr);
    }
  }

  // Verify if it's CIP-30
  try {
    // First try with the public key as is
    try {
      isCip30Verified = await verifyDataSignature(
        rawSignature,
        publicKey,
        message
      );
    } catch (err) {
      console.log("First CIP-30 verification failed:", err);
      error.cip30 = err instanceof Error ? err.message : String(err);

      // Try with CBOR prefixed public key
      try {
        const cborPublicKey = appendCborPrefix(publicKey);
        isCip30Verified = await verifyDataSignature(
          rawSignature,
          cborPublicKey,
          message
        );
        isPrefixAppended = true;
      } catch (innerErr) {
        console.log("Second CIP-30 verification failed:", innerErr);
        error.cip30 =
          innerErr instanceof Error ? innerErr.message : String(innerErr);

        // Try with the original signature format
        try {
          isCip30Verified = await verifyDataSignature(
            signature,
            publicKey,
            message
          );
          if (isCip30Verified) {
            error.cip30 = "";
          }
        } catch (lastErr) {
          console.log("Third CIP-30 verification failed:", lastErr);

          // Last attempt with original signature and CBOR prefix
          try {
            const cborPublicKey = appendCborPrefix(publicKey);
            isCip30Verified = await verifyDataSignature(
              signature,
              cborPublicKey,
              message
            );
            isPrefixAppended = true;
            if (isCip30Verified) {
              error.cip30 = "";
            }
          } catch (finalErr) {
            console.error(
              `All CIP-30 verification attempts failed: ${finalErr}`
            );
            error.cip30 =
              finalErr instanceof Error ? finalErr.message : String(finalErr);
          }
        }
      }
    }
  } catch (err) {
    console.error(`CIP-30 overall error: ${err}`);
    error.cip30 = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    isCip8Verified,
    isCip30Verified,
    isPrefixAppended,
    error,
    extractedSignature: rawSignature,
  });
}
