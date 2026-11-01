**On-chain compliance usually leaks identity onto the chain. TravelProof proves the counterparty was screened without putting a single name on the ledger, and hands the officer a Travel Rule record they can file.**

_BLI Legal Tech Hackathon 2 · LegalTech / RegTech track · Chainlink CRE bounty_

## The Problem

When one exchange sends crypto to another, FATF Recommendation 16 (the Travel Rule) and the EU Transfer of Funds Regulation require the originating VASP to screen the counterparty and transmit originator and beneficiary information. Put that information on a public chain and you have leaked personal data, which is what data-protection law exists to prevent. The officer is caught between two duties: **prove the screen happened**, and **never expose who was screened**.

The rule is also not one size. A transfer to another exchange, a transfer to a self-custody wallet, and a transfer below the de-minimis threshold each trigger a different regime and a different citation. Tools that hard-code one case do not survive a second one.

## The Solution

TravelProof keeps the proof and the identity apart. Counterparty identity (IVMS101) is verified inside a Chainlink CRE workflow and never reaches the chain. What reaches the chain is a pass or fail, a one-way commitment, and a timestamp, carried by a DON-signed attestation on Base Sepolia. The officer receives a filable Travel Rule transmittal record and a cited memo. A regulator reads the public ledger and sees that the screen happened, not who was screened.

The decision path has no language model in it, and it does not pretend. A deterministic resolver drives every verdict. When the CRE run is not reachable the live endpoint returns `502`, never a fabricated `CLEARED`.

## How It Works

**1. Classify.** A deterministic resolver (`lib/outcome.ts`, no AI) decides applicability and the governing regime: CASP to CASP under EU TFR Article 14, a self-custody counterparty under FATF Recommendation 16, the USD 1,000 de-minimis, and the EU/FATF divergence below it. Missing or non-finite input escalates to human review rather than guessing.

**2. Verify.** Identity is checked by a Chainlink CRE verify workflow that POSTs the IVMS payload to a bearer-gated endpoint doing a real TRISA testnet directory lookup. Only a `keccak256` commitment over the verified payload is carried forward. The confidential-HTTP path runs under local CRE simulation today; the production-managed-DON confidential enclave needs Chainlink's Confidential Workflows beta.

**3. Screen.** A CRE screen workflow runs a DON-consensus OFAC SDN check against the live Treasury feed, fail-closed, with no cached fallback. A sanctioned address flips the record to `DO NOT TRANSMIT`. The workflow queries a tiny `GET /api/ofac?address=` endpoint the project indexes from the 10MB SDN feed, so the in-workflow fetch stays inside the CRE HTTP capability limit.

**4. Attest.** A DON-signed attestation is written to `TravelRuleAttestation` on Base Sepolia. `onReport` decodes the KeystoneForwarder metadata, binds the expected workflow, and reverts `UnexpectedWorkflow` on anything it was not bound to. The stored struct holds no PII.

**5. File.** The officer gets a transmittal record and a one-page memo: IVMS 101.2023 Section 7 fields, the cited rule, the on-chain attestation reference, a signature line, and a retention note (FinCEN 31 CFR 1010.430, satisfied by on-chain permanence). Prior attestations appear in an examiner evidence log at `/ledger`.

## Key Features

- **Earns every verdict:** a result is shown only when the CRE run actually produced it. An unavailable or non-enum verdict is rejected, never attested or faked (`/api/run` returns `502` rather than a fabricated `CLEARED`).
- **Real verdicts via local CRE simulation:** the verify and screen workflows run end-to-end through `cre workflow simulate` (the DON and enclave emulated on the host, real OFAC and TRISA data, a real DON-signed report in simulation). A clean registered transfer returns `CLEARED`; the Garantex SDN address returns `DO NOT TRANSMIT`.
- **One classifier of record:** `lib/outcome.ts` drives all copy, gates, and required action. Only an SDN hit carries OFAC blocking language.
- **Encodes the statute, not a case:** the resolver returns the correct regime and citation per branch (FATF R.16, EU TFR Art.14, unhosted-wallet handling, de-minimis divergence).
- **PII never on-chain:** the stored `Attestation` struct has zero string fields, so a PII write is unrepresentable by the type system. The chain holds a commitment hash, two verdict enums, and a timestamp.
- **Examiner evidence log:** `/ledger` renders past attestation events as an append-only audit trail. On-chain permanence satisfies the 5-year retention duty.
- **Lawyer-grade memo:** IVMS Section 7 labels, cited rule, independently verifiable attestation link, officer signature, retention note. It evidences a transmittal of funds, not a filing.
- **Workflow-bound attestation:** the contract rejects reports from any workflow it was not bound to.

## Project Status / Live Now

- **Live demo:** https://travelproof.vercel.app
- **Open-source repo:** https://github.com/dmustapha/travelproof
- **Contract on Base Sepolia:** `0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD` (deploy tx `0xd8d5d6...a5530`, block 52683257, status success)
- **CRE wired, verdicts real:** the verify and screen workflows compile against `@chainlink/cre-sdk` 1.23.0 and run end-to-end via local CRE simulation; `/api/run` returns a real `CLEARED` or `DO NOT TRANSMIT`, not a `SPECIMEN`.
- **Tested:** deterministic core, the outcome truth-table, and the Foundry suite all green; an adversarial stress battery passed 101 of 101.
- **Honest scope:** the deployed contract, the OFAC SDN screen, the classifier, the IVMS101 record, the memo, the examiner ledger, and the CRE verify and screen workflows are real. Verdicts come from local CRE simulation (no beta required). The production managed-DON confidential enclave and an on-chain attestation broadcast from the simulated run both need Chainlink's Confidential Workflows beta, so the public Vercel instance still fails closed on the full managed-DON path and a verdict there is shown as labelled `SPECIMEN`; a live-CRE host returns the real verdict.

## Tech Stack

`Next.js 15` (App Router, React 19) · `Solidity` + `Foundry` · `Chainlink CRE` (`@chainlink/cre-sdk` 1.23.0) · `viem` · `Base Sepolia` (84532) · `pnpm` workspace · IVMS101 · OFAC SDN live feed · TRISA testnet directory

## Deployed Contracts (Base Sepolia, chainId 84532)

- **TravelRuleAttestation:** `0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD`
- **KeystoneForwarder (constructor):** `0xF8344CFd5c43616a4366C34E3EEE75af79a74482` (official Chainlink CRE Base Sepolia production forwarder)

## Business Model

- **Per-screen SaaS for VASPs and exchanges:** priced per Travel Rule decision, the way sanctions-screening vendors already bill.
- **Attestation as the audit artifact:** the on-chain evidence log is the retained record an examiner asks for, sold into compliance and audit teams.

## Hackathon Alignment

Primary track: LegalTech / RegTech, an on-chain compliance workflow with a human-readable legal layer a firm would file. Chainlink CRE bounty: a Confidential HTTP verify for the privacy path, a DON-consensus OFAC screen, and a DON-signed attestation on Base Sepolia. The build maps contract and calldata depth directly onto FATF Recommendation 16 and the EU Transfer of Funds Regulation.

## Proof

Live: https://travelproof.vercel.app · Code: https://github.com/dmustapha/travelproof · Contract: `0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD` on Base Sepolia (84532). Recompute the core locally: `pnpm install && pnpm verify:claims`.
