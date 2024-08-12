"use client";

import React, { useState } from "react";
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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle signature verification
  const handleVerifySignature = async () => {
    setIsLoading(true);
    const response = await fetch(
      `/api/verify?publicKey=${publicKey}&message=${message}&signature=${signature}`
    );

    const data = await response.json();
    setCip8Status(data.isCip8Verified);
    setCip30Status(data.isCip30Verified);
    setError(data.error);
    setIsLoading(false);
  };

  // Reset the form
  const handleReset = () => {
    setPublicKey("");
    setMessage("");
    setSignature("");
    setCip8Status(null);
    setCip30Status(null);
    setError(null);
  };

  // 0008 Example Data
  const fillCIP0008Example = () => {
    const { publicKey, message, signature } = cip0008Data[0];
    setPublicKey(publicKey);
    setMessage(message);
    setSignature(signature);
  };

  // 0030 Example Data
  const fillCIP0030Example = () => {
    const { publicKey, message, signature } = cip0030Data[0];
    setPublicKey(publicKey);
    setMessage(message);
    setSignature(signature);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-cf-blue-900 sm:pr-8">
        Cardano Message Verification
      </h1>
      <MessageVerification
        fillCIP0008Example={fillCIP0008Example}
        fillCIP0030Example={fillCIP0030Example}
      />
      {cip8Status !== null && cip30Status !== null && (
        <div
          className={`mb-4 ${
            cip8Status && cip30Status
              ? "grid grid-cols-1"
              : "flex justify-center"
          } ${
            !cip8Status && !cip30Status ? "gap-28" : "gap-4"
          } px-3 py-2 max-w-md w-full rounded-md shadow-lg ${
            cip8Status || cip30Status ? "bg-green-700" : "bg-red-800"
          }`}
        >
          {(cip8Status || !cip30Status) && (
            <p
              className={`flex justify-center items-center text-lg ${
                cip8Status ? "text-green-50" : "text-red-50"
              }`}
            >
              {cip8Status && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 text-green-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
              {!cip8Status && (
                <div className="has-tooltip">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span className="tooltip bg-cf-dark px-2 py-1 text-base rounded-md shadow-lg">
                    Error: {error.cip8}
                  </span>
                </div>
              )}
              <div className="ml-1">CIP-0008</div>
            </p>
          )}
          {(cip30Status || !cip8Status) && (
            <p
              className={`flex justify-center items-center text-lg ${
                cip30Status ? "text-green-50" : "text-red-50"
              }`}
            >
              {cip30Status && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 text-green-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
              {!cip30Status && (
                <div className="has-tooltip">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span className="tooltip bg-cf-dark px-2 py-1 text-base rounded-md shadow-lg">
                    Error: {error.cip30}
                  </span>
                </div>
              )}
              <div className="ml-1">CIP-0030</div>
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col w-full max-w-md">
        <div className="mb-4">
          <div className="relative flex items-center mb-1">
            <label
              htmlFor="public-key"
              className="block text-sm font-medium text-gray-700 mr-1"
            >
              Public Key
            </label>
            <div className="has-tooltip relative">
              <TooltipIcon />
              <span className="tooltip absolute -top-10 left-0 bg-gray-700 text-white text-xs rounded py-1 px-2 min-w-[300px]">
                The public key of an address can be found in explorers if the
                address transacted in the past or in select wallets.
              </span>
            </div>
          </div>
          <Input
            id="public-key"
            name="Public Key"
            type="text"
            placeholder="Enter the public key of the address/key that was used to sign the message"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <div className="relative flex items-center mb-1">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mr-1"
            >
              Message
            </label>
            <div className="has-tooltip relative">
              <TooltipIcon />
              <span className="tooltip absolute -top-10 left-0 bg-gray-700 text-white text-xs rounded py-1 px-2 min-w-[300px]">
                The message that was signed by the private key.
              </span>
            </div>
          </div>
          <Input
            id="message"
            name="Message"
            type="text"
            placeholder="Enter the message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <div className="relative flex items-center mb-1">
            <label
              htmlFor="signature"
              className="block text-sm font-medium text-gray-700 mr-1"
            >
              Signature
            </label>
            <div className="has-tooltip relative">
              <TooltipIcon />
              <span className="tooltip absolute -top-6 left-0 bg-gray-700 text-white text-xs rounded py-1 px-2 min-w-[300px]">
                For a valid signature, the message must be signed with a private
                key, following CIP-0008 or CIP-0030. This can be done via CLI or
                select wallets.
              </span>
            </div>
          </div>
          <Textarea
            id="signature"
            name="Signature"
            type="text"
            placeholder="Enter the signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <button
            disabled={!publicKey || !message || !signature || isLoading}
            onClick={handleVerifySignature}
            className={`font-semibold flex-1 text-white h-12 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cf-blue-200 bg-cf-blue-500 hover:bg-cf-blue-400 disabled:bg-cf-blue-500/40 disabled:cursor-not-allowed transition ease-in-out duration-200`}
          >
            {isLoading ? "Verifying..." : "Verify Signature"}
          </button>
          <button
            onClick={(e) => handleReset()}
            className="group bg-cf-blue-500 hover:bg-cf-blue-400 ml-2 rounded-md h-12 px-3 focus:outline-none focus:ring-2 focus:ring-cf-blue-200 transition ease-in-out duration-200"
          >
            <ResetIcon />
          </button>
        </div>
      </div>
      <PoweredBy />
    </div>
  );
};

export default SignatureVerification;
