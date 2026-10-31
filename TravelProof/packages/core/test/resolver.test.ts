// File: packages/core/test/resolver.test.ts
import { describe, it, expect } from "vitest";
import { classify } from "../src/resolver";
import type { TransferIntent } from "../src/types";

const base = (o: boolean, b: boolean, usd: number): TransferIntent => ({
  amount: "1", assetSymbol: "USDC", fiatValueUsd: usd, originatorIsCasp: o, beneficiaryIsCasp: b,
  beneficiaryChainAddress: "0xB0B", originator: { primaryIdentifier: "A", customerIdentification: "C" },
  beneficiary: { primaryIdentifier: "B", accountNumber: "0xB0B" }, originatingVaspLei: "L1", beneficiaryVaspLei: "L2",
});

describe("resolver truth table", () => {
  it("CASP->CASP below FATF threshold still applies under EU TFR", () => {
    const r = classify(base(true, true, 500));
    expect(r.applicable).toBe(true);
    expect(r.regime).toBe("EU_TFR");
  });
  it("CASP->CASP above threshold is BOTH", () => {
    expect(classify(base(true, true, 5000)).regime).toBe("BOTH");
  });
  it("no CASP in path is NONE/false", () => {
    const r = classify(base(false, false, 9999));
    expect(r.applicable).toBe(false);
    expect(r.regime).toBe("NONE");
  });
  it("determinism: same input, same output", () => {
    expect(classify(base(true, true, 5000))).toEqual(classify(base(true, true, 5000)));
  });
});
