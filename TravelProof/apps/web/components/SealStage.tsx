"use client";
import { useEffect, useState } from "react";
import { Seal, gatesFor } from "./Seal";
import { GateRows } from "./GateRows";

const SPEC_RING = "TRAVELPROOF · FATF R.16 · BASE SEPOLIA 84532 · ";

export function SealStage() {
  const [hit, setHit] = useState(false);
  const [k, setK] = useState(0);
  useEffect(() => { const t = setInterval(() => setK((n) => n + 1), 9000); return () => clearInterval(t); }, []);
  const g = gatesFor({ stage: hit ? "DO_NOT_TRANSMIT" : "CLEARED", verifyVerdict: 0, screenVerdict: hit ? "HIT" : "CLEAR", attested: false });
  return (
    <div className="stage" key={k}>
      <div className="stage-seal"><Seal gates={g.gates} voided={g.voided} size={330} id="hero" ringText={g.voided ? undefined : SPEC_RING} /></div>
      <div className="stage-panel">
        <div className="guilloche-band" aria-hidden="true" />
        <div className="stage-body">
          <div className="stage-head">
            <span className="eyebrow-mono">One transfer · four gates · specimen</span>
            <span className="seg" role="group" aria-label="Scenario">
              <button type="button" aria-pressed={!hit} onClick={() => { setHit(false); setK(k + 1); }}>No hit</button>
              <button type="button" aria-pressed={hit} onClick={() => { setHit(true); setK(k + 1); }}>OFAC hit</button>
            </span>
          </div>
          <GateRows gates={g.gates} specimen />
          <div className={`stage-verdict ${hit ? "v-block" : "v-spec"}`}>{hit ? "DO NOT TRANSMIT · SPECIMEN" : "SPECIMEN · SCREEN NOT RUN"}</div>
          <a className="excerpt" href={`/specimen/${hit ? "ofac-hit" : "no-hit"}`}>Open the full transmittal record →</a>
        </div>
      </div>
    </div>
  );
}
