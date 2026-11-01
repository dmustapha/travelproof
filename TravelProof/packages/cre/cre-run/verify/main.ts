// TravelProof VERIFY workflow — real cre-sdk 1.23.0 (Runner + cre.capabilities + HTTP trigger).
// Receives {jobId, vaspLei, originatorHash, beneficiaryAccount, origVasp, beneVasp} via the HTTP
// trigger payload, verifies the beneficiary VASP registration + originator attribute-match, and emits
// a DON-signed report carrying an in-enclave commitment.
//
// HONESTY: the production privacy path is CRE Confidential-HTTP (PII resolved inside the enclave —
// see packages/cre/src/verify.workflow.ts). For the local simulation demo the DON calls our plain
// /api/vasp-verify endpoint over a bearer-gated HTTP request; the verdict LOGIC and DATA are identical
// (shared verifyVasp() in packages/vasp-registry), only the enclave transport is emulated.
import { Runner, cre, getNetwork, hexToBase64, bytesToBase64, consensusIdenticalAggregation, ok, text } from "@chainlink/cre-sdk";
import { encodeAbiParameters, parseAbiParameters, keccak256, stringToBytes } from "viem";
import { z } from "zod";

const configSchema = z.object({
  vaspVerifyUrl: z.string(),
  vaspVerifyKey: z.string(),
  receiver: z.string(),
  gasLimit: z.string(),
  chainName: z.string(),
  chainSelector: z.string(),
});
type Config = z.infer<typeof configSchema>;

interface VerifyInput {
  jobId: string;
  vaspLei: string;
  originatorHash: string;
  beneficiaryAccount: string;
  origVasp: string;
  beneVasp: string;
}

// 0 = PASS, 1 = FAIL, 2 = DEGRADED (fail-closed). Mirrors packages/cre/src/verify.workflow.ts.
async function onVerify(runtime: any, payload: any): Promise<string> {
  const config = configSchema.parse(runtime.config);
  const input: VerifyInput = JSON.parse(new TextDecoder().decode(payload.input));

  const http = new cre.capabilities.HTTPClient();

  // Each node independently queries the VASP directory; the DON must identically agree on the verdict.
  const verifyVerdict: number = http
    .sendRequest(
      runtime,
      (sr: any): number => {
        const resp = sr
          .sendRequest({
            url: config.vaspVerifyUrl,
            method: "POST",
            headers: { Authorization: `Bearer ${config.vaspVerifyKey}`, "content-type": "application/json" },
            // The proto `body` field is bytes → protobuf-JSON requires a base64 string (a raw JSON
            // string fails with "invalid base64 string").
            body: bytesToBase64(new TextEncoder().encode(JSON.stringify({ vaspLei: input.vaspLei, originatorHash: input.originatorHash }))),
          })
          .result();
        if (!ok(resp)) return 2; // fail-closed: a non-200 (auth/down) → DEGRADED, never a fabricated PASS
        const body = text(resp);
        if (!body) return 2;
        let parsed: { registered?: boolean; originatorMatch?: boolean };
        try {
          parsed = JSON.parse(body) as { registered?: boolean; originatorMatch?: boolean };
        } catch {
          return 2;
        }
        if (typeof parsed.registered !== "boolean") return 2;
        return parsed.registered && parsed.originatorMatch ? 0 : 1;
      },
      consensusIdenticalAggregation<number>(),
    )()
    .result();

  // Commitment is computed over the canonical verified payload — SAME key set + order as
  // packages/core/src/commitment.ts COMMITMENT_KEYS, so verify-claims.ts round-trips.
  const commitment = keccak256(
    stringToBytes(
      JSON.stringify(
        { beneVasp: input.beneVasp, beneficiaryAccount: input.beneficiaryAccount, origVasp: input.origVasp, verifyVerdict },
        ["beneVasp", "beneficiaryAccount", "origVasp", "verifyVerdict"],
      ),
    ),
  );

  const reportData = encodeAbiParameters(parseAbiParameters("bytes32 jobId, bytes32 commitment, uint8 verifyVerdict"), [
    input.jobId as `0x${string}`,
    commitment,
    verifyVerdict,
  ]);
  const report = runtime
    .report({ encodedPayload: hexToBase64(reportData), encoderName: "evm", signingAlgo: "ecdsa", hashingAlgo: "keccak256" })
    .result();

  const network = getNetwork({ chainFamily: "evm", chainSelectorName: config.chainName, isTestnet: true });
  if (!network) throw new Error("network not found: " + config.chainName);
  const evm = new cre.capabilities.EVMClient(network.chainSelector.selector);
  const resp = evm
    .writeReport(runtime, { receiver: config.receiver as `0x${string}`, report, gasConfig: { gasLimit: config.gasLimit } })
    .result();

  // writeReport's response carries BigInt fields which JSON.stringify rejects — coerce to strings.
  const bigintSafe = (_k: string, v: unknown) => (typeof v === "bigint" ? v.toString() : v);
  return JSON.stringify({ jobId: input.jobId, verifyVerdict, commitment, tx: resp }, bigintSafe);
}

const initWorkflow = (_config: Config) => {
  const httpTrigger = new cre.capabilities.HTTPCapability();
  return [cre.handler(httpTrigger.trigger({}), onVerify)];
};

export async function main() {
  const runner = await Runner.newRunner<Config>({ configSchema });
  await runner.run(initWorkflow);
}

main();
