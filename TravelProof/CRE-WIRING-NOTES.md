# CRE wiring notes (2026-11-01, post-submission)

## CONFIRMED: no private beta needed for the demo path
- `cre workflow simulate` runs LOCALLY. SDK ships a confidential-http LOCAL MOCK
  (`.../sdk/test/.../confidentialhttp/.../confidential_http_mock_gen.js`) -> the confidential step
  simulates without beta. No "private beta / allowlist / access denied" strings in the SDK sim path.
- `cre account access` (deploy access) + the Confidential Workflows beta are for DEPLOYING to the
  production managed DON. ghostfund-v2 needed that because it deployed. We run via SIMULATE.
- `cre login` already works (Dami logged in this session; `cre whoami` returns the account).
- With `--broadcast`, simulate can write a real attestation tx to Base Sepolia.

## REAL blocker: workflow code uses an UNVERIFIED API (does NOT compile vs cre-sdk 1.23.0)
`cd packages/cre && npx tsc --noEmit` -> 7 errors:
- `http.trigger(...)` : `.trigger` not on ClientCapability (wrong client-instantiation pattern)
- `resp.ok()` / `resp.json()` : NOT methods. Use helper fns `ok(resp)`, `json(resp)`, `text(resp)` from
  `@chainlink/cre-sdk` http-helpers; response has `.statusCode`.
- `new EVMClient({ chainName })` : constructor wants a chain SELECTOR (bigint), not `{chainName}`.
  Base Sepolia selector = 10344971235874465080 (config.ts BASE_SEPOLIA.selector).
- verify.workflow verdict typing (`number` vs `never`), confidential body shape.

## Real 1.23.0 API shape (from installed dist)
- Top-level exports: `Runner`, `cre`, `handler`, `consensusIdenticalAggregation`.
- HTTP: helper fns `ok/text/json/getHeader(response)`; `sendRequester.sendRequest({url,...}).result()`.
- ConfidentialHTTP: build request with `httpRequest({url, method, body, headers, templateValues, timeout, encryptOutput})`.
- EVM: selector-based; `report({encodedPayload, encoderName:"evm", signingAlgo:"ecdsa", hashingAlgo:"keccak256"})`, `writeReport(runtime,{receiver, report, gasConfig})`.
- Entry pattern: ghostfund `workflow/main.ts` = the PROVEN working shape (Runner + cre.handler + getNetwork + EVMClient). Reference: ~/Desktop/dev/ghostfund-v2/workflow/{project.yaml, workflow/workflow.yaml, workflow/main.ts, workflow/config.json}.

## Project scaffold needed (ghostfund pattern)
- `project.yaml` (rpcs per chain-name) + a workflow dir with `workflow.yaml` (user-workflow name + workflow-artifacts: workflow-path ./main.ts, config-path ./config.json) + `main.ts` (single workflow entry) + `config.json` + `package.json` + `tsconfig.json`.
- CRE simulates ONE workflow per main.ts. We have TWO (verify + screen). Scaffold each (or combine).

## Port plan
1. Scaffold a cre project (project.yaml + workflow dir) under packages/cre (or a cre-run/ dir).
2. Port SCREEN first (plain HTTP OFAC + DON consensus + EVM writeReport) to the real API -> `cre workflow simulate` -> real HIT/CLEAR verdict. No confidential, lowest risk.
3. Port VERIFY (confidential-http or regular http for the demo) -> simulate.
4. Wire run-cre.sh: CRE_WIRED=1, call `cre workflow simulate` for verify+screen, parse stdout JSON (verifyVerdict, screenVerdict, txHashes), emit to api/run.
5. Test /api/run with a complete IVMS intent -> real CLEARED / DO_NOT_TRANSMIT.

## PROVEN 2026-11-01 02:13 - the CRE pipeline RUNS (no beta)
`cd packages/cre/cre-run && cre workflow simulate screen --target staging-settings --http-payload '<json>' --trigger-index 0 --non-interactive`
-> Workflow compiled ✓, Simulator Initialized ✓, trigger http-trigger@1.0.0-alpha fired ✓, workflow EXECUTED ✓.
Scaffold that works: cre-run/{project.yaml (literal RPC, NOT ${env} - cre didn't expand it), screen/{workflow.yaml, main.ts, config.json, package.json, tsconfig.json}}. deps: `npm install` in screen/.
Real-API fixes that cleared compile:
- HTTP TRIGGER = `new cre.capabilities.HTTPCapability().trigger({})` (NOT HTTPClient - that's outbound sendRequest).
- handler MUST be `async ... : Promise<string>` returning a string (Promise<unknown> -> "not assignable to Promise<never>").
- EVM = `getNetwork({chainFamily:'evm', chainSelectorName, isTestnet:true}).chainSelector.selector` -> `new cre.capabilities.EVMClient(selector)`.
- HTTP response: `ok(resp)`, `text(resp)` helper fns (top-level exports), resp.statusCode (NOT resp.ok()/.json()).
- simulate needs `--target staging-settings`; `--skip-type-checks` is a cre-compile flag, not a simulate flag.
- Default sim private key used for chain writes unless CRE_ETH_PRIVATE_KEY in .env.

## ONLY remaining blocker (screen): OFAC SDN feed too big for one in-workflow fetch
`[2]Unknown: context deadline exceeded (Client.Timeout ... while reading body)` - the >10MB SDN.XML fetch
times out / exceeds the CRE HTTP capability's body limit. FIX OPTIONS (next session):
1. BEST: expose a lightweight sanctions-check endpoint from our own backend (we already fetch+index OFAC) -
   e.g. GET /api/ofac?address=X -> {hit:bool}; the DON queries THAT (tiny response). Legit "DON calls a
   sanctions API" pattern.
2. Use a smaller/paginated OFAC source (digital-currency subset) if one exists.
3. Tune request timeout + stream; likely still hits the capability body cap.

## REMAINING WORK (fresh session, use this file + the scaffold)
- [ ] screen: fix the OFAC fetch (option 1), get a real HIT/CLEAR verdict from simulate (use Garantex demo addr -> HIT).
- [ ] verify workflow: port to real API (confidential-http mock OR regular http for the synthetic VASP check); simulate.
- [ ] wire run-cre.sh: CRE_WIRED=1; call `cre workflow simulate screen/verify ... --http-payload "$PAYLOAD"`, parse the
      JSON string the handler returns from stdout -> {verifyVerdict, screenVerdict, txHashes}; emit to apps/web/lib/cre.ts.
- [ ] test /api/run with a complete IVMS intent -> real CLEARED / DO_NOT_TRANSMIT (vs today's 502 fail-closed).
- [ ] optional: `--broadcast` for a real on-chain attestation tx on Base Sepolia -> live /ledger row.

## ✅ DONE 2026-11-01 - CRE fully wired; /api/run returns REAL verdicts
All four steps complete and proven end-to-end via `cre workflow simulate` (local CRE simulation, no beta):

1. **OFAC fix (screen):** `apps/web/app/api/ofac/route.ts` - `GET /api/ofac?address=X -> {hit}` reusing
   `@travelproof/ofac` (fetch+index, 1h cache). The DON queries THIS (tiny response) instead of the 10MB
   SDN.XML. Proven against the LIVE feed: Garantex `3Lpoy...kh1` -> HIT, random -> CLEAR (pub 10/28/2026, 19484 recs).
   `screen/main.ts` now fetches the endpoint + parses `{hit}`; `screen/config.json` uses `ofacApiUrl`.
   Extra fix: `JSON.stringify` of the writeReport reply needs a BigInt replacer ("BigInt are forbidden").
2. **Verify ported:** scaffold `cre-run/verify/` (main.ts/config.json/workflow.yaml/package.json/tsconfig).
   Real HTTP POST to `apps/web/app/api/vasp-verify/route.ts` (bearer-gated), which shares the verdict
   logic with the standalone server via `packages/vasp-registry/src/verify.ts` (REAL TRISA lookup +
   DISCLOSED synthetic fallback). Registered VASP -> verifyVerdict 0; unregistered -> 1. Fix: the proto
   `body` field is bytes -> must `bytesToBase64(TextEncoder().encode(json))` ("invalid base64 string").
3. **run-cre.sh wired (CRE_WIRED=1):** drives both simulates, `scripts/cre-parse.js` extracts the handler
   result strings from stdout -> `{verifyVerdict, screenVerdict, txHashes}`. Fail-closed: any sim/parse
   failure exits non-zero. `apps/web/lib/cre.ts` resolves the runner off cwd (../../scripts), 120s timeout.
4. **/api/run proven** (dev server: `cd apps/web && CRE_WIRED=1 VASP_VERIFY_KEY=dev-key npx next dev -p 3001`):
   - clean addr + registered VASP  -> `CLEARED`         (verify 0, screen CLEAR)
   - Garantex SDN addr             -> `DO_NOT_TRANSMIT`  (screen HIT)
   - clean addr + UNREGISTERED VASP-> `DO_NOT_TRANSMIT`  (verify 1, screen CLEAR)  ← verify gate blocks independently
   - CRE_WIRED unset               -> runner exits 1 -> api/run 502 (no fabricated verdict)

**Run the demo:** start the dev server with the two env vars above (that's the only requirement - cre is
already logged in, no beta). txHashes is `[]` under plain simulate.

5. **Optional --broadcast (NOT done):** add `--broadcast` to the two simulate calls in run-cre.sh (set
   `CRE_ETH_PRIVATE_KEY` in cre-run/.env for a funded Base Sepolia key) -> real attestation tx -> live
   /ledger row. Re-frame the demo as live-attested if enabled.

## Honesty note
Simulate = DON + enclave EMULATED locally (real logic, real OFAC data, real signed report in sim; with --broadcast a real Base Sepolia tx). Call it "local CRE simulation", not "production managed-DON". Still a real, honest live verdict - upgrades the demo from fully-fail-closed to real-verdict.
