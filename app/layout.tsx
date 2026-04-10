import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
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
  icons: { icon: "/logo.svg", shortcut: "/logo.svg" },
  title: "WidePlayer: Bigger videos on X, no fullscreen",
  description:
    "The browser extension that enlarges in-feed videos on X without fullscreen. Auto mode, manual controls, and live width preview.",
  openGraph: {
    title: "WidePlayer: Bigger videos on X, no fullscreen",
    description:
      "Watch videos on X the way they deserve. Wider, without fullscreen, without breaking your feed.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
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
        className={`${instrument.variable} ${inter.variable} font-body selection:bg-bright-green/20 selection:text-earth-green overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
