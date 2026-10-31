// File: apps/web/lib/cre.ts
// WARNING: UNVERIFIED PATTERN - at wire this shells out to `cre workflow simulate --broadcast`
// or calls a thin runner service. The verdicts returned MUST come from the real run, never fabricated.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { TransferIntent, IvmsMessage } from "@travelproof/core/types";
const run = promisify(execFile);

export async function triggerCreRun(jobId: `0x${string}`, intent: TransferIntent, _ivms: IvmsMessage): Promise<{ verifyVerdict: number; screenVerdict: string; txHashes: string[]; publishDate?: string }> {
  const payload = JSON.stringify({ jobId, beneficiaryAddress: intent.beneficiaryChainAddress, beneficiaryName: intent.beneficiary.primaryIdentifier, vaspLei: intent.beneficiaryVaspLei, originatorHash: "0x", beneficiaryAccount: intent.beneficiary.accountNumber, origVasp: intent.originatingVaspLei, beneVasp: intent.beneficiaryVaspLei, demoHitAddress: process.env.DEMO_HIT_ADDRESS });
  const { stdout } = await run(process.env.CRE_RUNNER ?? "./scripts/run-cre.sh", [payload], { timeout: 60_000 });
  const parsed = JSON.parse(stdout) as { verifyVerdict: number; screenVerdict: string; txHashes: string[]; publishDate?: string };
  return parsed;
}
