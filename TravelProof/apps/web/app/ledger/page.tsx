// File: apps/web/app/ledger/page.tsx
import { readLedger } from "../../lib/ledger";

// Live examiner log - read from chain at request time, never prerendered to a stale snapshot.
export const dynamic = "force-dynamic";

export default async function Ledger() {
  let rows: Awaited<ReturnType<typeof readLedger>> = []; let unavailable = false;
  try { rows = await readLedger(); } catch { unavailable = true; }
  const addr = process.env.ATTESTATION_ADDRESS ?? "";
  return (
    <main className="ledger">
      <a className="back" href="/">← TravelProof</a>
      <h1>Travel Rule Attestation Ledger - examiner evidence log</h1>
      <p>Append-only, DON-attested record of every attested decision. Each row is independently verifiable on Base Sepolia; none holds personal data.</p>
      <table>
        <thead><tr><th>When (UTC)</th><th>Job</th><th>Verdict</th><th>Commitment</th><th>Proof</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.jobId} className={r.verdict === 0 ? "cleared" : "blocked"}>
              <td>{new Date(r.ts * 1000).toISOString()}</td>
              <td title={r.jobId}>{r.jobId.slice(0, 10)}…</td>
              <td>{r.verdict === 0 ? "CLEARED" : "DO NOT TRANSMIT"}</td>
              <td title={r.commitmentHash}>{r.commitmentHash.slice(0, 10)}…</td>
              <td><a href={`/proof/${r.jobId}`}>verify →</a> · <a href={`https://sepolia.basescan.org/tx/${r.txHash}`}>tx</a></td>
            </tr>
          ))}
          {unavailable && <tr><td colSpan={5}>The chain could not be read just now. Nothing is shown rather than a stale or partial list.</td></tr>}
          {!unavailable && rows.length === 0 && <tr><td colSpan={5}>No attestations yet - run a transfer in the cockpit.</td></tr>}
        </tbody>
      </table>
      <footer>Contract <a href={`https://sepolia.basescan.org/address/${addr}`}>{addr}</a> · The chain holds hashes and enums only; retaining the underlying record remains the institution&apos;s obligation.</footer>
    </main>
  );
}
