'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-white/80 sticky top-0 z-50 w-full border-b border-cf-blue-200 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/cardano-logo.svg"
                alt="Cardano Logo"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>
            {/* Desktop Navigation */}
            <div className="ml-12 hidden items-center space-x-8 md:flex">
              <Link
                href="/"
                className={`font-medium transition-colors hover:text-cf-blue-600 ${
                  pathname === "/"
                    ? "border-b-2 border-cf-blue-600 pb-1 text-cf-blue-600"
                    : "text-gray-700"
                }`}
              >
                CIP-8/30 Message Verification
              </Link>
              <Link
                href="/cip100"
                className={`font-medium transition-colors hover:text-cf-blue-600 ${
                  pathname === "/cip100"
                    ? "border-b-2 border-cf-blue-600 pb-1 text-cf-blue-600"
                    : "text-gray-700"
                }`}
              >
                CIP-100 Governance Verification
              </Link>
            </div>
          </div>

          {/* Right side - GitHub link */}
          <div className="flex items-center space-x-6">
            {/* Desktop GitHub Link */}
            <div className="hidden items-center space-x-6 md:flex">
              <Link
                href="https://github.com/cardano-foundation/CIPs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 transition-colors hover:text-cf-blue-600"
                title="Cardano CIPs on GitHub"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-cf-blue-50 relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition-colors hover:text-cf-blue-600 md:hidden"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="animate-in slide-in-from-top-2 bg-white/90 border-t border-cf-blue-200 backdrop-blur-lg duration-200 md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Mobile Navigation Links */}
              <Link
                href="/"
                className={`hover:bg-cf-blue-50 block rounded-md px-3 py-2 text-base font-medium hover:text-cf-blue-600 ${
                  pathname === "/"
                    ? "bg-cf-blue-50 border-l-4 border-cf-blue-600 text-cf-blue-600"
                    : "text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CIP-8/30 Message Verification
              </Link>
              <Link
                href="/cip100"
                className={`hover:bg-cf-blue-50 block rounded-md px-3 py-2 text-base font-medium hover:text-cf-blue-600 ${
                  pathname === "/cip100"
                    ? "bg-cf-blue-50 border-l-4 border-cf-blue-600 text-cf-blue-600"
                    : "text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CIP-100 Governance Verification
              </Link>
              {/* Mobile GitHub Link */}
              <div className="px-3 py-2">
                <Link
                  href="https://github.com/cardano-foundation/CIPs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 transition-colors hover:text-cf-blue-600 flex items-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>Cardano CIPs</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
