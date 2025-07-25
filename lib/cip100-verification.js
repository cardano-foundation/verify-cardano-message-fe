import { ed25519 } from "@noble/curves/ed25519";
import cbor from "cbor";
import blake2b from "blake2b";
import jsonld from "jsonld";

/**
 * Canonize JSON-LD context and body for CIP-100 verification
 * @param {Object} metadata - The JSON-LD governance metadata
 * @returns {Promise<{canonized: string, hash: string}>}
 */
export async function canonizeGovernanceData(metadata) {
  try {
    // Based on cardano-signer approach: canonize @context and body using URDNA2015
    const jsonldData = {
      body: metadata.body,
      "@context": metadata["@context"],
    };

    // Use URDNA2015 canonicalization algorithm (same as cardano-signer)
    const canonized = await jsonld.canonize(jsonldData, {
      safe: true,
      algorithm: "URDNA2015",
      format: "application/n-quads",
    });

    // Hash the canonized data with Blake2b-256 (proper CIP-100 requirement)
    const hash = blake2b(32)
      .update(Buffer.from(canonized, "utf8"))
      .digest("hex");

    return {
      canonized,
      hash,
    };
  } catch (error) {
    throw new Error(`Canonization failed: ${error.message}`);
  }
}

/**
 * Verify Ed25519 signature directly (for ed25519 witness algorithm)
 * @param {string} publicKeyHex - Public key in hex format
 * @param {string} signatureHex - Signature in hex format
 * @param {string} messageHex - Message hash in hex format
 * @returns {boolean}
 */
function verifyEd25519Signature(publicKeyHex, signatureHex, messageHex) {
  try {
    const publicKey = Buffer.from(publicKeyHex, "hex");
    const signature = Buffer.from(signatureHex, "hex");
    const message = Buffer.from(messageHex, "hex");

    // Validate input sizes
    if (publicKey.length !== 32) {
      console.error(
        "Invalid public key length:",
        publicKey.length,
        "expected 32"
      );
      return false;
    }
    if (signature.length !== 64) {
      console.error(
        "Invalid signature length:",
        signature.length,
        "expected 64"
      );
      return false;
    }

    return ed25519.verify(signature, message, publicKey);
  } catch (error) {
    console.error("Ed25519 verification error:", error);
    return false;
  }
}

/**
 * Verify COSE_Sign1 signature (for CIP-0008/CIP-0030 witness algorithms)
 * Based on cardano-signer's verifyCIP8 function
 * @param {string} coseSign1Hex - COSE_Sign1 signature in hex format
 * @param {string} coseKeyHex - COSE_Key in hex format
 * @param {string} dataHex - Data to verify against in hex format
 * @returns {boolean}
 */
function verifyCOSESignature(coseSign1Hex, coseKeyHex, dataHex) {
  try {
    // Decode COSE_Key structure
    const coseKeyStructure = cbor.decode(Buffer.from(coseKeyHex, "hex"));

    // Validate COSE_Key structure
    if (!(coseKeyStructure instanceof Map) || coseKeyStructure.size < 4) {
      throw new Error(
        "COSE_Key is not valid. It must be a map with at least 4 entries"
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

    // Decode COSE_Sign1 structure
    const coseSign1Structure = cbor.decode(Buffer.from(coseSign1Hex, "hex"));

    if (!Array.isArray(coseSign1Structure) || coseSign1Structure.length !== 4) {
      throw new Error(
        "COSE_Sign1 is not a valid signature. It must be an array with 4 entries"
      );
    }

    // Extract protected header
    const protectedHeaderBuffer = coseSign1Structure[0];
    if (!Buffer.isBuffer(protectedHeaderBuffer)) {
      throw new Error("Protected header is not a bytearray (serialized) cbor");
    }

    const protectedHeader = cbor.decode(protectedHeaderBuffer);
    if (!protectedHeader.has(1)) {
      throw new Error("Protected header map key '1' is missing");
    }
    if (protectedHeader.get(1) !== -8) {
      throw new Error("Protected header map key '1' (alg) is not '-8' (EdDSA)");
    }

    // Extract signature
    const signatureBuffer = coseSign1Structure[3];
    if (!Buffer.isBuffer(signatureBuffer)) {
      throw new Error("Signature is not a bytearray");
    }
    const signatureHex = signatureBuffer.toString("hex");

    // Build Sig_structure for verification (following COSE standard)
    const protectedHeaderHex = protectedHeaderBuffer.toString("hex");
    const sigStructure = [
      "Signature1",
      Buffer.from(protectedHeaderHex, "hex"),
      Buffer.from(""), // empty external_aad
      Buffer.from(dataHex, "hex"),
    ];

    const sigStructureHex = cbor.encode(sigStructure).toString("hex");

    // Verify using Ed25519
    return verifyEd25519Signature(pubKey, signatureHex, sigStructureHex);
  } catch (error) {
    console.error("COSE signature verification error:", error);
    return false;
  }
}

/**
 * Verify a single author's signature
 * @param {Object} author - Author object from metadata
 * @param {string} canonizedHash - Canonized data hash
 * @returns {Object} - Verification result with author details
 */
function verifyAuthorSignature(author, canonizedHash) {
  const result = {
    name: author.name || "Unknown",
    publicKey: null,
    witnessAlgorithm: null,
    signature: null,
    valid: false,
    error: null,
  };

  try {
    if (!author.witness) {
      throw new Error("Missing witness object");
    }

    if (!author.witness.witnessAlgorithm) {
      throw new Error("Missing witnessAlgorithm in witness");
    }

    if (!author.witness.publicKey) {
      throw new Error("Missing publicKey in witness");
    }

    if (!author.witness.signature) {
      throw new Error("Missing signature in witness");
    }

    result.witnessAlgorithm = author.witness.witnessAlgorithm;
    result.publicKey = author.witness.publicKey;
    result.signature = author.witness.signature;

    // Verify signature based on witness algorithm
    switch (author.witness.witnessAlgorithm) {
      case "ed25519":
        result.valid = verifyEd25519Signature(
          author.witness.publicKey,
          author.witness.signature,
          canonizedHash
        );
        break;

      case "CIP-0008":
      case "CIP-0030":
        // For CIP-0008/CIP-0030, construct COSE_Key with standard parameters
        const coseKeyHex = `a4010103272006215820${author.witness.publicKey}`;
        result.valid = verifyCOSESignature(
          author.witness.signature,
          coseKeyHex,
          canonizedHash
        );
        break;

      default:
        throw new Error(
          `Unsupported witnessAlgorithm: ${author.witness.witnessAlgorithm}`
        );
    }
  } catch (error) {
    result.error = error.message;
    result.valid = false;
  }

  return result;
}

/**
 * Main CIP-100 verification function
 * @param {Object|string} metadata - JSON-LD governance metadata object or JSON string
 * @returns {Promise<Object>} - Verification result
 */
export async function verifyCIP100Metadata(metadata) {
  const result = {
    workMode: "verify-cip100",
    result: false,
    errorMsg: "",
    authors: [],
    canonizedHash: null,
    body: null,
  };

  try {
    // Parse metadata if string
    let parsedMetadata;
    if (typeof metadata === "string") {
      try {
        parsedMetadata = JSON.parse(metadata);
      } catch (error) {
        throw new Error(`Invalid JSON: ${error.message}`);
      }
    } else {
      parsedMetadata = metadata;
    }

    // Validate required fields
    if (!parsedMetadata["@context"]) {
      throw new Error("Missing @context field in metadata");
    }

    if (!parsedMetadata.hasOwnProperty("authors")) {
      throw new Error("Authors array not found in metadata");
    }

    if (!Array.isArray(parsedMetadata.authors)) {
      throw new Error("Authors field must be an array");
    }

    if (parsedMetadata.authors.length === 0) {
      throw new Error(
        "Authors array is empty - at least one author is required"
      );
    }

    if (!parsedMetadata.body) {
      throw new Error("Missing body field in metadata");
    }

    // Store body for result
    result.body = parsedMetadata.body;

    // Canonize and hash the data
    const { canonized, hash } = await canonizeGovernanceData(parsedMetadata);
    result.canonizedHash = hash;

    // Verify each author's signature
    let allAuthorsValid = true;
    const authorResults = [];

    for (const author of parsedMetadata.authors) {
      const authorResult = verifyAuthorSignature(author, hash);
      authorResults.push(authorResult);

      if (!authorResult.valid) {
        allAuthorsValid = false;
        if (authorResult.error) {
          result.errorMsg += `Author '${authorResult.name}': ${authorResult.error}. `;
        }
      }
    }

    result.authors = authorResults;
    result.result = allAuthorsValid && authorResults.length > 0;

    if (result.result) {
      result.errorMsg = "";
    } else if (!result.errorMsg) {
      result.errorMsg = "Author signature verification failed";
    }
  } catch (error) {
    result.result = false;
    result.errorMsg = error.message;
  }

  return result;
}
