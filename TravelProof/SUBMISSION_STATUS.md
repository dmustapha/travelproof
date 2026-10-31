# Submission status — TravelProof
_Last updated: forge (planning). build keeps this current as features land._

## Status
- [x] Blueprints: PRD, ARCHITECTURE, PLAN, INVARIANTS, DECISIONS, LIMITATIONS (forge)
- [x] C0 Workspace scaffold + franchise skeleton (build phase-0: pnpm workspace + foundry + Next.js stubs, claims ledger, verify-claims recompute gate, SECURITY, DOMAIN-GUIDE, CI, clean-room)
- [ ] C1 resolver + citation registry (core)
- [ ] C2 IVMS101 builder + validator (core)
- [ ] C5 OFAC fetcher/parser + screen against the live feed (ofac)
- [ ] C4 DON-consensus screen workflow (cre)
- [ ] C3 Confidential-HTTP verify workflow (cre)
- [ ] C6 VASP registry verify endpoint (mock + TRISA path)
- [ ] C7 TravelRuleAttestation deployed to Base Sepolia
- [ ] C8 cockpit / C9 record+memo / C10 proof page (web)
- [ ] Seed: CLEARED + BLOCKED attestations on-chain
- [ ] Demo video (≤300s) + DoraHacks BUIDL

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
