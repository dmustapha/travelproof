// File: packages/vasp-registry/src/verify.ts
// Shared VASP verification verdict — the single source of truth used by BOTH the standalone
// node server (server.ts) and the Next /api/vasp-verify route the CRE DON queries. Registration is
// a REAL live TRISA testnet directory lookup (trisaDirectoryLookup); on a dead/miss lookup it falls
// back to a DISCLOSED synthetic directory (source = SYNTHETIC_FALLBACK). The originator attribute-match
// stays synthetic (mTLS gRPC handshake out of scope — DISCLOSED): a present hash matches for a
// registered VASP.
import { trisaDirectoryLookup } from "./trisa";

// Synthetic directory (DISCLOSED fail-closed fallback when the live TRISA lookup does not hit).
const REGISTERED_VASPS: Record<string, string> = {
  "984500AB12CD34EF5678": "Beta Exchange Ltd",
  "5493001KJTIIGC8Y1R12": "Alpha Exchange Ltd",
};

export interface VaspVerifyResult {
  registered: boolean;
  originatorMatch: boolean;
  vaspName: string | null;
  source: "TRISA_TESTNET_DIRECTORY" | "SYNTHETIC_FALLBACK";
}

export async function verifyVasp(vaspLei: string, originatorHash: string): Promise<VaspVerifyResult> {
  const trisa = await trisaDirectoryLookup(vaspLei);
  let registered = trisa.registered;
  let vaspName = trisa.vaspName;
  let source = trisa.source;
  if (!registered) {
    const mockName = REGISTERED_VASPS[vaspLei] ?? null;
    if (mockName != null) {
      registered = true;
      vaspName = mockName;
      source = "SYNTHETIC_FALLBACK";
    }
  }
  const originatorMatch = registered && typeof originatorHash === "string" && originatorHash.length > 0;
  return { registered, originatorMatch, vaspName, source };
}
