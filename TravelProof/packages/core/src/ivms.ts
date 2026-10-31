// File: packages/core/src/ivms.ts
import type { TransferIntent, IvmsMessage, NaturalPerson, Person, LegalPerson, ValidationResult } from "./types";

function buildOriginatorPerson(i: TransferIntent): Person {
  const np: NaturalPerson = {
    name: {
      nameIdentifier: [
        {
          primaryIdentifier: i.originator.primaryIdentifier,
          secondaryIdentifier: i.originator.secondaryIdentifier,
          naturalPersonNameIdentifierType: "LEGL",
        },
      ],
    },
    customerIdentification: i.originator.customerIdentification,
    countryOfResidence: i.originator.countryOfResidence,
  };
  if (i.originator.nationalIdentifier) {
    np.nationalIdentification = { nationalIdentifier: i.originator.nationalIdentifier, nationalIdentifierType: "MISC" };
  }
  if (i.originator.dateOfBirth && i.originator.placeOfBirth) {
    np.dateAndPlaceOfBirth = { dateOfBirth: i.originator.dateOfBirth, placeOfBirth: i.originator.placeOfBirth };
  }
  if (i.originator.addressCountry) {
    np.geographicAddress = [{ addressType: "GEOG", country: i.originator.addressCountry, addressLine: i.originator.addressLine }];
  }
  const accounts = i.originatorChainAddress ? [i.originatorChainAddress] : [];
  return { naturalPerson: np, accountNumber: accounts };
}

function vaspLegalPerson(lei: string, name: string): LegalPerson {
  return {
    name: { nameIdentifier: [{ legalPersonNameIdentifier: name, legalPersonNameIdentifierType: "LEGL" }] },
    nationalIdentification: { nationalIdentifier: lei, nationalIdentifierType: "LEIX" },
  };
}

export function buildIvms(i: TransferIntent): IvmsMessage {
  return {
    Originator: { originatorPerson: [buildOriginatorPerson(i)] },
    Beneficiary: {
      beneficiaryPerson: [
        {
          naturalPerson: { name: { nameIdentifier: [{ primaryIdentifier: i.beneficiary.primaryIdentifier, naturalPersonNameIdentifierType: "LEGL" }] } },
          accountNumber: [i.beneficiary.accountNumber],
        },
      ],
    },
    OriginatingVASP: { originatingVASP: { legalPerson: vaspLegalPerson(i.originatingVaspLei, "Originating CASP") } },
    BeneficiaryVASP: { beneficiaryVASP: { legalPerson: vaspLegalPerson(i.beneficiaryVaspLei, "Beneficiary CASP") } },
    PayloadMetadata: { messageId: `${i.originatingVaspLei}:${i.beneficiaryChainAddress}`, createdAt: new Date().toISOString() },
  };
}

export function validateIvms(msg: IvmsMessage): ValidationResult {
  const violations: ValidationResult["violations"] = [];
  const op = msg.Originator.originatorPerson[0]?.naturalPerson;
  if (op) {
    // C6: at least one LEGL name identifier
    const hasLegl = op.name.nameIdentifier.some((n) => n.naturalPersonNameIdentifierType === "LEGL");
    if (!hasLegl) violations.push({ constraint: "C6", field: "name.nameIdentifier", message: "At least one naturalPersonNameIdentifierType must be LEGL." });
    // C1: at least one of the identifying elements
    const hasGeog = (op.geographicAddress ?? []).some((a) => ["GEOG", "HOME", "BIZZ"].includes(a.addressType));
    const c1 = hasGeog || !!op.customerIdentification || !!op.nationalIdentification || !!op.dateAndPlaceOfBirth;
    if (!c1) violations.push({ constraint: "C1", field: "originatorPerson.naturalPerson", message: "Need one of geographicAddress(GEOG/HOME/BIZZ), customerIdentification, nationalIdentification, or dateAndPlaceOfBirth." });
  }
  return { complete: violations.length === 0, violations };
}
