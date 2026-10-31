// File: apps/web/app/record/[jobId]/page.tsx
import { getRun } from "../../../lib/runStore";
import { getAttestation } from "../../../lib/chain";

// Depends on the ephemeral run store + live chain — request-time only.
export const dynamic = "force-dynamic";

export default async function Record({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const run = getRun(jobId);
  const att = await getAttestation(jobId as `0x${string}`);
  const addr = process.env.ATTESTATION_ADDRESS ?? "";
  if (!run) {
    return (
      <main className="record record-empty">
        <a className="back" href="/cockpit">← Cockpit</a>
        <h1>Record</h1>
        <p>No record for this job. Records live for the lifetime of the server process (ephemeral, no PII persisted). Run the transfer again in the cockpit to assemble it.</p>
      </main>
    );
  }
  const cleared = run.verifyVerdict === 0 && run.screenVerdict === "CLEAR";
  return (
    <main className="record">
      <a className="back" href="/cockpit">← Cockpit</a>
      <header className="record-head">
        <span className={`badge ${cleared ? "badge-ok" : "badge-block"}`}>{cleared ? "CLEARED" : "DO NOT TRANSMIT"}</span>
        <h1>Travel Rule Transmittal Record</h1>
        <p className="authority">Pursuant to {run.applicability.citation}.</p>
        {run.publishDate && <p className="meta">Screened against the OFAC SDN List published {run.publishDate}.</p>}
        <a className="cta cta-primary memo-download" href={`/record/${jobId}/memo.pdf`}>Download filable memo (PDF) →</a>
      </header>
      <section className="record-body">
        <h2>IVMS 101.2023 record</h2>
        <pre className="ivms">{JSON.stringify(run.ivms, null, 2)}</pre>
      </section>
      <footer className="verifiable">
        <div className="verifiable-line"><span className="k">jobId</span><code>{jobId}</code></div>
        <div className="verifiable-line"><span className="k">commitment</span><code>{run.commitmentHash}</code></div>
        <div className="verifiable-links">
          <a href={`https://sepolia.basescan.org/tx/${run.txHash ?? ""}`}>BaseScan tx</a>
          <span aria-hidden="true"> · </span>
          <a href={`/proof/${jobId}`}>the ledger holds no personal data — verify</a>
          <span aria-hidden="true"> · </span>
          <a href={`https://sepolia.basescan.org/address/${addr}`}>contract</a>
          <span className={`attest ${att ? "attest-ok" : "attest-pending"}`}>{att ? "attested" : "pending attestation"}</span>
        </div>
      </footer>
    </main>
  );
}
