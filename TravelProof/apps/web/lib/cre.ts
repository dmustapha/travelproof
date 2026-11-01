// File: apps/web/lib/cre.ts
// Shells out to scripts/run-cre.sh, which drives the real `cre workflow simulate` for verify + screen
// (local CRE simulation: DON + enclave emulated, real logic/data, real DON-signed report). The verdicts
// returned come ONLY from that real run — the runner exits non-zero (→ caught as a 502 in api/run) if a
// real verdict cannot be parsed, so a non-wired/broken runner degrades loudly rather than fabricating.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "node:path";
import type { TransferIntent, IvmsMessage } from "@travelproof/core/types";
const run = promisify(execFile);

// Next runs API routes from apps/web; the runner lives at <repo>/scripts/run-cre.sh. Resolve it off
// cwd by default; CRE_RUNNER (absolute) overrides for other launch dirs.
const RUNNER = process.env.CRE_RUNNER ?? resolve(process.cwd(), "../../scripts/run-cre.sh");

export async function triggerCreRun(jobId: `0x${string}`, intent: TransferIntent, _ivms: IvmsMessage): Promise<{ verifyVerdict: number; screenVerdict: string; txHashes: string[]; publishDate?: string }> {
  const payload = JSON.stringify({ jobId, beneficiaryAddress: intent.beneficiaryChainAddress, beneficiaryName: intent.beneficiary.primaryIdentifier, vaspLei: intent.beneficiaryVaspLei, originatorHash: "0x4d2f", beneficiaryAccount: intent.beneficiary.accountNumber, origVasp: intent.originatingVaspLei, beneVasp: intent.beneficiaryVaspLei, demoHitAddress: process.env.DEMO_HIT_ADDRESS });
  // Two cre-simulate runs + a cold OFAC warm-up on first call; allow generous headroom.
  const { stdout } = await run(RUNNER, [payload], { timeout: 120_000, maxBuffer: 8 * 1024 * 1024 });
  const parsed = JSON.parse(stdout) as { verifyVerdict: number; screenVerdict: string; txHashes: string[]; publishDate?: string };
  return parsed;
}
