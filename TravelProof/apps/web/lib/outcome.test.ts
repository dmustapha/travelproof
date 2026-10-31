import { test } from "node:test";
import assert from "node:assert/strict";
import { outcomeOf, REQUIRED_ACTION, OUTCOME_LINE } from "./outcome";
import { gatesFor } from "../components/Seal";

test("a verify failure is never described as an SDN hit", () => {
  assert.equal(outcomeOf(1, "CLEAR"), "VERIFY_FAILED");
  assert.equal(outcomeOf(1, "DEGRADED"), "VERIFY_FAILED");
  assert.doesNotMatch(REQUIRED_ACTION.VERIFY_FAILED, /501\.603|blocked-property/);
  assert.doesNotMatch(OUTCOME_LINE.VERIFY_FAILED, /OFAC/);
});
test("degraded states are not hits and not clears", () => {
  assert.equal(outcomeOf(2, "CLEAR"), "VERIFY_DEGRADED");
  assert.equal(outcomeOf(0, "DEGRADED"), "SCREEN_DEGRADED");
  assert.equal(outcomeOf(0, "CLEAR"), "CLEARED");
  assert.equal(outcomeOf(0, "HIT"), "SDN_HIT");
  assert.equal(outcomeOf(2, "HIT"), "SDN_HIT");
});
test("only the SDN hit carries the OFAC blocking duty", () => {
  assert.match(REQUIRED_ACTION.SDN_HIT, /501\.603/);
  for (const k of ["VERIFY_FAILED", "VERIFY_DEGRADED", "SCREEN_DEGRADED"] as const) assert.doesNotMatch(REQUIRED_ACTION[k], /501\.603/);
});
test("gates never show a pass for work that did not complete", () => {
  const degraded = gatesFor({ stage: "DO_NOT_TRANSMIT", verifyVerdict: 0, screenVerdict: "DEGRADED", attested: false });
  assert.deepEqual(degraded.gates, ["pass", "pass", "idle", "open"]);
  const vfail = gatesFor({ stage: "DO_NOT_TRANSMIT", verifyVerdict: 1, screenVerdict: "CLEAR", attested: false });
  assert.deepEqual(vfail.gates, ["pass", "fail", "idle", "open"]);
  const vdeg = gatesFor({ stage: "DO_NOT_TRANSMIT", verifyVerdict: 2, screenVerdict: "CLEAR", attested: false });
  assert.deepEqual(vdeg.gates, ["pass", "idle", "idle", "open"]);
  const hit = gatesFor({ stage: "DO_NOT_TRANSMIT", verifyVerdict: 0, screenVerdict: "HIT", attested: true });
  assert.deepEqual(hit.gates, ["pass", "pass", "fail", "pass"]);
});
test("an SDN hit shows on the SCREEN gate even when verification failed", () => {
  assert.deepEqual(gatesFor({ stage: "DO_NOT_TRANSMIT", verifyVerdict: 1, screenVerdict: "HIT", attested: false }).gates, ["pass", "fail", "fail", "open"]);
});
test("an unattested clear never marks the attest gate passed", () => {
  assert.equal(gatesFor({ stage: "CLEARED", attested: false }).gates[3], "open");
  assert.equal(gatesFor({ stage: "CLEARED", attested: true }).gates[3], "pass");
});

import { attestationMatches } from "./attest";
test("attestation must match the run exactly (hash + both verdicts)", () => {
  const run = { commitmentHash: "0xaa" as `0x${string}`, verifyVerdict: 0, screenVerdict: "HIT" };
  assert.equal(attestationMatches(run, null), false);
  assert.equal(attestationMatches(run, { commitmentHash: "0xAA", verifyVerdict: 0, screenVerdict: 1, ts: 1 }), true);
  assert.equal(attestationMatches(run, { commitmentHash: "0xaa", verifyVerdict: 0, screenVerdict: 0, ts: 1 }), false); // screen not landed / differs
  assert.equal(attestationMatches(run, { commitmentHash: "0xbb", verifyVerdict: 0, screenVerdict: 1, ts: 1 }), false);
});
