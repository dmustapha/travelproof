// File: packages/cre/src/screen.workflow.ts
// WARNING: UNVERIFIED PATTERN - validate in `cre workflow simulate` at wire.
import { EVMClient, HTTPClient, handler, consensusIdenticalAggregation } from "@chainlink/cre-sdk";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { fetchAndIndexSdn, assertDemoHitPresent } from "@travelproof/ofac/sdn";
import { screenAddress, screenName } from "@travelproof/ofac/screen";
import type { CreConfig } from "./config";

interface ScreenTriggerPayload { jobId: string; beneficiaryAddress: string; beneficiaryName: string; demoHitAddress?: string; }
type ScreenVerdict = "CLEAR" | "HIT" | "DEGRADED";

export const initWorkflow = (config: CreConfig) => {
  const http = new HTTPClient();
  return [handler(http.trigger({ path: "/screen" }), onScreen)];

  function onScreen(trigger: ScreenTriggerPayload, runtime: any) {
    // Each node independently fetches the LIVE feed and screens; the DON must identically agree.
    const verdict: ScreenVerdict = runtime
      .runInNodeMode(async (): Promise<ScreenVerdict> => {
        try {
          const idx = await fetchAndIndexSdn(config.ofacSdnUrl);
          if (trigger.demoHitAddress) assertDemoHitPresent(idx, trigger.demoHitAddress);
          const a = screenAddress(idx, trigger.beneficiaryAddress);
          if (a.hit) return "HIT";
          const n = screenName(idx, trigger.beneficiaryName);
          return n.hit ? "HIT" : "CLEAR";
        } catch {
          return "DEGRADED";
        }
      }, consensusIdenticalAggregation<ScreenVerdict>())
      .withDefault("DEGRADED") // no consensus -> DEGRADED, never CLEAR
      .result();

    const code = verdict === "CLEAR" ? 0 : verdict === "HIT" ? 1 : 2;
    const payload = encodeAbiParameters(parseAbiParameters("bytes32 jobId, uint8 screenVerdict"), [trigger.jobId as `0x${string}`, code]);
    const report = runtime.report({ encodedPayload: payload, encoderName: "evm", signingAlgo: "ecdsa", hashingAlgo: "keccak256" }).result();
    const evm = new EVMClient({ chainName: config.chainName });
    return evm.writeReport(runtime, { receiver: config.receiver, report, gasConfig: { gasLimit: config.gasLimit } }).result();
  }
};
