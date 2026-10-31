// SPECIMEN records for the design harness + landing. Built by the REAL core (classify/buildIvms/commitment);
// only the CRE verdicts are absent, so these carry NO chain claim and are always labelled SPECIMEN.
import { classify } from "@travelproof/core/resolver";
import { buildIvms } from "@travelproof/core/ivms";
import { commitmentHash, commitmentInputFromIvms, jobIdFor } from "@travelproof/core/commitment";
import type { TransferIntent } from "@travelproof/core/types";

export const DEMO_HIT = "3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1";
export const BTC_ORIG = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
const base = (addr: string, btc: boolean): TransferIntent => ({
  amount: btc ? "0.0795" : "5000", assetSymbol: btc ? "BTC" : "USDC", fiatValueUsd: 5000, originatorIsCasp: true, beneficiaryIsCasp: true,
  beneficiaryChainAddress: addr, originatorChainAddress: btc ? BTC_ORIG : "0x7A1CE5Fd09c4E2b8a2B6d3C1e0F4a9D8b7C6E5f4",
  originator: { primaryIdentifier: "Adeyemi Fatima", customerIdentification: "CUST-558201", countryOfResidence: "NG" },
  beneficiary: { primaryIdentifier: "Okafor", accountNumber: addr },
  originatingVaspLei: "5493001KJTIIGC8Y1R12", beneficiaryVaspLei: "984500AB12CD34EF5678",
} as any);

export function specimen(kind: "cleared" | "blocked") {
  const addr = kind === "cleared" ? "0xB0B0000000000000000000000000000000000B0B" : DEMO_HIT;
  const intent = base(addr, kind === "blocked");
  const applicability = classify(intent);
  const ivms = buildIvms(intent);
  const verifyVerdict = 0, screenVerdict = kind === "cleared" ? "CLEAR" : "HIT";
  const jobId = jobIdFor(addr, "specimen");
  const commitment = commitmentHash(commitmentInputFromIvms(ivms, verifyVerdict));
  return { jobId, applicability, ivms, verifyVerdict, screenVerdict, commitmentHash: commitment, txHash: undefined as string | undefined, publishDate: undefined as string | undefined, createdAt: 0, intent, transfer: { amount: intent.amount, assetSymbol: intent.assetSymbol, fiatValueUsd: intent.fiatValueUsd } };
}
