"use client";

import { useState, useEffect } from "react";
import PoweredBy from "../../components/PoweredBy";
import { Navigation } from "../../components/Navigation";
import ResetIcon from "../../components/ResetIcon";
import ShareButton from "../../components/ShareButton";
import { cip100Example } from "../../data/cip0100example.js";

export default function CIP100Verification() {
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [originalJsonData, setOriginalJsonData] = useState(null);

  // Parse URL parameters on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      // Check for direct rawjson parameter for testing
      const rawJson = urlParams.get("rawjson");
      if (rawJson) {
        try {
          const decodedJson = decodeURIComponent(rawJson);
          const parsedJson = JSON.parse(decodedJson);
          setJsonInput(JSON.stringify(parsedJson, null, 2));
        } catch (err) {
          console.error("Failed to parse rawjson parameter:", err);
          setError("Failed to parse JSON from rawjson parameter");
        }
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      let metadata;
      try {
        metadata = JSON.parse(jsonInput);
        setOriginalJsonData(metadata);
      } catch (err) {
        throw new Error("Invalid JSON format");
      }

      const response = await fetch("/api/verify-cip100", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ metadata }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
      setOriginalJsonData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = () => {
    setJsonInput(JSON.stringify(cip100Example, null, 2));
    setError("");
    setResult(null);
  };

  const formatJsonInput = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setError("Invalid JSON - cannot format");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cf-blue-50 via-white to-cf-blue-100">
      <Navigation />

      <div className="px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="backdrop-blur-sm bg-white/80 border border-cf-blue-200 rounded-xl shadow-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cf-blue-400 via-cf-blue-500 to-cf-blue-400"></div>

                <div className="p-8">
                  <h1 className="text-3xl font-bold text-cf-blue-900 mb-6 text-center tracking-tight">
                    CIP-100 Governance Metadata Verification
                  </h1>

                  <div className="mb-6">
                    {result === null ? (
                      <div className="border border-cf-blue-200 bg-cf-blue-50/80 px-5 py-3 rounded-lg shadow-sm text-center">
                        <div className="flex items-center justify-center">
                          <span className="text-cf-blue-700">
                            Paste governance metadata JSON and verify signatures
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`backdrop-filter backdrop-blur-sm backdrop-saturate-150 border ${
                          result.result ? "border-green-400" : "border-red-400"
                        } ${
                          result.result ? "bg-green-700/90" : "bg-red-800/90"
                        } px-5 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform`}
                      >
                        <div className="flex justify-center items-center">
                          <span className="flex items-center text-lg font-semibold text-white transition-all duration-300">
                            <span
                              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                result.result ? "bg-green-300" : "bg-red-300"
                              }`}
                            ></span>
                            Overall Result:{" "}
                            {result.result ? "VALID" : "INVALID"}
                          </span>
                        </div>
                        {result.errorMsg && (
                          <div className="text-center text-white/90 text-sm mt-2">
                            {result.errorMsg}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <span className="text-lg font-semibold text-gray-700">
                            JSON-LD Governance Metadata
                          </span>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={loadExample}
                              className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                            >
                              Load Example
                            </button>

                            <button
                              type="button"
                              onClick={formatJsonInput}
                              className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              Format JSON
                            </button>
                          </div>
                        </div>{" "}
                        <textarea
                          id="jsonInput"
                          value={jsonInput}
                          onChange={(e) => setJsonInput(e.target.value)}
                          placeholder="Paste your CIP-100 governance metadata JSON here..."
                          rows={12}
                          className="bg-gray-50 border-cf-blue-300 focus:border-cf-blue-500 focus:ring-cf-blue-400 text-sm w-full p-4 border rounded-lg font-mono resize-y focus:ring-2 transition-colors"
                          required
                        />
                        {error && (
                          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                            <div className="flex justify-between items-center">
                              <div className="text-red-700 flex-1">{error}</div>
                              {originalJsonData && (
                                <ShareButton
                                  data={originalJsonData}
                                  result={result}
                                  type="cip100"
                                  className="text-red-700 bg-red-100 hover:bg-red-200 border-red-300 shrink-0 ml-4"
                                />
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-4 pt-2">
                          <button
                            type="submit"
                            disabled={isLoading || !jsonInput.trim()}
                            className="font-semibold flex-1 text-white h-12 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cf-blue-300 focus:ring-offset-2 bg-cf-blue-500 hover:bg-cf-blue-400 disabled:bg-cf-blue-500/40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] border border-cf-blue-600"
                          >
                            {isLoading
                              ? "Verifying..."
                              : "Verify Governance Metadata"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setJsonInput("");
                              setResult(null);
                              setError("");
                            }}
                            className="group bg-cf-blue-500 hover:bg-cf-blue-400 ml-3 rounded-lg h-12 px-3 focus:outline-none focus:ring-2 focus:ring-cf-blue-300 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] border border-cf-blue-600"
                            aria-label="Reset form"
                          >
                            <ResetIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column - Results */}
              <div className="backdrop-blur-sm bg-white/80 border border-cf-blue-200 rounded-xl shadow-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cf-blue-400 via-cf-blue-500 to-cf-blue-400"></div>

                <div className="p-8">
                  {result && result.authors && result.authors.length > 0 ? (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-cf-blue-900">
                          Author Verification Results
                        </h2>
                        {originalJsonData && (
                          <ShareButton
                            data={originalJsonData}
                            result={result}
                            type="cip100"
                            className="shrink-0"
                          />
                        )}
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
                                    <span className="font-medium">
                                      Algorithm:
                                    </span>{" "}
                                    {author.witnessAlgorithm}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Public Key:
                                    </span>
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
                                <p className="text-red-700 text-sm">
                                  {author.error}
                                </p>
                              </div>
                            )}

                            <details className="mt-3">
                              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                                Show signature details
                              </summary>
                              <div className="mt-2 p-2 bg-gray-100 rounded-md">
                                <p className="text-xs font-mono break-all">
                                  {author.signature}
                                </p>
                              </div>
                            </details>
                          </div>
                        ))}
                      </div>

                      {result.body && (
                        <details className="mt-6">
                          <summary className="cursor-pointer text-lg font-semibold text-gray-700 hover:text-gray-900">
                            Show metadata body
                          </summary>
                          <div className="mt-3 bg-gray-50 p-4 rounded-md max-h-64 overflow-y-auto">
                            <pre className="text-sm">
                              {JSON.stringify(result.body, null, 2)}
                            </pre>
                          </div>
                        </details>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center text-gray-500">
                        <div className="text-lg font-medium mb-2">
                          No Results Yet
                        </div>
                        <p className="text-sm">
                          Submit governance metadata to see verification results
                          here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
}
