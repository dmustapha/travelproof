# CRE Confidential Workflows — private-beta access request (C3)

**Status:** REQUEST PREPARED — needs Dami to submit (the form is a human-gated Google Form on docs.chain.link; it asks for the Chainlink account email + use case).

- **Why:** C3 (Confidential-HTTP in-enclave verify) is the ONE gated CRE piece. C4 (OFAC DON screen) + C7 (attestation) run real without it.
- **Where:** https://docs.chain.link/cre/guides/operations/confidential-workflows-access (Google Form linked there).
- **Account:** Dami's Chainlink CRE account (same one used for ghostfund-v2 — `cre login`).
- **Use case to paste:** "TravelProof — a crypto Travel Rule compliance tool. The Confidential HTTP workflow verifies originator/beneficiary identity against a VASP registry in-enclave so that only a keccak256 commitment + a pass/fail verdict reach the public chain (Base Sepolia); no PII is written on-chain. OFAC SDN screening + the on-chain attestation already run on managed-DON; Confidential Workflows is the production privacy path for the identity-verification leg."
- **Posture (INVARIANT 6 / CO-1):** C3 ships as REAL code labeled "CRE Confidential Workflows — beta access pending (production privacy path)." NEVER simulated or fabricated in the live demo. The live headline is the OFAC-DON-attested filable record + no-PII-on-chain proof.
- **Non-blocking:** the beta ETA is beyond the hackathon deadline; this is the post-deadline upgrade path.
