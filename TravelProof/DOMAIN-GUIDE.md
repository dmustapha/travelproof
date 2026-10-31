# DOMAIN-GUIDE - TravelProof

The shared domain reference for everyone building TravelProof. Sourced from `PRD.md` (Appendix E
glossary, Appendix F citation registry) and `research/TECHNICAL-SPIKE.md`. **Read this before
writing any citation string or resolver branch** - the legal authorities are load-bearing (40% of
the judging rubric) and get a citation wrong and the project loses its credibility.

---

## 1. Core concepts

| Term | Plain meaning | Source |
|------|---------------|--------|
| **VASP / CASP** | Virtual / Crypto-Asset Service Provider - a regulated exchange or custodian. VASP is the FATF term; CASP is the EU (MiCA/TFR) term for the same actor. | PRD §Intro |
| **Travel Rule** | FATF Recommendation 16 obligation to **transmit** verified originator + beneficiary identity alongside a transfer above a threshold, while protecting that PII. | PRD §Intro, Appendix E |
| **IVMS101** | InterVASP Messaging Standard 101.2023 - the canonical data model for the identity payload a VASP transmits. C2 assembles and validates this. | ARCHITECTURE §4 |
| **Confidential HTTP** | A Chainlink CRE primitive: an outbound HTTP call made **inside a TEE enclave** so the request/response (here, PII) never touches the public ledger. C3. | PRD §flow, ARCHITECTURE §7 |
| **DON consensus** | Decentralized Oracle Network consensus - multiple nodes independently compute a result and agree by Byzantine quorum before it is reported on-chain. C4 uses it to screen OFAC live. | ARCHITECTURE §8 |
| **KeystoneForwarder** | The Chainlink contract that delivers a DON-signed report to the receiver contract. The receiver guards `onReport` so only the forwarder can write. | ARCHITECTURE §9 |
| **commitmentHash** | A keccak256 commitment over the canonical IVMS payload + verdict. Stored on-chain **instead of** the PII, so the record is verifiable without revealing identity. | ARCHITECTURE §4 |
| **SDN** | OFAC's Specially Designated Nationals list - now carries digital-currency-address entries across ~20 chains. The live feed is `sanctionslistservice.ofac.treas.gov`. | PRD §Intro |
| **de-minimis** | The value threshold below which the rule may not apply. **FATF: USD/EUR 1,000. EU TFR: none for crypto CASP transfers (applies at any value).** | PRD Appendix F |
| **transmittal vs filing** | A VASP **transmits** identity to the counterparty VASP. It does **not** "file" it with a regulator. Using "file/filing" is a banned string (citation lint). | PRD Appendix F |
| **originator / beneficiary** | Originator = the sender's side (sending VASP + customer). Beneficiary = the recipient's side. The required-fields set differs per side (EU TFR Art.14(1) vs 14(2)). | ARCHITECTURE §3 |
| **applicability** | The resolver's first decision: does the Travel Rule apply to this transfer? Output is `applicable: true/false` + required-fields set + the governing citation. Deterministic, no AI. | ARCHITECTURE §3 |
| **attestation** | The on-chain record: a `jobId` → commitment hash + two verdicts (verify, screen), emitted as an `EnclaveAttestation` event on Base Sepolia. | ARCHITECTURE §9 |
| **Byzantine quorum** | The minimum number of honest DON nodes that must agree for a report to be trusted even if some nodes are faulty/malicious. | ARCHITECTURE §8 |

---

## 2. Legal citation rules (NON-NEGOTIABLE)

The frozen citation registry lives in `packages/core/src/citations.ts`. Cite **only** from it.

| Key | Authority | Exact citation string | Threshold |
|-----|-----------|-----------------------|-----------|
| `EU_TFR_ORIG` | EU Transfer of Funds Regulation (recast) | `Regulation (EU) 2023/1113, Article 14(1)(a)–(d)` | **No de-minimis** for crypto CASP transfers |
| `EU_TFR_BENE` | EU TFR | `Regulation (EU) 2023/1113, Article 14(2)(a)–(c)` | No de-minimis |
| `FATF_REC16` | FATF | `FATF Recommendation 16 (Travel Rule); FATF Updated Guidance … VAs and VASPs (Oct 2021) ¶¶177–184` | **USD/EUR 1,000** |
| `FINCEN_CTX` | FinCEN (US **context**, not crypto-specific) | `31 CFR §1010.410(f) (Travel Rule) / §1010.410(e) (Recordkeeping Rule); FinCEN Guidance FIN-2019-G001 (9 May 2019)` | $3,000 (transmittals) |

### Banned strings - `CITATION_LINT_FAIL` if any appear
1. Presenting **`§1010.410(f)` as a crypto-VASP-specific Travel Rule authority.** It is the
   bank/MSB rule; FinCEN has **no** crypto-specific Travel Rule. It may appear only under
   `FINCEN_CTX` as US *context*, never as the governing crypto authority.
2. The verb **"file / filing"** for a transmittal. A VASP **transmits**; it does not file.
3. Any **OFAC digital-currency-address count attributed to Treasury** - no official count exists.

### Governing-authority selection (resolver logic)
- Crypto transfer **between two CASPs** → `EU_TFR` applies **regardless of value** (no de-minimis).
- Value **≥ USD/EUR 1,000** → `FATF_REC16` de-minimis is also cleared.
- Below FATF threshold **and** non-CASP path → `applicable: false` with a **cited explanation**
  (not an error).
- Unknown CASP status → `NEEDS_HUMAN_REVIEW` (never a silent pass).

---

## 3. Hard rules (invariants the build must honour)
- The **resolver is deterministic** - statute-encoded truth table, **no AI on the decision path**.
- **No PII on-chain** - the contract has no PII-typed field; only commitment hash + verdicts.
- **Citations come from the frozen registry only** - never hand-typed in a component.
- **OFAC is screened live only** - no cached/stale sanctions pass; failure → `SCREEN_DEGRADED`,
  never a default pass (fail-closed).
- Verdicts **fail closed** - verify defaults to `DEGRADED`, screen `.withDefault("DEGRADED")`.

---

## 4. Source mapping
- Concepts & glossary → `PRD.md` Appendix E
- Citation registry (exact strings, thresholds, banned patterns) → `PRD.md` Appendix F
- CRE primitives (Confidential HTTP, DON consensus, forwarder) → `research/TECHNICAL-SPIKE.md`,
  `ARCHITECTURE.md` §7–§9
- Applicability truth table → `PRD.md` §resolver truth table, `ARCHITECTURE.md` §3
