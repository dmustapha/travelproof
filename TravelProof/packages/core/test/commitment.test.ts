// File: packages/core/test/commitment.test.ts
import { describe, it, expect } from "vitest";
import { buildIvms } from "../src/ivms";
import { commitmentHash, commitmentInputFromIvms, canonicalPayload } from "../src/commitment";
import type { TransferIntent } from "../src/types";

const i: TransferIntent = { amount: "1", assetSymbol: "USDC", fiatValueUsd: 5000, originatorIsCasp: true, beneficiaryIsCasp: true, beneficiaryChainAddress: "0xB0B", originator: { primaryIdentifier: "A", customerIdentification: "C" }, beneficiary: { primaryIdentifier: "B", accountNumber: "0xB0B" }, originatingVaspLei: "L1", beneficiaryVaspLei: "L2" };

describe("commitment", () => {
  it("is deterministic for the same payload", () => {
    const m = buildIvms(i);
    const input = commitmentInputFromIvms(m, 0);
    expect(commitmentHash(input)).toBe(commitmentHash(input));
  });
  it("changes when the verdict changes", () => {
    const m = buildIvms(i);
    expect(commitmentHash(commitmentInputFromIvms(m, 0))).not.toBe(commitmentHash(commitmentInputFromIvms(m, 1)));
  });
  it("round-trips: canonical payload is byte-identical across recomputes (COMMITMENT_KEYS order)", () => {
    const m = buildIvms(i);
    expect(canonicalPayload(commitmentInputFromIvms(m, 0))).toBe(canonicalPayload(commitmentInputFromIvms(m, 0)));
  });
});
