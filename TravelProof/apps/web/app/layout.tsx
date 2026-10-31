import type { Metadata } from "next";
import "./globals.css";
import "./depth.css";
import { Masthead } from "../components/Masthead";

export const metadata: Metadata = {
  title: "TravelProof — Travel Rule transmittal records",
  description: "Verify the person, hide the person. FATF Travel Rule transmittal records with a DON-signed attestation on Base Sepolia.",
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
