# PLAN — TravelProof Implementation

> **The build roadmap.** Risk-first, foundation→integration→polish. Every task names its files (with ARCHITECTURE.md section refs), exact commands, expected output, and a commit message. Decision trees sit at every CRITICAL/HIGH risk. Phase gates are non-negotiable.
> scope_mode: **standard** (SPRINT) · build window ~1.5 days + buffer · Architecture is the code reference — copy exactly.

## Section 1: Plan Metadata
- **Architecture:** `ARCHITECTURE.md` (single source of truth; copy code exactly).
- **PRD:** `PRD.md` (product + risks + demo). **Law:** `INVARIANTS.md`. **Decisions:** `DECISIONS.md`.
- **How to use:** execute phases in order; do not start a task until its dependencies' phase gates are green; at any risk point follow the decision tree; after each task, commit with the given message.
- **Stack:** pnpm workspace (TS) + Foundry (Solidity) + Next.js + `@chainlink/cre-sdk` + Base Sepolia 84532.

## Section 2: Phase Overview
| Phase | Purpose | Est | Depends on |
|------|---------|:--:|-----------|
| P0 | Scaffold workspace + franchise skeleton (C0) | 0.15 d | — |
| P1 | Legal core: C1 resolver + C2 IVMS + commitment (+tests) | 0.3 d | P0 |
| P2 | Live OFAC: C5 fetch/parse/screen + C4 DON workflow | 0.3 d | P1 |
| P3 | Chain + enclave: C7 contract + deploy + C6 endpoint + C3 verify workflow | 0.35 d | P1, P2 |
| P4 | Web: C8 cockpit + C9 record/memo + C10 proof + seed | 0.3 d | P1, P3 |
| P5 | Wire validation + demo + DoraHacks submission | 0.5 d | all |
| **Total** | | **1.9 d** | (≤ build days incl. buffer) |

---

## Phase 0 — Scaffold + Franchise Skeleton (C0)

### Task 0.1 (P0.1) — Workspace scaffold
- **Files (ARCHITECTURE.md §1 tree, §11, §12):** `package.json`, `pnpm-workspace.yaml`, `.env.example`, `packages/core/package.json`, `packages/ofac/package.json`, `packages/cre/package.json`, `packages/vasp-registry/package.json`, `apps/web/package.json`, `contracts/foundry.toml`.
- **Commands:**
```bash
mkdir -p travelproof && cd travelproof
corepack enable && pnpm init
# copy package.json, pnpm-workspace.yaml, .env.example, each package.json exactly from ARCHITECTURE.md §11/§12
pnpm install
cp .env.example .env   # fill real values at wire
```
- **Expected:** `pnpm install` completes; workspace links `@travelproof/core`, `@travelproof/ofac`.
- **Commit:** `chore: scaffold pnpm workspace + foundry + env template`

### Task 0.2 (P0.2) — Franchise skeleton (honesty machine, scaffolded at C0)
- **Files:** `CLAIMS.md`, `scripts/verify-claims.ts` (ARCHITECTURE.md §11), `SECURITY.md` (shape from ARCHITECTURE.md §N+12), `docs/pipeline/claims.json` (empty array seed), `evidence/.gitkeep`.
- **Commands:**
```bash
mkdir -p scripts docs/pipeline evidence
echo "[]" > docs/pipeline/claims.json
touch evidence/.gitkeep CLAIMS.md
# author verify-claims.ts exactly from ARCHITECTURE.md §11
# author SECURITY.md to the §N+12 threat-matrix + "Not defended against" shape
```
- **Expected:** `pnpm verify:claims` runs (prints "All claims recompute…" on the empty set).
- **Commit:** `chore(c0): scaffold claims ledger + recompute verifier + SECURITY.md`
- Builds the four franchise surfaces at C0: claims-ledger (`CLAIMS.md`/`claims.json`), recompute verifier (`verify-claims.ts`), `SECURITY.md`, honesty ledger (`SUBMISSION_STATUS.md`, kept current each phase).

### Phase 0 Gate ✅
- [ ] `pnpm install` green; all package.json files present (ARCHITECTURE.md §1 tree).
- [ ] `pnpm verify:claims` runs without error on the empty ledger.
- [ ] `CLAIMS.md`, `SECURITY.md`, `SUBMISSION_STATUS.md`, `docs/pipeline/claims.json`, `evidence/` exist.

---

## Phase 1 — Legal Core (C1 resolver, C2 IVMS, commitment)

### Task 1.1 (P1.1) — Shared types + citation registry
- **Files (ARCHITECTURE.md §3):** `packages/core/src/types.ts`, `packages/core/src/citations.ts`.
- **Commands:** author both exactly from ARCHITECTURE.md §3; `pnpm --filter @travelproof/core exec tsc --noEmit`.
- **Expected:** typecheck clean.
- **Commit:** `feat(core): domain types + frozen citation registry (EU TFR/FATF/FinCEN)`

### Task 1.2 (P1.2) — Resolver (C1) + tests  [implements PRD Appendix K truth table]
- **Files (ARCHITECTURE.md §3):** `packages/core/src/resolver.ts`, `packages/core/test/resolver.test.ts`.
- **Commands:**
```bash
# author resolver.ts + resolver.test.ts exactly from ARCHITECTURE.md §3 + §12
pnpm --filter @travelproof/core test
```
- **Expected:** 4+ tests green (CASP→CASP below threshold = EU_TFR; above = BOTH; no-CASP = NONE; determinism).
- **Decision point → DT-1 (citation correctness).**
- **Commit:** `feat(core): deterministic Travel Rule resolver + truth-table tests`

### Task 1.3 (P1.3) — IVMS101 builder + validator (C2) + commitment + tests
- **Files (ARCHITECTURE.md §4, §11):** `packages/core/src/ivms.ts`, `packages/core/src/commitment.ts`, `packages/core/test/ivms.test.ts`, `packages/core/test/commitment.test.ts`.
- **Commands:**
```bash
# author exactly from ARCHITECTURE.md §4 (ivms.ts) + §4 (commitment.ts) + §12 (tests)
pnpm --filter @travelproof/core test
```
- **Expected:** C1 violation caught when no identifying element; C6 requires LEGL; commitment deterministic + changes with verdict.
- **Commit:** `feat(core): IVMS101 builder+validator (C1/C6) + keccak256 commitment`

### Phase 1 Gate ✅
- [ ] `pnpm --filter @travelproof/core test` all green (resolver + ivms + commitment).
- [ ] `tsc --noEmit` clean.
- [ ] Resolver cites only registry strings; `NEEDS_HUMAN_REVIEW` on unknown CASP status (DT-1).
- [ ] Commitment recomputes identically (round-trip pre-req).
- [ ] Update `SUBMISSION_STATUS.md`: C1, C2 → [x].

---

## Phase 2 — Live OFAC (C5 fetch/parse/screen, C4 DON workflow)

### Task 2.1 (P2.1) — OFAC fetcher/parser + screen (C5) + fixture tests
- **Files (ARCHITECTURE.md §5, §12):** `packages/ofac/src/sdn.ts`, `packages/ofac/src/screen.ts`, `packages/ofac/test/fixtures/sdn-sample.xml`, `packages/ofac/test/sdn.test.ts`.
- **Commands:**
```bash
# author exactly from ARCHITECTURE.md §5 + §12
pnpm --filter @travelproof/ofac test
# live smoke (real feed):
node -e "import('@travelproof/ofac/sdn').then(async m=>{const i=await m.fetchAndIndexSdn();console.log('publishDate',i.publishDate,'addrs',i.addresses.size);m.assertDemoHitPresent(i,process.env.DEMO_HIT_ADDRESS||'3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1')})"
```
- **Expected:** fixture tests green (Garantex XBT exact hit, base58 case-sensitive, EVM case-insensitive, aka fuzzy); live smoke prints a recent `publishDate` and the self-check passes.
- **Decision point → DT-3 (live OFAC feed) and DT-12 (demo address delisted).**
- **Commit:** `feat(ofac): live SDN fetch+stream-parse+screen (exact addr, fuzzy name) + self-check`

### Task 2.2 (P2.2) — DON-consensus screen workflow (C4)
- **Files (ARCHITECTURE.md §8, §11):** `packages/cre/src/screen.workflow.ts`, `packages/cre/src/config.ts`, `packages/cre/config.json`.
- **Commands:**
```bash
# author exactly from ARCHITECTURE.md §8 + §11; install cre CLI; cre login
cre workflow build packages/cre/src/screen.workflow.ts
cre workflow simulate packages/cre/src/screen.workflow.ts --input '{"jobId":"0x..","beneficiaryAddress":"0xB0B..","beneficiaryName":"Okafor"}'
```
- **Expected:** simulate returns `screenVerdict` CLEAR for a clean address, HIT for the Garantex address; `.withDefault("DEGRADED")` on a forced feed failure.
- **Decision point → DT-5 (CRE beta-gated) and DT-6 (subsystem slipping).**
- **Commit:** `feat(cre): DON-consensus OFAC screen workflow (consensusIdenticalAggregation)`

### Phase 2 Gate ✅
- [ ] `pnpm --filter @travelproof/ofac test` green; live smoke prints a fresh `publishDate` + self-check passes (DT-3).
- [ ] `cre workflow simulate` of the screen workflow returns CLEAR + HIT correctly.
- [ ] No src code uses a local XML as the SDN data source: `grep -rn "fixtures/sdn\|\.xml" packages/ofac/src packages/cre/src` → 0 (the `test/fixtures/sdn-sample.xml` fixture is allowed; it must NEVER be referenced from `src/`).
- [ ] `parseSdn` fails closed on an empty/namespace-broken parse (throws `SCREEN_DEGRADED`, never an empty index → false CLEAR).
- [ ] Update `SUBMISSION_STATUS.md`: C5, C4 → [x].

---

## Phase 3 — Chain + Enclave (C7 contract, deploy, C6 endpoint, C3 verify)

### Task 3.1 (P3.1) — Attestation contract (C7) + tests
- **Files (ARCHITECTURE.md §9):** `contracts/src/interfaces/IReceiver.sol`, `contracts/src/TravelRuleAttestation.sol`, `contracts/test/TravelRuleAttestation.t.sol`, `contracts/foundry.toml`.
- **Commands:**
```bash
cd contracts && forge install foundry-rs/forge-std --no-commit
# author contracts exactly from ARCHITECTURE.md §9
forge test -vvv
```
- **Expected:** 3 tests green (onlyForwarder revert, verify+screen→CLEARED read-back, bad report revert).
- **Decision point → DT-2 (attestation visible).**
- **Commit:** `feat(contracts): TravelRuleAttestation (no-PII storage, forwarder-guarded) + tests`

### Task 3.2 (P3.2) — Deploy to Base Sepolia
- **Files (ARCHITECTURE.md §9, §N+9):** `contracts/script/Deploy.s.sol`.
- **Commands:**
```bash
# .env must carry DEPLOYER_PRIVATE_KEY (funded) + KEYSTONE_FORWARDER_ADDR (read at wire)
cast chain-id --rpc-url "$BASE_SEPOLIA_RPC_URL"   # expect 84532
forge script contracts/script/Deploy.s.sol:Deploy --rpc-url base_sepolia --broadcast -vvvv
# record the address -> .env ATTESTATION_ADDRESS + submission/proof.md
```
- **Expected:** `cast chain-id` → `84532`; deploy prints `TravelRuleAttestation: 0x…`; visible on BaseScan.
- **Decision point → DT-10 (RPC flaky / contract durability).**
- **Commit:** `chore(deploy): TravelRuleAttestation on Base Sepolia 84532 @ <addr>`
- **Ownership:** the on-chain attestation contract transaction is executed during build; the judged **live_deploy** (hosted app + portfolio README + screenshots) is `owner: deploy-to-github @ deploy`.

### Task 3.3 (P3.3) — VASP registry verify endpoint (C6)
- **Files (ARCHITECTURE.md §6):** `packages/vasp-registry/src/server.ts`.
- **Commands:**
```bash
# author exactly from ARCHITECTURE.md §6
VASP_VERIFY_KEY=dev-key pnpm --filter @travelproof/vasp-registry start &
curl -s -X POST localhost:8787/verify -H "Authorization: Bearer dev-key" -H "content-type: application/json" -d '{"vaspLei":"984500AB12CD34EF5678","originatorHash":"0x4d2f"}'
curl -si -X POST localhost:8787/verify -d '{}'   # expect 401 without key
```
- **Expected:** registered VASP → `{registered:true,originatorMatch:true,vaspName:"Beta Exchange Ltd"}`; no key → 401.
- **Decision point → DT-8 (registry mock disclosure).**
- **Commit:** `feat(vasp-registry): mock verify endpoint + TRISA production-path note`

### Task 3.4 (P3.4) — Confidential-HTTP verify workflow (C3)
- **Files (ARCHITECTURE.md §7):** `packages/cre/src/verify.workflow.ts`.
- **Commands:**
```bash
# author exactly from ARCHITECTURE.md §7; register VASP_VERIFY_KEY as a CRE Vault DON secret
cre workflow simulate packages/cre/src/verify.workflow.ts --input '{"jobId":"0x..","vaspLei":"984500AB..","originatorHash":"0x..","beneficiaryAccount":"0xB0B","origVasp":"L1","beneVasp":"L2"}'
```
- **Expected:** simulate runs the Confidential HTTP call in-enclave; emits a report with `verifyVerdict` + a commitment; broadcast delivers to C7.
- **Decision point → DT-4 (no TEE quote — honest commitment) and DT-5 (beta-gated → simulate path).**
- **Commit:** `feat(cre): Confidential-HTTP in-enclave verify workflow (honest commitment, no TEE-quote claim)`

### Task 3.4b (P3.4b) — Wire `run-cre.sh` from the fail-loud stub to the real invocation
- **Files (ARCHITECTURE.md §12):** `scripts/run-cre.sh` (the stub exits 1 with `WIRE_REQUIRED` by design).
- **Commands:**
```bash
# replace the exit-1 block with the real cre simulate --broadcast calls; capture real verdicts + tx hashes; set CRE_WIRED=1
grep -n "WIRE_REQUIRED\|exit 1" scripts/run-cre.sh   # must be gone / guarded after wiring
CRE_WIRED=1 bash scripts/run-cre.sh "$(cat /tmp/clean-intent.json)"   # expect real {verifyVerdict,screenVerdict,txHashes}
```
- **Expected:** emits REAL enum verdicts (`screenVerdict` ∈ CLEAR|HIT|DEGRADED) + real tx hashes; `api/run` no longer degrades on a sentinel. The stub must never ship a constant PASS.
- **Decision point → DT-5 (beta-gated → simulate path) and DT-3 (live screen).**
- **Commit:** `feat(cre): wire run-cre.sh to real cre simulate --broadcast (no fabricated verdicts)`

### Phase 3 Gate ✅
- [ ] `forge test` green (**5/5**: onlyForwarder, verify+screen cleared, bad report, double-verify no-flip, zero-forwarder revert); `cast chain-id` → 84532; contract on BaseScan (DT-2/DT-10).
- [ ] `ATTESTATION_ADDRESS` recorded in `.env` + `submission/proof.md`; contract deployed with a NON-zero forwarder (constructor reverts on address(0)).
- [ ] C6 endpoint returns registered/401 correctly (DT-8).
- [ ] `cre workflow simulate` of verify runs in-enclave; commitment computed, NOT claimed as a TEE quote (DT-4).
- [ ] **Commitment round-trip at P3 (not deferred):** the simulate-emitted on-chain `commitmentHash` equals `commitmentHash(commitmentInputFromIvms(ivms, verifyVerdict))` recomputed off-chain (same `COMMITMENT_KEYS` order). Mismatch = STOP (the verify workflow + commitment.ts must share the exact canonical serialization).
- [ ] `run-cre.sh` wired (P3.4b) — emits real enum verdicts, no `WIRE_REQUIRED`/sentinel; `api/run` degrades loudly if a non-enum verdict ever appears.
- [ ] Update `SUBMISSION_STATUS.md`: C7, C6, C3 → [x].

---

## Phase 4 — Web (C8 cockpit, C9 record/memo, C10 proof, seed)

### Task 4.1 (P4.1) — Chain read lib + run store + CRE runner
- **Files (ARCHITECTURE.md §10):** `apps/web/lib/chain.ts`, `apps/web/lib/runStore.ts`, `apps/web/lib/cre.ts`, `apps/web/lib/seedIds.ts`, `apps/web/next.config.ts`, `apps/web/app/actions.ts`, `apps/web/app/api/run/route.ts`.
- **Commands:** author exactly from ARCHITECTURE.md §10/§12; `pnpm --filter web exec tsc --noEmit`.
- **Expected:** typecheck clean; `getAttestation` reads C7 with RPC fallback.
- **Commit:** `feat(web): chain read + run store + run orchestration API`

### Task 4.2 (P4.2) — Cockpit (C8) + landing + record (C9) + proof (C10) + memo PDF
- **Files (ARCHITECTURE.md §10, §12):** `apps/web/app/page.tsx`, `apps/web/app/cockpit/page.tsx`, `apps/web/app/record/[jobId]/page.tsx`, `apps/web/app/proof/[jobId]/page.tsx`, `apps/web/lib/memo.tsx`.
- **Commands:**
```bash
pnpm --filter web dev   # manual: run a CLEARED transfer + the Garantex DO-NOT-TRANSMIT flip
pnpm --filter web build
```
- **Expected:** cockpit runs CLEARED (green → record) and DO-NOT-TRANSMIT (red, cited basis); proof page resolves an attestation cold and shows the no-PII panel; memo exports PDF.
- **Decision point → DT-2 (privacy visible) and DT-7 (lawyer-recognizable memo).**
- **Commit:** `feat(web): cockpit + landing + record/memo + cold proof page`

### Task 4.3 (P4.3) — Seed demo (earned state)
- **Files (ARCHITECTURE.md §11):** `scripts/seed-demo.ts`, `scripts/run-cre.sh`.
- **Commands:**
```bash
pnpm seed                      # prepares the two intents + claims.json
bash scripts/run-cre.sh "$(cat /tmp/clean-intent.json)"    # real CRE run -> on-chain
bash scripts/run-cre.sh "$(cat /tmp/garantex-intent.json)" # real CRE run -> on-chain
pnpm verify:claims             # recompute matches on-chain
```
- **Expected:** two attestations on Base Sepolia (CLEARED + BLOCKED); `verify:claims` prints "All claims recompute and match on-chain." (round-trip proven).
- **Decision point → DT-3 (live), DT-12 (address present).**
- **Commit:** `chore(seed): real CLEARED + BLOCKED attestations + claims recompute`

### Phase 4 Gate ✅
- [ ] `pnpm --filter web build` green.
- [ ] Cockpit CLEARED + DO-NOT-TRANSMIT both work against the live feed.
- [ ] Proof page cold-opens and shows the no-PII panel; `cast call getAttestation` reproduces (DT-2).
- [ ] `pnpm verify:claims` green (round-trip, DT-4).
- [ ] Landing shows the seeded sample attestation (judge 10-sec test).
- [ ] Update `SUBMISSION_STATUS.md`: C8, C9, C10, seed → [x].

---

## Phase 5 — Wire Validation + Demo + Submission

### Task 5.1 (P5.1) — Wire-validation checklist (PRD §15)
- **Commands:** run each PRD §15 item; record results in `submission/proof.md`.
```bash
cre login && cre whoami
cre workflow simulate packages/cre/src/verify.workflow.ts ...   # confirm Confidential HTTP in simulate (DT-5)
# capture: KeystoneForwarder addr, attestation addr, 2 tx hashes, live Publish_Date
pnpm verify:claims
```
- **Expected:** all 6 §15 items pass or a documented degradation recorded in LIMITATIONS.md.
- **Decision point → DT-5 (beta-gated), DT-4 (round-trip).**
- **Commit:** `chore(wire): validate CRE simulate + forwarder + round-trip; record proof.md`

### Task 5.2 (P5.2) — Demo video (≤300s, workflow-first)  *(owner: hackathon-demo @ demo)*
- **Files:** `submission/video/links.md`.
- **Commands:** record the 7-scene demo (PRD §6 + Appendix M); keep a fallback clip of the real run (DT-10).
- **Commit:** `docs(submission): demo video link + fallback clip`

### Task 5.3 (P5.3) — DoraHacks BUIDL submission  *(owner: hackathon-package @ package)*
- **Files:** `submission/proof.md`, `submission/links.md`, `submission/sponsor-tracks.md`.
- **Commands:** draft the BUIDL (Details blueprint, no em dashes); include ATTESTATION_ADDRESS + chainId 84532 + BaseScan links.
- **Commit:** `docs(submission): DoraHacks BUIDL draft + proof + track mapping`

### Phase 5 Gate ✅
- [ ] PRD §15 wire items all pass or degradation documented.
- [ ] Demo recorded; fallback clip exists.
- [ ] BUIDL draft complete with deployed address + chainId + live URLs.
- [ ] `SUBMISSION_STATUS.md` fully current; LIMITATIONS.md reflects any degradation.

---

## Section N: Decision Trees (CRITICAL + HIGH risks — one per R1..R8)

#### DT-1 — Citation correctness (R1, CRITICAL)
Run: `grep -nE "1010\.410\(f\)|filing" packages/core/src/*.ts apps/web/lib/memo.tsx`
Expected: no match presenting §1010.410(f) as the crypto authority; no "filing" verb for a transmittal.
✅ **Clean:** proceed.
🔀 **If a banned string appears:** 1) replace with the registry string (`CITATIONS.EU_TFR_ORIG`/`FATF_REC16`); 2) re-run the lint; 3) have the skeptical-lawyer persona re-read the memo.
⛔ **If unsure which authority:** default to EU TFR Art.14 + FATF Rec.16 (the crypto-correct pair); FinCEN only as US context; never as the crypto authority.

#### DT-2 — Attestation visible on-chain (R2, CRITICAL)
Run: open `https://sepolia.basescan.org/address/$ATTESTATION_ADDRESS#events`; run the proof page.
✅ `EnclaveAttestation` events present + proof page resolves → proceed.
🔀 **If no event:** 1) check the report decode (length 96 verify / 64 screen); 2) confirm the forwarder address; 3) re-run the CRE broadcast.
⛔ **If forwarder delivery is gated:** read C7 storage directly in the proof panel via `getAttestation` (still real, on-chain); document the delivery degradation.

#### DT-3 — OFAC feed live / not stubbed (R3, CRITICAL)
Run: the P2.1 live smoke (`fetchAndIndexSdn` + `assertDemoHitPresent`).
✅ fresh `publishDate` + self-check passes → proceed.
🔀 **If HTTP error:** 1) retry following the 302 to the S3 URL; 2) check network; 3) the workflow returns `SCREEN_DEGRADED` (loud) — NEVER serve a cached clear.
⛔ **If feed down at demo time:** pause the demo on that beat; show the degraded state honestly; do NOT fabricate a CLEAR.

#### DT-4 — No TEE-quote claim / honest commitment (R4, HIGH)
Run: `grep -niE "enclaveHash|TEE quote|remote attestation|hardware attestation" .` (expect none in copy/claims).
✅ none → proceed; commitment recomputes (`pnpm verify:claims`).
🔀 **If such copy exists:** 1) rewrite to "verification ran via CRE Confidential HTTP; only the commitment + verdict reached chain, signed by the DON"; 2) re-run the overclaim lint.
⛔ **Never** add a fabricated attestation quote to satisfy a reviewer — the DON signature is the real anchor.

#### DT-5 — CRE Confidential HTTP beta-gated (R5, HIGH)
Run: `cre workflow simulate packages/cre/src/verify.workflow.ts ...`
✅ simulate runs the Confidential HTTP call → proceed (no invite needed for simulate).
🔀 **If simulate rejects Confidential HTTP:** 1) request the private-beta invite (Google Form); 2) meanwhile run the verify step as a LABELED stand-in while keeping the OFAC screen fully real; 3) document in LIMITATIONS.md.
⛔ **Never** block the whole demo — the OFAC screen + attestation are real regardless.

#### DT-6 — A subsystem slipping under the window (R6, HIGH)
Trigger: a day-2 subsystem is behind.
✅ On track → proceed.
🔀 **If behind:** keep the DON OFAC screen + contract fully REAL (P0); thin the verify endpoint to the disclosed mock; keep the resolver/IVMS/record untouched.
⛔ **Never blanket-mock** to "finish" — cut the COUNT of features (e.g. drop the verify polish), never fake a real one.

#### DT-7 — Memo not lawyer-recognizable (R7, HIGH)
Run: render a CLEARED memo; read it as a skeptical senior lawyer.
✅ IVMS field labels + cited rule + signature block present → proceed.
🔀 **If it reads like a dev console:** 1) add IVMS 101.2023 field labels + constraint names; 2) add the PDF export + signature block; 3) re-read.
⛔ **If still weak:** lead the memo with the plain-language transmittal statement + the citation, demote the JSON.

#### DT-8 — VASP registry mock undisclosed (R8, HIGH)
Run: confirm LIMITATIONS.md + the memo footer disclose the mock + TRISA path.
✅ disclosed → proceed.
🔀 **If undisclosed:** 1) add the disclosure to LIMITATIONS.md + the memo footer + the server log line; 2) name TRISA testnet directory as the production path.
⛔ **Never** present the mock as a live registry integration.

#### DT-9..DT-12 (MED/LOW — summarized; full in PRD Appendix D)
- **DT-9 (two-VASP):** answer "step 1 of 2; TRISA production path".
- **DT-10 (RPC/durability):** fallback RPC; durable deploy; backup tx clip.
- **DT-11 (ClearRelease overlap):** lead with the filable record + correct citations + verify-but-hide.
- **DT-12 (demo address delisted):** re-verify day-of; startup self-check fails loud before the demo.

---

## Section N+1: Forge→Build Step Mapping (winning-pattern artifacts)
| PLAN step | What | ARCHITECTURE ref | Build upgrade |
|-----------|------|------------------|---------------|
| P0.2 | Franchise skeleton (CLAIMS/verify-claims/SECURITY/status) | §11, §N+12 | #C0 |
| P1.1 | Domain knowledge (`DOMAIN-GUIDE.md`) from §N+1 | §N+1 | #18 |
| P4.3 | Seed demo script (earned state) | §11 | #19 |
| per-task | Test file alongside each source | §N+7, §12 | #20 |
| P3.2/P5.1 | Proof capture (tx hashes → proof.md) | PRD §7.6 | #21 |
| P4.2 | `/proof` route | PRD §7.6 | #22 |
| P1/P2 | Test dirs set up | §N+7 | #23 |

## Section N+2: Skill-Ownership Map
Every owned deliverable routed to its owning skill+phase (build does build-work only):
| Deliverable | Owner | Phase | PLAN task |
|-------------|-------|------|-----------|
| C1–C10 implementation, tests, domain guide, seed, proof route, CLAIMS | hackathon-build | build | P0–P4 |
| Real Base Sepolia deploy tx (attestation) | hackathon-build | build | P3.2 |
| Portfolio README, live deploy hosting, screenshots | deploy-to-github | deploy | (post-build) |
| Demo video | hackathon-demo | demo | P5.2 |
| Submission bundle (DoraHacks BUIDL) | hackathon-package | package | P5.3 |
| UI polish / design system / logo (if pursued) | owner: design-forge @ design_forge | design_forge | (optional, post-build) |

- The design_system / logo / UI-polish deliverable is `owner: design-forge @ design_forge` (and UI-revamp work `owner: ui-revamp @ design_forge`) — optional for TravelProof (the win is legal credibility, not visual design); never built by hackathon-build.
- build-owned tasks carry `owner: hackathon-build @ build`.
- Judged-surface deliverables (live_deploy, demo_video, submission_bundle) are routed to their owners (deploy-to-github/hackathon-demo/hackathon-package), never improvised by build.
- No generic agent substitutes for a named owning skill; build runs only after these forge docs are on disk.

## Section N+3: Spec Freeze
Spec frozen at forge exit. The canonical hero/thesis lives only in `warroom/WINNER-BRIEF.md ## Thesis`; these docs reference it. Any post-freeze doc change carries a change-order entry in `.forge-state.json.specFreeze.changeOrders`.

## Section N+4: Per-skill build notes
- **build:** legal-document surface (the memo) is as important as the contract; keep the resolver deterministic; never commit a cached SDN list.
- **wire:** validate CRE node access + Confidential HTTP job-spec in `cre workflow simulate` BEFORE relying on it (DT-5); capture the KeystoneForwarder address.
- **livetest:** test BOTH halves — the chain side (attestation on BaseScan) AND the legal-output side (the filable memo + citations).
- **demo:** workflow-first (the lawyer's view), not code-first; the enclave two-pane + the DO-NOT-TRANSMIT flip are the money beats.
- **package:** DoraHacks BUIDL with the Details blueprint; include deployed address + chainId 84532.

---

## Section N+5: File Creation Coverage (every ARCHITECTURE.md tree file → task)

METRIC 1 coverage. Every source/config file in the ARCHITECTURE.md §1 tree has a creation task. Generated artifacts and separately-authored docs are marked.

| File | Task | ARCH ref |
|------|------|----------|
| `package.json` | P0.1 | §11 |
| `pnpm-workspace.yaml` | P0.1 | §12 |
| `.env.example` | P0.1 | §12 |
| `packages/core/package.json` | P0.1 | §11 |
| `packages/core/src/types.ts` | P1.1 | §3 |
| `packages/core/src/citations.ts` | P1.1 | §3 |
| `packages/core/src/resolver.ts` | P1.2 | §3 |
| `packages/core/src/ivms.ts` | P1.3 | §4 |
| `packages/core/src/commitment.ts` | P1.3 | §4 |
| `packages/core/test/resolver.test.ts` | P1.2 | §12 |
| `packages/core/test/ivms.test.ts` | P1.3 | §12 |
| `packages/core/test/commitment.test.ts` | P1.3 | §12 |
| `packages/ofac/package.json` | P0.1 | §12 |
| `packages/ofac/src/sdn.ts` | P2.1 | §5 |
| `packages/ofac/src/screen.ts` | P2.1 | §5 |
| `packages/ofac/test/fixtures/sdn-sample.xml` | P2.1 | §12 |
| `packages/ofac/test/sdn.test.ts` | P2.1 | §12 |
| `packages/cre/package.json` | P0.1 | §12 |
| `packages/cre/src/config.ts` | P2.2 | §7 |
| `packages/cre/config.json` | P2.2 | §12 |
| `packages/cre/src/screen.workflow.ts` | P2.2 | §8 |
| `packages/cre/src/verify.workflow.ts` | P3.4 | §7 |
| `packages/vasp-registry/package.json` | P0.1 | §12 |
| `packages/vasp-registry/src/server.ts` | P3.3 | §6 |
| `contracts/foundry.toml` | P0.1 / P3.1 | §9 |
| `contracts/src/interfaces/IReceiver.sol` | P3.1 | §9 |
| `contracts/src/TravelRuleAttestation.sol` | P3.1 | §9 |
| `contracts/test/TravelRuleAttestation.t.sol` | P3.1 | §9 |
| `contracts/script/Deploy.s.sol` | P3.2 | §9 |
| `apps/web/package.json` | P0.1 | §12 |
| `apps/web/next.config.ts` | P4.1 | §12 |
| `apps/web/lib/chain.ts` | P4.1 | §10 |
| `apps/web/lib/runStore.ts` | P4.1 | §10 |
| `apps/web/lib/cre.ts` | P4.1 | §10 |
| `apps/web/lib/seedIds.ts` | P4.1 | §12 |
| `apps/web/app/actions.ts` | P4.1 | §12 |
| `apps/web/app/api/run/route.ts` | P4.1 | §10 |
| `apps/web/app/page.tsx` | P4.2 | §12 |
| `apps/web/app/cockpit/page.tsx` | P4.2 | §10 |
| `apps/web/app/record/[jobId]/page.tsx` | P4.2 | §12 |
| `apps/web/app/proof/[jobId]/page.tsx` | P4.2 | §10 |
| `apps/web/lib/memo.tsx` | P4.2 | §10 |
| `scripts/verify-claims.ts` | P0.2 | §11 |
| `scripts/seed-demo.ts` | P4.3 | §11 |
| `scripts/run-cre.sh` | P4.3 | §12 |
| `CLAIMS.md` | P0.2 | §N+12 |
| `SECURITY.md` | P0.2 | §N+12 |
| `docs/pipeline/claims.json` | P0.2 (seeded) / P4.3 (populated) | §11 |
| `submission/proof.md` | P3.2 / P5.1 (generated) | §N+2 |
| `DECISIONS.md` / `LIMITATIONS.md` / `SUBMISSION_STATUS.md` | forge-authored (kept current by build) | — |

Every authored source/config file maps to a task. Markdown docs + generated artifacts are noted as such.

---

## Section N+6: Expected-Output Transcripts (what "green" looks like)

### P1.2 resolver test
```
✓ CASP->CASP below FATF threshold still applies under EU TFR
✓ CASP->CASP above threshold is BOTH
✓ no CASP in path is NONE/false
✓ determinism: same input, same output
Test Files  1 passed (1)   Tests  4 passed (4)
```

### P2.1 OFAC live smoke
```
publishDate 10/28/2026 addrs 1050
# assertDemoHitPresent passes silently; non-zero exit + STARTUP_SELFCHECK_FAIL if Garantex delisted
```

### P2.2 screen simulate (HIT case)
```
# The DON report encodes only (jobId, screenVerdict). matchedUid is UI-only metadata, NOT in the report.
screenVerdict=HIT    # Garantex address (UI separately shows matchedUid=36025)
screenVerdict=CLEAR  # clean address
```

### P3.1 forge test
```
Ran 5 tests for test/TravelRuleAttestation.t.sol:TravelRuleAttestationTest
[PASS] test_badReportReverts() [PASS] test_onlyForwarderCanReport() [PASS] test_verifyThenScreen_cleared()
[PASS] test_doubleVerifyReverts_noFlip() [PASS] test_zeroForwarderDeployReverts()
Suite result: ok. 5 passed; 0 failed
```

### P3.2 deploy
```
cast chain-id --rpc-url $BASE_SEPOLIA_RPC_URL  -> 84532
== Logs ==  TravelRuleAttestation: 0xABCD...1234
# record 0xABCD...1234 -> .env ATTESTATION_ADDRESS + submission/proof.md
```

### P4.3 verify:claims
```
All claims recompute and match on-chain.
# evidence/verify-claims.json written with {jobId, recomputed, onchain, match:true} x2
```

If any transcript differs, STOP and follow the matching decision tree; do not proceed on a red.

---

## Section N+7: Phase Verification Table (observable proof per phase)
| Phase | Observable that proves it | Sentinel-fail |
|------|---------------------------|---------------|
| P0 | `pnpm install` + `pnpm verify:claims` exit 0 | missing franchise file |
| P1 | core test suite green; resolver determinism | a verdict set by anything non-deterministic |
| P2 | live `publishDate` fresh + Garantex HIT + clean CLEAR | a CLEAR while the feed was down |
| P3 | 3/3 forge tests; attestation tx on BaseScan; verify simulate runs | onReport writable by a non-forwarder |
| P4 | cockpit CLEARED + flip; proof cold-open no-PII panel; verify:claims green | a fabricated tx / forced verdict |
| P5 | §15 wire items pass; BUIDL has addr+chainId+URLs | a prerecorded clip presented as live without disclosure |

---

## Section N+8: Calendar Schedule (standard scope)
| Day | AM | PM | Deliverable |
|----|----|----|-------------|
| D1 | P0 scaffold+skeleton; P1 legal core (C1/C2/commitment) + tests | P2 live OFAC (C5) + DON screen workflow (C4) | core green; live screen CLEAR+HIT |
| D2 | P3 contract deploy (C7) + verify endpoint (C6) + Confidential-HTTP verify (C3) | P4 web (C8/C9/C10) + seed | end-to-end CLEARED + DO-NOT-TRANSMIT + proof page; 2 attestations on-chain |
| D3 | P5 wire validation + demo video | DoraHacks BUIDL draft + submit | packaged by Oct 31 20:00 WAT |
Buffer: the P5 morning is the slip buffer; if a day-2 subsystem is behind, DT-6 governs the cut (never blanket-mock).

---

## Section N+9: Full DT-9..DT-12 (MED/LOW decision trees, expanded)

#### DT-9 — Two-VASP handshake question (R9, MED)
Trigger: a FATF-literate judge asks "where does the beneficiary VASP receive this?"
✅ Answer: "This is step 1 of 2 — the originating-side assembly + attestation. Beneficiary receipt is the TRISA handshake, named as the production path in LIMITATIONS.md."
🔀 If pressed on completeness: show the LIMITATIONS.md in-scope/out-of-scope split; the honesty is the credibility signal.
⛔ Never claim the beneficiary received the message.

#### DT-10 — Base RPC flaky / contract durability (R10, MED)
Run: `cast chain-id --rpc-url $BASE_SEPOLIA_RPC_URL`.
✅ 84532 + proof page loads → proceed.
🔀 If the primary RPC errors: `lib/chain.ts` falls back to `BASE_SEPOLIA_RPC_FALLBACK` automatically; verify the fallback responds.
⛔ If both RPCs + the contract are unreachable during judging: play the backup tx clip (real run), disclose, and give the BaseScan link for later verification.

#### DT-11 — Judge conflates with ClearRelease (R11, MED)
Trigger: "isn't this just sanctions screening?"
✅ Lead: "The screen is one DON-attested input. The product is the filable IVMS101 record + cited memo, and the verify-but-hide enclave privacy — neither of which a screen-only tool produces."
🔀 Show the filable PDF + the correct citations + the no-PII proof panel.
⛔ Don't argue on screening depth alone — the differentiator is the record + privacy + citations.

#### DT-12 — Demo address delisted before judging (R12, MED)
Run: the P2.1 self-check on demo morning.
✅ Garantex present → proceed.
🔀 If delisted: pick another currently-active SDN Digital Currency Address from a fresh fetch (confirm present), update `DEMO_HIT_ADDRESS`, re-run the self-check.
⛔ Never hard-code faith — the self-check fails loud before the demo if the address is gone.

---

## Section N+10: Commands Quick Reference
```bash
# install + build
pnpm install && pnpm build
# core tests
pnpm --filter @travelproof/core test
pnpm --filter @travelproof/ofac test
# contracts
cd contracts && forge test -vvv && cd ..
# deploy
forge script contracts/script/Deploy.s.sol:Deploy --rpc-url base_sepolia --broadcast
# CRE
cre login && cre workflow simulate packages/cre/src/screen.workflow.ts --input '<json>'
cre workflow simulate packages/cre/src/verify.workflow.ts --input '<json>' --broadcast --target base-sepolia
# vasp registry
pnpm --filter @travelproof/vasp-registry start
# web
pnpm --filter web dev    # then: pnpm --filter web build
# seed + verify
pnpm seed && pnpm verify:claims
# lints (invariants)
grep -nE "1010\.410\(f\)|filing" packages/core/src/*.ts apps/web/lib/memo.tsx   # DT-1
grep -niE "enclaveHash|TEE quote|remote attestation" .                           # DT-4
```

---

## Section N+11: Component Acceptance Criteria (observables — seeds FEATURE-OBSERVABLES.md)

Each is a verifiable test the feature WORKS, not that it exists.

| Feature | Observable | Test command | Sentinel-fail |
|---------|-----------|--------------|---------------|
| F-001 Applicability is deterministic + cited | `classify()` returns a registry citation and identical output across runs | `pnpm --filter @travelproof/core test -t determinism` | citation is empty or varies run-to-run |
| F-002 No AI on the decision path | decision module imports no model/LLM | `grep -rniE "openai|anthropic|llm|model\\.|generate" packages/core/src` → 0 | any model call in core |
| F-003 IVMS C1/C6 enforced | dropping `customerIdentification` yields a C1 violation | `pnpm --filter @travelproof/core test -t "C1 violation"` | validator reports complete with no identifier |
| F-004 OFAC screen is LIVE | fresh `publishDate` surfaced; Garantex HIT; clean CLEAR | P2.1 live smoke | a CLEAR returned while feed unreachable |
| F-005 base58 case-sensitivity | lowercased Garantex addr does NOT match | `pnpm --filter @travelproof/ofac test -t "base58"` | lowercased base58 matches |
| F-006 No PII on-chain | every `getAttestation` field is bytes32/uint; no string field in the ABI | `cast call $ATTESTATION_ADDRESS "getAttestation(bytes32)" $JOBID` returns 4 non-string values | an identity string decodable from storage |
| F-007 Forwarder guard | non-forwarder `onReport` reverts | `forge test -t onlyForwarder` | a non-forwarder write succeeds |
| F-008 Honest commitment (no TEE quote) | commitment recomputes off-chain == on-chain | `pnpm verify:claims` | mismatch, or copy claims a TEE quote |
| F-009 DO-NOT-TRANSMIT flip | Garantex transfer → BLOCKED, cited basis, no record assembled | cockpit e2e | a CLEARED verdict on the Garantex address |
| F-010 Cold proof | `/proof/[jobId]` resolves with no wallet/login | open the URL in a fresh browser profile | requires auth/wallet to view |

Build writes these to `FEATURE-OBSERVABLES.md` (forge seeds the set at Phase 4 output).

---

## Section N+12: Integration Wiring Runbook (from ARCHITECTURE.md §N+11 Integration Map)

Execute in this order (each has a health check; do not proceed on a red):
1. **OFAC feed → C5** (P0): `curl -sIL "$OFAC_SDN_URL"` → expect `HTTP .. 200` and `content-type: text/xml` after the 302. If it stalls, the client must `redirect: follow` to the S3 URL.
2. **C6 endpoint up** (P3.3): `pnpm --filter @travelproof/vasp-registry start`; `curl -si -X POST :8787/verify` → `401` without the key; with the key → JSON. Register `VASP_VERIFY_KEY` as a CRE Vault DON secret before C3 uses it.
3. **C7 deployed** (P3.2): `cast code $ATTESTATION_ADDRESS --rpc-url base_sepolia` → non-empty bytecode. Set `KEYSTONE_FORWARDER_ADDR` from CRE docs at the constructor.
4. **CRE → KeystoneForwarder → C7** (P3.4/P4.3): `cre workflow simulate … --broadcast`; confirm a report tx appears on BaseScan and an `EnclaveAttestation` event is emitted. If delivery is gated, DT-2 fallback (read storage directly).
5. **Web → Base RPC** (P4.1): `cast chain-id --rpc-url $BASE_SEPOLIA_RPC_URL` → `84532`; the proof page reads `getAttestation` with the fallback RPC on error.
6. **cre login** (P2.2): `cre whoami` → authenticated; required for simulate.

Wire's primary input is this runbook + the Integration Map; wire pre-populates its test list from these rows.

---

## Section N+13: Troubleshooting Runbook (beyond the decision trees)
| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `pnpm install` fails resolving `@travelproof/*` | workspace globs wrong | check `pnpm-workspace.yaml` has `packages/*` + `apps/*` |
| OFAC fetch hangs / 0 addresses | redirect not followed | ensure `fetch(url, { redirect: "follow" })`; feed is on the S3 host after 302 |
| Garantex not found at startup | address delisted OR base58 lowercased | DT-12 (pick a fresh active address); never `.toLowerCase()` base58 |
| `forge test` can't find forge-std | lib not installed | `forge install foundry-rs/forge-std --no-commit` |
| deploy reverts "insufficient funds" | deployer unfunded | fund `DEPLOYER_PRIVATE_KEY` at the Base Sepolia faucet |
| `onReport` reverts in sim | wrong forwarder or report length | report must be 96 (verify) or 64 (screen) bytes; forwarder must match constructor |
| `cre workflow simulate` rejects Confidential HTTP | private-beta not granted | DT-5 (simulate may still run it; else request invite; keep OFAC real) |
| proof page shows "no attestation" | `ATTESTATION_ADDRESS` unset or wrong jobId | set env; use the seeded jobId (`jobIdFor(addr,"seed")`) |
| `verify:claims` mismatch | canonical payload drift | ensure sorted-key serialization in `commitment.ts` matches on both legs |
| citation lint hit | wrong authority/verb | DT-1 (use registry string; "transmittal" not "filing") |

---

## Section N+14: Pre-Demo Checklist (demo morning runbook)
- [ ] `cast chain-id --rpc-url $BASE_SEPOLIA_RPC_URL` → 84532 (primary + fallback both up).
- [ ] P2.1 live smoke: fresh `publishDate` + Garantex self-check passes (DT-12).
- [ ] Two seeded attestations resolve on `/proof/[jobId]` (CLEARED + BLOCKED).
- [ ] `pnpm verify:claims` green (round-trip).
- [ ] Citation lint clean (DT-1); overclaim lint clean (DT-4).
- [ ] Memo PDF exports with the cited rule + verifiable footer.
- [ ] Backup demo clip of the real run ready (DT-10).
- [ ] `SUBMISSION_STATUS.md` + `LIMITATIONS.md` current (simulator/mock disclosures present).

---

## Section N+15: Rollback & Recovery per Phase
| Phase | If it goes wrong | Recovery |
|------|------------------|----------|
| P1 | core logic regression | `git revert` the task commit; core is pure, re-run tests to confirm |
| P2 | OFAC parser breaks on a feed format change | pin to the fixture-tested path; log the raw `<publshInformation>`; never fall back to a cached list |
| P3 | bad deploy | redeploy to a new address; update `.env` + `proof.md`; old address is harmless (immutable) |
| P3 | CRE workflow won't build | isolate to the screen workflow (the P0-real one); defer verify to simulate-stand-in (DT-5) |
| P4 | UI broken near demo | the proof page is a server component with no client JS — it degrades to server-rendered HTML; cockpit can fall back to the API + curl |
| P5 | submission window tight | DT-6 cut order: drop verify polish → keep OFAC screen + attestation + record real; package first, polish after |

Every recovery preserves the invariants: no fabricated state, no cached OFAC clear, no PII on-chain, correct citations.

---

## Section N+16: Risk → Phase-Gate Traceability
| Risk | Severity | Decision tree | Enforced at gate |
|------|:--:|:--:|------------------|
| R1 wrong authority | CRITICAL | DT-1 | P1 gate (citation lint) |
| R2 privacy invisible | CRITICAL | DT-2 | P3/P4 gate (event + no-PII panel) |
| R3 OFAC stubbed | CRITICAL | DT-3 | P2 gate (live smoke + self-check) |
| R4 TEE over-claim | HIGH | DT-4 | P3/P4 gate (overclaim lint + verify:claims) |
| R5 CRE beta-gated | HIGH | DT-5 | P2/P3 gate (simulate runs) + P5 wire |
| R6 scope slip | HIGH | DT-6 | P5 buffer (cut order) |
| R7 memo not recognizable | HIGH | DT-7 | P4 gate (lawyer read) |
| R8 registry mock undisclosed | HIGH | DT-8 | P3 gate (disclosure present) |
| R9 two-VASP | MED | DT-9 | P5 (honest framing) |
| R10 RPC/durability | MED | DT-10 | P4/P5 (fallback + clip) |
| R11 overlap | MED | DT-11 | demo narrative |
| R12 address delisted | MED | DT-12 | P2 + pre-demo self-check |

Every CRITICAL/HIGH risk is enforced at a named phase gate, not left to goodwill.

---

## Section N+17: Environment & Toolchain Setup (prerequisites runbook)
Run once before P0. Each line has a verification.
```bash
# Node 20+ and pnpm 9
node -v            # expect v20.x+
corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm -v   # 9.x
# Foundry
curl -L https://foundry.paradigm.xyz | bash && foundryup
forge --version    # expect a recent forge
# CRE CLI (Chainlink)
# install per docs.chain.link/cre/reference/cli ; then:
cre --version && cre login && cre whoami   # authenticated
# Base Sepolia deployer: create a key, fund via a Base Sepolia faucet
cast wallet new    # record the key -> DEPLOYER_PRIVATE_KEY (test only)
# fund at a Base Sepolia faucet, then:
cast balance <addr> --rpc-url https://sepolia.base.org   # > 0
```
Verification: all five tools print versions; `cre whoami` authenticated; deployer balance > 0. If `cre` is unavailable, P2.2/P3.4 fall to the simulate-stand-in path (DT-5) while P1/P2.1/P3.1-3/P4 proceed.

## Section N+18: Definition of Done (per component)
- **C1 resolver:** all 7 truth-table rows covered by a test; cites only registry strings; `NEEDS_HUMAN_REVIEW` path tested; no network/LLM import.
- **C2 IVMS:** builds a valid IVMS 101.2023 message; C1 + C6 violations detected; natural-person originator + VASP legal persons populated.
- **C3 verify workflow:** runs the Confidential HTTP call in simulate; emits a report with a commitment + verifyVerdict; fail-closed to DEGRADED; no TEE-quote claim.
- **C4 screen workflow:** `consensusIdenticalAggregation`; CLEAR/HIT/DEGRADED mapped; `.withDefault("DEGRADED")`.
- **C5 OFAC:** parses the fixture + the live feed; exact addr (base58 case-sensitive), fuzzy name over akas; startup self-check; no cached list.
- **C6 endpoint:** 401 without key; registered/unregistered responses; mock disclosed + TRISA path named.
- **C7 contract:** 3 tests green; no PII-typed storage field; forwarder-guarded; event emitted; deployed to Base Sepolia with the address recorded.
- **C8 cockpit:** runs CLEARED + DO-NOT-TRANSMIT against the live feed; cited applicability banner; no manual verdict override.
- **C9 renderer:** IVMS field labels + cited memo + verifiable footer; PDF export; signature block.
- **C10 proof:** cold-resolves an attestation; no-PII panel enumerates the 4 fields; BaseScan links; `cast call` reproduction shown.

A component is DONE only when its DoD + its acceptance observable (N+11) are both green and `SUBMISSION_STATUS.md` is flipped.

## Section N+19: Demo-Scene → Component-Readiness Matrix
The demo cannot be recorded until the components each scene depends on are DONE.
| Scene | Needs green |
|------|-------------|
| S1 cockpit entry | C8 |
| S2 applicability | C1 |
| S3 enclave verify | C3, C6 |
| S4 OFAC live screen | C4, C5 |
| S5 record/memo | C2, C9, C7 |
| S6 DO-NOT-TRANSMIT flip | C4, C5, C8 |
| S7 proof page | C7, C10 |
The P1 milestone (CLEARED + BLOCKED attested, record rendered) covers S1/S2/S4/S5/S6/S7 using C1+C2+C5+C4+C7+UI; S3 (enclave verify) is the one scene gated on C3 (simulate), so it is recorded last and has the DT-5 fallback.

## Section N+20: Git / Commit Cadence
- One commit per task, using the task's `Commit:` message (conventional-commits).
- Never commit secrets; `.env` is git-ignored; only `.env.example` is tracked.
- Never commit a cached SDN list (an `.xml` under `src/` fails the P2 gate).
- Branch `main` for the hackathon; tag `v-demo` at the pre-demo checkpoint.
- Every phase gate is a soft PR boundary: all gate boxes checked before the next phase.

## Section N+21: Step-by-step — P3.4 (Confidential HTTP verify) and P4.2 (UI)
### P3.4 detailed
1. Author `verify.workflow.ts` from ARCHITECTURE.md §7 exactly.
2. Register the endpoint key: `cre secrets set VASP_VERIFY_KEY <value>` (Vault DON). Confirm it is referenced only via `{{.VASP_VERIFY_KEY}}`.
3. Start C6: `pnpm --filter @travelproof/vasp-registry start`.
4. `cre workflow build packages/cre/src/verify.workflow.ts`.
5. `cre workflow simulate packages/cre/src/verify.workflow.ts --input '<verify payload>'` → observe the in-enclave call + the emitted commitment + verifyVerdict.
6. `--broadcast --target base-sepolia` → confirm the report tx + `EnclaveAttestation` on BaseScan.
7. If step 5 is beta-gated → DT-5 (request invite; meanwhile labeled stand-in; OFAC stays real).

### P4.2 detailed
1. Author the three pages + `memo.tsx` from ARCHITECTURE.md §10/§12.
2. `pnpm --filter web dev`; open `/cockpit`; run the Appendix-F CLEARED transfer → expect green → `/record/[jobId]`.
3. Run the Garantex transfer → expect red DO-NOT-TRANSMIT with the cited basis.
4. Open `/record/[jobId]` → verify IVMS labels + citation + footer; export PDF.
5. Open `/proof/[jobId]` in a fresh profile (cold) → verify the no-PII panel + the `cast call` line.
6. `pnpm --filter web build` → clean.

## Section N+22: CRE Simulate Deep-Dive (the riskiest step)
`cre workflow simulate` runs the workflow compiled to WASM locally; only `cre login` is needed (no deploy allowlist, no Confidential-Workflows invite for simulate per the docs). This is the demo path that keeps the workflow logic REAL.
- `--broadcast` sends the DON-signed report on-chain from the simulator → a real tx on Base Sepolia.
- `--target base-sepolia` resolves the chain by selector (`10344971235874465080` / `ethereum-testnet-sepolia-base-1`).
- Honest limitation: a simulator run may sign single-node rather than full managed-DON multi-sig — recorded in LIMITATIONS.md. The logic, the Confidential HTTP call, the OFAC screen, and the on-chain write are all real.
- Wire validates this empirically (PRD §15 item 1 / DT-5) before the demo relies on it.

## Section N+23: Submission Packaging Detail
`submission/proof.md` template (filled at P3.2 + P5.1):
```
# TravelProof — Proof
- Contract: TravelRuleAttestation @ <ATTESTATION_ADDRESS> (Base Sepolia 84532)
  https://sepolia.basescan.org/address/<addr>
- CLEARED attestation: jobId <id>  tx https://sepolia.basescan.org/tx/<hash>
- BLOCKED (Garantex) attestation: jobId <id>  tx https://sepolia.basescan.org/tx/<hash>
- OFAC SDN Publish_Date captured at demo: <date>
- IVMS101 record PDFs: submission/record-cleared.pdf, submission/record-blocked.pdf
- verify-claims: evidence/verify-claims.json (all match:true)
```
BUIDL fields (DoraHacks): title (no em dash), tagline, the Details blueprint body (proof-first), the repo, the demo video link, deployed address + chainId 84532, track = LegalTech & RegTech, bounty = Chainlink CRE.

---

## Section N+24: Build-Order Dependency Graph
```
                 P0 scaffold + franchise skeleton
                          │
            ┌─────────────┴──────────────┐
            ▼                             ▼
   P1 core (C1,C2,commitment)     P2.1 OFAC (C5)        [parallel group A]
            │                             │
            ▼                             ▼
   P3.1 contract (C7) ──► P3.2 deploy     P2.2 DON screen (C4)   [parallel group B: C7 ‖ C6]
            │                 │                  │
            ▼                 ▼                  │
   P3.3 C6 endpoint ──► P3.4 verify (C3) ◄───────┘
            │
            ▼
   P4 web (C8 ‖ C9 ‖ C10) ──► P4.3 seed    [parallel group C]
            │
            ▼
   P5 wire + demo + submit
```
Why: the legal core and OFAC screen have no cross-dependency (group A, day 1). The contract and the verify endpoint are independent (group B). The three UI routes only read already-built core/contract (group C). The P1 milestone (thesis-proving CLEARED + BLOCKED) is reachable via the left spine before C3 lands.

## Section N+25: Test Matrix
| Component | Unit | Integration | E2E/adversarial | Command |
|-----------|:--:|:--:|:--:|---------|
| C1 | 4 (truth table + determinism) | — | 1 (ambiguous CASP) | `pnpm --filter @travelproof/core test -t resolver` |
| C2 | 2 (C1/C6) | — | 1 (injected field) | `... test -t ivms` |
| commitment | 2 (determinism, verdict-sensitivity) | — | — | `... test -t commitment` |
| C5 | 4 (exact/base58/EVM/aka) | 1 (live fetch) | 1 (self-check) | `pnpm --filter @travelproof/ofac test` |
| C4 | — | 2 (CLEAR/HIT simulate) | 1 (DEGRADED) | `cre workflow simulate` |
| C3 | — | 2 (verify/timeout) | 1 (no-PII in report) | `cre workflow simulate` |
| C7 | 3 (guard/cleared/bad) | 1 (report decode) | — | `forge test -vvv` |
| C8/C9/C10 | — | — | 3 (CLEARED/flip/cold proof) | manual + `pnpm --filter web build` |
Total target: ~15 unit + ~7 integration + ~8 e2e/adversarial.

## Section N+26: Shared Test & Demo Fixtures (single source so tests/seed/demo agree)
```
ORIGINATOR (synthetic natural person):
  primaryIdentifier "Adeyemi", secondaryIdentifier "Fatima", customerIdentification "CUST-558201", countryOfResidence "NG"
BENEFICIARY (clean): name "Okafor", address 0xB0B0000000000000000000000000000000000B0B
VASP LEIs: originating 5493001KJTIIGC8Y1R12, beneficiary 984500AB12CD34EF5678 (registered in the mock)
CLEAN transfer: 5000 USDC, both CASP -> CLEARED
BLOCKED transfer: beneficiary address = DEMO_HIT_ADDRESS (Garantex 3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1) -> DO-NOT-TRANSMIT
```
All of tests (C1/C2), the seed script, and the demo use these exact values, so a passing test and a passing demo exercise the same data.

## Section N+27: Observability & Sentinel Strings
Each component logs a recognizable marker; the sentinel strings double as grep targets for the gates.
| Component | Log marker | Sentinel (must NEVER appear on a pass) |
|-----------|-----------|----------------------------------------|
| C5 | `[ofac] indexed N addrs, publishDate …` | `SCREEN_DEGRADED` on a demoed CLEAR |
| C4 | `[screen] verdict=CLEAR|HIT|DEGRADED` | DEGRADED silently mapped to CLEAR |
| C3 | `[verify] verdict=…, commitment=0x…` | any PII field in the log |
| C1 | `[resolve] regime=… citation=…` | empty citation on an applicable transfer |
| C7 | event `EnclaveAttestation(jobId,…)` | a write from a non-forwarder |
Logs are structured and PII-free (the verify log prints the commitment, never the identity).

## Section N+28: Security Checklist (maps to SECURITY.md §N+12)
- [ ] No PII-typed storage field in C7 (structural); confirmed by ABI inspection.
- [ ] `onReport` reverts for non-forwarder callers.
- [ ] Secrets only via CRE Vault DON (`{{.VASP_VERIFY_KEY}}`); none in code or git.
- [ ] No cached SDN list in the repo; live-feed-only with fail-closed DEGRADED.
- [ ] Citation lint + overclaim lint pass (DT-1/DT-4).
- [ ] `.env` git-ignored; only `.env.example` tracked.
- [ ] Not defended against (documented): two-VASP integrity, managed-DON multi-sig (if simulate), compromised mock registry, mainnet key mgmt.

## Section N+29: Lawyer-View UX Checklist (the 40% credibility surface)
- [ ] Applicability banner states the cited rule in plain language first, citation second.
- [ ] The memo reads as a transmittal record (header, cited authority, originator/beneficiary, verdict, verifiable footer), not a JSON dump.
- [ ] "Transmittal"/"transmit" wording throughout; never "file/filing".
- [ ] The DO-NOT-TRANSMIT state gives the cited basis, not just a red box.
- [ ] The proof page explains, in one sentence, why the ledger holds no personal data.
- [ ] PDF export produces a signable one-page document.

## Section N+30: Post-Build Handoff (to deploy / demo / package)
- **deploy-to-github (deploy):** portfolio README + live hosting of `apps/web` + screenshots; the attestation contract is already live on Base Sepolia (built).
- **hackathon-demo (demo):** record the 7-scene video (PRD §6 + Appendix M); the readiness matrix (N+19) gates recording.
- **hackathon-package (package):** DoraHacks BUIDL from `submission/*` (N+23 template) with the deployed address + chainId + live URLs.
- Handoff artifacts build leaves: `submission/proof.md`, `evidence/verify-claims.json`, the two record PDFs, a current `SUBMISSION_STATUS.md`.

---

## Section N+31: Plan Quality Gate (self-report)
- Decision trees: DT-1..DT-8 (every CRITICAL+HIGH risk) full + DT-9..DT-12 full → ≥ 8. PASS.
- Phase gates: P0..P5, each with a checklist → 6. PASS.
- Every task carries exact commands + a commit message. PASS.
- Every ARCHITECTURE.md tree file maps to a creation task (N+5). PASS.
- Time: 1.9 d ≤ build window incl. buffer. PASS.
- Franchise skeleton scaffolded at C0 (P0.2). PASS.
- Skill-Ownership Map present; judged-surface deliverables routed to owners (N+2). PASS.

---

## Section N+32: Stack-Specific Gotchas (bite-list — learn from the spike)
- **cre-sdk is pre-1.0 and moving:** Confidential HTTP recently switched node-mode → DON-mode; pin `@chainlink/cre-sdk@1.23.0` exactly; re-check the API shape against the installed version before coding the workflow.
- **CRE keys chains by SELECTOR, not chainId:** use `ethereum-testnet-sepolia-base-1` / selector `10344971235874465080`, not `84532`, in CRE config.
- **Next.js 15 route params are async:** `params` is a `Promise` — `const { jobId } = await params;` (the pages do this).
- **base58 is case-sensitive:** never `.toLowerCase()` a BTC/TRX/XMR address; only EVM hex is case-insensitive (see `screen.ts`).
- **OFAC element is misspelled `publshInformation`** (no second `i`) — the parser matches it exactly; don't "correct" it.
- **IVMS casing:** entities UpperCamelCase (`Originator`), elements lowerCamelCase (`originatorPerson`); the element is `customerIdentification`, NOT `customerIdentificationNumber`.
- **SDN.XML >10MB, 302→S3 signed URL (1-hr expiry):** always `redirect: follow`; don't cache the signed URL across runs.
- **Report length discriminates shape in C7:** verify = 96 bytes, screen = 64 bytes; encode with `encodeAbiParameters` exactly as in the workflows.
- **KeystoneForwarder address is per-network:** read the Base Sepolia one at wire; a wrong forwarder makes every `onReport` revert.

## Section N+33: Build-Agent Reading Order
1. `INVARIANTS.md` (the law — read first, every session).
2. `PLAN.md` (this file — the roadmap).
3. `ARCHITECTURE.md` (the code — copy exactly, per task).
4. `PRD.md` (product context + demo + risks, as needed).
5. `research/TECHNICAL-SPIKE.md` (verified API facts + the demo address).
6. `DECISIONS.md` / `LIMITATIONS.md` (why + boundaries).
Keep `SUBMISSION_STATUS.md` current as each component lands.

## Section N+34: Code-Reference Index (component → ARCHITECTURE.md section)
| Component | ARCH § | Files |
|-----------|:--:|-------|
| C1 resolver | §3 | types.ts, citations.ts, resolver.ts |
| C2 IVMS + commitment | §4 | ivms.ts, commitment.ts |
| C5 OFAC | §5 | sdn.ts, screen.ts |
| C6 VASP endpoint | §6 | vasp-registry/src/server.ts |
| C3 verify workflow | §7 | cre/src/verify.workflow.ts |
| C4 screen workflow | §8 | cre/src/screen.workflow.ts |
| C7 contract | §9 | TravelRuleAttestation.sol, IReceiver.sol, Deploy.s.sol, *.t.sol |
| C8/C9/C10 web | §10, §12 | app/*, lib/* |
| config + franchise | §11, §12 | package.jsons, scripts/*, .env.example |

## Section N+35: P1 Thesis-Proving Milestone (prove the thesis earliest — THESIS-5)
By the end of day 1 + P3.2 the build must demonstrate the Thesis DEMO OBLIGATION at minimum fidelity:
- A real transfer classified with the correct citation (C1).
- A real live-OFAC CLEARED and a real Garantex BLOCKED (C5+C4).
- Both attested on Base Sepolia with only commitment+verdict on-chain (C7).
- The filable record rendered (C2+C9).
This is the P1 milestone: it proves "privacy-preserving, independently-attested, filable Travel Rule record" without yet needing the Confidential-HTTP verify polish (C3). If everything after this slips, the thesis is still demonstrable (DT-6 cut order protects this milestone).

## Section N+36: Contingency — EMERGENCY cut (only if the window collapses)
If the build window collapses to a single slice (NOT the plan — a last-resort change-order to surface to Dami), the ONE load-bearing REAL slice is:
- C1 resolver (correct citations) + C2 IVMS record + C5 live OFAC screen + C7 attestation + C9 memo + C10 proof.
- Dropped (labeled): C3 Confidential-HTTP verify (→ disclosed stand-in), C6 (→ inline mock), C8 polish.
This still proves the thesis (privacy via no-PII-on-chain + live sanctions + filable record + correct law). It is a feature-COUNT cut, never a blanket-mock. Surface to Dami before taking it (scope-over-timeboxes).

---

## Section N+37: Acceptance — forge → build boundary
build may start only when: PRD.md, ARCHITECTURE.md, PLAN.md, INVARIANTS.md are on disk (they are); `.input-manifest.json` required inputs are resolved at Checkpoint 3 (surfaced to Dami); and the critique STAGE-1 scope review has not REJECTed. build does build-work only; owned deliverables (deploy hosting, demo, package) route to their owners per N+2. Every task here is traceable to an ARCHITECTURE.md section and an INVARIANTS.md law.

---

## Section N+38: Time Budget (hours per task; sums to the phase estimates)
| Task | Hours | Task | Hours |
|------|:--:|------|:--:|
| P0.1 scaffold | 1.0 | P3.2 deploy | 1.0 |
| P0.2 franchise skeleton | 1.0 | P3.3 C6 endpoint | 1.0 |
| P1.1 types+citations | 1.0 | P3.4 verify workflow | 2.0 |
| P1.2 resolver+tests | 1.5 | P4.1 chain/run libs | 1.5 |
| P1.3 IVMS+commitment | 2.0 | P4.2 UI pages | 3.0 |
| P2.1 OFAC live | 2.5 | P4.3 seed | 1.0 |
| P2.2 DON screen workflow | 2.0 | P5.1 wire | 2.0 |
| P3.1 contract+tests | 2.0 | P5.2 demo + P5.3 submit | 3.0 |
Sum ≈ 30.5 h ≈ 1.9 build-days (6-8 productive h/day + buffer). Within the window to the Oct 31 20:00 WAT internal cutoff.

## Section N+39: What Good Execution Looks Like (vs bad)
- **GOOD task close:** code copied exactly from ARCHITECTURE.md §X; the task's test command run and its transcript (N+6) matched; the commit uses the given message; `SUBMISSION_STATUS.md` flipped; the acceptance observable (N+11) green.
- **BAD task close:** "looks right, moving on" with no test run; a verdict hard-coded to make a demo pass; a cached SDN list added "to be safe"; a citation composed by hand instead of from the registry. Any of these trips a phase gate or an invariant — stop and follow the decision tree.
- **GOOD decision-tree use:** feed down → `SCREEN_DEGRADED` surfaced, demo paused on that beat, honest. **BAD:** feed down → serve the last-known CLEAR. The second is the disqualifying move R3 exists to prevent.

## Section N+40: Dependency Version Lock
| Package | Pin | Why |
|---------|-----|-----|
| @chainlink/cre-sdk | 1.23.0 | pre-1.0, API moves; spike verified this exact version |
| solidity | 0.8.24 | matches foundry.toml |
| next | ^15 | App Router async params |
| viem | ^2 | keccak256 + base58-safe compares + RPC |
| fast-xml-parser | ^4 | SDN stream parse |
| fuzzball | ^2 | name fuzzy match |
| @react-pdf/renderer | ^3 | memo PDF |
Lock `@chainlink/cre-sdk` to the exact patch; others to the major.

## Section N+41: [C] Critical-Concern → Gate Traceability
| [C] concern (concerns.md) | Enforced where | Proof |
|---------------------------|----------------|-------|
| Wrong legal authority | P1 gate + DT-1 lint | no banned string; registry-only citations |
| Enclave privacy invisible | P3/P4 gate + DT-2 | EnclaveAttestation event + no-PII panel |
| OFAC mocked/cached | P2 gate + DT-3 | live smoke + startup self-check; no cached list |
| Dual-CRE not load-bearing | P2+P3 gates | C4 (screen) + C3 (verify) both real + demoed; delete-smoke |
All four [C] concerns are enforced at a named gate, not assumed.

## Section N+42: Final Submission Readiness
- [ ] All phase gates (P0–P5) green.
- [ ] All [C] concerns traced to a passed gate (N+41).
- [ ] All CRITICAL/HIGH risks enforced (N+16).
- [ ] 2 live attestations on Base Sepolia; `verify:claims` green.
- [ ] Demo video ≤300s recorded + fallback clip.
- [ ] DoraHacks BUIDL: deployed address + chainId 84532 + live URLs + Details body (no em dash).
- [ ] `SUBMISSION_STATUS.md` + `LIMITATIONS.md` current (simulator/mock disclosed).
- [ ] Packaged by Oct 31 20:00 WAT (6-hour margin before the 02:01 deadline).

---

## Section N+43: Verification-Tag Discipline (carried from ARCHITECTURE.md)
Every code block in ARCHITECTURE.md is tagged; honor the tags during build:
- `[VERIFIED]` — copy as-is; it is backed by a probe/official doc. (C1/C2/C5/C7/UI/config.)
- `[UNVERIFIED]` — the CRE workflows (C3/C4) + `lib/cre.ts` + `run-cre.sh`: run `cre workflow simulate` BEFORE relying on them; they carry a `// WARNING: UNVERIFIED` comment.
- `[ASSUMED]` — none in this build (the single `[ASSUMED]` string is the tag definition in the ARCH preamble).
If a `[UNVERIFIED]` block fails to run as written, follow DT-5 (simulate path / invite) — never fabricate a passing result.

## Section N+44: Terms the Build Agent Must Internalize (full glossary in PRD Appendix E)
- **transmittal, not filing** — the Travel Rule verb for crypto under US framing.
- **commitment, not TEE quote** — our on-chain proof is a keccak256 commitment in a DON-signed report; we never claim a hardware attestation.
- **live screen, not snapshot** — the OFAC feed is fetched each run; a cached list is forbidden.
- **deterministic resolver, not AI** — applicability is a truth table; AI (if any) only drafts memo prose a human signs.
- **filable record, not dashboard** — the deliverable is the IVMS101 record + memo PDF; the chain is quiet plumbing.

## Section N+45: Full Concerns Mapping (all severities)
| Concern | Sev | Plan enforcement |
|---------|:--:|------------------|
| Wrong legal authority | C | DT-1 + P1 gate |
| Enclave privacy invisible | C | DT-2 + P3/P4 gate |
| OFAC mocked/cached | C | DT-3 + P2 gate |
| Dual-CRE not load-bearing | C | P2+P3 gates (both real) |
| Dual-CRE scope under window | I | DT-6 + P5 buffer cut order |
| IVMS not recognizable | I | DT-7 + P4 gate |
| Two-VASP out of scope | A | DT-9 honest framing + LIMITATIONS.md |

## Section N+46: Open Build-Facts to Resolve (mirror PRD Appendix J — not design decisions)
- KeystoneForwarder address (Base Sepolia) — read at wire (P5.1), set in the C7 constructor at deploy.
- TravelRuleAttestation address + 2 seed tx hashes — minted at P3.2/P4.3, recorded to `.env` + `proof.md`.
- Live OFAC `<Publish_Date>` on demo day — captured at P5.1.
- Whether Confidential HTTP runs in simulate without the invite — empirical at P5.1 (DT-5); simulate path is the fallback regardless.
Everything else is RESOLVED in DECISIONS.md / INVARIANTS.md; no design choice is left open.

---
_End of PLAN. Build reads INVARIANTS.md first, then this file, then copies code from ARCHITECTURE.md exactly._

## Section N+47: Build-Dispatch Guidance (for hackathon-build)
build may parallelize implementation subagents along the dependency graph (N+24), but each subagent copies code from ARCHITECTURE.md verbatim and runs its task's test command before closing:
- **Agent A (core):** P1.1–P1.3 — pure TS, no external deps; fastest to green; unblocks everything.
- **Agent B (ofac):** P2.1 — independent of core; the live smoke is its gate.
- **Agent C (contracts):** P3.1–P3.2 — Foundry; independent until deploy needs the forwarder address.
- **Agent D (cre):** P2.2 + P3.4 — depends on ofac (screen imports the index) + the deployed receiver; runs after B + C.
- **Agent E (web):** P4.1–P4.2 — depends on core + the deployed contract; reads, does not reimplement.
Each agent: copy → test → commit with the task message → flip `SUBMISSION_STATUS.md`. A subagent that cannot make its test green stops and surfaces (escalate, don't fabricate — INVARIANTS). build itself owns the seed (P4.3), wire validation (P5.1), and the proof capture; the demo/package/deploy-hosting route to their owning skills (N+2).

No subagent invents an API, an address, or a citation — all come from ARCHITECTURE.md / the citation registry / the recorded deploy. This is the anti-hallucination contract carried from forge into build.

---

## Document Control
- **This plan** is the canonical build roadmap (conductor-compliance + hackathon-build input). It references the Thesis locked in `warroom/WINNER-BRIEF.md ## Thesis`; it never restates-with-modification.
- **Reading order for build:** INVARIANTS.md → PLAN.md → ARCHITECTURE.md (copy exactly) → PRD.md (context) → research/TECHNICAL-SPIKE.md (verified facts).
- **Quality-gate self-report (Section N+31):** decision trees ≥8 (DT-1..DT-12), 6 phase gates with checklists, every task has exact commands + a commit message, every ARCHITECTURE.md tree file maps to a creation task (N+5), time 1.9 d ≤ window, franchise skeleton at C0, Skill-Ownership Map present.
- **Invariants carried into build (the law):** no PII on-chain (structural); live OFAC only (fail-closed DEGRADED); deterministic resolver (no AI on the decision path); correct citations (transmittal, not filing); honest commitment (no TEE-quote claim). A build that violates any fails the hackathon gate.
- **Scope posture:** standard (SPRINT). The EMERGENCY single-slice cut (N+36) is a last-resort change-order to surface to Dami, never taken unilaterally.
- **Spec freeze:** in effect at forge exit; post-freeze doc changes require a change-order (N+3).
- **Downstream handoff:** build → deploy (hosting/README) → demo (video) → package (BUIDL); judged-surface deliverables routed to their owners, never improvised (N+2, N+30).

_The three documents (PRD, ARCHITECTURE, PLAN) + INVARIANTS are internally consistent and cross-checked; a developer with zero context builds TravelProof from them alone._

## Section N+48: One-Paragraph Build Summary
TravelProof is built bottom-up from a pure legal core: a deterministic resolver (correct EU TFR / FATF citations) and an IVMS 101.2023 record assembler, both fully tested first. On top sit two Chainlink CRE workflows — a DON-consensus OFAC screen against the live SDN feed (built first, fully real) and a Confidential-HTTP in-enclave verify (run in the local simulator) — each delivering a DON-signed report to a Base Sepolia attestation contract that stores only a commitment and verdicts, with no PII-capable field. A Next.js cockpit runs a real CLEARED transfer and a real Garantex DO-NOT-TRANSMIT flip; a renderer produces the filable record + cited officer memo (PDF) with an on-chain-verifiable footer; and a cold proof page lets any judge confirm the ledger holds no personal data. The build proves the thesis — a privacy-preserving, independently-attested, filable Travel Rule record — by the P1 milestone, and every CRITICAL/HIGH risk is pinned to a phase gate with a decision tree.

---
_PLAN complete. Forge Phase 3 output. Next: Phase 3.5 gates (thesis + cross-model + routing/critical-review), then Phase 4 output (input manifest), then critique + url_preverify._
