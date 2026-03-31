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
import { Navigation } from "../components/Navigation";

const SignatureVerification = () => {
  const [publicKey, setPublicKey] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [cip8Status, setCip8Status] = useState(null);
  const [cip30Status, setCip30Status] = useState(null);
  const [isPrefixAppended, setIsPrefixAppended] = useState(false);
  const [signatureStandard, setSignatureStandard] = useState(null);
  const [error, setError] = useState({ cip8: "", cip30: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [signerAddress, setSignerAddress] = useState(null);
  const [showTestnet, setShowTestnet] = useState(false);

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
      // Uncomment the line below to see the response in the console
      // console.log("Verification response:", data);

      setCip8Status(data.isCip8Verified);
      setCip30Status(data.isCip30Verified);
      setIsPrefixAppended(data.isPrefixAppended);
      setSignatureStandard(data.signatureStandard);
      setSignerAddress(data.signerAddress || null);
      setShowTestnet(data.signerAddress?.originalNetwork === 0);

      if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError({
        cip8: `Error: ${err.message}`,
        cip30: `Error: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetStatus = () => {
    setCip8Status(null);
    setCip30Status(null);
    setIsPrefixAppended(false);
    setSignatureStandard(null);
    setError({ cip8: "", cip30: "" });
    setSignerAddress(null);
    setShowTestnet(false);
  };

  const handleReset = () => {
    setPublicKey("");
    setMessage("");
    setSignature("");
    resetStatus();
  };

  // Load CIP-0008 example data
  const fillCIP0008Example = () => {
    setPublicKey(cip0008Data[0].publicKey);
    setMessage(cip0008Data[0].message);
    setSignature(cip0008Data[0].signature);
    resetStatus();
  };

  // Load CIP-0030 example data
  const fillCIP0030Example = () => {
    setPublicKey(cip0030Data[0].publicKey);
    setMessage(cip0030Data[0].message);
    setSignature(cip0030Data[0].signature);
    resetStatus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cf-blue-50 via-white to-cf-blue-100">
      <Navigation />

      <div className="px-4 py-8">
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
                    <div className="flex justify-center items-center">
                      <span className="flex items-center text-lg font-semibold text-white transition-all duration-300">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            cip8Status || cip30Status
                              ? "bg-green-300"
                              : "bg-red-300"
                          }`}
                        ></span>
                        Result:{" "}
                        {cip8Status || cip30Status ? "VALID" : "INVALID"}
                        {(cip8Status || cip30Status) && signatureStandard && (
                          <> ({signatureStandard})</>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {(cip8Status || cip30Status) && signerAddress && (
                <div className="mb-6 border border-cf-blue-200 bg-cf-blue-50/80 px-5 py-3 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-cf-blue-600">Signed by:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-cf-blue-100 text-cf-blue-500 px-2 py-0.5 rounded-full">
                        {signerAddress.addressType}
                      </span>
                      {signerAddress.source === "derived" && (
                        <div className="has-tooltip relative">
                          <TooltipIcon />
                          <span className="tooltip absolute top-[1.125rem] right-0 left-auto bg-gray-800 text-white text-xs rounded py-2 px-3 min-w-[260px] border border-gray-700 shadow-2xl backdrop-blur-sm">
                            This address was derived from the public key. CIP-8 raw
                            signatures do not embed an address, so an enterprise
                            address is computed from the key hash.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="font-mono text-xs break-all text-cf-blue-900">
                    {showTestnet ? signerAddress.testnet : signerAddress.mainnet}
                  </div>
                  <div className="flex justify-end mt-2">
                    <div className="inline-flex rounded-full border border-cf-blue-200 overflow-hidden text-xs">
                      <button
                        type="button"
                        onClick={() => setShowTestnet(false)}
                        className={`px-3 py-1 transition-colors ${
                          !showTestnet
                            ? "bg-cf-blue-500 text-white"
                            : "text-cf-blue-500 hover:bg-cf-blue-50"
                        }`}
                      >
                        Mainnet
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTestnet(true)}
                        className={`px-3 py-1 transition-colors ${
                          showTestnet
                            ? "bg-cf-blue-500 text-white"
                            : "text-cf-blue-500 hover:bg-cf-blue-50"
                        }`}
                      >
                        Testnet
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center mb-1">
                    <label
                      htmlFor="publicKey"
                      className="block text-sm font-medium text-cf-blue-800 mr-2"
                    >
                      Public Key
                    </label>
                    <div className="has-tooltip relative">
                      <TooltipIcon />
                      <span className="tooltip absolute top-[1.125rem] left-0 bg-gray-800 text-white text-xs rounded py-2 px-3 min-w-[300px] border border-gray-700 shadow-2xl backdrop-blur-sm">
                        The public key generated for your wallet. You can obtain
                        this from your wallet settings in wallets like Eternl.
                      </span>
                    </div>
                  </div>
                  <Input
                    id="publicKey"
                    name="publicKey"
                    type="text"
                    placeholder="Enter public key (hex)"
                    value={publicKey}
                    onChange={(e) => {
                      setPublicKey(e.target.value);
                      if (cip8Status !== null || cip30Status !== null) {
                        resetStatus();
                      }
                    }}
                    className="bg-gray-50 border-cf-blue-300 focus:border-cf-blue-500 focus:ring-cf-blue-400 text-sm h-10"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center mb-1">
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
                    className="bg-gray-50 border-cf-blue-300 focus:border-cf-blue-500 focus:ring-cf-blue-400 text-sm h-10"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center mb-1">
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
                    className="bg-gray-50 border-cf-blue-300 focus:border-cf-blue-500 focus:ring-cf-blue-400 text-sm resize-none"
                    rows={6}
                  />
                </div>

                <div className="flex items-center pt-4">
                  <button
                    disabled={!publicKey || !message || !signature || isLoading}
                    onClick={handleVerifySignature}
                    className={`font-semibold flex-1 text-white h-12 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cf-blue-300 focus:ring-offset-2 bg-cf-blue-500 hover:bg-cf-blue-400 disabled:bg-cf-blue-500/40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] border border-cf-blue-600`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    className="group bg-cf-blue-500 hover:bg-cf-blue-400 ml-3 rounded-lg h-12 px-3 focus:outline-none focus:ring-2 focus:ring-cf-blue-300 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] border border-cf-blue-600"
                    aria-label="Reset form"
                  >
                    <ResetIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-8">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
};

export default SignatureVerification;
