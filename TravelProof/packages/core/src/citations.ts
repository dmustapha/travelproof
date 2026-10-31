// File: packages/core/src/citations.ts
// Frozen citation registry. No citation is composed ad-hoc. Verb-correct (transmittal, never "file").
export const CITATIONS = {
  EU_TFR_ORIG: "Regulation (EU) 2023/1113, Article 14(1)(a)-(d)",
  EU_TFR_BENE: "Regulation (EU) 2023/1113, Article 14(2)(a)-(c)",
  EU_TFR_APPLY: "Regulation (EU) 2023/1113; applicable from 30 December 2024",
  FATF_REC16: "FATF Recommendation 16 (Travel Rule); FATF Updated Guidance VA/VASP (Oct 2021) paras 177-184",
  FATF_DEMINIMIS: "FATF de-minimis threshold USD/EUR 1,000 (INR.16 para 21)",
  FINCEN_CTX: "31 CFR 1010.410(f) (Travel Rule) / 1010.410(e) (Recordkeeping Rule); FinCEN Guidance FIN-2019-G001 (9 May 2019) - CVC exchangers are money transmitters reached by the general $3,000 transmittal rule; no crypto-specific FinCEN Travel Rule exists",
  OFAC_SDN: "OFAC SDN List identifier 'Digital Currency Address - XBT/ETH'; OFAC FAQ 562",
} as const;

export const FATF_DEMINIMIS_USD = 1000;

// Strings the memo/UI must never present (lint target CITATION_LINT_FAIL).
export const BANNED_CITATION_PATTERNS: RegExp[] = [
  /1010\.410\(f\)[^.]*crypto[- ]?(asset )?VASP/i, // 1010.410(f) presented AS the crypto-VASP authority
  /\bfil(e|ing)\b(?=[^.]*travel rule)/i,          // "file/filing" a travel rule (it is a transmittal)
  /OFAC[^.]*\b\d{3,}\b[^.]*digital currency addresses?/i, // a Treasury-attributed address count (none exists)
];
