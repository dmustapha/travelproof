# ROUTE-ARCHITECTURE - TravelProof

Derived from the frozen user-model (USER-ONBOARDING.md): two user classes (officer, judge) → multi-page, landing required. No single-page cramming.

## ROUTES
- `/` (landing) - R-7 opening beat: one-line legibility statement + a live sample attestation card (money shot). Single hero CTA → `/cockpit`.
- `/cockpit` - the officer app: new-transfer form, cited applicability banner, verify + screen status, CLEARED / DO-NOT-TRANSMIT state.
- `/record/[jobId]` - the filable IVMS 101.2023 record + one-page officer memo (cited rule) + on-chain-verifiable footer; PDF export.
- `/proof/[jobId]` - the separate judge/demo route: resolves the attestation from Base Sepolia, shows commitment + verdicts + ts + BaseScan link + the ledger-has-no-PII panel.

(Sub-route note: `/record` and `/proof` are per-jobId sub-routes the user-model needs - the officer lands on the record, the judge on the proof. The two are deliberately separate so a judge never has to touch the officer app to verify.)

## FIRST-CONTACT (landing `/`)
- **30-sec legibility:** "Privacy-preserving FATF Travel Rule records for crypto exchanges - verify the person, hide the person, attested on-chain."
- **money-shot:** a live attestation card (jobId, CLEARED/BLOCKED badge, Base Sepolia tx link) rendered from real seeded on-chain state.
- **liveness/cold-start:** the sample attestation + a rendered sample record are visible immediately from seeded state - no empty states, no spinner-on-load.
- **honesty:** a footer line links LIMITATIONS.md (mock VASP registry + simulator disclosure) and SUBMISSION_STATUS.md.
- **entry-funnel:** one hero CTA ("Open the cockpit") → `/cockpit`; a secondary quiet link ("Verify an attestation") → `/proof`.

## CHANGE-ORDER-1 route
- `/ledger` - examiner evidence log: append-only DON-attested history of prior attestations (C11), read from on-chain EnclaveAttestation events; linked from the landing. (Depth-add A.)