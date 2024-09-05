import { NextResponse } from "next/server";
import {
  Ed25519Signature,
  PublicKey,
} from "@emurgo/cardano-serialization-lib-asmjs";
import verifyDataSignature from "@cardano-foundation/cardano-verify-datasignature";
import { Buffer } from "buffer";

function appendCborPrefix(publicKey: string) {
  return `a401010327200621${publicKey}`;
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

  let error: { cip8: string; cip30: string } = { cip8: "", cip30: "" };

  // Verify if it's CIP-8
  try {
    const publicKeyBytes = PublicKey.from_bytes(Buffer.from(publicKey, "hex"));
    const signatureBytes = Ed25519Signature.from_bytes(
      Buffer.from(signature, "hex")
    );
    const messageBytes = Buffer.from(message);

    // Try initial verification without prefix
    isCip8Verified = publicKeyBytes.verify(messageBytes, signatureBytes);
  } catch (err) {
    // First verification failed, try with CBOR prefix
    try {
      const cborPublicKeyBytes = PublicKey.from_bytes(Buffer.from(appendCborPrefix(publicKey), "hex"));
      const signatureBytes = Ed25519Signature.from_bytes(Buffer.from(signature, "hex"));
      const messageBytes = Buffer.from(message);

      isCip8Verified = cborPublicKeyBytes.verify(messageBytes, signatureBytes);
      isPrefixAppended = true;
    } catch (innerErr) {
      console.error(`Verification failed at CIP-8: ${innerErr}`);
      error.cip8 = innerErr instanceof Error ? innerErr.message : String(innerErr);
    }
  }

  // Verify if it's CIP-30
  try {
    // Try initial verification without prefix
    isCip30Verified = await verifyDataSignature(signature, publicKey, message);
  } catch (err) {
    // First verification failed, try with CBOR prefix
    try {
      const cborPublicKey = appendCborPrefix(publicKey);
      isCip30Verified = await verifyDataSignature(signature, cborPublicKey, message);
      isPrefixAppended = true;
    } catch (innerErr) {
      console.error(`Verification failed at CIP-30: ${innerErr}`);
      error.cip30 = innerErr instanceof Error ? innerErr.message : String(innerErr);
    }
  }

  return NextResponse.json({
    isCip8Verified,
    isCip30Verified,
    isPrefixAppended,
    error,
  });
}
