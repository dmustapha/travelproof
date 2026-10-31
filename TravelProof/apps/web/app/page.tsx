// File: apps/web/app/page.tsx
import { getAttestation } from "../lib/chain";
import { jobIdForSeed } from "../lib/seedIds";

// Reads live on-chain attestation state — render at request time, not at build.
export const dynamic = "force-dynamic";

export default async function Landing() {
  const sampleJob = jobIdForSeed("0xB0B0000000000000000000000000000000000B0B");
  const att = await getAttestation(sampleJob);
  const sampleCleared = att ? att.verifyVerdict === 0 && att.screenVerdict === 0 : false;
  return (
    <main className="landing">
      <section className="hero">
        <span className="eyebrow">FATF Travel Rule · Base Sepolia</span>
        <h1>TravelProof</h1>
        <p className="lede">
          Privacy-preserving FATF Travel Rule records for crypto exchanges. Verify the person,
          hide the person, attested on-chain.
        </p>
        <nav className="cta-row">
          <a className="cta cta-primary" href="/cockpit">Open the cockpit</a>
          <a className="cta cta-quiet" href="/proof">Verify an attestation</a>
          <a className="cta cta-quiet" href="/ledger">Examiner evidence log</a>
        </nav>
      </section>

      <section className="sample-wrap" aria-label="Live sample attestation">
        {att ? (
          <a className="sample-card" href={`/proof/${sampleJob}`}>
            <span className="sample-label">Live attestation · Base Sepolia</span>
            <span className={`badge ${sampleCleared ? "badge-ok" : "badge-block"}`}>
              {sampleCleared ? "CLEARED" : "BLOCKED"}
            </span>
            <code className="sample-job">{sampleJob.slice(0, 18)}…</code>
            <span className="sample-cta">view proof →</span>
          </a>
        ) : (
          <div className="sample-card sample-empty">
            <span className="sample-label">Live attestation</span>
            <p>No seeded attestation on-chain yet — run a transfer in the cockpit, then it appears here and in the ledger.</p>
            <a className="sample-cta" href="/cockpit">Open the cockpit →</a>
          </div>
        )}
      </section>

      <footer className="honesty">
        <a href="/LIMITATIONS.md">Limitations</a>
        <span aria-hidden="true"> · </span>
        <a href="/SUBMISSION_STATUS.md">Submission status</a>
        <p className="beta-note">
          In-enclave identity verify is the production privacy path — CRE Confidential Workflows,
          beta access pending. Tonight&apos;s live headline is the OFAC-attested, filable record and the
          no-PII proof.
        </p>
      </footer>
    </main>
  );
}
