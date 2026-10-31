// File: apps/web/lib/memo.tsx
import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { IvmsMessage, Applicability } from "@travelproof/core/types";

export function MemoDoc({ ivms, applicability, jobId, commitment, txUrl, cleared, publishDate }: { ivms: IvmsMessage; applicability: Applicability; jobId: string; commitment: string; txUrl: string; cleared: boolean; publishDate: string }) {
  const orig = ivms.Originator.originatorPerson[0]?.naturalPerson?.name.nameIdentifier[0];
  const bene = ivms.Beneficiary.beneficiaryPerson[0];
  const origVasp = ivms.OriginatingVASP.originatingVASP.legalPerson.nationalIdentification?.nationalIdentifier;
  const beneVasp = ivms.BeneficiaryVASP.beneficiaryVASP.legalPerson.nationalIdentification?.nationalIdentifier;
  return (
    <Document>
      <Page style={{ padding: 40, fontSize: 10, lineHeight: 1.5 }}>
        <Text style={{ fontSize: 14, fontWeight: 700 }}>TRAVEL RULE TRANSMITTAL RECORD</Text>
        <Text style={{ fontSize: 11, color: cleared ? "#0a7" : "#c22" }}>{cleared ? "STATUS: CLEARED FOR TRANSMITTAL" : "STATUS: DO NOT TRANSMIT"}</Text>
        <View style={{ marginTop: 10 }}>
          <Text>Governing authority: {applicability.citation}</Text>
          <Text>Basis: {applicability.rationale}</Text>
        </View>
        <Text style={{ marginTop: 10, fontWeight: 700 }}>IVMS 101.2023 — Originator (Section 7)</Text>
        <Text>  primaryIdentifier: {orig?.primaryIdentifier}</Text>
        <Text>  secondaryIdentifier: {orig?.secondaryIdentifier ?? "—"}</Text>
        <Text>  naturalPersonNameIdentifierType: {orig?.naturalPersonNameIdentifierType}</Text>
        <Text style={{ fontWeight: 700, marginTop: 6 }}>IVMS 101.2023 — Beneficiary</Text>
        <Text>  primaryIdentifier: {bene?.naturalPerson?.name.nameIdentifier[0]?.primaryIdentifier}</Text>
        <Text>  accountNumber: {bene?.accountNumber?.[0]}</Text>
        <Text style={{ fontWeight: 700, marginTop: 6 }}>VASPs</Text>
        <Text>  OriginatingVASP LEI: {origVasp}</Text>
        <Text>  BeneficiaryVASP LEI: {beneVasp}</Text>
        <Text style={{ marginTop: 10 }}>
          {cleared
            ? `The counterparty was screened against the OFAC SDN List published ${publishDate}; no match was found. Identity data was processed via Chainlink CRE Confidential HTTP (production privacy path) and did not touch the public ledger.`
            : `This transfer is BLOCKED and was not assembled for transmittal. The beneficiary address matches an OFAC SDN Digital Currency Address (SDN List published ${publishDate}).`}
        </Text>
        <Text style={{ marginTop: 6 }}>On-chain attestation: jobId {jobId}; commitment {commitment}. Independently verifiable: {txUrl}</Text>
        <Text style={{ marginTop: 10, fontSize: 9, color: "#666" }}>Record retained per FinCEN 5-year retention (31 CFR 1010.430); on-chain permanence satisfies the retention requirement. This record evidences a transmittal of funds, not a filing.</Text>
        <View style={{ marginTop: 20 }}>
          <Text>Compliance officer signature: ______________________________</Text>
          <Text>Date: ____________    Name / title: ____________________</Text>
        </View>
      </Page>
    </Document>
  );
}
