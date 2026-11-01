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
export PATH="$HOME/.cre/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"

[ -x "$CRE" ] || { echo "CRE_CLI_MISSING: $CRE not found/executable" >&2; exit 1; }

# Warm the OFAC index so the in-workflow DON fetch returns instantly (a cold /api/ofac pulls ~10MB and
# would risk timing out the CRE HTTP capability). Best-effort; the simulate call is the real gate.
curl -s -o /dev/null --max-time 30 "$APP_BASE/api/ofac?address=warmup" || true

cd "$CRE_RUN_DIR"
SCREEN_OUT="$("$CRE" workflow simulate screen --target "$TARGET" --http-payload "$PAYLOAD" --trigger-index 0 --non-interactive 2>&1 || true)"
VERIFY_OUT="$("$CRE" workflow simulate verify --target "$TARGET" --http-payload "$PAYLOAD" --trigger-index 0 --non-interactive 2>&1 || true)"

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
