#!/usr/bin/env bash
# File: scripts/run-cre.sh
# WARNING: UNVERIFIED — this is a FAIL-LOUD stub. At wire (PLAN P3.4b) replace the exit-1 block
# with the real `cre workflow simulate --broadcast` invocation that triggers verify + screen and
# parses the REAL verdicts + tx hashes. It MUST emit verdicts from the real run; NEVER a constant.
# Deliberately does NOT emit a passing verdict: a constant PASS here would fabricate every demo
# CLEARED (the A-G4 BLOCKER). api/run rejects any non-enum verdict, so an un-wired runner degrades
# loudly rather than lying.
set -euo pipefail
PAYLOAD="$1"
if [ "${CRE_WIRED:-0}" != "1" ]; then
  echo "WIRE_REQUIRED: run-cre.sh is a stub. Wire the real 'cre workflow simulate --broadcast' (PLAN P3.4b) and set CRE_WIRED=1." >&2
  exit 1
fi
# --- wire these two lines, capture the real verdicts + tx hashes, emit them as JSON ---
# (ready-to-uncomment at wire; requires `cre login` + the Confidential Workflows beta — same block as C4)
# VERIFY_OUT=$(cre workflow simulate packages/cre/src/verify.workflow.ts --broadcast --target base-sepolia --input "$PAYLOAD")
# SCREEN_OUT=$(cre workflow simulate packages/cre/src/screen.workflow.ts --broadcast --target base-sepolia --input "$PAYLOAD")
# parse VERIFY_OUT/SCREEN_OUT -> {"verifyVerdict":<0|1|2>,"screenVerdict":"CLEAR|HIT|DEGRADED","txHashes":[...]}
echo "WIRE_REQUIRED: real cre invocation not yet pasted" >&2
exit 1
