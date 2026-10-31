// File: packages/ofac/test/sdn.test.ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseSdn, assertDemoHitPresent } from "../src/sdn";
import { screenAddress, screenName } from "../src/screen";

const xml = readFileSync(new URL("./fixtures/sdn-sample.xml", import.meta.url), "utf8");

describe("SDN parse + screen", () => {
  const idx = parseSdn(xml);
  it("indexes the Garantex XBT address exactly (base58, case-sensitive)", () => {
    expect(screenAddress(idx, "3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1").hit).toBe(true);
    expect(screenAddress(idx, "3lpoy53k625zvee47zasig5jgkaxj27kh1").hit).toBe(false); // base58 case matters
  });
  it("EVM address is case-insensitive", () => {
    expect(screenAddress(idx, "0x7ff9cfad3877f21d41da833e2f775db0569ee3d9").hit).toBe(true);
  });
  it("name fuzzy-matches an aka", () => {
    expect(screenName(idx, "Garantex").hit).toBe(true);
  });
  it("clean address is clear; self-check passes for the demo HIT", () => {
    expect(screenAddress(idx, "0xB0B0000000000000000000000000000000000B0B").hit).toBe(false);
    expect(() => assertDemoHitPresent(idx, "3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1")).not.toThrow();
  });
});

// A-G4 SURVIVOR #5 + Phase-2 Gate: the parser MUST fail closed on an empty / namespace-broken
// parse - never return an empty index (which would screen every address as a false CLEAR).
describe("SDN parse fails closed (never a false CLEAR)", () => {
  it("throws SCREEN_DEGRADED when the root <sdnList> is missing (namespace/parse failure)", () => {
    // A body whose root key is not `sdnList` (e.g. a namespace-prefixed root that removeNSPrefix
    // did not strip, or an unrelated document) must throw, not yield an empty index.
    const broken = `<?xml version="1.0"?><notSdnList><foo>bar</foo></notSdnList>`;
    expect(() => parseSdn(broken)).toThrow(/SCREEN_DEGRADED/);
  });
  it("throws SCREEN_DEGRADED when the list parses to 0 entries", () => {
    const empty = `<sdnList xmlns="https://www.treasury.gov/ofac/downloads/sdn.xsd"><publshInformation><Publish_Date>10/28/2026</Publish_Date><Record_Count>0</Record_Count></publshInformation></sdnList>`;
    expect(() => parseSdn(empty)).toThrow(/SCREEN_DEGRADED/);
  });
});
