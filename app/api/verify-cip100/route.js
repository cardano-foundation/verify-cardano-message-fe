import { verifyCIP100Metadata } from "../../../lib/cip100-verification.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { metadata } = await request.json();

    if (!metadata) {
      return NextResponse.json(
        { error: "Missing metadata parameter" },
        { status: 400 }
      );
    }

    const verificationResult = await verifyCIP100Metadata(metadata);

    return NextResponse.json(verificationResult);
  } catch (error) {
    console.error("CIP-100 verification error:", error);
    return NextResponse.json(
      {
        error: "Verification failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
