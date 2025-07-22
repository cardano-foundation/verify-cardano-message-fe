"use client";

import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import PoweredBy from "../components/PoweredBy";
import MessageVerification from "../components/VerificationExample";
import cip0008Data from "../data/cip0008example.json";
import cip0030Data from "../data/cip0030example.json";
import TooltipIcon from "../components/TooltipIcon";
import ResetIcon from "../components/ResetIcon";

const SignatureVerification = () => {
  const [publicKey, setPublicKey] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [cip8Status, setCip8Status] = useState(null);
  const [cip30Status, setCip30Status] = useState(null);
  const [isPrefixAppended, setIsPrefixAppended] = useState(false);
  const [error, setError] = useState({ cip8: "", cip30: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Handle signature verification
  const handleVerifySignature = async () => {
    setIsLoading(true);
    resetStatus();

    try {
      // Encode parameters to handle special characters
      const encodedPublicKey = encodeURIComponent(publicKey);
      const encodedMessage = encodeURIComponent(message);
      const encodedSignature = encodeURIComponent(signature);

      const response = await fetch(
        `/api/verify?publicKey=${encodedPublicKey}&message=${encodedMessage}&signature=${encodedSignature}`
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Verification response:", data);

      setCip8Status(data.isCip8Verified);
      setCip30Status(data.isCip30Verified);
      setIsPrefixAppended(data.isPrefixAppended);

      if (data.error) {
        setError(data.error);
      } else {
        setError({ cip8: "", cip30: "" });
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setCip8Status(false);
      setCip30Status(false);
      setError({
        cip8: `Request error: ${err.message}`,
        cip30: `Request error: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setPublicKey("");
    setMessage("");
    setSignature("");
    resetStatus();
  };

  // Reset statuses when form gets dirty
  const resetStatus = () => {
    setCip8Status(null);
    setCip30Status(null);
    setIsPrefixAppended(false);
    setError({ cip8: "", cip30: "" });
  };

  // 0008 Example Data
  const fillCIP0008Example = () => {
    const { publicKey, message, signature } = cip0008Data[0];
    setPublicKey(publicKey);
    setMessage(message);
    setSignature(signature);
    resetStatus();
  };

  // 0030 Example Data
  const fillCIP0030Example = () => {
    const { publicKey, message, signature } = cip0030Data[0];
    setPublicKey(publicKey);
    setMessage(message);
    setSignature(signature);
    resetStatus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      {/* Navigation */}
      <div className="container mx-auto max-w-6xl mb-8">
        <nav className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
              CIP-8/30 Message Verification
            </div>
            <a
              href="/cip100"
              className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              CIP-100 Governance Verification
            </a>
          </div>
        </nav>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full max-w-2xl backdrop-blur-sm bg-white/80 border border-cf-blue-200 rounded-xl shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cf-blue-400 via-cf-blue-500 to-cf-blue-400"></div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-cf-blue-900 mb-6 text-center tracking-tight">
              Cardano Message Verification
            </h1>
            <div className="flex justify-center mb-6">
              <MessageVerification
                fillCIP0008Example={fillCIP0008Example}
                fillCIP0030Example={fillCIP0030Example}
              />
            </div>
            <div className="mb-6">
              {cip8Status === null || cip30Status === null ? (
                <div className="border border-cf-blue-200 bg-cf-blue-50/80 px-5 py-3 rounded-lg shadow-sm text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-cf-blue-700">
                      Fill in all fields and verify signature
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`backdrop-filter backdrop-blur-sm backdrop-saturate-150 border ${
                    cip8Status || cip30Status
                      ? "border-green-400"
                      : "border-red-400"
                  } ${
                    cip8Status || cip30Status
                      ? "bg-green-700/90"
                      : "bg-red-800/90"
                  } px-5 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform`}
                >
                  <div className="flex justify-center gap-12 items-center">
                    {(cip8Status || !cip30Status) && (
                      <div
                        className={`flex justify-center items-center text-lg font-semibold ${
                          cip8Status ? "text-green-50" : "text-red-50"
                        } transition-all duration-300`}
                      >
                        {cip8Status && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6 text-green-300 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        )}
                        {!cip8Status && (
                          <div className="has-tooltip mr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-6 text-red-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                            <span className="tooltip absolute top-[1.125rem] left-0 bg-gray-800 text-white text-xs rounded py-2 px-3 min-w-[300px] border border-gray-700 shadow-2xl backdrop-blur-sm">
                              Error:{" "}
                              {error && error.cip8
                                ? error.cip8
                                : "Verification failed"}
                            </span>
                          </div>
                        )}
                        <div className="font-medium">CIP-0008</div>
                      </div>
                    )}

                    {(cip30Status || !cip8Status) && (
                      <div
                        className={`flex justify-center items-center text-lg font-semibold ${
                          cip30Status ? "text-green-50" : "text-red-50"
                        } transition-all duration-300`}
                      >
                        {cip30Status && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6 text-green-300 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        )}
                        {!cip30Status && (
                          <div className="has-tooltip mr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-6 text-red-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                            <span className="tooltip absolute top-[1.125rem] left-0 bg-gray-800 text-white text-xs rounded py-2 px-3 min-w-[300px] border border-gray-700 shadow-2xl backdrop-blur-sm">
                              Error:{" "}
                              {error && error.cip30
                                ? error.cip30
                                : "Verification failed"}
                            </span>
                          </div>
                        )}
                        <div className="font-medium">CIP-0030</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-5">
              <div className="relative">
                <div className="flex items-center mb-2">
                  <label
                    htmlFor="public-key"
                    className="block text-sm font-medium text-cf-blue-800 mr-2"
                  >
                    Public Key
                  </label>
                  <div className="has-tooltip relative">
                    <TooltipIcon />
                    <span className="tooltip absolute top-[1.125rem] left-0 bg-gray-800 text-white text-xs rounded py-2 px-3 min-w-[300px] border border-gray-700 shadow-2xl backdrop-blur-sm">
                      The public key of an address can be found in explorers if
                      the address transacted in the past or in select wallets.
                    </span>
                  </div>
                </div>
                <Input
                  id="public-key"
                  name="Public Key"
                  appendPrefix={isPrefixAppended && (cip8Status || cip30Status)}
                  type="text"
                  placeholder="Enter the public key of the address/key that was used to sign the message"
                  value={publicKey}
                  onChange={(e) => {
                    setPublicKey(e.target.value);
                    if (cip8Status !== null || cip30Status !== null) {
                      resetStatus();
                    }
                  }}
                  className="bg-gray-50 border-cf-blue-300 focus:border-cf-blue-500 focus:ring-cf-blue-400 text-sm"
                />
                {isPrefixAppended && (cip8Status || cip30Status) && (
                  <div className="text-xs text-cf-blue-600 mt-1">
                    CBOR prefix added during verification
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="flex items-center mb-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-cf-blue-800 mr-2"
                  >
                    Message/Hash
                  </label>
                  <div className="has-tooltip relative">
                    <TooltipIcon />
                    <span className="tooltip absolute top-[1.125rem] left-0 bg-gray-800 text-white text-xs rounded py-2 px-3 min-w-[300px] border border-gray-700 shadow-2xl backdrop-blur-sm">
                      The message or hash that was signed by the private key.
                    </span>
                  </div>
                </div>
                <Input
                  id="message"
                  name="Message"
                  type="text"
                  placeholder="Enter the message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (cip8Status !== null || cip30Status !== null) {
                      resetStatus();
                    }
                  }}
                  className="bg-gray-50 border-cf-blue-300 focus:border-cf-blue-500 focus:ring-cf-blue-400 text-sm"
                />
              </div>

              <div className="relative">
                <div className="flex items-center mb-2">
                  <label
                    htmlFor="signature"
                    className="block text-sm font-medium text-cf-blue-800 mr-2"
                  >
                    Signature
                  </label>
                  <div className="has-tooltip relative">
                    <TooltipIcon />
                    <span className="tooltip absolute top-[1.125rem] left-0 bg-gray-800 text-white text-xs rounded py-2 px-3 min-w-[300px] border border-gray-700 shadow-2xl backdrop-blur-sm">
                      For a valid signature, the message must be signed with a
                      private key, following CIP-0008 or CIP-0030. This can be
                      done via CLI or select wallets.
                    </span>
                  </div>
                </div>
                <Textarea
                  id="signature"
                  name="Signature"
                  type="text"
                  placeholder="Enter the signature"
                  value={signature}
                  onChange={(e) => {
                    setSignature(e.target.value);
                    if (cip8Status !== null || cip30Status !== null) {
                      resetStatus();
                    }
                  }}
                  className="bg-gray-50 border-cf-blue-300 focus:border-cf-blue-500 focus:ring-cf-blue-400 text-sm"
                />
              </div>

              <div className="flex items-center pt-2">
                <button
                  disabled={!publicKey || !message || !signature || isLoading}
                  onClick={handleVerifySignature}
                  className={`font-semibold flex-1 text-white h-12 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cf-blue-300 focus:ring-offset-2 bg-cf-blue-500 hover:bg-cf-blue-400 disabled:bg-cf-blue-500/40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] border border-cf-blue-600`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Verify Signature"
                  )}
                </button>
                <button
                  onClick={(e) => handleReset()}
                  className="group bg-cf-blue-500 hover:bg-cf-blue-400 ml-3 rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-cf-blue-300 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] border border-cf-blue-600"
                  aria-label="Reset form"
                >
                  <ResetIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="py-3 px-8 border-t border-cf-blue-100 bg-gray-50/80">
            <PoweredBy />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureVerification;
