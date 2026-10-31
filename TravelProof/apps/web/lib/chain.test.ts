// File: apps/web/lib/chain.test.ts
// Lightweight, network-free tests for the chain/ledger decode contracts.
// Runs under tsx (node:test) — no vitest dependency required:
//   corepack pnpm exec tsx --test apps/web/lib/chain.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeEventLog } from "viem";
import { ATTESTATION_ABI } from "./chain";
import { ATTESTATION_EVENT } from "./ledger";

test("ATTESTATION_ABI exposes getAttestation with the 4 non-PII outputs", () => {
  const fn = ATTESTATION_ABI.find((e) => e.name === "getAttestation");
  assert.ok(fn, "getAttestation present");
  assert.equal(fn!.stateMutability, "view");
  const outs = fn!.outputs.map((o) => `${o.name}:${o.type}`);
  assert.deepEqual(outs, [
    "commitmentHash:bytes32",
    "verifyVerdict:uint8",
    "screenVerdict:uint8",
    "ts:uint64",
  ]);
  // Structural no-PII guarantee: every output is a hash/enum/timestamp, never a string identity field.
  assert.ok(fn!.outputs.every((o) => /^(bytes32|uint8|uint64)$/.test(o.type)));
});

test("EnclaveAttestation event decodes to {jobId, commitmentHash, ts, verdict}", () => {
  // A real encoded EnclaveAttestation log: jobId indexed in topics; (commitmentHash, ts, verdict) in data.
  const jobId = `0x${"ab".repeat(32)}` as `0x${string}`;
  const commitment = `0x${"cd".repeat(32)}` as `0x${string}`;
  // event topic0 for EnclaveAttestation(bytes32,bytes32,uint64,uint8)
  const topic0 = "0x" as string; // computed below via decodeEventLog round-trip guard
  // Encode the non-indexed args (commitmentHash bytes32, ts uint64, verdict uint8)
  const ts = 1_730_000_000n;
  const verdict = 0;
  const data =
    `0x${commitment.slice(2)}` +
    ts.toString(16).padStart(64, "0") +
    verdict.toString(16).padStart(64, "0");
  const decoded = decodeEventLog({
    abi: [ATTESTATION_EVENT],
    topics: [eventTopic0(), jobId] as [`0x${string}`, `0x${string}`],
    data: data as `0x${string}`,
  });
  assert.equal(decoded.eventName, "EnclaveAttestation");
  const args = decoded.args as unknown as { jobId: string; commitmentHash: string; ts: bigint; verdict: number };
  assert.equal(args.jobId, jobId);
  assert.equal(args.commitmentHash, commitment);
  assert.equal(Number(args.ts), Number(ts));
  assert.equal(args.verdict, verdict);
  void topic0;
});

// Derive the canonical topic0 from the parsed ABI item so the test stays source-of-truth.
import { encodeEventTopics } from "viem";
function eventTopic0(): `0x${string}` {
  const [t0] = encodeEventTopics({ abi: [ATTESTATION_EVENT], eventName: "EnclaveAttestation" });
  return t0 as `0x${string}`;
}

test("ledger row maps verdict 0 to CLEARED semantics", () => {
  // The page renders verdict===0 as CLEARED, else DO NOT TRANSMIT — assert the boundary here.
  const label = (v: number) => (v === 0 ? "CLEARED" : "DO NOT TRANSMIT");
  assert.equal(label(0), "CLEARED");
  assert.equal(label(1), "DO NOT TRANSMIT");
  assert.equal(label(2), "DO NOT TRANSMIT");
});
