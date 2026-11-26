// File: scripts/cre-parse.js
// Extracts the REAL handler result from each `cre workflow simulate` stdout and emits the wire
// contract apps/web/lib/cre.ts expects: {verifyVerdict, screenVerdict, txHashes}. Exits 1 (fail-closed)
// if either simulate did not produce a parseable result — the caller then degrades to a 502, never a lie.
const fs = require("node:fs");

const ANSI = /\x1b\[[0-9;]*m/g;
const MARKER = "Workflow Simulation Result:";

function extract(file) {
  const raw = fs.readFileSync(file, "utf8").replace(ANSI, "");
  const idx = raw.indexOf(MARKER);
  if (idx < 0) return null;
  const lines = raw.slice(idx + MARKER.length).split("\n");
  for (const l of lines) {
    const line = l.trim();
    if (!line) continue;
    try {
      // The handler's returned string is printed as a JSON string literal — parse twice.
      const first = JSON.parse(line);
      return typeof first === "string" ? JSON.parse(first) : first;
    } catch {
      return null; // the first non-empty line after the marker should BE the result; if not, fail-closed
    }
  }
  return null;
}

const screen = extract(process.argv[2]);
const verify = extract(process.argv[3]);

if (!screen || !verify) {
  console.error("CRE_SIM_PARSE_FAIL: screen=" + !!screen + " verify=" + !!verify);
  process.exit(1);
}
if (typeof screen.screenVerdict !== "string" || typeof verify.verifyVerdict !== "number") {
  console.error("CRE_SIM_SHAPE_FAIL");
  process.exit(1);
}

// The CLI returns txHash either as a hex string or as a byte map ({"0":58,"1":80,...}); accept both.
function hashToHex(h) {
  if (typeof h === "string") return h;
  if (!h || typeof h !== "object") return null;
  const keys = Object.keys(h).sort((a, b) => a - b);
  if (keys.length !== 32) return null;
  return "0x" + keys.map((k) => Number(h[k]).toString(16).padStart(2, "0")).join("");
}

// Real on-chain tx hashes only exist with --broadcast; a plain simulate has none → [].
const txHashes = [screen.tx, verify.tx]
  .map((t) => (t ? hashToHex(t.txHash) : null))
  .filter(Boolean);

process.stdout.write(JSON.stringify({ verifyVerdict: verify.verifyVerdict, screenVerdict: screen.screenVerdict, txHashes }));
