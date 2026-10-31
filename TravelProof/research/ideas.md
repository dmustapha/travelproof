# BLI Legal Tech Hackathon 2 — Ideas
## Selected: [AWAITING WARROOM DELIBERATION]

## Pool Stats
- Raw generated: 35 (G1:6 G2:7 G3:7 G4:8 G5:7)
- Hybrids: 2 (TitleVault, TrustGuard) | Late entrants: [SEED] 1 (HakiChain), [HISTORY] 0 (2 exclusions)
- Killed — kill list: 1 (SanctionSeal, C3) | ecosystem-native: 1 (CASPFiler, Gate-1b #2) | demo test: 0 | score floor: 0 | anti-attractor: 0
- Brief levers: 12/14 mapped | Regeneration rounds: 0 | Rescued: 0
- Presented: 6
- injection: lint pass, quota 2/1/1/7

## Presented Pool

### #1: ControlLedger — RWA SPV title-of-record proof (blue-ocean) [maps D3]
**Score:** 23/25 — Ship 4 | Demo 5 | Sponsor 4 | Novel 5 | Memorable 5
**Mechanism:** A tokenization counsel enters asset + SPV + custody. CRE HTTP/EVM-Read does a DON-consensus read of multiple authoritative off-chain registries (custody-account statement API, UCC-1 secretary-of-state filing, corporate registry) and co-signs a TITLE ATTESTATION {assetId, holderOfRecord: SPV_LEI, UCC1_fileNo, matchesSPV}. A deterministic resolver walks the UCC Art.12 §12-105 control test. Token mint is valid only if DON confirms SPV == holder-of-record. Output: a filable **title opinion memo** citing the UCC-1 number + Art.12 §§, DON proof as the verifiable footer.
**Why this chain (U6):** asset confusion is catastrophic precisely because "the SPV holds it" is self-asserted by the originator. DON reading multiple independent registries and co-signing turns "the sponsor says so" into "N independent sources, multi-party-signed, agree the SPV is holder of record." A single oracle reproduces the single-point-of-trust the problem IS.
**3-min demo shape:** counsel selects an asset → DON reads custody + UCC-1 APIs, co-signs matchesSPV:true → then a SECOND asset returns FALSE (originator still holder — the catastrophic case, CAUGHT) → "TITLE MISMATCH — DO NOT TOKENIZE" → title memo with UCC-1 citation + on-chain footer → file.
**Primitive(s) adapted:** F35 (asset-in-wrapper rails → multi-registry title-of-record check) + F37 (Art.12 control resolver) + F08x (title opinion IS the product).
**Law-check:** primitive-is-product; name-collision (RWA legal-wrapper = 0 builds, empty track); economic-consequence (asset confusion = total holder loss). Clears self-dup (proves title, gates no tx).
**Origin:** merge G1×G2×G3×G4×G5 (5-generator convergence)

### #2: TrustRecon — IOLTA three-way trust-account reconciliation (HakiChain shape) [maps D4]
**Score:** 22/25 — Ship 5 | Demo 4 | Sponsor 4 | Novel 4 | Memorable 5
**Mechanism:** A firm's trust ledger (book), the bank/on-chain balance, and per-client sub-ledgers must reconcile three ways (ABA Model Rule 1.15 / IOLTA). CRE EVM-Read does a DON-consensus read of the actual on-chain trust-wallet balance; CRE HTTP reads the practice-management trust ledger + client sub-ledgers. A deterministic reconciler computes sum(client ledgers) == book == on-chain, detects commingling / negative-client-balance. DON co-signs a RECONCILIATION CERTIFICATE. CRE cron Trigger runs it monthly (bar cadence). Output: a **bar-compliant three-way reconciliation report + Rule 1.15 certificate**.
**Why this chain (U6):** bar rules require the reconciliation be performed AND preserved as tamper-evident evidence; commingling/shortfall is a disbarment offense. DON co-signing the on-chain balance at period-close makes the chain leg independently witnessed — a bar auditor trusts the figure was X on date Y without trusting the firm's own screenshot. **The on-chain ledger IS the third reconciliation leg** (load-bearing, not a badge).
**3-min demo shape:** managing partner runs month-end close → DON reads on-chain trust wallet → reconciler shows a $500 discrepancy (client sub-ledger stale) in RED → partner fixes → three-way tie goes GREEN → DON co-signs certificate → files the bar report → auditor-view resolves the chain figure.
**Primitive(s) adapted:** F11 (tamper-evident registry → reconciliation certificate) + F37 (deterministic reconciler) + F08x.
**Law-check:** primitive-is-product; name-collision (0 IOLTA-crypto-recon builds); economic-consequence (shortfall = disbarment). Mirrors HakiChain (what BLI H1 judges rewarded).
**Origin:** merge G1×G2×G3×G4

### #3: TravelProof — FATF Travel Rule filable record (dual-CRE, bounty-perfect) [maps D1]
**Score:** 21/25 — Ship 4 | Demo 4 | Sponsor 5 | Novel 4 | Memorable 4
**Mechanism:** A VASP compliance officer enters an originator/beneficiary pair + transfer. A deterministic resolver classifies against FATF Rec.16 thresholds (the $1K/$3K/€0 patchwork, cross-VASP vs unhosted-wallet branch) and assembles the IVMS101-structured message. CRE Confidential HTTP verifies the counterparty VASP registration + originator identity INSIDE the enclave (PII never on public ledger); CRE HTTP DON-consensus confirms the VASP isn't sanctioned (OFAC SDN incl. crypto addresses). DON co-signs. Output: a **filable Travel Rule record / IVMS101 packet + officer memo** citing FATF Rec.16 §para + local transposition.
**Why this chain (U6):** the Travel Rule has contradictory requirements — verify the person, but minimize/protect PII. ONLY the enclave verifies identity without leaking it; ONLY DON-consensus makes "counterparty is legit" defensible to a regulator. Strip either → leak PII (illegal) or produce an unverifiable memo (useless). **Both CRE primitives jointly load-bearing** — perfect for the $2K CRE bounty.
**3-min demo shape:** officer enters a $1,200 cross-VASP transfer → resolver branches to "Rec.16 applies, IVMS101 required" → enclave verifies originator (operators-see-nothing panel) while DON-consensus checks the VASP → "CLEARED, PII withheld" → on-chain shows only the hash → download Travel Rule record. Failure case: unregistered VASP → "DO NOT TRANSMIT."
**Primitive(s) adapted:** F30 (enclave verification) + F37 (Rec.16 resolver + IVMS101 drafter) + F28 (reframed as reporting-not-gating) + F08x.
**Law-check:** primitive-is-product; name-collision (0 Travel-Rule filing builds); economic-consequence (Travel-Rule failure = VASP license risk). Clears self-dup (produces a filing, gates no tx).
**Origin:** merge G2×G3×G4

### #4: CleanPass — Confidential-HTTP clean-screening certificate (the ignored differentiator) [maps D5]
**Score:** 23/25 — Ship 4 | Demo 5 | Sponsor 5 | Novel 5 | Memorable 4
**Mechanism:** A compliance officer must prove to a counterparty's counsel that a client passed sanctions/PEP/adverse-media + beneficial-owner KYB screening — without exposing the client's PII or the vendor's raw report. CRE Confidential HTTP calls the screening provider's API INSIDE the enclave with a secret-injected key; raw PII + full report never leave the enclave or touch the ledger. DON reaches consensus only on the derived {boolean, risk tier, vendor, timestamp} and EVM-Writes that minimal attestation. Output: a shareable **"clean screening" certificate** (GDPR Art.5 data-minimisation by construction) carrying nothing sensitive.
**Why this chain (U6):** this idea ONLY exists because of Confidential HTTP. Ordinary oracles splash the client's identity + screening payload across every node and onto a public ledger — a GDPR/privilege catastrophe. The enclave lets the sensitive call happen privately while the DON still multi-party-attests the RESULT. A proof-of-diligence with zero data leakage — the exact thing a compliance officer cannot produce today without emailing a PDF someone must trust.
**3-min demo shape:** enter a client → screening runs in enclave (show PII never appears in node logs / on-chain) → certificate renders "SCREENED CLEAN vs OFAC SDN + PEP, Tier LOW, 14:02 UTC" → judges SEE the ledger has NO PII → download certificate.
**Primitive(s) adapted:** F30 (enclave-attested verification) + F11 (verdict registry) + F08x.
**Law-check:** primitive-is-product (Confidential HTTP irreplaceable — remove it and you've leaked PII, no product); weight-inversion (certificate is lawyer-facing, chain is quiet). Exploits the 0-build differentiator; perfect for the $2K CRE bounty.
**Origin:** merge G2×G5 (+ AlertKiller partial)

### #5: NarrativeWitness — FinCEN SAR narrative with DON-attested facts (blue-ocean regtech) [maps D2]
**Score:** 19/25 — Ship 4 | Demo 4 | Sponsor 3 | Novel 4 | Memorable 4
**Mechanism:** Dissolves the #1 FinCEN quality deficiency ("vague narratives"). An investigator enters structured transaction facts; a deterministic resolver maps them to the SAR trigger (31 CFR §1020.320) + the 5 required narrative elements. Each factual assertion is bound to a DON-signed data commitment (CRE HTTP pulls the ledger records, DON consensus). A completeness gate blocks filing until every required element has a backing attestation. A capped LLM drafts the Part V prose over attested facts (human reviews + signs). Output: a **FinCEN-ready SAR narrative** where every factual claim carries a DON-co-signed provenance footnote.
**Why this chain (U6):** FinCEN's complaint is narratives that assert without substantiation. DON co-signature makes each factual claim independently verifiable against source data at signing time — an examiner/court confirms "$9,500 ×3" was real, not a drafter's paraphrase. (Sponsor score lower: CRE is the evidence footer, not the whole spine.)
**3-min demo shape:** investigator enters 4 transaction facts → CRE-attests each via DON → LLM drafts narrative naming pattern+nexus+subject → completeness gate shows 1 missing element ("why it matters") in RED → investigator adds it → GREEN → file with per-claim provenance footnotes → examiner-view resolves one footnote against the chain.
**Primitive(s) adapted:** F37 (deterministic completeness resolver, LLM capped as prose-only) + F28 (fact→DON commitment) + F11 + F08x.
**Law-check:** primitive-is-product; weight-inversion (deterministic FinCEN rules + DON attestation are the spine, LLM is capped — C-NA1 honored); economic-consequence (vague SAR = examiner finding + fine).
**Origin:** merge G1×G3×G4

### #6: TitleVault — RWA SPV title + in-enclave investor accreditation (HYBRID) [maps D3×D5]
**Score:** 23/25 — Ship 3 | Demo 5 | Sponsor 5 | Novel 5 | Memorable 5
**Mechanism:** ControlLedger × CleanPass. On each primary subscription / secondary transfer of an SPV-wrapped RWA token: CRE HTTP/DON proves the SPV is holder-of-record (UCC Art.12 title), AND CRE Confidential HTTP checks investor accreditation + the Reg D §506 investor cap INSIDE the enclave (investor PII never on-chain). DON attests both. Output: a **Subscription Agreement + Transfer-Restriction Certificate** citing UCC Art.12 + Reg D §506, filed in the cap table.
**Why this chain (U6):** combines the blue-ocean RWA legal wrapper with the ignored Confidential-HTTP differentiator — title proof needs multi-registry DON consensus; accreditation needs the enclave (investor PII legally cannot hit a public chain). Both CRE primitives load-bearing.
**3-min demo shape:** investor subscribes → DON proves SPV holds title (Art.12) → enclave checks accreditation + §506 cap (PII panel shows operators see nothing) → "PERMITTED" certificate → cap table updates → a non-accredited investor → "TRANSFER RESTRICTED."
**Primitive(s) adapted:** F35 + F30 + F28 + F08x (hybrid inherits from #1 + #4).
**Law-check:** primitive-is-product; name-collision (RWA + privacy = 0 builds); economic-consequence (asset confusion + Reg D violation). Ship 3 = two hard integrations in ~2.5 days (the risk).
**Origin:** hybrid(ControlLedger × CleanPass)

## Brief-Utilization Map
| Lever | Idea(s) |
|-------|---------|
| CRE Confidential HTTP (enclave) | CleanPass, TravelProof, TitleVault |
| CRE HTTP DON-consensus | ControlLedger, TravelProof, NarrativeWitness |
| CRE EVM Write (attestation) | ALL |
| CRE Triggers (cron) | TrustRecon |
| FATF Rec.16 / IVMS101 | TravelProof |
| FinCEN SAR 31 CFR §1020.320 | NarrativeWitness |
| UCC Art.12 §12-105 | ControlLedger, TitleVault |
| IOLTA / ABA Rule 1.15 | TrustRecon |
| GLEIF LEI / vLEI | (vLEI-Authority, below floor) |
| OFAC SDN (crypto addresses) | TravelProof, CleanPass |
| HakiChain precedent (H1 winner) | TrustRecon |
| RWA empty track | ControlLedger, TitleVault |
| MiCA CASP | no idea — CASPFiler killed (Gate-1b, CRE not pivotal) |
| RYO-CHAN agent bounty $6K | no idea — intentional (saturated trading-agent cluster) |

## Killed Ideas
| Idea | Origin | Gate | Cause |
|------|--------|------|-------|
| SanctionSeal | G2 | Gate 1 | critical_concern_C3 (head-on vs ClearRelease; subsumed by CleanPass) |
| CASPFiler | G3 | Gate 1b | not_ecosystem_native (#2 — MiCA classification pure-deterministic, CRE not pivotal) |
| vLEI-Authority | merge | Gate 6 | not spike-selected (20/25, no spike dimension; folded as sub-feature of TitleVault/CleanPass) |
| EscrowDON / TrustGuard | G5/hybrid | Gate 6 | not spike-selected (escrow-release; TrustRecon carries the IOLTA bet) |
| ChainCustody (FRE 902) | G4 | Gate 6 | not spike-selected (20/25; strong wildcard, held as rescue) |
| EngageLock | G1×G3×G4 | Gate 6 | lowest score 17/25 (CRE weakest — conflict check is internal) |
