# Build Report — TravelProof
Generated: 2026-10-31
Builder: hackathon-build skill (orchestrator; per-phase implementation subagents)

## Summary
| Phase | Steps | Status | Notes |
|-------|-------|--------|-------|
| phase-0 | 0.1, 0.2 | COMPLETE | scaffold + franchise skeleton; 6 workspace members; verify:claims green |
| phase-1 | 1.1-1.3 | COMPLETE | legal core; 12/12 core tests; COMMITMENT_KEYS round-trip |
| phase-2 | 2.1, 2.2 | COMPLETE | C5 live OFAC real (smoke green); C4 code-real, sim deferred (cre login) |
| phase-3 | 3.1-3.4b | COMPLETE | C7 DEPLOYED @ 0xa8CD17A8..1738 (5/5, COMPLIANT); C6 real TRISA; C3 code-real; run-cre fail-loud |
| phase-4 | 4.1, 4.2 | COMPLETE | web 8 routes build+render; api/run fails closed; UI-coverage 7/7 |
| phase-4.3 | seed | DEFERRED | 2 attestations need cre login; read path live |
| phase-5 | demo/package | OWNED-ELSEWHERE | hackathon-demo + hackathon-package |

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
| DEV-201 | packages/ofac/package.json | test script `vitest run`, no vitest dep | added vitest+typescript+@types/node devDeps | scaffold gap (mirrors DEV-003) | COSMETIC | none |
| DEV-202 | packages/ofac/src/sdn.ts (ARCH §5) | `new XMLParser({...})` without `parseTagValue:false` | added `parseTagValue:false` | **real false-CLEAR bug**: fast-xml-parser coerced hex EVM idNumber `0x7FF9…` to Number → `7.30e+47`, silently dropping a sanctioned address from the index | DEGRADED | FIXED — prevents a sanctions-screen false-negative; live smoke confirms 1058 addrs parse intact |
| DEV-203 | packages/ofac/src/screen.ts (ARCH §5) | `import fuzz from "fuzzball"` | `import * as fuzz from "fuzzball"` | fuzzball is CommonJS with no default export → `fuzz` was undefined under ESM/vitest (TypeError at `fuzz.token_sort_ratio`) | DEGRADED | FIXED — fuzzy name match now works |
| DEV-204 | packages/cre/src/screen.workflow.ts (C4, ARCH §8) | `cre workflow build` + `cre workflow simulate` return CLEAR/HIT | workflow authored against real cre-sdk 1.23.0 symbols (EVMClient, HTTPClient, handler, consensusIdenticalAggregation all confirmed real exports); simulate BLOCKED by interactive `cre login` OAuth (headless-impossible) + installed CLI v1.2.0 lacks `workflow build` subcommand | §8 was [UNVERIFIED]; live simulate is a wire-phase gate; NO verdict fabricated | UNTESTED | C4 live run deferred to wire (needs Dami `cre login` + CRE project scaffold); C5 live screen is fully real and covers the P0 OFAC thesis |
| DEV-301 | packages/vasp-registry/src/trisa.ts (C6, CO-1 D) | real TRISA testnet directory lookup returns `source: "TRISA_TESTNET_DIRECTORY"` | fails closed to `source: "SYNTHETIC_FALLBACK"` (disclosed) | `api.testnet.directory` returns HTTP 415 (gRPC-transcoding surface, not plain JSON GET); fail-closed is the INVARIANT 7 honest path (gate wants `source` present+correct, not a live hit) | DEGRADED | none — `source` discloses the fallback; flips to real automatically if the JSON surface becomes reachable |
| DEV-302 | contracts/lib (forge install) | `forge install foundry-rs/forge-std --no-commit` | ran `forge install foundry-rs/forge-std` (installed v1.17.0) | Foundry 1.4.4 rejects the `--no-commit` flag (removed) | COSMETIC | none |
| DEV-303 | contract explorer verification | BaseScan/Etherscan verified | submitted to Sourcify (job 31a51d52…); no ETHERSCAN_API_KEY in env | Etherscan verification needs an API key not provided; Sourcify is the keyless fallback; source committed regardless | COSMETIC | none — contract functions correctly; judges can read committed source + Sourcify |
| DEV-304 | scripts/run-cre.sh (P3.4b) | wire to real `cre workflow simulate --broadcast`, set CRE_WIRED=1 | KEPT as fail-loud stub (exits 1 WIRE_REQUIRED); real simulate lines present commented, ready to uncomment at wire | the real invocation needs `cre login` (headless-impossible) — per A-G4 SURVIVOR #2 + INVARIANT ESCALATE, a constant PASS here would fabricate every demo CLEARED; keeping it fail-loud is the correct honest state | UNTESTED | run-cre live wiring deferred to wire (same cre login gate); api/run degrades loudly on a non-enum verdict |
| DEV-401 | apps/web RunRecord + cre.ts→api/run→memo | ARCH §10 RunRecord had no publishDate | threaded `publishDate?: string` end-to-end | CO-1 C requires the live OFAC publishDate in the memo | UNTESTED | none — defaults to explicit "(unavailable)" until the real screen supplies it |
| DEV-402 | apps/web tsconfig/types/layout | scaffold omitted web tsconfig, @types/*, root layout.tsx/globals.css | created standard Next.js config + installed types + root layout + craft-floor globals.css | required for any web build/render | COSMETIC | none |
| DEV-403 | apps/web/lib/ledger.ts (CO-1 A) | `readLedger(fromBlock=0n)` | default to contract deploy block 52676285 (override ATTESTATION_DEPLOY_BLOCK) + chunk fallback ≤45k | both Base Sepolia RPCs reject fromBlock:0 ("pruned history" / "50000 block range") | DEGRADED | none (FIXED) — ledger reads live, correct empty state pre-seed |
| DEV-404 | apps/web/app/api/run/route.ts | ARCH §10 api/run had no try/catch around triggerCreRun | wrapped → 502 DEGRADED with cited reason (A-G4 #2); no bare 500, no fabricated CLEARED | the live CRE-run leg is UNTESTED (cre login deferred; run-cre.sh is the fail-loud stub) | UNTESTED | cockpit renders DEGRADED honestly; live verdict path lights up when CRE wired |
| DEV-405 | apps/web/app/api/run/route.ts (orchestrator inline fix) | handler 500-crashed on a malformed intent (undefined.primaryIdentifier in buildIvms) | added a fail-closed 400 BAD_REQUEST guard before buildIvms | orchestrator independent render test caught a 500 on a malformed POST; graceful 400 is required (debug/stress would flag the 500) | COSMETIC | none — happy path + honest-degrade unchanged; only malformed input now returns clean 400 |

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
| 2 | `pnpm --filter @travelproof/ofac test` | fixture + fail-closed green | 6/6 pass (exact hit, base58 case-sens, EVM case-insens, aka fuzzy, 2x fail-closed SCREEN_DEGRADED) | YES |
| 2 | LIVE SMOKE (real OFAC feed, P0) | fresh publishDate + Garantex self-check | `publishDate 10/28/2026 addrs 1058` + SELF-CHECK PASS | YES |
| 2 | no-cached-list grep (src) | 0 | 0 lines | YES |
| 2 | parser guards | removeNSPrefix+parseTagValue | both present in sdn.ts | YES |
| 2 | C4 `cre workflow simulate` | CLEAR/HIT | BLOCKED — cre login (interactive OAuth), DEV-204 UNTESTED, wire-phase | DEFERRED |
| 3 | `forge test -vvv` (contracts) | 5/5 | 5/5 pass (onlyForwarder, verify+screen cleared, bad report, double-verify no-flip AlreadySet, zero-forwarder revert) | YES |
| 3 | no-PII storage struct | 0 string fields | 0 (struct = bytes32 commitmentHash, 2x uint8, uint64 ts, 2x bool) — confirmed from source + live bytecode ABI | YES |
| 3 | COMMITMENT_KEYS match (verify.workflow vs core) | byte-identical | both `[beneVasp, beneficiaryAccount, origVasp, verifyVerdict]` (A-G4 #2) | YES |
| 3 | C6 `/verify` | registered/401/source | `{registered:true,originatorMatch:true,vaspName:"Beta Exchange Ltd",source:"SYNTHETIC_FALLBACK"}`; 401 on no-key | YES |
| 3 | run-cre.sh stub | exits 1 WIRE_REQUIRED, no constant verdict | exit=1, fail-loud (A-G4 #2) | YES |
| 3.2 | **DEPLOY** (real, Base Sepolia) | TravelRuleAttestation: 0x… non-zero forwarder | **0xa8CD17A860f3A0DE51e1135248F22560d4721738**, tx 0x14328bc1…45d8, block 52676285, status 0x1, forwarder 0xF8344C… (read-back on-chain); COMPLIANT audit | YES |
| 4 | `pnpm --filter web exec tsc --noEmit` | clean | exit 0 | YES |
| 4 | `pnpm --filter web build` | green, routes emitted | compiled OK; 8 routes (/, /cockpit, /ledger, /proof, /proof/[jobId], /record/[jobId], /record/[jobId]/memo.pdf, /api/run) | YES |
| 4 | route render (dev, orchestrator) | 200 | 200 for /, /cockpit, /proof, /proof/[jobId], /ledger, /record/[jobId] | YES |
| 4 | api/run malformed intent | clean 4xx, no 500 | 400 BAD_REQUEST (after DEV-405 inline guard; was 500) | YES |
| 4 | api/run correct intent (CRE not wired) | honest degrade, no fabricated CLEARED | 502 DEGRADED "CRE runner unavailable… beta access pending" (A-G4 #2) | YES |
| 4 | api/run non-applicable | 200 classified | 200, rationale "no CASP party; Travel Rule not engaged" | YES |
| 4 | memo DT-1 citation lint | no 1010.410(f)-as-crypto, no bare "filing" | only "…not a filing" negation + 1010.430 retention cite; no banned string | YES |
| 4 | no-TEE-quote / beta-label | none / present | no enclaveHash/TEE/ran-live copy; "beta access pending" present | YES |
| 4 | UI-coverage gate | all 7 observables reachable | PASS (.feature-coverage.json, 0 re-dispatch) | YES |

## Known Risks (for debug)
- CRE workflows (C4/C3) require `cre login` (interactive OAuth); not completable headless. Deferred to wire-phase per BUILD-HANDOFF. The P0-thesis slice (C7 contract deploy + no-PII + live OFAC parse) does NOT depend on cre login.

## Contract Addresses
| Contract | Network | Address | Tx Hash |
|----------|---------|---------|---------|

## Environment Variables Added
| Key | Source Step | Value/Description |
|-----|-----------|-------------------|
