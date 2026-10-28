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
| Weighted judging 40% to legal credibility (derived) | Win condition = "make lawyers nod"; no public rubric | intel |
| Treated DoraHacks recon as authoritative Phase 1/3 competitor data; did NOT re-scrape | Browser is session singleton per dispatch; recon is logged-in capture | intel |
| Surfaced 5 candidate directions (Travel Rule, SAR, RWA, trust/escrow, vLEI KYB); did NOT pick | Pick is warroom/STAGE-0's job | intel |

## Downstream Items
<!-- Owner-routed, non-blocking deferred work. Every skill reads on entry, actions rows it owns. See PULSE-PROTOCOL § Downstream Items. -->
| ID | Raised by | Owner phase | Pri | Item | Acceptance | Status |
|----|-----------|-------------|:---:|------|-----------|:------:|

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
