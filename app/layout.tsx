import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WidePlayer — A theatre for your browser",
  description:
    "The browser extension that stretches your content, not your eyes. Simple, elegant, and completely essential.",
  openGraph: {
    title: "WidePlayer — A theatre for your browser",
    description:
      "Join 15,000+ creators and watchers who refuse to settle for tiny windows.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} font-body selection:bg-bright-green/20 selection:text-earth-green overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
