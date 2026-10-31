import type { Metadata } from "next";
import "./globals.css";
import "./depth.css";
import { Masthead } from "../components/Masthead";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://travelproof.app"),
  title: "TravelProof — Travel Rule transmittal records",
  description: "Verify the person, hide the person. FATF Travel Rule transmittal records with a DON-signed attestation on Base Sepolia.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "TravelProof — Travel Rule transmittal records",
    description: "Prove who the counterparty is. Keep who they are off the ledger.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "TravelProof" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelProof — Travel Rule transmittal records",
    description: "Prove who the counterparty is. Keep who they are off the ledger.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&display=swap" rel="stylesheet" />
      </head>
      <body><Masthead />{children}</body>
    </html>
  );
}
