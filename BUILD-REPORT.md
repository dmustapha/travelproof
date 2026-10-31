# Build Report — TravelProof
Generated: 2026-10-31
Builder: hackathon-build skill (orchestrator; per-phase implementation subagents)

## Summary
| Phase | Steps | Status | Notes |
|-------|-------|--------|-------|
| phase-0 | 0.1, 0.2 | COMPLETE | scaffold + franchise skeleton; 6 workspace members linked; verify:claims green |

## Pre-build facts verified by orchestrator
| Fact | Command | Result |
|------|---------|--------|
| Deployer funded | `cast balance 0xc211…12A5` | 58520224989081574 wei (~0.0585 ETH) — ample |
| Base Sepolia chainId | `cast chain-id --rpc-url <alchemy>` | 84532 ✓ |
| forge | `forge --version` | 1.4.4-stable |
| node / npm | `node -v` / `npm -v` | v24.10.0 / 11.22.0 |
| cre CLI present | `which cre` | ~/.cre/bin/cre ✓ |
| cre login | `cre whoami` | NOT LOGGED IN (interactive OAuth → needs Dami; wire-phase gate, non-blocking for P0-P1 real slice) |

## Deviations from Architecture

Each deviation is a DEV-NNN record. Debug phase 2 and wire phase 1 grep for `DEV-` entries.

| ID | Component | ARCHITECTURE Said | ACTUAL | Reason | Class | Downstream Impact |
|----|-----------|-------------------|--------|--------|-------|-------------------|
| DEV-001 | scripts/verify-claims.ts | top-level `import {commitmentHash} from "@travelproof/core/commitment"` + `import {getAttestation} from "../apps/web/lib/chain"` | those two imports issued dynamically inside the per-claim loop (`await import(...)`) | commitment.ts (C2) + chain.ts (C10) are authored in later phases; top-level static imports would throw ERR_MODULE_NOT_FOUND and fail the empty-ledger phase-0 gate | COSMETIC | none — dynamic imports resolve to real modules once C2/C10 land, no edit needed |
| DEV-002 | packages/core/src/commitment.ts vs test/commitment.test.ts | §12 test calls `commitmentHash(m, 0, "CLEAR")` (3 args incl screenVerdict) | §4 `commitmentHash(p: CommitmentInput)` (single arg) is implemented; test adapted via `commitmentInputFromIvms(m, verdict)` + round-trip assertion | §4 impl is load-bearing (INVARIANT 5, A-G4 #2 COMMITMENT_KEYS round-trip; D-2 excludes screenVerdict from commitment) — §12 test was stale/incompatible | UNTESTED | none — real functions exercised; commitment.ts is the canonical contract the verify.workflow must match in P3 |
| DEV-003 | packages/core/package.json | test script `vitest run` but vitest/typescript/@types/node undeclared | added vitest+typescript+@types/node as devDependencies; pnpm install clean | test runner was missing from the workspace | DEGRADED | none — test runner now declared |
| DEV-004 | packages/core/tsconfig.json | (none authored at scaffold) | created strict tsconfig with `moduleResolution: bundler` | gate cmd `tsc --noEmit` had no config; bundler resolution matches the extensionless imports the frozen arch authored (nodenext would force editing frozen source) | DEGRADED | none — build config now present |

## Failed Attempts & Resolutions
| Step | Error | Attempts | Resolution |
|------|-------|----------|------------|

## Verification Results
| Phase | Command | Expected | Actual | Pass? |
|-------|---------|----------|--------|-------|
| 0 | `corepack pnpm install` | workspace links core/ofac | Done in 39.4s; 6 members linked (core, ofac, cre, vasp-registry, web) | YES |
| 0 | `grep cre-sdk packages/cre/package.json` | 1.23.0 | `@chainlink/cre-sdk: 1.23.0` | YES |
| 0 | `corepack pnpm verify:claims` | "All claims recompute…" on empty set | "All claims recompute and match on-chain." | YES |
| 0 | franchise files exist | CLAIMS/SECURITY/SUBMISSION_STATUS/claims.json/evidence | all present | YES |
| 1 | `tsc --noEmit` (core) | clean | exit 0, zero errors | YES |
| 1 | `pnpm --filter @travelproof/core test` | 4+ tests green | 9/9 pass (resolver 4, ivms 2, commitment 3) | YES |
| 1 | DT-1 citation lint | no 1010.410(f)-as-crypto-authority, no "filing" | only the BANNED_CITATION_PATTERNS regex def matches (lint source), no real bad citation | YES |
| 1 | INVARIANT 3 no-AI lint | resolver imports no model/network | clean (imports only ./types, ./citations) | YES |
| 1 | COMMITMENT_KEYS order | beneVasp, beneficiaryAccount, origVasp, verifyVerdict | exact match (A-G4 #2 round-trip holds) | YES |
| 1 | `pnpm verify` (clean-room gate, offline+unit) | pass | PASSED | YES |

## Known Risks (for debug)
- CRE workflows (C4/C3) require `cre login` (interactive OAuth); not completable headless. Deferred to wire-phase per BUILD-HANDOFF. The P0-thesis slice (C7 contract deploy + no-PII + live OFAC parse) does NOT depend on cre login.

## Contract Addresses
| Contract | Network | Address | Tx Hash |
|----------|---------|---------|---------|

## Environment Variables Added
| Key | Source Step | Value/Description |
|-----|-----------|-------------------|
