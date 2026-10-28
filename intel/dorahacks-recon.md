# DoraHacks Recon — BLI Legal Tech Hackathon 2 (captured 2026-10-28, live, logged-in)

Source: https://dorahacks.io/hackathon/legal-hack-2026 (Details/Tracks/Bounties/Builds tabs, read in Dami's Chrome)

## Hard facts
- Prize pool headline: **20,000 USD** (page disclaimer: still developing, may change/withdraw — brief §1).
- Concrete layer: $10,000+ value in bounties, support, promotion from blockchain law firms + angel pitching + international press + mentors/legal pros + accelerator network.
- Deadline: **2026/11/01 02:01 UTC+1**. Submission opened 2026/05/15. Virtual.
- Field at 3-days-left: **16 builds / 2 bounties / 572 hackers** (thin — our reason for entering).
- Platform tech tags: Bitcoin, Ethereum. Hackathon tags: Blockchain, Crypto, Legal, Finance, Compliance, AI, RWA, RegTech.

## Tracks (6) — pick-one at STAGE-0
1. **Real World Assets (RWA)** — tokenization of real estate, carbon credits, art, agriculture.
2. **LegalTech & RegTech** — data privacy for minors, KYC / on-chain legal docs, legal automation. ← bullseye for "make lawyers nod" + Dami policy-gate/audit depth.
3. **AI x Blockchain** — decentralized autonomous agents, prediction markets, hybrid AI models.
4. **Web3 for Social Good** — decentralized identity, community voting, anti-corruption.
5. **GameFi & NFT Innovation** — educational gamification, incentive design, token economies.
6. **Green Tech** — sustainable development, energy-efficient chain solutions.

## Bounties (2) — sponsor targets
| Bounty | Sponsor | Value | Read |
|---|---|---|---|
| **Best workflow with CRE — 2× $1,000** | Chainlink | $2,000 | CRE = Chainlink Runtime Environment. Concrete, winnable deliverable (a legal/compliance workflow on CRE). BUT ~7 of 16 builds already use CRE — contested. |
| **Autonomous Agents** | RYO-CHAN | $6,000 | Bigger money, vaguer brief. The crowded trading-agent cluster is chasing it. |
Note: up to 10 bounties per Build; a single build can target a track + both bounties.

## The 16 existing builds (the competition)
### Cluster A — AI trading-agent + auditable evidence/verdict (SATURATED, ~5)
- **Bull v. Bear** (sanchay072): AI agents argue every trade, AI judge rules, Chainlink CRE files the verdict on-chain.
- **Debate Desk** (NoBanks Nearby): Bull/Bear agents argue same evidence, Judge rules, fixed rules gate the trade, decision → Solana receipt in same tx as trade. [Crypto-AI, Solana, Chainlink]
- **Verdict Desk** (Andri Amaro): AI agent decision → evidence a lawyer can file: frozen inputs, cited bull/bear debate, deterministic verdict, hash-chained record on-chain. Sepolia practice trades. [Security, Appchain]
- **Warrant** (Beltran12138): suitability evidence for trading AI agents — on-chain mandates, signed pre-trade disclosures, chain-only audit.
- **SignalLedger** (idforfugen): "Evidence in. Auditable practice decisions out." [AI/Robotics]
  → The bull/bear-debate-judge-onchain idea is a 3-way near-duplicate. This whole lane is crowded + crypto-judge-facing, not lawyer-facing.

### Cluster B — Agent spending-limit / bounded authority (~3)
- **Foreman** (yangdongsuk): AI agent runs freelance contracts inside smart-contract spending limits (USDC on Arc).
- **PocketChange** (somaykousis): bounded auditable spending authority for AI agents; every sub-agent token cryptographically smaller than parent. No model can raise a limit.
- **Warrant** (also fits here): on-chain mandates.

### Cluster C — x402-paid CRE workflow (~3)
- **x402-Paid CRE Workflows** (Evoarislan): agents pay per query in USDC via x402 to consume CRE.
- **Legal Notary** (zheng1dev): AI paralegal pays 0.01 USDC/call (x402) to a CRE workflow verifying counterparties in GLEIF, checking clauses for jurisdiction, notarizing on Base Sepolia. [AI/Robotics] ← genuinely legal-workflow-shaped.
- **ArcBooks Auto-Attest** (amien): CRE workflow rebuilds verifiable accounting statements, DON-consensus USD/IDR rate, hash-chained checkpoints on Arc.

### Cluster D — Compliance / sanctions / identity screening (~3)
- **ClearRelease** (notamgel): sanctions-screen both parties at signing/payment/continuously, fails closed, on-chain auditable evidence. [Ethereum, Chainlink, RegTech, Compliance, Escrow, Oracles] ← strongest "real legal workflow" competitor.
- **ZK-CID** (Jason Huang): ZK compliance identity — anonymous Semaphore commitment on-chain, CRE screens credentials at issuance + on schedule, revokes sanctioned members.
- **Legal Notary** (also KYB).

### Cluster E — Evidence / notarization / naming (outliers)
- **PREDGE / Predge Settlement Evidence**: disputed Polymarket market → verifiable evidence pack for lawyers & compliance, DON-signed report. [Ethereum, Polygon, Chainlink]
- **LexProof** (pgskannan): AI contract review sealed into a "Legal Passport" anchored on Ethereum — verify findings + human approval without trusting LexProof. [Crypto-AI, Ethereum, Chainlink] ← strong real-legal competitor.
- **ArcShield** (Qizhong Deng): explainable deterministic risk indicators for an Arc recipient address + payment URL before approving a USDC payment. [Arc]
- **BlockDNS**: on-chain naming with ownership history, IPFS publication proofs, escrow settlement trail. [DeFi, L2, NFT, Ethereum, Base]

## Strategic gaps (for warroom / STAGE-0)
1. **Field is crypto-judge-facing, not lawyer-facing.** Most builds are "an AI agent does X and we hash-log it." Very few are a workflow a practicing lawyer/compliance officer would adopt in real practice. The "make lawyers nod" bar is largely UNMET by the field — that is our wedge.
2. **CRE is contested (~7 builds).** Targeting the CRE bounty is viable only with a genuinely legal (not trading) workflow + cited frameworks. The $6K Autonomous-Agents bounty is where the crowded trading cluster piles up — lower differentiation odds there.
3. **Closest real-legal competitors to beat on credibility:** LexProof (contract review), ClearRelease (sanctions screening for payouts), Legal Notary (KYB + clause check), PREDGE (dispute evidence). Our edge must be: a COMPLETE legal workflow + CITED legal frameworks (FATF/Travel Rule, MiCA, UCC, specific statutes) + human-readable lawyer-filable output as first-class, with on-chain proof as the TRUST layer not the product.
4. **Under-served sub-areas in the field:** regulatory reporting automation (SAR / Travel Rule / MiCA filing), engagement-letter / contract-lifecycle enforcement, trust/escrow with real legal wrappers, discovery/evidence chain-of-custody for litigation. RWA-with-legal-wrapper track is nearly empty (no build squarely in RWA tokenization).

## Dami asset map
calldata decode · Permit2 · policy gates · audit trails · multi-chain relay (leash) → on-chain policy enforcement with a human-readable legal layer = prime LegalTech/RegTech territory.
