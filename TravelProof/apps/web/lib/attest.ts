import { getAttestation, type AttestationView } from "./chain";
import type { RunRecord } from "./runStore";

const SCREEN_ENUM: Record<string, number> = { CLEAR: 0, HIT: 1, DEGRADED: 2 };

// A record is "attested" only if the chain holds EXACTLY what this run computed (hash + both verdicts).
// Residual limit (contract-level): an unwritten screen verdict reads 0 == CLEAR, so a CLEAR run whose screen
// report has not landed yet cannot be told apart from a complete attestation.
export function attestationMatches(run: Pick<RunRecord, "commitmentHash" | "verifyVerdict" | "screenVerdict">, att: AttestationView | null): boolean {
  if (!att) return false;
  return att.commitmentHash.toLowerCase() === run.commitmentHash.toLowerCase()
    && att.verifyVerdict === run.verifyVerdict
    && att.screenVerdict === (SCREEN_ENUM[run.screenVerdict] ?? -1);
}

export async function readAttestation(jobId: string): Promise<AttestationView | null> {
  try { return await getAttestation(jobId as `0x${string}`); } catch { return null; }
}
