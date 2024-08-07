import "./globals.css";
import localFont from "next/font/local";
import Header from "../components/Header";
import { Matomo } from "../lib/matomo-integration/matomo";
import { Swetrix } from "../lib/swetrix-integration/swetrix";

const switzer = localFont({
  src: [
    {
      path: "../lib/assets/fonts/switzer/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../lib/assets/fonts/switzer/Switzer-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../lib/assets/fonts/switzer/Switzer-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-switzer",
});

export const metadata = {
  title: "Cardano Message Verification",
  description: "Tool to verify signed messages for Cardano public keys in the browser",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${switzer.variable} font-sans antialiased`}>
        {/* Matomo */}
        <Matomo.script />
        {/* Swetrix */}
        <Swetrix.initialScript />
        <Swetrix.script />
        <Header />
        <div
          dangerouslySetInnerHTML={{
            __html: `
          <noscript>
            <img
              src="https://api.swetrix.com/log/noscript?pid=GRxW5Lv9sQLD"
              alt=""
              referrerpolicy="no-referrer-when-downgrade"
            />
          </noscript>
        `,
          }}
        />
        <main className="relative min-h-screen lg:overflow-hidden px-4 py-4 sm:py-0">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/600] w-[36.125rem] -translate-x-1/2 rotate-[10deg] bg-gradient-to-tr from-[#00E0FF] to-[#0084FF] opacity-100 sm:left-[calc(50%-75rem)] sm:w-[110.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          {children}
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#00FF7F] to-[#00BE7A] opacity-100 sm:left-[calc(50%+30rem)] sm:w-[62.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </main>
      </body>
    </html>
  );
}
