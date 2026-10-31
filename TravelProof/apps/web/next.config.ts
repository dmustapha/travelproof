// File: apps/web/next.config.ts
import type { NextConfig } from "next";
const config: NextConfig = { transpilePackages: ["@travelproof/core"], env: { ATTESTATION_ADDRESS: process.env.ATTESTATION_ADDRESS } };
export default config;
