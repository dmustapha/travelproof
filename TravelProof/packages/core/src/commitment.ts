// File: packages/core/src/commitment.ts
import { keccak256, toHex, stringToBytes } from "viem";
import type { IvmsMessage } from "./types";

// The commitment anchors the VERIFY-side payload the enclave processed - the exact fields the
// CRE verify workflow has at report time (NOT the screen verdict, which is a separate parallel
// DON verdict, and NOT the originator name, which the workflow sees only as a hash). ONE canonical
// serialization, used identically by verify.workflow.ts and verify-claims.ts (round-trip).
export interface CommitmentInput {
  beneficiaryAccount: string;
  origVasp: string;
  beneVasp: string;
  verifyVerdict: number;
}

// Deterministic: keys emitted in sorted order so both legs produce byte-identical JSON.
export const COMMITMENT_KEYS = ["beneVasp", "beneficiaryAccount", "origVasp", "verifyVerdict"] as const;
export function canonicalPayload(p: CommitmentInput): string {
  return JSON.stringify(p, COMMITMENT_KEYS as unknown as string[]);
}
export function commitmentHash(p: CommitmentInput): `0x${string}` {
  return keccak256(stringToBytes(canonicalPayload(p)));
}

// Helper to derive the commitment input from an IVMS message + verify verdict (used by api/run + seed).
export function commitmentInputFromIvms(msg: IvmsMessage, verifyVerdict: number): CommitmentInput {
  return {
    beneficiaryAccount: msg.Beneficiary.beneficiaryPerson[0]?.accountNumber?.[0] ?? "",
    origVasp: msg.OriginatingVASP.originatingVASP.legalPerson.nationalIdentification?.nationalIdentifier ?? "",
    beneVasp: msg.BeneficiaryVASP.beneficiaryVASP.legalPerson.nationalIdentification?.nationalIdentifier ?? "",
    verifyVerdict,
  };
}

export function jobIdFor(beneficiaryAddress: string, salt: string): `0x${string}` {
  return keccak256(stringToBytes(`${beneficiaryAddress}:${salt}`));
}

export { toHex };
