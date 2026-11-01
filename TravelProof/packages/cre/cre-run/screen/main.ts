// TravelProof SCREEN workflow — ported to real cre-sdk 1.23.0 (Runner + cre.capabilities + HTTP trigger).
// Receives {jobId, beneficiaryAddress, beneficiaryName, demoHitAddress} via the HTTP trigger payload,
// screens the beneficiary address against the live OFAC SDN feed, emits a DON-signed report.
// The DON cannot pull the >10MB SDN.XML in one fetch (context-deadline / body-cap), so it queries our
// lightweight /api/ofac?address=X endpoint instead — a tiny {hit:boolean} response backed by the same
// fetch+index code (packages/ofac). Legit "DON calls a sanctions API" pattern; identical screening data.
import { Runner, cre, getNetwork, hexToBase64, consensusIdenticalAggregation, ok, text } from "@chainlink/cre-sdk";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { z } from "zod";

const configSchema = z.object({
  ofacApiUrl: z.string(),
  receiver: z.string(),
  gasLimit: z.string(),
  chainName: z.string(),
  chainSelector: z.string(),
});
type Config = z.infer<typeof configSchema>;

interface ScreenInput {
  jobId: string;
  beneficiaryAddress: string;
  beneficiaryName?: string;
  demoHitAddress?: string;
}

type Verdict = "CLEAR" | "HIT" | "DEGRADED";

async function onScreen(runtime: any, payload: any): Promise<string> {
  const config = configSchema.parse(runtime.config);
  const input: ScreenInput = JSON.parse(new TextDecoder().decode(payload.input));

  const http = new cre.capabilities.HTTPClient();

  // Each node independently queries the sanctions API for this address; the DON must identically agree.
  const addr = input.beneficiaryAddress;
  const url = `${config.ofacApiUrl}?address=${encodeURIComponent(addr)}`;
  const verdict: Verdict = http
    .sendRequest(
      runtime,
      (sr: any): Verdict => {
        const resp = sr.sendRequest({ url, method: "GET" }).result();
        if (!ok(resp)) return "DEGRADED"; // fail-closed: a 502 from /api/ofac (feed down) → DEGRADED, never a false CLEAR
        const body = text(resp);
        if (!body) return "DEGRADED";
        let parsed: { hit?: boolean };
        try {
          parsed = JSON.parse(body) as { hit?: boolean };
        } catch {
          return "DEGRADED";
        }
        if (typeof parsed.hit !== "boolean") return "DEGRADED";
        return parsed.hit ? "HIT" : "CLEAR";
      },
      consensusIdenticalAggregation<Verdict>(),
    )()
    .result();

  const code = verdict === "CLEAR" ? 0 : verdict === "HIT" ? 1 : 2;
  const reportData = encodeAbiParameters(parseAbiParameters("bytes32 jobId, uint8 screenVerdict"), [
    input.jobId as `0x${string}`,
    code,
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

  // writeReport's response carries BigInt fields (gas, block) which JSON.stringify rejects — coerce
  // them to strings so the handler can emit a parseable result line for run-cre.sh.
  const bigintSafe = (_k: string, v: unknown) => (typeof v === "bigint" ? v.toString() : v);
  return JSON.stringify({ jobId: input.jobId, screenVerdict: verdict, code, tx: resp }, bigintSafe);
}

const initWorkflow = (_config: Config) => {
  const httpTrigger = new cre.capabilities.HTTPCapability();
  return [cre.handler(httpTrigger.trigger({}), onScreen)];
};

export async function main() {
  const runner = await Runner.newRunner<Config>({ configSchema });
  await runner.run(initWorkflow);
}

main();
