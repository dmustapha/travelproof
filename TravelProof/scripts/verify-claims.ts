// File: scripts/verify-claims.ts
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

// Re-derives each headline claim from committed data and compares to on-chain. Writes evidence/.
// Each claim carries the exact CommitmentInput (beneVasp, beneficiaryAccount, origVasp, verifyVerdict)
// so the recompute uses the SAME canonical serialization the verify workflow wrote on-chain.
//
// PHASE-0 NOTE (DEV-001): @travelproof/core/commitment and ../apps/web/lib/chain are authored in
// later phases (C2 / C10). To keep `verify:claims` runnable on the empty ledger at C0 — the
// franchise-skeleton honesty gate — the recompute dependencies are imported dynamically INSIDE the
// per-claim loop. On the empty ledger the loop never runs, so no missing module is touched; once
// core/chain land the real recompute path executes unchanged. This is the exact ARCHITECTURE §11
// logic, deferred-imported.
async function main() {
  const claims = JSON.parse(readFileSync("docs/pipeline/claims.json", "utf8")) as Array<{ jobId: `0x${string}`; commitment: { beneVasp: string; beneficiaryAccount: string; origVasp: string; verifyVerdict: number } }>;
  mkdirSync("evidence", { recursive: true });
  const results = [];
  for (const c of claims) {
    const { commitmentHash } = await import("@travelproof/core/commitment");
    const { getAttestation } = await import("../apps/web/lib/chain");
    const recomputed = commitmentHash(c.commitment);
    const onchain = await getAttestation(c.jobId);
    const match = onchain?.commitmentHash?.toLowerCase() === recomputed.toLowerCase();
    results.push({ jobId: c.jobId, recomputed, onchain: onchain?.commitmentHash ?? null, match });
    if (!match) console.error(`CLAIM MISMATCH for ${c.jobId}`);
  }
  writeFileSync("evidence/verify-claims.json", JSON.stringify(results, null, 2));
  if (results.some((r) => !r.match)) process.exit(1);
  console.log("All claims recompute and match on-chain.");
}
main();
