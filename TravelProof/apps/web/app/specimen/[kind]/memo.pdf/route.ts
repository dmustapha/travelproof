import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { MemoDoc } from "../../../../lib/memo";
import { specimen } from "../../../../lib/specimen";

// SPECIMEN memo (real classifier + IVMS assembler; no CRE run, no chain claim).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind: slug } = await params;
  const kind = slug === "no-hit" ? "cleared" : slug === "ofac-hit" ? "blocked" : "";
  if (kind !== "cleared" && kind !== "blocked") return NextResponse.json({ error: "unknown specimen" }, { status: 404 });
  const r = specimen(kind);
  const buffer = await renderToBuffer(MemoDoc({ ivms: r.ivms as any, applicability: r.applicability as any, jobId: r.jobId, commitment: r.commitmentHash, txUrl: "(specimen: not attested)", cleared: kind === "cleared", specimen: true, verifyVerdict: r.verifyVerdict, screenVerdict: r.screenVerdict, transfer: r.transfer, publishDate: "(specimen: no live screen)" }));
  return new NextResponse(new Uint8Array(buffer), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="specimen-${kind}.pdf"` } });
}
