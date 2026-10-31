// File: apps/web/app/cockpit/page.tsx - the officer's workstation: case rail | intake slip | verdict plate.
"use client";
import { useState } from "react";
import { Seal, gatesFor, type GateState } from "../../components/Seal";
import { outcomeOf, OUTCOME_LINE, REQUIRED_ACTION } from "../../lib/outcome";
import "../cockpit.css";

type Stage = "IDLE" | "RUNNING" | "CLEARED" | "DO_NOT_TRANSMIT" | "INCOMPLETE" | "NOT_APPLICABLE" | "DEGRADED";
type Case = { id: string; label: string; stage: Stage; result: any; error: string | null; at: string };

const DEMO_HIT = "3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1";
const STATIONS = [
  { q: "Does the rule apply?", get: "Yes or no, and the exact article" },
  { q: "Is the other exchange real?", get: "Verified or failed (identity stays private)" },
  { q: "Is the receiver sanctioned?", get: "Clear, or STOP with the match" },
  { q: "Seal the decision", get: "A proof anyone can check later" },
];
const STATE_WORD: Record<GateState, string> = { idle: "waiting", active: "working", pass: "done", fail: "failed", open: "see record" };

export default function Cockpit() {
  const [stage, setStage] = useState<Stage>("IDLE");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [sel, setSel] = useState<string | null>(null);

  async function submit(form: FormData) {
    setError(null); setSel(null);
    setStage("RUNNING");
    const intent = {
      amount: String(form.get("amount")), assetSymbol: String(form.get("asset")), fiatValueUsd: Number(form.get("usd")),
      originatorIsCasp: form.get("origCasp") === "on", beneficiaryIsCasp: form.get("beneCasp") === "on",
      beneficiaryChainAddress: String(form.get("beneAddr")), originatorChainAddress: String(form.get("origAddr")),
      originator: { primaryIdentifier: String(form.get("origName")), customerIdentification: String(form.get("origCust")), countryOfResidence: "NG" },
      beneficiary: { primaryIdentifier: String(form.get("beneName")), accountNumber: String(form.get("beneAddr")) },
      originatingVaspLei: "5493001KJTIIGC8Y1R12", beneficiaryVaspLei: String(form.get("beneLei")),
    };
    const label = `${intent.amount} ${intent.assetSymbol} → ${intent.beneficiary.primaryIdentifier}`;
    let st: Stage = "DEGRADED"; let data: any = null; let err: string | null = null;
    try {
      const res = await fetch("/api/run", { method: "POST", body: JSON.stringify(intent) });
      data = await res.json();
      const MAP: Record<string, Stage> = { incomplete: "INCOMPLETE", classified: "NOT_APPLICABLE" };
      const KNOWN = ["CLEARED", "DO_NOT_TRANSMIT", "INCOMPLETE", "NOT_APPLICABLE", "DEGRADED"];
      st = res.status === 502 ? "DEGRADED" : (MAP[data.stage] ?? (KNOWN.includes(data.stage) ? (data.stage as Stage) : "DEGRADED"));
    } catch (e) { err = e instanceof Error ? e.message : "network error"; }
    setResult(data); setError(err); setStage(st);
    const id = String(Date.now());
    setCases((c) => [{ id, label, stage: st, result: data, error: err, at: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) }, ...c]);
    setSel(id);
  }

  function open(c: Case) { setSel(c.id); setStage(c.stage); setResult(c.result); setError(c.error); }
  function fillHit() {
    const set = (n: string, v: string) => { const el = document.querySelector<HTMLInputElement>(`[name=${n}]`); if (el) el.value = v; };
    set("beneAddr", DEMO_HIT); set("asset", "BTC"); set("amount", "0.0795"); set("origAddr", "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq");
  }

  const g = gatesFor({ stage, verifyVerdict: result?.verifyVerdict, screenVerdict: result?.screenVerdict, attested: false });
  const outcome = (stage === "CLEARED" || stage === "DO_NOT_TRANSMIT") ? outcomeOf(Number(result?.verifyVerdict), String(result?.screenVerdict)) : null;
  const tone = stage === "CLEARED" ? "ok" : stage === "DO_NOT_TRANSMIT" ? "stop" : stage === "RUNNING" ? "run" : "idle";
  const headline = stage === "IDLE" ? "Awaiting a transfer" : stage === "RUNNING" ? "Checking…"
    : stage === "CLEARED" ? "Ready to send the identity data" : stage === "DO_NOT_TRANSMIT" ? "Hold. Do not transmit"
    : stage === "NOT_APPLICABLE" ? "Rule does not apply" : stage === "INCOMPLETE" ? "Information missing" : "Held. Verification isn't connected";
  const reason = stage === "IDLE" ? "Fill in the transfer on the left. The four checks run in order and each shows its state here."
    : stage === "RUNNING" ? "Classifying, verifying the counterparty, screening against the live OFAC list."
    : outcome ? OUTCOME_LINE[outcome]
    : stage === "NOT_APPLICABLE" ? (result?.applicability?.rationale ?? "This transfer is outside the Travel Rule.")
    : stage === "INCOMPLETE" ? `Missing required fields: ${result?.validation?.violations?.map((v: any) => v.constraint).join(", ")}`
    : (error ? "Could not reach the run service. Nothing was decided or attested." : "This transfer was not decided and nothing was attested. The private enclave check is waiting on beta access, so TravelProof fails closed instead of guessing.");

  return (
    <main className="ck">
      <header className="ck-top">
        <div>
          <span className="ck-eyebrow">Compliance workstation</span>
          <h1>Decide this transfer.</h1>
        </div>
        <dl className="ck-meta">
          <div><dt>Governing rule</dt><dd>Reg. (EU) 2023/1113 · FATF R.16</dd></div>
          <div><dt>Cases this session</dt><dd>{cases.length}</dd></div>
          <div><dt>Mode</dt><dd>Live · fails closed</dd></div>
        </dl>
      </header>

      <div className="ck-grid">
        {/* ── case rail ── */}
        <aside className="ck-rail" aria-label="Cases this session">
          <h2>Cases</h2>
          {cases.length === 0 && <><p className="ck-empty">Cases you decide appear here, newest first.</p><div className="ck-ghost-rows" aria-hidden="true"><i /><i /><i /></div></>}
          <ul>
            {cases.map((c) => (
              <li key={c.id}>
                <button type="button" className={`ck-case ck-case-${c.stage === "CLEARED" ? "ok" : c.stage === "DO_NOT_TRANSMIT" ? "stop" : "idle"} ${sel === c.id ? "on" : ""}`} onClick={() => open(c)}>
                  <span className="dot" /><b>{c.label}</b><small>{c.at} · {c.stage === "CLEARED" ? "ready" : c.stage === "DO_NOT_TRANSMIT" ? "hold" : "no decision"}</small>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="ck-new" onClick={() => { setStage("IDLE"); setResult(null); setError(null); setSel(null); }}>+ New transfer</button>
        </aside>

        {/* ── intake slip ── */}
        <form action={submit} className="ck-slip">
          <div className="ck-slip-head"><span>INTAKE SLIP</span><span>Pending transfer</span></div>
          <fieldset>
            <legend>1 · The transfer</legend>
            <div className="ck-row3">
              <label><span>Amount</span><input name="amount" aria-label="Amount" defaultValue="5000" /></label>
              <label><span>Asset</span><input name="asset" aria-label="Asset" defaultValue="USDC" /></label>
              <label><span>Value (USD)</span><input name="usd" aria-label="USD value" defaultValue="5000" /></label>
            </div>
          </fieldset>
          <fieldset>
            <legend>2 · Who is sending <small>your customer</small></legend>
            <div className="ck-row2">
              <label><span>Name</span><input name="origName" aria-label="Originator name" defaultValue="Adeyemi Fatima" /></label>
              <label><span>Customer ID</span><input name="origCust" aria-label="Customer ID" defaultValue="CUST-558201" /></label>
            </div>
            <label><span>Their wallet address <em>Art. 14(1)(b)</em></span><input className="mono" name="origAddr" aria-label="Originator address" defaultValue="0x7A1CE5Fd09c4E2b8a2B6d3C1e0F4a9D8b7C6E5f4" /></label>
          </fieldset>
          <fieldset>
            <legend>3 · Who is receiving <small>at the other exchange</small></legend>
            <label><span>Name</span><input name="beneName" aria-label="Beneficiary name" defaultValue="Okafor" /></label>
            <label><span>Receiving wallet address</span><input className="mono" name="beneAddr" aria-label="Beneficiary address" defaultValue="0xB0B0000000000000000000000000000000000B0B" /></label>
            <label><span>Their exchange&apos;s legal ID (LEI)</span><input className="mono" name="beneLei" aria-label="Beneficiary CASP LEI" defaultValue="984500AB12CD34EF5678" /></label>
          </fieldset>
          <div className="ck-checks">
            <label><input type="checkbox" name="origCasp" defaultChecked /> sending side is an exchange</label>
            <label><input type="checkbox" name="beneCasp" defaultChecked /> receiving side is an exchange</label>
          </div>
          <div className="ck-actions">
            <button type="submit" className="ck-go" disabled={stage === "RUNNING"}>{stage === "RUNNING" ? "Checking…" : "Run the four checks"}</button>
            <button type="button" className="ck-link" onClick={fillHit}>Try a known sanctioned address</button>
          </div>
        </form>

        {/* ── verdict plate ── */}
        <section className={`ck-plate ck-${tone}`} aria-live="polite">
          <div className="ck-seal"><Seal gates={g.gates} voided={g.voided} size={230} id="ck" ringText={g.voided ? undefined : stage === "CLEARED" ? "CLEARED · ATTESTATION: SEE RECORD · " : "TRAVELPROOF · AWAITING DECISION · NOT YET ATTESTED · "} /></div>
          <span className="ck-plate-lab">Your decision</span>
          <h2>{headline}</h2>
          <p className="ck-reason">{reason}</p>
          <ol className="ck-stations">
            {STATIONS.map((s, i) => (
              <li key={s.q} className={`gate-${g.gates[i]}`}>
                <span className="n">{i + 1}</span>
                <div><b>{s.q}</b><small>{s.get}</small></div>
                <em>{g.gates[i] === "fail" ? "failed" : STATE_WORD[g.gates[i]]}</em>
              </li>
            ))}
          </ol>
          {stage === "DO_NOT_TRANSMIT" && outcome && outcome !== "CLEARED" && <p className="ck-req"><b>What to do</b>{REQUIRED_ACTION[outcome]}</p>}
          {(stage === "CLEARED" || stage === "DO_NOT_TRANSMIT") && result?.jobId && (
            <div className="ck-next">
              <a className="ck-go" href={`/record/${result.jobId}`}>Open the record</a>
              <a className="ck-ghost" href={`/record/${result.jobId}/memo.pdf`}>Download the memo</a>
            </div>
          )}
          {stage === "DEGRADED" && <p className="ck-note">The system fails closed: it will not invent a verdict. The private enclave check is waiting on beta access. See a <a href="/specimen/no-hit">sample record</a>.</p>}
        </section>
      </div>
    </main>
  );
}
