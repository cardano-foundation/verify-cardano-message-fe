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
      `/api/verify?publicKey=${publicKey}&message=${message}&signature=${signature}`,
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
          className={`mb-12 grid grid-cols-2 gap-4 px-3 py-2 max-w-md w-full rounded-md shadow-lg ${cip8Status || cip30Status ? "bg-green-700" : "bg-red-800"}`}
        >
          <p
            className={`flex justify-center items-center text-lg ${cip8Status || cip30Status ? "text-green-50" : "text-red-50"}`}
          >
            {cip8Status && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 text-green-300"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
            {!cip8Status && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 text-red-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
            <div className="ml-1">CIP-0008</div>
          </p>
          <p
            className={`flex justify-center items-center text-lg ${cip8Status || cip30Status ? "text-green-50" : "text-red-50"}`}
          >
            {cip30Status && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 text-green-300"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
            {!cip30Status && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 text-red-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
            <div className="ml-1">CIP-0030</div>
          </p>
          {!cip8Status && !cip30Status && (error.cip8 || error.cip30) && (
            <p className="text-red-200 flex justify-center col-span-2 text-base px-4">
              {error.cip8 && "CIP-0008: " + error.cip8}
              {error.cip8 && <br />}
              {error.cip30 && "CIP-0030: " + error.cip30}
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
            disabled={(!publicKey || !message || !signature) || isLoading}
            onClick={handleVerifySignature}
            className={`font-semibold flex-1 text-white h-12 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cf-blue-200 bg-cf-blue-500 hover:bg-cf-blue-400 disabled:bg-cf-blue-500/40 disabled:cursor-not-allowed transition ease-in-out duration-200`}
          >
            {isLoading? 'Verifying...' : 'Verify Signature'}
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
      </div>
    </div>
  );
};

export default SignatureVerification;