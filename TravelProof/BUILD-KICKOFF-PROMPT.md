# BUILD KICKOFF PROMPT — paste into a FRESH chat

> Start the fresh chat with `claude --dangerously-skip-permissions --rc` for full-autonomy + Remote Control (per CLAUDE.md hackathon launch). Then paste everything below.

---

Continue the BLI Legal Tech Hackathon 2 pipeline in ~/bli-legal. Resume via the conductor — do NOT run skills freestanding.

**READ FIRST:** `~/bli-legal/TravelProof/BUILD-HANDOFF.md`, then **`CHANGE-ORDER-1.md`** (post-freeze depth-adds A/B/C/D + C3 reframe — authoritative supplement), then the build-agent law `INVARIANTS.md`, then `PLAN.md`, then copy code EXACTLY from `ARCHITECTURE.md` + `CHANGE-ORDER-1.md`. Orient from the beacon `~/bli-legal/.conductor-resume.md`. Full memory: bli-legal-forge-done-cre-real + bli-legal-pipeline-state.

**STATE:** intel ✅ · warroom ✅ · forge ✅ COMPLETE+gated+signed (verdict pass). critique ✅ ACCEPT and url_preverify ✅ all-live were RUN as substance (verdicts in `~/bli-legal/.critique-state.json` + `.url-preverify.json`). **Next real work = build.** Winner = TravelProof (FATF Travel Rule record on Base Sepolia 84532 + Chainlink CRE; target LegalTech/RegTech + CRE $2K bounty).

**⏰ TIMELINE IS TIGHT:** internal cutoff **today 2026-10-31 20:00 WAT**, hard deadline **2026-11-01 02:01 WAT**. Build the **P1 thesis-proving slice first** (deterministic resolver + IVMS record + LIVE OFAC DON screen + Base Sepolia attestation + filable memo + cold proof page) — that alone proves the thesis. The C3 Confidential-HTTP verify is the one gated/longer-lead piece.

**RUN THIS BEAT:**
1. `bash ~/.claude/skills/utils/conductor-beat.sh open ~/bli-legal` (reads the FSM, dispatches the next beat). run_profile = SPRINT.
2. The next conductor beats are critique → url_preverify → build. Both critique + url_preverify already have recorded PASS verdicts — RATIFY from the artifacts (`.critique-state.json` ACCEPT; `.url-preverify.json` all-live) rather than re-run from scratch, unless the gate requires a fresh distinct-model pass. Then proceed to build via the latest `hackathon-build` skill (invoke via the Skill tool — never a cached copy).
3. ALL gates must CLEAR, not be bypassed (dispatch-gate pre+post every tier, build self-audit, every lint). Remediate the artifact and re-run on any block.

**FIRST ACTION in build (long-lead — do it at minute 0):** request the **Chainlink Confidential Workflows private-beta invite** (docs.chain.link/cre/guides/operations/confidential-workflows-access) — it is the ONLY gated piece (C3 Confidential HTTP) and may take time. Also confirm `cre login` / `cre account access` (ghostfund-v2 implies the deploy allowlist is already held).

**CP3 INPUTS — RESOLVED (in ~/bli-legal/.env, git-ignored):**
- RPC = Dami Alchemy key (TESTED live, chainId 84532): `https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY`.
- Deployer = Dami dev wallet `0xc211C942946011859ca634F22400d80570ED12A5` (Base Sepolia ~0.0585 ETH — ample, NO bridge; Sepolia backup ~2.77 ETH). Private key: supply at build from Dami's dev wallet (`.env` placeholder).
- **CRE = REAL managed-DON, NOT simulate** (Dami ruling). Reference: `~/Desktop/dev/ghostfund-v2/workflow/workflow` (real deploy: workflow.yaml+config.json+cron main.ts). C4 OFAC-screen + C7 attestation run REAL on Base Sepolia. Reconcile the cre-sdk API: ghostfund pinned ^1.0.9 (`Runner`/`cre`), TravelProof pins 1.23.0 (`initWorkflow`/`handler`) — use ghostfund for deploy mechanics, the 1.23.0 docs for the API, against the INSTALLED version. Full plan: `TravelProof/CRE-RUN-MODEL.md`.

**BUILD NON-NEGOTIABLES (INVARIANTS.md is law — do not regress the 4 A-G4-fixed BLOCKERs):**
- No PII on-chain (structural — C7 has no string field). Live OFAC only (fail-closed `SCREEN_DEGRADED`, no cached list; Garantex `3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1` startup self-check, re-verify day-of). Deterministic resolver (no AI on the decision path). Correct citations (EU TFR Art.14 / FATF Rec.16 / FinCEN FIN-2019-G001 context — NEVER §1010.410(f) as crypto authority; "transmittal" not "filing"; no fabricated FinCEN subsection). Honest `commitmentHash` (NO TEE-quote claim).
- The 4 fixes to keep: commitment round-trip shares `COMMITMENT_KEYS` (verify.workflow == commitment.ts); `run-cre.sh` is fail-loud (never a constant verdict; api/run rejects non-enum → 502); contract verdict legs write-once (`AlreadySet`); forwarder non-zero mandatory (`ZeroForwarder`, no zero-address bypass).
- Honor the 4 critique pre-empts in the demo + memo render (LIMITATIONS.md "Critique STAGE-1 pre-empts").
- Submission: DoraHacks BUIDL with the deployed attestation address + chainId 84532 + BaseScan links; demo ≤300s, workflow-first (the lawyer's view); Details blueprint, no em-dashes.

**GOTCHAS (hit last session):** run crossmodel/state-io helpers under `bash -c` (zsh `status` readonly). NEVER run `dispatch-gate post` MANUALLY during a conductor beat — it mutates `.conductor-state.json` (.gate_integrity) and trips the ownership-snapshot tier; let `conductor-beat record` run the post-gate, and if ownership trips, recover with `record_phase_ownership_snapshot <wd> <phase>` (state-io.sh) then re-run record. One conductor beat per chat (W-1) — if blocked, that's expected; continue the work and open the next beat in a fresh chat. Browser is a session singleton — never subagent it. Docs live at BOTH `~/bli-legal/` (gate reads here) and `~/bli-legal/TravelProof/` (build canonical) — keep in sync if edited.

> **DEPTH (CHANGE-ORDER-1, Dami 2026-10-31 — NOT a basic build):** add A `/ledger` evidence log, B resolver legal-nuance demo transfer, C lawyer-grade filable memo, D real TRISA testnet directory lookup (registration real; attribute-match synthetic, disclosed). **C3 reframe:** the enclave verify is production-path, beta-pending — NOT run live tonight, never simulated/fabricated; the live headline is the OFAC-DON-attested filable record + no-PII proof (all real). First build action: request the Confidential Workflows beta invite.