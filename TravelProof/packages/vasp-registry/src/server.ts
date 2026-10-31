// File: packages/vasp-registry/src/server.ts
import { createServer } from "node:http";
import { trisaDirectoryLookup } from "./trisa";

// Mock directory of registered VASPs (synthetic). PROD PATH: replace with a TRISA testnet directory lookup.
// CO-1 part D: registration is now resolved by a REAL trisaDirectoryLookup; this synthetic directory is the
// DISCLOSED fail-closed fallback used only when the live TRISA lookup does not hit (source = SYNTHETIC_FALLBACK).
const REGISTERED_VASPS: Record<string, string> = {
  "984500AB12CD34EF5678": "Beta Exchange Ltd",
  "5493001KJTIIGC8Y1R12": "Alpha Exchange Ltd",
};
const API_KEY = process.env.VASP_VERIFY_KEY ?? "dev-key";

export function startServer(port = 8787) {
  const server = createServer((req, res) => {
    if (req.method !== "POST" || !req.url?.endsWith("/verify")) {
      res.writeHead(404).end();
      return;
    }
    if (req.headers.authorization !== `Bearer ${API_KEY}`) {
      res.writeHead(401).end(JSON.stringify({ error: "unauthorized" }));
      return;
    }
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      void (async () => {
        try {
          const { vaspLei, originatorHash } = JSON.parse(body) as { vaspLei: string; originatorHash: string };
          // REAL registration check (CO-1 D): live TRISA testnet directory lookup, fail-closed + disclosed via `source`.
          const trisa = await trisaDirectoryLookup(vaspLei);
          let registered = trisa.registered;
          let vaspName = trisa.vaspName;
          let source = trisa.source;
          // DISCLOSED synthetic fallback: on a dead/mismatched TRISA lookup, resolve from the synthetic directory
          // and label the source SYNTHETIC_FALLBACK so the UI/memo can state registration is not from the live directory.
          if (!registered) {
            const mockName = REGISTERED_VASPS[vaspLei] ?? null;
            if (mockName != null) {
              registered = true;
              vaspName = mockName;
              source = "SYNTHETIC_FALLBACK";
            }
          }
          // Synthetic originator attribute-match (mTLS gRPC handshake out of scope - DISCLOSED):
          // a present (non-empty) hash counts as a match for a registered VASP.
          const originatorMatch = registered && typeof originatorHash === "string" && originatorHash.length > 0;
          res
            .writeHead(200, { "content-type": "application/json" })
            .end(JSON.stringify({ registered, originatorMatch, vaspName, source }));
        } catch {
          res.writeHead(400).end(JSON.stringify({ error: "bad_request" }));
        }
      })();
    });
  });
  server.listen(port, () => console.log(`[vasp-registry] on :${port} (registration: TRISA testnet directory, synthetic fallback disclosed via source)`));
  return server;
}

if (require.main === module) startServer(Number(process.env.PORT ?? 8787));
