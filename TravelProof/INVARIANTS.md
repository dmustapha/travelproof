# INVARIANTS — Build-Agent Law (TravelProof)
> The build agent reads this as non-negotiable law. Violating any NON-NEGOTIABLE fails the hackathon gate.

## NON-NEGOTIABLES
1. **PII never touches the public ledger.** — Test: inspect every `SSTORE`/event field in `TravelRuleAttestation`; the only on-chain fields are `bytes32 commitmentHash`, `uint8 verifyVerdict`, `uint8 screenVerdict`, `uint64 ts`, `bytes32 jobId`. — Judge-attack: "show me there's no name or address written on-chain" → Defense: the contract has **no string/bytes PII field at all** — the type system makes a PII write *unrepresentable*; the ledger-has-no-PII panel (C10) reads the raw storage back to prove it. (**HEADLINE invariant — enforced STRUCTURALLY**: there is no field to put PII in.)
2. **The OFAC screen hits the LIVE SDN feed — never a cached stub.** — Test: the screen fetches `sanctionslistservice.ofac.treas.gov/.../SDN.XML` at run time and the response `<Publish_Date>` is surfaced in the verdict; a startup self-check asserts the demo HIT address (`3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1`, Garantex) is present in the freshly-fetched index. — Judge-attack: "is this a hard-coded list?" → Defense: fail-closed — if the feed is unreachable the verdict is `DEGRADED` (loud), never `CLEAR`; the code path returns the token `SCREEN_DEGRADED`, there is no cached fallback list in the repo.
3. **The deterministic resolver decides legal applicability; no AI on the decision path.** — Test: `classify()` is a pure function with no network/LLM import; grep the decision module for any model/LLM call → zero. — Judge-attack: "did an AI decide this transfer is covered?" → Defense: applicability returns a statute citation from a frozen registry; any LLM output (memo prose only) is labeled draft-assist and never sets `applicable`. On an un-encodable case the resolver returns `NEEDS_HUMAN_REVIEW`, never a guess.
4. **The output is a lawyer-filable record citing the CORRECT binding rule — never a bare hash.** — Test: the rendered memo contains an IVMS 101.2023 record + a citation string from the registry (EU TFR Art.14 / FATF Rec.16 / FinCEN FIN-2019-G001); it must NOT contain the string `1010.410(f)` presented as the crypto-VASP authority, and must use "transmittal"/"transmit", never "file"/"filing". — Judge-attack: a skeptical senior lawyer reads the memo → Defense: every citation is verb-correct and authority-correct; the wrong-authority string is caught by a build lint returning `CITATION_LINT_FAIL`.
5. **The on-chain attestation claims only what is true — no fabricated TEE remote-attestation.** — Test: `commitmentHash` is defined as `keccak256(canonical verified-claims payload)` computed in the workflow and carried in the DON-signed report; no code or copy claims a hardware TEE quote or an `enclaveHash` measurement. — Judge-attack: "prove the enclave attestation is a real TEE quote" → Defense: we claim exactly "verification ran via CRE Confidential HTTP; only this commitment + verdict reached chain, signed by the DON" — the integrity anchor is the **DON ECDSA signature**, stated as such; over-claim copy is caught by review and returns `OVERCLAIM_LINT_FAIL`.

### MUST NOT CLAIM
- MUST NOT claim a hardware TEE remote-attestation quote / verifiable enclave measurement (`enclaveHash`) — cre-sdk exposes none (spike NOT FOUND).
- MUST NOT claim the beneficiary VASP *received* the message (two-VASP handshake is out of scope — "step 1 of 2; TRISA production path").
- MUST NOT present 31 CFR §1010.410(f) as a crypto-VASP-specific Travel Rule authority.
- MUST NOT claim the enclave verify (C3) ran live tonight — it is production-path, beta-pending (CHANGE-ORDER-1); never simulate or fabricate it. The live headline is the OFAC-DON-attested filable record.

## VERIFY-BEFORE-CLAIMING
Every headline number/address/hash in README/demo/submission must be RECOMPUTABLE from a committed source. The attestation address + tx hashes come from the real deploy + seed run (`submission/proof.md`); the OFAC `<Publish_Date>` is captured live; the commitment hash is recomputable by `scripts/verify-claims.ts` from the committed canonical payload. No unbacked figure ships.

## RESOLVED DECISIONS
| # | Question | Options considered | Chosen | Why not the others | Status |
|---|---|---|---|---|---|
| D-1 | Legal authority to cite for crypto VASPs | US §1010.410(f) / EU TFR Art.14 / FATF Rec.16 | **EU TFR Art.14 + FATF Rec.16, FinCEN as context** | §1010.410(f) is bank/MSB "transmittal of funds", not crypto-VASP-specific — the field's classic misread | RESOLVED |
| D-2 | How to prove enclave privacy on-chain | real TEE quote / computed commitment in DON report / green checkmark | **computed commitmentHash in DON-signed report + ledger-has-no-PII panel** | no TEE-quote API exists (spike); a checkmark is not proof | RESOLVED |
| D-3 | OFAC screen data source | cached snapshot / live feed each run | **live feed each run + startup self-check** | a cached list can silently false-negative (Tornado Cash delisting proves it) | RESOLVED |
| D-4 | DON aggregation for the screen verdict | median / identical / by-fields | **consensusIdenticalAggregation** | a sanctions pass/fail must be Byzantine-exact agreement, not a median | RESOLVED |
| D-5 | CRE run model | simulate / real managed-DON | **REAL managed-DON (C4 OFAC + C7 attestation); C3 Confidential-HTTP = production-path, beta-pending, NOT in live demo** | Dami ruling 'no simulations'; ghostfund-v2 proves the real path; C3 beta is Chainlink-granted (CHANGE-ORDER-1, ADR-005) | RESOLVED (amended CO-1) |
| D-6 | VASP registry source | pure mock / TRISA sandbox / mock+disclosed-path | **mock + disclosed TRISA production path** | an undisclosed mock collapses under one Q&A question | RESOLVED |
| D-7 | Demo HIT address | Tornado Cash / Garantex | **Garantex `3Lpoy…kh1` (CYBER4, active 2025-08-14)** | Tornado Cash was delisted 2025-03-21 → would false-negative live | RESOLVED |

## SOURCE LOCK
| External identifier | Version / pin | Verify command | Expected output | Status |
|---|---|---|---|---|
| @chainlink/cre-sdk | 1.23.0 | `npm view @chainlink/cre-sdk@1.23.0 version` | `1.23.0` | [VERIFIED-in-forge] |
| Base Sepolia chainId | 84532 / `0x14a34` | `cast chain-id --rpc-url https://sepolia.base.org` | `84532` | [VERIFIED-in-forge] |
| Base Sepolia CRE selector | 10344971235874465080 / `ethereum-testnet-sepolia-base-1` | docs.chain.link/crec/supported-networks | listed | [VERIFIED-in-forge] |
| OFAC SDN live feed | sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML | `curl -sIL <url>` | HTTP 200 text/xml | [VERIFIED-in-forge] |
| Demo HIT address (Garantex XBT) | `3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1` | present in fresh SDN index at startup | self-check passes | [UNVERIFIED-build-gate] (re-verify day-of) |
| KeystoneForwarder (Base Sepolia) | from CRE docs | docs.chain.link/cre | address recorded at wire | [UNVERIFIED-build-gate] |

## A-G4 SURVIVORS (folded from the distinct-model per-doc critical review, 2026-10-30)
These surviving findings are now standing build law (each was a real defect caught + fixed in the blueprint; the build must not reintroduce it):
1. run-cre.sh must never emit a constant verdict; api/run rejects any non-enum verdict
2. verify.workflow commitment and commitment.ts must share COMMITMENT_KEYS order (round-trip)
3. attestation verdict legs are write-once; a second report for a jobId leg reverts (no flip)
4. TravelRuleAttestation forwarder must be non-zero; always enforce msg.sender==forwarder
5. OFAC parse fails closed on an empty/namespace-broken index (never a false CLEAR)
6. cite FinCEN FIN-2019-G001 without a decimal subsection (no fabricated section)

## ESCALATE, DON'T FABRICATE
On any gate/task failure: stop, record BLOCKED with the failing gate name, and NEVER substitute a mock, cached SDN snapshot, stored-success response, or fabricated attestation. Triage when over budget: cut the two-VASP framing polish, then the memo PDF styling; NEVER cut a P0 (live OFAC screen, no-PII-on-chain, correct citations) or a security invariant. Escalate after 2 failures on the same gate. Confidential-Workflows beta access, if gated, is `[HUMAN_REVIEW_REQUIRED]` documentation + the simulate path — never a blocking build gate.

## CHANGE-ORDER-1 invariants (2026-10-31)
6. **The enclave verify is NOT claimed to run live tonight.** — Test: no copy/demo/README says the Confidential-HTTP verify "ran" live; it is labeled "CRE Confidential Workflows — beta access pending (production privacy path)". — Judge-attack: "show the enclave run" → Defense: we show the real workflow code + the on-chain attestation that holds no PII (live), and state the enclave run awaits Chainlink beta access — never simulated, never fabricated. The LIVE headline is the OFAC-DON-attested filable record.
7. **TRISA directory lookup is real or disclosed-synthetic — never a silent claim.** — Test: C6 `/verify` returns `source: "TRISA_TESTNET_DIRECTORY"` on a real hit; a dead lookup fails closed to `source: "SYNTHETIC_FALLBACK"` (disclosed), never a silent "registered". The originator attribute-match is always disclosed synthetic (mTLS handshake = production path).
8. **The evidence log + memo tell the truth.** — The `/ledger` rows come only from real on-chain `EnclaveAttestation` events; the memo's `publishDate` is the live OFAC feed date, not a constant.
