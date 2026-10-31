// File: packages/ofac/src/screen.ts
// fuzzball is a CommonJS module whose module.exports IS the function bag (no `default` export);
// under ESM/vitest a default import resolves to undefined, so bind the namespace.
import * as fuzz from "fuzzball";
import type { SdnIndex } from "./sdn";

function isEvm(addr: string): boolean { return /^0x[0-9a-fA-F]{40}$/.test(addr); }

export function screenAddress(idx: SdnIndex, addr: string): { hit: boolean; uid?: string } {
  if (isEvm(addr)) {
    return { hit: idx.addressesLower.has(addr.toLowerCase()) }; // EVM case-insensitive
  }
  return { hit: idx.addresses.has(addr) }; // base58 case-sensitive - do NOT lowercase
}

export function screenName(idx: SdnIndex, name: string, threshold = 85): { hit: boolean; uid?: string; score?: number } {
  const norm = name.trim().toUpperCase();
  let best = { score: 0, uid: "" };
  for (const n of idx.names) {
    const score = fuzz.token_sort_ratio(norm, n.name.toUpperCase());
    if (score > best.score) best = { score, uid: n.uid };
  }
  return best.score >= threshold ? { hit: true, uid: best.uid, score: best.score } : { hit: false, score: best.score };
}
