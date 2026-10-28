# Strategy Density & Whitespace Map
Source material: intel/dorahacks-recon.md (16-build cluster analysis, logged-in capture 2026-10-28) + research/research-brief.md

## Theme-Crowding Table

| Cluster | Entrant count | Builds | Maturity note |
|---------|--------------|--------|---------------|
| AI trading-agent + auditable verdict | ~5 | Bull v. Bear, Debate Desk, Verdict Desk, Warrant, SignalLedger | SATURATED — bull/bear-debate-judge pattern is a 3-way near-duplicate; all crypto-judge-facing, not lawyer-facing [dorahacks-recon.md §Cluster A] |
| Agent spending-limits / bounded authority | ~3 | Foreman, PocketChange, Warrant | Moderate density; Arc-native; still crypto-operations-facing, not legal-practice-facing [dorahacks-recon.md §Cluster B] |
| x402-paid CRE workflow | ~3 | x402-Paid CRE Workflows, Legal Notary, ArcBooks Auto-Attest | Low-to-medium maturity; Legal Notary is closest to real legal workflow (GLEIF counterparty check, clause jurisdiction check) but uses x402 as the primary differentiator, not legal-framework depth [dorahacks-recon.md §Cluster C] |
| Compliance / sanctions screening | ~3 | ClearRelease, ZK-CID, Legal Notary (KYB) | ClearRelease is the strongest "real legal workflow" competitor — sanctions-screen at signing/payment/continuously, fails closed, on-chain auditable evidence [dorahacks-recon.md §Cluster D] |
| Evidence / notarization / naming | ~4 (outliers) | PREDGE, LexProof, ArcShield, BlockDNS | Mixed maturity; LexProof (contract review → Legal Passport) and PREDGE (dispute evidence pack) are genuine legal competitors; ArcShield and BlockDNS are technical, not lawyer-facing [dorahacks-recon.md §Cluster E] |

Total: 16 builds across 5 clusters. ~7 of 16 use Chainlink CRE (contested bounty).

## Whitespace — Themes with Few or No Strong Entrants

| Sub-area | Builds present | Gap assessment |
|----------|---------------|----------------|
| RWA tokenization with legal wrapper (SPV, UCC Art.12, title transfer) | 0 | Empty — the RWA track has zero builds squarely in tokenization with cited legal structure [dorahacks-recon.md §Strategic gaps #4] |
| Regulatory reporting automation (SAR narrative / FinCEN, FATF Travel Rule compliance filing, MiCA CASP obligation reporting) | 0 | Empty — no build targets the regulatory-filing workflow that compliance officers actually run [dorahacks-recon.md §Strategic gaps #4; research-brief.md §Regulatory frameworks] |
| Legal trust / escrow three-way reconciliation (IOLTA-style client trust account, engagement-letter-enforced disbursement, three-party attorney-client-counterparty) | 0 | Empty — trust accounting with on-chain enforcement and lawyer-readable audit is unoccupied [dorahacks-recon.md §Strategic gaps #4] |
| CRE Confidential HTTP (enclave) for privacy-preserving KYC / GDPR data-minimisation | 0 strong builds | CRE Confidential HTTP is a listed capability but no build exploits it for privacy-preserving legal PII handling [intel-state.json capability_map; dorahacks-recon.md §Cluster C] |
| Engagement-letter / contract-lifecycle enforcement (milestone gates, breach detection, automated notice) | 0 | Not present in any of the 16 builds |

## "Make Lawyers Nod" Bar is Largely Unmet

The dominant pattern across the 16 builds is: AI agent does X → hash it on-chain. This is crypto-judge-facing output — it proves integrity to a blockchain auditor, not to a practicing lawyer or compliance officer. Very few builds produce human-readable, lawyer-fileable output as a first-class artifact with cited legal frameworks (FATF Travel Rule, MiCA, UCC Art.12, FinCEN SAR standards).

**The wedge:** a complete legal workflow with cited statutory frameworks + human-readable lawyer-facing output as the PRIMARY deliverable, with on-chain proof as the TRUST layer not the product. ClearRelease and LexProof are the closest competitors; neither cites specific regulatory frameworks in their current build descriptions [dorahacks-recon.md §Strategic gaps #1, #3].
