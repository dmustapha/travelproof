// DH-5 STRESS: exhaustive classify() truth-table enumeration + legal-honesty invariants.
import { describe, it, expect } from "vitest";
import { classify } from "../src/resolver";
import type { TransferIntent } from "../src/types";

const base = (o: Partial<TransferIntent>): TransferIntent => ({
  amount: "1", assetSymbol: "ETH", fiatValueUsd: 1500,
  originatorIsCasp: true, beneficiaryIsCasp: true,
  beneficiaryChainAddress: "0x" + "b".repeat(40),
  originator: { primaryIdentifier: "A" },
  beneficiary: { primaryIdentifier: "B", accountNumber: "1" },
  originatingVaspLei: "L1", beneficiaryVaspLei: "L2",
  ...o,
}) as TransferIntent;

const caspCombos: Array<[boolean | null, boolean | null]> = [
  [true, true], [true, false], [false, true], [false, false],
  [null, true], [true, null], [null, null],
];
const fiatBoundary = [0, 999.99, 1000, 1000.01, 1500, Number.MAX_SAFE_INTEGER, -1, NaN, Infinity, -Infinity];

describe("classify() - exhaustive truth-table", () => {
  it("every CASP × fiat-boundary combination is deterministic and honest", () => {
    let needsReview = 0, applicable = 0, notEngaged = 0, total = 0;
    for (const [oc, bc] of caspCombos) {
      for (const f of fiatBoundary) {
        total++;
        const r = classify(base({ originatorIsCasp: oc as boolean, beneficiaryIsCasp: bc as boolean, fiatValueUsd: f }));
        // Determinism: a second call must return an identical verdict.
        const r2 = classify(base({ originatorIsCasp: oc as boolean, beneficiaryIsCasp: bc as boolean, fiatValueUsd: f }));
        expect(r).toEqual(r2);
        // Honesty: NEVER present 1010.410(f) as the crypto-VASP authority in a resolver citation.
        expect(r.citation).not.toMatch(/1010\.410\(f\)/);
        // Honesty: resolver never emits "file/filing a travel rule" (transmittal language).
        expect(r.rationale.toLowerCase()).not.toMatch(/fil(e|ing) (a |the )?travel rule/);
        // Unknown CASP status OR bad fiat (when originator is CASP) → NEEDS_HUMAN_REVIEW, never a guess.
        if (oc == null || bc == null) { expect(r.applicable).toBe("NEEDS_HUMAN_REVIEW"); needsReview++; }
        else if (oc === false && bc === false) { expect(r.applicable).toBe(false); notEngaged++; }
        else if (oc === true && (!Number.isFinite(f) || f < 0)) { expect(r.applicable).toBe("NEEDS_HUMAN_REVIEW"); needsReview++; }
        else { expect(r.applicable).toBe(true); applicable++;
               expect(r.citation.length).toBeGreaterThan(0); }
      }
    }
    expect(total).toBe(caspCombos.length * fiatBoundary.length);
    // Sanity: all three terminal classes were exercised.
    expect(needsReview).toBeGreaterThan(0);
    expect(applicable).toBeGreaterThan(0);
    expect(notEngaged).toBeGreaterThan(0);
  });

  it("de-minimis boundary: 999.99 below, 1000 at, 1000.01 above - CASP→CASP regime is EU_TFR always, BOTH above threshold", () => {
    const below = classify(base({ fiatValueUsd: 999.99 }));
    const at = classify(base({ fiatValueUsd: 1000 }));
    const above = classify(base({ fiatValueUsd: 1000.01 }));
    expect(below.regime).toBe("EU_TFR");   // Art.14 no de-minimis
    expect(at.regime).toBe("BOTH");         // >= threshold
    expect(above.regime).toBe("BOTH");
  });

  it("CASP→non-CASP (unhosted) crosses the FATF de-minimis at exactly 1000", () => {
    const below = classify(base({ beneficiaryIsCasp: false, fiatValueUsd: 999.99 }));
    const at = classify(base({ beneficiaryIsCasp: false, fiatValueUsd: 1000 }));
    expect(below.citation).toMatch(/reduced-data regime/);
    expect(at.citation).not.toMatch(/reduced-data regime/);
    expect(below.regime).toBe("FATF_REC16");
    expect(at.regime).toBe("FATF_REC16");
  });

  it("non-CASP originator + CASP beneficiary → inbound flag (out of transmit scope)", () => {
    const r = classify(base({ originatorIsCasp: false, beneficiaryIsCasp: true }));
    expect(r.applicable).toBe(true);
    expect(r.rationale).toMatch(/inbound/i);
  });

  it("negative, NaN, Infinity fiat with CASP originator all escalate (never silently fail open to reduced-data)", () => {
    for (const f of [-1, -0.01, NaN, Infinity, -Infinity]) {
      expect(classify(base({ fiatValueUsd: f })).applicable).toBe("NEEDS_HUMAN_REVIEW");
    }
  });
});
