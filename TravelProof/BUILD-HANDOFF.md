# BUILD-HANDOFF — TravelProof (forge → build)

**Status:** forge COMPLETE + gated (conductor post-gate pass, signed). critique STAGE-1 = ACCEPT. url_preverify = all live. **Build is NEXT.**

## How to start build
W-1 (one conductor beat per chat) requires a FRESH chat. In a new chat:
```
conductor-beat open /Users/MAC/bli-legal
```
That dispatches the next beat. Pipeline order after forge: **critique → url_preverify → build**. Both critique + url_preverify were already RUN as substance this session (verdicts below); their conductor beats can ratify from the recorded artifacts rather than re-run.

## Read in this order (the build-agent contract)
1. `INVARIANTS.md` — build-agent LAW (read first, every session).
2. `PLAN.md` — the phased roadmap (P0–P5, exact commands/commits/decision-trees/phase-gates; §N+5 maps every file to a task).
3. `ARCHITECTURE.md` — the code (copy EXACTLY, per task; every block `// File:`-headed + tagged).
4. `PRD.md` — product/demo/risks. `DECISIONS.md` / `LIMITATIONS.md` — why + boundaries.
5. `research/TECHNICAL-SPIKE.md` — verified API facts + the Garantex demo address.
6. **`CRE-RUN-MODEL.md`** — the REAL-CRE plan (Dami ruling; read before touching CRE).

## CP3 inputs — RESOLVED (Dami, 2026-10-30)
- **RPC (resolved):** `BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY` (Dami's Alchemy key; TESTED live — chainId 84532). In `/Users/MAC/bli-legal/.env`.
- **Deployer (resolved-at-build):** Dami dev wallet `0xc211C942946011859ca634F22400d80570ED12A5`. Base Sepolia balance ~0.0585 ETH — **ample, NO bridge needed** (Sepolia backup ~2.77 ETH). The private key is supplied at build from Dami's dev wallet (`.env` placeholder `SUPPLY_AT_BUILD_FROM_DAMI_DEV_WALLET`).
- **CRE = REAL managed-DON, NOT simulate** (Dami: "i dont prefer simulations"). Reference project: `~/Desktop/dev/ghostfund-v2/workflow/workflow` (real cre deploy via `workflow.yaml`+`config.json`+cron `main.ts`). **C4 OFAC-DON-screen + C7 attestation run REAL** (allowlist likely already held via ghostfund). **C3 Confidential-HTTP verify** is the ONE gated piece → **REQUEST the Confidential Workflows private-beta invite immediately** (docs.chain.link/cre/guides/operations/confidential-workflows-access). Simulate is a per-subsystem fallback for C3 ONLY, with an honest LIMITATIONS note — never a blanket simulate. (ghostfund pinned cre-sdk ^1.0.9 `Runner`/`cre` API; TravelProof pins 1.23.0 — reconcile the API against the installed version at wire; use ghostfund for deploy mechanics, 1.23.0 docs for the API.)
- **Full input list:** `/Users/MAC/bli-legal/.input-manifest.json` + `INPUT-MANIFEST.md`.

## Open build-facts (resolved during build/wire — not design decisions)
- `KEYSTONE_FORWARDER_ADDR` — read from CRE docs/CLI for Base Sepolia at wire; set in the C7 constructor (constructor reverts on address(0)).
- `ATTESTATION_ADDRESS` — recorded at C7 deploy (P3.2) → `.env` + `submission/proof.md`.
- `VASP_VERIFY_URL` / `VASP_VERIFY_KEY` — the deployed mock endpoint + its bearer (CRE Vault DON secret) at wire.
- Confirm `cre login` / `cre account access` (ghostfund implies granted).

## Gate results carried in (do not regress)
- PRD 6/6, ARCHITECTURE 10/10 + cross-doc 4/4, PLAN 7/7; THESIS-1..5 PASS; thesis-2 cross-model AGREE (sonnet/opus).
- **A-G4 distinct-model critical review fixed 4 BLOCKERs** — build must NOT reintroduce them (also in INVARIANTS "A-G4 SURVIVORS"):
  1. commitment round-trip — `verify.workflow` + `commitment.ts` share `COMMITMENT_KEYS` (beneVasp, beneficiaryAccount, origVasp, verifyVerdict).
  2. `run-cre.sh` is a FAIL-LOUD stub (exits 1 WIRE_REQUIRED) — never a constant verdict; `api/run` rejects non-enum verdicts (502 DEGRADED).
  3. contract verdict legs are write-once (`AlreadySet` revert) — no flip.
  4. forwarder must be non-zero (`ZeroForwarder` revert) + always `msg.sender==forwarder` (no zero-address bypass).
  Plus: OFAC parse `removeNSPrefix:true` + fail-closed on empty index (no silent CLEAR); FinCEN cite carries no fabricated subsection.
- **critique ACCEPT** (`.critique-state.json`) — 4 MINOR pre-empts folded into LIMITATIONS.md "Critique STAGE-1 pre-empts". Honor them in the demo + memo render.
- **url_preverify all-live** (`.url-preverify.json`) — FATF/BaseScan 403 = anti-bot, reachable in a browser.

## Non-negotiables (from INVARIANTS.md — the whole point)
No PII on-chain (structural — C7 has no string field); live OFAC only (fail-closed SCREEN_DEGRADED, no cached list; Garantex `3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1` self-check, re-verify day-of); deterministic resolver (no AI on the decision path); correct citations (EU TFR Art.14 / FATF Rec.16 / FinCEN FIN-2019-G001 context — NEVER §1010.410(f) as crypto authority; "transmittal" not "filing"); honest commitmentHash (NO TEE-quote claim).

## Build priority / scope
P0 scaffold+franchise → P1 legal core (C1/C2) → P2 live OFAC (C5)+DON screen (C4) → P3 contract (C7) deploy + C6 + C3 verify → P4 web (C8/C9/C10)+seed → P5 wire+demo+submit. P0-real slice = DON OFAC screen + attestation (the thesis-proving P1 milestone). Internal cutoff **Oct 31 20:00 WAT**.

## Doc locations
Everything exists at BOTH `/Users/MAC/bli-legal/` (wd root — the conductor/gate reads here) and `/Users/MAC/bli-legal/TravelProof/` (project dir — build's canonical). Keep them in sync if edited. CP3 inputs (`.env`, `.input-manifest.json`, `.critique-state.json`, `.url-preverify.json`) live at the wd root (also copied into the project dir for convenience).

## CHANGE-ORDER-1 (depth-adds — READ with ARCHITECTURE)
`CHANGE-ORDER-1.md` is the authoritative supplement for post-freeze scope (Dami 2026-10-31). Build reads it alongside ARCHITECTURE/PRD/PLAN. It adds:
- **A** `/ledger` examiner evidence log (C11) — real on-chain EnclaveAttestation history. New files `lib/ledger.ts`, `app/ledger/page.tsx` (copy-exact in CO-1).
- **B** resolver legal-nuance demo (3rd transfer: unhosted/below-threshold) — no new code, demo coverage.
- **C** lawyer-grade filable memo — upgraded `lib/memo.tsx` (IVMS Section-7 labels + verbatim rule + signature + retention + live publishDate) in CO-1.
- **D** real TRISA testnet **directory lookup** for C6 registration (attribute-match stays synthetic, disclosed) — new `packages/vasp-registry/src/trisa.ts` + `server.ts` change; input `TRISA_DIRECTORY_URL=https://api.testnet.directory` (probed live).
- **C3 REFRAME:** enclave verify is NOT the blocking headline and NOT run live tonight (no simulate/degrade); it ships as real code labeled "CRE Confidential Workflows — beta access pending." The LIVE demo + thesis lead on the OFAC-DON-attested filable record + the no-PII-on-chain proof (all real). Build FIRST ACTION: request the beta invite (post-deadline upgrade path).
Gates for the adds + the spec-freeze record are in CHANGE-ORDER-1.md.
