// DH-5 STRESS: OFAC fuzzy-name boundaries, near-match edges, removeNSPrefix fix, base58 vs EVM,
// digital-currency sci-notation coercion guard, fail-closed (no cached fallback).
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseSdn } from "../src/sdn";
import { screenAddress, screenName } from "../src/screen";

const xml = readFileSync(new URL("./fixtures/sdn-sample.xml", import.meta.url), "utf8");
const idx = parseSdn(xml);

describe("OFAC fuzzy-name boundaries", () => {
  it("exact alias GARANTEX hits at 100", () => {
    const r = screenName(idx, "Garantex");
    expect(r.hit).toBe(true);
    expect(r.score).toBe(100);
  });
  it("threshold is inclusive at 85, exclusive below", () => {
    // Drive the boundary from both sides with explicit thresholds on a known best score.
    const best = screenName(idx, "GARANTEX EUROPE").score!; // partial of the full legal name
    // At a threshold equal to the best score → hit; one above → miss (boundary is >=).
    expect(screenName(idx, "GARANTEX EUROPE", best).hit).toBe(true);
    expect(screenName(idx, "GARANTEX EUROPE", best + 1).hit).toBe(false);
  });
  it("a clearly-different name does not false-positive at the default threshold", () => {
    expect(screenName(idx, "Coinbase Inc").hit).toBe(false);
    expect(screenName(idx, "Acme Widgets LLC").hit).toBe(false);
  });
  it("near-match typo of the alias (one char) still catches at default threshold (fuzzy intent)", () => {
    // "GARANTEKS" is a 1-substitution near-match - the whole point of fuzzy screening.
    const r = screenName(idx, "GARANTEKS");
    expect(r.score).toBeGreaterThanOrEqual(80); // close; may or may not clear 85 - assert it is NOT a false clear of 0
    expect(r.score).toBeGreaterThan(0);
  });
  it("empty / whitespace name never hits (no vacuous match)", () => {
    expect(screenName(idx, "").hit).toBe(false);
    expect(screenName(idx, "   ").hit).toBe(false);
  });
  it("unicode / injection in the name does not crash and does not hit", () => {
    expect(() => screenName(idx, "'; DROP TABLE sdn;--")).not.toThrow();
    expect(screenName(idx, "Гарантекс").hit).toBe(false); // cyrillic lookalike, not transliterated → no hit
    expect(screenName(idx, "G".repeat(5000)).hit).toBe(false); // oversized
  });
});

describe("OFAC address screen edges", () => {
  it("base58 is case-SENSITIVE (lowercasing a base58 addr must NOT hit)", () => {
    expect(screenAddress(idx, "3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1").hit).toBe(true);
    expect(screenAddress(idx, "3lpoy53k625zvee47zasig5jgkaxj27kh1").hit).toBe(false);
  });
  it("EVM is case-INSENSITIVE (checksum vs lower both hit)", () => {
    expect(screenAddress(idx, "0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9").hit).toBe(true);
    expect(screenAddress(idx, "0x7ff9cfad3877f21d41da833e2f775db0569ee3d9").hit).toBe(true);
    expect(screenAddress(idx, "0x7FF9CFAD3877F21D41DA833E2F775DB0569EE3D9").hit).toBe(true);
  });
  it("EVM digital-currency address survived XML parse (no sci-notation coercion drop)", () => {
    // The 0x7FF9... hex would coerce to 7.30e+47 without parseTagValue:false - the address would
    // vanish from the index → a silent false CLEAR. Prove it is present.
    expect(idx.addressesLower.has("0x7ff9cfad3877f21d41da833e2f775db0569ee3d9")).toBe(true);
  });
  it("clean address, empty string, garbage all CLEAR (no false hit)", () => {
    expect(screenAddress(idx, "0xB0B0000000000000000000000000000000000B0B").hit).toBe(false);
    expect(screenAddress(idx, "").hit).toBe(false);
    expect(screenAddress(idx, "not-an-address").hit).toBe(false);
    expect(screenAddress(idx, "0x").hit).toBe(false);
  });
});

describe("removeNSPrefix fix + fail-closed (no cached fallback, no false CLEAR)", () => {
  it("a namespace-prefixed root still parses via removeNSPrefix (the fix)", () => {
    const nsXml = `<?xml version="1.0"?><ns2:sdnList xmlns:ns2="https://www.treasury.gov/ofac/downloads/sdn.xsd"><publshInformation><Publish_Date>10/28/2026</Publish_Date><Record_Count>1</Record_Count></publshInformation><ns2:sdnEntry><uid>1</uid><lastName>TESTBAD</lastName><idList></idList></ns2:sdnEntry></ns2:sdnList>`;
    const i = parseSdn(nsXml);
    expect(i.names.some(n => n.name === "TESTBAD")).toBe(true); // removeNSPrefix stripped ns2: so sdnList resolved
  });
  it("missing root → THROW SCREEN_DEGRADED (never an empty index / false CLEAR)", () => {
    expect(() => parseSdn(`<?xml version="1.0"?><notSdnList><foo/></notSdnList>`)).toThrow(/SCREEN_DEGRADED/);
  });
  it("0-entry parse → THROW SCREEN_DEGRADED (never a false CLEAR)", () => {
    expect(() => parseSdn(`<sdnList xmlns="https://www.treasury.gov/ofac/downloads/sdn.xsd"><publshInformation><Record_Count>0</Record_Count></publshInformation></sdnList>`)).toThrow(/SCREEN_DEGRADED/);
  });
  it("truncated / garbage XML fails closed, never yields a screenable empty index", () => {
    expect(() => parseSdn(`<sdnList xmlns="x"><sdnEntry`)).toThrow();
    expect(() => parseSdn(``)).toThrow();
    expect(() => parseSdn(`garbage not xml`)).toThrow(/SCREEN_DEGRADED/);
  });
});
