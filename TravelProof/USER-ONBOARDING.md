# USER-ONBOARDING - TravelProof

## USER CLASSES

### Compliance officer at a VASP (the primary real user)
- **WHO:** a compliance/AML officer at a crypto exchange who must satisfy the Travel Rule on outbound transfers and defend every decision to an examiner.
- **GENESIS:** arrives at `/cockpit` with no prior setup; first account state is empty - a single "New transfer" form and a visible sample of a prior attestation. No login wall for the demo (synthetic identities only).
- **ONBOARDING:** enters one pending transfer → sees the cited applicability decision in one screen → runs verify + screen → gets a filable record + memo. First value in under a minute, no documentation needed.
- **INTEGRATION:** in production, the cockpit is fed by the VASP's transfer queue; the verify endpoint resolves against the TRISA directory; the officer exports the signed PDF into their case system.

### Judge / examiner / skeptical senior lawyer (the cold-stranger)
- **WHO:** a hackathon judge (and, by proxy, a regulator) who must independently trust the claim without taking our word.
- **GENESIS:** opens `/` or `/proof/[jobId]` cold, no wallet, no account; immediately sees a live on-chain attestation already seeded on Base Sepolia.
- **ONBOARDING:** clicks the sample attestation → the Proof page resolves it from chain, shows commitment + verdicts + ts + BaseScan link, and the ledger-has-no-PII panel. Trust is earned in one click.
- **INTEGRATION:** none required - verification is a public RPC read anyone can reproduce.

## COLD-STRANGER GENESIS
A judge with no prior setup opens `/proof/[jobId]` (or clicks the sample on `/`) and reaches full value - an independently verifiable, privacy-preserving Travel Rule attestation on Base Sepolia - with **no login wall and no wallet connect**. The attestation was produced by a real seeded run, not hand-written.

## USER PATH (not the demo's)
- **REAL:** officer enters transfer → cited classification → in-enclave verify + live OFAC screen → filable IVMS101 record + memo → on-chain attestation → officer signs/exports; a third party verifies on the Proof page.
- **DEMO:** identical to REAL. The demo enters a real transfer through the same cockpit and runs the same workflows against the same live OFAC feed. There is **no always-on "simulate" button and no manual-paste shortcut** standing in for the officer's real flow. The only difference is synthetic identities and the CRE local simulator (disclosed in LIMITATIONS.md).
