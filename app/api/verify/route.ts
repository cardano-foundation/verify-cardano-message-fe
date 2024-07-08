import { NextResponse } from "next/server";
import {
  Ed25519Signature,
  PublicKey,
} from "@emurgo/cardano-serialization-lib-asmjs";
import verifyDataSignature from "@cardano-foundation/cardano-verify-datasignature";
import { Buffer } from "buffer";

export async function GET(request) {
  const url = new URL(request.url);
  const { searchParams } = url;

  const publicKey = searchParams.get("publicKey");
  const message = searchParams.get("message");
  const signature = searchParams.get("signature");

  let isCip8Verified = false;
  let isCip30Verified = false;

  let error: { cip8: string; cip30: string } = { cip8: "", cip30: "" };

  // Verify if it's CIP-8
  try {
    const publicKeyBytes = PublicKey.from_bytes(Buffer.from(publicKey, "hex"));
    const signatureBytes = Ed25519Signature.from_bytes(
      Buffer.from(signature, "hex")
    );
    const messageBytes = Buffer.from(message);
    console.log(`Bytes converted successfully`);

    const isValid = publicKeyBytes.verify(messageBytes, signatureBytes);
    console.log(`Verification result: ${isValid}`);
    isCip8Verified = isValid;
  } catch (err) {
    console.error(`Verification failed at CIP-8: ${err}`);
    error.cip8 = err instanceof Error ? err.message : String(err);
  }

  // Verify if it's CIP-30
  try {
    const isValid = await verifyDataSignature(signature, publicKey, message);
    console.log(`Verification result: ${isValid}`);
    isCip30Verified = isValid;
  } catch (err) {
    console.error(`Verification failed at CIP-30: ${err}`);
    error.cip30 = err instanceof Error ? err.message : String(err);
  }

  // Return Result to the client
  return NextResponse.json({
    isCip8Verified,
    isCip30Verified,
    error,
  });
}
