# WAR ROOM V1 — BLI LEGAL TECH HACKATHON 2 DELIBERATION BRIEF
**Date:** 2026-10-29 | **Objective:** Pick THE ONE idea that is BOTH most winnable AND solves a significant real legal problem. Win condition = **make lawyers nod**.

## NON-NEGOTIABLE RULES (from the builder)
**[C] Critical:** #3 Uniqueness (zero same-niche competitors in the 16-build field) · #5 Real humans (name the specific lawyers/compliance officers) · #9 Significant problem + builder conviction (would build without prize) · #13 Day-1 users exist TODAY · #15 No self-duplication — **HARD KILL: the shipped "CRE Compliance Gate" project (CRE-gated policy engine validating compliance conditions before an on-chain/DeFi operation proceeds). Any idea whose core = "CRE gates the transaction / policy-check-before-execution" is eliminated regardless of chain.** · #8 cumulative corrections · #1 time not a constraint.
**[I] Important:** #2 testnet fine · #10 focused product / broad problem · #14 demo feels like the real product (lawyer-filable output) · #11 winning AND impact.
**[A] Advisory:** #4 fresh ideas · #12 reframing ok.

## TASTE CONTRACT
U1 integral/real/works · U2 judge SEES it in ~3 min · U3 exciting beats safe · U4 no reskins of past shapes · U5 grounded in builder capability · **U6 integration depth IS the strategy (CRE DON-signed attestation must be load-bearing)** · U7 demo state is EARNED.
Conditional: **C-NA1 — do NOT bolt AI on for judge appeal; legal credibility is the product, AI only where load-bearing (e.g. narrative draft a human signs).** C-IN1 — the demo must show a live CONSUMER of the on-chain proof (a lawyer reading/filing the output), not the chain merely existing.

## HACKATHON FACTS
BLI Legal Tech Hackathon 2 · DoraHacks · Deadline 2026-11-01 02:01 WAT (~2.5 days) · Headline "$20K" (disclaimer: may change) + concrete "$10K+ in bounties/promotion/pitching/press/accelerator from blockchain law firms" · Bounties: **Chainlink CRE $2K (2×$1K, Best workflow with CRE)**, RYO-CHAN Autonomous Agents $6K · Field: **16 builds / 572 registered** (very thin) · Judges: not published.

## JUDGING CRITERIA (derived, no public rubric)
Legal-workflow credibility 40% · Technical execution/working demo 25% · Innovation/problem-solution fit 20% · Presentation/polish 15%.

## EVENT CLASS + LENS
**Class:** sponsor_track (inferred) — Chainlink CRE is the named sponsor primitive; run the CRE lane as the FLOOR (one substitution-tested load-bearing CRE integration) and the legal-workflow win as the CEILING. WINNER-BRIEF names both lanes.
**Judge reading:** audience = law firms + blockchain people. "Make lawyers nod" = legal correctness + a workflow a firm would adopt beats max technical depth.
**Sponsor vintage (L5):** Chainlink CRE (Confidential HTTP the unexploited differentiator) — live, 7/16 builds use it.
**Gate conditionals:** default strictness. Gate-1b #1 (native-problem) carries the sponsor_track floor; a legal/real-world problem is acceptable ONLY where the CRE DON-signed attestation is load-bearing for the product's trust (checks #2–#4 never relaxed).

## THE BUILDER
Solidity/EVM depth · calldata decode · Permit2 · policy gates · on-chain audit trails · multi-chain relay (leash) · Foundry · Next.js · leash backend (Render+Neon) · claude-in-chrome. Preference: human-readable legal output first-class; on-chain proof as trust layer not product; cited frameworks over generic claims. **Shipped (forbidden to rebuild): "CRE Compliance Gate" (DeFi-ops compliance gate), "falsifiable-alpha / commit-before-publish accountability" (leash-family).**

## WHITESPACE / GAP MAP
See `warroom/gap-map.md` (primary: `research/roster-audit/strategy-density.md`, a real 16-build per-cluster map). Occupied: AI-verdict (saturated), agent-spend-limits, x402-CRE, sanctions-screening (ClearRelease strongest), evidence/notary (LexProof/PREDGE). **Whitespace (0 builds):** (1) RWA tokenization w/ cited legal wrapper (SPV/UCC Art.12); (2) regulatory-reporting automation (SAR/Travel Rule/MiCA filing); (3) legal trust/escrow 3-way reconciliation (IOLTA, HakiChain shape); (4) CRE Confidential HTTP privacy-KYB; (5) engagement-letter lifecycle enforcement. **Missing outcome:** a lawyer-FILABLE cited document as the first-class artifact (every build hashes AI output; none produce the signed filing).

## CANDIDATE DIRECTIONS (intel-scoped, NOT a pick — generators remix freely)
- **D1 Travel Rule** (FATF Rec.16 VASP originator/beneficiary, fails-closed). ⚠️ If framed as "CRE gates the transfer," it collides with shipped CRE Compliance Gate — must be framed as "produces the filable Travel Rule record."
- **D2 SAR / regulatory-reporting assistant** (FinCEN vague-narrative deficiency, 30-day clock, 5-yr retention; AI drafts narrative a human signs → on-chain evidence anchor). Blue-ocean.
- **D3 RWA tokenization w/ SPV legal wrapper** (title-vs-token gap, UCC Art.12 control; CRE reads registry to prove SPV holds title). Empty track, highest differentiation + legal-research lift.
- **D4 Legal trust/escrow 3-way reconciliation** (IOLTA; on-chain ledger IS the third reconciliation leg; CRE milestone verify + Confidential HTTP PII). Mirrors HakiChain (what BLI judges rewarded).
- **D5 Privacy KYB on vLEI + CRE Confidential HTTP** (GLEIF LEI/vLEI, 2026 GLEIF×ENS/BIS, MiCA fit-and-proper; verify entity AND signer authority without leaking PII). Exploits the ignored differentiator.

**Cross-cutting law of the wedge:** cited legal framework + human-readable lawyer-filable output FIRST-CLASS, on-chain proof as the TRUST layer not the product.

## SCORING CRITERIA (1-10 mapped to weights above)
YC Problem Quality (0-6): how big/urgent/underserved is the legal problem?
