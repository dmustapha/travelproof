// File: packages/vasp-registry/src/trisa.ts
// WARNING: UNVERIFIED PATTERN - the TRISA GDS is primarily gRPC; the testnet directory also exposes
// an HTTP/JSON surface at api.testnet.directory. Confirm the exact lookup path + response shape at wire
// (probe: GET https://api.testnet.directory/v1/vasps?... or the GDS Lookup). Registration lookup is REAL;
// the originator attribute-match remains synthetic (mTLS handshake out of scope - DISCLOSED).
export interface TrisaLookup { registered: boolean; vaspName: string | null; source: "TRISA_TESTNET_DIRECTORY" | "SYNTHETIC_FALLBACK"; }

export async function trisaDirectoryLookup(vaspLeiOrName: string): Promise<TrisaLookup> {
  const base = process.env.TRISA_DIRECTORY_URL ?? "https://api.testnet.directory";
  try {
    const res = await fetch(`${base}/v1/vasps?query=${encodeURIComponent(vaspLeiOrName)}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`TRISA directory HTTP ${res.status}`);
    const data = (await res.json()) as { vasps?: Array<{ name?: string }> };
    const hit = data.vasps && data.vasps.length > 0 ? data.vasps[0] : null;
    return { registered: !!hit, vaspName: hit?.name ?? null, source: "TRISA_TESTNET_DIRECTORY" };
  } catch {
    // fail-closed to a DISCLOSED synthetic fallback - never silently claim "registered" on a dead lookup
    return { registered: false, vaspName: null, source: "SYNTHETIC_FALLBACK" };
  }
}
