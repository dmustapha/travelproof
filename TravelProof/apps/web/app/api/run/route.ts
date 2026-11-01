// File: apps/web/app/api/run/route.ts
import { NextRequest, NextResponse } from "next/server";
import { classify } from "@travelproof/core/resolver";
import { buildIvms, validateIvms } from "@travelproof/core/ivms";
import { commitmentHash, commitmentInputFromIvms, jobIdFor } from "@travelproof/core/commitment";
import type { TransferIntent, ScreenVerdict } from "@travelproof/core/types";
import { putRun } from "../../../lib/runStore";
import { triggerCreRun } from "../../../lib/cre";

const SCREEN_VERDICTS = ["CLEAR", "HIT", "DEGRADED"] as const;

export async function POST(req: NextRequest) {
  // Parse fail-closed: a non-JSON / empty body throws SyntaxError in req.json() and would
  // surface as an opaque 500 before the shape guard below ever runs. Catch it as a clean 400
  // (same discipline as the missing-fields guard - never a swallowed 500).
  let intent: TransferIntent;
  try {
    intent = (await req.json()) as TransferIntent;
  } catch {
    return NextResponse.json(
      { stage: "BAD_REQUEST", reason: "request body is not valid JSON" },
      { status: 400 },
    );
  }
  // Fail-closed on a malformed intent: the structured IVMS fields are mandatory. A missing
  // originator/beneficiary object would crash buildIvms (undefined.primaryIdentifier) with an
  // opaque 500; reject it as a clean 400 instead (never a swallowed 500, never a fabricated pass).
  if (
    !intent || typeof intent !== "object" ||
    !intent.originator?.primaryIdentifier ||
    !intent.beneficiary?.primaryIdentifier ||
    !intent.beneficiaryChainAddress
  ) {
    return NextResponse.json(
      { stage: "BAD_REQUEST", reason: "intent missing required IVMS fields (originator.primaryIdentifier, beneficiary.primaryIdentifier, beneficiaryChainAddress)" },
      { status: 400 },
    );
  }
  const applicability = classify(intent);
  if (applicability.applicable !== true) {
    return NextResponse.json({ stage: "classified", applicability });
  }
  const ivms = buildIvms(intent);
  const validation = validateIvms(ivms);
  if (!validation.complete) {
    return NextResponse.json({ stage: "incomplete", applicability, validation }, { status: 422 });
  }
  const salt = String(Date.now());
  const jobId = jobIdFor(intent.beneficiaryChainAddress, salt);
  // Trigger the dual CRE run (verify + screen). Returns real verdicts + tx hashes.
  // Fail-loud: if the runner is not wired (ENOENT) or errors, degrade to 502 - NEVER a 500 that
  // swallows the cause, and NEVER a fabricated CLEARED (A-G4 #2). The UI renders this honestly.
  let verifyVerdict: number, screenVerdict: string, txHashes: string[], publishDate: string | undefined;
  try {
    ({ verifyVerdict, screenVerdict, txHashes, publishDate } = await triggerCreRun(jobId, intent, ivms));
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ stage: "DEGRADED", reason: `CRE runner unavailable: ${reason}. Start the dev server with CRE_WIRED=1 so scripts/run-cre.sh can drive 'cre workflow simulate' (local CRE simulation).` }, { status: 502 });
  }
  // Fail-closed: the CRE runner MUST return a real enum verdict. A sentinel/unknown value (the
  // run-cre.sh-not-wired failure mode) is rejected, never attested - prevents fabricated state.
  if (!SCREEN_VERDICTS.includes(screenVerdict as ScreenVerdict) || ![0, 1, 2].includes(verifyVerdict)) {
    return NextResponse.json({ stage: "DEGRADED", reason: "CRE runner returned a non-enum verdict (not wired?)", verifyVerdict, screenVerdict }, { status: 502 });
  }
  const commitment = commitmentHash(commitmentInputFromIvms(ivms, verifyVerdict));
  putRun({ jobId, applicability, ivms, verifyVerdict, screenVerdict, commitmentHash: commitment, txHash: txHashes[0], publishDate, createdAt: Date.now(), transfer: { amount: intent.amount, assetSymbol: intent.assetSymbol, fiatValueUsd: intent.fiatValueUsd } });
  const cleared = verifyVerdict === 0 && screenVerdict === "CLEAR";
  return NextResponse.json({ stage: cleared ? "CLEARED" : "DO_NOT_TRANSMIT", jobId, applicability, verifyVerdict, screenVerdict, txHashes });
}
