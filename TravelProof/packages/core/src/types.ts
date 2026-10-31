// File: packages/core/src/types.ts
export type Regime = "EU_TFR" | "FATF_REC16" | "BOTH" | "NONE";
export type VerifyVerdict = 0 | 1 | 2; // 0=PASS 1=FAIL 2=DEGRADED
export type ScreenVerdict = "CLEAR" | "HIT" | "DEGRADED";

export interface TransferIntent {
  amount: string;
  assetSymbol: string;
  fiatValueUsd: number;
  originatorIsCasp: boolean;
  beneficiaryIsCasp: boolean;
  originatorChainAddress?: string;
  beneficiaryChainAddress: string;
  originator: NaturalPersonInput;
  beneficiary: { primaryIdentifier: string; accountNumber: string };
  originatingVaspLei: string;
  beneficiaryVaspLei: string;
}

export interface NaturalPersonInput {
  primaryIdentifier: string;
  secondaryIdentifier?: string;
  customerIdentification?: string;
  nationalIdentifier?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  addressCountry?: string;
  addressLine?: string;
  countryOfResidence?: string;
}

export interface Applicability {
  applicable: boolean | "NEEDS_HUMAN_REVIEW";
  regime: Regime;
  requiredOriginatorFields: string[];
  requiredBeneficiaryFields: string[];
  citation: string;
  rationale: string;
}

// IVMS 101.2023 (entities UpperCamelCase, elements lowerCamelCase)
export type NameIdentifierType = "LEGL" | "BIRT" | "MAID" | "ALIA";
export interface NaturalPersonNameId {
  primaryIdentifier: string;
  secondaryIdentifier?: string;
  naturalPersonNameIdentifierType: NameIdentifierType;
}
export interface NaturalPerson {
  name: { nameIdentifier: NaturalPersonNameId[] };
  geographicAddress?: Array<{ addressType: "GEOG" | "HOME" | "BIZZ"; country: string; addressLine?: string }>;
  nationalIdentification?: { nationalIdentifier: string; nationalIdentifierType: string };
  customerIdentification?: string; // NOTE: not "...Number" (IVMS101.2023)
  dateAndPlaceOfBirth?: { dateOfBirth: string; placeOfBirth: string };
  countryOfResidence?: string;
}
export interface LegalPerson {
  name: { nameIdentifier: Array<{ legalPersonNameIdentifier: string; legalPersonNameIdentifierType: "LEGL" | "SHRT" | "TRAD" }> };
  nationalIdentification?: { nationalIdentifier: string; nationalIdentifierType: "LEIX" | "RAID" | "TXID" | "MISC" };
}
export interface Person { naturalPerson?: NaturalPerson; legalPerson?: LegalPerson; accountNumber?: string[]; }
export interface IvmsMessage {
  Originator: { originatorPerson: Person[] };
  Beneficiary: { beneficiaryPerson: Person[] };
  OriginatingVASP: { originatingVASP: { legalPerson: LegalPerson } };
  BeneficiaryVASP: { beneficiaryVASP: { legalPerson: LegalPerson } };
  PayloadMetadata?: { messageId: string; createdAt: string };
}
export interface ValidationResult {
  complete: boolean;
  violations: Array<{ constraint: "C1" | "C6"; field: string; message: string }>;
}
