// File: apps/web/lib/chain.ts
import { createPublicClient, http, type Address } from "viem";
import { baseSepolia } from "viem/chains";

const RPC = process.env.BASE_SEPOLIA_RPC_URL ?? "https://sepolia.base.org";
const FALLBACK = process.env.BASE_SEPOLIA_RPC_FALLBACK ?? "https://base-sepolia-rpc.publicnode.com";

export const publicClient = createPublicClient({ chain: baseSepolia, transport: http(RPC) });
export const fallbackClient = createPublicClient({ chain: baseSepolia, transport: http(FALLBACK) });

export const ATTESTATION_ABI = [
  { type: "function", name: "getAttestation", stateMutability: "view", inputs: [{ name: "jobId", type: "bytes32" }], outputs: [{ name: "commitmentHash", type: "bytes32" }, { name: "verifyVerdict", type: "uint8" }, { name: "screenVerdict", type: "uint8" }, { name: "ts", type: "uint64" }] },
] as const;

export interface AttestationView { commitmentHash: `0x${string}`; verifyVerdict: number; screenVerdict: number; ts: number; }

export async function getAttestation(jobId: `0x${string}`): Promise<AttestationView | null> {
  const address = process.env.ATTESTATION_ADDRESS as Address | undefined;
  if (!address) return null;
  const read = async (client: typeof publicClient) =>
    client.readContract({ address, abi: ATTESTATION_ABI, functionName: "getAttestation", args: [jobId] });
  let res;
  try { res = await read(publicClient); } catch { res = await read(fallbackClient); } // RPC fallback (DT-10)
  const [commitmentHash, verifyVerdict, screenVerdict, ts] = res as [`0x${string}`, number, number, bigint];
  if (Number(ts) === 0) return null;
  return { commitmentHash, verifyVerdict: Number(verifyVerdict), screenVerdict: Number(screenVerdict), ts: Number(ts) };
}
