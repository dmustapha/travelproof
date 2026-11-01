// File: packages/vasp-registry/src/server.ts
import { createServer } from "node:http";
import { verifyVasp } from "./verify";

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
          // Shared verdict logic (verify.ts): REAL TRISA testnet directory lookup + DISCLOSED synthetic fallback.
          const result = await verifyVasp(vaspLei, originatorHash);
          res
            .writeHead(200, { "content-type": "application/json" })
            .end(JSON.stringify(result));
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
