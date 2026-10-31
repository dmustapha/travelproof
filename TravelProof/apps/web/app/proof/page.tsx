// File: apps/web/app/proof/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProofLookup() {
  const router = useRouter();
  const [jobId, setJobId] = useState("");
  return (
    <main className="proof proof-lookup">
      <a className="back" href="/">← TravelProof</a>
      <header className="proof-head">
        <span className="eyebrow-mono">For auditors, regulators and the receiving exchange</span>
        <h1>Check a decision. No login, no wallet.</h1>
        <p className="meta">Paste a record&apos;s jobId. We read the public chain and show what is there: a pass or fail, a fingerprint and a time. No names exist on the chain to show.</p>
      </header>
      <form
        className="lookup-form lookup-slot"
        onSubmit={(e) => { e.preventDefault(); if (jobId.trim()) router.push(`/proof/${jobId.trim()}`); }}
      >
        <label><span>jobId</span>
          <input aria-label="jobId" placeholder="0x…" value={jobId} onChange={(e) => setJobId(e.target.value)} />
        </label>
        <button type="submit" disabled={!jobId.trim()}>Check on-chain</button>
      </form>
      <section className="proof-explain">
        <div className="pe-plate">
          <b>What you will see</b>
          <div className="pe-row"><i>verdict</i><span>pass / fail</span></div>
          <div className="pe-row"><i>screen</i><span>clear / hit</span></div>
          <div className="pe-row"><i>fingerprint</i><span>0x434a…f441</span></div>
          <div className="pe-row"><i>time</i><span>block timestamp</span></div>
          <div className="pe-row nope"><i>names</i><span>none, ever</span></div>
        </div>
        <div className="pe-note">
          <b>Or run it yourself</b>
          <code>cast call &lt;contract&gt; &quot;getAttestation(bytes32)&quot; &lt;jobId&gt; --rpc-url https://sepolia.base.org</code>
          <p>Browse every decision in the <a href="/ledger">evidence log</a>.</p>
        </div>
      </section>
    </main>
  );
}
