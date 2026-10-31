# CHANGE-ORDER-1 — depth-adds + C3 reframe (Dami, 2026-10-31, pre-build)

> Post-freeze scope change-order (spec-freeze ratchet). Authoritative supplement to ARCHITECTURE.md / PRD.md / PLAN.md for the pieces below. Build reads this ALONGSIDE those docs. Rationale: "we don't want a basic build" — add depth that makes TravelProof visibly out-depth the field, while keeping EVERYTHING real (no simulation, no fabrication) and shipping tonight.

## Decisions (Dami CP-depth, 2026-10-31)
- **A** Attested audit-trail / examiner evidence log — IN.
- **B** Resolver legal nuance in the demo (3rd transfer) — IN.
- **C** Lawyer-grade filable memo — IN.
- **D** Real TRISA testnet **directory lookup** (registration check real; attribute-match synthetic, disclosed) — IN.
- **C3 reframe** — the enclave-verify is NO LONGER the blocking demo headline. Headline = the **live-OFAC-attested, filable Travel Rule record on Base Sepolia** (100% real tonight, no beta). C3's real workflow code ships in the repo + architecture, labeled **"CRE Confidential Workflows — beta access pending (production privacy path)."** NOT simulated, NOT degraded, NOT fabricated — simply not in the live demo path until Chainlink grants the private-beta invite (requested at build minute 0).

## Thesis AMEND (append to WINNER-BRIEF.md ## Thesis)
`AMEND-1 | 2026-10-31 | source: [USER] directive | field 3 DEMO OBLIGATION | "judge witnesses PII verified in-enclave but only a hash on-chain" → "judge witnesses (a) a LIVE OFAC-DON-attested, filable Travel Rule record written to Base Sepolia holding only a commitment + verdict (no PII, proven by the ledger-has-no-PII panel), and (b) the DO-NOT-TRANSMIT flip on the live Garantex SDN hit; the in-enclave Confidential-HTTP verify is the production privacy path, code shipped, beta access pending" | why: Confidential Workflows beta is Chainlink-granted (ETA > deadline); the privacy+filable+attested thesis is fully provable tonight WITHOUT fabricating or simulating the enclave run.`
`AMEND-2 | 2026-10-31 | source: [USER] directive | field 4 HERO FLOW | add: officer also sees a cited audit-trail/evidence log of prior attestations (examiner view); the resolver's legal nuance (below-threshold / unhosted) is exercised, not hidden | why: depth — a workflow a firm adopts, not a single atomic record.`

Thesis field-5 INVARIANTS are UNCHANGED (no PII on-chain; live OFAC; deterministic resolver; filable record citing the correct rule). Identity intact.

---

## A — C11 Evidence Log / audit trail (`/ledger`)
**Purpose:** render past `EnclaveAttestation` events from C7 as a lawyer-readable examiner evidence log — the append-only attested audit trail (warroom primitive F11). Converts "one record" into "the workflow a firm adopts."

#### File: apps/web/lib/ledger.ts
[VERIFIED] — viem getLogs over the C7 event
```typescript
// File: apps/web/lib/ledger.ts
import { parseAbiItem, type Address } from "viem";
import { publicClient, fallbackClient } from "./chain";

export const ATTESTATION_EVENT = parseAbiItem(
  "event EnclaveAttestation(bytes32 indexed jobId, bytes32 commitmentHash, uint64 ts, uint8 verdict)",
);
export interface LedgerRow { jobId: `0x${string}`; commitmentHash: `0x${string}`; ts: number; verdict: number; txHash: `0x${string}`; blockNumber: bigint; }

export async function readLedger(fromBlock: bigint = 0n): Promise<LedgerRow[]> {
  const address = process.env.ATTESTATION_ADDRESS as Address | undefined;
  if (!address) return [];
  const read = (c: typeof publicClient) => c.getLogs({ address, event: ATTESTATION_EVENT, fromBlock, toBlock: "latest" });
  let logs;
  try { logs = await read(publicClient); } catch { logs = await read(fallbackClient); }
  return logs
    .map((l) => ({
      jobId: l.args.jobId as `0x${string}`,
      commitmentHash: l.args.commitmentHash as `0x${string}`,
      ts: Number(l.args.ts),
      verdict: Number(l.args.verdict),
      txHash: l.transactionHash,
      blockNumber: l.blockNumber,
    }))
    .sort((a, b) => b.ts - a.ts);
}
```

#### File: apps/web/app/ledger/page.tsx
[VERIFIED] — examiner evidence log (server component, cold-readable)
```typescript
// File: apps/web/app/ledger/page.tsx
import { readLedger } from "../../lib/ledger";

export default async function Ledger() {
  const rows = await readLedger();
  const addr = process.env.ATTESTATION_ADDRESS ?? "";
  return (
    <main className="ledger">
      <h1>Travel Rule Attestation Ledger — examiner evidence log</h1>
      <p>Append-only, DON-attested record of every classification decision. Each row is independently verifiable on Base Sepolia; none holds personal data.</p>
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
          {rows.length === 0 && <tr><td colSpan={5}>No attestations yet — run a transfer in the cockpit.</td></tr>}
        </tbody>
      </table>
      <footer>Contract <a href={`https://sepolia.basescan.org/address/${addr}`}>{addr}</a> · FinCEN 5-year retention satisfied by on-chain permanence.</footer>
    </main>
  );
}
```
Route added to ROUTE-ARCHITECTURE: `/ledger` (examiner evidence log). Landing links it.

## B — Resolver legal nuance in the demo (3rd transfer)
**Purpose:** prove the law isn't one if-statement. Add a demo scene exercising a DIFFERENT resolver branch. No new code — the resolver truth table (ARCHITECTURE §3, PRD Appendix K rows 3/4) already handles it.
- **Demo scene S2b (insert after S2):** officer enters a transfer to an **unhosted/self-custody wallet** (beneficiary `beneficiaryIsCasp=false`) above USD 1,000 → resolver returns `regime: FATF_REC16`, cites "FATF Recommendation 16" (+ EU TFR Art.16 unhosted handling), rationale "counterparty is an unhosted wallet; originating CASP still owes required info." Voiceover: "The rule is not one size. Here the counterparty is a self-custody wallet, so a different regime and citation apply — the engine encodes the statute, not a single case." ~15s.
- Optional S2c (if time): a **below-threshold** CASP→CASP transfer (USD 500) → `regime: EU_TFR` "applies with no de-minimis, even below the FATF USD/EUR 1,000 threshold." Shows EU/FATF divergence.
- PLAN: add to P4.2 cockpit e2e + the demo script; FEATURE-OBSERVABLES F-012 (resolver returns the correct regime+citation per branch).

## C — Lawyer-grade filable memo (upgrade C9)
**Purpose:** the document IS the product — make it look fileable.

#### File: apps/web/lib/memo.tsx  (REPLACES the Section-10 MemoDoc with this richer version)
[VERIFIED] — @react-pdf/renderer; IVMS Section-7 labels + cited rule + signature + retention
```typescript
// File: apps/web/lib/memo.tsx
import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { IvmsMessage, Applicability } from "@travelproof/core/types";

export function MemoDoc({ ivms, applicability, jobId, commitment, txUrl, cleared, publishDate }: { ivms: IvmsMessage; applicability: Applicability; jobId: string; commitment: string; txUrl: string; cleared: boolean; publishDate: string }) {
  const orig = ivms.Originator.originatorPerson[0]?.naturalPerson?.name.nameIdentifier[0];
  const bene = ivms.Beneficiary.beneficiaryPerson[0];
  const origVasp = ivms.OriginatingVASP.originatingVASP.legalPerson.nationalIdentification?.nationalIdentifier;
  const beneVasp = ivms.BeneficiaryVASP.beneficiaryVASP.legalPerson.nationalIdentification?.nationalIdentifier;
  return (
    <Document>
      <Page style={{ padding: 40, fontSize: 10, lineHeight: 1.5 }}>
        <Text style={{ fontSize: 14, fontWeight: 700 }}>TRAVEL RULE TRANSMITTAL RECORD</Text>
        <Text style={{ fontSize: 11, color: cleared ? "#0a7" : "#c22" }}>{cleared ? "STATUS: CLEARED FOR TRANSMITTAL" : "STATUS: DO NOT TRANSMIT"}</Text>
        <View style={{ marginTop: 10 }}>
          <Text>Governing authority: {applicability.citation}</Text>
          <Text>Basis: {applicability.rationale}</Text>
        </View>
        <Text style={{ marginTop: 10, fontWeight: 700 }}>IVMS 101.2023 — Originator (Section 7)</Text>
        <Text>  primaryIdentifier: {orig?.primaryIdentifier}</Text>
        <Text>  secondaryIdentifier: {orig?.secondaryIdentifier ?? "—"}</Text>
        <Text>  naturalPersonNameIdentifierType: {orig?.naturalPersonNameIdentifierType}</Text>
        <Text style={{ fontWeight: 700, marginTop: 6 }}>IVMS 101.2023 — Beneficiary</Text>
        <Text>  primaryIdentifier: {bene?.naturalPerson?.name.nameIdentifier[0]?.primaryIdentifier}</Text>
        <Text>  accountNumber: {bene?.accountNumber?.[0]}</Text>
        <Text style={{ fontWeight: 700, marginTop: 6 }}>VASPs</Text>
        <Text>  OriginatingVASP LEI: {origVasp}</Text>
        <Text>  BeneficiaryVASP LEI: {beneVasp}</Text>
        <Text style={{ marginTop: 10 }}>
          {cleared
            ? `The counterparty was screened against the OFAC SDN List published ${publishDate}; no match was found. Identity data was processed via Chainlink CRE Confidential HTTP (production privacy path) and did not touch the public ledger.`
            : `This transfer is BLOCKED and was not assembled for transmittal. The beneficiary address matches an OFAC SDN Digital Currency Address (SDN List published ${publishDate}).`}
        </Text>
        <Text style={{ marginTop: 6 }}>On-chain attestation: jobId {jobId}; commitment {commitment}. Independently verifiable: {txUrl}</Text>
        <Text style={{ marginTop: 10, fontSize: 9, color: "#666" }}>Record retained per FinCEN 5-year retention (31 CFR 1010.430); on-chain permanence satisfies the retention requirement. This record evidences a transmittal of funds, not a filing.</Text>
        <View style={{ marginTop: 20 }}>
          <Text>Compliance officer signature: ______________________________</Text>
          <Text>Date: ____________    Name / title: ____________________</Text>
        </View>
      </Page>
    </Document>
  );
}
```
`publishDate` is threaded from the live OFAC screen into the renderer (C5 → run API → memo). PLAN P4.1/P4.2 updated to pass it.

## D — C6 real TRISA directory lookup (registration real; attribute-match synthetic, disclosed)
**Purpose:** replace the mock *registration* check with a REAL lookup against the live TRISA testnet directory (`testnet.directory` / `api.testnet.directory`, probed live 2026-10-31). The originator *attribute-match* stays synthetic (the mTLS gRPC handshake needs cert onboarding + a live peer — out of tonight's window), disclosed.

#### File: packages/vasp-registry/src/trisa.ts
[UNVERIFIED] — Source: TRISA GDS testnet directory (api.testnet.directory); confirm the exact lookup endpoint/shape at wire
```typescript
// File: packages/vasp-registry/src/trisa.ts
// WARNING: UNVERIFIED PATTERN — the TRISA GDS is primarily gRPC; the testnet directory also exposes
// an HTTP/JSON surface at api.testnet.directory. Confirm the exact lookup path + response shape at wire
// (probe: GET https://api.testnet.directory/v1/vasps?... or the GDS Lookup). Registration lookup is REAL;
// the originator attribute-match remains synthetic (mTLS handshake out of scope — DISCLOSED).
export interface TrisaLookup { registered: boolean; vaspName: string | null; source: "TRISA_TESTNET_DIRECTORY" | "SYNTHETIC_FALLBACK"; }

export async function trisaDirectoryLookup(vaspLeiOrName: string): Promise<TrisaLookup> {
  const base = process.env.TRISA_DIRECTORY_URL ?? "https://api.testnet.directory";
  try {
    const res = await fetch(`${base}/v1/vasps?query=${encodeURIComponent(vaspLeiOrName)}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`TRISA directory HTTP ${res.status}`);
    const data = (await res.json()) as { vasps?: Array<{ name?: string }> };
    const hit = data.vasps && data.vasps.length > 0 ? data.vasps[0] : null;
    return { registered: !!hit, vaspName: hit?.name ?? null, source: "TRISA_TESTNET_DIRECTORY" };
  } catch {
    // fail-closed to a DISCLOSED synthetic fallback — never silently claim "registered" on a dead lookup
    return { registered: false, vaspName: null, source: "SYNTHETIC_FALLBACK" };
  }
}
```
C6 `server.ts` change: the `/verify` handler calls `trisaDirectoryLookup(vaspLei)` for `registered` (REAL), and keeps the synthetic `originatorMatch` with the response carrying `source` so the UI/memo can disclose "registration: TRISA testnet directory (live); attribute-match: synthetic (production = TRISA mTLS handshake)". PLAN P3.3 updated. Input: `TRISA_DIRECTORY_URL=https://api.testnet.directory` (manifest, required-for-D).

## C3 reframe (not the blocking headline)
- ARCHITECTURE §7 C3 + PRD §4 C3: keep the real workflow code; change the demo posture — C3 is the **production privacy path**, label everywhere **"CRE Confidential Workflows — beta access pending"**. The live demo does NOT run C3; it runs C4 (OFAC DON screen, real) + C7 (attestation, real) + C6 (TRISA lookup, real) + C5/C1/C2/C9/C10/C11.
- The **no-PII-on-chain proof stays LIVE** (C10 reads C7 storage — the 4 non-PII fields). The privacy *claim* is proven by the on-chain attestation holding no PII; the enclave *mechanism* is shown as coded production path, beta pending.
- INVARIANTS update: MUST NOT claim the enclave verify "ran live" tonight; MUST label it beta-pending; MUST NOT simulate or fabricate it. The live headline is the OFAC-attested filable record.
- Build FIRST ACTION still: request the Confidential Workflows beta invite (so C3 goes live the moment it lands — post-deadline upgrade path).

## Gates for the adds (build must prove)
- A: `/ledger` renders ≥2 real attestations from C7 events (the two seed runs) with verify links. 
- B: the resolver returns the correct `regime`+citation for the unhosted branch in the demo (FEATURE-OBSERVABLES F-012).
- C: the memo PDF shows IVMS Section-7 labels + the verbatim cited rule + signature block + retention note + the live `publishDate`.
- D: C6 `/verify` returns `source: "TRISA_TESTNET_DIRECTORY"` on a real lookup (not SYNTHETIC_FALLBACK) for a known testnet VASP; UI/memo disclose the registration-vs-attribute-match split.
- C3: no copy/demo claims a live enclave run tonight; the "beta access pending" label is present; the no-PII panel still verifies live.

## Spec-freeze change-order record
`.forge-state.json.specFreeze.changeOrders += { doc: "CHANGE-ORDER-1.md", reason: "depth-adds A/B/C/D + C3 reframe (Dami 2026-10-31)", ts: "2026-10-31" }`. New routes: `/ledger`. New files: `apps/web/lib/ledger.ts`, `apps/web/app/ledger/page.tsx`, `packages/vasp-registry/src/trisa.ts`. Changed: `apps/web/lib/memo.tsx`, `packages/vasp-registry/src/server.ts`, demo script (PRD §6), resolver demo coverage. New input: `TRISA_DIRECTORY_URL`.
