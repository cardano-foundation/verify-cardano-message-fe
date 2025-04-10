import React from "react";

const DisclaimerPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="relative w-full max-w-2xl backdrop-blur-sm bg-white/80 border border-cf-blue-200 rounded-xl shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cf-blue-400 via-cf-blue-500 to-cf-blue-400"></div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-cf-blue-900 mb-6 text-center font-mono tracking-tight">
            Cardano Message Verification
          </h1>

          <div className="text-left">
            <h2 className="text-xl font-semibold mb-4 text-cf-blue-800 font-mono">
              Disclaimer
            </h2>

            <p className="text-gray-700 mb-4 font-medium">
              By using our Cardano Message Verification, you agree to the
              following:
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-3 mb-6">
              <li className="pl-2">
                <span className="font-semibold text-cf-blue-800">
                  Services Provided "As Is":
                </span>{" "}
                To the maximum extent permitted by applicable law, our services
                are provided on an "as is" and "as available" basis. We
                expressly disclaim all warranties of any kind, whether express
                or implied, including any warranties of merchantability, fitness
                for a particular purpose, title, and non-infringement. This
                includes the information, content, and materials contained
                within our services.
              </li>

              <li className="pl-2">
                <span className="font-semibold text-cf-blue-800">
                  No Liability for Errors or Omissions:
                </span>{" "}
                We are not responsible for any errors or omissions in the
                information provided by the tool, nor do we provide a guarantee
                of completeness, accuracy, timeliness, or of the results
                obtained from its use.
              </li>

              <li className="pl-2">
                <span className="font-semibold text-cf-blue-800">
                  User Responsibility:
                </span>{" "}
                It is your responsibility to conduct additional due diligence as
                needed. We are not liable for any decisions or actions taken in
                reliance on the information provided by our service.
              </li>

              <li className="pl-2">
                <span className="font-semibold text-cf-blue-800">
                  No Liability for Damages:
                </span>{" "}
                We will not be liable for any consequential, special, or similar
                damages, even if advised of the possibility of such damages.
              </li>
            </ul>

            <p className="text-gray-700 mb-6 font-medium">
              By using our services, you acknowledge and agree to the terms of
              this disclaimer.
            </p>

            <div className="flex justify-center mt-6">
              <a
                href="/"
                className="px-6 py-3 bg-cf-blue-500 text-white rounded-lg hover:bg-cf-blue-400 focus:outline-none focus:ring-2 focus:ring-cf-blue-300 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] border border-cf-blue-600 font-mono tracking-wide font-medium"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
        <div className="py-3 px-8 border-t border-cf-blue-100 bg-gray-50/80">
          <div className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Cardano Message Verification Tool
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
