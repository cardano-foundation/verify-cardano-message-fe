import React from "react";
import Image from "next/image";
import Link from "next/link";

const PoweredBy = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <p className="text-sm mb-0 opacity-90">Powered By</p>
        <div className="relative h-auto w-32">
          <Link href="https://cardanofoundation.org/" legacyBehavior>
            <a>
              <Image
                src="/cardano-logo.svg"
                alt="Cardano Logo"
                objectFit="contain"
                height={56}
                width={200}
              />
            </a>
          </Link>
        </div>
      </div>
      <p className="text-center mb-0 text-sm font-normal">
        Tool provided by the Cardano Foundation as is and under{" "}
        <Link href="/disclaimer" legacyBehavior>
          <a className="text-blue-500 underline">specific terms</a>
        </Link>
        .
      </p>
    </div>
  );
};

export default PoweredBy;