# Submission status — TravelProof
_Last updated: build COMPLETE (phases 0-4 + deploy). [x]=done [~]=real-code, live-run deferred to cre login (wire)._

## Status
- [x] Blueprints: PRD, ARCHITECTURE, PLAN, INVARIANTS, DECISIONS, LIMITATIONS (forge)
- [x] C0 Workspace scaffold + franchise skeleton (build phase-0: pnpm workspace + foundry + Next.js stubs, claims ledger, verify-claims recompute gate, SECURITY, DOMAIN-GUIDE, CI, clean-room)
- [x] C1 resolver + citation registry (core) — 9/9 core tests, deterministic, no-AI lint clean
- [x] C2 IVMS101 builder + validator (core) — C1/C6 constraints + keccak256 commitment round-trip
- [x] C5 OFAC live screen (ofac) — live smoke publishDate 10/28/2026, 1058 addrs, Garantex HIT self-check PASS; fixed 2 false-CLEAR bugs
- [~] C4 DON screen workflow (cre) — real code vs cre-sdk 1.23.0; live simulate DEFERRED (cre login, wire)
- [~] C3 Confidential-HTTP verify workflow (cre) — real code, COMMITMENT_KEYS round-trip; labeled 'beta access pending' (production privacy path, NOT live tonight)
- [x] C6 VASP registry (vasp-registry) — real TRISA directory lookup (fail-closed SYNTHETIC_FALLBACK disclosed via `source`) + synthetic attribute-match; 401 on no-key
- [x] C7 TravelRuleAttestation DEPLOYED to Base Sepolia @ 0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD (tx 0x14328bc1…45d8, block 52676285); 5/5 tests, no-PII struct, real forwarder; compliance COMPLIANT
- [x] C8 cockpit / C9 record+memo / C10 proof / C11 /ledger (web) — 8 routes build+render 200; CLEARED/DO-NOT-TRANSMIT/DEGRADED real (api/run fails closed, never fabricated CLEARED)
- [~] Seed: 2 attestations (CLEARED + BLOCKED) — DEFERRED to cre login (run-cre.sh fail-loud stub); read path (readLedger/getAttestation) LIVE against the real contract, populates with zero code change post-seed
- [ ] Demo video + DoraHacks BUIDL — owned by hackathon-demo @ demo + hackathon-package @ package

## Known limitations / blockers
- CRE runs REAL managed-DON (Dami ruling; ghostfund-v2 reference). C4 OFAC-screen + C7 attestation are real on Base Sepolia. Only C3 Confidential HTTP is gated on the Confidential Workflows private-beta invite — request now; simulate is the C3-only fallback if the invite does not land (honest, disclosed). See CRE-RUN-MODEL.md.
- Managed-DON deploy allowlist: likely already held (ghostfund-v2 did a real CRE deploy); confirm `cre account access` at wire.
- VASP registry is a disclosed mock. Reason: time; TRISA production path named.
- KeystoneForwarder address for Base Sepolia is read at wire. Reason: build-fact, not yet captured.
- Two-VASP beneficiary receipt out of scope. Reason: scope ("step 1 of 2; TRISA").


## Build prerequisites (CP3 resolved — see BUILD-HANDOFF.md)
- [x] RPC: Dami Alchemy key TESTED + in .env (BASE_SEPOLIA_RPC_URL)
- [x] Deployer wallet: Dami dev 0xc211..12A5, Base Sepolia gas ample (~0.0585 ETH, no bridge); key supplied at build
- [x] CRE run-model decided: REAL managed-DON (ghostfund-v2 reference); see CRE-RUN-MODEL.md
- [ ] REQUEST Confidential Workflows private-beta invite (only gated CRE piece — C3)
- [ ] Confirm cre login / cre account access (ghostfund implies granted)
- [ ] KeystoneForwarder addr for Base Sepolia (read at wire)
- [x] critique STAGE-1: ACCEPT (.critique-state.json); 4 MINOR pre-empts folded into LIMITATIONS.md
- [x] url_preverify: all live (.url-preverify.json)

## CHANGE-ORDER-1 build items (depth; 2026-10-31)
- [ ] A — /ledger examiner evidence log (C11) from on-chain events
- [ ] B — resolver legal-nuance demo transfer (unhosted/below-threshold)
- [ ] C — lawyer-grade filable memo (IVMS Section-7 labels + rule + signature + retention + live publishDate)
- [ ] D — real TRISA testnet directory lookup for C6 registration (attribute-match synthetic, disclosed)
- [ ] C3 reframe — labeled "CRE Confidential Workflows — beta access pending"; NOT run live tonight; request the invite at build start

## Phase-0 gate (build C0 — PASSED)
- [x] `pnpm install` green; all package.json present (ARCHITECTURE §1 tree)
- [x] `pnpm verify:claims` runs clean on the empty ledger ("All claims recompute and match on-chain.")
- [x] CLAIMS.md, SECURITY.md, SUBMISSION_STATUS.md, docs/pipeline/claims.json, evidence/ exist
- [x] DOMAIN-GUIDE.md generated; CI (.github/workflows/ci.yml) + clean-room (scripts/clean-room.sh) scaffolded; cre-sdk pinned 1.23.0; `pnpm verify` release-gate declared
