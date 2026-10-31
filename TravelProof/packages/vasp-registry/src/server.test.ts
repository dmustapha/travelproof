// File: packages/vasp-registry/src/server.test.ts
// Integration test for the C6 verify endpoint. Real HTTP round-trip against a live server instance.
// Run: VASP_VERIFY_KEY=dev-key npx tsx src/server.test.ts  (exits 0 on pass, 1 on any failed assertion)
import { startServer } from "./server";
import assert from "node:assert";

const PORT = 8799;
const KEY = process.env.VASP_VERIFY_KEY ?? "dev-key";

async function main() {
  const server = startServer(PORT);
  await new Promise((r) => setTimeout(r, 150));
  try {
    // 1) registered VASP + bearer key -> registered:true, originatorMatch:true, vaspName set, source present
    const ok = await fetch(`http://localhost:${PORT}/verify`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ vaspLei: "984500AB12CD34EF5678", originatorHash: "0x4d2f" }),
    });
    assert.strictEqual(ok.status, 200, "registered call should be 200");
    const okBody = (await ok.json()) as { registered: boolean; originatorMatch: boolean; vaspName: string | null; source: string };
    assert.strictEqual(okBody.registered, true, "known VASP should be registered");
    assert.strictEqual(okBody.originatorMatch, true, "non-empty hash should match for registered VASP");
    assert.strictEqual(okBody.vaspName, "Beta Exchange Ltd", "vaspName should resolve");
    assert.ok(
      okBody.source === "TRISA_TESTNET_DIRECTORY" || okBody.source === "SYNTHETIC_FALLBACK",
      "response must carry a disclosed source",
    );
    console.log(`PASS registered: ${JSON.stringify(okBody)}`);

    // 2) no bearer key -> 401
    const unauth = await fetch(`http://localhost:${PORT}/verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.strictEqual(unauth.status, 401, "missing key should be 401");
    console.log(`PASS 401: status=${unauth.status}`);

    console.log("ALL VASP-REGISTRY TESTS PASSED");
  } finally {
    server.close();
  }
}

main().catch((e) => {
  console.error("VASP-REGISTRY TEST FAILED:", e);
  process.exit(1);
});
