// File: packages/core/test/ivms.test.ts
import { describe, it, expect } from "vitest";
import { buildIvms, validateIvms } from "../src/ivms";
import type { TransferIntent } from "../src/types";

const intent = (cust?: string): TransferIntent => ({
  amount: "1", assetSymbol: "USDC", fiatValueUsd: 5000, originatorIsCasp: true, beneficiaryIsCasp: true,
  beneficiaryChainAddress: "0xB0B", originator: { primaryIdentifier: "Adeyemi", customerIdentification: cust },
  beneficiary: { primaryIdentifier: "Okafor", accountNumber: "0xB0B" }, originatingVaspLei: "L1", beneficiaryVaspLei: "L2",
});

describe("IVMS validate", () => {
  it("complete when customerIdentification present (C1) + LEGL (C6)", () => {
    expect(validateIvms(buildIvms(intent("CUST-1"))).complete).toBe(true);
  });
  it("C1 violation when no identifying element", () => {
    const r = validateIvms(buildIvms(intent(undefined)));
    expect(r.complete).toBe(false);
    expect(r.violations.some((v) => v.constraint === "C1")).toBe(true);
  });
});
