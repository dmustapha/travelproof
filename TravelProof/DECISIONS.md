# Architecture Decision Records — TravelProof

## ADR-001: Legal authority cited for crypto VASPs
- Context: A skeptical senior lawyer judges 40% on legal credibility; the field's classic error is citing 31 CFR §1010.410(f) (a bank/MSB "transmittal of funds" rule) as the crypto-VASP Travel Rule.
- Decision: Cite **EU TFR Regulation (EU) 2023/1113 Article 14** + **FATF Recommendation 16** as the governing authorities; FinCEN FIN-2019-G001 as US *context* only. Use "transmittal"/"transmit", never "file/filing".
- Rejected: Leading with §1010.410(f) as the crypto authority — it is bank/MSB-specific and $3,000-thresholded; presenting it as crypto-VASP-specific is the misattribution that tanks credibility.
- Consequence: A frozen citation registry (`packages/core/src/citations.ts`) + a build lint (`CITATION_LINT_FAIL`) banning the wrong strings. Costs a small registry; buys defensible citations.
- Where: `packages/core/src/citations.ts`, `resolver.ts`; PRD Appendix A.

## ADR-002: How enclave privacy is proven on-chain (the enclaveHash correction)
- Context: The WINNER-BRIEF non-negotiable asked for an `EnclaveAttestation(jobId, enclaveHash, ts)`. The spike found **no `enclaveHash` / TEE remote-attestation API** in `@chainlink/cre-sdk` (NOT FOUND).
- Decision: Define `commitmentHash = keccak256(canonical verified-claims payload)` computed in the workflow and carried in the **DON-signed report**; the integrity anchor is the DON ECDSA signature. Prove privacy by a ledger-has-no-PII panel reading the contract storage.
- Rejected: Claiming a hardware TEE remote-attestation quote (we cannot produce one — indefensible); a green-checkmark "verified" badge (not proof).
- Consequence: Honest attestation that survives a "prove the TEE quote" question (INVARIANT 5); a small recompute step in `verify-claims.ts`. This is a precision correction, not a scope change.
- Where: `contracts/src/TravelRuleAttestation.sol`, `packages/cre/src/verify.workflow.ts`, `packages/core/src/commitment.ts`; INVARIANTS §5.

## ADR-003: OFAC screen data source
- Context: A cached/stub sanctions list can silently false-negative (the Tornado Cash delisting proves it).
- Decision: Fetch the **live** SDN.XML each run (follow 302→S3), with a startup self-check that the demo HIT address is present. No cached fallback list exists in the repo.
- Rejected: A bundled SDN snapshot (faster, offline) — it would let a known-sanctioned address falsely PASS, which is disqualifying.
- Consequence: `SCREEN_DEGRADED` on feed failure (never CLEAR); a >10MB stream-parse per run. Buys a genuinely live, defensible screen.
- Where: `packages/ofac/src/sdn.ts`; INVARIANTS §2; ADR cross-ref R3/R12.

## ADR-004: DON aggregation for the screen verdict
- Context: A sanctions pass/fail is binary and safety-critical.
- Decision: `consensusIdenticalAggregation` (Byzantine-exact agreement) with `.withDefault("DEGRADED")`.
- Rejected: `consensusMedianAggregation` — a median of pass/fail is meaningless for a binary sanctions decision.
- Consequence: Honest nodes must identically agree; no-consensus degrades, never clears.
- Where: `packages/cre/src/screen.workflow.ts`.

## ADR-005: CRE run model for the demo
- Context: Confidential Workflows is private-beta invite-only; managed-DON deploy needs `cre account access` allowlisting.
- Decision (UPDATED 2026-10-30, Dami ruling "no simulations"): Run the **REAL managed-DON path** wherever access allows. ghostfund-v2 proves Dami has done a real CRE workflow deploy (so the deploy allowlist is likely already held). C4 DON OFAC screen + C7 attestation run REAL on Base Sepolia. Only C3 Confidential HTTP is gated on the Confidential Workflows private-beta invite — request it now. `cre workflow simulate` is the per-subsystem fallback for C3 ONLY if the invite does not land, with an honest LIMITATIONS note — never a blanket simulate. See CRE-RUN-MODEL.md.
- Rejected: Blocking on the managed-DON deploy allowlist (gated, out of the window); a pre-recorded fabricated clip (violates the no-fabrication invariant).
- Consequence: Resolves the PULSE winner-feasibility DISAGREE — the demo is real, not fabricated; the one honest limitation (single-node vs managed-DON multi-sig) is disclosed in LIMITATIONS.md.
- Where: PRD §15 wire-validation; `scripts/run-cre.sh`; LIMITATIONS.md.

## ADR-006: VASP registry source
- Context: A real TRISA directory integration is out of the ~1.5-day window; an undisclosed mock collapses under one lawyer question.
- Decision: A disclosed mock endpoint (`packages/vasp-registry`) with the **TRISA testnet directory named as the production path**.
- Rejected: A hidden mock presented as real; a full TRISA integration now (no time, and the enclave-call mechanism is the demoable part regardless).
- Consequence: Honesty itself is a credibility signal; the enclave→endpoint call is real while the registry data is synthetic.
- Where: `packages/vasp-registry/src/server.ts`; LIMITATIONS.md; R8.

## ADR-007: Multi-page route architecture
- Context: Two user classes (officer, judge) with different needs; a judge must verify cold.
- Decision: Separate routes — `/` landing, `/cockpit`, `/record/[jobId]`, `/proof/[jobId]`.
- Rejected: A single-page app — a judge would have to touch the officer app to verify; the cold-verification story weakens.
- Consequence: Clean cold-start for the judge; a landing money-shot; more routes to build.
- Where: `apps/web/app/*`; ROUTE-ARCHITECTURE.md.
