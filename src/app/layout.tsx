import type { Metadata } from "next";
import { Fraunces, Outfit, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { DemoAccountsBanner } from "@/components/dev/demo-accounts-banner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
});

// Matches the elegant high-contrast serif small-caps style used in the VivahVedam
// flower logo — used only for the wordmark in the navbar, not site-wide headings.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: "VivahVedam — Your Wedding, Beautifully Planned",
  description:
    "Discover venues, hire top wedding professionals, and manage every detail of your special day. The modern wedding planning marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} ${cormorant.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        {process.env.NODE_ENV === "development" && <DemoAccountsBanner />}
      </body>
    </html>
  );
}
