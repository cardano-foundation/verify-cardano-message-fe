import React from "react";
import { Navigation } from "../components/Navigation";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cf-blue-50 via-white to-cf-blue-100">
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="relative w-full max-w-2xl backdrop-blur-sm bg-white/80 border border-cf-blue-200 rounded-xl shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cf-blue-400 via-cf-blue-500 to-cf-blue-400"></div>

          <div className="p-8 text-center">
            <div className="text-cf-blue-500 text-8xl mb-6">404</div>

            <h1 className="text-3xl font-bold text-cf-blue-900 mb-4 tracking-tight">
              Page Not Found
            </h1>

            <p className="text-gray-700 mb-8 text-lg">
              The page you're looking for doesn't exist :(
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-cf-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-cf-blue-700 focus:outline-none focus:ring-2 focus:ring-cf-blue-500 focus:ring-offset-2 active:scale-[0.98] border border-cf-blue-600 tracking-wide"
              >
                CIP-8/30 Verification
              </a>
              <a
                href="/method=cip100"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-cf-blue-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cf-blue-500 focus:ring-offset-2 active:scale-[0.98] border border-cf-blue-600 tracking-wide"
              >
                CIP-100 Verification
              </a>
            </div>
          </div>

          <div className="py-3 px-8 border-t border-cf-blue-100 bg-gray-50/80">
            <div className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Cardano Message Verification
              Tool
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
