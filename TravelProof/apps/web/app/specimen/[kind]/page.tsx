import { notFound } from "next/navigation";
import { RecordDocument } from "../../../components/RecordDocument";
import { specimen } from "../../../lib/specimen";

export default async function Specimen({ params }: { params: Promise<{ kind: string }> }) {
  const { kind: slug } = await params;
  const kind = slug === "no-hit" ? "cleared" : slug === "ofac-hit" ? "blocked" : "";
  if (kind !== "cleared" && kind !== "blocked") notFound();
  const run = specimen(kind);
  return (
    <main className="record">
      <nav className="crumbs"><a href="/">TravelProof</a> / specimen / {slug} <a className="pill pill-solid" href={`/specimen/${slug}/memo.pdf`}>Officer memo (PDF)</a><span className="swap"><a href="/specimen/no-hit" aria-current={kind === "cleared"}>no-hit path</a> · <a href="/specimen/ofac-hit" aria-current={kind === "blocked"}>OFAC hit</a></span></nav>
      <RecordDocument run={run as any} specimen />
    </main>
  );
}
