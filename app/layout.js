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
  description:
    "Tool to verify signed messages for Cardano public keys in the browser",
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
          <div className="sm:-left-80 sm:-top-80 aspect-[1155/600] w-[5rem] h-[5rem] sm:w-[36.125rem] sm:h-[36.125rem] bg-gradient-to-tr from-[#00E0FF] to-[#0084FF] opacity-100 rounded-full absolute blur-[5rem]" />
          {children}

          <div className="sm:-right-80 sm:-bottom-80 aspect-[1300/678]  w-[5rem] h-[5rem] sm:w-[36.125rem] sm:h-[36.125rem] bg-gradient-to-tr from-[#00FF7F] to-[#00BE7A] opacity-100 rounded-full absolute blur-[5rem]" />
        </main>
      </body>
    </html>
  );
}
