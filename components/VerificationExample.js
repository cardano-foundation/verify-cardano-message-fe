import React, { useState } from "react";

const InformationSection = ({ fillCIP0008Example, fillCIP0030Example }) => {
  const [showMoreText, setShowMoreText] = useState(false);

  const handleCIP0008Example = () => {
    fillCIP0008Example();
    setShowMoreText(false);
  };

  const handleCIP0030Example = () => {
    fillCIP0030Example();
    setShowMoreText(false);
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-xl relative sm:px-16">
        <h1 className="mt-4 text-sm font-normal mb-6 text-cf-blue-900 text-justify">
          This tool verifies signed messages for Cardano public keys in the
          browser.{" "}
          <span
            className="text-blue-500 cursor-pointer text-sm font-normal"
            onClick={() => setShowMoreText(!showMoreText)}
          >
            {showMoreText ? "Show less" : "Learn more"}
          </span>
        </h1>

        {showMoreText && (
          <div className="absolute top-10 left-0 right-0 bg-white border border-cf-blue-200 rounded-lg shadow-lg p-4 z-10">
            <button
              onClick={() => setShowMoreText(false)}
              className="absolute top-2 right-2 text-cf-blue-500 hover:text-cf-blue-700 focus:outline-none"
              aria-label="Close information"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <p className="text-sm text-cf-blue-900 text-justify mx-3">
              Signing messages on Cardano can be used to prove ownership of an
              address (e.g. as alternative to a
              <a
                className="text-blue-500"
                href="https://www.21analytics.ch/what-is-a-satoshi-test/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Satoshi Test
              </a>
              ), identity, or other off-chain data without the need of an
              on-chain transaction. Currently, the tool can verify messages
              signed with standards
              <a
                className="text-blue-500"
                href="https://cips.cardano.org/cip/CIP-0008"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                CIP-0008{" "}
              </a>
              and
              <a
                className="text-blue-500"
                href="https://cips.cardano.org/cip/CIP-0030"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                CIP-0030{" "}
              </a>
              , given the public key of a Cardano address and the signature of
              the message.
            </p>
            <div className="flex justify-center gap-4 text-sm mt-2">
              <span className="text-cf-blue-800">Try it Out:</span>
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={handleCIP0008Example}
              >
                CIP-0008 example
              </span>{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={handleCIP0030Example}
              >
                CIP-0030 example
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformationSection;
