// File: scripts/seed-demo.ts
import { writeFileSync } from "node:fs";
import { classify } from "@travelproof/core/resolver";
import { buildIvms } from "@travelproof/core/ivms";
import { commitmentInputFromIvms, jobIdFor } from "@travelproof/core/commitment";
import type { TransferIntent } from "@travelproof/core/types";

// Runs the SAME pipeline the officer uses, against the live OFAC feed via the CRE runner.
// CLEARED: a clean beneficiary address. BLOCKED: the Garantex SDN address.
const base = (beneAddr: string): TransferIntent => ({
  amount: "5000", assetSymbol: "USDC", fiatValueUsd: 5000, originatorIsCasp: true, beneficiaryIsCasp: true,
  beneficiaryChainAddress: beneAddr,
  originator: { primaryIdentifier: "Adeyemi", secondaryIdentifier: "Fatima", customerIdentification: "CUST-558201", countryOfResidence: "NG" },
  beneficiary: { primaryIdentifier: "Okafor", accountNumber: beneAddr },
  originatingVaspLei: "5493001KJTIIGC8Y1R12", beneficiaryVaspLei: "984500AB12CD34EF5678",
});

async function main() {
  const clean = base("0xB0B0000000000000000000000000000000000B0B");
  const blocked = base(process.env.DEMO_HIT_ADDRESS ?? "3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1");
  // verifyVerdict is 0 (PASS) for both seeds — the BLOCK on the Garantex case comes from the
  // SCREEN verdict (HIT), which is a separate on-chain verdict and is NOT part of the commitment.
  const claims = [clean, blocked].map((intent) => {
    const ivms = buildIvms(intent);
    const jobId = jobIdFor(intent.beneficiaryChainAddress, "seed");
    return { jobId, commitment: commitmentInputFromIvms(ivms, 0) };
  });
  writeFileSync("docs/pipeline/claims.json", JSON.stringify(claims, null, 2));
  console.log("Seed intents prepared; run the CRE workflows to attest on-chain, then verify:claims.");
}
main();
