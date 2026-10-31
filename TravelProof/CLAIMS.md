# CLAIMS - TravelProof

Every headline claim below is **machine-recomputed** by `pnpm verify:claims`, which refuses
read-back: it re-derives each commitment from committed source (`docs/pipeline/claims.json`) and
compares it to the on-chain attestation on Base Sepolia. A claim that does not recompute-and-match
fails the gate (non-zero exit). The human-readable table here mirrors the machine ledger
(`docs/pipeline/claims.json`) and the evidence output (`evidence/verify-claims.json`).

## How to verify
```bash
pnpm install
pnpm verify:claims   # recomputes every claim from committed source; exits non-zero on any mismatch
```

## Claims ledger

_No claims yet. The ledger (`docs/pipeline/claims.json`) is seeded empty at C0 (scaffold). Claims
are added as components land and real CLEARED + BLOCKED attestations are written on-chain (seed +
CRE run). Each row below is recomputed, never asserted._

| # | Claim | jobId | Commitment (recomputed) | On-chain | Match | Evidence |
|---|-------|-------|-------------------------|----------|-------|----------|
| - | _(none yet - empty ledger at scaffold)_ | - | - | - | - | - |

## Claim schema (per entry in `docs/pipeline/claims.json`)
```jsonc
{
  "jobId": "0x…",                 // on-chain attestation key
  "commitment": {                 // the exact CommitmentInput the verify workflow serialized on-chain
    "beneVasp": "…",
    "beneficiaryAccount": "…",
    "origVasp": "…",
    "verifyVerdict": 0            // 0 = PASS; screen HIT is a separate verdict, not in the commitment
  }
}
```
