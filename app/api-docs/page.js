"use client";

import { Navigation } from "../../components/Navigation";
import PoweredBy from "../../components/PoweredBy";
import { useState } from "react";

function ApiEndpoint({
  method,
  path,
  summary,
  description,
  parameters,
  requestBody,
  responses,
  examples,
  children,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("response");

  const methodColors = {
    GET: "bg-blue-500 text-white",
    POST: "bg-green-600 text-white",
    PUT: "bg-orange-500 text-white",
    DELETE: "bg-red-600 text-white",
  };

  return (
    <div className="border border-gray-300 rounded-lg mb-4 overflow-hidden shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded font-bold text-sm ${methodColors[method]}`}
          >
            {method}
          </span>
          <span className="font-mono text-gray-800 font-medium">{path}</span>
          <span className="text-gray-600 text-sm hidden md:block">
            {summary}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-300 bg-gray-50">
          <div className="p-6">
            {description && <p className="text-gray-700 mb-6">{description}</p>}

            {parameters && parameters.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Parameters</h4>
                <div className="bg-white border border-gray-300 rounded overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="text-left p-3 font-semibold">Name</th>
                        <th className="text-left p-3 font-semibold">Type</th>
                        <th className="text-left p-3 font-semibold">
                          Required
                        </th>
                        <th className="text-left p-3 font-semibold">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {parameters.map((param, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <td className="p-3 font-mono text-blue-700">
                            {param.name}
                          </td>
                          <td className="p-3 text-gray-600">{param.type}</td>
                          <td className="p-3">
                            {param.required ? (
                              <span className="text-red-600 font-semibold">
                                required
                              </span>
                            ) : (
                              <span className="text-gray-500">optional</span>
                            )}
                          </td>
                          <td className="p-3 text-gray-700">
                            {param.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {requestBody && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Request Body
                </h4>
                <div className="bg-gray-900 rounded p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">
                    {requestBody}
                  </pre>
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="flex border-b border-gray-300">
                <button
                  onClick={() => setActiveTab("response")}
                  className={`px-4 py-2 font-semibold text-sm ${
                    activeTab === "response"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Responses
                </button>
                {examples && (
                  <button
                    onClick={() => setActiveTab("example")}
                    className={`px-4 py-2 font-semibold text-sm ${
                      activeTab === "example"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Examples
                  </button>
                )}
              </div>
            </div>

            {activeTab === "response" && responses && (
              <div className="space-y-4">
                {Object.entries(responses).map(([code, response]) => (
                  <div
                    key={code}
                    className="border border-gray-300 rounded overflow-hidden"
                  >
                    <div
                      className={`px-4 py-2 font-semibold flex items-center gap-2 ${
                        code.startsWith("2")
                          ? "bg-green-50 text-green-800"
                          : code.startsWith("4")
                          ? "bg-yellow-50 text-yellow-800"
                          : "bg-red-50 text-red-800"
                      }`}
                    >
                      <span className="font-mono">{code}</span>
                      <span>{response.description}</span>
                    </div>
                    {response.example && (
                      <div className="p-4 bg-gray-900">
                        <pre className="text-green-400 text-xs font-mono overflow-x-auto">
                          {JSON.stringify(response.example, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "example" && examples && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">cURL</h4>
                  <div className="bg-gray-900 rounded p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm font-mono">
                      {examples.curl}
                    </pre>
                  </div>
                </div>
                {examples.javascript && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      JavaScript
                    </h4>
                    <div className="bg-gray-900 rounded p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm font-mono">
                        {examples.javascript}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cf-blue-50 via-white to-cf-blue-100">
      <Navigation />

      <div className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              API Endpoints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <a
                href="#cip100-get"
                className="flex items-center gap-2 p-3 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-bold">
                  GET
                </span>
                <span className="text-sm font-mono text-gray-700">
                  /api/verify-cip100
                </span>
              </a>
              <a
                href="#cip100-post"
                className="flex items-center gap-2 p-3 border border-gray-300 rounded hover:border-green-600 hover:bg-green-50 transition-colors"
              >
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-bold">
                  POST
                </span>
                <span className="text-sm font-mono text-gray-700">
                  /api/verify-cip100
                </span>
              </a>
              <a
                href="#cip8-get"
                className="flex items-center gap-2 p-3 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-bold">
                  GET
                </span>
                <span className="text-sm font-mono text-gray-700">
                  /api/verify
                </span>
              </a>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              CIP-100 Governance Metadata
            </h2>

            <div id="cip100-get">
              <ApiEndpoint
                method="GET"
                path="/api/verify-cip100"
                summary="Verify governance metadata from URL"
                description="Fetch and verify CIP-100 governance metadata from a publicly accessible URL (IPFS gateway, GitHub, etc.). Performs JSON-LD canonicalization and cryptographic signature verification for all authors."
                parameters={[
                  {
                    name: "url",
                    type: "string (URL)",
                    required: true,
                    description:
                      "Metadata URL (must be HTTPS, returns JSON/JSON-LD). URL-encode if it contains special characters like &, ?, #, or spaces",
                  },
                ]}
                responses={{
                  200: {
                    description: "Success - Metadata verified",
                    example: {
                      success: true,
                      data: {
                        result: true,
                        workMode: "verify-cip100",
                        authors: [
                          {
                            name: "Snek Foundation",
                            valid: true,
                            witnessAlgorithm: "CIP-0008",
                            publicKey:
                              "3862f79dfe88a8b921c36b242d4359d7d535332e47437ffe2cca06703c4414eb",
                          },
                        ],
                        canonizedHash:
                          "5e54228449f56f5ed7746f082fc2c42caf486c3c3ef5aab25e384735997d57fc",
                      },
                      metadata: {
                        sourceUrl: "https://ipfs.io/ipfs/bafkrei...",
                        fetchedAt: "2025-10-06T16:30:00.000Z",
                        title:
                          "Budget: ₳5M Loan for Cardano's Global Listing Expansion",
                      },
                    },
                  },
                  400: {
                    description:
                      "Bad Request - Invalid URL or blocked for security",
                    example: {
                      success: false,
                      error: "Private IP addresses are not allowed",
                      url: "http://192.168.1.1/metadata.json",
                    },
                  },
                  504: {
                    description:
                      "Gateway Timeout - Request took longer than 10 seconds",
                    example: {
                      success: false,
                      error:
                        "Request timeout: URL took too long to respond (max 10s)",
                    },
                  },
                }}
                examples={{
                  curl: `# Simple IPFS URL (no special characters - encoding optional)
curl "https://verifycardanomessage.cardanofoundation.org/api/verify-cip100?url=https://ipfs.io/ipfs/bafkreiegpigegytetkwrqhftqphcqjkammmjipwq2d57s6xkfbtxiq3tei"

# URL with query parameters - encoding REQUIRED
curl "https://verifycardanomessage.cardanofoundation.org/api/verify-cip100?url=https%3A%2F%2Fexample.com%2Fdata%3Fversion%3D1%26format%3Djson"`,
                  javascript: `// Best practice: Always encode to handle any URL format
const metadataUrl = 'https://ipfs.io/ipfs/bafkrei...';

const response = await fetch(
  \`https://verifycardanomessage.cardanofoundation.org/api/verify-cip100?url=\${encodeURIComponent(metadataUrl)}\`
);
const result = await response.json();

if (result.success) {
  console.log('Valid signatures:', result.data.authors.filter(a => a.valid).length);
}`,
                }}
              ></ApiEndpoint>
            </div>

            <div id="cip100-post">
              <ApiEndpoint
                method="POST"
                path="/api/verify-cip100"
                summary="Verify governance metadata from JSON body"
                description="Submit CIP-100 governance metadata directly as JSON in the request body."
                requestBody={`{
  "metadata": {
    "@context": {
      "@language": "en",
      "CIP100": "https://github.com/cardano-foundation/CIPs/...",
      "hashAlgorithm": "CIP100:hashAlgorithm",
      "body": { "@id": "CIP100:body" }
    },
    "hashAlgorithm": "blake2b-256",
    "body": {
      "title": "My Governance Proposal",
      "abstract": "Proposal description..."
    },
    "authors": [...]
  }
}`}
                responses={{
                  200: {
                    description: "Success - Metadata verified",
                    example: {
                      success: true,
                      data: {
                        result: true,
                        workMode: "verify-cip100",
                        authors: [{ name: "Author", valid: true }],
                      },
                    },
                  },
                  400: {
                    description: "Bad Request - Invalid JSON structure",
                    example: {
                      success: false,
                      error: "Invalid CIP-100 metadata: Missing @context field",
                    },
                  },
                }}
                examples={{
                  curl: `curl -X POST "https://verifycardanomessage.cardanofoundation.org/api/verify-cip100" \\
  -H "Content-Type: application/json" \\
  -d '{"metadata": {...}}'`,
                  javascript: `const response = await fetch(
  'https://verifycardanomessage.cardanofoundation.org/api/verify-cip100',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metadata })
  }
);`,
                }}
              />
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              CIP-8 / CIP-30 Signature Verification
            </h2>

            <div id="cip8-get">
              <ApiEndpoint
                method="GET"
                path="/api/verify"
                summary="Verify message signatures"
                description="Automatically detects signature format (raw 64-byte or COSE_Sign1) and verifies against the provided public key and message. Supports both CIP-0008 and CIP-0030 standards."
                parameters={[
                  {
                    name: "publicKey",
                    type: "string (hex)",
                    required: true,
                    description:
                      "Ed25519 public key in hex format (64 characters)",
                  },
                  {
                    name: "message",
                    type: "string",
                    required: true,
                    description:
                      "The message that was signed (URL-encode special characters)",
                  },
                  {
                    name: "signature",
                    type: "string (hex)",
                    required: true,
                    description:
                      "Signature in hex format (128 chars for raw, longer for COSE)",
                  },
                ]}
                responses={{
                  200: {
                    description: "Success - Signature verification completed",
                    example: {
                      isCip8Verified: true,
                      isCip30Verified: false,
                      signatureStandard: "CIP-0008",
                    },
                  },
                  400: {
                    description: "Bad Request - Missing required parameters",
                    example: {
                      error: "Missing required parameters",
                    },
                  },
                }}
                examples={{
                  curl: `curl "https://verifycardanomessage.cardanofoundation.org/api/verify?publicKey=c686abd...&message=Hello&signature=349fdc..."`,
                  javascript: `const params = new URLSearchParams({
  publicKey: 'c686abd...',
  message: 'Hello, Cardano!',
  signature: '349fdc...'
});

const response = await fetch(
  \`https://verifycardanomessage.cardanofoundation.org/api/verify?\${params}\`
);`,
                }}
              >
                <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Signature Format Detection
                  </h4>
                  <ul className="text-sm text-green-900 space-y-1 ml-4 list-disc list-inside">
                    <li>
                      <strong>Raw (CIP-0008):</strong> 128 hex characters (64
                      bytes)
                    </li>
                    <li>
                      <strong>COSE (CIP-0030):</strong> Starts with "84" and
                      CBOR-decodable
                    </li>
                  </ul>
                </div>
              </ApiEndpoint>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resources & Support
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Documentation
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://cips.cardano.org/cips/cip8/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      CIP-0008: Message Signing →
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cips.cardano.org/cips/cip30/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      CIP-0030: dApp-Wallet Bridge →
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cips.cardano.org/cips/cip100/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      CIP-0100: Governance Metadata →
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://github.com/cardano-foundation/verify-cardano-message-fe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      GitHub Repository →
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/cardano-foundation/verify-cardano-message-fe/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Report Issues →
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
}
