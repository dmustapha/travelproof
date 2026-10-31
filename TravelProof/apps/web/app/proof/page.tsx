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
        <h1>Verify an attestation</h1>
        <p className="meta">Paste a jobId to read its on-chain attestation cold — no wallet, no login.</p>
      </header>
      <form
        className="lookup-form"
        onSubmit={(e) => { e.preventDefault(); if (jobId.trim()) router.push(`/proof/${jobId.trim()}`); }}
      >
        <input
          aria-label="jobId"
          placeholder="0x…"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        />
        <button type="submit" disabled={!jobId.trim()}>Verify →</button>
      </form>
      <p className="meta">Or browse every attestation in the <a href="/ledger">examiner evidence log</a>.</p>
    </main>
  );
}
