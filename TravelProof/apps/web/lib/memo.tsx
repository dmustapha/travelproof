import { Document, Page, Text, View, Svg, Circle, Line, Font, StyleSheet } from "@react-pdf/renderer";
import path from "node:path";
import type { IvmsMessage, Applicability } from "@travelproof/core/types";
import { outcomeOf, OUTCOME_LINE, REQUIRED_ACTION } from "./outcome";

// Real faces (fontsource .woff), so the memo shares the web record's voice: serif prose, sans labels, mono data.
const fp = (_pkg: string, f: string) => path.join(process.cwd(), "fonts", f);
let registered = false;
function registerFonts() {
  if (registered) return;
  registered = true;
  Font.register({ family: "Serif", fonts: [
    { src: fp("@fontsource/source-serif-4", "source-serif-4-latin-400-normal.ttf") },
    { src: fp("@fontsource/source-serif-4", "source-serif-4-latin-400-italic.ttf"), fontStyle: "italic" },
    { src: fp("@fontsource/source-serif-4", "source-serif-4-latin-700-normal.ttf"), fontWeight: 700 },
  ] });
  Font.register({ family: "Sans", fonts: [
    { src: fp("@fontsource/ibm-plex-sans", "ibm-plex-sans-latin-400-normal.ttf") },
    { src: fp("@fontsource/ibm-plex-sans", "ibm-plex-sans-latin-600-normal.ttf"), fontWeight: 600 },
  ] });
}

const INK = "#161c2c", CITE = "#2a4a85", OK = "#1f6b4a", STOP = "#8c1f1f", MUTE = "#5b6272", RULE = "#c9ccd3";
const s = StyleSheet.create({
  page: { paddingTop: 26, paddingBottom: 36, paddingHorizontal: 52, fontFamily: "Serif", fontSize: 9.2, lineHeight: 1.25, color: INK },
  strip: { backgroundColor: INK, color: "#fff", fontFamily: "Courier", fontSize: 7, paddingVertical: 4, paddingHorizontal: 8, marginBottom: 8 },
  top: { flexDirection: "row", justifyContent: "space-between" },
  firm: { fontFamily: "Sans", fontWeight: 600, fontSize: 7.5, letterSpacing: 1.6, color: CITE, marginBottom: 4 },
  title: { fontFamily: "Serif", fontWeight: 700, fontSize: 20, lineHeight: 1.2, marginBottom: 4 },
  sub: { fontStyle: "italic", fontSize: 10, color: MUTE, marginBottom: 6, maxWidth: 360 },
  hdr: { borderTopWidth: 1.5, borderTopColor: INK, borderBottomWidth: 0.5, borderBottomColor: RULE, paddingVertical: 4, marginBottom: 6 },
  hrow: { flexDirection: "row", marginBottom: 1.5 },
  hk: { width: 64, fontFamily: "Sans", fontWeight: 600, fontSize: 7, letterSpacing: 1, color: MUTE, paddingTop: 1.5 },
  hv: { flex: 1 },
  det: { borderTopWidth: 3, borderBottomWidth: 3, borderStyle: "solid", paddingVertical: 5, marginBottom: 6 },
  detK: { fontFamily: "Serif", fontWeight: 700, fontSize: 15, letterSpacing: 1.6 },
  detW: { fontStyle: "italic", fontSize: 9.5, marginTop: 5 },
  h2: { fontFamily: "Serif", fontWeight: 700, fontSize: 11, marginTop: 7, marginBottom: 3 },
  sn: { fontStyle: "italic", color: CITE },
  p: { marginBottom: 2 },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: RULE, paddingVertical: 1.2 },
  k: { width: 232, fontFamily: "Courier", fontSize: 7, color: MUTE, paddingTop: 1.5 },
  v: { flex: 1, fontFamily: "Serif", fontSize: 10 },
  mono: { fontFamily: "Courier", fontSize: 8 },
  box: { borderWidth: 1, borderColor: CITE, borderStyle: "dashed", padding: 6, marginTop: 3 },
  boxL: { fontFamily: "Sans", fontWeight: 600, fontSize: 6.5, letterSpacing: 1, color: CITE, marginBottom: 2 },
  act: { borderLeftWidth: 3, borderLeftColor: STOP, paddingLeft: 8, marginTop: 5, color: STOP },
  sign: { flexDirection: "row", marginTop: 10, gap: 18, alignItems: "flex-end" },
  sig: { flex: 1, borderTopWidth: 1, borderTopColor: INK, paddingTop: 3, fontFamily: "Sans", fontSize: 6.8, letterSpacing: 1, color: MUTE },
  foot: { position: "absolute", left: 52, right: 52, bottom: 22, fontFamily: "Sans", fontSize: 7, color: MUTE, borderTopWidth: 0.5, borderTopColor: RULE, paddingTop: 4 },
  wm: { position: "absolute", top: 330, left: 70, fontFamily: "Serif", fontWeight: 700, fontSize: 70, letterSpacing: 6, color: "#e9edf5", transform: "rotate(-30deg)" },
  void: { position: "absolute", top: 92, left: 262, fontFamily: "Courier", fontSize: 13, letterSpacing: 2.5, color: STOP, opacity: 0.22, borderWidth: 1.5, borderColor: STOP, paddingHorizontal: 6, paddingVertical: 3, transform: "rotate(-4deg)" },
});
const Row = ({ k, v, mono }: { k: string; v?: string; mono?: boolean }) => (
  <View style={s.row} wrap={false}><Text style={s.k}>{k}</Text><Text style={[s.v, mono ? s.mono : {}]}>{v ?? "—"}</Text></View>
);

function PdfSeal({ cleared, size = 78, attested = false }: { cleared: boolean; size?: number; attested?: boolean }) {
  const c = cleared ? CITE : STOP;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="47" fill="none" stroke={c} strokeWidth="0.8" />
        <Circle cx="50" cy="50" r="43" fill="none" stroke={c} strokeWidth="0.4" />
        <Circle cx="50" cy="50" r="31" fill="none" stroke={c} strokeWidth={attested || !cleared ? 2.6 : 0.8} strokeDasharray={attested || !cleared ? "38 8" : "2 3"} />
        <Circle cx="50" cy="50" r="19" fill="none" stroke={c} strokeWidth="0.8" />
        {!cleared && <>{[28,36,44,52,60,68,76].map((o) => <Line key={o} x1={o - 10} y1="68" x2={o + 8} y2="32" stroke={c} strokeWidth="0.7" />)}<Line x1="78" y1="6" x2="62" y2="34" stroke={c} strokeWidth="2" /><Line x1="62" y1="34" x2="70" y2="46" stroke={c} strokeWidth="2" /><Line x1="70" y1="46" x2="44" y2="70" stroke={c} strokeWidth="2" /><Line x1="44" y1="70" x2="52" y2="94" stroke={c} strokeWidth="2" /></>}
      </Svg>
      {cleared && <Text style={{ position: "absolute", top: size * 0.3, left: 0, width: size, textAlign: "center", fontFamily: "Serif", fontWeight: 700, fontSize: size * 0.3, color: c }}>§</Text>}
    </View>
  );
}

export function MemoDoc({ ivms, applicability, jobId, commitment, txUrl, cleared, publishDate, transfer, specimen = false, attested = false, verifyVerdict = 0, screenVerdict = "CLEAR" }: { attested?: boolean; verifyVerdict?: number; screenVerdict?: string; transfer?: { amount: string; assetSymbol: string; fiatValueUsd: number }; specimen?: boolean; ivms: IvmsMessage; applicability: Applicability; jobId: string; commitment: string; txUrl: string; cleared: boolean; publishDate: string }) {
  registerFonts();
  const outcome = outcomeOf(verifyVerdict, screenVerdict);
  const orig = ivms.Originator.originatorPerson[0]?.naturalPerson;
  const origName = orig?.name.nameIdentifier[0];
  const bene = ivms.Beneficiary.beneficiaryPerson[0];
  const origVasp = ivms.OriginatingVASP.originatingVASP.legalPerson.nationalIdentification?.nationalIdentifier;
  const beneVasp = ivms.BeneficiaryVASP.beneficiaryVASP.legalPerson.nationalIdentification?.nationalIdentifier;
  const col = cleared ? (specimen ? INK : OK) : STOP;
  const ref = `TP-${jobId.slice(2, 10).toUpperCase()}`;
  return (
    <Document title={`Travel Rule Transmittal Record ${ref}${specimen ? " (SPECIMEN)" : ""}`} author="TravelProof">
      <Page size="A4" style={s.page}>
        {specimen && <Text style={s.strip}>SPECIMEN · NOT ATTESTED · built by the real classifier + IVMS 101 assembler; no CRE run, no on-chain claim</Text>}
        {specimen && <Text style={s.wm} fixed>SPECIMEN</Text>}
        <View style={s.top}>
          <View>
            <Text style={s.firm}>TRAVELPROOF · COMPLIANCE MEMORANDUM</Text>
            <Text style={s.title}>Travel Rule Transmittal Record</Text>
            <Text style={s.sub}>Pursuant to {applicability.citation}.</Text>
          </View>
          <PdfSeal cleared={cleared} attested={attested} />
        </View>
        <View style={s.hdr}>
          <View style={s.hrow}><Text style={s.hk}>RECORD</Text><Text style={s.hv}>{ref}</Text></View>
          <View style={s.hrow}><Text style={s.hk}>PREPARED</Text><Text style={s.hv}>{ivms.PayloadMetadata?.createdAt?.slice(0, 10)}</Text></View>
          <View style={s.hrow}><Text style={s.hk}>TO</Text><Text style={s.hv}>Compliance Officer, originating CASP (LEI {origVasp})</Text></View>
          <View style={s.hrow}><Text style={s.hk}>RE</Text><Text style={s.hv}>Pending crypto-asset transfer to LEI {beneVasp} · regime {applicability.regime === "BOTH" ? "EU TFR + FATF R.16" : applicability.regime}</Text></View>
        </View>

        <View style={[s.det, { borderColor: col, position: "relative" }]}>
          {!cleared && <Text style={{ position: "absolute", right: 6, top: 8, fontFamily: "Courier", fontSize: 10, letterSpacing: 2, color: STOP, borderWidth: 1.5, borderColor: STOP, paddingHorizontal: 6, paddingVertical: 3, transform: "rotate(-4deg)" }}>VOID</Text>}
          <Text style={[s.detK, { color: col }]}>{!cleared ? (specimen ? "DO NOT TRANSMIT · SPECIMEN" : "DO NOT TRANSMIT") : specimen ? "SPECIMEN · SCREEN NOT RUN" : "CLEARED FOR TRANSMITTAL"}</Text>
          <Text style={[s.detW, { color: col }]}>{specimen ? (cleared ? "Specimen: enclave verification and OFAC screen not run" : "Specimen: address matches the bundled OFAC SDN test fixture; no live screen run") : OUTCOME_LINE[outcome]}</Text>
        </View>

        <Text style={s.h2}><Text style={s.sn}>§1  </Text>Applicability and governing rule</Text>
        <Text style={s.p}>{applicability.rationale.replace("de-minimis", "de minimis")}</Text>
        <Text style={s.p}><Text style={{ fontWeight: 700 }}>Authority: </Text><Text style={{ fontStyle: "italic" }}>{applicability.citation}</Text></Text>

        <Text style={s.h2}><Text style={s.sn}>§2  </Text>IVMS 101.2023 data (Section 7)</Text>
        <Row k="Transfer (outside IVMS): amount · asset" v={transfer ? `${transfer.amount} ${transfer.assetSymbol} (USD ${transfer.fiatValueUsd.toLocaleString("en-US")})` : undefined} />
        <Row k="Originator.naturalPerson.name.primaryIdentifier" v={origName?.primaryIdentifier} />
        <Row k="Originator.accountNumber (Art. 14(1)(b))" v={ivms.Originator.originatorPerson[0]?.accountNumber?.[0] ?? "not supplied"} mono />
        <Row k="Originator.naturalPerson.customerIdentification" v={orig?.customerIdentification} />
        <Row k="Originator.naturalPerson.countryOfResidence" v={orig?.countryOfResidence} />
        <Row k="Beneficiary.naturalPerson.name.primaryIdentifier" v={bene?.naturalPerson?.name.nameIdentifier[0]?.primaryIdentifier} />
        <Row k="Beneficiary.accountNumber" v={bene?.accountNumber?.[0]} mono />
        <Row k="OriginatingVASP.nationalIdentifier (LEIX)" v={origVasp} mono />
        <Row k="BeneficiaryVASP.nationalIdentifier (LEIX)" v={beneVasp} mono />

        <Text style={s.h2}><Text style={s.sn}>§3  </Text>Verification and screening</Text>
        <Text style={s.p}>
          {specimen
            ? "Specimen: no enclave verification and no OFAC screen were run. On a live run, identity data is processed inside the Chainlink CRE Confidential enclave and the counterparty is screened against the OFAC SDN List (SDN only; EU and UN lists are not screened by this build)."
            : outcome === "CLEARED"
              ? `The counterparty was verified and screened against the OFAC SDN List published ${publishDate}; no match was found (SDN only; EU and UN lists are not screened by this build). Identity data is not written to the public ledger.`
              : outcome === "SDN_HIT"
                ? `DO NOT TRANSMIT. The beneficiary address is listed as an OFAC SDN Digital Currency Address (SDN List published ${publishDate}); blocking is required where a US nexus exists. No transmittal is cleared.`
                : `DO NOT TRANSMIT. ${OUTCOME_LINE[outcome]}. No sanctions match is asserted. No transmittal is cleared.`}
        </Text>
        <View style={s.box} wrap={false}>
          <Text style={s.boxL}>{specimen ? "WHAT A LIVE RUN WOULD COMMIT · NOTHING WAS COMMITTED · HASHES, ENUMS, TIMESTAMP ONLY" : attested ? "WHAT THE PUBLIC LEDGER HOLDS · HASHES, ENUMS AND A TIMESTAMP ONLY · NO PERSONAL DATA" : "COMMITMENT COMPUTED · NOT CONFIRMED ON-CHAIN · HASHES AND ENUMS ONLY"}</Text>
          <Text style={s.mono}>commitmentHash  {commitment}</Text>
          <Text style={s.boxL}>JOBID · RECORD KEY · VERIFY WITH getAttestation(bytes32)</Text>
          <Text style={s.mono}>{jobId}</Text>
        </View>

        <Text style={s.h2}><Text style={s.sn}>§4  </Text>Attestation</Text>
        <Text style={s.p}>
          {specimen
            ? "No attestation was written: this is a specimen. A live record carries a DON-signed attestation on Base Sepolia (chainId 84532), contract 0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD."
            : attested
              ? `DON-signed attestation on Base Sepolia (chainId 84532), contract TravelRuleAttestation 0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD. Independently verifiable: ${txUrl}`
              : "No attestation is readable on-chain for this record (not yet written, or the read failed). Nothing is claimed until it is; contract TravelRuleAttestation 0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD, chainId 84532."}
        </Text>
        {cleared && (
          <>
            <Text style={s.h2}><Text style={s.sn}>§5  </Text>{specimen ? "Next step (on a live run)" : "Next step"}</Text>
            <Text style={s.p}>{specimen ? "If enclave verification and the OFAC screen both clear, transmit the IVMS 101 data to the beneficiary CASP with, or before, the transfer. Do not transmit on this specimen." : "Transmit the IVMS 101 data to the beneficiary CASP with, or before, the transfer. Retain this record."}</Text>
          </>
        )}
        {!cleared && (
          <>
            <Text style={s.h2}><Text style={s.sn}>§5  </Text>{specimen ? "Required action (on a live hit)" : "Required action"}</Text>
            <View style={s.act}>
              <Text style={s.p}>{REQUIRED_ACTION[outcome as Exclude<typeof outcome, "CLEARED">]}</Text>
            </View>
          </>
        )}

        <View style={s.sign} wrap={false}>
          <Text style={s.sig}>COMPLIANCE OFFICER</Text><Text style={s.sig}>NAME / TITLE</Text><Text style={[s.sig, { flex: 0.6 }]}>DATE</Text>
        </View>
        <Text style={s.foot} fixed>Retained for five years (Regulation (EU) 2023/1113, Art. 26; 31 CFR 1010.430 for the US leg). {specimen ? "This specimen evidences no transmittal and no regulatory filing." : cleared ? "This record supports a transmittal of funds; it is not a regulatory filing." : "No transmittal occurred; this record documents a transfer that must not be transmitted."} {ref}{specimen ? " · SPECIMEN" : ""}</Text>
      </Page>
    </Document>
  );
}
