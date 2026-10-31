// DH-5 STRESS: exhaustive outcomeOf truth-table + honesty invariants.
import { test } from "node:test";
import assert from "node:assert/strict";
import { outcomeOf, OUTCOME_LINE, REQUIRED_ACTION, type Outcome } from "./outcome";

const verifyDomain = [0, 1, 2, -1, 3, NaN];
const screenDomain = ["CLEAR", "HIT", "DEGRADED", "", "clear", "hit", "xyz"];

// 1. EXHAUSTIVE enumeration - every input combination lands on a defined outcome and the
//    OFAC blocking duty attaches to EXACTLY one outcome (SDN_HIT).
test("exhaustive: every (verify × screen) maps to a defined outcome; only SDN_HIT carries OFAC text", () => {
  let sdnHitCount = 0, clearedCount = 0, total = 0;
  for (const v of verifyDomain) {
    for (const s of screenDomain) {
      total++;
      const o = outcomeOf(v, s);
      assert.ok(["CLEARED", "SDN_HIT", "VERIFY_FAILED", "VERIFY_DEGRADED", "SCREEN_DEGRADED"].includes(o),
        `undefined outcome for v=${v} s=${s}: ${o}`);
      // Invariant A: SDN_HIT iff screen === "HIT" (HIT precedence over everything)
      assert.equal(o === "SDN_HIT", s === "HIT", `SDN_HIT precedence broken v=${v} s=${s}`);
      // Invariant B: only SDN_HIT's required action carries the 501.603 / blocked-property duty
      if (o !== "CLEARED") {
        const action = REQUIRED_ACTION[o as Exclude<Outcome, "CLEARED">];
        if (o === "SDN_HIT") { sdnHitCount++; assert.match(action, /501\.603|blocked-property/); }
        else assert.doesNotMatch(action, /501\.603|blocked-property/, `non-HIT ${o} must not carry OFAC blocking duty`);
      }
      // Invariant C: CLEARED is unreachable unless verify==0 AND screen==="CLEAR"
      if (o === "CLEARED") { clearedCount++; assert.ok(v === 0 && s === "CLEAR", `fabricated CLEARED v=${v} s=${s}`); }
      // Invariant D: only SDN_HIT's line asserts a POSITIVE OFAC match. CLEARED legitimately says
      // "no OFAC SDN match" (a negative); the distinction that matters is the blocking-duty text,
      // already covered by invariant B. Here: no non-HIT line may claim a positive match.
      if (o !== "SDN_HIT") assert.doesNotMatch(OUTCOME_LINE[o], /matches an OFAC SDN/, `non-HIT ${o} line claims a positive OFAC match`);
    }
  }
  assert.equal(total, verifyDomain.length * screenDomain.length);
  assert.equal(sdnHitCount, verifyDomain.length, "every verify value with screen=HIT must be SDN_HIT");
  assert.equal(clearedCount, 1, "exactly one (0,CLEAR) cell may be CLEARED");
});

// 2. No off-domain verify value sneaks into CLEARED or VERIFY_FAILED when screen is clean.
test("off-domain verify values fail safe (never CLEARED, never a fabricated FAILED)", () => {
  assert.equal(outcomeOf(3, "CLEAR"), "VERIFY_DEGRADED");   // unknown verify → degraded, not cleared
  assert.equal(outcomeOf(-1, "CLEAR"), "VERIFY_DEGRADED");
  assert.equal(outcomeOf(NaN, "CLEAR"), "VERIFY_DEGRADED");
  assert.equal(outcomeOf(NaN, ""), "VERIFY_DEGRADED");      // NaN!==0 → degraded before screen junk
});

// 3. Precedence: a verify failure AND an SDN hit → SDN_HIT wins (sanctions dominate).
test("SDN hit dominates a concurrent verify failure", () => {
  assert.equal(outcomeOf(1, "HIT"), "SDN_HIT");
  assert.equal(outcomeOf(2, "HIT"), "SDN_HIT");
});
