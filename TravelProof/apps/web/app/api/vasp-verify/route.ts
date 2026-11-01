// File: apps/web/app/api/vasp-verify/route.ts
// VASP verification surface the CRE verify workflow queries. Registration is a REAL live TRISA testnet
// directory lookup (with a DISCLOSED synthetic fallback); the originator attribute-match is synthetic
// (mTLS gRPC handshake out of scope — DISCLOSED via `source`). Shares the exact verdict logic with the
// standalone vasp-registry server (packages/vasp-registry/src/verify.ts) — no duplication.
//
// NOTE (honesty): the production privacy path is CRE Confidential-HTTP (PII resolved inside the enclave,
// verify.workflow.ts). For the local simulation demo the DON calls this plain endpoint — the verdict
// logic and data are identical; only the enclave transport is emulated.
import { NextRequest, NextResponse } from "next/server";
import { verifyVasp } from "@travelproof/vasp-registry/verify";

export const dynamic = "force-dynamic";

const API_KEY = process.env.VASP_VERIFY_KEY ?? "dev-key";

export async function POST(req: NextRequest) {
  // Bearer-gated like the standalone server — the DON passes the key so the surface is not open.
  if (req.headers.get("authorization") !== `Bearer ${API_KEY}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let vaspLei: string, originatorHash: string;
  try {
    ({ vaspLei, originatorHash } = (await req.json()) as { vaspLei: string; originatorHash: string });
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const result = await verifyVasp(vaspLei, originatorHash);
  return NextResponse.json(result);
}
