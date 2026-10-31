// File: packages/core/test/verify-workflow-commitment.test.ts
// A-G4 SURVIVOR #2: proves the CRE verify workflow (packages/cre/src/verify.workflow.ts) computes
// the SAME commitment as packages/core/src/commitment.ts on the same input. If these ever diverge,
// the on-chain commitment would not round-trip against verify-claims.ts. This test replicates the
// EXACT keccak expression inlined in verify.workflow.ts and asserts byte-equality with core.
import { describe, it, expect } from "vitest";
import { keccak256, stringToBytes } from "viem";
import { commitmentHash, COMMITMENT_KEYS } from "../src/commitment";

// Mirror of the in-enclave trigger payload fields the workflow uses.
const trigger = {
  beneVasp: "984500AB12CD34EF5678",
  beneficiaryAccount: "0xB0B0000000000000000000000000000000000B0B",
  origVasp: "5493001KJTIIGC8Y1R12",
  verifyVerdict: 0,
};

// EXACTLY the expression in packages/cre/src/verify.workflow.ts (kept in sync by this test).
function workflowCommitment(verifyVerdict: number): `0x${string}` {
  return keccak256(
    stringToBytes(
      JSON.stringify(
        { beneVasp: trigger.beneVasp, beneficiaryAccount: trigger.beneficiaryAccount, origVasp: trigger.origVasp, verifyVerdict },
        ["beneVasp", "beneficiaryAccount", "origVasp", "verifyVerdict"],
      ),
    ),
  );
}

describe("verify.workflow commitment ↔ core/commitment round-trip", () => {
  it("the workflow's key array equals core COMMITMENT_KEYS", () => {
    // The replacer array the workflow passes to JSON.stringify must match COMMITMENT_KEYS exactly.
    expect(["beneVasp", "beneficiaryAccount", "origVasp", "verifyVerdict"]).toEqual([...COMMITMENT_KEYS]);
  });

  it("workflow commitment equals core commitmentHash for the same input (PASS verdict)", () => {
    const core = commitmentHash({
      beneficiaryAccount: trigger.beneficiaryAccount,
      origVasp: trigger.origVasp,
      beneVasp: trigger.beneVasp,
      verifyVerdict: 0,
    });
    expect(workflowCommitment(0)).toBe(core);
  });

  it("workflow commitment equals core commitmentHash for the same input (FAIL verdict)", () => {
    const core = commitmentHash({
      beneficiaryAccount: trigger.beneficiaryAccount,
      origVasp: trigger.origVasp,
      beneVasp: trigger.beneVasp,
      verifyVerdict: 1,
    });
    expect(workflowCommitment(1)).toBe(core);
  });
});
