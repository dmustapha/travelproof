# Organizer Feedback: Chainlink CRE + BLI Legal Tech Hackathon 2

Constructive integration and developer-experience signal captured while actually building TravelProof on Chainlink CRE (`@chainlink/cre-sdk` 1.23.0, `cre` CLI v1.2.0). Sourced from the build's own `CRE-WIRING-NOTES.md` and `PULSE.md`. Filtered to organizer-actionable items (SDK, docs, infra); self-inflicted issues are excluded.

## Chainlink CRE SDK and CLI

1. **The 1.23.0 TypeScript API is under-documented versus the examples.** Several example-shaped calls do not compile against the installed dist. Concretely:
   - HTTP trigger is `new cre.capabilities.HTTPCapability().trigger({})`, not `http.trigger(...)` on a client. `HTTPClient` is outbound-only (`sendRequest`).
   - Response helpers are free functions `ok(resp)` / `text(resp)` / `json(resp)` and `resp.statusCode`, not `resp.ok()` / `resp.json()` methods. This is the single most time-costly mismatch; a judge or a new builder copying the docs hits it immediately.
   - `EVMClient` wants a chain **selector** (bigint) from `getNetwork(...).chainSelector.selector`, not `{ chainName }`.
   - The workflow handler must be typed `async (): Promise<string>`; returning `Promise<unknown>` fails with "not assignable to Promise<never>", which does not point at the cause.
   **Ask:** publish a 1.23.0 API reference (or type-accurate examples) for the HTTP capability, response helpers, and `EVMClient` constructor. A minimal compiling "hello workflow" pinned to 1.23.0 would remove most of this.

2. **`JSON.stringify` of the `WriteReportReply` throws "BigInt are forbidden".** Returning the report reply from a handler needs a manual BigInt replacer. **Ask:** ship a serializer helper or document the replacer in the writeReport example.

3. **A confidential-HTTP POST body must be base64 of the UTF-8 bytes** (`bytesToBase64(TextEncoder().encode(json))`); passing a JSON string yields "invalid base64 string" with no hint that the proto `body` field is bytes. **Ask:** document the bytes/base64 contract on the request body field.

4. **`cre workflow simulate` requires `--target staging-settings`** and silently misbehaves without it; `--skip-type-checks` is a `cre-compile` flag, not a `simulate` flag, which is easy to conflate. **Ask:** make the target requirement an explicit error, and document the compile-versus-simulate flag split.

5. **`cre` needs `bun` to compile TypeScript workflows**, and this is undocumented in the quickstart. On a memory-constrained host the bun bundle step is heavy (it thrashed a 1GB VM even with 8GB swap). **Ask:** document the bun dependency and the compile memory footprint; a prebuilt-WASM / "compile once, run anywhere" path for `simulate` would let low-resource and serverless hosts run verdicts.

6. **Login versus deploy access is not obvious.** `cre login` succeeds and `cre whoami` works, but deployment to the managed DON needs a separate `cre account access` grant (org status starts `GATED`). The distinction only surfaced by reading the CLI's own closing hint. **Ask:** state in onboarding that simulation works immediately post-login but production deploy is a separate gated request, with expected approval timing.

## HTTP capability limits (infra)

7. **The in-workflow HTTP fetch has a body-size limit that the OFAC SDN feed exceeds.** A single fetch of the live Treasury SDN.XML (>10MB) returns "context deadline exceeded ... while reading body". The legitimate workaround is to expose a small project endpoint (`GET /api/ofac?address=`) that the DON queries. **Ask:** document the HTTP capability body/timeout limits explicitly so builders design the "DON calls a small API" pattern up front instead of discovering it by failure.

## Serverless deployment (DX)

8. **CRE workflows cannot run on serverless hosts (e.g. Vercel):** the `cre` binary, a ~20s subprocess, and a writable filesystem are all required, none of which serverless provides. This forces a VM for any live-verdict demo. **Ask:** a hosted "run this workflow" endpoint, or a WASM-only execution path, would let the large population of serverless-first builders show a live verdict without standing up a VM.

## BLI Legal Tech Hackathon (platform)

9. **The prize layer is ambiguous.** The headline "$20,000" carries a page disclaimer that it "may not reflect the actual prize amount"; the concrete layer is "$10,000+ in bounties, support, and promotion". **Ask:** a firmer prize/bounty breakdown earlier would help builders decide scope.

10. **Legal-track judging criteria could be more explicit.** For a law-firm audience, a published rubric weighting legal correctness, adoptability, and cited frameworks (versus raw technical depth) would help builders aim. TravelProof invested heavily in cited regimes (FATF R.16, EU TFR Art.14, de-minimis divergence) on the assumption that "make lawyers nod" is the bar; confirming that in a rubric would reduce guesswork.

## What went well

- `cre workflow simulate` runs the full DON + enclave emulation locally with real data and a real signed report in simulation, with no beta required. This is a genuinely strong local-development story once the API shape is known.
- The KeystoneForwarder binding model (receiver reverts on any unbound workflow) made a clean, provable security boundary straightforward to implement.
