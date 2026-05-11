import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import Script from "next/script";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wideplayer.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  icons: { icon: "/logo.svg", shortcut: "/logo.svg" },
  title: "WidePlayer: Bigger videos on X, no fullscreen",
  description:
    "The browser extension that enlarges in-feed videos on X without fullscreen. Auto mode, manual controls, and live width preview.",
  openGraph: {
    title: "WidePlayer: Bigger videos on X, no fullscreen",
    description:
      "Watch videos on X the way they deserve. Wider, without fullscreen, without breaking your feed.",
    url: "/",
    siteName: "WidePlayer",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WidePlayer browser extension preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WidePlayer: Bigger videos on X, no fullscreen",
    description:
      "Watch videos on X the way they deserve. Wider, without fullscreen, without breaking your feed.",
    images: ["/og-image.png"],
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
        <meta property="og:logo" content={`${siteUrl}/logo.svg`} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${instrument.variable} ${inter.variable} font-body selection:bg-violet/18 selection:text-ink overflow-x-hidden`}
      >
        {children}
        <Script
          src="/player.js"
          strategy="afterInteractive"
          data-website-id="39d96cb2-b9d4-4aa8-a362-720de21f7e67"
        />
      </body>
    </html>
  );
}
