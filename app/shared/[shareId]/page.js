"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PoweredBy from "../../../components/PoweredBy";
import { Navigation } from "../../../components/Navigation";

export default function SharedResult() {
  const { shareId } = useParams();
  const [sharedData, setSharedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedResult = async () => {
      try {
        const response = await fetch(`/api/share?id=${shareId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Shared result not found or has expired");
          }
          throw new Error("Failed to load shared result");
        }

        const data = await response.json();
        setSharedData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (shareId) {
      fetchSharedResult();
    }
  }, [shareId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cf-blue-50 via-white to-cf-blue-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cf-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading shared result...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cf-blue-50 via-white to-cf-blue-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Share Not Found
              </h1>
              <p className="text-gray-600 mb-8">{error}</p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-cf-blue-500 text-white rounded-lg hover:bg-cf-blue-600 transition-colors"
              >
                Go to Verification Tool
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { result, data, type } = sharedData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cf-blue-50 via-white to-cf-blue-100">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cf-blue-900 mb-2">
              Shared Verification Result
            </h1>
            <p className="text-gray-600">
              {type === "cip100"
                ? "CIP-100 Governance Metadata"
                : "CIP-8/30 Message"}{" "}
              Verification
            </p>
          </div>

          {type === "cip100" ? (
            <CIP100SharedResult result={result} data={data} />
          ) : (
            <CIP8SharedResult result={result} data={data} />
          )}

          <div className="text-center mt-8">
            <a
              href={type === "cip100" ? "/method=cip100" : "/"}
              className="inline-flex items-center px-4 py-2 bg-cf-blue-500 text-white rounded-lg hover:bg-cf-blue-600 transition-colors"
            >
              Try Your Own Verification
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
}

function CIP8SharedResult({ result, data }) {
  return (
    <div className="backdrop-blur-sm bg-white/80 border border-cf-blue-200 rounded-xl shadow-xl p-8">
      <div className="mb-6">
        <div
          className={`backdrop-filter backdrop-blur-sm backdrop-saturate-150 border ${
            result.cip8Status || result.cip30Status
              ? "border-green-400 bg-green-700/90"
              : "border-red-400 bg-red-800/90"
          } px-4 py-3 rounded-lg shadow-lg`}
        >
          <div className="flex justify-center items-center">
            <span className="flex items-center text-sm font-semibold text-white">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  result.cip8Status || result.cip30Status
                    ? "bg-green-300"
                    : "bg-red-300"
                }`}
              ></span>
              Result:{" "}
              {result.cip8Status || result.cip30Status ? "VALID" : "INVALID"}
              {result.cip8Status && " (CIP-0008)"}
              {result.cip30Status && !result.cip8Status && " (CIP-0030)"}
            </span>
          </div>
          {result.isPrefixAppended && (
            <div className="text-center text-white/90 text-xs mt-1">
              Prefix automatically applied
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cf-blue-800 mb-1">
            Public Key
          </label>
          <div className="bg-gray-50 p-3 rounded-md font-mono text-sm break-all">
            {data.publicKey}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-cf-blue-800 mb-1">
            Message/Hash
          </label>
          <div className="bg-gray-50 p-3 rounded-md font-mono text-sm break-all">
            {data.message}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-cf-blue-800 mb-1">
            Signature
          </label>
          <div className="bg-gray-50 p-3 rounded-md font-mono text-sm break-all">
            {data.signature}
          </div>
        </div>
      </div>
    </div>
  );
}

function CIP100SharedResult({ result, data }) {
  return (
    <div className="backdrop-blur-sm bg-white/80 border border-cf-blue-200 rounded-xl shadow-xl p-8">
      <div className="mb-6">
        <div
          className={`backdrop-filter backdrop-blur-sm backdrop-saturate-150 border ${
            result.result
              ? "border-green-400 bg-green-700/90"
              : "border-red-400 bg-red-800/90"
          } px-4 py-3 rounded-lg shadow-lg`}
        >
          <div className="flex justify-center items-center">
            <span className="flex items-center text-lg font-semibold text-white">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  result.result ? "bg-green-300" : "bg-red-300"
                }`}
              ></span>
              Overall Result: {result.result ? "VALID" : "INVALID"}
            </span>
          </div>
          {result.errorMsg && (
            <div className="text-center text-white/90 text-sm mt-2">
              {result.errorMsg}
            </div>
          )}
        </div>
      </div>

      {result.canonizedHash && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Canonized Hash
          </h3>
          <div className="bg-gray-50 p-3 rounded-md font-mono text-sm break-all">
            {result.canonizedHash}
          </div>
        </div>
      )}

      {result.authors && result.authors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Author Verification Results
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {result.authors.map((author, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  author.valid
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {author.name}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Algorithm:</span>{" "}
                        {author.witnessAlgorithm}
                      </p>
                      <p>
                        <span className="font-medium">Public Key:</span>
                        <span className="font-mono break-all text-xs ml-1">
                          {author.publicKey}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      author.valid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {author.valid ? "VALID" : "INVALID"}
                  </div>
                </div>

                {author.error && (
                  <div className="mt-3 p-2 bg-red-100 rounded-md">
                    <p className="text-red-700 text-sm">{author.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
