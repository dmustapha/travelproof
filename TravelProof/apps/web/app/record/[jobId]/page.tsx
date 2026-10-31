import { getRun } from "../../../lib/runStore";
import { readAttestation, attestationMatches } from "../../../lib/attest";
import { RecordDocument } from "../../../components/RecordDocument";

// Depends on the ephemeral run store + live chain — request-time only.
export const dynamic = "force-dynamic";

export default async function Record({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const run = getRun(jobId);
  const att = await readAttestation(jobId);
  if (!run) {
    return (
      <main className="record record-empty">
        <nav className="crumbs"><a href="/cockpit">Cockpit</a> / record</nav>
        <h1>No record for this job</h1>
        <p className="prose">Records live for the lifetime of the server process (ephemeral; no personal data is persisted). Run the transfer again in the cockpit to assemble it, or view a <a href="/specimen/no-hit">specimen</a>.</p>
      </main>
    );
  }
  return (
    <main className="record">
      <nav className="crumbs"><a href="/cockpit">Cockpit</a> / record <a className="pill pill-solid" href={`/record/${jobId}/memo.pdf`}>Download memo (PDF)</a></nav>
      <RecordDocument run={run} attested={attestationMatches(run, att)} />
      <p className="verify-note">{attestationMatches(run, att) ? <a href={`/proof/${jobId}`}>The ledger holds no personal data — verify the attestation cold</a> : <span>Attestation not yet readable on-chain; nothing is claimed until it is.</span>}{run.txHash && <> · <a href={`https://sepolia.basescan.org/tx/${run.txHash}`}>BaseScan transaction</a></>}</p>
    </main>
  );
}
