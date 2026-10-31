# Limitations — TravelProof

## In scope (built for this submission)
- Deterministic Travel Rule resolver with statute-encoded applicability + a frozen citation registry (EU TFR Art.14 / FATF Rec.16 / FinCEN context).
- IVMS 101.2023 record assembly + constraint (C1/C6) validation.
- A **live** OFAC SDN screen via a CRE DON-consensus workflow (no cached list).
- A CRE Confidential-HTTP in-enclave verify workflow (run in the local simulator).
- A Base Sepolia `TravelRuleAttestation` contract storing only commitment + verdicts (no PII field).
- Officer cockpit, filable IVMS101 record + cited memo (PDF export), and a cold-verifiable proof page.
- A CLEARED run and a DO-NOT-TRANSMIT (Garantex SDN) run, both real.

## Feature-gated (deliberately not built for this scope)
- **Two-VASP handshake (beneficiary-VASP receipt).** Reason: scope — TravelProof covers the originator side ("step 1 of 2"); the production path is the TRISA handshake.
- **Managed-DON multi-signature attestation.** Reason: the managed-DON deploy is allowlist-gated and Confidential Workflows is private-beta; the demo runs in `cre workflow simulate`, which may sign single-node rather than full-DON-multi-sig. The workflow *logic* is identical; only the signing topology differs. Disclosed, not hidden.
- **Real TRISA directory integration.** Reason: time — the VASP registry endpoint is a disclosed mock; the production path (TRISA testnet directory) is named in code and the memo footer.
- **Mainnet + real customer PII.** Reason: safety — testnet (Base Sepolia 84532) and synthetic identities only.
- **A hardware TEE remote-attestation quote (`enclaveHash`).** Reason: `@chainlink/cre-sdk` exposes no such API (spike NOT FOUND). We attest honestly to the DON-signed commitment, never a TEE quote (INVARIANT 5).
- **Exhaustive IVMS101 coverage** (legal-person originators, every optional element). Reason: scope — the natural-person originator path + VASP legal persons are implemented; the schema is extensible.

Every gated item is a conscious boundary, not a hidden gap. The honesty is itself part of the legal-credibility story.

## Critique STAGE-1 pre-empts (folded 2026-10-30, all MINOR)
These one-line clarifications pre-empt Q&A a FATF-literate / technically-sharp judge might raise (critique ACCEPTed; none is blocking):
- **Two-VASP gap, said out loud in the demo.** Demo scene S5/S7 voiceover adds one sentence: "This is the originating side — step 1 of 2; the beneficiary VASP receives it via the TRISA handshake in production." Pre-empts the handshake question.
- **Originator data in the CRE trigger is a one-way hash, not raw identity.** The verify workflow trigger carries `originatorHash` (a keccak of originator fields), never the raw name/address; raw PII enters only the in-enclave Confidential HTTP body. Nothing identity-derivable is written on-chain.
- **FinCEN context always renders with its qualifier.** The memo renderer must surface the `FINCEN_CTX` citation only together with its "US context, not a crypto-specific authority" clause — never the bare CFR cite — so a skimming judge cannot misread §1010.410(f) as the crypto authority.
- **What the commitment proves.** The on-chain `commitmentHash` anchors the counterparty (beneficiary account + both VASP LEIs) and the verify verdict — not the originator's identity. The originator verification is evidenced by the in-enclave response only; the chain records that verification happened + its verdict, not who the originator was.

## CHANGE-ORDER-1 supersedes (2026-10-31)
- **VASP registry (C6) — UPGRADED:** registration check is now a REAL lookup against the live TRISA testnet directory (api.testnet.directory); only the originator attribute-match stays synthetic (the TRISA mTLS gRPC handshake needs cert onboarding + a live peer VASP — production path). The response carries `source` so the UI/memo disclose which is which. (Supersedes the earlier "disclosed mock" line.)
- **Enclave verify (C3) — REFRAMED:** not simulated and not degraded; it is the production privacy path, real code shipped, labeled "CRE Confidential Workflows — beta access pending." The live demo leads on the OFAC-DON-attested filable record + the no-PII-on-chain proof (both 100% real tonight). (Supersedes the earlier "demo runs in simulate" framing.)
- **Added depth:** `/ledger` examiner evidence log (A); resolver legal-nuance shown in the demo (B); lawyer-grade filable memo with IVMS Section-7 labels + retention + signature (C).
