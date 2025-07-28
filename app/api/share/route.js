import { NextResponse } from "next/server";

// Simple in-memory store for demo - in production use Redis/DB
const shareStore = new Map();

export async function POST(request) {
  try {
    const { result, data, type } = await request.json();

    // Generate a unique share ID
    const shareId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Store the result data
    shareStore.set(shareId, {
      result,
      data,
      type,
      timestamp: Date.now(),
    });

    // Clean up old entries (older than 24 hours)
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (const [id, entry] of shareStore.entries()) {
      if (entry.timestamp < dayAgo) {
        shareStore.delete(id);
      }
    }

    return NextResponse.json({ shareId });
  } catch (error) {
    console.error("Share creation error:", error);
    return NextResponse.json(
      { error: "Failed to create share" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("id");

    if (!shareId) {
      return NextResponse.json({ error: "Share ID required" }, { status: 400 });
    }

    const shareData = shareStore.get(shareId);

    if (!shareData) {
      return NextResponse.json(
        { error: "Share not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json(shareData);
  } catch (error) {
    console.error("Share retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve share" },
      { status: 500 }
    );
  }
}
