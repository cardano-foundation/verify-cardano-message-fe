"use client";

import React, { useState } from "react";
import Input from "../components/Input";
import Textarea from "../components/Textarea";

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

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6 text-cf-blue-900">
        Cardano Signature Verification
      </h1>
      {cip8Status !== null && cip30Status !== null && (
        <div
        className={`mb-12 ${
          cip8Status && cip30Status ? "grid grid-cols-1" : "flex justify-center"
        } ${!cip8Status && !cip30Status ? "gap-28" : "gap-4"} px-3 py-2 max-w-md w-full rounded-md shadow-lg ${
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
        <Input
          className="mb-8"
          id="public-key"
          label="Public Key"
          name="Public Key"
          type="text"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
        />
        <Input
          className="mb-8"
          id="message"
          label="Message"
          name="Message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Textarea
          className="mb-8"
          id="signature"
          label="Signature"
          name="Signature"
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
        />
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
            <svg
              className="size-8 group-hover:animate-spin cursor-pointer stroke-current text-white transition-color ease-in-out duration-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
        <h1 className="mt-4 text-center text-xs font-bold mb-6 text-cf-blue-900">
          Securely verify data and signatures using CIP-0008 and CIP-0030
          standards on the Cardano.
        </h1>
      </div>
    </div>
  );
};

export default SignatureVerification;
