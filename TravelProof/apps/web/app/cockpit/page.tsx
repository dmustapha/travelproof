// File: apps/web/app/cockpit/page.tsx
"use client";
import { useState } from "react";

type Stage = "IDLE" | "RUNNING" | "CLEARED" | "DO_NOT_TRANSMIT" | "INCOMPLETE" | "NOT_APPLICABLE" | "DEGRADED";

const DEMO_HIT = "3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1";

export default function Cockpit() {
  const [stage, setStage] = useState<Stage>("IDLE");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(form: FormData) {
    setError(null);
    setStage("RUNNING");
    const intent = {
      amount: String(form.get("amount")), assetSymbol: String(form.get("asset")), fiatValueUsd: Number(form.get("usd")),
      originatorIsCasp: form.get("origCasp") === "on", beneficiaryIsCasp: form.get("beneCasp") === "on",
      beneficiaryChainAddress: String(form.get("beneAddr")),
      originator: { primaryIdentifier: String(form.get("origName")), customerIdentification: String(form.get("origCust")), countryOfResidence: "NG" },
      beneficiary: { primaryIdentifier: String(form.get("beneName")), accountNumber: String(form.get("beneAddr")) },
      originatingVaspLei: "5493001KJTIIGC8Y1R12", beneficiaryVaspLei: String(form.get("beneLei")),
    };
    try {
      const res = await fetch("/api/run", { method: "POST", body: JSON.stringify(intent) });
      const data = await res.json();
      setResult(data);
      if (res.status === 502 || data.stage === "DEGRADED") { setStage("DEGRADED"); return; }
      setStage((data.stage as Stage) ?? "NOT_APPLICABLE");
    } catch (e) {
      setError(e instanceof Error ? e.message : "network error");
      setStage("DEGRADED");
    }
  }

  const applicable = result?.applicability?.applicable;

  return (
    <main className="cockpit">
      <header className="cockpit-head">
        <a className="back" href="/">← TravelProof</a>
        <h1>Compliance Cockpit</h1>
        <p className="subtitle">Classify a transfer, verify + screen the counterparty, assemble a filable record — step 1 of 2 (two VASPs).</p>
      </header>

      <form action={submit} className="transfer-form">
        <div className="grid">
          <label className="field"><span>Amount</span><input name="amount" aria-label="Amount" defaultValue="5000" /></label>
          <label className="field"><span>Asset</span><input name="asset" aria-label="Asset" defaultValue="USDC" /></label>
          <label className="field"><span>USD value</span><input name="usd" aria-label="USD value" defaultValue="5000" /></label>
          <label className="field"><span>Originator name</span><input name="origName" aria-label="Originator name" defaultValue="Adeyemi Fatima" /></label>
          <label className="field"><span>Customer ID</span><input name="origCust" aria-label="Customer ID" defaultValue="CUST-558201" /></label>
          <label className="field"><span>Beneficiary name</span><input name="beneName" aria-label="Beneficiary name" defaultValue="Okafor" /></label>
          <label className="field field-wide"><span>Beneficiary address</span><input name="beneAddr" aria-label="Beneficiary address" defaultValue="0xB0B0000000000000000000000000000000000B0B" /></label>
          <label className="field"><span>Beneficiary VASP LEI</span><input name="beneLei" aria-label="Beneficiary VASP LEI" defaultValue="984500AB12CD34EF5678" /></label>
        </div>
        <div className="toggles">
          <label className="toggle"><input type="checkbox" name="origCasp" defaultChecked /> <span>originator is a CASP</span></label>
          <label className="toggle"><input type="checkbox" name="beneCasp" defaultChecked /> <span>beneficiary is a CASP</span></label>
        </div>
        <div className="actions-row">
          <button type="submit" className="run-btn" disabled={stage === "RUNNING"}>
            {stage === "RUNNING" ? "Running verify + screen…" : "Classify + verify + screen"}
          </button>
          <span className="hint">Try the live OFAC hit: paste <code>{DEMO_HIT}</code> as the beneficiary address.</span>
        </div>
      </form>

      {stage === "RUNNING" && <div className="status status-running" role="status">Classifying, verifying the VASP, and screening against the live OFAC SDN list…</div>}

      {result?.applicability && (
        <div className={`banner ${applicable === false ? "banner-na" : "banner-applicable"}`}>
          <strong>{applicable === false ? "Not applicable" : "Applicable"}</strong>
          <span>{result.applicability.citation || result.applicability.rationale}</span>
        </div>
      )}

      {stage === "CLEARED" && (
        <div className="status status-cleared">
          <strong>CLEARED</strong>
          <p>Counterparty verified and screened; no OFAC SDN match.</p>
          <a className="record-link" href={`/record/${result.jobId}`}>Open the filable record →</a>
        </div>
      )}

      {stage === "DO_NOT_TRANSMIT" && (
        <div className="status status-block">
          <strong>DO NOT TRANSMIT</strong>
          <p>{result.screenVerdict === "HIT" ? "Beneficiary address matches the live OFAC SDN list." : "Counterparty is not a registered CASP."} No filable record was assembled.</p>
        </div>
      )}

      {stage === "INCOMPLETE" && (
        <div className="status status-warn">
          <strong>INCOMPLETE</strong>
          <p>Missing required IVMS fields: {result?.validation?.violations?.map((v: any) => v.constraint).join(", ")}</p>
        </div>
      )}

      {stage === "DEGRADED" && (
        <div className="status status-degraded">
          <strong>DEGRADED — no verdict, nothing attested</strong>
          <p>
            {error
              ? `Could not reach the run API: ${error}.`
              : (result?.reason ?? "The CRE runner did not return a real enum verdict.")}
          </p>
          <p className="degraded-note">
            The system fails closed: it will not fabricate a CLEARED. The in-enclave verify is CRE
            Confidential Workflows — beta access pending (production privacy path). Wire the runner
            (<code>CRE_WIRED=1</code>) to get live verdicts.
          </p>
        </div>
      )}
    </main>
  );
}
