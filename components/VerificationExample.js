import React, { useState } from "react";

const InformationSection = ({ fillCIP0008Example, fillCIP0030Example }) => {
  const [showMoreText, setShowMoreText] = useState(false);

  return (
    <>
      <h1 className="text-3xl font-bold text-cf-blue-900">
        Cardano Message Verification
      </h1>
      <div className="flex justify-center">
        <div className="max-w-2xl">
          <h1 className="mt-4 text-sm font-normal mb-6 text-cf-blue-900">
            This tool verifies signed messages for Cardano public keys in the
            browser.{" "}
            <span
              className="text-blue-500 cursor-pointer text-sm font-normal"
              onClick={() => setShowMoreText(!showMoreText)}
              style={{ display: showMoreText ? "none" : "inline" }}
            >
              Learn more...
            </span>
            {showMoreText && (
              <span className="text-sm font-normal">
                {" "}
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
                  [CIP-0008]{" "}
                </a>
                and
                <a
                  className="text-blue-500"
                  href="https://cips.cardano.org/cip/CIP-0030"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  [CIP-0030]{" "}
                </a>
                , given the public key of a Cardano address and the signature of
                the message. Try it Out:
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={fillCIP0008Example}
                >
                  {" "}
                  CIP-0008 example
                </span>{" "}
                ,{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={fillCIP0030Example}
                >
                  {" "}
                  CIP-0030 example
                </span>
                .
              </span>
            )}
          </h1>
        </div>
      </div>
    </>
  );
};

export default InformationSection;
