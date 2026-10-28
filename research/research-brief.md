# BLI Legal Tech Hackathon 2 — Research Brief
**Compiled:** 2026-10-28
**Intel Depth:** ID 9 (Deep Intelligence)
**Sources:** Web Research (25 sources), DoraHacks logged-in browser capture (`intel/dorahacks-recon.md`). Social Intel: not gathered (autonomous conductor run — see § Social Intel).

---

## Overview

| Field | Value |
|-------|-------|
| Name | BLI Legal Tech Hackathon 2 |
| Organizer | Blockchain Legal Institute (BLI) — 2nd annual |
| Platform | DoraHacks (`dorahacks.io/hackathon/legal-hack-2026`) |
| Deadline | 2026-11-01 02:01 UTC+1 (night of Oct 31 → Nov 1 WAT) |
| Tracks | RWA · LegalTech & RegTech · AI x Blockchain · Web3 for Social Good · GameFi & NFT · Green Tech |
| Chain | Ethereum / EVM (testnet OK); field used Base Sepolia, Sepolia, Arc |
| Native token | n/a (EVM gas) |

### Submission Requirements
- DoraHacks BUIDL submission (up to 10 bounties per build)
- Demo video strongly recommended (≤300s per conductor state) — **workflow-first, the lawyer's view, not code-first**
- GitHub repo
- Deployed contract addresses + chainId (credibility signals)

---

## Demo Video Requirements

| Field | Value |
|-------|-------|
| Max length | 300s (conductor `videoLengthRequirement`) |
| Formats | MP4 / YouTube |
| Platform | DoraHacks BUIDL |
| Content notes | Workflow-first (the lawyer's view), not code-first (brief §11 demo guidance) |

No hard length rule published on the DoraHacks page; 300s is the conductor-set target [ASSUMED from conductor state].

---

## Submission Form Fields

DoraHacks BUIDL submission form not scraped field-by-field at intel (browser is a session singleton; recon captured tabs, not the submit form). Standard DoraHacks BUIDL fields apply: Project Name, Logo, Tagline, Description/Details (blueprint format), Demo Video URL, GitHub/Source URL, Tracks, Bounties, Team, Tech tags, Deployed-contract addresses. **Package phase must re-open the live form to confirm.**

---

## Disqualifiers

No explicit disqualification rules published on the DoraHacks page. Standard risks: wrong track tag, missing demo, submission after 02:01 UTC+1 Nov 1. Prize-pool disclaimer (may change/withdraw) is accepted risk, not a disqualifier.

---

## Prizes

| Layer | Amount | Notes |
|-------|--------|-------|
| Headline pool | $20,000 | Page disclaimer: still developing, may change/withdraw |
| Concrete layer | $10,000+ | Bounties + support + promotion from blockchain law firms + angel pitching + international press + mentors + accelerator network |
| **Chainlink — Best workflow with CRE** | $2,000 (2× $1,000) | CRE = Chainlink Runtime Environment |
| **RYO-CHAN — Autonomous Agents** | $6,000 | Vaguer brief |

Note: a single build can target a track + both bounties.

---

## Judging Criteria

Derived (no explicit public rubric). Weighted to the stated win condition "make lawyers nod":

| Criterion | Weight | What it means | How to score high |
|-----------|:---:|---|---|
| Legal-workflow credibility | 40% | Would a practicing lawyer/compliance officer adopt + cite this? | CITE real frameworks (FATF, MiCA, BSA/SAR, UCC Art.12, GLEIF, OFAC); human-readable lawyer-filable output as first-class |
| Technical execution / working demo | 25% | Working deployed contracts + live workflow | Deployed addresses + chainId; a demo that actually runs end-to-end |
| Innovation / problem-solution fit | 20% | Real compliance pain, not tech-for-tech | Target an UNDER-served workflow (see Kill List) |
| Presentation / polish | 15% | Clear lawyer-facing story in ≤5 min | Workflow-first video; clean document output |

---

## Event Class & Judge Reading

- **Event class:** `sponsor_track` (derived — `event_class_derived: true`). Two sponsor-judged bounties (Chainlink CRE engineers; RYO-CHAN agents) sit over an organizer-judged open field of 6 tracks.
- **Why this class:** The money and the differentiation live in the two named bounties, and the headline pool is organizer/law-firm judged. The GRAND-prize mechanism is law-firm + blockchain-people judging on "credible + adoptable."
- **Judge reading:** Law firms and legal professionals judge ALONGSIDE blockchain people [brief §2]. **This panel rewards a complete legal-practice workflow, not a crypto-judge-facing agent.** Hard evidence from BLI's OWN first hackathon (Dec 2025, 91 projects, $50K): the highlighted winners were **HakiChain** — a Web3+AI platform for lawyers/NGOs/clients that automates casework, verifies documents on-chain, and uses *smart escrow to enforce payment milestones* — and **PeerVerse** (decentralized identity + verifiable credentials). BLI rewards lawyer-workflow completeness + on-chain trust anchoring, NOT trading bots. [B2, medium.com/constellationlabs]
- **Sponsor vintage (L5, last ~90 days):** CRE is itself the fresh mid-window primitive — mainnet-live, CLI v1.28.0 shipped 2026-07-30, Developer Assistant MCP server. A genuinely LEGAL CRE workflow (not the 7th trading-verdict clone) is the podium play. [A1]

---

## Workshop Signals

No workshop schedule published on the DoraHacks page / not captured in recon. Organizer intent is instead read from BLI Hackathon 1 winners (above) and the track list: LegalTech & RegTech explicitly names "data privacy for minors, KYC / on-chain legal docs, legal automation" — a direct organizer signal toward compliance + legal-document workflows.

---

## Tech Deep Dive — Chainlink CRE

**BOTTOM LINE:** CRE is the one named sponsor primitive, it is mainnet-live, and it is purpose-built for exactly the "data-connected, compliance-ready, privacy-preserving" workflows a legal build needs. The field is using it narrowly (trading verdicts) — a real compliance workflow on CRE is open podium.
**EVIDENCE:**
- CRE = code-first workflows in Go or TypeScript, secured by DON consensus; "build data-connected, compliance-ready, privacy-preserving smart contracts" [A1, docs.chain.link/cre]
- Capabilities: Triggers (cron/HTTP/on-chain event), HTTP (consensus call to any API), Confidential HTTP (enclave + secret injection + optional response encryption), EVM Read/Write (Ethereum/Base/Arbitrum), Solana Read/Write [A1]
- CLI v1.28.0 (2026-07-30); execution-observability commands with `--output json`; Developer Assistant MCP server for AI IDEs [A1]
**CONFIDENCE:** High — official docs, 2+ corroborating sources.
**SO WHAT:** The CRE $2K bounty is winnable with a LEGAL workflow (sanctions/LEI/registry verification → DON consensus → on-chain attestation). Confidential HTTP is the differentiator nobody in the field is using — it enables PII-handling with data-minimisation, a point that makes a privacy lawyer nod.

### Package names / resources
- `@chainlink/cre-sdk` (npm), Go SDK, `cre` CLI; docs: `docs.chain.link/cre`, capabilities: `/cre/capabilities`, release notes: `/cre/release-notes`

---

## Network / Chain Infrastructure

| Field | Value |
|-------|-------|
| Chain | EVM testnet (Ethereum / Base / Arbitrum supported by CRE) |
| Chain ID | TBD at build (Base Sepolia 84532 / Sepolia 11155111 are field precedent) |
| RPC | Per chain (Base Sepolia, Sepolia public RPCs) |
| Testnet | Base Sepolia / Sepolia (field precedent: Legal Notary → Base Sepolia; Verdict Desk → Sepolia) |
| Faucet | Per testnet |
| Deploy requirement | Testnet deploy acceptable (brief §11); deployed addresses + chainId are credibility signals |

---

## Ecosystem Products

| Product | Purpose | Integration depth rating | Docs URL | Notes |
|---------|---------|---|----------|-------|
| Chainlink CRE | DON-consensus off-chain compute + verified data on-chain | DEEP (bounty-bearing) | docs.chain.link/cre | The trust layer; contested but legal-workflow use is open |
| GLEIF LEI / vLEI | Verifiable legal-entity identity for KYB / counterparty verification | Data source via CRE HTTP | gleif.org | 2026: GLEIF×ENS onchain identity, GLEIF×BIS vLEI trust-layer pilots |
| OFAC SDN / Consolidated list | Sanctions screening (names + crypto wallet addresses) | Data source via CRE HTTP | treasury.gov/ofac | SDN now includes Digital Currency Address entries |

---

## Capability Map

The sponsor/stack primitives, honestly scoped. (Bar: `01-0G-CAPABILITY-MAP.md` — can/can't + maturity honesty + load-bearing-for.)

| Primitive | Can (proven) | Can't / not-yet | Maturity | Evidence | Load-bearing for |
|-----------|--------------|-----------------|----------|----------|------------------|
| CRE Triggers | Start workflow on cron / HTTP / on-chain event | Fixed trigger types; not a general off-chain scheduler | mainnet-live | docs.chain.link/cre/capabilities [A1] | Continuous/periodic re-screening (daily sanctions re-check, renewal re-KYC) — the "fails-closed continuously" legal requirement |
| CRE HTTP (consensus) | Call any API from every DON node, consensus on result | Per-node fan-out (cost/rate-limit × node count); non-deterministic APIs break consensus | mainnet-live | docs.chain.link/cre/capabilities [A1] | DON-consensus verification of a legal data source (OFAC, GLEIF, registry, court record) — the defensible trust layer |
| CRE Confidential HTTP (enclave) | API calls inside a secure enclave; secret injection; creds/responses hidden from node operators; optional response encryption | Added latency/complexity; still HTTP-only sources | mainnet-live | docs.chain.link/cre/capabilities [A1] | Privacy-preserving KYC/PII (screen a party without leaking identity on-chain) — data-minimisation / GDPR angle |
| CRE EVM Read & Write | Read state + write consensus-verified results to Ethereum/Base/Arbitrum | Write cadence/gas bound by target chain; not sub-second | mainnet-live | docs.chain.link/cre/capabilities [A1] | Writing the DON-signed compliance verdict/attestation on-chain as the immutable audit record |
| CRE Solana Read & Write | Read account state; write via Keystone Forwarder (Mainnet+Devnet) | Second runtime; not EVM-first | mainnet-live | docs.chain.link/cre/capabilities [A1] | **NOT load-bearing** for this EVM-centric build (flagged) — only if a Solana receipt is wanted |
| CRE SDKs + CLI (Go/TS) | Code-first authoring, local sim, deploy, exec-observability (CLI v1.28.0); Dev Assistant MCP | New tooling; thin LEGAL example corpus; workflow debugging less mature | GA | docs.chain.link/cre/release-notes; @chainlink/cre-sdk [A1] | The entire CRE-bounty build surface; TS SDK pairs with Next.js lawyer-facing frontend |
| Dami/leash asset stack (EVM) | Solidity depth, calldata decode, Permit2, policy gates, on-chain audit trails, multi-chain relay | Not a CRE workflow by itself — must wire INTO CRE for the bounty; no legal-doc render layer yet | mainnet-live | config.json builder_profile; leash prod api.leash.ink [B2] | On-chain policy enforcement + human-readable audit trail = "trust layer not the product" spine |

---

## Organizer Feedback (DX seam)

| Area | Friction | Evidence |
|------|----------|----------|
| docs | CRE capabilities page publishes no per-capability maturity/beta flags or rate-limit/consensus caveats (e.g. per-node HTTP fan-out cost); builders must infer limits | docs.chain.link/cre/capabilities fetched 2026-10-28 |
| DX | CRE is Go/TS code-first and new (CLI on rapid 1.2x releases Jul 2026); LEGAL (non-DeFi) example corpus is thin — most examples are price/data feeds, not compliance screening | blog.chain.link/5-ways-to-build-with-cre; field shows 7/16 builds cloning the same trading/verdict CRE pattern |

---

## Competitor Landscape

Synthesized from the authoritative DoraHacks capture (`intel/dorahacks-recon.md` — 16 builds / 572 hackers / 2 bounties at 3-days-left). **The field is crypto-judge-facing, not lawyer-facing** — that is the wedge.

**BOTTOM LINE:** 16 builds cluster into ~5 themes; ~2/3 are "an AI agent does X, we hash-log it." Only ~4 builds are a workflow a practicing lawyer would adopt. The "make lawyers nod" bar is largely UNMET by the field.
**EVIDENCE:** see registry below (all [A1] — logged-in DoraHacks capture).
**CONFIDENCE:** High (direct platform read) — but submissions close Nov 1, so late entrants are not yet visible.
**SO WHAT:** Win by being the ONE complete, cited, lawyer-filable legal workflow, with on-chain proof as the trust layer not the product.

### Competitor Registry (threat = to a lawyer-facing legal workflow)

| Project | Cluster / Track | Threat | Tech | Source | Conf |
|---------|-------|:---:|---|---|:---:|
| LexProof | Contract review → "Legal Passport" on-chain | **HIGH** | Crypto-AI, Ethereum, Chainlink | recon [A1] | High |
| ClearRelease | Sanctions-screen both parties, fails-closed, continuous | **HIGH** | Ethereum, Chainlink, RegTech, Escrow, Oracles | recon [A1] | High |
| Legal Notary | AI paralegal, x402-paid CRE, GLEIF verify + clause check, notarize Base Sepolia | **HIGH** | AI, x402, CRE, Base Sepolia | recon [A1] | High |
| PREDGE | Dispute → verifiable evidence pack for lawyers, DON-signed | MEDIUM | Ethereum, Polygon, Chainlink | recon [A1] | High |
| Bull v. Bear / Debate Desk / Verdict Desk / Warrant / SignalLedger | AI trading-agent + on-chain verdict (SATURATED, ~5) | LOW (not lawyer-facing) | CRE, Solana, Sepolia | recon [A1] | High |
| Foreman / PocketChange | Agent spending-limit / bounded authority (~3) | LOW | USDC, Arc | recon [A1] | High |
| x402-Paid CRE / ArcBooks Auto-Attest | x402-paid CRE workflow (~3) | LOW–MED | x402, CRE, Arc | recon [A1] | High |
| ZK-CID | ZK compliance identity, Semaphore, CRE revokes sanctioned | MEDIUM | ZK, Semaphore, CRE | recon [A1] | High |
| ArcShield / BlockDNS | Risk indicators / on-chain naming (outliers) | LOW | Arc / Base | recon [A1] | High |

### Competition Density Map

| Track | Est. Teams | Activity | Density |
|-------|:---:|---|:---:|
| LegalTech & RegTech | ~6 (compliance+notary+contract clusters) | High | HIGH |
| AI x Blockchain (trading agents) | ~5 | High | MEDIUM-HIGH |
| RWA (tokenization w/ legal wrapper) | ~0 squarely | None | **LOW (blue ocean)** |
| Web3 for Social Good | ~0–1 | Low | LOW |
| GameFi & NFT | 0 | None | LOW |
| Green Tech | 0 | None | LOW |

---

## Community Pain (Verbatim Quotes)

Legal/compliance practitioner pain, verbatim from sourced 2026 material (hackathon Discord not reviewed — autonomous run):

1. "Up to **95% of AML alerts** industry-wide are false positives" — [B2] kyc360.com / smartsearch.com, KYC/AML 2026 outlook.
2. "**Vague narratives are the most common quality deficiency identified by FinCEN** in SAR reviews… describing what happened without saying why it matters." — [B2] amlwatcher.com, "How to Write a SAR Narrative That Satisfies FinCEN Examiners in 2026."
3. "**Asset confusion is the most common legal risk in RWA tokenization and the most catastrophic** for token holders… the underlying assets must be genuinely held by the SPV — not by the originator or custodian." — [B2] buzko.legal / gofaizen-sherle.com, RWA legal guides 2026.
4. "Trust accounting requires **three-way reconciliation** with all funds accounted for, comparing the bank statement against your trust ledger and against each client's trust ledger." — [A2] texasbarpractice.com, Client Trust Accounts guide. (For crypto held in trust: "keep a ledger that **reconciles to the blockchain**." — [B2] shipkevich.com.)

---

## Past Editions Analysis

**BOTTOM LINE:** BLI Hackathon 1 (Jun–Dec 2025) drew 320 hackers / **91 projects** / $50K+, and the organizer-highlighted winner was a complete lawyer/NGO/client workflow, NOT a trading agent — a direct signal for what BLI's judges reward.
**EVIDENCE:**
- H1: 320 hackers, 91 projects, winners recognized 2025-12-12, "$50,000+ in bounties and support from top blockchain law firms"; two tracks (modernize legal systems/compliance/accessibility; real-world business solutions) [A2, bli.tools]
- Highlighted: **HakiChain** — Web3+AI for lawyers/NGOs/clients, automates casework, verifies documents on-chain, **smart escrow enforcing payment milestones**, Constellation anchoring legal data for tamper-proof authenticity [B2, Constellation Medium]
- Also: **PeerVerse** — decentralized identity + on-chain reputation + verifiable credentials [B2]
- H1 protocol partners: Constellation, ICP, Story Protocol. **H2 has swapped to Chainlink CRE** as the headline sponsor primitive — the tooling shifted; the lawyer-workflow judging bar did not.
**CONFIDENCE:** Medium-High (organizer blog + partner blog).
**SO WHAT:** The winning shape for BLI is a COMPLETE legal-practice workflow (intake → enforce → anchor → human-readable record). Mirror HakiChain's shape (escrow-enforced milestones + on-chain document/verdict anchoring) but in a sharper, cited single workflow, on CRE.

---

## Broader Market Context

**BOTTOM LINE:** 2026 is a compliance-enforcement inflection — MiCA transition ended, FinCEN SAR rules clarified, UCC Art.12 live, FATF Travel Rule now "the floor not the frontier." Law firms face rising cost + alert fatigue; on-chain verifiable-trust layers are entering real pilots (GLEIF×ENS, GLEIF×BIS vLEI).
**EVIDENCE:**
- MiCA transitional period ended **2026-07-01**; unauthorized CASPs must cease EU operation [A2, sumsub]
- FATF Travel Rule: $1,000 FATF baseline, FinCEN $3,000, EU zero threshold; "the floor, not the frontier… most VASPs still not technically ready" [A2, notabene]
- FinCEN clarified SAR obligations Oct 2025; SAR within 30 days of detection; 5-year retention [A1, WilmerHale]
- UCC Article 12 (controllable electronic records) effective in NY **2026-06-03**; control-beats-filing; adopted NY/NE/IA/NH/IN [A1, Wolters Kluwer]
- GLEIF×ENS onchain org identity + GLEIF×BIS vLEI trust-layer pilots, Sibos 2026 [B2]
- Blockchain chain-of-custody: *US v. Sterlingov* (Sep 2026) upheld blockchain-analysis evidence; courts admit on-chain records under ordinary authentication rules (process must be documented/reproducible) [B2, gavelchain/truescreen]
**CONFIDENCE:** High (regulatory primaries + law-firm alerts).
**SO WHAT:** Cite these exact frameworks by name in the build and demo — that is the single biggest "make lawyers nod" lever, and it is what the field is NOT doing.

---

## Category Saturation (field-density proxy)

Copilot/Grid unavailable (`copilot_pat_available: false`; Grid MCP not loaded) — density derived from the authoritative 16-build DoraHacks field (query date 2026-10-28), not Grid.

| Category | Builds in field | Distinct themes | Saturation |
|----------|:---:|:---:|---|
| AI trading-agent + on-chain verdict | ~5 | 1 (near-duplicate) | HIGH |
| Compliance/sanctions/identity screening | ~3 | 2 | MEDIUM |
| x402-paid CRE workflow | ~3 | 2 | MEDIUM |
| Agent bounded-authority | ~3 | 1 | MEDIUM |
| Contract review / notarization / evidence | ~3 | 3 | MEDIUM |
| **RWA tokenization w/ legal wrapper** | **~0** | 0 | **LOW (blue ocean)** |
| Regulatory reporting (SAR/Travel Rule/MiCA filing) | **0** | 0 | **LOW (blue ocean)** |
| Legal trust/escrow + three-way reconciliation | **0** | 0 | **LOW (blue ocean)** |

---

## Builder Project History (Copilot)

Not available — `copilot_pat_available: false`. No Colosseum Copilot corpus search run. Prior-art grounding instead comes from the Past Editions Analysis (BLI H1 / HakiChain) above and the live field.

---

## Key Links & Resources

| Resource | URL |
|----------|-----|
| Hackathon page | https://dorahacks.io/hackathon/legal-hack-2026 |
| BLI H1 recap | https://bli.tools/bli-legal-tech-hackathon-global-projects-address-compliance-challenges/ |
| Chainlink CRE docs | https://docs.chain.link/cre |
| CRE capabilities | https://docs.chain.link/cre/capabilities |
| CRE release notes | https://docs.chain.link/cre/release-notes |
| FATF Travel Rule | https://notabene.id/crypto-travel-rule-101/what-is-the-crypto-travel-rule |
| MiCA 2026 | https://sumsub.com/blog/crypto-regulations-in-the-european-union-markets-in-crypto-assets-mica/ |
| FinCEN SAR clarification | https://www.wilmerhale.com/en/insights/client-alerts/20251028-fincen-clarifies-suspicious-activity-reporting-requirements |
| UCC Article 12 (NY) | https://www.wolterskluwer.com/en/expert-insights/new-york-enacts-ucc-amendments-on-digital-assets |
| GLEIF LEI/vLEI | https://www.gleif.org/en/about-lei/introducing-the-legal-entity-identifier-lei |
| OFAC crypto screening | https://dev.to/easysolutions906/ofac-sanctions-screening-for-crypto-and-defi-a-developers-guide-3fj1 |
| Blockchain evidence in court | https://gavelchain.com/blockchain-evidence-chain/ |
| Crypto in IOLTA trust accounts | https://www.shipkevich.com/law-firms-client-cryptocurrency-trust-accounts-iola/ |

---

## Track Coverage Matrix

| Track | Prize | Judging Focus | Overlap Potential | Est. Submissions |
|-------|-------|--------------|-------------------|-----------------|
| LegalTech & RegTech | Headline + CRE bounty | Compliance/legal-doc workflow | CRE bounty + AI×Blockchain | HIGH |
| AI x Blockchain | Headline + RYO-CHAN $6K | Autonomous agents | RYO-CHAN bounty + LegalTech | MEDIUM-HIGH |
| RWA | Headline | Tokenization + legal wrapper | LegalTech (legal wrapper) + CRE (registry/valuation oracle) | **LOW** |
| Web3 for Social Good | Headline | DID, anti-corruption | LegalTech | LOW |
| GameFi & NFT | Headline | — | — | LOW |
| Green Tech | Headline | — | RWA (carbon credits) | LOW |

**Multi-track targets:** A compliance/legal-workflow build spanning **LegalTech & RegTech + Chainlink CRE bounty** is the strongest 2-for-1; adding **AI x Blockchain** (if it has an AI paralegal/agent) picks up the RYO-CHAN $6K too. An RWA-with-legal-wrapper build spans **RWA + LegalTech + CRE** with almost no competition.
**Low-competition tracks:** RWA, Social Good, GameFi, Green Tech are near-empty — but RWA is the only empty track with a credible legal-workflow story.

---

## Domain Knowledge Sources

| Source | URL | Covers | Essential? |
|--------|-----|--------|:---:|
| Chainlink CRE docs + capabilities | docs.chain.link/cre | Workflow authoring, DON consensus, HTTP/Confidential HTTP/EVM write | YES |
| FATF Travel Rule (Notabene) | notabene.id/crypto-travel-rule-101 | Thresholds ($1K/$3K/€0), originator/beneficiary data fields | YES (if Travel Rule build) |
| FinCEN SAR guidance | wilmerhale.com + amlwatcher.com | SAR 30-day filing, narrative quality bar, 5-yr retention | YES (if SAR build) |
| RWA legal wrapper guides | buzko.legal / gofaizen-sherle.com | SPV structure, title-vs-token gap, asset confusion risk | YES (if RWA build) |
| UCC Article 12 | wolterskluwer.com + manatt.com | Controllable electronic records, control-beats-filing, qualifying purchaser | YES (if escrow/collateral build) |
| GLEIF LEI/vLEI | gleif.org | 20-char LEI, vLEI credential, KYB automation | YES (if KYB build) |
| IOLTA trust accounting | texasbarpractice.com + shipkevich.com | Three-way reconciliation, crypto-in-trust custody rules | YES (if trust/escrow build) |
| OFAC SDN screening | treasury.gov + dev.to guide | SDN incl. crypto addresses, fuzzy matching, false positives | YES (if sanctions build) |

---

## Kill List

### 1. Saturated
- **AI bull/bear debate → AI judge → on-chain verdict** — ~5 near-duplicate builds (Bull v. Bear, Debate Desk, Verdict Desk, Warrant, SignalLedger). DEAD.
- **Generic "AI agent decision + hash-log it"** — the field's dominant shape; crypto-judge-facing, fails the "make lawyers nod" bar.
- **Agent spending-limit / bounded-authority** (Foreman, PocketChange) — contested, and chasing the crowded RYO-CHAN $6K lane.
- *(organizer-suggested)* The track blurb's "prediction markets" and "decentralized autonomous agents" (AI×Blockchain track) are exactly where the clone cluster piled up — treat as collision map, not menu.

### 2. Broken Dependencies
- None hard-blocking. CRE is mainnet-live but new: thin LEGAL example corpus + Go/TS learning curve + per-node HTTP fan-out cost are real build-time risks (see Organizer Feedback). A build that depends on a flaky third-party legal API inside CRE HTTP (non-deterministic response) will break DON consensus — pick deterministic/cacheable sources (OFAC SDN snapshot, GLEIF LEI lookup).

### 3. Already Built
- **Sanctions-screen both parties, fails-closed, continuous** — ClearRelease ships this. Only beat it with deeper framework citation (FATF R.16 + OFAC) + a lawyer-filable output.
- **Contract review → on-chain passport** — LexProof ships this.
- **x402-paid CRE + GLEIF verify + clause check + notarize** — Legal Notary ships this. Do NOT re-skin it.

### 4. Zero Alignment
- Pure GameFi / Green Tech builds with no legal-workflow spine — no connection to the "make lawyers nod" win condition or the two bounties.

---

## Candidate Directions (for warroom / STAGE-0 — NOT a pick)

5 directions, each with track fit, bounty fit, the competitor it must beat, and the legal-credibility angle. Warroom/STAGE-0 chooses.

**D1 — Travel Rule compliance workflow (VASP originator/beneficiary data, fails-closed).**
- Track: LegalTech & RegTech. Bounty: Chainlink CRE ($2K) — CRE HTTP verifies counterparty VASP + screens, EVM Write anchors the DON-signed Travel Rule record. Competes with: ClearRelease (sanctions), Legal Notary (KYB). Legal angle: cite FATF Recommendation 16, the $1K/$3K/€0 threshold patchwork, originator/beneficiary required fields — "the floor most VASPs still can't meet." Output: a filable Travel Rule record a compliance officer signs.

**D2 — SAR / regulatory-reporting assistant with on-chain evidence anchor.**
- Track: LegalTech & RegTech (+ AI×Blockchain if AI drafts the narrative → RYO-CHAN $6K). Bounty: CRE anchors the evidence hash + timestamp. Competes with: PREDGE (evidence pack), partially ClearRelease. Legal angle: cite FinCEN's exact SAR pain ("vague narratives are the most common deficiency"), 30-day filing clock, 5-yr retention — a SAR narrative drafter + tamper-evident evidence chain that satisfies examiners. Blue-ocean: NO build targets regulatory reporting.

**D3 — RWA tokenization with a real legal wrapper (SPV-anchored).**
- Track: **RWA (empty track)** + LegalTech + CRE. Bounty: CRE reads an off-chain registry/attestation to prove the SPV actually holds the asset. Competes with: nobody squarely (blue ocean). Legal angle: cite the title-vs-token gap, SPV membership-interest structure, UCC Art.12 control, and "asset confusion = most catastrophic risk" — the token is the trading mechanism, the SPV holds title. Highest differentiation, highest legal-research lift.

**D4 — Legal trust/escrow with three-way reconciliation (the HakiChain-shaped play).**
- Track: LegalTech & RegTech. Bounty: CRE for milestone verification + Confidential HTTP for PII; EVM Write anchors the trust ledger. Competes with: echoes HakiChain (BLI H1 winner shape) — a signal, not a competitor in H2. Legal angle: cite IOLTA three-way reconciliation + the crypto-in-trust custody rules (separate wallet per client, ledger reconciles to chain, keys via custodian/multisig). An escrow whose on-chain ledger IS the third reconciliation leg. Directly mirrors what BLI's own judges rewarded.

**D5 — Verifiable KYB / counterparty-identity workflow on vLEI + CRE Confidential HTTP.**
- Track: LegalTech & RegTech (+ Social Good via DID). Bounty: Chainlink CRE ($2K) — Confidential HTTP screens credentials in-enclave (the differentiator the field ignores). Competes with: ZK-CID (ZK identity), Legal Notary (GLEIF). Legal angle: cite GLEIF LEI/vLEI + 2026 GLEIF×ENS/BIS pilots + MiCA fit-and-proper / KYB duties — privacy-preserving KYB that verifies the legal entity AND the authority of the signer, without leaking PII on-chain (data-minimisation).

**Cross-cutting law of the wedge:** all five must put the **cited legal framework + human-readable lawyer-filable output as first-class, with on-chain proof as the trust layer not the product**. That single discipline is what the current 16-build field is missing and what BLI's judges demonstrably reward.
