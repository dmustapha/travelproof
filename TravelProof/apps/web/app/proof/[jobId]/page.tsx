// File: apps/web/app/proof/[jobId]/page.tsx
import { getAttestation } from "../../../lib/chain";

// Cold on-chain read at request time (no wallet, no prerender).
export const dynamic = "force-dynamic";

export default async function Proof({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const att = await getAttestation(jobId as `0x${string}`).catch(() => null);
  const addr = process.env.ATTESTATION_ADDRESS ?? "";
  if (!att) {
    return (
      <main className="proof proof-empty">
        <a className="back" href="/">← TravelProof</a>
        <h1>Proof</h1>
        <p>No attestation found for this id on Base Sepolia. The job may not have been attested yet, or the id is wrong.</p>
        <p className="meta">You can still verify directly against the contract: <a href={`https://sepolia.basescan.org/address/${addr}`}>{addr}</a></p>
      </main>
    );
  }
  const verdict = att.verifyVerdict === 0 && att.screenVerdict === 0 ? "CLEARED" : "BLOCKED";
  return (
    <main className="proof">
      <a className="back" href="/">← TravelProof</a>
      <header className="proof-head">
        <span className={`badge ${verdict === "CLEARED" ? "badge-ok" : "badge-block"}`}>{verdict}</span>
        <h1>On-chain attestation</h1>
        <p className="meta">Read cold from Base Sepolia — no wallet, no login.</p>
      </header>
      <table className="att-table">
        <tbody>
          <tr><td>commitmentHash (bytes32, a hash)</td><td><code>{att.commitmentHash}</code></td></tr>
          <tr><td>verifyVerdict (uint8, enum)</td><td>{att.verifyVerdict}</td></tr>
          <tr><td>screenVerdict (uint8, enum)</td><td>{att.screenVerdict}</td></tr>
          <tr><td>ts (uint64, timestamp)</td><td>{att.ts} <span className="muted">({new Date(att.ts * 1000).toISOString()})</span></td></tr>
        </tbody>
      </table>
      <a className="basescan-link" href={`https://sepolia.basescan.org/address/${addr}`}>View contract on BaseScan →</a>
      <section className="no-pii">
        <h2>The ledger holds no personal data</h2>
        <p>Every field above is a hash, an enum, or a timestamp. There is no name, address, or identity field in the contract storage. Verify yourself:</p>
        <pre className="verify-cmd">cast call {addr} &quot;getAttestation(bytes32)&quot; {jobId} --rpc-url https://sepolia.base.org</pre>
      </section>
    </main>
  );
}
