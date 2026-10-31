# PRD — TravelProof

> **Product Requirements Document** · BLI Legal Tech Hackathon 2 · Track: **LegalTech & RegTech** (+ Chainlink CRE $2K bounty)
> Source: warroom V1 (WINNER-BRIEF.md, Round-0 7.54, rank 1/6) · scope_mode: **standard** (SPRINT) · Author: forge
> Thesis is locked in `warroom/WINNER-BRIEF.md ## Thesis`; this document references it, never restates-with-modification.

---

## Section 1: Project Overview

**Project:** TravelProof
**One line:** A privacy-preserving FATF Travel Rule compliance tool that produces a lawyer-filable, independently-attested transfer record for crypto VASPs — verify the person, hide the person.

**Hackathon:** BLI Legal Tech Hackathon 2 (DoraHacks) · **Track:** LegalTech & RegTech · **Deadline:** 2026-11-01 02:01 UTC+1 · Internal cutoff 2026-10-31 20:00 WAT.

**Problem statement (the one shocking number).**
The Travel Rule forces a Virtual Asset Service Provider (VASP) to *transmit* verified originator/beneficiary identity on transfers above a threshold **while simultaneously protecting that PII** — two obligations that pull in opposite directions, and most exchanges still cannot cleanly meet both. Meanwhile **OFAC's SDN list now carries digital-currency-address entries across ~20 chains** (live, verified against `sanctionslistservice.ofac.treas.gov` on 2026-10-28, SHA-256 digest `0213f3a0…`), yet **0 of the 16 builds** in this hackathon field produce a privacy-preserving, independently-attested, *filable* Travel Rule record.

**Solution summary.**
A compliance officer enters a pending transfer. A **deterministic resolver** (statute-encoded, no AI on the decision path) classifies it against FATF Rec.16 / EU TFR Art.14 and assembles an **IVMS 101.2023** message. A **Chainlink CRE Confidential HTTP** workflow verifies the counterparty VASP and originator **inside a TEE enclave** — the PII never touches the public ledger. A **CRE DON-consensus** workflow screens the counterparty against the **live OFAC SDN feed**. A **DON-signed report** is delivered to a **TravelRuleAttestation** contract on **Base Sepolia (84532)**, which stores only a commitment hash + verdict and emits an `EnclaveAttestation` event. The deliverable is a **filable IVMS101 record + a one-page officer memo** citing the governing rule, with an on-chain-verifiable footer.

**Why this wins (mapped to judging criteria).**
| Criterion | Weight | How TravelProof scores |
|---|:--:|---|
| Legal-workflow credibility ("make lawyers nod") | 40% | A real VASP obligation, the **correct** authorities cited verbatim (EU TFR Art.14 / FATF Rec.16 / FinCEN FIN-2019-G001 — *not* the bank-MSB §1010.410(f) misread), output is a filable IVMS101 record + signed officer memo, not a dashboard verdict. |
| Technical execution / working demo | 25% | Dual CRE primitive genuinely load-bearing; live OFAC screen; real Base Sepolia attestation tx a judge can open on BaseScan. |
| Innovation / problem-solution fit | 20% | Regulatory-filing whitespace (0 Travel-Rule builds); the verify-but-hide paradox is a genuine aha. |
| Presentation / polish | 15% | The CLEARED → DO-NOT-TRANSMIT flip is the strongest demo beat in the field; lawyer-first UI. |

**Thesis framing (THESIS-1).** This document's framing restates Thesis field 1: *TravelProof is the only build that resolves the Travel Rule's core contradiction — prove identity yet protect PII — with an independently-attested, lawyer-filable record.* Nothing matching a drift tripwire ("we hashed an AI verdict on-chain"; "the chain is the product") is the headline.

---

## Section 2: System Architecture Overview

```
                        ┌─────────────────────────────────────────────┐
                        │   OFFICER COCKPIT  (Next.js, lawyer's view)   │
                        │  enter transfer · see classification · verdict │
                        └───────────────┬───────────────────────────────┘
                                        │ transfer intent (JSON)
                                        ▼
        ┌───────────────────────────────────────────────────────────────┐
        │  DETERMINISTIC TRAVEL RULE RESOLVER  (TS lib, statute-encoded)  │
        │  applicability (Rec.16 / TFR Art.14) → required-fields set      │
        └───────────────┬───────────────────────────────────────────────┘
                        │ applicable + required fields
                        ▼
        ┌───────────────────────────────────────────────────────────────┐
        │  IVMS101 RECORD BUILDER + VALIDATOR (TS, IVMS 101.2023)         │
        │  assemble Originator/Beneficiary/VASPs · enforce C1/C6          │
        └───────┬───────────────────────────────────────────┬───────────┘
                │ verify request (PII)                        │ screen request (addr+name)
                ▼                                             ▼
   ┌──────────────────────────────┐          ┌──────────────────────────────────┐
   │ CRE CONFIDENTIAL-HTTP VERIFY  │          │ CRE DON-CONSENSUS OFAC SCREEN      │
   │ WORKFLOW (in-enclave TEE)     │          │ WORKFLOW (Byzantine-quorum)        │
   │  → VASP Registry Verify EP    │          │  → OFAC SDN Fetcher/Parser         │
   │  PII stays in enclave         │          │  → LIVE sanctionslistservice feed  │
   └──────────────┬───────────────┘          └──────────────────┬─────────────────┘
                  │ DON-signed report (commitment + verdict)     │ DON-signed report (screen verdict)
                  └──────────────────────┬───────────────────────┘
                                         ▼
                     ┌──────────────────────────────────────────────┐
                     │  TravelRuleAttestation  (Solidity, Base 84532) │
                     │  IReceiver.onReport → store commitment+verdict │
                     │  emit EnclaveAttestation(jobId,commitment,ts)  │
                     └───────────────┬────────────────────────────────┘
                                     │ attestation id + tx hash
                                     ▼
        ┌───────────────────────────────────────────────────────────────┐
        │  FILABLE RECORD + MEMO RENDERER  +  ON-CHAIN VERIFIER / PROOF   │
        │  IVMS101 record · cited officer memo (PDF) · verifiable footer  │
        │  ledger-has-no-PII panel · BaseScan link                       │
        └───────────────────────────────────────────────────────────────┘
```

**Component table.**
| # | Name | Type | Purpose | Key Dependencies |
|---|------|------|---------|------------------|
| C1 | Deterministic Travel Rule Resolver | TS library | Decide applicability (Rec.16/TFR Art.14) + emit required-fields set; no AI on decision path | — |
| C2 | IVMS101 Record Builder + Validator | TS library | Assemble IVMS 101.2023 message; enforce constraints C1/C6; validate completeness | C1 |
| C3 | CRE Confidential-HTTP Verify Workflow | CRE TS workflow | In-enclave verification of counterparty VASP + originator; PII never leaves enclave | C2, C6, cre-sdk |
| C4 | CRE DON-Consensus OFAC Screen Workflow | CRE TS workflow | Byzantine-quorum screen of counterparty address + name against live SDN | C5, cre-sdk |
| C5 | OFAC SDN Fetcher/Parser | TS module (runs inside C4 path) | Stream-fetch + parse live SDN.XML; extract Digital Currency Address ids + aka names | OFAC feed |
| C6 | VASP Registry Verify Endpoint | TS service (mock + production path) | The confidential endpoint the enclave calls; returns VASP registration + originator match | TRISA sandbox (prod path) |
| C7 | TravelRuleAttestation contract | Solidity (Base Sepolia) | IReceiver consumer; store commitment+verdict; emit EnclaveAttestation; forwarder-guarded | C3, C4, KeystoneForwarder |
| C8 | Officer Cockpit | Next.js page/route | Lawyer's entry view: enter transfer, see classification + verdict, trigger flows | C1, backend API |
| C9 | Filable Record + Memo Renderer | Next.js + PDF | Render IVMS101 record + cited officer memo + on-chain-verifiable footer; PDF export | C2, C7 |
| C10 | On-chain Verifier / Proof page | Next.js route | Resolve the attestation from chain; ledger-has-no-PII panel; BaseScan links | C7, Base RPC |

**Data flow (numbered).**
1. Officer submits a `TransferIntent` from the cockpit (C8).
2. Resolver (C1) returns `Applicability` (regime + required-fields set + citation). If `applicable:false`, stop with a cited explanation.
3. Record builder (C2) assembles the IVMS101 message from the intent and validates constraints C1/C6 → `INCOMPLETE` blocks progress until satisfied.
4. Two CRE workflows run **in parallel**:
   - C3 (Confidential HTTP) sends the PII-bearing verify request **inside the enclave** to C6; only `{commitmentHash, verifyVerdict}` leave.
   - C4 (DON consensus) screens address + name against the **live** SDN index built by C5; nodes agree a `screenVerdict`.
5. Each workflow produces a **DON-signed report** (`ecdsa`/`keccak256`) delivered via KeystoneForwarder to C7.
6. C7 stores `{commitmentHash, verifyVerdict, screenVerdict, ts}` keyed by `jobId` and emits `EnclaveAttestation`.
7. C9 renders the filable IVMS101 record + officer memo with an on-chain-verifiable footer (jobId + BaseScan link → C10).
8. C10 resolves the attestation from chain and renders the ledger-has-no-PII panel.

**State management.**
| State | Where it lives | PII? | Lifetime |
|-------|----------------|:--:|----------|
| Transfer intent + assembled IVMS record | server-side, in-memory / ephemeral store (synthetic only) | yes (synthetic) | request-scoped; never persisted publicly |
| Enclave verify result (registration, originator match) | inside the CRE enclave only | yes | enclave-scoped; discarded; only commitment+verdict emitted |
| Commitment hash, verdicts, ts, jobId | **on-chain (C7, Base Sepolia)** | **no** | permanent |
| Rendered record/memo PDF | officer's local export | yes (synthetic) | officer-controlled |
| Seeded sample attestations | on-chain + a small index file | no | demo-lifetime |

The *authoritative trust state* is on-chain in C7. No PII is persisted to any public store — this is enforced structurally (C7 has no PII-typed field; see INVARIANTS §1).

---

## Section 3: User Flows

**Flow F1 — Classify a pending transfer (applicability).**
1. Officer opens the cockpit (C8), enters: amount + asset, originator (synthetic natural person), beneficiary, originating VASP, beneficiary VASP + its address.
2. Resolver (C1) evaluates: is this a crypto-asset transfer between CASPs (EU TFR Art.14 → applies regardless of value) and/or ≥ USD/EUR 1,000 (FATF Rec.16 de-minimis)? Returns `applicable: true/false` + the exact required-fields set + the governing citation.
3. Cockpit shows a plain-language applicability banner with the cited rule.
   - *Edge:* below FATF threshold **and** non-CASP path → `applicable:false` with a cited explanation (not an error).

**Flow F2 — In-enclave counterparty + originator verification.**
1. Record builder (C2) assembles the IVMS101 message and marks it `INCOMPLETE` until C1/C6 constraints are satisfied.
2. CRE Confidential-HTTP workflow (C3) sends the PII-bearing verify request **inside the enclave** to the VASP Registry endpoint (C6); the response (registration status, originator match) is handled in-enclave; only a **commitment hash + a boolean verdict** are emitted in the DON-signed report.
   - *Edge:* VASP not registered → `verify:FAIL` → routes to DO-NOT-TRANSMIT (F5).
   - *Failure:* enclave/endpoint timeout → honest `DEGRADED` state surfaced, not a silent pass.

**Flow F3 — DON-consensus OFAC sanctions screen.**
1. CRE DON screen workflow (C4) fetches the **live** SDN feed via C5 and screens the beneficiary address (exact match) + beneficiary name (fuzzy, over names + akas).
2. DON nodes reach Byzantine-quorum consensus on the pass/fail; the agreed verdict is signed into the report.
   - *Edge:* address is on the SDN list (e.g. Garantex) → `screen:HIT` → DO-NOT-TRANSMIT (F5).
   - *Failure:* feed unreachable → `DEGRADED` (loud), never a fabricated clear.

**Sequence (F2 + F3, the dual-CRE core):**
```
Officer     Cockpit(C8)   Resolver(C1)  Builder(C2)   CRE-Verify(C3)  VASPReg(C6)   CRE-Screen(C4)  SDN(C5)   Attest(C7)
  │ submit     │             │             │               │             │              │           │          │
  │───────────>│ classify    │             │               │             │              │           │          │
  │            │────────────>│ Applicability│              │             │              │           │          │
  │            │<────────────│             │               │             │              │           │          │
  │            │ build+validate────────────>│ INCOMPLETE?  │             │              │           │          │
  │            │             │   (C1/C6)    │               │             │              │           │          │
  │            │ run (parallel) ───────────────────────────>│ enclave verify (PII) ───>│ registered?│          │
  │            │             │             │               │             │<────────────│ (in-enclave)│          │
  │            │ run (parallel) ─────────────────────────────────────────────────────>│ screen ───>│ fetch LIVE
  │            │             │             │               │             │              │<──────────│ index    │
  │            │             │             │   DON-signed report(verify) ─────────────────────────────────────>│ store+emit
  │            │             │             │   DON-signed report(screen) ─────────────────────────────────────>│ store+emit
  │            │<───────────────────────────── CLEARED (jobId, txHash) ─────────────────────────────────────────│
```

**Flow F4 — CLEARED → filable record + memo + attestation.**
1. Both verdicts pass → C7 receives the DON-signed report(s) via KeystoneForwarder and stores commitment + verdicts + jobId + ts on Base Sepolia, emitting `EnclaveAttestation`.
2. C9 renders the **filable IVMS101 record** (Section-7 field names) + a **one-page officer memo** citing EU TFR Art.14 / FATF Rec.16, with an on-chain-verifiable footer (attestation id + BaseScan link). Officer exports PDF and signs.

**Flow F5 — DO-NOT-TRANSMIT flip.**
1. Any FAIL (unregistered VASP in F2 or SDN HIT in F3) → the cockpit flips to a red **DO NOT TRANSMIT** state with the cited reason.
2. C7 records a `blocked` attestation (verdict + reason code, still no PII); C9 renders a block memo citing the basis. The transfer is never assembled for transmission.

**Flow F6 — Judge verifies the attestation (proof).**
1. Judge opens the Proof page (C10), pastes/clicks the attestation id.
2. C10 resolves the on-chain record from Base Sepolia, shows the stored commitment + verdicts + ts, links to the BaseScan tx, and renders the **ledger-has-no-PII panel** — proving the chain holds only a hash and verdict, no identity data.
3. Judge optionally re-runs the public RPC read themselves (the panel shows the exact `cast call` command) and recomputes the commitment from the committed canonical payload — independent reproduction, no trust in us.
   - *Edge:* unknown/garbage jobId → "no attestation found for this id" (not an error page).
   - *Cold-start:* a judge who never saw the officer app lands here from the landing sample and still reaches full verification.

**Flow F1/F5 edge enumeration (completeness).**
- F1-e1: `applicable:false` (no CASP in path) → cited explanation card, offer to proceed as a non-Travel-Rule transfer (out of scope, labeled).
- F1-e2: unknown CASP status → `NEEDS_HUMAN_REVIEW`, the run does not start.
- F5-e1: unregistered VASP (verify FAIL) → DO-NOT-TRANSMIT with a *different* cited basis (counterparty not a registered CASP) than the sanctions case.
- F5-e2: both verify FAIL and screen HIT → BLOCKED with both reasons listed; still no PII on-chain.
- F5-e3: DEGRADED on either leg → neither CLEARED nor BLOCKED; a loud "cannot attest — dependency degraded" state that never silently clears.

---

## Section 4: Technical Specifications

### C1 — Deterministic Travel Rule Resolver
- **Purpose/responsibilities:** pure, statute-encoded applicability decision + required-fields derivation. No network, no AI.
- **Interface (spec, not implementation):**
```typescript
interface TransferIntent {
  amount: string; assetSymbol: string; fiatValueUsd: number;
  originatorIsCasp: boolean; beneficiaryIsCasp: boolean;
  originatorChainAddress?: string; beneficiaryChainAddress: string;
}
interface Applicability {
  applicable: boolean | "NEEDS_HUMAN_REVIEW"; // Row-7 of the truth table
  regime: "EU_TFR" | "FATF_REC16" | "BOTH" | "NONE";
  requiredOriginatorFields: string[]; requiredBeneficiaryFields: string[];
  citation: string; // verb-correct, from the citation registry
  rationale: string; // plain-language
}
declare function classify(intent: TransferIntent): Applicability;
```
- **Key data structures:** a frozen citation registry (EU TFR Art.14(1)(a-d)/(2)(a-c); FATF Rec.16 + USD/EUR 1,000 de-minimis; FinCEN FIN-2019-G001 context).
- **Key decision:** applicability is a truth table (Appendix K), not heuristics — so a lawyer can audit every branch and the same input always yields the same verdict + citation.
- **Edge handling:** unknown CASP status → `NEEDS_HUMAN_REVIEW`; below-threshold non-CASP → `NONE` with a cited explanation (not an error).
- **Dependencies:** none. **Perf:** synchronous, <1ms.

### C2 — IVMS101 Record Builder + Validator
- **Purpose:** assemble an IVMS 101.2023 message and enforce constraints C1 (≥1 of geographicAddress[GEOG/HOME/BIZZ]/customerIdentification/nationalIdentification/dateAndPlaceOfBirth) and C6 (≥1 nameIdentifierType = `LEGL`).
- **Interface (spec):**
```typescript
interface NaturalPersonName { nameIdentifier: Array<{ primaryIdentifier: string; secondaryIdentifier?: string; naturalPersonNameIdentifierType: "LEGL" | "BIRT" | "MAID" | "ALIA" }>; }
interface NaturalPerson {
  name: NaturalPersonName; geographicAddress?: Address[];
  nationalIdentification?: NationalIdentification; customerIdentification?: string; // NOTE: not "...Number"
  dateAndPlaceOfBirth?: DateAndPlaceOfBirth; countryOfResidence?: string;
}
interface IvmsMessage { Originator: { originatorPerson: Person[] }; Beneficiary: {...}; OriginatingVASP: {...}; BeneficiaryVASP: {...}; TransferPath?: {...}; PayloadMetadata?: {...}; }
interface ValidationResult { complete: boolean; violations: Array<{ constraint: "C1" | "C6"; field: string; message: string }>; }
```
- **Key decision:** use IVMS 101.2023 verbatim (entities UpperCamelCase, elements lowerCamelCase; `customerIdentification` not `…Number`) — the recognized standard an examiner expects; a bespoke schema would read as a toy.
- **Dependencies:** C1. **Perf:** synchronous.

### C3 — CRE Confidential-HTTP Verify Workflow
- **Purpose:** in-enclave verification; PII→enclave, only commitment+verdict→chain.
- **Interface (spec):** CRE workflow handler; uses `ConfidentialHTTPClient.sendRequest(runtime, { request: { url, method, multiHeaders, encryptOutput: true }, vaultDonSecrets })`; emits a report with `encoderName:"evm"`, `signingAlgo:"ecdsa"`, `hashingAlgo:"keccak256"`.
- **Consumes:** C6 endpoint. **Produces:** `{ commitmentHash: bytes32, verifyVerdict: uint8 (0=PASS,1=FAIL,2=DEGRADED), jobId: bytes32 }` in the DON-signed report.
- **Dependencies:** `@chainlink/cre-sdk` 1.23.0; Vault DON secret for the endpoint key. **Perf:** enclave fetch timeout ≤10s (SDK max).

### C4 — CRE DON-Consensus OFAC Screen Workflow
- **Purpose:** Byzantine-quorum screen against the live SDN feed.
- **Interface (spec):** uses `runtime.runInNodeMode(screenFn, consensusIdenticalAggregation<ScreenVerdict>())` so all honest nodes must agree the pass/fail; agreed verdict signed into the report.
- **Consumes:** C5. **Produces:** to the UI `{ screenVerdict: "CLEAR" | "HIT" | "DEGRADED", matchedUid?: string }`; the **on-chain** report carries only `abi(jobId, screenVerdict)` — `matchedUid` is non-PII display metadata and is deliberately NOT attested (keeps the on-chain report minimal).
- **Key decision:** `consensusIdenticalAggregation` (Byzantine-exact) not `median` — a sanctions pass/fail is binary and must be unanimously agreed by honest nodes; `.withDefault(DEGRADED)` on no-consensus never defaults to CLEAR.
- **Dependencies:** cre-sdk. **Perf:** governed by feed fetch (stream).

### C5 — OFAC SDN Fetcher/Parser
- **Purpose:** fetch the live feed (follow 302 → S3 signed URL), stream-parse `<sdnList>/<sdnEntry>`, index `<idList>/<id>` where `idType` starts `Digital Currency Address`, and all `<aka>` names.
- **Interface (spec):**
```typescript
interface SdnIndex { addresses: Set<string>; names: Array<{ uid: string; name: string; isAka: boolean }>; publishDate: string; recordCount: number; }
declare function fetchAndIndexSdn(url: string): Promise<SdnIndex>;
declare function screenAddress(idx: SdnIndex, addr: string): { hit: boolean; uid?: string };
declare function screenName(idx: SdnIndex, name: string, threshold?: number): { hit: boolean; uid?: string; score?: number };
```
- **Rules:** addresses exact-match (base58 case-sensitive; EVM checksum/case-insensitive); names Jaro-Winkler ≥0.85. Stream-parse (feed >10MB). **Startup self-check:** confirm the demo HIT address is present in the fresh index; fail loud if absent.
- **Key decision:** parse the flat legacy `SDN.XML` (address sits directly in `<idList>/<id>/<idNumber>`), not the relational advanced model — fewer joins, faster to a correct screen; follow the 302 to the S3 signed URL.
- **Key decision:** no cached fallback list exists in the repo — a dead feed yields `SCREEN_DEGRADED`, never a stale "clear" (the Tornado Cash delisting proves a cached list silently lies).
- **Dependencies:** OFAC feed, `fast-xml-parser`, `fuzzball`.

### C6 — VASP Registry Verify Endpoint
- **Purpose:** the confidential endpoint the enclave calls; returns VASP registration status + originator attribute match. Labeled **mock with a documented production path** (TRISA testnet directory).
- **Interface (spec):** `POST /verify { vaspLei, originatorHash } → { registered: bool, originatorMatch: bool, vaspName }`.
- **Key decision:** a disclosed mock with a named production path (TRISA testnet directory), not a hidden mock — the honesty is itself a credibility signal to a lawyer; the enclave→endpoint call is real even though the registry data is synthetic.
- **Dependencies:** TRISA sandbox (prod path). **Honesty:** the mock is explicitly disclosed in LIMITATIONS.md + the memo footer; the production path (TRISA directory lookup) is named.

### C7 — TravelRuleAttestation contract (Base Sepolia)
- **Purpose:** receive DON-signed reports, store trust state, emit the attestation event. Holds **no PII**.
- **Interface (spec):**
```solidity
interface ITravelRuleAttestation {
  event EnclaveAttestation(bytes32 indexed jobId, bytes32 commitmentHash, uint64 ts, uint8 verdict); // verdict: 0=CLEARED,1=BLOCKED
  function getAttestation(bytes32 jobId) external view returns (bytes32 commitmentHash, uint8 verifyVerdict, uint8 screenVerdict, uint64 ts);
}
```
- **Mechanism:** implements the `ReceiverTemplate` pattern (`IReceiver.onReport` + a hand-rolled forwarder guard, not framework inheritance — keeps the contract dependency-free); `_processReport(bytes report)` decodes by length; caller guarded to `s_forwarderAddress`.
- **Key decision:** the struct has **no string/bytes PII-capable field** — the headline invariant (no PII on-chain) is enforced by the type system, not by a runtime check that could be bypassed.
- **Key decision:** two verdicts stored separately (verify, screen) so the Proof page can show *why* a transfer was BLOCKED, while the event carries the single CLEARED/BLOCKED rollup for cheap indexing.
- **Dependencies:** KeystoneForwarder (Chainlink-managed), C3/C4 reports.

### C8 — Officer Cockpit (Next.js)
- **Purpose:** lawyer's-view entry + live status. Implements the state machine in Appendix L.
- **Surfaces:** (a) a new-transfer form (amount/asset, originator/beneficiary identity, VASP LEIs, beneficiary address); (b) a cited **applicability banner** (green/amber with the exact citation string); (c) a dual-CRE status strip (verify ‖ screen, each PENDING→PASS/FAIL/DEGRADED); (d) the terminal **CLEARED** (green, → record) or **DO NOT TRANSMIT** (red, cited basis) card.
- **Interface:** React Server Components + server actions → a backend API wrapping C1/C2 and invoking the CRE run; no client-side secret. **Key decision:** there is no manual verdict override control — every terminal state is produced by a real run.
- **Dependencies:** C1, C2, backend API.

### C9 — Filable Record + Memo Renderer (Next.js + PDF)
- **Purpose:** render the regulator-recognized deliverable.
- **Layout:** (1) header "Travel Rule Transmittal Record — CLEARED/BLOCKED"; (2) the IVMS 101.2023 record rendered with its field labels (Appendix B paths → human labels); (3) a one-page **officer memo** in prose citing the governing rule from the registry (Appendix F excerpt is the template); (4) an **on-chain-verifiable footer**: jobId, commitment (first bytes), the Base Sepolia attestation address, a BaseScan tx link, and a one-line "the ledger holds no personal data — verify →" pointer to `/proof/[jobId]`.
- **Interface:** `renderMemo(record, applicability, attestation) → { html, pdfBuffer }`; a signature block for the officer. **Key decision:** PDF export (not just HTML) because a lawyer files/signs a document, not a webpage.
- **Dependencies:** C2, C7.

### C10 — On-chain Verifier / Proof page (Next.js)
- **Purpose:** let a cold third party (judge/examiner) independently trust the claim.
- **Surfaces:** (a) a jobId resolver (paste or deep-link); (b) the resolved attestation card (commitment, verifyVerdict, screenVerdict, ts, CLEARED/BLOCKED); (c) the BaseScan tx + address links; (d) the **ledger-has-no-PII panel** — enumerates the four on-chain storage fields and states, for each, that it is a hash/enum/timestamp and carries no identity data, with the contract source cited.
- **Interface:** `getAttestation(jobId)` via a public Base Sepolia RPC read of C7 (+ fallback RPC). No wallet, no auth. **Key decision:** a separate cold route so verification never requires touching the officer app.
- **Dependencies:** C7, Base Sepolia RPC (A3).

---

## Section 5: API Contracts

### A1 — OFAC SDN feed (external, LIVE)
- **Endpoint:** `GET https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML` (old `treasury.gov/ofac/downloads/sdn.xml` 302-redirects here → AWS GovCloud S3 signed URL; **must follow redirects**).
- **Response:** `text/xml`, >10MB; `<sdnList>` with `<publshInformation>` (`<Publish_Date>`, `<Record_Count>`) + `<sdnEntry>` records.
- **Auth:** none. **Freshness:** `<Publish_Date>` / S3 `Last-Modified` / Digest sha-256 header. **Rate/size:** stream-parse; cache the fresh index per run (not stubbed).

### A2 — VASP Registry Verify Endpoint (our service; TRISA prod path)
- **Endpoint:** `POST {VASP_VERIFY_URL}/verify` — called **only from inside the enclave** (C3).
- **Request:** `{ vaspLei: string, originatorHash: string }`. **Response:** `{ registered: boolean, originatorMatch: boolean, vaspName: string }`.
- **Auth:** bearer key via CRE Vault DON secret (`{{.VASP_VERIFY_KEY}}`). **Error handling:** timeout ≤10s → `DEGRADED`.

### A3 — Base Sepolia RPC (external)
- **Endpoint:** `https://sepolia.base.org` (chainId `0x14a34` = 84532, verified). **Methods:** `eth_call` (read C7), `eth_getLogs` (events), tx submission handled by CRE/KeystoneForwarder.
- **Auth:** none for public reads; deploy key for contract deploy. **Rate limits:** public endpoint — use a fallback RPC for the demo.

### A4 — CRE workflow runtime + KeystoneForwarder
- **Surface:** `@chainlink/cre-sdk` 1.23.0 — `ConfidentialHTTPClient`, `EVMClient.writeReport`, `runtime.report`, `runtime.runInNodeMode`. Base Sepolia selector `10344971235874465080` / `ethereum-testnet-sepolia-base-1`.
- **Run model:** `cre workflow simulate` (local WASM, only `cre login`) for the demo; full managed-DON deploy needs `cre account access` (allowlist) + Confidential Workflows private-beta invite.
- **Auth:** `cre login`; Vault DON secrets. **Failure:** gated access → simulate path (documented degradation).

---

## Section 6: Demo Script

**Target length:** ≤300s (DoraHacks). Workflow-first (the lawyer's view), not code-first. No em dashes in voiceover; active voice.

| Scene | On screen | Voiceover | Dur | Flow |
|------|-----------|-----------|:--:|:--:|
| S1 | Cockpit: officer enters a 5,000 USDC transfer, synthetic originator, a beneficiary VASP | "A compliance officer has a transfer to send. The Travel Rule says they must pass verified identity to the other exchange, and also protect that identity. Watch how TravelProof does both." | 35s | F1 |
| S2 | Applicability banner lights up with the cited rule | "TravelProof classifies this deterministically. Regulation EU 2023/1113 Article 14 applies to crypto transfers between providers, with no minimum. No AI decides this. The statute does." | 35s | F1 |
| S3 | Verify step runs; a panel shows PII entering the enclave, only a hash leaving | "Verification runs inside a Chainlink CRE confidential enclave. The counterparty and originator are checked against a registry, but the identity data never leaves the enclave. Only a commitment hash and a yes-or-no come out." | 45s | F2 |
| S4 | OFAC screen runs against the live feed; CLEAR; CLEARED state | "In parallel, the sanctions screen hits the live OFAC list, right now, no cached copy. The decentralized oracle network agrees on the result and signs it. This counterparty is clear." | 40s | F3 |
| S5 | Filable IVMS101 record + officer memo render; PDF export; footer with BaseScan link | "Out comes the deliverable a lawyer actually files. An IVMS 101 record and a one-page memo citing the governing rule, with an on-chain verifiable footer. Not a dashboard. A document." | 45s | F4 |
| S6 | New transfer to the Garantex sanctioned address; screen flips to red DO NOT TRANSMIT with the cited basis | "Now a transfer to a wallet that is actually on the OFAC sanctions list. The screen flips to do not transmit, and records why. The transfer is never assembled." | 35s | F5 |
| S7 | Proof page: judge opens the attestation, sees commitment + verdicts + ts, BaseScan tx, ledger-has-no-PII panel | "And here is the proof. On Base Sepolia, anyone can verify the attestation. The ledger holds a hash and a verdict. It holds no personal data. Verify the person, hide the person." | 40s | F6 |

**Total ≈ 275s.** (6 user flows F1-F6 each demonstrated; S3/S4 both cover separate flows; count = 6 flows ↔ 6 demonstrated.)

**Voice & copy compliance:** no em dashes; no "synergy/leverage/paradigm"; active voice; YouTube title ≤100 chars (`TravelProof — Privacy-Preserving FATF Travel Rule Records on Chainlink CRE` → trim em dash to colon for the actual title field).

---

## Section 7: Risk Register

| # | Risk | Category | Severity | Likelihood | Impact | Mitigation | Decision Tree |
|---|------|----------|:--:|:--:|--------|------------|:--:|
| R1 | Wrong legal authority cited (§1010.410(f) is bank/MSB, not crypto VASP) | Judging | CRITICAL | HIGH | Tanks the 40% legal-credibility score | Cite EU TFR Art.14 + FATF Rec.16 + FinCEN FIN-2019-G001 context; frozen citation registry (C1); "transmittal" never "filing"; non-builder review of every citation | DT-1 |
| R2 | Enclave privacy claim invisible (green checkmark ≠ proof) | Demo | CRITICAL | HIGH | CRE differentiator reads as marketing | Emit on-chain `EnclaveAttestation` + ledger-has-no-PII panel (C10); show the public ledger holds only a hash | DT-2 |
| R3 | OFAC SDN screen mocked / cached | Demo | CRITICAL | HIGH | A known SDN name falsely PASSes = disqualifying | Wire the LIVE feed (C5); startup self-check that the demo HIT address is present in the fresh index (fail loud) | DT-3 |
| R4 | `enclaveHash` / TEE remote-attestation API does not exist in cre-sdk | Technical | HIGH | CONFIRMED | Over-claiming a TEE quote we cannot produce = indefensible | Define `commitmentHash` as our keccak256 over the verified payload, carried in the DON-signed report; attest honestly ("processed via Confidential HTTP; only commitment+verdict on chain"); never claim a remote-attestation quote | DT-4 |
| R5 | CRE pre-1.0 / Confidential HTTP private-beta gated | Technical | HIGH | MEDIUM | Spinner/error on the headline feature | Run the demo in `cre workflow simulate` (local WASM, no invite needed); validate at wire; honest degradation in LIMITATIONS.md | DT-5 |
| R6 | Dual-CRE scope under the window | Time/Scope | HIGH | MEDIUM | All subsystems mocked → demo proves a UI | Thin-but-real per subsystem; DON OFAC first (highest-ROI, fully real); unique jobId per call | DT-6 |
| R7 | IVMS101 output not recognizable as a compliance instrument | Judging | HIGH | MEDIUM | Lawyers don't recognize their workflow | Render with IVMS 101.2023 field names + constraint labels; PDF export the officer signs | DT-7 |
| R8 | VASP registry mocked with no disclosed path | Judging | HIGH | HIGH | One Q&A question collapses the verify value-prop | Label mock + name TRISA testnet directory as the production path, in LIMITATIONS.md + memo footer | DT-8 |
| R9 | Two-VASP handshake missing (one-sided) | Scope | MED | HIGH | FATF-literate judge notes beneficiary never receives the message | Frame honestly: "step 1 of 2; beneficiary receipt via TRISA = production path" | DT-9 |
| R10 | Base Sepolia public RPC flaky / contract not durable in judging window | Technical | MED | MEDIUM | Proof page dead when judged | Fallback RPC; deploy a durable attestation contract; pre-record a backup clip of the live tx | DT-10 |
| R11 | Competitor overlap (ClearRelease screens sanctions) | Competitive | MED | LOW | Differentiation blurs | Lead with the filable record + verify-but-hide paradox + correct citations — the field's gap | DT-11 |
| R12 | Demo HIT address silently delisted before judging | Demo | MED | LOW | DO-NOT-TRANSMIT flip fails | Startup self-check; Garantex (CYBER4, active 2025-08-14) chosen over delisted Tornado Cash; re-verify day-of | DT-3 |

(12 risks across Technical, Competitive, Time, Demo, Judging, Scope — exceeds the 8 minimum and all 6 categories.)

---

## Section 7.4b — USER-FIRST (see USER-ONBOARDING.md)
The real user is a **VASP compliance officer**; the cold-stranger genesis is a **judge** who opens the Proof page with no setup and immediately verifies an attestation. Full model in `USER-ONBOARDING.md`. The DEMO path equals the REAL path — no always-on simulate button standing in for the officer's real flow.

## Section 7.4c — ROUTE ARCHITECTURE (see ROUTE-ARCHITECTURE.md)
Multi-page: `/` (landing, 30-sec legibility + money shot), `/cockpit` (officer app), `/record/[jobId]` (filable record + memo), `/proof/[jobId]` (judge verification). Landing required. Full model in `ROUTE-ARCHITECTURE.md`.

## Section 7.5 — Judge Experience
- **First-visit state:** landing shows a one-line legibility statement + a live sample attestation already on Base Sepolia (seeded), so a judge sees real on-chain proof in <10s without running anything.
- **Seed script (`scripts/seed-demo.ts`):** pre-run one CLEARED transfer and one BLOCKED (Garantex) transfer so two attestations + two rendered records exist on first load. Synthetic identities only.
- **10/30/60-sec tests:** 10s — "privacy-preserving, filable Travel Rule records, attested on-chain" + a live attestation card. 30s — open a rendered record/memo with the cited rule. 60s — open the Proof page and verify the ledger holds no PII.
- **Landing content:** no empty states, no wallet wall; the sample attestation is visible behind everything.
- **Demo-insurance invariant check:** the product's claim is verifiability + privacy, so **fabricated state is forbidden** (TASTE U7). The seeded attestations are *earned* — produced by real CLEARED/BLOCKED runs in advance, not hand-written. The OFAC screen hits the live feed every run.
- **Keys-off-host:** `custodyProduct:false` — TravelProof holds no user signing keys or funds; the attestation is written by the CRE DON via the forwarder, the officer signs a PDF locally. No host-side key risk.

## Section 7.6 — Judge Proof Artifacts
- **Proof route:** `/proof/[jobId]` (C10) + a `submission/proof.md`.
- **Required artifacts:** TravelRuleAttestation address (BaseScan link), the CLEARED + BLOCKED attestation jobIds + tx hashes, the live OFAC `<Publish_Date>` captured at demo time, the IVMS101 record PDFs.
- **Proof generation:** build runs the seed script, captures tx hashes + the BaseScan URLs into `submission/proof.md`.
- **Explorer pattern:** `https://sepolia.basescan.org/address/{addr}` and `/tx/{hash}`.

---

## Section 8: Day-by-Day Build Plan (standard scope, ~1.5 days)

| Day | Primary | Secondary | Deliverable |
|----|---------|-----------|-------------|
| D1 AM | C1 resolver + citation registry + C2 IVMS101 builder/validator (the legal core, fully real) | unit tests | `classify()` + `buildIvms()` green with cited outputs |
| D1 PM | C5 OFAC fetcher/parser against the LIVE feed + C4 DON screen workflow (highest-ROI real integration first) | startup self-check (Garantex present) | live screen: CLEAR on clean addr, HIT on Garantex |
| D2 AM | C7 attestation contract (Foundry) + deploy to Base Sepolia; C3 Confidential-HTTP verify workflow + C6 verify endpoint (mock+path) | `cre workflow simulate` wiring | attestation tx on BaseScan; verify workflow runs in simulator |
| D2 PM | C8 cockpit + C9 record/memo renderer + C10 proof page; seed script | polish, demo rehearsal | end-to-end CLEARED + DO-NOT-TRANSMIT + proof page |
| D3 (buffer/video) | record demo, submit DoraHacks | — | submission packaged by Oct 31 20:00 WAT |

## Section 9: Dependencies & Prerequisites
- **External services:** OFAC SDN feed (no auth), Base Sepolia RPC + a funded deploy key, CRE node/`cre` CLI + `cre login`, (optional) Confidential Workflows private-beta invite, TRISA testnet directory (production path only).
- **Dev tools:** Node + pnpm, Foundry, `@chainlink/cre-sdk` 1.23.0, `cre` CLI, `fast-xml-parser`, `fuzzball`, viem.
- **Accounts/addresses:** Base Sepolia deploy key (funded via faucet); KeystoneForwarder address for Base Sepolia (from CRE docs); TravelRuleAttestation address (recorded at deploy).
- **Manual setup:** `cre login`; fund the deploy key; capture the KeystoneForwarder address; (if used) request Confidential Workflows access.

## Section 10: Concerns Compliance
| Concern | Severity | How the PRD addresses it |
|---------|:--:|---|
| Wrong legal authority cited | **C** | C1 frozen citation registry (EU TFR Art.14 / FATF Rec.16 / FinCEN FIN-2019-G001); R1 + DT-1; non-builder citation review; "transmittal" not "filing" |
| Enclave privacy claim invisible | **C** | On-chain `EnclaveAttestation` (C7) + ledger-has-no-PII panel (C10); R2 + DT-2; the honesty invariant on `commitmentHash` (R4) |
| OFAC SDN screen mocked/cached | **C** | Live feed (C5/A1) with startup self-check; R3 + DT-3; Garantex (active) demo address |
| Dual-CRE not load-bearing | **C** | C3 (Confidential HTTP) + C4 (DON consensus) both load-bearing (delete-smoke in deepIntegration); R6 + DT-6 |
| Dual-CRE scope under window | I | Thin-but-real per subsystem; DON OFAC first; simulate path (R5/R6) |
| IVMS101 not recognizable | I | C2 + C9 render Section-7 field names + PDF (R7) |
| Two-VASP handshake out of scope | A | Framed honestly "step 1 of 2; TRISA production path" (R9) |

All 4 [C] concerns have code-level solutions. PRD is complete.

---

## Appendix A — Citation Registry (frozen; the legal spine)

The resolver (C1) and memo renderer (C9) draw every legal string from this frozen registry. No citation is composed ad-hoc. Verb-correct and authority-correct (see INVARIANTS §4, D-1).

| key | Authority | Exact citation string | What it requires | Threshold | Canonical source |
|-----|-----------|-----------------------|------------------|-----------|------------------|
| `EU_TFR_ORIG` | EU Transfer of Funds Regulation (recast) | "Regulation (EU) 2023/1113, Article 14(1)(a)–(d)" | Originator: name; DLT address + account number; address + official personal document number + customer identification number (or date & place of birth); LEI where it exists | **No de-minimis** for crypto CASP transfers | https://eur-lex.europa.eu/eli/reg/2023/1113/oj/eng |
| `EU_TFR_BENE` | EU TFR | "Regulation (EU) 2023/1113, Article 14(2)(a)–(c)" | Beneficiary: name; DLT address + account number; LEI where it exists | No de-minimis | same |
| `EU_TFR_APPLY` | EU TFR | "Regulation (EU) 2023/1113; applicable from 30 December 2024" | Applies to transfers of crypto-assets between CASPs | — | same |
| `FATF_REC16` | FATF | "FATF Recommendation 16 (Travel Rule); FATF Updated Guidance … VAs and VASPs (Oct 2021) ¶¶177–184" | Originator name + account number + (address OR national ID OR customer ID OR DOB/POB); beneficiary name + account number; transmit immediately and securely | **USD/EUR 1,000** de-minimis | https://www.fatf-gafi.org/content/dam/fatf-gafi/guidance/Updated-Guidance-VA-VASP.pdf |
| `FINCEN_CTX` | FinCEN (US context, NOT crypto-specific) | "31 CFR §1010.410(f) (Travel Rule) / §1010.410(e) (Recordkeeping Rule); FinCEN Guidance FIN-2019-G001 (9 May 2019)" (no decimal subsection — the guidance uses roman-numeral sections; do not invent one) | Transmittal of funds ≥ $3,000 by financial institutions; CVC exchangers are money transmitters reached by the general rule; no crypto-specific FinCEN Travel Rule exists | **$3,000** (transmittals) | https://www.fincen.gov/sites/default/files/2019-05/FinCEN%20Guidance%20CVC%20FINAL%20508.pdf |
| `OFAC_SDN` | OFAC | "OFAC SDN List, identifier field 'Digital Currency Address – XBT/ETH'; OFAC FAQ 562" | A blocked person's wallet is a sanctions identifier; dealing is prohibited | — | https://ofac.treasury.gov/faqs/562 |

**Banned strings (build lint `CITATION_LINT_FAIL`):** presenting `§1010.410(f)` as a crypto-VASP-specific Travel Rule; the verb "file/filing" for a transmittal; any OFAC digital-currency-address *count* attributed to Treasury (no official count exists).

## Appendix B — IVMS 101.2023 field mapping (what the record carries)

Entities UpperCamelCase, elements lowerCamelCase (IVMS 101.2023, Issue 1 FINAL, 4 Jun 2024).

| Record path | Type | Mult. | Notes |
|-------------|------|:--:|-------|
| `Originator.originatorPerson[].naturalPerson.name.nameIdentifier[].primaryIdentifier` | string | 1..1 | family/whole name |
| `…nameIdentifier[].secondaryIdentifier` | string | 0..1 | given name |
| `…nameIdentifier[].naturalPersonNameIdentifierType` | enum | 1..1 | ≥1 must be `LEGL` (constraint **C6**) |
| `…naturalPerson.geographicAddress[]` | Address | 0..n | `addressType` ∈ GEOG/HOME/BIZZ satisfies **C1** |
| `…naturalPerson.nationalIdentification` | NationalIdentification | 0..1 | satisfies **C1** |
| `…naturalPerson.customerIdentification` | Text | 0..1 | **spelling: `customerIdentification`, not `…Number`**; satisfies **C1** |
| `…naturalPerson.dateAndPlaceOfBirth` | DateAndPlaceOfBirth | 0..1 | satisfies **C1** |
| `…naturalPerson.countryOfResidence` | CountryCode | 0..1 | — |
| `…Person.accountNumber[]` | string | 0..n | the on-chain/account identifier |
| `Beneficiary.beneficiaryPerson[]` | Person | 1..n | name + account (Rec.16 / Art.14(2)) |
| `OriginatingVASP.originatingVASP.legalPerson` | LegalPerson | 1..1 | the sending VASP |
| `BeneficiaryVASP.beneficiaryVASP.legalPerson` | LegalPerson | 1..1 | the receiving VASP (verify target) |
| `PayloadMetadata` | — | 0..1 | message id, ts |

**Constraint C1 (OriginatorInformationNaturalPerson):** at least one of {geographicAddress(GEOG/HOME/BIZZ), customerIdentification, nationalIdentification, dateAndPlaceOfBirth}. **C6 (LegalNamePresentNaturalPerson):** at least one nameIdentifierType = `LEGL`. The validator (C2) returns `violations[]` tagged by constraint.

## Appendix C — Attestation contract storage & event layout (C7)

```solidity
// Storage (NO PII-typed field exists — INVARIANTS §1, structural enforcement)
struct Attestation {
  bytes32 commitmentHash;   // keccak256(canonical verified-claims payload)
  uint8   verifyVerdict;    // 0=PASS 1=FAIL 2=DEGRADED
  uint8   screenVerdict;    // 0=CLEAR 1=HIT   2=DEGRADED
  uint64  ts;               // block-stamped
}
mapping(bytes32 jobId => Attestation) private s_attestations;
address private s_forwarderAddress;  // set at deploy (ReceiverTemplate)

event EnclaveAttestation(bytes32 indexed jobId, bytes32 commitmentHash, uint64 ts, uint8 verdict);
```
- `verdict` in the event: `0=CLEARED` (both pass), `1=BLOCKED` (any fail). The granular per-check verdicts live in storage, read by the Proof page.
- `onReport(bytes metadata, bytes report)` guarded to `s_forwarderAddress`; `_processReport` decodes the report payload (abi: `jobId, commitmentHash, verifyVerdict, screenVerdict`) and writes storage + emits.
- **Round-trip:** the demo writes `commitmentHash`, then C10 reads `getAttestation(jobId)` back and the memo footer recomputes the commitment from the committed canonical payload (`scripts/verify-claims.ts`) and asserts equality — write → reconstruct → read-back proven.

## Appendix D — Decision Tree index (full trees in PLAN.md)

| ID | Trigger | Summary of the branch |
|----|---------|-----------------------|
| DT-1 | Citation lint fails | stop → fix citation from registry → re-lint; never ship a banned string |
| DT-2 | Attestation event not emitted / not visible on BaseScan | check forwarder address + report decode → re-deploy consumer → fall back to a direct read of storage in the panel |
| DT-3 | OFAC feed unreachable OR demo HIT address absent | surface `SCREEN_DEGRADED` (loud) → retry with the S3 direct URL → if still down, pause demo; never serve a cached clear |
| DT-4 | Tempted to claim a TEE quote | STOP — attest only the commitment + DON signature; edit copy; re-run overclaim lint |
| DT-5 | Confidential HTTP beta-gated at wire | run `cre workflow simulate` (no invite) → document degradation → proceed |
| DT-6 | A subsystem slipping under the window | keep DON OFAC fully real (P0); thin the verify endpoint to mock+path; never blanket-mock |
| DT-7 | Memo not lawyer-recognizable | add IVMS field labels + constraint names + PDF; show to the skeptical-lawyer persona |
| DT-8 | "Is the registry real?" | answer honestly: mock now, TRISA directory in production (disclosed) |
| DT-9 | "Where does the beneficiary receive it?" | "step 1 of 2; TRISA handshake is the production path" |
| DT-10 | Base RPC flaky / contract gone | switch to fallback RPC; re-deploy; play the backup tx clip |
| DT-11 | Judge conflates with ClearRelease | lead with the filable record + correct citations + verify-but-hide |
| DT-12 | Demo address delisted | re-verify day-of; startup self-check fails loud before the demo |

## Appendix E — Glossary
- **VASP / CASP** — Virtual Asset Service Provider (FATF) / Crypto-Asset Service Provider (EU) — a regulated crypto intermediary (e.g. an exchange).
- **Travel Rule** — FATF Rec.16 obligation to transmit originator/beneficiary identity with a transfer.
- **IVMS 101** — the interVASP Messaging Standard, the canonical data model for Travel Rule messages.
- **Confidential HTTP (CRE)** — a Chainlink CRE capability that performs an HTTP fetch inside a TEE enclave so the response/secrets stay private.
- **DON** — Decentralized Oracle Network; reaches consensus and signs the report.
- **KeystoneForwarder** — the Chainlink-managed contract that validates DON signatures and calls the consumer's `onReport`.
- **commitmentHash** — our keccak256 over the canonical verified-claims payload; the on-chain proof that the enclave processed exactly that data (NOT a TEE remote-attestation quote).
- **SDN** — OFAC's Specially Designated Nationals list; includes Digital Currency Address identifiers.

## Appendix F — Worked example: a CLEARED transfer (end-to-end, synthetic)

**Step 1 — officer input (cockpit C8):**
```json
{
  "amount": "5000", "assetSymbol": "USDC", "fiatValueUsd": 5000,
  "originatorIsCasp": true, "beneficiaryIsCasp": true,
  "originatorChainAddress": "0xA11CE0000000000000000000000000000000A11C",
  "beneficiaryChainAddress": "0xB0B0000000000000000000000000000000000B0B",
  "originator": { "primaryIdentifier": "Adeyemi", "secondaryIdentifier": "Fatima",
    "customerIdentification": "CUST-558201", "countryOfResidence": "NG" },
  "beneficiary": { "primaryIdentifier": "Okafor", "accountNumber": "0xB0B0…0B0B" },
  "originatingVaspLei": "5493001KJTIIGC8Y1R12", "beneficiaryVaspLei": "984500AB12CD34EF5678"
}
```

**Step 2 — resolver (C1) output:**
```json
{
  "applicable": true, "regime": "BOTH",
  "requiredOriginatorFields": ["name","accountNumber","customerIdentification OR geographicAddress OR nationalIdentification OR dateAndPlaceOfBirth"],
  "requiredBeneficiaryFields": ["name","accountNumber"],
  "citation": "Regulation (EU) 2023/1113, Article 14(1)(a)–(d); FATF Recommendation 16",
  "rationale": "A crypto-asset transfer between two CASPs. EU TFR Article 14 applies regardless of value; the USD 5,000 value is also above the FATF USD/EUR 1,000 de-minimis."
}
```

**Step 3 — IVMS101 record (C2), abbreviated to the load-bearing paths:**
```json
{
  "Originator": { "originatorPerson": [ { "naturalPerson": {
    "name": { "nameIdentifier": [ { "primaryIdentifier": "Adeyemi", "secondaryIdentifier": "Fatima", "naturalPersonNameIdentifierType": "LEGL" } ] },
    "customerIdentification": "CUST-558201", "countryOfResidence": "NG" } } ] },
  "Beneficiary": { "beneficiaryPerson": [ { "naturalPerson": {
    "name": { "nameIdentifier": [ { "primaryIdentifier": "Okafor", "naturalPersonNameIdentifierType": "LEGL" } ] } } } ] },
  "OriginatingVASP": { "originatingVASP": { "legalPerson": { "name": {...}, "nationalIdentification": { "nationalIdentifier": "5493001KJTIIGC8Y1R12", "nationalIdentifierType": "LEIX" } } } },
  "BeneficiaryVASP": { "beneficiaryVASP": { "legalPerson": { "nationalIdentification": { "nationalIdentifier": "984500AB12CD34EF5678", "nationalIdentifierType": "LEIX" } } } }
}
```
Validator (C2) → `{ "complete": true, "violations": [] }` (C1 satisfied by `customerIdentification`; C6 satisfied by `LEGL`).

**Step 4 — enclave verify (C3 → C6):** request `{ vaspLei:"984500AB…", originatorHash:"0x…" }` sent in-enclave → response `{ registered:true, originatorMatch:true, vaspName:"Beta Exchange Ltd" }` → only `{ commitmentHash:"0x9f2c…", verifyVerdict:0 }` leaves.

**Step 5 — DON OFAC screen (C4 → C5):** address `0xB0B0…0B0B` + name "Okafor" screened against the fresh SDN index (`Publish_Date 2026-10-28`) → `{ screenVerdict:"CLEAR" }` → DON agrees, signs.

**Step 6 — attestation (C7):** `onReport` writes `s_attestations[jobId] = { commitmentHash:0x9f2c…, verifyVerdict:0, screenVerdict:0, ts:… }`, emits `EnclaveAttestation(jobId, 0x9f2c…, ts, 0)`. BaseScan tx recorded to `submission/proof.md`.

**Step 7 — memo (C9), the filable artifact (excerpt):**
> **TRAVEL RULE TRANSMITTAL RECORD — CLEARED.** Pursuant to Regulation (EU) 2023/1113, Article 14(1)(a)–(d) and FATF Recommendation 16, the originating CASP has assembled and is prepared to transmit the required originator and beneficiary information for a transfer of 5,000 USDC. The counterparty CASP was verified and screened; no OFAC SDN match was found against the list published 2026-10-28. Identity data was processed via Chainlink CRE Confidential HTTP and did not touch the public ledger; the on-chain attestation (jobId `…`, commitment `0x9f2c…`) records only the verdicts and the commitment. Verify: https://sepolia.basescan.org/tx/…

## Appendix G — Worked example: the DO-NOT-TRANSMIT flip (Garantex)

**Input delta:** `beneficiaryChainAddress: "3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1"` (Garantex, XBT).
- Resolver (C1): `applicable:true` (unchanged).
- DON OFAC screen (C4/C5): address exact-match → `{ screenVerdict:"HIT", matchedUid:"<Garantex uid>" }`; DON agrees HIT.
- Attestation (C7): `verifyVerdict` may be PASS but `screenVerdict:1 (HIT)` → event `verdict=1 (BLOCKED)`.
- Cockpit (C8): flips red — **DO NOT TRANSMIT** — with the basis: "Beneficiary address matches an OFAC SDN Digital Currency Address (program CYBER4). Transmitting would violate sanctions."
- Memo (C9): a **block memo** citing `OFAC_SDN` + FAQ 562; the transfer is never assembled for transmission. No PII on-chain; only the HIT verdict + reason code.

## Appendix H — Component failure modes & test checklist (deepens §4)

| Comp | Failure mode | Observable | Fail-closed behavior | Test |
|------|--------------|-----------|----------------------|------|
| C1 | un-encodable transfer shape | resolver can't map to a regime | return `NEEDS_HUMAN_REVIEW`, never guess | unit: odd intents → review, not a verdict |
| C2 | missing required field | validator | `INCOMPLETE` + `violations[C1|C6]` | unit: drop customerIdentification → C1 violation |
| C3 | enclave endpoint timeout | verify | `verifyVerdict=DEGRADED` (loud) | integration: kill C6 → DEGRADED |
| C4 | DON can't agree | screen | `.withDefault` → DEGRADED | sim: divergent node results → no silent clear |
| C5 | feed unreachable / 302 not followed | fetch | throw → `SCREEN_DEGRADED`; no cached list | unit: bad URL → throws, no fallback |
| C5 | demo HIT address missing from index | startup | process exits loud | startup self-check asserts Garantex present |
| C6 | registry down | verify | DEGRADED; mock clearly labeled | integration |
| C7 | caller ≠ forwarder | onReport | revert | unit: non-forwarder call reverts |
| C7 | report decode mismatch | _processReport | revert, no write | unit: malformed report reverts |
| C8/C9 | render before attestation | UI | show "pending attestation", no fake tx | e2e |
| C10 | RPC read fails | proof page | fallback RPC; show raw storage | e2e with primary RPC down |

## Appendix I — API request/response bodies (deepens §5)

**A2 — VASP Registry Verify (`POST {VASP_VERIFY_URL}/verify`, in-enclave only):**
```
Request:  { "vaspLei": "984500AB12CD34EF5678", "originatorHash": "0x4d2f…" }
200 OK:   { "registered": true, "originatorMatch": true, "vaspName": "Beta Exchange Ltd" }
200 (unregistered): { "registered": false, "originatorMatch": false, "vaspName": null }
timeout/5xx (≤10s): enclave returns verifyVerdict=DEGRADED to the workflow
Auth: Authorization: Bearer {{.VASP_VERIFY_KEY}}  (CRE Vault DON secret; never in code)
```

**A1 — OFAC SDN (`GET …/SDN.XML`):** 302 → S3 signed URL (follow). Parse `<sdnList>/<sdnEntry>`; index `<idList>/<id>` where `idType` starts `Digital Currency Address`, and all `<aka>`. Freshness = `<publshInformation>/<Publish_Date>`. No auth. Size >10MB → stream.

**A3 — Base Sepolia read (`eth_call` on C7):** `getAttestation(bytes32 jobId)` → `(bytes32 commitmentHash, uint8 verifyVerdict, uint8 screenVerdict, uint64 ts)`. Public; fallback RPC configured.

**A4 — CRE:** `cre workflow simulate <wf> --broadcast --target base-sepolia` runs the workflow locally and broadcasts the signed report; `cre login` required; `cre account access` needed only for managed-DON deploy.

## Appendix J — Open build-discovered FACTS (not design decisions)
These are the ONLY items legitimately OPEN at forge exit — all are build-time facts, not design choices (INVARIANTS RESOLVED DECISIONS covers every design choice):
- KeystoneForwarder address on Base Sepolia (read from CRE docs/CLI at wire).
- Deployed TravelRuleAttestation address + the two seed-run tx hashes (minted at deploy).
- The live SDN `<Publish_Date>` on demo day (captured at run time).
- Whether Confidential HTTP runs in simulate without the beta invite (empirical at wire; simulate path is the fallback either way).

## Appendix K — Resolver regime decision matrix (the truth table C1 implements)

`classify()` is a pure function of (originatorIsCasp, beneficiaryIsCasp, fiatValueUsd). The decision is statute-encoded, deterministic, and returns the governing citation. No AI.

| # | orig CASP | bene CASP | value (USD) | `applicable` | `regime` | Governing citation (from registry) | Rationale |
|---|:--:|:--:|:--:|:--:|------|-----------------------------------|-----------|
| 1 | yes | yes | any (incl. < 1,000) | **true** | `EU_TFR` | EU 2023/1113 Art.14 | crypto transfer between CASPs — no de-minimis under EU TFR |
| 2 | yes | yes | ≥ 1,000 | **true** | `BOTH` | EU Art.14 + FATF Rec.16 | both regimes bind; FATF threshold also crossed |
| 3 | yes | no (unhosted/self-custody) | ≥ 1,000 | **true** | `FATF_REC16` | FATF Rec.16 (+ EU TFR Art.16 unhosted-wallet obligations — NOT Art.14(5), which covers inability to obtain beneficiary info) | originator CASP still owes required info; counterparty is not a CASP |
| 4 | yes | no | < 1,000 | **true (reduced)** | `FATF_REC16` | FATF Rec.16 reduced-data regime | below de-minimis → names + account/identifier, no verification unless suspicion |
| 5 | no | yes | any | **true (inbound)** | `EU_TFR` | EU Art.14 beneficiary-side | beneficiary CASP obligations; TravelProof covers originator side → flag as inbound, out of our transmit scope |
| 6 | no | no | any | **false** | `NONE` | — | no CASP in the path; the Travel Rule is not engaged (cited explanation, not an error) |
| 7 | unknown | * | * | **NEEDS_HUMAN_REVIEW** | — | — | cannot encode the CASP status → never guess |

The US FinCEN context (`FINCEN_CTX`, $3,000 transmittal threshold) is attached as *supporting* context on US-nexus transfers, never as the crypto-specific authority (INVARIANTS §4).

## Appendix L — Cockpit state machine (C8)

```
          enter intent
  IDLE ───────────────────> CLASSIFYING
                                 │ classify()
              applicable:false   │   applicable:true
        ┌────────────────────────┴───────────────┐
        ▼                                         ▼
   NOT_APPLICABLE (cited)                     ASSEMBLING
                                                 │ build+validate
                                incomplete ◄──────┤──────► complete
                                     │                        │ run dual-CRE
                            INCOMPLETE (violations)         VERIFYING_SCREENING
                                                                │
                      ┌─────────────────────────────────────────┼───────────────────────┐
                      ▼ both pass                    any FAIL/HIT ▼            any DEGRADED ▼
                   CLEARED ──> render record/memo   DO_NOT_TRANSMIT        DEGRADED (loud, retry)
                      │                               (block memo)
                      └──> attestation tx ──> footer link to /proof/[jobId]
```
Transitions are driven by real results; there is no manual "force CLEARED" control (INVARIANTS: demo = real path).

## Appendix M — Demo production notes (per scene)

- **S1 (cockpit entry):** screen = `/cockpit` empty form; type the Appendix-F input live. On-screen banner starts neutral.
- **S2 (applicability):** banner turns green with the exact string "Regulation (EU) 2023/1113, Article 14 applies — no minimum for CASP transfers." Camera holds on the citation for 3s.
- **S3 (enclave verify):** a two-pane panel — left "inside the enclave" shows the PII request; right "what leaves the enclave" shows only `commitmentHash` + `verifyVerdict`. The contrast IS the aha.
- **S4 (OFAC live):** show the fetch hitting `sanctionslistservice.ofac.treas.gov`, surface the live `<Publish_Date>`; verdict CLEAR; DON-agreement indicator.
- **S5 (record/memo):** open `/record/[jobId]`, scroll the IVMS101 field labels, export PDF, click the footer BaseScan link (opens the real tx).
- **S6 (flip):** new transfer, paste the Garantex address; the screen flips red with the cited basis; show the block memo.
- **S7 (proof):** open `/proof/[jobId]` in a fresh tab (judge's cold view); resolve from chain; the ledger-has-no-PII panel enumerates the 4 on-chain fields and shows none is identity data.
- **Fallback clip plan (R5/R10):** if CRE simulate or the RPC is flaky live, cut to a pre-recorded clip of the SAME real run (real tx, real feed) — the logic is never fabricated, only the capture is pre-made; disclosed verbally.

## Appendix N — Scope boundary (mirrors LIMITATIONS.md)
**In scope (real, demoable):** deterministic resolver + citations; IVMS101 record + validator; live OFAC screen via CRE DON; Confidential-HTTP verify (simulate); Base Sepolia attestation + proof page; filable memo + PDF.
**Deliberately out of scope:** two-VASP beneficiary receipt (TRISA production path); managed-DON multi-sig (simulate for the demo); real customer PII (synthetic only); mainnet; a production TRISA directory integration (mock + disclosed path); the RYO-CHAN autonomous-agent bounty (deliberately not pursued — fights the deterministic + human-signs discipline).

## Appendix O — Verification matrix ([C] concern / invariant → proving test)

| Guard | Proving test (observable, not "exists") | Sentinel-fail |
|-------|------------------------------------------|---------------|
| No PII on-chain (INV-1) | read back every C7 storage field for a CLEARED job → all are bytes32/uint; grep contract for string/bytes-PII field → none | any identity string decodable from chain |
| Live OFAC (INV-2, concern-3) | screen run surfaces the live `<Publish_Date>` ≤ a few days old; startup self-check finds Garantex in the fresh index | verdict CLEAR while feed was down |
| Deterministic resolver (INV-3) | grep decision module for LLM/model import → zero; same intent → identical verdict across 100 runs | `applicable` set by a model call |
| Correct citation (INV-4, concern-1) | memo contains a registry citation; lint finds no `1010.410(f)`-as-crypto-authority and no "filing" verb | banned string present |
| Honest attestation (INV-5) | no copy claims a TEE quote/`enclaveHash`; commitment recomputes from committed payload (`verify-claims.ts`) | "verified TEE attestation quote" in copy |
| Dual-CRE load-bearing (concern-4) | delete-smoke: remove Confidential HTTP → PII on public path (illegal); remove DON consensus → single self-asserted call | either deletes without breaking a core feature |

## Appendix P — Inter-component data contracts (the typed message on each arrow)

A zero-context builder wires these exactly. Each row is the payload crossing a component boundary.

| From → To | Payload (shape) | Direction | Notes |
|-----------|-----------------|:--:|-------|
| C8 → C1 | `TransferIntent` | req | from the cockpit form |
| C1 → C8 | `Applicability` | resp | drives the banner |
| C1 → C2 | `Applicability.requiredOriginator/BeneficiaryFields` | — | tells the builder what must be present |
| C8 → C2 | originator/beneficiary/vasp identity fields | req | assembled into IVMS |
| C2 → C8 | `IvmsMessage` + `ValidationResult` | resp | `INCOMPLETE` blocks run |
| C2 → C3 | `{ ivmsSubset(PII), vaspLei }` | req (in-enclave) | PII only crosses into the enclave |
| C3 → C6 | `{ vaspLei, originatorHash }` | req (in-enclave) | via Confidential HTTP |
| C6 → C3 | `{ registered, originatorMatch, vaspName }` | resp (in-enclave) | discarded after verdict derived |
| C3 → C7 | DON report: `abi(jobId, commitmentHash, verifyVerdict)` | report | only non-PII leaves |
| C2 → C4 | `{ beneficiaryChainAddress, beneficiaryName }` | req | the two screened values |
| C4 → C5 | `fetchAndIndexSdn(url)` then `screenAddress/screenName` | — | runs against the live feed |
| C5 → C4 | `SdnIndex` + `{ hit, uid?, score? }` | resp | exact for addr, fuzzy for name |
| C4 → C7 | DON report: `abi(jobId, screenVerdict)` (matchedUid is UI-only, NOT attested) | report | Byzantine-agreed |
| C7 → C9 | `getAttestation(jobId)` tuple + event | read | drives the footer |
| C7 → C10 | `getAttestation(jobId)` tuple + raw storage | read | drives the no-PII panel |
| C2/C7 → C9 | `IvmsMessage` + `Applicability` + attestation tuple | — | renders the record + memo |

**Key decisions, per component (the "why"):**
- **C1:** pure + frozen registry so legal correctness is auditable and reproducible; the truth table (Appendix K) is the whole decision surface.
- **C2:** IVMS101 chosen over a bespoke schema because it is THE recognized standard a lawyer/examiner expects; validation returns constraint-tagged violations so the UI can be specific.
- **C3:** Confidential HTTP (not a normal fetch) because the whole value-prop is that PII is processed without hitting the public path; `encryptOutput:true` keeps even the enclave→workflow hop private.
- **C4:** `consensusIdenticalAggregation` (not median) because a sanctions pass/fail must be exact Byzantine agreement, not a statistical blend.
- **C5:** stream-parse the flat legacy SDN.XML (not the relational advanced model) because the wallet address sits directly in `<idList>/<id>/<idNumber>` — no reference-set join, faster to a working screen.
- **C6:** mock + disclosed TRISA path because a real TRISA directory integration is out of the window, and an *undisclosed* mock is the thing that collapses under one lawyer question.
- **C7:** `ReceiverTemplate` + forwarder guard so only DON-signed reports can write; no PII field exists so the headline invariant is structural.
- **C8/C9/C10:** three separate routes (not one page) so the judge verifies on a cold route without touching the officer app.

## Appendix Q — Test plan (per component; seeds FEATURE-OBSERVABLES)

| Comp | Unit | Integration | E2E / adversarial |
|------|------|-------------|-------------------|
| C1 | truth-table cases 1–7; same-input determinism (100×) | — | adversarial: ambiguous CASP status → `NEEDS_HUMAN_REVIEW` |
| C2 | C1 violation (drop customerIdentification); C6 violation (no LEGL); happy path | C1→C2 required-fields honored | adversarial: injected extra field doesn't bypass validation |
| C3 | commitment derivation is stable | C3→C6 happy + timeout→DEGRADED | adversarial: assert no PII in the emitted report bytes |
| C4 | verdict mapping | C4→C5 CLEAR + HIT | adversarial: divergent node results → no silent CLEAR |
| C5 | parse a fixture SDN snippet; base58 case-sensitivity; aka indexing | fetch live feed; follow 302 | adversarial: startup self-check fails loud if Garantex absent |
| C6 | registered/unregistered/timeout | — | — |
| C7 | non-forwarder revert; malformed report revert; store+emit | C3/C4 report → write | adversarial: attempt a PII write → no such field compiles |
| C8 | state transitions (Appendix L) | full classify→run | e2e CLEARED + DO-NOT-TRANSMIT |
| C9 | citation present; banned strings absent (lint) | render from real attestation | adversarial: skeptical-lawyer persona read |
| C10 | resolve + no-PII panel | read live attestation; RPC fallback | e2e judge cold-open |

## Appendix R — Environment / config reference (preview; full in ARCHITECTURE §N+6 + .env.example)
| Var | Used by | Where to obtain | Required before |
|-----|---------|-----------------|-----------------|
| `BASE_SEPOLIA_RPC_URL` | C7 deploy, C10 read | Alchemy/Infura/`https://sepolia.base.org` | build (deploy) |
| `BASE_SEPOLIA_RPC_FALLBACK` | C10 | second provider | demo |
| `DEPLOYER_PRIVATE_KEY` | C7 deploy | a funded Base Sepolia key (faucet) | build (deploy) |
| `KEYSTONE_FORWARDER_ADDR` | C7 | CRE docs/CLI for Base Sepolia | wire |
| `VASP_VERIFY_URL` | C3/C6 | our deployed verify endpoint | wire |
| `VASP_VERIFY_KEY` | C3 | generated; stored as CRE Vault DON secret | wire |
| `OFAC_SDN_URL` | C5 | fixed: sanctionslistservice.ofac.treas.gov/.../SDN.XML | build |
| `DEMO_HIT_ADDRESS` | C5 self-check, demo | fixed: Garantex `3Lpoy…kh1` | demo |
| `ATTESTATION_ADDRESS` | C9/C10 | recorded at deploy | demo |
| `CRE_WORKFLOW_TARGET` | C3/C4 | `ethereum-testnet-sepolia-base-1` | wire |

---

## Section 11: Competitive Positioning & Field Context

The field is **16 builds / 572 registered** — thin, and crypto-judge-facing (only ~4 are real legal workflows). TravelProof occupies regulatory-filing whitespace: **0 Travel-Rule builds** in the field.

| Build (field) | What it does | Where TravelProof wins |
|---------------|--------------|------------------------|
| ClearRelease | Screens sanctions and releases | It stops at a screen verdict; TravelProof produces a *filable IVMS101 record + cited memo*, and the screen is DON-attested, not a single call |
| LexProof / PREDGE | Notarize / anchor documents on-chain | Anchoring ≠ compliance; TravelProof encodes the *statute* and emits the regulator-recognized instrument |
| Trading-agent cluster (RYO-CHAN bounty) | Autonomous agents | Deliberately not our lane — an autonomous agent fights the deterministic + human-signs legal discipline a lawyer trusts |
| (none) | Travel Rule filing | **Whitespace — 0 builds.** The verify-but-hide paradox + filable record is unoccupied |

**The three differentiators a judge-lawyer feels:**
1. **Correct authorities, verbatim.** Most crypto compliance demos misread §1010.410(f); TravelProof cites EU TFR Art.14 / FATF Rec.16 and uses "transmittal", not "filing".
2. **The document is the product.** The lawyer works in the IVMS101 record + memo; the chain is quiet plumbing (the field's dominant anti-pattern is "we hashed it on-chain" with no human-readable artifact).
3. **Privacy made visible.** The enclave claim is proven by an on-chain attestation that demonstrably holds no PII — not a green checkmark.

**Primitives adapted (warroom primitives-sheet):** F28 (in-circuit compliance — the DON-signed pass/fail IS the record), F30 (Confidential HTTP enclave verify), F11 (append-only attested audit registry), F37 (deterministic resolver, LLM capped to memo-draft only), F08x (the filable document is the interface). Each adapted, not ported unchanged.

## Section 12: Submission & Track Alignment

**Track:** LegalTech & RegTech (bullseye for "make lawyers nod"). **Bounty:** Chainlink CRE ($2K, 2× $1K) — the dual CRE primitive is genuinely load-bearing (delete-smoke proven), which is exactly the "best workflow built with CRE" bar; ~7 builds use CRE but few use Confidential HTTP, the differentiator.

**DoraHacks BUIDL submission requirements (config.json):**
- BUIDL on `https://dorahacks.io/hackathon/legal-hack-2026/buidl` (login when prompted).
- Demo video ≤ 300s, workflow-first (the lawyer's view), MP4/YouTube.
- GitHub repo.
- Deployed contract address + chainId (84532) as credibility signals — the TravelRuleAttestation address + BaseScan links.
- Details body via the agreed proof-first blueprint (no em dashes).

**Submission evidence bundle (produced by build/deploy, packaged by package):**
- `submission/proof.md` — attestation address, CLEARED + BLOCKED jobIds + tx hashes, live `<Publish_Date>` captured at demo, IVMS101 record PDFs.
- Live URLs: landing, cockpit, a sample `/proof/[jobId]`.
- Track → evidence mapping: LegalTech/RegTech (the filable record + citations) and CRE bounty (the dual-primitive workflow + Base Sepolia attestation tx).

**What "done" looks like at the internal cutoff (Oct 31 20:00 WAT):** the two seed attestations live on Base Sepolia; the cockpit runs a real CLEARED and a real DO-NOT-TRANSMIT against the live OFAC feed; the record/memo render + export; the proof page verifies cold; the demo video is recorded; the BUIDL is drafted.

## Section 13: Non-Functional Requirements
- **Legal correctness** is the top NFR — every citation traceable to the frozen registry; a wrong citation is a release-blocker, not a bug.
- **Privacy by construction** — no PII to any public store or on-chain field (structurally enforced).
- **Honesty** — every limitation (mock registry, simulator run, single-node vs managed-DON) disclosed in LIMITATIONS.md + SUBMISSION_STATUS.md + the memo footer; no fabricated demo state.
- **Reproducibility** — any judge can re-verify an attestation from a public RPC read; headline values recompute from committed sources.
- **Resilience in the judging window** — durable attestation contract; fallback RPC; backup demo clip of the real run.
- **Accessibility/clarity** — the cockpit reads as a lawyer's tool (plain-language banners + cited rules), not a developer console.

## Section 14: Build Sequencing & Parallelization

Risk-first ordering — the legal core and the live OFAC screen (the two highest-credibility, fully-real subsystems) come first; the CRE enclave verify (the one gated dependency) is scoped thin-but-real and validated in the simulator.

**Sequential spine (must build in order):**
1. C1 resolver + citation registry → 2. C2 IVMS101 builder/validator (needs C1's required-fields) → 7. C7 attestation contract (the report sink both workflows target) → 3./4. CRE workflows (target C7) → 8./9./10. UI (reads C1/C2/C7).

**Parallel groups (no cross-dependency):**
- Group A (day 1): C1 + C2 (legal core, TS, no network) ‖ C5 OFAC fetcher/parser (independent, against the live feed).
- Group B (day 2): C7 contract (Foundry) ‖ C6 verify endpoint (standalone service).
- Group C (day 2): C8 cockpit ‖ C9 renderer ‖ C10 proof page (all read the already-built C1/C2/C7).

**P1 deliverable after the spine alone:** a CLEARED + a DO-NOT-TRANSMIT run, attested on Base Sepolia, with a rendered memo — provable from C1+C2+C5+C4+C7+minimal UI, before the Confidential-HTTP verify polish lands. This proves the thesis early (THESIS-5).

## Section 15: Wire-Validation Checklist (deferred build-facts to confirm at wire)

These are the only items that must be empirically confirmed at the wire phase (they are build-facts, not open design decisions):
1. `cre login` succeeds; `cre workflow simulate` runs the Confidential-HTTP example locally **without** the private-beta invite (Risk-5 gate). If gated even in simulate → document the degradation and run the verify step as a labeled stand-in while keeping the OFAC screen fully real.
2. KeystoneForwarder address for Base Sepolia obtained from CRE docs/CLI and set in the consumer at deploy.
3. `cre workflow simulate --broadcast --target base-sepolia` delivers a report that lands in C7 (a real tx on BaseScan).
4. Live OFAC feed fetch follows the 302 to S3 and the fresh index contains the Garantex demo address (startup self-check green).
5. Base Sepolia deploy key funded; TravelRuleAttestation deployed; address recorded; two seed attestations minted.
6. The commitment recomputed by `scripts/verify-claims.ts` equals the on-chain `commitmentHash` (round-trip proven).

Each maps to a decision tree (Appendix D) with a fail-closed branch. None of these, if it fails, is resolved by fabricating state — the fallback is always a documented degradation or a loud stop.

## Section 16: Assumptions Ledger (verification tags)

| # | Assumption | Tag | Basis / resolution |
|---|-----------|-----|--------------------|
| AS-1 | OFAC SDN live feed reachable + fresh | [VERIFIED] | probe P1 (HTTP 200, Last-Modified 2026-10-28) |
| AS-2 | Base Sepolia chainId 84532, CRE-supported | [VERIFIED] | probe P2 + docs.chain.link/crec/supported-networks |
| AS-3 | @chainlink/cre-sdk usable (1.23.0) | [VERIFIED] | probe P3 (npm registry) |
| AS-4 | IVMS101 field names + constraints C1/C6 | [VERIFIED] | IVMS 101.2023 spec (research subagent) |
| AS-5 | EU TFR Art.14 / FATF Rec.16 / FinCEN citations verb-correct | [VERIFIED] | EUR-Lex + FATF + FinCEN (research subagent) |
| AS-6 | Garantex demo address on the live SDN list | [VERIFIED] | ofac.treasury.gov/recent-actions/20250814 (re-verify day-of) |
| AS-7 | Confidential HTTP runs in `cre workflow simulate` without the beta invite | [UNVERIFIED] | docs say yes; empirical at wire (Risk-5); simulate path is the fallback regardless |
| AS-8 | KeystoneForwarder address for Base Sepolia obtainable | [UNVERIFIED] | from CRE docs/CLI at wire |
| AS-9 | No CRE `enclaveHash`/TEE-quote API | [VERIFIED — negative] | spike NOT FOUND → design around DON-signed commitment (INV-5) |
| AS-10 | Public Base RPC stable enough for the judging window | [ASSUMED] | mitigate with a fallback RPC + durable deploy (R10) |

Every [UNVERIFIED]/[ASSUMED] item has a decision tree (Appendix D) and a wire-check (Section 15). No assumption is load-bearing without a fallback.

---

## Document Control
- **Thesis:** locked in `warroom/WINNER-BRIEF.md ## Thesis` (Round-0 7.54, USER pick Dami 2026-10-30). This PRD references it; it never restates-with-modification.
- **Downstream:** ARCHITECTURE.md (code, copy-exact), PLAN.md (phased build), INVARIANTS.md (build-agent law), USER-ONBOARDING.md, ROUTE-ARCHITECTURE.md, DECISIONS.md, LIMITATIONS.md.
- **Companion law:** INVARIANTS.md carries the 5 non-negotiables + judge-attack pairs + source-lock; a build that violates any fails the gate.
- **Quality gate:** Phase 1.5 — all 6 arithmetic metrics PASS, independently re-counted (no discrepancy).
- **Key upstream correction folded in:** the `enclaveHash` non-negotiable from the WINNER-BRIEF was corrected to an honest computed `commitmentHash` in the DON-signed report (cre-sdk exposes no TEE-quote API — spike NOT FOUND); logged as ADR D-2 and INVARIANT 5.
