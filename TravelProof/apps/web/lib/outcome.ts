// One classifier for every surface (web record, PDF memo, cockpit, gates). A live run can end four ways;
// copy, gates and required action must never describe one as another (e.g. a verify failure is NOT an SDN hit).
export type Outcome = "CLEARED" | "SDN_HIT" | "VERIFY_FAILED" | "VERIFY_DEGRADED" | "SCREEN_DEGRADED";

export function outcomeOf(verifyVerdict: number, screenVerdict: string): Outcome {
  if (screenVerdict === "HIT") return "SDN_HIT";
  if (verifyVerdict === 1) return "VERIFY_FAILED";
  if (verifyVerdict !== 0) return "VERIFY_DEGRADED";
  if (screenVerdict === "CLEAR") return "CLEARED";
  return "SCREEN_DEGRADED";
}

export const OUTCOME_LINE: Record<Outcome, string> = {
  CLEARED: "Applicable · counterparty verified · no OFAC SDN match",
  SDN_HIT: "Beneficiary address matches an OFAC SDN Digital Currency Address",
  VERIFY_FAILED: "Counterparty did not verify as a registered CASP",
  VERIFY_DEGRADED: "Counterparty verification could not be completed; no verdict was reached",
  SCREEN_DEGRADED: "OFAC screening could not be completed; no verdict was reached",
};

export const REQUIRED_ACTION: Record<Exclude<Outcome, "CLEARED">, string> = {
  SDN_HIT: "Where a US nexus exists, block the funds and file a blocked-property report within 10 business days (31 CFR 501.603). Under the EU regime, freeze the funds and report to the national competent authority under the applicable EU sanctions regulation; consider a suspicious transaction report to the FIU separately. This build files none of these.",
  VERIFY_FAILED: "Do not transmit. Confirm the beneficiary CASP's registration and LEI before any retry, and escalate to the compliance officer. This result indicates no sanctions match and creates no blocking or reporting duty by itself.",
  VERIFY_DEGRADED: "Do not transmit. Counterparty verification did not complete; no verdict exists. Retry once the verification service is available and escalate if it persists.",
  SCREEN_DEGRADED: "Do not transmit. OFAC screening did not complete; no verdict exists. Retry once the screening source is available and escalate if it persists.",
};
