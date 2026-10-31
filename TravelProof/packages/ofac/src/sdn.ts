// File: packages/ofac/src/sdn.ts
import { XMLParser } from "fast-xml-parser";

export const OFAC_SDN_URL =
  process.env.OFAC_SDN_URL ??
  "https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML";

export interface SdnIndex {
  addresses: Set<string>;         // exact-match set (base58 kept case-sensitive)
  addressesLower: Set<string>;    // for EVM case-insensitive compare
  names: Array<{ uid: string; name: string; isAka: boolean }>;
  publishDate: string;
  recordCount: number;
}

// Follow redirects to the S3 signed URL; the feed is >10MB so we read it fully then parse.
export async function fetchSdnXml(url: string = OFAC_SDN_URL): Promise<string> {
  const res = await fetch(url, { redirect: "follow", headers: { Accept: "text/xml" } });
  if (!res.ok) throw new Error(`SCREEN_DEGRADED: OFAC feed HTTP ${res.status}`);
  const text = await res.text();
  if (text.length < 1000) throw new Error("SCREEN_DEGRADED: OFAC feed body too small");
  return text;
}

export function parseSdn(xml: string): SdnIndex {
  // removeNSPrefix: the feed declares an xmlns; without this the root key can carry a namespace
  // prefix and `doc.sdnList` would be undefined → an empty index → a silent CLEAR for every address.
  // parseTagValue:false keeps every element value a literal string. OFAC digital-currency ids
  // (e.g. the hex EVM address 0x7FF9...) otherwise get coerced to a Number and corrupted to
  // scientific notation (7.30e+47), which would silently drop a sanctioned address from the index.
  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, parseTagValue: false, isArray: (name) => ["sdnEntry", "id", "aka"].includes(name) });
  const doc = parser.parse(xml);
  const list = doc.sdnList;
  if (!list) throw new Error("SCREEN_DEGRADED: SDN.XML root <sdnList> not found (parse/namespace failure) - refusing to screen against an empty index");
  const pub = list.publshInformation ?? {}; // NOTE: OFAC's element is misspelled "publshInformation"
  const entries: any[] = list.sdnEntry ?? [];
  // Fail-closed: a real feed has thousands of entries. An empty parse must NOT yield a CLEAR screen.
  if (entries.length === 0) throw new Error("SCREEN_DEGRADED: SDN.XML parsed to 0 entries - refusing a false CLEAR");

  const addresses = new Set<string>();
  const addressesLower = new Set<string>();
  const names: SdnIndex["names"] = [];

  for (const e of entries) {
    const uid = String(e.uid ?? "");
    const full = [e.firstName, e.lastName].filter(Boolean).join(" ").trim();
    if (full) names.push({ uid, name: full, isAka: false });
    const akas: any[] = e.akaList?.aka ?? [];
    for (const a of akas) {
      const an = [a.firstName, a.lastName].filter(Boolean).join(" ").trim();
      if (an) names.push({ uid, name: an, isAka: true });
    }
    const ids: any[] = e.idList?.id ?? [];
    for (const id of ids) {
      const idType = String(id.idType ?? "");
      if (idType.startsWith("Digital Currency Address")) {
        const num = String(id.idNumber ?? "").trim();
        if (num) { addresses.add(num); addressesLower.add(num.toLowerCase()); }
      }
    }
  }
  return {
    addresses,
    addressesLower,
    names,
    publishDate: String(pub.Publish_Date ?? "unknown"),
    recordCount: Number(pub.Record_Count ?? entries.length),
  };
}

export async function fetchAndIndexSdn(url: string = OFAC_SDN_URL): Promise<SdnIndex> {
  return parseSdn(await fetchSdnXml(url));
}

// Fail loud if the demo HIT address is not in the fresh index (prevents a lying DO-NOT-TRANSMIT demo).
export function assertDemoHitPresent(idx: SdnIndex, demoAddr: string): void {
  const present = idx.addresses.has(demoAddr) || idx.addressesLower.has(demoAddr.toLowerCase());
  if (!present) throw new Error(`STARTUP_SELFCHECK_FAIL: demo HIT address ${demoAddr} not on the live SDN list (delisted?)`);
}
