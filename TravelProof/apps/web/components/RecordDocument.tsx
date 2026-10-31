import { Seal, gatesFor } from "./Seal";
import { Boundary } from "./Boundary";
import { outcomeOf, OUTCOME_LINE, REQUIRED_ACTION } from "../lib/outcome";

type Run = {
  jobId: string; applicability: any; ivms: any; verifyVerdict: number; screenVerdict: string;
  commitmentHash: string; txHash?: string; publishDate?: string;
  transfer?: { amount: string; assetSymbol: string; fiatValueUsd: number };
};
const CONTRACT = "0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD";
const SHORT = `${CONTRACT.slice(0, 6)}…${CONTRACT.slice(-4)}`;

function Field({ path, value, mono, warn }: { path: string; value?: string; mono?: boolean; warn?: boolean }) {
  return (
    <div className="fld">
      <dt><code>{path}</code></dt>
      <dd className={`${mono ? "mono" : ""} ${warn ? "fld-warn" : ""}`}>{value ?? "—"}</dd>
    </div>
  );
}

export function RecordDocument({ run, specimen = false, attested = false }: { run: Run; specimen?: boolean; attested?: boolean }) {
  const outcome = outcomeOf(run.verifyVerdict, run.screenVerdict);
  const cleared = outcome === "CLEARED";
  const o = run.ivms.Originator.originatorPerson[0];
  const b = run.ivms.Beneficiary.beneficiaryPerson[0];
  const oName = o?.naturalPerson?.name.nameIdentifier[0];
  const bName = b?.naturalPerson?.name.nameIdentifier[0];
  const ov = run.ivms.OriginatingVASP.originatingVASP.legalPerson;
  const bv = run.ivms.BeneficiaryVASP.beneficiaryVASP.legalPerson;
  const g = gatesFor({ stage: cleared ? "CLEARED" : "DO_NOT_TRANSMIT", verifyVerdict: run.verifyVerdict, screenVerdict: run.screenVerdict, attested });
  const ref = `TP-${run.jobId.slice(2, 10).toUpperCase()}`;
  const dateStr = run.ivms.PayloadMetadata?.createdAt?.slice(0, 10) ?? "";
  const ringText = specimen ? (cleared ? "SPECIMEN · NOT ATTESTED · NO CHAIN CLAIM · " : undefined)
    : cleared ? (attested ? `TRAVELPROOF · DON-ATTESTED · BASE SEPOLIA 84532 · ${SHORT} · ` : "CLEARED · ATTESTATION PENDING · NOT YET ON-CHAIN · ") : undefined;
  const origAcct = o?.accountNumber?.[0];
  const usEu = run.applicability.regime === "BOTH";
  return (
    <article className={`sheet ${cleared ? "sheet-ok" : "sheet-block"} ${specimen ? "sheet-specimen" : ""}`}>
      <aside className="docket" aria-hidden="true">
        <span>{ref} · Art. 14</span><span>{ref}</span>
      </aside>
      <div className="sheet-body">
        {specimen && <div className="specimen-strip">SPECIMEN · NOT ATTESTED · built by the real classifier + IVMS 101 assembler; no CRE run and no on-chain claim is made by this page</div>}
        <div className="guilloche-band" aria-hidden="true" />
        <header className="sheet-head">
          <div className="sheet-title">
            <span className="eyebrow-mono">Travel Rule · Transmittal Record · {ref}</span>
            <h1>Travel Rule <em>Transmittal</em> Record</h1>
            <p className="authority">Pursuant to <em>{run.applicability.citation}</em>.</p>
            <dl className="meta-row">
              <div><dt>Record</dt><dd>{ref}</dd></div>
              <div><dt>Prepared</dt><dd>{dateStr}</dd></div>
              <div><dt>Regime</dt><dd>{usEu ? "EU TFR + FATF R.16" : run.applicability.regime}</dd></div>
              <div><dt>Standard</dt><dd>IVMS 101.2023</dd></div>
            </dl>
          </div>
          <div className="sheet-seal"><Seal gates={g.gates} voided={g.voided} size={230} id={`r${ref}`} ringText={ringText} /></div>
        </header>

        <div className={`determination ${!cleared ? "det-block" : specimen ? "det-spec" : "det-ok"}`} role="status">
          <span className="det-k">Determination</span>
          {!cleared && <span className="void-stamp" aria-hidden="true">VOID</span>}
          <strong>{!cleared ? (specimen ? "DO NOT TRANSMIT · SPECIMEN" : "DO NOT TRANSMIT") : specimen ? "SPECIMEN · SCREEN NOT RUN" : "CLEARED FOR TRANSMITTAL"}</strong>
          <span className="det-why">{specimen ? (cleared ? "Specimen · applicable under the classifier; enclave verification and OFAC screen not run" : "Specimen · address matches the bundled OFAC SDN test fixture; no live screen run") : OUTCOME_LINE[outcome]}</span>
        </div>

        <section className="sec">
          <h2><span className="sn">§1</span> Applicability and governing rule</h2>
          <p className="prose">{run.applicability.rationale.replace('de-minimis','de minimis')}</p>
          <p className="prose cite"><span className="k">Authority</span> <em>{run.applicability.citation}</em></p>
          <p className="prose cite small"><span className="k">Beneficiary data</span> <em>Regulation (EU) 2023/1113, Article 14(2)(a)-(c)</em>. IVMS paths below are abbreviated.</p>
        </section>

        <section className="sec sec-ivms">
          <h2><span className="sn">§2</span> IVMS 101.2023 data · Section 7</h2>
          <div className="cols">
            <div>
              <h3>Transfer</h3>
              <dl className="ivms-dl">
                <Field path="transfer, outside IVMS: amount · asset" value={run.transfer ? `${run.transfer.amount} ${run.transfer.assetSymbol}` : "—"} />
                <Field path="fiat value (USD)" value={run.transfer ? run.transfer.fiatValueUsd.toLocaleString("en-US") : "—"} />
              </dl>
            </div>
            <div>
              <h3>Beneficiary</h3>
              <dl className="ivms-dl">
                <Field path="naturalPerson.name.primaryIdentifier" value={bName?.primaryIdentifier} />
                <Field path="accountNumber" value={b?.accountNumber?.[0]} mono />
              </dl>
            </div>
            <div>
              <h3>Originator</h3>
              <dl className="ivms-dl">
                <Field path="naturalPerson.name.primaryIdentifier" value={oName?.primaryIdentifier} />
                <Field path="naturalPerson.name.nameIdentifierType" value={oName?.naturalPersonNameIdentifierType} />
                <Field path="accountNumber (ledger address) · Art. 14(1)(b)" value={origAcct ?? "not supplied: required by Art. 14(1)(b)"} mono={!!origAcct} warn={!origAcct} />
                <Field path="naturalPerson.customerIdentification · Art. 14(1)(d)" value={o?.naturalPerson?.customerIdentification} />
                <Field path="naturalPerson.countryOfResidence" value={o?.naturalPerson?.countryOfResidence} />
                <Field path="address · document no. · date/place of birth · Art. 14(1)(d) alternatives" value={(o?.naturalPerson?.geographicAddress?.length || o?.naturalPerson?.nationalIdentification || o?.naturalPerson?.dateAndPlaceOfBirth) ? "supplied" : "not supplied; customer ID supplied instead"} warn={!(o?.naturalPerson?.geographicAddress?.length || o?.naturalPerson?.nationalIdentification || o?.naturalPerson?.dateAndPlaceOfBirth)} />
              </dl>
            </div>
            <div>
              <h3>VASPs</h3>
              <dl className="ivms-dl">
                <Field path="OriginatingVASP · legalPerson.name" value={ov.name?.nameIdentifier?.[0]?.legalPersonNameIdentifier} />
                <Field path="OriginatingVASP · nationalIdentifier (LEIX)" value={ov.nationalIdentification?.nationalIdentifier} mono />
                <Field path="BeneficiaryVASP · legalPerson.name" value={bv.name?.nameIdentifier?.[0]?.legalPersonNameIdentifier} />
                <Field path="BeneficiaryVASP · nationalIdentifier (LEIX)" value={bv.nationalIdentification?.nationalIdentifier} mono />
              </dl>
            </div>
          </div>
          <details className="raw"><summary>Raw IVMS 101 message (JSON)</summary><pre className="ivms">{JSON.stringify(run.ivms, null, 2)}</pre></details>
        </section>

        <section className="sec">
          <h2><span className="sn">§3</span> Verification and screening · the enclave boundary</h2>
          <Boundary live={!specimen} origName={oName?.primaryIdentifier} origCust={o?.naturalPerson?.customerIdentification} beneName={bName?.primaryIdentifier} verify={run.verifyVerdict} screen={run.screenVerdict} commitment={run.commitmentHash} />
          {outcome === "SDN_HIT" && (
            <dl className="ivms-dl tight hit-row"><Field path="matched list entry" value={`OFAC SDN · Digital Currency Address · ${b?.accountNumber?.[0]}`} mono /></dl>
          )}
          {!specimen && <p className="prose small">Confidential-enclave processing is the production privacy path (Chainlink CRE Confidential Workflows, beta access pending); verification here is as performed by this deployment&apos;s CRE runner.</p>}
          <p className="prose small">Screened against the OFAC SDN List {run.publishDate ? <>published <strong>{run.publishDate}</strong></> : <>(publication date is recorded on a live run)</>}. Screening is by Digital Currency Address; see <em>OFAC FAQ 562</em>. <strong>Scope:</strong> OFAC SDN only; EU consolidated and UN sanctions lists are not screened by this build.</p>
        </section>

        <section className="sec">
          <h2><span className="sn">§4</span> Attestation</h2>
          {specimen && <p className="prose small">This is a specimen. A live record carries a DON-signed attestation written to the <code>TravelRuleAttestation</code> contract on Base Sepolia (chainId 84532); none is claimed here.</p>}
          <dl className="ivms-dl tight mono-dl">
            <Field path="network" value="Base Sepolia · chainId 84532" mono />
            <Field path="contract" value={CONTRACT} mono />
            <Field path="jobId · record key; verify with getAttestation(bytes32)" value={run.jobId} mono />
            <Field path="transaction" value={run.txHash ?? (specimen ? "— (specimen: not attested)" : "pending")} mono />
          </dl>
        </section>

        {(
          <section className="sec">
            <h2><span className="sn">§5</span> {cleared ? (specimen ? "Next step (on a live run)" : "Next step") : (specimen ? "Required action (on a live hit)" : "Required action")}</h2>
            {cleared ? <p className="prose">{specimen ? "If enclave verification and the OFAC screen both clear, transmit the IVMS 101 data to the beneficiary CASP with, or before, the transfer. Do not transmit on this specimen." : "Transmit the IVMS 101 data to the beneficiary CASP with, or before, the transfer. Retain this record."}</p> : <p className="prohibited req">{REQUIRED_ACTION[outcome as Exclude<typeof outcome, "CLEARED">]}</p>}
          </section>
        )}
        <footer className={`sign ${cleared ? "" : "sign-void"}`}>
          <div className="sig-stamp" aria-hidden="true"><Seal gates={g.gates} voided={g.voided} size={132} id={`s${ref}`} ringText={ringText} /></div>
          <div className="sig-line"><span>Compliance officer</span></div>
          <div className="sig-line"><span>Name / title</span></div>
          <div className="sig-line short"><span>Date</span></div>
          
          <p className="retention">Retained for five years{usEu ? " (Regulation (EU) 2023/1113, Art. 26; 31 CFR 1010.430 for the US leg)" : ""}. {specimen ? "This specimen evidences no transmittal and no regulatory filing." : cleared ? "This record supports a transmittal of funds; it is not a regulatory filing." : "No transmittal occurred; this record documents a transfer that must not be transmitted."}</p>
        </footer>
      </div>
    </article>
  );
}
