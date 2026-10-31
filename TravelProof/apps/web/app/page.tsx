import { Seal } from "../components/Seal";
import { tear } from "../lib/tear";
import { DeskParallax } from "../components/DeskParallax";
import "./landing.css";

export default function Landing() {
  const T = tear(480, 7), T2 = tear(360, 19);
  return (
    <main className="lp">
      {/* ───────── 1. HERO: the officer's problem + one sample transfer on a desk ───────── */}
      <DeskParallax className="lp-hero">
        <div className="lp-copy">
          <span className="lp-eyebrow">For crypto-exchange compliance officers</span>
          <h1>Every transfer to another exchange needs a decision you can <em>defend.</em></h1>
          <p className="lp-sub">
            TravelProof checks the rule, the other exchange and sanctions, then hands you the verdict and the
            record. No one&apos;s identity goes on a public chain.
          </p>
          <div className="lp-cta">
            <a className="lp-btn lp-btn-main" href="/cockpit">Open a transfer</a>
            <a className="lp-btn-link" href="/specimen/no-hit">Walk through a sample transfer <span>demo</span></a>
          </div>
          <div className="lp-status2" aria-label="What works today"><span><b>Live today</b> Rule decision · Sanctions check · On-chain seal</span><span className="wait"><b>Waiting</b> Private enclave check (beta access)</span></div>
        </div>

        <div className="lp-desk" aria-label="A sample transfer, torn into its private and public halves">
          <div className="lp-wl"><div className="lp-plate lp-priv" style={{ clipPath: T.left }}>
            <span className="plate-lab">Private <i>stays with you</i></span>
            <div className="lp-slip">
              <span className="lp-tag">Sample · nothing here ran live</span>
              <dl>
                <div><dt>Customer withdraws</dt><dd className="lp-big">5,000 USDC</dd></div>
                <div><dt>From</dt><dd>Adeyemi F. <i>your customer</i></dd></div>
                <div><dt>To</dt><dd>Okafor <i>at Exchange B</i></dd></div>
              </dl>
            </div>
          </div></div>
          <div className="lp-wr"><div className="lp-plate lp-pub" style={{ clipPath: T.right }}>
            <span className="plate-lab">Public chain <i>Base Sepolia</i></span>
            <ul className="chain-rows">
              <li><i>verdict</i><b>PASS</b></li>
              <li><i>fingerprint</i><b>0x434a…f441</b></li>
              <li><i>time</i><b>31 Oct 2026</b></li>
              <li className="nope"><i>names</i><b>none</b></li>
            </ul>
          </div></div>
          <svg className="lp-seam" viewBox={`0 0 44 ${T.h}`} aria-hidden="true">
            <path d={T.seam} className="seam-glow" /><path d={T.fibL} className="fib" /><path d={T.fibR} className="fib fib2" />
          </svg>
          <span className="seam-badge">No identity crosses</span>
          <div className="lp-verdict">
            <span>Your decision</span>
            <strong>Ready to send the identity data</strong>
            <em>or HOLD, with the reason, if a check fails</em>
          </div>
          <ol className="lp-mini" aria-label="Four checks">
            <li><b>1</b>Rule applies?</li><li><b>2</b>Exchange real?</li><li><b>3</b>Sanctions?</li><li><b>4</b>Sealed</li>
          </ol>
          <div className="lp-stamp" aria-hidden="true"><Seal gates={["pass", "pass", "pass", "open"]} size={118} ringText="SAMPLE · NOT LIVE · " id="lpst" /></div>
        </div>
      </DeskParallax>

      {/* ───────── 2. HOW A TRANSFER IS DECIDED ───────── */}
      <section className="lp-sec" id="how">
        <header className="lp-head">
          <span className="lp-eyebrow">How a transfer is decided</span>
          <h2>Four checks, in the order the law asks for them.</h2>
        </header>
        <ol className="lp-rail">
          <li className="st">
            <span className="st-n">1</span><span className="st-badge live">Live</span>
            <h3>Does the rule apply?</h3>
            <p>We look at the amount, the countries, and whether the other side is an exchange.</p>
            <div className="st-get"><b>You get</b> Yes or no, and the exact article.</div>
            <div className="st-law"><b>In the law</b> Reg. (EU) 2023/1113 Art. 14 · FATF Rec. 16 (the &ldquo;Travel Rule&rdquo;)</div>
          </li>
          <li className="st is-soon">
            <span className="st-n">2</span><span className="st-badge soon">Enclave pending</span>
            <h3>Is the other exchange real?</h3>
            <p>We confirm it is a registered exchange and the people details match, in a private enclave.</p>
            <div className="st-get"><b>You get</b> Verified or failed. Names stay private.</div>
            <div className="st-law"><b>In the law</b> CASP = crypto-asset service provider · LEI = its legal ID</div>
          </li>
          <li className="st">
            <span className="st-n">3</span><span className="st-badge live">Live</span>
            <h3>Is the receiver sanctioned?</h3>
            <p>We check the receiving address against the US sanctions list.</p>
            <div className="st-get"><b>You get</b> Clear, or STOP with the match.</div>
            <div className="st-law"><b>In the law</b> OFAC SDN list · OFAC FAQ 562</div>
          </li>
          <li className="st">
            <span className="st-n">4</span><span className="st-badge live">Live</span>
            <h3>Seal the decision.</h3>
            <p>We write a signed yes or no, plus a fingerprint of the record, to a public blockchain. No names.</p>
            <div className="st-get"><b>You get</b> A proof anyone can check later.</div>
            <div className="st-law"><b>In the law</b> Record-keeping: five years</div>
          </li>
        </ol>
        <dl className="lp-gloss">
          <div><dt>Travel Rule</dt><dd>The law that says an exchange must send who-sent-it and who-gets-it details with a crypto transfer.</dd></div>
          <div><dt>Enclave</dt><dd>A locked room for code. The data inside is processed there and no one outside, us included, can read it.</dd></div>
          <div><dt>Fingerprint</dt><dd>A short code computed from the record. Change one letter and the code changes, so it proves nothing was altered.</dd></div>
        </dl>
      </section>

      {/* ───────── 3. WHAT YOU WALK AWAY WITH ───────── */}
      <section className="lp-sec lp-out">
        <a className="lp-sheets" href="/specimen/no-hit" aria-label="Open a sample record">
          <div className="sheet-m sheet-memo">
            <small>COMPLIANCE MEMORANDUM</small>
            <b>Travel Rule Transmittal Record</b>
            <p><i>Pursuant to Reg. (EU) 2023/1113, Art. 14.</i></p>
            <p>Applicable: crypto transfer between exchanges. Decision recorded. Retained five years.</p>
            <span className="sig">Compliance officer ______</span>
          </div>
          <div className="sheet-m sheet-rec">
            <i className="band" />
            <small>RECORD TP-5D016F1D · IVMS 101</small>
            <b>Determination</b>
            <div className="rowl"><span>Transfer</span><em>5,000 USDC</em></div>
            <div className="rowl"><span>Originator</span><em>Adeyemi Fatima</em></div>
            <div className="rowl"><span>Beneficiary</span><em>Okafor</em></div>
            <div className="rowl"><span>Rule</span><em>Art. 14(1)(a)-(d)</em></div>
            <div className="rowl"><span>Sanctions</span><em>OFAC SDN</em></div>
            <i className="seal-dot" />
          </div>
          <span className="lp-sample">Sample · click to open</span>
        </a>
        <div className="lp-outcopy">
          <span className="lp-eyebrow">What you walk away with</span>
          <h2>The paperwork is done when the decision is.</h2>
          <ul className="lp-3">
            <li><b>The record</b><span>The standard identity message (IVMS 101) to send the other exchange.</span></li>
            <li><b>The memo</b><span>One page for your file, citing the rule it was decided under.</span></li>
            <li><b>The proof</b><span>A public check an auditor can make without seeing anyone&apos;s details.</span></li>
          </ul>
          <a className="lp-btn-link" href="/specimen/no-hit">Open a sample record <span>demo</span></a>
        </div>
      </section>

      {/* ───────── 4. WHY IDENTITIES STAY OFF-CHAIN (dark ink panel) ───────── */}
      <section className="lp-ink">
        <div className="lp-ink-in">
          <span className="lp-eyebrow lp-on-dark">Why this is safe to put on a public chain</span>
          <h2>Prove who it was. Publish who it was not.</h2>
          <div className="lp-tear2">
            <div className="t2-wl"><div className="t2-plate t2-priv" style={{ clipPath: T2.left }}>
              <b>Private</b><code>name</code><code>customer ID</code><code>wallet address</code><code>date of birth</code>
              <small>Stays in your systems and the enclave. Never leaves.</small>
            </div></div>
            <div className="t2-wr"><div className="t2-plate t2-pub" style={{ clipPath: T2.right }}>
              <b>Public chain</b>
              <div className="t2-row"><i>verdict</i><span>pass / fail</span></div>
              <div className="t2-row"><i>fingerprint</i><span>0x434a…f441</span></div>
              <div className="t2-row"><i>time</i><span>block timestamp</span></div>
              <div className="t2-row nope"><i>names</i><span>none, ever</span></div>
              <code className="t2-cmd">cast call 0xEE4D…E7cD &quot;getAttestation(bytes32)&quot;</code>
              <small>Anyone can run this. It returns hashes and yes/no, nothing else.</small>
            </div></div>
            <svg className="lp-seam t2-seam" viewBox={`0 0 44 ${T2.h}`} aria-hidden="true"><path d={T2.seam} className="seam-glow" /><path d={T2.fibL} className="fib" /><path d={T2.fibR} className="fib fib2" /></svg>
            <span className="seam-badge t2-badge">only this crosses</span>
          </div>
        </div>
      </section>

      {/* ───────── 5. WHO IT IS FOR ───────── */}
      <section className="lp-sec">
        <div className="lp-who">
          <div className="who who-you"><span>You</span><b>Compliance officer</b><p>Decide each transfer and prove you did it right.</p></div>
          <div className="who"><span>Receives it</span><b>The other exchange</b><p>Gets the identity data it needs to accept the funds.</p></div>
          <div className="who"><span>Checks later</span><b>Auditor or regulator</b><p>Verifies the decision on-chain, with no personal data.</p></div>
        </div>
      </section>

      <section className="lp-end">
        <div className="lp-end-plate">
          <h2>Open the next pending transfer.</h2>
          <a className="lp-btn lp-btn-main" href="/cockpit">Open a transfer</a>
          <a className="lp-btn-link" href="/specimen/ofac-hit">See what a STOP looks like <span>demo</span></a>
        </div>
      </section>

      <footer className="lp-foot">
        <p><b>Where this stands.</b> The rule decision, the sanctions check and the on-chain seal work today. The private enclave check needs beta access we are waiting on, so until then the cockpit refuses to give a verdict it did not actually obtain. Sample records are labelled SPECIMEN.</p>
        <p><a href="/LIMITATIONS.md">Limitations</a> · <a href="/SUBMISSION_STATUS.md">Status</a> · <a href="/ledger">Evidence log</a> · <a href="/proof">Verify a proof</a></p>
      </footer>
    </main>
  );
}
