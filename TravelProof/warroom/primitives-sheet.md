---
event_class: sponsor_track
event_class_source: inferred
pack_version: 2
pack_date: 2026-09-28
gap_map: present
sponsor_vintage: present
---

# Working Primitives Sheet — BLI Legal Tech Hackathon 2

Remix these across families/domains. Porting a primitive unchanged loses. Every idea records which primitive(s) it adapted and how.

### F28 — In-circuit compliance & non-transferability guarantees [lane: whitespace]
**Mechanism:** The compliance check runs as a load-bearing part of the transaction path, not a dashboard beside it — the rule is enforced in-flow (fails closed) and the enforcement itself is the proof. Ported here: a cited statutory check (FATF Rec.16 required fields, MiCA CASP obligation, OFAC screen) gates the on-chain action; the DON-signed pass/fail IS the filable record.
**Receipts:** sanctions/transfer-restriction winners where the check was the mechanism, not a view; ClearRelease (field competitor) is the warm-tier version without cited frameworks.
**Adaptation axes:** which statute (Travel Rule vs MiCA vs SAR) · check-at-signing vs continuous · output = filable record vs on-chain flag.
**Saturation:** warm
**Loss-twin:** "a dashboard shows the compliance status" — the check is decorative; a lawyer cannot file a dashboard.

### F35 — Institutional money-in-motion / asset-in-wrapper rails [lane: whitespace]
**Mechanism:** Model the real legal structure on-chain (SPV membership interest, trust account, escrow) so the token represents a provable claim on an off-chain asset, with CRE reading the off-chain registry/attestation to prove the wrapper actually holds title. The legal wrapper is the product; the token is the trading mechanism.
**Receipts:** RWA-with-legal-wrapper is blue-ocean (0 builds); UCC Art.12 "control" + SPV structure are citable, examiner-legible.
**Adaptation axes:** asset class (real estate/invoice/fund interest) · wrapper (SPV vs trust vs note) · what CRE attests (registry read vs auditor attestation).
**Saturation:** fresh
**Loss-twin:** "tokenize an asset" with no legal linkage — the asset-confusion risk the field ignores; a judge-lawyer kills it on title.

### F30 — Enclave-attested verification & sovereign identity [lane: sponsor-newest]
**Anchored on:** Chainlink CRE Confidential HTTP (in-enclave fetch, DON-signed; the sponsor capability shipped and live for this event, 0 strong builds exploit it).
**Mechanism:** Verify a sensitive credential/registry (vLEI entity + signer authority, KYC doc, private registry) INSIDE the enclave so the PII never touches the public ledger; write only the DON-signed verdict + a hash on-chain. GDPR/data-minimisation by construction.
**Receipts:** TEE/enclave attestation winners; GLEIF vLEI + 2026 GLEIF×ENS/BIS pilots are citable; Confidential HTTP is the differentiator the whole field skips.
**Adaptation axes:** what is screened (vLEI vs KYC vs sanctions list) · verify entity vs verify signer-authority · verdict-only vs selective-disclosure proof.
**Saturation:** fresh
**Loss-twin:** screen public data in the enclave — no PII to protect, so the enclave is garnish (circular-hiding kill, Gate-1b #2).

### F11 — Capital/attestation-backed accountability registry [lane: core]
**Mechanism:** An append-only, tamper-evident on-chain registry where each entry is an independently-attested claim (DON-signed), so the registry becomes the authoritative audit trail an examiner trusts. Here: the chain is the legal audit log / evidence chain, lawyer-readable, with retention + timestamp guarantees.
**Receipts:** accountability-registry winners; FinCEN 5-yr SAR retention + tamper-evidence map directly.
**Adaptation axes:** what is registered (SAR evidence vs Travel Rule record vs disbursement) · who attests · human-readable export format.
**Saturation:** warm
**Loss-twin:** "we hash it on-chain" with no human-readable artifact — the field's dominant anti-pattern.

### F37 — Deterministic resolver, LLM as capped corroborated input [lane: core]
**Mechanism:** The legally-consequential decision is made by deterministic, auditable rules (statute-encoded); any LLM output (e.g. a SAR narrative draft) is a capped, clearly-labeled input a human reviews and signs — never the authority. Protects legal defensibility.
**Receipts:** deterministic-engine winners beat "LLM decides" every time a judge probes correctness; FinCEN "vague narrative" deficiency is a drafting-assist job, not an authority job.
**Adaptation axes:** which decision is deterministic vs assisted · human sign-off placement · citation of the rule applied.
**Saturation:** warm
**Loss-twin:** "AI grades/decides the legal outcome" — ungrounded, indefensible to a lawyer (C-NA1 violation).

### F17 — Guardian / dry-run co-signer between actor and a costly legal action [lane: core]
**Mechanism:** Before a legally-consequential on-chain action (disbursement from trust, release of escrow, filing), a policy gate validates the preconditions (engagement-letter milestone met, reconciliation balances, counterparty cleared) and co-signs only if they hold — a dry-run + human-readable "why this was allowed/blocked" record.
**Receipts:** guardian/co-signer winners; IOLTA three-way reconciliation + per-client-wallet custody rules are citable.
**Adaptation axes:** which action is gated · what precondition (milestone vs reconciliation vs clearance) · block-explanation format.
**Saturation:** warm
**Loss-twin:** an escrow that releases on a single click with no precondition proof — no legal control, no reconciliation leg.

### F08x — Interface-species shift: the filable document IS the product [lane: cross-pollination]
**Mechanism:** Port the DeFi "DSL/CLI/MCP owns a complete job" shape (F08) across domain into legal: the primary interface is the GENERATED LEGAL DOCUMENT (filable Travel Rule record, SAR, SPV offering memo, reconciliation statement) with the on-chain proof embedded as a verifiable footer — the lawyer works in the document, the chain is invisible plumbing. Forced axis-shift: output-artifact (document) replaces output-screen (dashboard).
**Receipts:** interface-shift winners own a complete job end-to-end; the field's gap is exactly "no first-class lawyer-filable artifact."
**Adaptation axes:** which document · embedded-proof format (QR/hash/verifier link) · export (PDF the lawyer signs).
**Saturation:** fresh
**Loss-twin:** a dashboard with an "export" button bolted on — the document is an afterthought, not the product.
