# SECURITY - TravelProof

Threat model for the Travel Rule attestation pipeline. Each threat maps to a concrete enforcement
and the file that enforces it. The design principle is **fail-closed**: no path ever defaults to a
pass, and no PII ever reaches the chain.

## Threat matrix

| Threat | Enforcement | File |
|--------|-------------|------|
| PII leaked on-chain | no PII-typed storage field (structural) | `contracts/src/TravelRuleAttestation.sol` |
| Forged attestation | forwarder-guarded `onReport` | `contracts/src/TravelRuleAttestation.sol` |
| Stale/cached sanctions pass | live-feed-only; `SCREEN_DEGRADED` on failure | `packages/ofac/src/sdn.ts` |
| Secret leak | Vault DON secrets, never in code | `packages/cre/src/verify.workflow.ts` |
| Wrong legal authority | citation lint (banned patterns) | `packages/core/src/citations.ts` |

## Not defended against

Honest scope boundaries the build keeps and discloses:

- **Two-VASP handshake integrity** - out of scope; the TRISA production path is named but not
  implemented. TravelProof produces step 1 of 2 (the originator's filable record).
- **Managed-DON multi-sig assurance if run in the simulator** - the C3 Confidential-HTTP verify
  path falls back to `cre workflow simulate` if the private-beta invite has not landed; the
  simulator does not carry the managed-DON's multi-sig assurance (disclosed in `LIMITATIONS.md`).
- **A compromised VASP registry endpoint** - C6 is a disclosed mock (attribute-match synthetic);
  a malicious registry response is not defended against.
- **Mainnet-grade key management** - testnet only (Base Sepolia); the deployer key is a dev key.
