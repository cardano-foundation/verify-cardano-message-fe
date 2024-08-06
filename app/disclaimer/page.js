import React from "react";

const DisclaimerPage = () => {
  return (
    <div className="flex flex-col items-center justify-top h-screen p-4 mt-20">
      <div className="p-6 rounded-lg max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-4 text-left text-gray-800">
          Cardano Message Verification
        </h1>
        <div className="text-left">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Disclaimer</h2>
          <p className="text-gray-700 mb-2 font-medium">
            By using our Cardano Message Verification, you agree to the following:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 font-medium">
            <li>
              <strong>Services Provided "As Is":</strong> To the maximum extent
              permitted by applicable law, our services are provided on an "as
              is" and "as available" basis. We expressly disclaim all warranties
              of any kind, whether express or implied, including any warranties
              of merchantability, fitness for a particular purpose, title, and
              non-infringement. This includes the information, content, and
              materials contained within our services.
            </li>
            <li>
              <strong>No Liability for Errors or Omissions:</strong> We are not
              responsible for any errors or omissions in the information
              provided by the tool, nor do we provide a guarantee of
              completeness, accuracy, timeliness, or of the results obtained
              from its use.
            </li>
            <li>
              <strong>User Responsibility:</strong> It is your responsibility to
              conduct additional due diligence as needed. We are not liable for
              any decisions or actions taken in reliance on the information
              provided by our service.
            </li>
            <li>
              <strong>No Liability for Damages:</strong> We will not be liable
              for any consequential, special, or similar damages, even if
              advised of the possibility of such damages.
            </li>
          </ul>
          <p className="text-gray-700 mt-4 font-medium mb-6">
            By using our services, you acknowledge and agree to the terms of
            this disclaimer.
          </p>
          <a
            href="/"
            className="mt-6 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-500"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;