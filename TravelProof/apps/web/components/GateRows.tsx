import type { GateState } from "./Seal";
const ROWS: [string, string, string][] = [
  ["Classify", "Reg. (EU) 2023/1113 Art. 14 · FATF R.16", "applicable"],
  ["Enclave verify", "On a live run: PII stays in the enclave", "verified"],
  ["OFAC SDN screen", "Digital Currency Address · FAQ 562", "no match"],
  ["Attest", "Base Sepolia 84532 · hashes + enums only", "sealed"],
];
export function GateRows({ gates, specimen = false }: { gates: GateState[]; specimen?: boolean }) {
  return (
    <ol className="stage-rows">
      {ROWS.map(([n, d, ok], i) => {
        const st = gates[i];
        const val = st === "fail" ? (i === 2 ? (specimen ? "listed · specimen" : "HIT · DO NOT TRANSMIT") : "FAILED") : st === "pass" ? (specimen && (i === 1 || i === 2) ? "not run" : ok) : st === "open" ? (specimen ? "not attested" : "awaiting attestation") : st === "active" ? "in progress" : "—";
        return (
          <li key={n} className={`gate-${st} ${specimen && st === "pass" && (i === 1 || i === 2) ? "gate-notrun" : ""}`} style={{ ["--i" as any]: i }}>
            <span className="dot" /><span className="rn">§{i + 1} {n}</span><span className="rd">{d}</span><span className="rv">{val}</span>
          </li>
        );
      })}
    </ol>
  );
}
