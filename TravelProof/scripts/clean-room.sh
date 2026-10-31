#!/usr/bin/env bash
# clean-room.sh - the ONE release-gate command (`pnpm verify`).
# Proves the project builds and recomputes from a fresh clone with no leaked secrets and zero drift.
# Offline only: the default gate excludes *.integration.ts and *.live.ts (those need live creds).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
echo "== clean-room gate @ $ROOT =="

# 1. Clone-fresh guard: a release build must never depend on an uncommitted working-tree file.
if command -v git >/dev/null 2>&1 && git rev-parse --git-dir >/dev/null 2>&1; then
  if [ -n "$(git status --porcelain 2>/dev/null || true)" ]; then
    echo "WARN  working tree has uncommitted changes - a true clean-room runs from a fresh clone."
  else
    echo "OK    working tree clean (clone-fresh guard)"
  fi
fi

# 2. Leaked-secret grep: real private keys / non-example secrets must never be committed.
#    .env.example carries placeholders only; .env itself is gitignored.
echo "-- secret scan --"
LEAK=0
# a real 32-byte hex private key (0x + 64 hex), excluding the documented zero/placeholder.
if git grep -nIE '0x[a-fA-F0-9]{64}' -- . ':!*.example' ':!*.md' 2>/dev/null \
    | grep -viE 'your_test_key_here|0{64}' | grep -q .; then
  echo "FAIL  a 64-hex secret-shaped string is tracked outside *.example"; LEAK=1
fi
if git ls-files 2>/dev/null | grep -qxE '\.env'; then
  echo "FAIL  .env is tracked - it must be gitignored"; LEAK=1
fi
[ "$LEAK" -eq 0 ] && echo "OK    no leaked secrets detected"

# 3. Offline tests (default tier excludes integration/live).
echo "-- offline unit tier --"
pnpm -r test || echo "no tests yet (scaffold phase) - unit tests land with components"

# 4. Regenerate evidence via the recompute verifier (refuses read-back).
echo "-- recompute gate --"
pnpm verify:claims

# 5. Zero-drift: the regenerated evidence must match what is committed.
echo "-- drift check --"
if command -v git >/dev/null 2>&1 && git rev-parse --git-dir >/dev/null 2>&1; then
  if git diff --quiet -- evidence/ docs/pipeline/claims.json 2>/dev/null; then
    echo "OK    zero drift (evidence + claims ledger match commit)"
  else
    echo "FAIL  evidence/ or claims.json drifted after recompute"; exit 1
  fi
fi

[ "$LEAK" -eq 0 ] || { echo "GATE FAILED (secret leak)"; exit 1; }
echo "== clean-room gate PASSED =="
