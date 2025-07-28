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
      <body
        className={`${chivo.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        {/* Matomo */}
        <Matomo.script />
        <main className="relative flex-1 lg:overflow-hidden py-4 sm:py-0">
          {children}
        </main>
      </body>
    </html>
  );
}
