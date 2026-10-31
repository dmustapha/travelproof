// File: packages/cre/src/verify.workflow.ts
// CRE Confidential Workflows - beta access pending (production privacy path).
// This is the REAL in-enclave verify workflow (C3). It is NOT run in the live demo tonight: the
// Confidential-HTTP path requires `cre login` + the Chainlink Confidential Workflows private beta
// (requested at build minute 0). It is authored, not simulated or fabricated - the live verdict is
// produced only by `cre workflow simulate` at the wire gate (same cre-login block as C4 / Risk-5).
// WARNING: UNVERIFIED PATTERN - validate in `cre workflow simulate` at wire before relying on it.
import { ConfidentialHTTPClient, EVMClient, handler, HTTPClient } from "@chainlink/cre-sdk";
import { encodeAbiParameters, parseAbiParameters, keccak256, stringToBytes } from "viem";
import type { CreConfig } from "./config";

interface VerifyTriggerPayload { jobId: string; vaspLei: string; originatorHash: string; beneficiaryAccount: string; origVasp: string; beneVasp: string; }

export const initWorkflow = (config: CreConfig) => {
  const http = new HTTPClient();
  return [handler(http.trigger({ path: "/verify" }), onVerify)];

  function onVerify(trigger: VerifyTriggerPayload, runtime: any) {
    const conf = new ConfidentialHTTPClient();
    // The PII-bearing request runs INSIDE the enclave; secrets via Vault DON {{.key}} templates.
    const resp = conf
      .sendRequest(runtime, {
        request: {
          url: `${config.vaspVerifyUrl}/verify`,
          method: "POST",
          multiHeaders: { Authorization: ["Bearer {{.VASP_VERIFY_KEY}}"], "content-type": ["application/json"] },
          body: JSON.stringify({ vaspLei: trigger.vaspLei, originatorHash: trigger.originatorHash }),
          timeout: 10,
          encryptOutput: true,
        },
        vaultDonSecrets: [{ key: "VASP_VERIFY_KEY" }],
      })
      .result();

    let verifyVerdict = 2; // DEGRADED by default - fail-closed
    if (resp.ok()) {
      const parsed = resp.json() as { registered: boolean; originatorMatch: boolean };
      verifyVerdict = parsed.registered && parsed.originatorMatch ? 0 : 1; // 0=PASS 1=FAIL
    }

    // Commitment is computed in-enclave over the canonical verified payload (NOT a TEE quote).
    // MUST use the SAME key set + order as packages/core/src/commitment.ts COMMITMENT_KEYS,
    // or the verify-claims.ts round-trip will not match (sorted keys: beneVasp, beneficiaryAccount, origVasp, verifyVerdict).
    const commitmentHash = keccak256(
      stringToBytes(
        JSON.stringify(
          { beneVasp: trigger.beneVasp, beneficiaryAccount: trigger.beneficiaryAccount, origVasp: trigger.origVasp, verifyVerdict },
          ["beneVasp", "beneficiaryAccount", "origVasp", "verifyVerdict"],
        ),
      ),
    );

    const payload = encodeAbiParameters(parseAbiParameters("bytes32 jobId, bytes32 commitment, uint8 verifyVerdict"), [
      trigger.jobId as `0x${string}`,
      commitmentHash,
      verifyVerdict,
    ]);

    const report = runtime
      .report({ encodedPayload: payload, encoderName: "evm", signingAlgo: "ecdsa", hashingAlgo: "keccak256" })
      .result();

    const evm = new EVMClient({ chainName: config.chainName });
    return evm.writeReport(runtime, { receiver: config.receiver, report, gasConfig: { gasLimit: config.gasLimit } }).result();
  }
};
