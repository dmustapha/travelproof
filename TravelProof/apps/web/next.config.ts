// File: apps/web/next.config.ts
import type { NextConfig } from "next";
const config: NextConfig = { devIndicators: false, outputFileTracingIncludes: { "/specimen/[kind]/memo.pdf": ["./fonts/**"], "/record/[jobId]/memo.pdf": ["./fonts/**"] }, transpilePackages: ["@travelproof/core"], env: { ATTESTATION_ADDRESS: process.env.ATTESTATION_ADDRESS } };
export default config;
