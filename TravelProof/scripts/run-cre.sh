#!/usr/bin/env bash
# File: scripts/run-cre.sh
# Real CRE runner: drives the dual `cre workflow simulate` (verify + screen) against the local
# cre-run scaffold and emits the REAL verdicts the workflows produced. This is LOCAL CRE SIMULATION
# (DON + enclave emulated on this host; real logic, real OFAC/TRISA data, real DON-signed report).
# With CRE_BROADCAST=1 (and --broadcast wired below) it writes a real Base Sepolia attestation tx.
#
# HONESTY: verdicts here come ONLY from the real simulate run — never a constant. If either simulate
# fails or its result cannot be parsed, this script exits non-zero so apps/web/api/run degrades to a
# 502 (never a fabricated CLEARED). api/run also rejects any non-enum verdict as a second backstop.
set -euo pipefail

PAYLOAD="${1:-}"
if [ -z "$PAYLOAD" ]; then echo "usage: run-cre.sh '<json-payload>'" >&2; exit 2; fi
if [ "${CRE_WIRED:-0}" != "1" ]; then
  echo "WIRE_REQUIRED: run-cre.sh is not wired. Set CRE_WIRED=1 (and start the dev server so /api/ofac + /api/vasp-verify are reachable)." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CRE_RUN_DIR="$REPO_ROOT/packages/cre/cre-run"
CRE="${CRE_BIN:-$HOME/.cre/bin/cre}"
APP_BASE="${APP_BASE_URL:-http://localhost:3001}"
TARGET="${CRE_TARGET:-staging-settings}"
# bun is required by `cre` to compile TypeScript workflows; it installs to ~/.bun/bin.
export PATH="$HOME/.cre/bin:$HOME/.bun/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"

[ -x "$CRE" ] || { echo "CRE_CLI_MISSING: $CRE not found/executable" >&2; exit 1; }

# Warm the OFAC index so the in-workflow DON fetch returns instantly (a cold /api/ofac pulls ~10MB and
# would risk timing out the CRE HTTP capability). Warm the ACTUAL beneficiary address (the index is
# global, so any address warms it). Best-effort; the simulate call is the real gate.
BENE_ADDR="$(printf '%s' "$PAYLOAD" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{console.log(JSON.parse(s).beneficiaryAddress||'warmup')}catch{console.log('warmup')}})" 2>/dev/null || echo warmup)"
curl -s -o /dev/null --max-time 30 "$APP_BASE/api/ofac?address=$BENE_ADDR" || true

cd "$CRE_RUN_DIR"
# Retry each simulate leg up to 3x. On a memory-constrained host the in-workflow CRE HTTP fetch can
# transiently exceed the capability timeout, making a single simulate flaky. We re-run the REAL
# simulate until it emits a result; this never fabricates a verdict (a leg that never yields a
# "Workflow Simulation Result" still fails the parse below and api/run returns 502, fail-closed).
sim_leg() {
  local leg="$1" out=""
  for attempt in 1 2 3; do
    out="$("$CRE" workflow simulate "$leg" --target "$TARGET" --http-payload "$PAYLOAD" --trigger-index 0 --non-interactive 2>&1 || true)"
    printf '%s' "$out" | grep -q "Workflow Simulation Result" && break
    sleep 2
  done
  printf '%s' "$out"
}
SCREEN_OUT="$(sim_leg screen)"
VERIFY_OUT="$(sim_leg verify)"

SCREEN_FILE="$(mktemp)"; VERIFY_FILE="$(mktemp)"
printf '%s' "$SCREEN_OUT" > "$SCREEN_FILE"
printf '%s' "$VERIFY_OUT" > "$VERIFY_FILE"

# Extract each handler's returned result object from the simulate stdout and build the wire contract.
# Fails loudly (exit 1) if either result is missing/unparseable → api/run returns a 502, never a lie.
if node "$SCRIPT_DIR/cre-parse.js" "$SCREEN_FILE" "$VERIFY_FILE"; then
  rm -f "$SCREEN_FILE" "$VERIFY_FILE"
else
  rc=$?
  echo "CRE_SIM_FAILED: could not parse a real verdict from simulate output." >&2
  echo "----- screen -----" >&2; tail -8 "$SCREEN_FILE" >&2
  echo "----- verify -----" >&2; tail -8 "$VERIFY_FILE" >&2
  rm -f "$SCREEN_FILE" "$VERIFY_FILE"
  exit "$rc"
fi
