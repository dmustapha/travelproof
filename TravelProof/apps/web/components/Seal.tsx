// The Seal - TravelProof's signature object. A notarial rosette whose four gate arcs inscribe as the
// real stage advances. State-driven (props), never decorative: idle/active/pass/fail per gate.
export type GateState = "idle" | "active" | "pass" | "fail" | "open";
export const ATTESTED_RING = "TRAVELPROOF · DON-ATTESTED · BASE SEPOLIA 84532 · ";
export const GATES = ["CLASSIFY", "ENCLAVE", "SCREEN", "ATTEST"] as const;

function guilloche(r: number, amp: number, lobes: number, phase: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 360; i += 2) {
    const t = (i * Math.PI) / 180;
    const rr = r + amp * Math.sin(lobes * t + phase);
    pts.push(`${i === 0 ? "M" : "L"}${(100 + rr * Math.cos(t)).toFixed(2)} ${(100 + rr * Math.sin(t)).toFixed(2)}`);
  }
  return pts.join("") + "Z";
}
const G1 = guilloche(86, 3.2, 24, 0);
const G2 = guilloche(86, 3.2, 24, Math.PI / 2);
const G3 = guilloche(78, 2.2, 31, 0.6);

function arc(a0: number, a1: number, r: number): string {
  const p = (a: number) => [100 + r * Math.cos(((a - 90) * Math.PI) / 180), 100 + r * Math.sin(((a - 90) * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

export function Seal({ gates, voided = false, ringText, size = 220, label, id = "s" }: {
  gates: GateState[]; voided?: boolean; ringText?: string; size?: number; label?: string; id?: string;
}) {
  const text = ringText ?? (voided ? "DO NOT TRANSMIT · DO NOT TRANSMIT · DO NOT TRANSMIT · " : "TRAVELPROOF · TRAVEL RULE TRANSMITTAL RECORD · ");
  return (
    <svg className={`seal ${voided ? "seal-void" : ""}`} width={size} height={size} viewBox="0 0 200 200" role="img"
      aria-label={label ?? (voided ? "Seal: do not transmit" : "Seal: attestation gates")}>
      <defs>
        <path id={`${id}-ring`} d="M100 100m-70 0a70 70 0 1 1 140 0a70 70 0 1 1-140 0" />
        <path id={`${id}-inner`} d="M100 100m-47 0a47 47 0 1 1 94 0a47 47 0 1 1-94 0" />
        <pattern id={`${id}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <g className="seal-gl seal-gl-a"><path d={G1} /></g>
      <g className="seal-gl seal-gl-b"><path d={G2} /></g>
      <g className="seal-gl seal-gl-c"><path d={G3} /></g>
      <circle className="seal-edge" cx="100" cy="100" r="95" />
      <circle className="seal-edge" cx="100" cy="100" r="58" />
      <text className="seal-ringtext" fontSize="8.6"><textPath href={`#${id}-ring`} startOffset="0" textLength="438">{text}</textPath></text>
      {GATES.map((g, i) => {
        const a0 = i * 90 + 6, a1 = i * 90 + 84;
        return (
          <g key={g} className={`gate gate-${gates[i]}`} style={{ ["--i" as any]: i }}>
            <path className="gate-track" d={arc(a0, a1, 64)} />
            <path className="gate-arc" d={arc(a0, a1, 64)} pathLength={100} />
            <text className="gate-label" fontSize="5.2"><textPath href={`#${id}-inner`} startOffset={`${(i * 25 + 12.5).toFixed(1)}%`} textAnchor="middle">{g}</textPath></text>
          </g>
        );
      })}
      <circle className="seal-core" cx="100" cy="100" r="34" />
      {voided
        ? <g className="seal-voidmark"><circle cx="100" cy="100" r="33" fill={`url(#${id}-hatch)`} /><text className="seal-glyph" x="100" y="113" textAnchor="middle" fontSize="38" opacity=".35">§</text><path className="crack" d="M150 22L128 58L142 70L112 100L126 118L96 152L108 178" /></g>
        : <text className="seal-glyph" x="100" y="113" textAnchor="middle" fontSize="38">§</text>}
    </svg>
  );
}

// Map the real run outcome onto the four gates (honest: nothing is shown passed that did not pass).
export function gatesFor(o: { stage: string; verifyVerdict?: number | string; screenVerdict?: string; attested?: boolean }): { gates: GateState[]; voided: boolean } {
  const { stage, verifyVerdict, screenVerdict, attested } = o;
  if (stage === "RUNNING") return { gates: ["active", "active", "active", "active"], voided: false };
  if (stage === "CLEARED") return { gates: ["pass", "pass", "pass", attested ? "pass" : "open"], voided: false };
  if (stage === "DO_NOT_TRANSMIT") {
    const v = Number(verifyVerdict ?? 0);
    const g2: GateState = v === 0 ? "pass" : v === 1 ? "fail" : "idle";
    const g3: GateState = screenVerdict === "HIT" ? "fail" : v !== 0 ? "idle" : screenVerdict === "DEGRADED" ? "idle" : "pass";
    return { gates: ["pass", g2, g3, attested ? "pass" : "open"], voided: true };
  }
  if (stage === "NOT_APPLICABLE") return { gates: ["pass", "idle", "idle", "idle"], voided: false };
  if (stage === "INCOMPLETE") return { gates: ["fail", "idle", "idle", "idle"], voided: false };
  return { gates: ["idle", "idle", "idle", "idle"], voided: false };
}
