import "./globals.css";
import { Chivo } from "next/font/google";
import { Matomo } from "../lib/matomo-integration/matomo";

const chivo = Chivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-chivo",
});

export const metadata = {
  title: "Cardano Message Verification",
  description:
    "Tool to verify signed messages for Cardano public keys in the browser",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${chivo.variable} font-sans antialiased`}>
        {/* Matomo */}
        <Matomo.script />
        <main className="relative min-h-screen lg:overflow-hidden py-4 sm:py-0">
          <div className="z-[-1] sm:-left-80 sm:-top-80 aspect-[1155/600] w-[5rem] h-[5rem] sm:w-[36.125rem] sm:h-[36.125rem] bg-gradient-to-tr from-[#00E0FF] to-[#0084FF] opacity-100 rounded-full absolute blur-[5rem]" />
          {children}

          <div className="z-[-1] sm:-right-80 sm:-bottom-80 aspect-[1300/678]  w-[5rem] h-[5rem] sm:w-[36.125rem] sm:h-[36.125rem] bg-gradient-to-tr from-[#00FF7F] to-[#00BE7A] opacity-100 rounded-full absolute blur-[5rem]" />
        </main>
      </body>
    </html>
  );
}
