# Warroom Deliberation Transcript — BLI Legal Tech Hackathon 2 (V1)

## generation_parallel — 5 fresh-context generators (35 raw ideas)

### G1 Pain (solve a quoted practitioner complaint) — 6 ideas
AlertKiller (AML false-positive disposition memo, F28+F30+F08x), NarrativeWitness (FinCEN SAR narrative w/ DON-attested facts, F37+F28+F11+F08x), SPVTitleProof (RWA SPV holder-of-record title opinion, F35+F28+F08x), IOLTAReconcile (trust-account 3-way reconciliation certificate, F11+F28+F08x), PriorSARMemory (on-chain disposition registry for AML institutional memory, F11+F30+F08x), EngagementGuard (engagement scope/conflict clearance memo, F17+F28+F08x).

### G2 Capability (only possible on CRE stack) — 7 ideas
SanctionSeal (signing-day DON-consensus OFAC/GLEIF/EU clearance certificate, F30+F11+F08x), ClearVault (Confidential-HTTP beneficial-owner KYB attestation, PII never on-chain, F30+F11), StillClean (CRE cron continuous engagement-letter sanctions warranty, F11+F28+F08x), TitleProof (DON-consensus registry read proving SPV holds title → title opinion exhibit, F35+F11+F08x), TravelProof (Confidential HTTP + DON-consensus Travel Rule memo, F30+F28+F11), EscrowTrust (Confidential-HTTP IOLTA 3-way recon certificate + cron, F30+F11+F37), vLEI Seal (DON-consensus GLEIF vLEI signatory-authority certificate, F30+F11+F08x).

### G3 Whitespace/Inversion — 7 ideas
TravelRail16 (deterministic FATF Rec.16 resolver + IVMS101 filable packet, F37+F08x+F30), ControlLedger (UCC Art.12 §12-105 control-test resolver → control opinion memo + wrapper token, F37+F35+F08x), SARScribe (31 CFR §1020.320 SAR-trigger resolver + Part V drafter, F37+F08x+F11), TrustRecon (ABA Rule 1.15 three-way reconciliation certificate, mirrors HakiChain, F37+F11+F08x), CASPFiler (MiCA Title V CASP obligation register, F37+F08x+F11), vLEI-Attest (Confidential-HTTP vLEI authority-to-bind certificate, inverts LexProof, F30+F37+F08x), EngageLock (ABA Rule 1.5/1.7 engagement + 2-partner guardian co-sign clearance, F17+F37+F08x).

### G4 Judge (build what judges asked for; cited frameworks + filable) — 8 ideas
Travel-Rule Attestation Memo (FATF Rec.16 / FinCEN §1010.410(f), F30+F08x+F28), SAR Pre-Filing Evidentiary Package (31 CFR 1020.320 + retention proof, F37+F11+F08x), Engagement-Letter Scope&Conflict Attestation (ABA 1.5/1.7, F30+F08x+F17), RWA SPV Subscription&Transfer-Restriction Certificate (UCC Art.12 + Reg D §506, F35+F28+F08x), Three-Way Escrow Reconciliation&Release Certificate (IOLTA/ABA 1.15, the HakiChain shape, F17+F11+F08x), MiCA White-Paper Notification&Disclosure-Integrity Certificate (MiCA Art.6-9, F08x+F11+F30), vLEI-Bound Corporate Signing Authority Certificate (GLEIF vLEI/ISO 17442, F30+F11+F17), Litigation Evidence Chain-of-Custody Affidavit (FRE 901/902(13)-(14), F11+F30+F08x).

### G5 Clean-room (unprimed outsider, IDEA-LAWS only) — 7 ideas
EscrowDON (escrow release on DON-proven condition + release certificate, real funds move), RepLedger (M&A reps&warranties verification schedule, recurring DON verify), CleanPass (Confidential-HTTP clean-screening certificate, zero PII leakage — only exists because of enclave), NoticeDON (contractual-deadline sentinel w/ DON-attested trigger timestamp → served notice), ChainOfTitle (IP/receivables assignment register reconciled against USPTO/UCC via DON), FileOnFact (regulatory-trigger filing — obligation-arose timestamp + pre-drafted filing), TwoKeyDON (dual-control authorization ledger for trust-fund release).


## synthesis + pool_gates

**Dedupe → 11 clusters + 2 hybrids.** Convergence validated intel D1-D5: RWA-title (5 generators), IOLTA-recon (4), Travel-Rule (4), SAR (3), Confidential-KYB/vLEI (5).
Hybrids: TitleVault = ControlLedger × CleanPass (RWA SPV title + in-enclave investor accreditation); TrustGuard = TrustRecon × EscrowDON (reconciliation IS the disbursement precondition).
Late entrants: [SEED] HakiChain (BLI H1 winner — lawyer/client escrow + on-chain doc anchor) validates TrustRecon/TrustGuard. [HISTORY] CRE Compliance Gate + falsifiable-alpha = EXCLUSIONS (kill-list).

**Gate 1 kills:** SanctionSeal — C3 uniqueness (head-on vs ClearRelease, strongest field competitor; subsumed by CleanPass which adds the enclave differentiator).
**Gate 1b kills:** CASPFiler — not_ecosystem_native #2 (MiCA CASP classification is pure deterministic rules needing no DON-verified external data; CRE reduces to a timestamp badge, not pivotal).
**Gate 3 scores (/25, floor 12):** ControlLedger 23, CleanPass 23, TitleVault 23, TrustRecon 22, TrustGuard 22, TravelProof 21, vLEI-Authority 20, EscrowDON 20, ChainCustody 20, NarrativeWitness 19, EngageLock 17. All above floor.
**Gate 4 brief-utilization:** ~2/14 levers unmapped (MiCA [CASPFiler killed], RYO-CHAN agent bounty [intentional — saturated cluster]) = 14% < 40%. PASS.
**Gate 5 anti-attractor:** 0 house-shaped ideas (all document-producing legal workflows). PASS.
**Gate 6 spike selection + diversity:** top-3 total {ControlLedger, CleanPass, TitleVault} + Novel/Memorable spikes {TrustRecon, TravelProof} + SAR-whitespace coverage {NarrativeWitness}.
**Gate 7 ceiling:** multiple Novel-5 present. PASS. **Gate 8 rescue:** none needed.

**Presented pool (6):** ControlLedger, TrustRecon, TravelProof, CleanPass, NarrativeWitness, TitleVault.

## round_0 — 4 independent scorers (merged)
Weighted ranking: TravelProof 7.54 | TrustRecon 7.48 | NarrativeWitness 7.38 | TitleVault 6.73 | CleanPass 6.65 | ControlLedger 6.53.
High-divergence: ControlLedger 2.85 (JUROR 7.85 demo vs COUNSEL 5.0 legal). See warroom/round-scorecard.md.

## demo_scripts (3-min, condensed — full beats in ideas.md "3-min demo shape")
- TravelProof [STRONG]: enter $1,200 cross-VASP → "Rec.16 applies" branch → enclave verifies counterparty (operators-see-nothing panel) + DON OFAC check → "CLEARED, PII withheld", ledger shows only hash → failure case "DO NOT TRANSMIT". WOW: contradictory requirement (verify-but-hide) solved live. U7 clean (real resolver + real enclave call).
- TrustRecon [STRONG]: month-end close → DON reads on-chain trust balance → $500 discrepancy flashes RED → partner fixes → three-way tie GREEN → DON co-signs Rule 1.15 certificate → auditor resolves chain figure. WOW: "disbarment-grade error caught in 15 seconds". U7 clean (real reconciliation math + real chain read).
- NarrativeWitness [STRONG]: enter 4 tx facts → DON-attests each → capped LLM drafts Part V → completeness gate shows "why it matters" missing in RED → add → GREEN → file with clickable per-claim provenance footnotes. WOW: every sentence of a legal filing cryptographically backed. U7 clean (facts attested, human signs).
- TitleVault [THIN-ship]: investor subscribes → DON proves SPV title → enclave checks accreditation + Reg D cap → "PERMITTED"; non-accredited → "TRANSFER RESTRICTED". Risk: 2 hard integrations; title-proof legal flaw.
- CleanPass [THIN-stage]: enter client → enclave screens → ledger shows ZERO PII → "SCREENED CLEAN Tier LOW". JUROR: proves a negative, visually dead.
- ControlLedger [THIN-legal]: asset A → DON "SPV holds title"; asset B → RED "TITLE MISMATCH — DO NOT TOKENIZE". Demo gold; COUNSEL flags title-proof theory.

## Gate-1b — per-idea pivotal-tech verdict (DFT-204)
Each presented idea's one-sentence ecosystem-native / pivotal-CRE verdict:
- **TravelProof** — Gate-1b PASS: pivotal — dual CRE primitive (Confidential HTTP verify-but-hide + DON OFAC consensus) is load-bearing; remove it and identity verification goes exposed (illegal) or self-asserted (rejected).
- **TrustRecon** — Gate-1b BORDERLINE→PASS: pivotal only with the guardian-release leg; the DON on-chain-balance read is the third reconciliation leg but is light without disbursement enforcement.
- **ControlLedger** — Gate-1b PASS on pivotal (multi-registry DON consensus proves holder-of-record) but legal-substance flagged by COUNSEL (UCC-1 ≠ title); ecosystem-native yes, legal theory shaky.
- **CleanPass** — Gate-1b PASS: pivotal — CRE Confidential HTTP enclave is the only EVM-chain way to screen PII without exposing it; remove it and the product is illegal.
- **NarrativeWitness** — Gate-1b PASS (weaker): pivotal for provenance (DON attests each SAR fact) but the CRE layer is an evidence-footer, not the whole ecosystem-native spine.
- **TitleVault** — Gate-1b PASS: pivotal — both CRE primitives load-bearing (title proof via DON + accreditation via Confidential HTTP); inherits ControlLedger's title-theory risk.

## Gate-1 — per-idea concern answers (DFT-205)
[C] concern checks (C3 uniqueness / C5 real humans / C9 significant+conviction / C13 day-1 users) per idea:
- **TravelProof** — concern C3: 0 same-niche builds (0 Travel-Rule filings); C5: VASP compliance officers + crypto-exchange counsel; C9: EU-TFR/FATF obligation, built-without-prize yes; C13: exchanges under live EU TFR today. PASS.
- **TrustRecon** — concern C3: 0 IOLTA-recon builds; C5: law-firm managing partners/bookkeepers; C9: disbarment-grade bar duty; C13: every firm holding client funds now. PASS.
- **ControlLedger** — concern C3: 0 RWA-legal-wrapper builds; C5: tokenization counsel; C9: asset-confusion catastrophe; C13: RWA issuers now. PASS (legal-substance caveat noted).
- **CleanPass** — concern C3: sanctions-screening occupied (ClearRelease) but enclave-privacy niche empty; C5: compliance officers + deal counsel; C9: GDPR/privilege real; C13: cross-border deal counsel now. PASS (clone-risk flagged).
- **NarrativeWitness** — concern C3: 0 SAR-narrative builds; C5: BSA/AML officers; C9: FinCEN #1 deficiency; C13: every bank files SARs now. PASS.
- **TitleVault** — concern C3: 0 RWA+privacy builds; C5: SPV/fund counsel; C9: asset-confusion + Reg D; C13: RWA issuers now. PASS (ship-risk flagged).
