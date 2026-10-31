// File: packages/core/src/resolver.ts
import type { TransferIntent, Applicability } from "./types";
import { CITATIONS, FATF_DEMINIMIS_USD } from "./citations";

const ORIG_FIELDS_FULL = [
  "name",
  "accountNumber",
  "geographicAddress|customerIdentification|nationalIdentification|dateAndPlaceOfBirth",
];
const BENE_FIELDS = ["name", "accountNumber"];

export function classify(intent: TransferIntent): Applicability {
  const { originatorIsCasp, beneficiaryIsCasp, fiatValueUsd } = intent;

  // Row 7: cannot encode CASP status -> never guess.
  if (originatorIsCasp == null || beneficiaryIsCasp == null) {
    return {
      applicable: "NEEDS_HUMAN_REVIEW",
      regime: "NONE",
      requiredOriginatorFields: [],
      requiredBeneficiaryFields: [],
      citation: "",
      rationale: "Counterparty CASP status is unknown; applicability cannot be determined deterministically.",
    };
  }

  // Row 6: no CASP in the path -> not engaged.
  if (!originatorIsCasp && !beneficiaryIsCasp) {
    return {
      applicable: false,
      regime: "NONE",
      requiredOriginatorFields: [],
      requiredBeneficiaryFields: [],
      citation: "",
      rationale: "No crypto-asset service provider is party to this transfer; the Travel Rule is not engaged.",
    };
  }

  // Row 5: inbound only (we send; originator not a CASP but beneficiary is) -> flag inbound.
  if (!originatorIsCasp && beneficiaryIsCasp) {
    return {
      applicable: true,
      regime: "EU_TFR",
      requiredOriginatorFields: ORIG_FIELDS_FULL,
      requiredBeneficiaryFields: BENE_FIELDS,
      citation: `${CITATIONS.EU_TFR_BENE}; ${CITATIONS.EU_TFR_APPLY}`,
      rationale: "Beneficiary-side obligation under EU TFR; TravelProof covers the originator side. Flagged inbound (out of transmit scope).",
    };
  }

  // originatorIsCasp == true from here.
  // Guard: a non-finite or negative fiat value cannot be classified against the
  // FATF de-minimis without silently failing open to the reduced-data regime
  // (NaN >= 1000 is false). Escalate to human review rather than guess.
  if (!Number.isFinite(fiatValueUsd) || fiatValueUsd < 0) {
    return {
      applicable: "NEEDS_HUMAN_REVIEW",
      regime: "NONE",
      requiredOriginatorFields: [],
      requiredBeneficiaryFields: [],
      citation: "",
      rationale: "Transfer value is missing, negative, or non-finite; de-minimis applicability cannot be determined deterministically.",
    };
  }

  const overThreshold = fiatValueUsd >= FATF_DEMINIMIS_USD;

  // Rows 1-2: CASP -> CASP.
  if (beneficiaryIsCasp) {
    if (overThreshold) {
      return {
        applicable: true,
        regime: "BOTH",
        requiredOriginatorFields: ORIG_FIELDS_FULL,
        requiredBeneficiaryFields: BENE_FIELDS,
        citation: `${CITATIONS.EU_TFR_ORIG}; ${CITATIONS.FATF_REC16}`,
        rationale: "Crypto-asset transfer between CASPs. EU TFR Article 14 applies regardless of value; the value also exceeds the FATF USD/EUR 1,000 de-minimis.",
      };
    }
    return {
      applicable: true,
      regime: "EU_TFR",
      requiredOriginatorFields: ORIG_FIELDS_FULL,
      requiredBeneficiaryFields: BENE_FIELDS,
      citation: `${CITATIONS.EU_TFR_ORIG}; ${CITATIONS.EU_TFR_APPLY}`,
      rationale: "Crypto-asset transfer between CASPs. EU TFR Article 14 applies with no de-minimis, even below the FATF USD/EUR 1,000 threshold.",
    };
  }

  // Rows 3-4: CASP -> non-CASP (unhosted / self-custody beneficiary).
  return {
    applicable: true,
    regime: "FATF_REC16",
    requiredOriginatorFields: ORIG_FIELDS_FULL,
    requiredBeneficiaryFields: BENE_FIELDS,
    citation: overThreshold
      ? `${CITATIONS.FATF_REC16}`
      : `${CITATIONS.FATF_REC16}; ${CITATIONS.FATF_DEMINIMIS} (reduced-data regime)`,
    rationale: overThreshold
      ? "Originating CASP owes required originator information; the counterparty is an unhosted/non-CASP wallet."
      : "Below the FATF de-minimis; reduced data (names + account/identifier) without verification unless suspicion.",
  };
}
