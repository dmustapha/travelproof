// File: apps/web/lib/ledger.ts
import { parseAbiItem, type Address } from "viem";
import { publicClient, fallbackClient } from "./chain";

export const ATTESTATION_EVENT = parseAbiItem(
  "event EnclaveAttestation(bytes32 indexed jobId, bytes32 commitmentHash, uint64 ts, uint8 verdict)",
);
export interface LedgerRow { jobId: `0x${string}`; commitmentHash: `0x${string}`; ts: number; verdict: number; txHash: `0x${string}`; blockNumber: bigint; }

// Public fallback RPC caps eth_getLogs at 50k blocks; walk the range in windows so a fallback
// hit still returns the full log set (DEV-403). Both Base Sepolia RPCs reject fromBlock:0
// ("pruned history unavailable"), so the default scan starts at the contract deploy block.
const MAX_RANGE = 45_000n;
// TravelRuleAttestation deploy block on Base Sepolia (contracts/broadcast run-latest.json).
const DEPLOY_BLOCK = BigInt(process.env.ATTESTATION_DEPLOY_BLOCK ?? "52683257");

type EventLogs = Awaited<ReturnType<typeof publicClient.getLogs<typeof ATTESTATION_EVENT>>>;

async function getLogsRanged(c: typeof publicClient, address: Address, fromBlock: bigint): Promise<EventLogs> {
  const latest = await c.getBlockNumber();
  const out: EventLogs = [];
  for (let start = fromBlock; start <= latest; start += MAX_RANGE + 1n) {
    const end = start + MAX_RANGE > latest ? latest : start + MAX_RANGE;
    const logs = await c.getLogs({ address, event: ATTESTATION_EVENT, fromBlock: start, toBlock: end });
    out.push(...logs);
  }
  return out;
}

export async function readLedger(fromBlock: bigint = DEPLOY_BLOCK): Promise<LedgerRow[]> {
  const address = process.env.ATTESTATION_ADDRESS as Address | undefined;
  if (!address) return [];
  let logs: EventLogs;
  try {
    // Primary: single unbounded call (Alchemy supports it).
    logs = await publicClient.getLogs({ address, event: ATTESTATION_EVENT, fromBlock, toBlock: "latest" });
  } catch {
    // Fallback RPC - walk the range in <=50k windows to respect its cap.
    logs = await getLogsRanged(fallbackClient, address, fromBlock);
  }
  return logs
    .map((l) => ({
      jobId: l.args.jobId as `0x${string}`,
      commitmentHash: l.args.commitmentHash as `0x${string}`,
      ts: Number(l.args.ts),
      verdict: Number(l.args.verdict),
      txHash: (l.transactionHash ?? "0x") as `0x${string}`,
      blockNumber: l.blockNumber ?? 0n,
    }))
    .sort((a, b) => b.ts - a.ts);
}
