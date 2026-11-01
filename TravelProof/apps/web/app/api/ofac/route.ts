// File: apps/web/app/api/ofac/route.ts
// Lightweight sanctions-check surface for the CRE DON. The screen workflow's HTTP capability cannot
// pull the >10MB OFAC SDN.XML in one fetch (context-deadline / body-cap). Instead the DON calls THIS
// endpoint (a tiny {hit:boolean} response) which fetches + indexes the live feed server-side and
// caches it. This is the legitimate "DON queries a sanctions API" pattern — the screening logic and
// the data are identical to packages/ofac; only the transport moved off the enclave's hot path.
import { NextRequest, NextResponse } from "next/server";
import { fetchAndIndexSdn, type SdnIndex } from "@travelproof/ofac/sdn";
import { screenAddress } from "@travelproof/ofac/screen";

export const dynamic = "force-dynamic";

// Cache the indexed feed across requests (the DON fires one GET per screened address). The live feed
// publishes ~daily; a 1h TTL keeps it fresh without re-fetching 10MB per call.
const TTL_MS = 60 * 60 * 1000;
let cache: { idx: SdnIndex; at: number } | null = null;
let inflight: Promise<SdnIndex> | null = null;

async function getIndex(): Promise<SdnIndex> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.idx;
  if (!inflight) {
    inflight = fetchAndIndexSdn()
      .then((idx) => {
        cache = { idx, at: Date.now() };
        return idx;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "address query param required" }, { status: 400 });
  }
  // Fail-closed: if the live feed is unreachable/empty, surface a 502 with degraded:true rather than
  // a false CLEAR. The DON reads the non-200 and emits DEGRADED (never a fabricated clear).
  let idx: SdnIndex;
  try {
    idx = await getIndex();
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ degraded: true, reason }, { status: 502 });
  }
  const { hit, uid } = screenAddress(idx, address);
  return NextResponse.json({ hit, uid, address, publishDate: idx.publishDate, recordCount: idx.recordCount });
}
