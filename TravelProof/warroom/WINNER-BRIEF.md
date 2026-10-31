# WINNER-BRIEF — BLI Legal Tech Hackathon 2
**Idea:** TravelProof | **Track:** LegalTech & RegTech (+ Chainlink CRE $2K bounty) | **Warroom Version:** V1 | **Date:** 2026-10-30

---

## Chosen Idea
TravelProof is a FATF Travel Rule compliance tool for crypto exchanges (VASPs): a compliance officer enters a pending transfer, a deterministic resolver classifies it against the Travel Rule thresholds and assembles the IVMS101 message, Chainlink CRE Confidential HTTP verifies the counterparty VASP + originator **inside an enclave** (PII never touches the public ledger), CRE DON-consensus screens the counterparty against the OFAC SDN list, and a DON-signed attestation is written to Base Sepolia. The deliverable is a **filable Travel Rule record + a one-page officer memo** citing the governing rule, with an on-chain verifiable footer.

## Problem Statement
The Travel Rule forces VASPs to pass verified sender/receiver identity on transfers above a threshold **while simultaneously protecting that PII** — contradictory requirements most exchanges still cannot cleanly meet. One shocking number: **OFAC's SDN list now carries ~19,484 entries including Digital Currency Address entries** (live, verified 2026-10-28), yet no build in the 16-project field produces a privacy-preserving, independently-attested, filable Travel Rule record.

## Why It Won
| Criterion | Weight | Round-0 Score | Rationale |
|-----------|:------:|:-----:|-----------|
| Legal-workflow credibility | 40% | 7.0 | Real VASP obligation; filable IVMS101 record + cited officer memo (not a hashed verdict) |
| Technical execution | 25% | 7.4 | Dual CRE primitive genuinely load-bearing; Base Sepolia attestation demoable |
| Innovation / fit | 20% | 7.6 | Regulatory-filing whitespace (0 Travel-Rule builds); verify-but-hide paradox |
| Presentation / polish | 15% | 7.6 | Strongest demo (CLEARED→DO-NOT-TRANSMIT flip); best CRE-bounty fit |
Round-0 criteria-weighted total: **7.54** (rank 1 of 6)

## Key Deliberation Arguments (Why This Won)
1. JUROR (8.25): "the paradox — verify the person, hide the person — is a genuine aha," and the DO-NOT-TRANSMIT failure flip saves the enclave demo from being an invisible claim.
2. BUILDER: both CRE primitives "genuinely do work" — the most load-bearing CRE integration of the pool → strongest fit for the $2K Chainlink bounty.
3. SCOUT (7.50): "cleanest regulatory-filing whitespace play — a real, specified standard (IVMS101) with a real filable artifact," not vibes.

## Whitespace Occupied
Regulatory-reporting automation (Travel Rule filing) — **0 builds in the 16-project field**. The field screens sanctions (ClearRelease) and notarizes (LexProof/PREDGE) but none produces a privacy-preserving, independently-attested, filable Travel Rule record citing the governing framework.
**Event Class:** sponsor_track (inferred). **Selection Path:** scored_pool (rank-1 aggregate; USER-confirmed pick, Dami 2026-10-30).

## Thesis
WINNING ARGUMENT: TravelProof is the only build that resolves the Travel Rule's core contradiction — prove identity yet protect PII — with an independently-attested, lawyer-filable record, which is exactly the legal-credibility + load-bearing-CRE combination the field misses.
EVIDENCE:
1. Regulatory-filing whitespace: 0 Travel-Rule builds in the 16-project field (gap-map).
2. Dual CRE primitive is load-bearing (delete-smoke: remove Confidential HTTP → PII exposed → illegal; remove DON consensus → self-asserted → regulator rejects).
3. All 5 load-bearing facts live-VERIFIED by a distinct model (CRE Confidential HTTP, @chainlink/cre-sdk, IVMS101, OFAC SDN w/ crypto addresses, Base Sepolia support).
DEMO OBLIGATION: the judge must witness a transfer where PII is verified but the public ledger shows only a hash (enclave privacy made visible), AND a second transfer flip to "DO NOT TRANSMIT" on an unregistered/sanctioned counterparty.
HERO FLOW: officer enters a transfer → Rec.16/TFR classification → in-enclave verification + DON OFAC screen → filable IVMS101 record + cited memo with on-chain verifiable footer.
INVARIANTS:
- Demo state is never fabricated — the OFAC screen hits the LIVE SDN feed, not a cached stub.
- PII never touches the public ledger — only the derived verdict + hash are written on-chain.
- The deterministic resolver decides applicability; AI (if any) never decides a legal outcome.
- The output is a lawyer-filable document citing the CORRECT binding rule — never a bare hash.
DRIFT TRIPWIRES:
- if "we hashed an AI verdict on-chain" becomes the headline instead of "a privacy-preserving filable Travel Rule record," that is drift.
- if the chain becomes the product instead of the quiet trust layer behind the document, that is drift.

## Top Risks + Mitigations
| # | Risk | Severity | Mitigation |
|---|------|:--------:|------------|
| 1 | Wrong legal authority cited (§1010.410(f) is bank/MSB, not crypto VASP) | CRITICAL | Cite EU TFR Art.14 + FinCEN 2022 ANPRM / 31 CFR §1010.100(uu) context; non-builder reviews every citation; "transmittal" not "filing" |
| 2 | Enclave privacy claim invisible (green checkmark ≠ proof) | CRITICAL | Emit on-chain EnclaveAttestation(jobId, enclaveHash, ts) event + verifiable footer link; show the public ledger has no PII |
| 3 | OFAC SDN / registry mocked (undefendable self-certification) | HIGH | Wire OFAC SDN to the LIVE treasury sdn.xml feed (highest-ROI real integration); VASP registry = TRISA testnet sandbox or label mock + production path |
| 4 | Dual-CRE scope in ~1.5 days | HIGH | Thin-but-real slice of each; prioritize DON OFAC screen first, scope Confidential HTTP to VASP verify; prerecord a fallback clip |
| 5 | CRE pre-1.0 / Confidential HTTP job-spec docs incomplete | MED | Validate CRE node access + Confidential HTTP job spec at wire; fallback to a documented-degradation path if the capability is gated |

## Non-Negotiables (Must Be In Build)
- The output is a human-readable, lawyer-FILABLE IVMS101 record + memo citing the CORRECT binding rule (EU TFR / FinCEN context, not §1010.410(f) for crypto).
- The OFAC sanctions screen hits the LIVE SDN feed in the demo (no cached stub).
- Enclave privacy is VISIBLY proven (on-chain attestation event + a ledger-has-no-PII panel).
- Both CRE primitives (Confidential HTTP + DON consensus) are load-bearing and demoed on Base Sepolia (84532) with a real deployed attestation contract.

## Explicit Out-of-Scope
- The two-VASP handshake (beneficiary-VASP receipt) — framed honestly as "step 1 of 2; production path via TRISA."
- The RYO-CHAN autonomous-agent bounty — deliberately NOT pursued (an autonomous agent fights the deterministic + human-signs legal discipline).
- No AI on the legal-decision critical path (drafting assist only, if at all).
- Mainnet / real customer PII — testnet + synthetic identities only.

## Minority Dissent (Unresolved Concerns)
BUILDER maintains TrustRecon was the safer ship for a ~1.5-day window and the highest-floor pick; its unresolved weakness in TravelProof is the 4-subsystem scope under time pressure — mitigated by the thin-but-real per-subsystem build discipline above. COUNSEL's citation-precision critique is resolved by making the correct-authority citation a build non-negotiable (risk #1).

## Risk Register
| # | Risk | Severity | Likelihood | Impact | Mitigation |
|---|------|:--------:|:----------:|--------|------------|
| 1 | Wrong legal authority cited (§1010.410(f) is bank/MSB, not crypto VASP) | CRITICAL | HIGH | Tanks the 40% legal-credibility score | Cite EU TFR Art.14 + FinCEN 2022 ANPRM/§1010.100(uu); non-builder reviews citations; "transmittal" not "filing" |
| 2 | Enclave privacy claim invisible (green checkmark ≠ proof) | CRITICAL | HIGH | CRE differentiator reads as marketing | Emit on-chain EnclaveAttestation(jobId,enclaveHash,ts) + verifiable footer; show ledger has no PII |
| 3 | OFAC SDN screen not live (cached/stub) | HIGH | HIGH | A known SDN name falsely PASSes = disqualifying | Wire LIVE treasury sdn.xml feed (highest-ROI integration) |
| 4 | VASP registry mocked with no disclosed mock | HIGH | HIGH | One Q&A question collapses the verify value-prop | TRISA testnet sandbox or label mock + production path |
| 5 | Dual-CRE scope in ~1.5 days → all mocked | HIGH | MEDIUM | Demo proves a UI, not a system | Thin-but-real per subsystem; DON OFAC first; unique job-id per call |
| 6 | IVMS101 output not recognizable as a compliance instrument | HIGH | MEDIUM | Lawyers don't recognize their workflow | Render structured memo with IVMS101 Section-7 field names; PDF export |
| 7 | CRE pre-1.0 / Confidential HTTP job-spec incomplete or gated | MED | MEDIUM | Spinner/error on the headline feature | Validate CRE node access at wire; documented-degradation fallback + prerecorded clip |
| 8 | Two-VASP handshake missing (one-sided form) | MED | HIGH | FATF-literate judge notes the beneficiary-VASP never receives the message | Frame honestly: "step 1 of 2; beneficiary receipt via TRISA = production path" |
| 9 | Free-tier/ephemeral deploy sleeps in judging window (dl-1) | MED | MEDIUM | Live demo link dead when judged | Durable provisioning sized to the judging window (gated deploy decision) |


---
## Forge Reconciliation (2026-10-30 → 31, authoritative over the warroom risk mitigations above)
Forge's technical spike + Dami's CP3 rulings corrected three warroom assumptions. Where this section conflicts with a mitigation phrased above, THIS wins (the warroom text is preserved for history):

1. **`enclaveHash` → `commitmentHash` (Risk #2 mitigation).** `@chainlink/cre-sdk` exposes NO `enclaveHash` / TEE remote-attestation API (spike NOT FOUND). The on-chain event is `EnclaveAttestation(jobId, commitmentHash, ts, verdict)` where `commitmentHash = keccak256(canonical verified-claims payload)` carried in the DON-signed report. We prove privacy by the DON signature + a ledger-has-no-PII panel — NEVER a claimed TEE quote. (ADR-002, INVARIANT 5.)

2. **CRE runs REAL, not simulate / prerecord (Risks #4, #7).** Dami ruling "no simulations." C4 DON OFAC screen + C7 attestation run REAL managed-DON on Base Sepolia (ghostfund-v2 proves the deploy path + likely-held allowlist). C3 Confidential HTTP is the only gated piece → request the Confidential Workflows private-beta invite. The "prerecord a fallback clip" line is NOT the plan — a prerecorded clip of real state is a last-resort capture aid only, never fabricated state. (CRE-RUN-MODEL.md, ADR-005.)

3. **Demo DO-NOT-TRANSMIT address locked:** Garantex `3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1` (XBT, CYBER4, active 2025-08-14). Tornado Cash is delisted (2025-03-21) and would false-negative — do NOT use it. Startup self-check fails loud if the address is absent from the fresh live feed.

Thesis is UNCHANGED (these are implementation corrections, not identity changes): the Thesis field-5 invariant "PII never touches the public ledger" holds exactly; only the mechanism name was corrected.

## Thesis AMENDMENTS (forge, 2026-10-31 — latest-wins per field)
AMEND-1 | 2026-10-31 | source: [USER] directive | field 3 DEMO OBLIGATION | old: "judge witnesses PII verified in-enclave but only a hash on-chain" -> new: "judge witnesses (a) a LIVE OFAC-DON-attested, filable Travel Rule record on Base Sepolia holding only a commitment + verdict (no PII, proven by the ledger-has-no-PII panel) and (b) the DO-NOT-TRANSMIT flip on the live Garantex SDN hit; the in-enclave Confidential-HTTP verify is the production privacy path, code shipped, beta access pending" | why: Confidential Workflows beta is Chainlink-granted (ETA > deadline); the privacy+filable+attested thesis is fully provable tonight without simulating/fabricating the enclave run.
AMEND-2 | 2026-10-31 | source: [USER] directive | field 4 HERO FLOW | add: officer also sees a cited audit-trail/evidence log (/ledger) of prior attestations + the resolver's legal nuance (unhosted/below-threshold) is exercised | why: depth — a workflow a firm adopts, not a single atomic record.
Field-5 INVARIANTS UNCHANGED (no PII on-chain; live OFAC; deterministic resolver; filable record citing the correct rule).
