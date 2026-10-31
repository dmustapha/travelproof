# CRE RUN MODEL — real managed-DON, NOT simulate (Dami ruling 2026-10-30)

Dami: "i dont prefer simulations." Decision: run the **real managed-DON CRE path**, proven by his prior project **ghostfund-v2** (`~/Desktop/dev/ghostfund-v2/workflow/workflow`).

## What ghostfund-v2 proves (the working reference)
- Real CRE workflow deploy with `@chainlink/cre-sdk` (ghostfund pinned `^1.0.9`; TravelProof pins `1.23.0` — **reconcile the API against the installed version at wire**; the 1.0.9 `Runner`/`cre` entry shape differs from the 1.23.0 `initWorkflow`/`handler` shape the ARCHITECTURE used — treat ghostfund as the deploy-mechanics reference, the 1.23.0 docs as the API reference).
- Deploy config shape (replicate for TravelProof):
  - `workflow.yaml` — `staging-settings.user-workflow.workflow-name` + `workflow-artifacts.{workflow-path,config-path,secrets-path}`.
  - `config.json` — `schedule` (cron) + per-EVM `{assetAddress, poolAddress, …, chainName, gasLimit}`.
  - cron-triggered (`CronPayload`), reads on-chain via `EVMClient`, writes a report via `EVMClient.writeReport`/tx.
- **ghostfund did NOT use Confidential HTTP** (grep clean) → Dami has done a real CRE **workflow deploy** (so `cre account access` allowlist is very likely already granted to his account) but has **not** been through the **Confidential Workflows private-beta** gate.

## TravelProof CRE plan (real, per-subsystem)
| Workflow | Capability | Access needed | Run model |
|----------|-----------|---------------|-----------|
| C4 DON OFAC screen | HTTP fetch + DON consensus + EVM writeReport | `cre account access` (likely already held via ghostfund) | **REAL managed-DON deploy** — no simulate |
| C7 attestation write | EVM writeReport via KeystoneForwarder | same | **REAL** on Base Sepolia |
| C3 Confidential-HTTP verify | **Confidential HTTP (enclave)** | **Confidential Workflows private-beta invite** (NOT yet held) | request the invite NOW; this is the one gated piece |

## Action for build/wire
1. Confirm `cre login` + `cre account access` status on Dami's account (ghostfund implies it's granted).
2. **Request the Confidential Workflows private-beta invite immediately** (Google Form, docs.chain.link/cre/guides/operations/confidential-workflows-access) — it is the only blocker to a fully-real C3.
3. Build C4 + C7 as a REAL managed-DON deploy using the ghostfund `workflow.yaml`/`config.json` recipe (reconciled to cre-sdk 1.23.0).
4. If the Confidential beta invite has NOT landed by the internal cutoff: C3 is the ONLY workflow that cannot run fully-real; keep C4 (OFAC screen) + C7 (attestation) REAL on-chain, and run C3's Confidential HTTP via the documented path with an honest LIMITATIONS note — never fabricate its verdict. This is a per-subsystem honesty boundary, NOT a blanket simulate.

## ADR update
Supersedes ADR D-5's "simulate-first" default: the demo path is **real managed-DON** wherever access allows (C4/C7 confirmed-feasible via ghostfund); only C3's Confidential HTTP is gated on the private-beta invite.
