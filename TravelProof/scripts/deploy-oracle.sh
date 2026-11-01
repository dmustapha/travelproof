#!/usr/bin/env bash
# File: scripts/deploy-oracle.sh
# Deploy TravelProof (UI + live CRE) to a VM (Oracle Cloud Always-Free box). Run this ON the box,
# from the repo root, AFTER: (1) git pull, (2) `cre login` as this user, (3) created
# packages/cre/cre-run/project.yaml from project.yaml.example with a real Base Sepolia RPC URL.
#
# It installs deps, builds the Next app, and starts it on :3001 (the CRE workflows fetch
# http://localhost:3001/api/ofac + /api/vasp-verify on this same host). Put a reverse proxy
# (Caddy/nginx) in front of :3001 for TLS + a domain. For a long-lived process use pm2 or systemd
# (see DEPLOY-TO-ORACLE.md); this script runs it in the foreground for a first smoke test.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

CRE="${CRE_BIN:-$HOME/.cre/bin/cre}"
[ -x "$CRE" ] || { echo "FATAL: cre CLI not found at $CRE. Install it and run 'cre login' first." >&2; exit 1; }
"$CRE" whoami >/dev/null 2>&1 || { echo "FATAL: not logged in. Run 'cre login' as this user first." >&2; exit 1; }
[ -f packages/cre/cre-run/project.yaml ] || { echo "FATAL: packages/cre/cre-run/project.yaml missing. Copy project.yaml.example and set a real RPC URL." >&2; exit 1; }

command -v pnpm >/dev/null 2>&1 || npm i -g pnpm

echo "[1/4] workspace install"
pnpm install

echo "[2/4] CRE workflow deps (npm, not workspace)"
( cd packages/cre/cre-run/screen && npm install --no-audit --no-fund )
( cd packages/cre/cre-run/verify && npm install --no-audit --no-fund )

echo "[3/4] production build"
( cd apps/web && pnpm build )

echo "[4/4] start on :3001 (Ctrl-C to stop; use pm2/systemd for a daemon)"
export CRE_WIRED=1
export VASP_VERIFY_KEY="${VASP_VERIFY_KEY:?set VASP_VERIFY_KEY to a strong secret before running}"
export ATTESTATION_ADDRESS="${ATTESTATION_ADDRESS:-0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD}"
cd apps/web && exec pnpm start -p 3001
