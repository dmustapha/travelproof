# Deploy TravelProof (UI + live CRE) to the Oracle Cloud box

Goal: make `travelproof` run the REAL CRE path live (not just localhost), so `/api/run` returns real
CLEARED / DO_NOT_TRANSMIT on a public URL. Vercel cannot do this (serverless: no `cre` binary, no
long subprocess, read-only FS), so we host the whole Next app on a VM. Target: the Oracle Cloud
Always-Free box (same infra as `api.leash.ink`, `132.145.100.81`).

## Why a VM (the one constraint)
`/api/run` shells out to `scripts/run-cre.sh`, which runs the local `cre` CLI and two `cre workflow
simulate` subprocesses (~15-20s total, recompiles each call). That needs a stateful host with `cre`
installed. A VM provides it; a serverless function does not.

## Blockers that need Dami (only these two)
1. Shell access to the box. Per memory `leash-rescue-box-access`: the SSH key is not on this Mac and
   the Run Command exec channel was dead. Add a key / open a shell.
2. `cre login` on the box. It is an interactive browser auth; must be done as the box user once.

## One-time box setup
```
# as the box user
git clone https://github.com/dmustapha/travelproof   # or git pull in an existing clone
cd travelproof
# install the cre CLI (same version used locally: 1.2.0 cli / cre-sdk 1.23.0), then:
cre login            # interactive; Dami
cre whoami           # confirm

# project.yaml holds a LITERAL RPC url (cre does not expand ${env}); it is gitignored.
cp packages/cre/cre-run/project.yaml.example packages/cre/cre-run/project.yaml
# edit it: paste a real Base Sepolia RPC URL (Alchemy key) into the url: field
```

## Deploy
```
VASP_VERIFY_KEY='<a-strong-secret>' bash scripts/deploy-oracle.sh
```
This installs deps, runs `next build`, and starts the app on `:3001` in the foreground (first smoke
test). The CRE workflows fetch `http://localhost:3001/api/ofac` + `/api/vasp-verify` on this same
host, so keep the app on `:3001` (that port is baked into the two `cre-run/*/config.json` files).

## Make it a daemon + public URL
- Daemon: pm2 (`pm2 start "pnpm start -p 3001" --name travelproof --cwd apps/web` with the 3 env vars)
  or a systemd unit. Keep `CRE_WIRED=1`, `VASP_VERIFY_KEY`, `ATTESTATION_ADDRESS` in the unit/env.
- TLS + domain: Caddy or nginx reverse-proxy 443 to `127.0.0.1:3001` (LEASH already runs Caddy on this
  box; add a vhost). A `*.sslip.io` host works for a quick public URL if no domain is ready.

## Smoke test (on the box, after start)
```
curl -s "http://localhost:3001/api/ofac?address=3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1"   # {"hit":true,...}
# CLEARED + DO_NOT_TRANSMIT: POST the two intents from CRE-WIRING-NOTES.md to /api/run
```

## After it is live (Dami will do these)
- Submission details: update the live URL; keep the honesty framing (now "live CRE simulation on a
  hosted DON runner", still fail-closed, still specimen labels where applicable).
- GitHub: `git push` this commit (CRE wiring) so the repo matches the live site.
- Demo video: re-record `/api/run` hitting the live URL for a real CLEARED / DO_NOT_TRANSMIT.

## Optional upgrade: real on-chain attestation
Add `--broadcast` to the two `cre workflow simulate` calls in `scripts/run-cre.sh` and set
`CRE_ETH_PRIVATE_KEY` (a funded Base Sepolia key) in `packages/cre/cre-run/.env`. Then each verdict
writes a real attestation tx to `0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD` and `/ledger` shows a
live row. Re-frame the demo as live-attested if enabled.
