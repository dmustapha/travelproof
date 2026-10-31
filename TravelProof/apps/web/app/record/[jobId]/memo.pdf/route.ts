// File: apps/web/app/record/[jobId]/memo.pdf/route.ts
// Renders the lawyer-grade memo (CO-1 C) to a PDF the officer can file. Reads the ephemeral run;
// threads the live OFAC publishDate captured on the run. No PII is persisted beyond the process.
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { MemoDoc } from "../../../../lib/memo";
import { getRun } from "../../../../lib/runStore";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const run = getRun(jobId);
  if (!run) return NextResponse.json({ error: "no record for this job" }, { status: 404 });
  const cleared = run.verifyVerdict === 0 && run.screenVerdict === "CLEAR";
  const txUrl = `https://sepolia.basescan.org/tx/${run.txHash ?? ""}`;
  const buffer = await renderToBuffer(
    MemoDoc({
      ivms: run.ivms,
      applicability: run.applicability,
      jobId,
      commitment: run.commitmentHash,
      txUrl,
      cleared,
      publishDate: run.publishDate ?? "(OFAC publish date unavailable)",
    }),
  );
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="travel-rule-record-${jobId.slice(0, 10)}.pdf"`,
    },
  });
}
