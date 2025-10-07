import { verifyCIP100Metadata } from "../../../lib/cip100-verification.js";
import { NextResponse } from "next/server";
import { isPrivateIp, checkJsonComplexity } from "../../../lib/security.js";
import { lookup } from "dns/promises";
import { checkRateLimit } from "../../../lib/rate-limiter.js";

async function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return { valid: false, error: "Only HTTPS URLs are allowed" };
    }

    const hostname = url.hostname.toLowerCase();

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      if (process.env.NODE_ENV !== "development") {
        return { valid: false, error: "Localhost URLs are not allowed" };
      }
      return { valid: true };
    }

    const blockedHosts = ["metadata.google.internal", "metadata"];
    if (blockedHosts.includes(hostname)) {
      return {
        valid: false,
        error: "This hostname is blocked for security reasons",
      };
    }

    try {
      const addresses = await lookup(hostname, { all: true });

      for (const addr of addresses) {
        const ipCheck = isPrivateIp(addr.address);
        if (!ipCheck.valid) {
          return {
            valid: false,
            error: `Hostname resolves to blocked IP: ${ipCheck.error}`,
          };
        }
      }
    } catch (dnsError) {
      return {
        valid: false,
        error: `DNS lookup failed: ${dnsError.message}`,
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Invalid URL format" };
  }
}

export async function GET(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const { success, limit, remaining, reset } = checkRateLimit(ip);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Rate limit exceeded. Please try again later. Maximum 20 requests per minute.",
          rateLimit: {
            limit,
            remaining,
            reset: new Date(reset).toISOString(),
          },
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const metadataUrl = searchParams.get("url");

    if (!metadataUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: url",
          usage: {
            description: "Verify CIP-100 governance metadata from a URL",
            endpoint: "/api/verify-cip100?url=<metadata-url>",
            example:
              "/api/verify-cip100?url=https://ipfs.io/ipfs/bafkreihk5qt5tgbojnno7eymbm2urm6y6jkt4yqfxdzh3agnj47zuv7lpe",
          },
        },
        { status: 400 }
      );
    }

    let metadata;
    let sourceUrl;

    if (metadataUrl) {
      const decodedUrl = decodeURIComponent(metadataUrl);

      const urlValidation = await isValidUrl(decodedUrl);
      if (!urlValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: urlValidation.error,
            url: metadataUrl,
          },
          { status: 400 }
        );
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(decodedUrl, {
          signal: controller.signal,
          headers: {
            Accept: "application/json, application/ld+json",
            "User-Agent": "Cardano-Verification-Tool/1.0",
          },
          redirect: "manual",
        });

        clearTimeout(timeoutId);

        if (response.status >= 300 && response.status < 400) {
          return NextResponse.json(
            {
              success: false,
              error: "URL redirects are not allowed for security reasons",
              url: metadataUrl,
            },
            { status: 400 }
          );
        }

        if (!response.ok) {
          return NextResponse.json(
            {
              success: false,
              error: `Failed to fetch metadata: ${response.status} ${response.statusText}`,
              url: metadataUrl,
            },
            { status: 400 }
          );
        }

        const contentLength = response.headers.get("content-length");
        const maxSize = 5 * 1024 * 1024;
        if (contentLength && parseInt(contentLength) > maxSize) {
          return NextResponse.json(
            {
              success: false,
              error: `Metadata file too large: ${contentLength} bytes (max ${maxSize} bytes)`,
              url: metadataUrl,
            },
            { status: 413 }
          );
        }

        const contentType = response.headers.get("content-type") || "";

        try {
          metadata = await response.json();
        } catch (parseError) {
          return NextResponse.json(
            {
              success: false,
              error: "URL did not return valid JSON",
              receivedContentType: contentType,
              url: metadataUrl,
              parseError: parseError.message,
            },
            { status: 400 }
          );
        }
        sourceUrl = metadataUrl;
      } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError.name === "AbortError") {
          return NextResponse.json(
            {
              success: false,
              error: "Request timeout: URL took too long to respond (max 10s)",
              url: metadataUrl,
            },
            { status: 504 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            error: `Failed to fetch metadata: ${fetchError.message}`,
            url: metadataUrl,
          },
          { status: 400 }
        );
      }
    }

    if (!metadata || typeof metadata !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid metadata: Expected JSON object",
          receivedType: typeof metadata,
        },
        { status: 400 }
      );
    }

    if (!metadata["@context"]) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid CIP-100 metadata: Missing @context field",
          hint: "This does not appear to be valid CIP-100 JSON-LD governance metadata",
        },
        { status: 400 }
      );
    }

    const complexityCheck = checkJsonComplexity(metadata);
    if (!complexityCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: `Metadata too complex: ${complexityCheck.error}`,
        },
        { status: 400 }
      );
    }

    const results = await verifyCIP100Metadata(metadata);

    return NextResponse.json({
      success: true,
      data: results,
      metadata: {
        sourceUrl: sourceUrl,
        fetchedAt: new Date().toISOString(),
        title: metadata.body?.title || "Untitled Proposal",
      },
    });
  } catch (error) {
    console.error("CIP-100 Verification Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        type: error.name,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const { success, limit, remaining, reset } = checkRateLimit(ip);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Rate limit exceeded. Please try again later. Maximum 20 requests per minute.",
          rateLimit: {
            limit,
            remaining,
            reset: new Date(reset).toISOString(),
          },
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const contentLength = request.headers.get("content-length");
    const maxSize = 5 * 1024 * 1024;

    if (contentLength && parseInt(contentLength) > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `Request body too large: ${contentLength} bytes (max ${maxSize} bytes)`,
        },
        { status: 413 }
      );
    }

    const text = await request.text();
    if (text.length > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `Request body too large (max ${maxSize} bytes)`,
        },
        { status: 413 }
      );
    }

    const { metadata } = JSON.parse(text);

    if (!metadata) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing metadata parameter",
        },
        { status: 400 }
      );
    }

    if (typeof metadata !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body: Expected JSON object",
        },
        { status: 400 }
      );
    }

    if (!metadata["@context"]) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid CIP-100 metadata: Missing @context field",
        },
        { status: 400 }
      );
    }

    const complexityCheck = checkJsonComplexity(metadata);
    if (!complexityCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: `Metadata too complex: ${complexityCheck.error}`,
        },
        { status: 400 }
      );
    }

    const verificationResult = await verifyCIP100Metadata(metadata);

    return NextResponse.json({
      success: true,
      data: verificationResult,
      metadata: {
        submittedAt: new Date().toISOString(),
        title: metadata.body?.title || "Untitled Proposal",
      },
    });
  } catch (error) {
    console.error("CIP-100 verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
