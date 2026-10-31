// The enclave boundary: identity data stays inside (redacted), enums + hash only.
const redact = (s?: string) => (s ? "█".repeat(Math.max(6, Math.min(14, s.length))) : "-");
function F({ path, value, redacted }: { path: string; value?: string; redacted?: boolean }) {
  return <div className="fld"><dt><code>{path}</code></dt><dd className={redacted ? "redacted" : ""}>{value ?? "-"}</dd></div>;
}
export function Boundary({ live = false, origName, origCust, beneName, verify, screen, commitment }: { live?: boolean; origName?: string; origCust?: string; beneName?: string; verify: number; screen: string; commitment: string }) {
  return (
    <div className="boundary">
      <div className="enclave">
        <span className="enc-label">{live ? "Identity data · kept off the ledger (CRE Confidential enclave is the production path)" : "Chainlink CRE Confidential enclave · identity data is processed here and never leaves"}</span>
        <dl className="ivms-dl tight">
          <F path="originator.name" value={redact(origName)} redacted />
          <F path="originator.customerIdentification" value={redact(origCust)} redacted />
          <F path="beneficiary.name" value={redact(beneName)} redacted />
        </dl>
      </div>
      <div className="crossing" aria-hidden="true"><span>enums + hash only</span></div>
      <div className="onchain-view">
        <span className="enc-label">What the public ledger can hold</span>
        <dl className="ivms-dl tight">
          <F path="verifyVerdict (uint8)" value={`${verify}  ${verify === 0 ? "VERIFIED" : verify === 1 ? "FAILED" : "DEGRADED"}`} />
          <F path="screenVerdict" value={screen === "CLEAR" ? "CLEAR · no match" : screen} />
          <F path="commitmentHash (bytes32)" value={commitment} />
        </dl>
      </div>
    </div>
  );
}
