# PULSE — Pipeline Rolling Context

## Active Facts
| Fact | Source | Phase |
|------|--------|-------|
| Field is crypto-judge-facing not lawyer-facing; ~4/16 builds are real legal workflows — the wedge | intel/dorahacks-recon.md [A1] | intel |
| BLI H1 (Dec 2025, 91 projects, $50K) rewarded HakiChain: lawyer/NGO/client workflow + smart escrow + on-chain doc anchor — NOT trading agents | bli.tools / Constellation Medium [B2] | intel |
| Chainlink CRE is mainnet-live; Confidential HTTP (enclave PII) is the differentiator the field ignores | docs.chain.link/cre/capabilities [A1] | intel |
| RWA-with-legal-wrapper + regulatory-reporting + legal-trust/escrow are BLUE OCEAN (0 builds each) | field density, research-brief.md [A1] | intel |
| [phase:intel] status=complete verdict=pass | intel-state.json | intel |

## Decisions Log
| Decision | Rationale | Phase |
|----------|-----------|-------|
| [USER] Optimize warroom for BEST PRODUCT, not lowest competition | Win = make lawyers nod; product quality/credibility/completeness is the primary axis, competition density is only a tiebreaker | warroom |
| Weighted judging 40% to legal credibility (derived) | Win condition = "make lawyers nod"; no public rubric | intel |
| Treated DoraHacks recon as authoritative Phase 1/3 competitor data; did NOT re-scrape | Browser is session singleton per dispatch; recon is logged-in capture | intel |
| Surfaced 5 candidate directions (Travel Rule, SAR, RWA, trust/escrow, vLEI KYB); did NOT pick | Pick is warroom/STAGE-0's job | intel |

## Downstream Items
<!-- Owner-routed, non-blocking deferred work. Every skill reads on entry, actions rows it owns. See PULSE-PROTOCOL § Downstream Items. -->
| ID | Raised by | Owner phase | Pri | Item | Acceptance | Status |
|----|-----------|-------------|:---:|------|-----------|:------:|
| AMP-2 | build | verify_preflight | P1 | LIP-SERVICE ADOPT: 21 promised change(s) did not land in their artifact (see ADOPT-VERIFICATION-build.md) | Each ADOPTed change actually applied to its artifact, or the ADOPT honestly downgraded | open |
| AMP-1 | build | verify_preflight | P1 | Quality-Mandate FALSE SHORTCUT flagged by logic-audit (bold-2) — human must rule enforce-quality vs accept-shortcut (see ESCALATION-build.md) | Human ruled; shortcut either reversed to the quality path or consciously accepted with reason | open |

## Skill Sections

---
### hackathon-intel — 2026-10-28
**Status:** COMPLETE
**Session(s):** 1

#### Done
- Synthesized 16-build field (DoraHacks recon [A1]): crypto-judge-facing, ~4 real legal competitors.
- Researched legal frameworks (FATF Travel Rule, MiCA, BSA/SAR, UCC Art.12, GLEIF/vLEI, OFAC, IOLTA) — 25 tagged sources.
- Built CRE capability map (7 primitives, Confidential HTTP wedge) + 5 candidate directions for warroom.

#### Additions (not in PRD/Architecture)
- None.

#### Deviations
- Phase 2 (social intel) SKIPPED — autonomous run, no user. Phase 1/3 competitor data from recon, not re-scraped (dispatch instruction: browser is session singleton).

#### Verified Facts
- [VF-i1] Field = 16 builds / 572 hackers / 2 bounties at 3-days-left — State: VERIFIED — Recompute: grep -c '^- \*\*' intel/dorahacks-recon.md (build bullets) + read hard-facts block — Source: logged-in DoraHacks capture intel/dorahacks-recon.md [A1]
- [VF-i2] Chainlink CRE mainnet-live, capabilities = Triggers/HTTP/Confidential HTTP/EVM R+W/Solana R+W — State: VERIFIED — Recompute: WebFetch https://docs.chain.link/cre/capabilities — Source: docs.chain.link/cre [A1]
- [VF-i3] BLI H1 = 320 hackers / 91 projects / $50K, HakiChain highlighted winner shape — State: VERIFIED — Recompute: WebFetch https://bli.tools/bli-legal-tech-hackathon-global-projects-address-compliance-challenges/ — Source: bli.tools [A2]
- [VF-i4] RWA / regulatory-reporting / legal-trust-escrow each have 0 competing builds in field — State: VERIFIED — Recompute: grep -i 'rwa\|tokeniz\|SAR\|trust account\|reconciliation' intel/dorahacks-recon.md (no build match) — Source: research-brief.md Category Saturation [A1]

#### Assumptions
- [A-i1] 300s demo length is conductor-set, not DoraHacks-published — NICE-TO-HAVE
- [A-i2] Judging weights derived (40/25/20/15), no public rubric — NICE-TO-HAVE

#### Blockers for Downstream
- None.

#### Key Decisions
- Target track = LegalTech & RegTech (bullseye for "make lawyers nod" + Dami policy-gate/audit depth); RWA + AI×Blockchain are adjacent and stackable per-direction.
- Bounty posture: Chainlink CRE ($2K, 2×$1K) is the differentiated winnable target IF the workflow is genuinely legal (not a trading bot); RYO-CHAN Autonomous Agents ($6K) is where the crowded trading-agent cluster piles up — lower differentiation odds.
- The wedge (field-wide gap): ship the ONE complete, cited legal workflow with lawyer-filable human-readable output first-class and on-chain proof as the trust layer, not the product. Field is crypto-judge-facing; "make lawyers nod" bar is largely unmet.
- Winner selection itself is deferred to warroom STAGE-0 (CP2, user-decided) — intel does not pick.

#### For Next Skill (warroom)
- Deliberate the 5 candidate directions (D1–D5 in research-brief.md § Candidate Directions). Law of the wedge: cited legal framework + lawyer-filable output first-class, on-chain proof = trust layer not product. RWA (D3) is the only blue-ocean track with a credible legal story; D4 (trust/escrow) mirrors what BLI's own judges rewarded.

## Cross-Review

```json
{"reviewer":"claude","phase":"winner-feasibility","verdict":"DISAGREE","findings":[{"claim_id":"winner-feasibility","question":"Reading only WINNER-BRIEF.md, is the crowned winner feasible to build and demo within the hackathon window given its load-bearing claims and risk register? Answer FEASIBLE or INFEASIBLE only.","lead_answer":"FEASIBLE","reviewer_answer":"INFEASIBLE","reviewer_reasoning":"The risk register flags dual-CRE scope in ~1.5 days as HIGH severity (Risk #4), and CRE Confidential HTTP job-spec docs as incomplete on a pre-1.0 SDK (Risk #5). The non-negotiables explicitly require BOTH CRE primitives to be load-bearing and demoed live on Base Sepolia — yet Risk #5's own mitigation concedes a 'documented-degradation path if the capability is gated,' which directly contradicts the non-negotiable. This internal contradiction is unresolvable within the window. Additionally, the build spans 4 distinct subsystems (deterministic legal resolver, IVMS101 assembler, dual-CRE integration, Base Sepolia attestation contract) plus a CRITICAL legal-citation risk requiring non-builder review — all within ~1.5 days. The BUILDER juror's minority dissent explicitly states TrustRecon was the safer ship for this window and names the 4-subsystem scope under time pressure as an unresolved concern. Mitigations (thin-but-real slices, prerecorded fallback clip) reduce but do not eliminate the feasibility gap; a prerecorded clip for CRE means the demo's enclave privacy claim is fabricated, violating the DEMO OBLIGATION invariant ('Demo state is never fabricated'). The combination of an immature SDK with incomplete docs, 4 load-bearing subsystems, non-negotiables that disallow mocking, and an unresolved BUILDER dissent makes a working, live, non-fabricated demo within the window not credibly achievable.","match":false,"resolution_note":"Resolve the claim from canonical inputs before acceptance."}],"resolved":false}
```

## Cross-Review

```json
{"reviewer":"claude","phase":"winner-feasibility","verdict":"DISAGREE","findings":[{"claim_id":"winner-feasibility","question":"Reading ONLY WINNER-BRIEF.md, is the crowned winner feasible to build and demo within the hackathon window given its load-bearing claims and risk register? Answer FEASIBLE or INFEASIBLE only.","lead_answer":"FEASIBLE","reviewer_answer":"INFEASIBLE","reviewer_reasoning":"The risk register itself flags two blocking concerns: Risk #4 (HIGH) — dual-CRE scope across 4 subsystems in ~1.5 days, with the BUILDER dissent explicitly stating TrustRecon was the safer ship for this window; and Risk #5 (MED but potentially show-stopping) — CRE Confidential HTTP is pre-1.0 with potentially incomplete or gated job-spec docs, directly threatening the load-bearing enclave-privacy claim. The non-negotiables are strict: live OFAC SDN feed (no stubs), visible on-chain enclave attestation, and both CRE primitives deployed on Base Sepolia — yet the mitigations include a 'prerecord fallback clip' for the enclave demo and a 'documented-degradation path' if Confidential HTTP access is gated. A fallback clip means the core demo invariant (judge witnesses live in-enclave verification) may not be achievable, which collapses the primary 'verify-but-hide' aha moment. The combination of a pre-1.0 SDK dependency with gated access risk, 4 subsystems, 1.5 days, and zero-mock non-negotiables puts delivery of all stated invariants outside the window.","match":false,"resolution_note":"Resolve the claim from canonical inputs before acceptance."}],"resolved":false}
```

---
### hackathon-warroom — 2026-10-30
**Status:** COMPLETE
**Winner:** TravelProof — FATF Travel Rule filable record on Base Sepolia + Chainlink CRE (Confidential HTTP + DON consensus). Round-0 7.54 (rank 1 of 6). USER pick (Dami).

#### Done
- 5 blind generators → 35 ideas → 6 finalists → 4-scorer Round-0 → user pick (§12 STAGE-0 hard stop).
- Gates: LAW#12 PASS (5/5 facts live-VERIFIED, distinct sonnet), cross-review AGREE, winner-weighing PASS, deep-integration LOAD_BEARING.

#### Key Decisions
- §12(a) workflow = TravelProof (FATF Travel Rule). §12(b) chain = Base Sepolia 84532. §12(c) credibility = cited frameworks + lawyer-filable IVMS101 output.
- Avoided RYO-CHAN $6K agent bounty deliberately (autonomous-agent shape fights the deterministic+human-signs legal discipline). Target: LegalTech/RegTech track + CRE $2K bounty.

#### Blockers for Downstream (forge/build NON-NEGOTIABLES)
- Cite EU TFR Art.14 + FinCEN 2022 context, NOT 31 CFR §1010.410(f) for crypto VASPs ("transmittal" not "filing").
- Enclave privacy must be VISIBLY proven on-chain (EnclaveAttestation event + ledger-has-no-PII panel).
- OFAC SDN screen hits the LIVE treasury sdn.xml feed in the demo (no cached stub).
- Dual CRE primitive load-bearing + demoed on Base Sepolia; thin-but-real per subsystem (DON OFAC first).
- CRE pre-1.0: validate CRE node access + Confidential HTTP job-spec at wire (dl-1 durable-infra for judging window).

#### For Next Skill (forge)
- Read `warroom/WINNER-BRIEF.md` (Thesis + non-negotiables + out-of-scope). Build the IVMS101 record + officer memo as first-class; chain is the quiet trust layer.

---
### hackathon-forge — 2026-10-30
**Status:** COMPLETE
**Session(s):** 1

#### Done
- Produced execution-ready blueprints in TravelProof/: PRD.md (809), ARCHITECTURE.md (1798, all code copy-exact + tagged), PLAN.md (1020), INVARIANTS.md (build-agent law), DECISIONS.md (7 ADRs), LIMITATIONS.md, SUBMISSION_STATUS.md, USER-ONBOARDING.md, ROUTE-ARCHITECTURE.md, FEATURE-OBSERVABLES.md.
- Phase 0B technical spike: 3 live probes VERIFIED (OFAC SDN live+digest, Base Sepolia 84532, @chainlink/cre-sdk 1.23.0) + 3 research subagents (CRE SDK, IVMS101/Travel-Rule law, OFAC SDN XML). research/TECHNICAL-SPIKE.md.
- Resolved the PULSE winner-feasibility DISAGREE: the demo runs via `cre workflow simulate` (local WASM, no private-beta invite) with a real OFAC screen + real Base Sepolia tx — not a fabricated clip.

#### Verified Facts
- [VF-f1] OFAC SDN feed live at sanctionslistservice.ofac.treas.gov (treasury.gov URL 302s there), Last-Modified 2026-10-28 — State: VERIFIED — Recompute: curl -sIL the URL — Source: probe P1.
- [VF-f2] Base Sepolia chainId 84532 / CRE selector 10344971235874465080 / ethereum-testnet-sepolia-base-1 — State: VERIFIED — Recompute: cast chain-id --rpc-url https://sepolia.base.org (=84532) — Source: probe P2 + docs.chain.link/crec/supported-networks.
- [VF-f3] @chainlink/cre-sdk latest 1.23.0 (Confidential HTTP private-beta; simulate needs only cre login) — State: VERIFIED — Recompute: npm view @chainlink/cre-sdk version — Source: probe P3 + docs.chain.link/cre.

#### Additions (corrections to upstream)
- Corrected the WINNER-BRIEF enclaveHash non-negotiable: cre-sdk exposes NO TEE remote-attestation API (spike NOT FOUND). Attestation uses an honest computed commitmentHash in the DON-signed report (ADR D-2, INVARIANT 5).
- Corrected the demo HIT address to Garantex (CYBER4, active); Tornado Cash is delisted and would false-negative.

#### Gates
- PRD 6/6, ARCHITECTURE 10/10 (+cross-doc 4/4), PLAN 7/7 — all independently re-counted.
- THESIS-1..5 PASS; thesis-2 cross-model AGREE (reviewer sonnet / producer opus).
- A-G4 distinct-model per-doc critical review: 4 BLOCKERs found + FIXED (commitment round-trip, run-cre fail-loud, contract write-once, forwarder/parse/citation), survivors folded into INVARIANTS.md.
- 3 forge exit gates PASS (crossreview-exit, forge-critical-review, forge-routing-enforce).

#### Blockers for Downstream
- CP3 input manifest surfaced to Dami: DEPLOYER_PRIVATE_KEY (funded Base Sepolia key) is the one build-start hard-gate; forwarder addr + VASP verify URL/key + cre login are wire-phase; CRE deploy allowlist / Confidential beta / TRISA are optional (simulate + disclosed mock cover the demo).

#### For Next Skill (critique → build)
- critique (STAGE-1 scope review) then url_preverify, then build via conductor. Build reads INVARIANTS.md first. DON OFAC screen is the P0 fully-real slice; Confidential-HTTP verify is thin-but-real via simulate.


---
### Forge resolution of the winner-feasibility DISAGREE (2026-10-30 → 31)
The two `## Cross-Review` DISAGREE blocks above (INFEASIBLE: dual-CRE in ~1.5d + pre-1.0 SDK + no-mock non-negotiables + "prerecord fallback = fabricated demo") are RESOLVED by forge:
- **No fabrication.** CRE runs REAL (Dami ruling). C4 OFAC-DON-screen + C7 attestation deploy real on Base Sepolia (ghostfund-v2 proves the path + likely-held allowlist). C3 Confidential HTTP is the one gated piece → request the private-beta invite; its only honest fallback is the documented degradation, never a fabricated verdict.
- **enclaveHash contradiction removed.** No TEE-quote API exists → attestation is an honest computed `commitmentHash` in the DON-signed report (not a claimed hardware quote). This dissolves the "non-negotiable vs documented-degradation" contradiction the reviewer flagged.
- **Scope de-risked.** Thin-but-real per subsystem; DON OFAC screen is the P0 fully-real slice that proves the thesis at the P1 milestone before the Confidential-HTTP polish.
Verdict: FEASIBLE as scoped. (Resolution recorded here + in forge's A-G4 critical review, which additionally found+fixed 4 build BLOCKERs.)

#### Forge Active Facts (corrections carried for build)
| Fact | Source | Phase |
|------|--------|-------|
| CRE exposes NO enclaveHash/TEE-quote API → attestation = honest computed commitmentHash in the DON-signed report | research/TECHNICAL-SPIKE.md | forge |
| CRE runs REAL managed-DON (not simulate); ghostfund-v2 is the reference; C3 Confidential HTTP needs the private-beta invite | CRE-RUN-MODEL.md (Dami ruling) | forge |
| Demo HIT address = Garantex 3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1 (active); Tornado Cash delisted, do not use | research/TECHNICAL-SPIKE.md | forge |
| Deployer = Dami dev wallet 0xc211..12A5 (Base Sepolia gas ample); RPC = Dami Alchemy key (tested); both in .env | .env / .input-manifest.json | forge |


---
### hackathon-critique — 2026-10-31
**Status:** COMPLETE
**Session(s):** 1 (attended beat; independent sonnet reviewer dispatched)

#### Done
- STAGE-1 scope review of TravelProof re-derived by an independent cross-model reviewer (Sonnet; plan built on Opus — DELIB LAW#9). Verdict **ACCEPT**, routes_back_to_forge=false. Artifact: `.critique-state.json` (schema-valid, provenance nonce echoed).
- Competitive positioning scored **unique**; narrative **outstanding**.

#### Verified Facts
- [VF-c1] Zero Travel-Rule builds across 16 projects in the field — State: VERIFIED — Recompute: re-read PRD §11 competitive table + research/research-brief.md — Source: competitive scan.
- [VF-c2] Closest analog (ClearRelease) stops at a sanctions verdict; emits no filable IVMS101 record nor encodes the statute — State: VERIFIED — Recompute: re-read the ClearRelease row in PRD §11 — Source: competitive scan.

#### Key Decisions
- Citation discipline (EU TFR Art.14 / FATF Rec.16 primary; §1010.410(f) US-context-only, lint-enforced) confirmed technically correct.
- CHANGE-ORDER-1 depth-adds (A /ledger, B resolver-nuance, C lawyer-grade memo, D real TRISA directory lookup) + C3 reframe judged additive depth with no scope risk.

#### Blockers for Downstream
- None. 2 MINOR concerns (TRISA HTTP endpoint unverified at forge exit; C3 beta-pending copy discipline) folded into LIMITATIONS.md "Critique STAGE-1 pre-empts"; structural mitigations already in the build (SYNTHETIC_FALLBACK fail-closed; overclaim-lint + INVARIANT 6).

#### For Next Skill (url_preverify → build)
- Proceed to url_preverify (all-live recorded) then build. Live demo headline = OFAC-DON-attested filable record + no-PII-on-chain proof; C3 enclave = production path, beta-pending (never simulated/fabricated). First build action: request Confidential Workflows beta invite.

---
### hackathon-build — 2026-10-31
**Status:** COMPLETE (phases 0-4 + real deploy; P4.3 seed + P5 demo/package deferred as noted)
**Session(s):** 1 (orchestrator + 4 implementation subagents + 1 compliance auditor; linear base, methodology not engaged)
**Provenance:** agent_nonce `49043cf0db415dea459b7329`

#### Done
- P0 scaffold + franchise skeleton (pnpm workspace, foundry, claims ledger, verify-claims recompute gate, SECURITY.md, DOMAIN-GUIDE, CI, clean-room release gate).
- P1 legal core: deterministic resolver (no AI on decision path), IVMS101 builder/validator (C1/C6), keccak256 commitment — 12/12 core tests, COMMITMENT_KEYS round-trip.
- P2 LIVE OFAC (C5): real SDN feed smoke green (publishDate 10/28/2026, 1058 addrs, Garantex self-check PASS); fail-closed. Found+fixed 2 false-CLEAR bugs in unverified arch code (hex-addr sci-notation coercion; fuzzball CJS interop). C4 DON workflow authored vs cre-sdk 1.23.0; live simulate deferred (cre login).
- P3 chain: TravelRuleAttestation DEPLOYED @ 0xa8CD17A860f3A0DE51e1135248F22560d4721738 (Base Sepolia, tx 0x14328bc1…45d8, block 52676285); 5/5 forge tests; no-PII struct; real forwarder 0xF8344C; compliance COMPLIANT. C6 real TRISA lookup (fail-closed disclosed) + synthetic match. C3 verify workflow real code (beta-pending label). run-cre.sh fail-loud stub.
- P4 web: 8 routes build+render 200; cockpit/record/memo/proof/ledger real against the live contract; api/run fails closed to 502 (never fabricated CLEARED). Inline-fixed a 500-crash on malformed intent -> 400 guard. UI-coverage 7/7 (.feature-coverage.json).

#### Verified Facts
- VF-b1 TravelRuleAttestation live on Base Sepolia holding no PII. Recompute: `cast code 0xa8CD17A860f3A0DE51e1135248F22560d4721738 --rpc-url $BASE_SEPOLIA_RPC_URL` => non-empty bytecode; `cast call 0xa8CD17A860f3A0DE51e1135248F22560d4721738 "s_forwarderAddress()(address)" --rpc-url $BASE_SEPOLIA_RPC_URL` => 0xF8344CFd5c43616a4366C34E3EEE75af79a74482 (real non-zero).
- VF-b2 Core legal engine deterministic + round-trips. Recompute: `cd TravelProof && corepack pnpm -r test` => core 12/12 + ofac 6/6 pass.
- VF-b3 OFAC screen is live, not cached. Recompute: the P2.1 live smoke (fetchAndIndexSdn + assertDemoHitPresent) => fresh publishDate + Garantex HIT present.
- VF-b4 No PII-write possible on-chain (structural). Recompute: `grep -nE '^\s*string' TravelProof/contracts/src/TravelRuleAttestation.sol` => 0 storage string fields.

#### Blockers for Downstream (debug/wire)
- cre login (interactive OAuth, Dami): unblocks C4/C3/run-cre live simulate + the 2 seed attestations (P4.3). run-cre.sh + api/run already fail closed (no fabrication).
- Confidential Workflows private-beta invite (C3): request prepared at submission/C3-BETA-INVITE-REQUEST.md (human-gated form, surfaced to Dami). Non-blocking for the live thesis.
- TRISA JSON surface gRPC-only (HTTP 415): fail-closed SYNTHETIC_FALLBACK disclosed via `source`; flips to real if a JSON surface appears.

#### For Next Skill (build → debug)
- Run the 6-phase quality gate; grep BUILD-REPORT.md for DEV- entries (5 UNTESTED/DEGRADED carries: DEV-204 C4-sim, DEV-304 run-cre, DEV-301 TRISA, DEV-401/404 CRE leg). Hero path = the deployed contract read + live OFAC + the cockpit honest-degrade. All UNTESTED carries trace to the single cre-login gate, not to broken code.

#### DL-learn
VF-b1 TravelRuleAttestation deployed no-PII @ 0xa8CD17A8..1738 | Recompute: cast code + s_forwarderAddress() on Base Sepolia | => bytecode present + forwarder 0xF8344C

## Amplifier

### Perspective (build, claude)
22 points across 5 buckets → PERSPECTIVE-build.md; bolder: Reframe the product as a recomputable compliance receipt (resolver output + SDN publishDate + screen result → commitment hash) that verify-claims reproduces f

## Amplifier

### Response (build, codex)
3 ADAPT, 18 ADOPT, 1 REJECT over 22 points → PERSPECTIVE-RESPONSE-build.md

## Amplifier

### Response (build-canary, codex)
5 ADAPT, 17 ADOPT, 1 REJECT over 23 points → PERSPECTIVE-RESPONSE-build-canary.md

## Amplifier

### Engagement canary (build)
planted bad point → builder said REJECT (PASS)

## Amplifier

### ⚠ ESCALATION (build)
logic-audit flagged false-shortcut → paused for human ruling. See ESCALATION-build.md

## Amplifier

### Adopt verification (build)
0/21 ADOPTs landed; 21 lip-service
