# Technical Spike — TravelProof

Phase 0B. Three parallel research subagents + three direct live probes. All load-bearing external facts carry a source URL and a verification tag.

## Live Probes (run directly, Phase 0B, 2026-10-30)
| # | Probe | Method | Result | Evidence marker |
|---|-------|--------|--------|-----------------|
| P1 | OFAC SDN feed reachable | `curl -sI` | VERIFIED | `treasury.gov/.../sdn.xml` → **302** → `sanctionslistservice.ofac.treas.gov/.../SDN.XML` → **HTTP 200 text/xml**, Last-Modified 2026-10-28, Digest sha-256 `0213f3a0…` |
| P2 | Base Sepolia RPC chainId | `eth_chainId` POST | VERIFIED | `0x14a34` = **84532** on `https://sepolia.base.org` |
| P3 | @chainlink/cre-sdk exists | npm registry API | VERIFIED | latest **1.23.0**, 77 versions, alpha `1.24.0-alpha.1` |

## Platform-Invariant Probe (Day-0, riskiest assumption)
- **invariant:** "A CRE workflow using Confidential HTTP can run end-to-end and broadcast a DON-signed report to Base Sepolia **without** the private-beta invite / deploy allowlist, via the local simulator."
- **evidence (docs-verified):** `cre workflow simulate` compiles the workflow to WASM and runs it locally; only `cre login` required (NOT `cre account access` deploy approval); docs state Confidential HTTP "can be used in the local simulator while awaiting approval." Source: docs.chain.link/cre/guides/operations/simulating-workflows + .../confidential-workflows-access
- **result:** VALIDATED-BY-DOCS; **empirical confirmation deferred to wire** (install `cre` CLI, `cre workflow simulate` the confidential-http example, `--broadcast` to Base Sepolia). This is the Risk-5 wire-gate from the WINNER-BRIEF.
- **feasibility DISAGREE resolution:** the PULSE winner-feasibility DISAGREE feared "prerecord fallback clip ⇒ fabricated demo." The simulator path makes the demo's workflow logic REAL (real Confidential HTTP fetch, real OFAC screen, real on-chain broadcast). The only honest limitation: in simulate mode the report may be single-node-signed vs a full managed-DON multi-sig — documented in LIMITATIONS.md, NOT hidden. No fabrication.

---

## Verified Patterns (copy into ARCHITECTURE.md)

### Chainlink CRE (@chainlink/cre-sdk 1.23.0)
| Component | Pattern | Source | Conf |
|-----------|---------|--------|:---:|
| Workflow entry | `initWorkflow(config)` → array of `handler(trigger, cb)`; triggers `CronCapability().trigger({schedule})` / HTTP | docs.chain.link/cre/getting-started/part-4-writing-onchain-ts | HIGH |
| Confidential HTTP | `new ConfidentialHTTPClient().sendRequest(runtime, {request:{url,method,multiHeaders?,timeout?(max10s),encryptOutput?}, vaultDonSecrets:[{key,owner?}]}).result()`; secrets via `{{.key}}` Vault-DON templates; runs **DON mode** (TEE) | .../using-confidential-http-client/making-requests-ts | HIGH |
| Encrypted output | `encryptOutput:true` → AES-GCM `nonce‖ciphertext‖tag`, key id `san_marino_aes_gcm_encryption_key` | same | HIGH |
| DON consensus | `runtime.runInNodeMode(fn, consensusIdenticalAggregation<T>())` (Byzantine-quorum exact match — use for OFAC pass/fail) / `consensusMedianAggregation` / `ConsensusAggregationByFields`; `.withDefault(x)` | .../reference/sdk/consensus-ts | HIGH |
| Signed report | `runtime.report({encodedPayload, encoderName:"evm", signingAlgo:"ecdsa", hashingAlgo:"keccak256"}).result()`; `Report.parse()` verifies sigs | .../part-4-writing-onchain-ts | HIGH |
| EVM write | `evmClient.writeReport(runtime,{receiver, report, gasConfig:{gasLimit}}).result()` → KeystoneForwarder validates DON sigs → calls consumer `onReport()`; returns `{txStatus, txHash, …}` | .../using-evm-client/onchain-write/overview-ts | HIGH |
| Base Sepolia target | **supported**: chainId 84532, **chain selector 10344971235874465080**, SDK name `ethereum-testnet-sepolia-base-1` (CRE keys chains by SELECTOR) | docs.chain.link/crec/supported-networks | HIGH |
| Consumer contract | implement `IReceiver is IERC165` → `onReport(bytes metadata, bytes report)`; extend `ReceiverTemplate(forwarder)`, override `_processReport(bytes report)`; guard `msg.sender==s_forwarderAddress`; bind `setExpectedWorkflowId/Author/Name` (name-binding REQUIRES author-binding). metadata=64B: workflowId(32)+name(10)+owner(20)+2 | .../building-consumer-contracts | HIGH |
| Run model | `cre workflow simulate <wf>` → WASM local, only `cre login`; CLI: build/simulate/deploy/activate/pause/… | .../simulating-workflows, .../reference/cli/workflow | HIGH |
| GitHub examples | `smartcontractkit/cre-sdk-typescript` (`@chainlink/cre-sdk`, `-examples`, `-javy-plugin`) | github.com/smartcontractkit/cre-sdk-typescript | HIGH |

### IVMS 101.2023 (Issue 1 FINAL, 4 Jun 2024) — entities UpperCamelCase, elements lowerCamelCase
- Top-level entities: `Originator, Beneficiary, OriginatingVASP, BeneficiaryVASP, TransferPath, PayloadMetadata`.
- `Person` = choice `naturalPerson | legalPerson` + `accountNumber[0..n]`.
- `NaturalPerson`: `name[1..1]`→`NaturalPersonName`, `geographicAddress[0..n]`, `nationalIdentification[0..1]`, **`customerIdentification[0..1]`** (Text — NOT "customerIdentificationNumber"), `dateAndPlaceOfBirth[0..1]`, `countryOfResidence[0..1]`.
- `NaturalPersonName.nameIdentifier[1..n]`→`{primaryIdentifier[1..1], secondaryIdentifier[0..1], naturalPersonNameIdentifierType[1..1]}`.
- Constraint **C1** (OriginatorInformationNaturalPerson): ≥1 of geographicAddress(GEOG/HOME/BIZZ) / customerIdentification / nationalIdentification / dateAndPlaceOfBirth. **C6**: ≥1 nameIdentifierType = `LEGL`.
- Source: IVMS101.2023 standard PDF (intervasp / GDF mirror).

### Legal citations (verb-correct, copy-ready)
- **EU TFR**: `Regulation (EU) 2023/1113, Article 14(1)(a)–(d)` (originator info) + `Article 14(2)(a)–(c)` (beneficiary); applicable **30 Dec 2024**; **no de-minimis** for crypto CASP transfers. Canonical: https://eur-lex.europa.eu/eli/reg/2023/1113/oj/eng
- **FATF**: `FATF Recommendation 16 (Travel Rule)`; `FATF Updated Guidance … VAs & VASPs (Oct 2021) ¶¶177–184`; de-minimis **USD/EUR 1,000**.
- **FinCEN (verb-correct)**: `31 CFR §1010.410(f)` = Travel Rule, `(e)` = Recordkeeping; "**transmittal of funds ≥ $3,000** by financial institutions"; use "**transmit / include in the transmittal order**", NEVER "file". Crypto reached via `FinCEN Guidance FIN-2019-G001 (9 May 2019)` (CVC = money transmitters) — **cite the guidance without a decimal subsection** (it uses roman-numeral sections; do not invent "§4.5.1"); **no crypto-specific FinCEN numbered Travel Rule exists**. $250 proposal withdrawn 16 Apr 2025; $3,000 stands.
- **OFAC**: SDN identifier field literally `Digital Currency Address - XBT/ETH`; `OFAC FAQ 562/559`. **No official count published** — cite as approximate or omit.

### OFAC SDN.XML (legacy flat feed — the one we parse)
- URL: `https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML` (old treasury.gov URL 302s here; **follow redirects** → AWS GovCloud S3 signed URL, 1-hr expiry).
- Schema: root `<sdnList>` → `<publshInformation>` (sic — holds `<Publish_Date>`, `<Record_Count>`) → repeated `<sdnEntry>` {uid, firstName, lastName, sdnType(Individual/Entity/…), programList/program, idList, akaList, addressList}.
- Wallets: `<idList>/<id>` {idType="Digital Currency Address - XBT|ETH|…", idNumber=<address>}.
- Screening: **addresses = exact** (base58 case-SENSITIVE — don't lowercase; EVM checksum/case-insensitive); **names = fuzzy** (Jaro-Winkler ~0.85) over sdnEntry names **+ every `<aka>`**.
- Size >10MB (~15–20MB) → stream-parse (`fast-xml-parser`); names via `fuzzball`.
- Freshness: in-band `<Publish_Date>` or S3 `Last-Modified`.

### DEMO FLIP ADDRESS (locked)
- **PASS case (clean):** a synthetic/testnet address NOT on the SDN list.
- **DO-NOT-TRANSMIT case:** Garantex `3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1` (`Digital Currency Address - XBT`, program CYBER4, **active** designated 2025-08-14) OR ETH `0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9`. Source: ofac.treasury.gov/recent-actions/20250814.
- ⚠️ **DO NOT use Tornado Cash addresses** — delisted 2025-03-21, would false-negative against the live feed. Demo must confirm the chosen address IS present in the freshly-fetched XML at startup (fail loud if absent).

## Unverified / Design-Around
| Item | Risk | Resolution |
|------|------|-----------|
| CRE `enclaveHash` / remote-attestation API | **NOT FOUND** in TS SDK — no published TEE measurement/quote | Define `EnclaveAttestation.commitmentHash` as **our keccak256 over the canonical verified-claims payload**, carried inside the DON-signed report. Honesty invariant: we attest "PII was processed via Confidential HTTP in-enclave and only this commitment + verdict reached chain" — we do NOT claim a verifiable TEE remote-attestation quote. Encrypted-output (AES-GCM) is the privacy mechanism; the DON signature is the integrity anchor. |
| Confidential HTTP in simulate w/o invite | docs say yes; not empirically run here | wire-phase probe (Risk-5 gate): `cre workflow simulate` the confidential-http example before relying on it. |
| Managed-DON multi-sig vs simulate single-node | demo may run in simulator | document in LIMITATIONS.md as the one honest degradation; workflow logic identical. |

## Conflicts resolved
- WINNER-BRIEF non-negotiable said "EnclaveAttestation(jobId, enclaveHash, ts)". Spike found no enclaveHash API → event kept but field semantics corrected to a computed commitment (above). This is a precision correction, not a scope change — logged as AMEND candidate / ADR.
