import { Seal } from "./Seal";
export function Masthead() {
  return (
    <header className="mast">
      <a className="brand" href="/"><Seal gates={["pass", "pass", "pass", "pass"]} size={30} ringText=" " id="mast" label="TravelProof" /><span>TravelProof</span></a>
      <nav className="mast-nav" aria-label="Primary">
        <a href="/#how">How it works</a>
        <a href="/ledger">Evidence log</a>
        <a href="/proof">Verify a proof</a>
        <a className="pill" href="/cockpit">Open a transfer</a>
      </nav>
    </header>
  );
}
