# TravelProof — Design-Forge Audit

Report-only. The UI was signed off ("looks good", Dami 2026-10-31) and is **not** to be
redesigned. Nothing below prescribes a change to the signed look; findings are severity-tagged,
and anything that *would* touch the committed look is flagged **[owner sign-off required]**.

Severity: 🔴 blocker · 🟠 should-fix · 🟡 minor/polish · 🟢 strength · ℹ️ note.

Scope audited: `globals.css`, `depth.css`, `components/Seal.tsx`, `layout.tsx`, the as-built
`DESIGN.md`, and the newly forged brand assets. This is a static read of the system + a persona
pass; it is not a live-Chrome contrast sweep of every rendered state.

---

## A. Craft audit

### Elevation consistency
- 🟢 The elevation scale is genuinely *one system* with six named levels, each with a cue beyond
  shadow (overlap, light/dark contrast, parallax). Depth follows meaning (sunken private enclave
  vs. lifted public chain) — this is the strongest craft decision in the build.
- 🟡 `depth.css` carries **two** overriding `:root` blocks for `--e2…--e5` (the v1 cool-grey set
  at the top, then the v2 warm recut at line 131). The later wins by cascade, so render is
  correct, but the dead v1 block is a latent trap: any future edit that reorders or scopes these
  could silently resurrect the grey shadows. *Non-visible today.* **[owner sign-off required]**
  to remove — it touches a committed CSS file.
- 🟡 `globals.css` is heavily append-structured: `.hero`, `.void-stamp`, `.sheet`, `.stage-rows`
  are each re-declared 3–6 times down the file (last-wins patches). It renders as intended but
  has high change-risk; a single-source refactor would help maintainability. *No visual defect.*

### Contrast
- 🟢 Body ink `#0e1928` on paper `#f8f3e7` ≈ 14:1 — far above AA.
- 🟠 `--ink-3` (52% ink ≈ `#7b8390`-ish over paper) is used for field labels, meta keys, muted
  helper text and the `.docket` margin. On the `--sheet`/paper grounds this lands near ~3.5–4:1
  — fine for the ≥18px/semibold uses (eyebrows, large labels) but **borderline for the smallest
  11–12px mono keys** (`.field span`, `.meta-row dt`). Worth a live-Chrome `getComputedStyle`
  contrast check in both the lit-desk and sheet contexts before the hosted demo.
  *Verify, don't change blind.*
- 🟡 Seal guilloché strokes sit at `opacity .4–.5` of `--cite` on paper — intentionally faint
  (it's a security-print texture, not content), so not a contrast defect; noted so a reviewer
  doesn't "fix" it.

### Type scale
- 🟢 Three families with disciplined, non-overlapping roles (serif voice / sans UI / mono data).
  The mono-for-data rule is held consistently (ring text, gate labels, hashes, field keys).
- 🟡 Many one-off font declarations are inlined per selector rather than drawn from a token set
  (e.g. `font: 500 11px var(--mono)` recurs with small letter-spacing variations). The *scale*
  is coherent to the eye but is not centralized; `brand.json` now captures the canonical steps.

### Spacing / layout
- 🟢 Consistent gutter system (`max(24px, calc((100vw-1200px)/2))`) and a clear section rhythm.
- 🟢 Responsive care is real: explicit 980/900/760/640px breakpoints, and DESIGN.md records a
  verified no-horizontal-overflow pass at 390px on all primary routes.
- 🟡 `.sec { padding-left: 72px }` (room for the protruding ribbon tab) collapses to 20px only at
  ≤760px; between ~761–900px the 72px left pad on a narrowing column is tight. Minor; verify on
  a tablet width. *No change without owner sign-off.*

### Assets (newly forged)
- 🟢 `logo.svg` ports the Seal geometry exactly (guilloché G1/G2/G3, r64 gate arcs, § glyph) with
  hex baked in — verified rendering at 240px: ring text, all four gate labels, and § are crisp.
- 🟢 `favicon.svg` is a true *reduction* of the same mark (ringed disc + § + 4 cardinal gate
  ticks), verified legible at 32px. The `.ico` is a real multi-size 16/32/48 pack (ImageMagick).
- 🟢 `og.png` renders real (1200×630, 346 KB): seal + serif wordmark + tagline on the lit-desk
  ground — honest to the brand, no blank/broken output.
- ℹ️ Standalone SVGs can't use the app's `@media (prefers-reduced-motion)` or CSS vars, so the
  logo is a *static* frame of the seal (no spin/inscribe animation). Correct for a logo asset.
- ℹ️ The OG card uses the font **stacks** (Source Serif 4 → Georgia fallback). On a build machine
  without Source Serif 4 installed it renders the serif fallback; the shape is faithful but not
  pixel-identical to the webfont. Acceptable for a social card; noted for honesty.

---

## B. Persona critique

### Skeptical senior compliance officer (MLRO)
- 🟢 "Transmittal record", not "filing" — correct FATF/Travel-Rule register; the product doesn't
  overclaim a regulatory filing it isn't making.
- 🟢 The private↔public tear with "No identity crosses" maps directly to the data-minimisation
  concern an MLRO actually has; the sunken-enclave / lifted-chain metaphor reads instantly.
- 🟢 `SPECIMEN` watermarking + fail-closed `/api/run` (502 until CRE wired) means the demo never
  misrepresents an unverified run as attested. This is exactly the honesty a compliance reviewer
  looks for and rarely sees in a hackathon build.
- 🟠 **[owner sign-off / counsel]** DESIGN.md itself flags unverified legal citations (the
  "Art. 26" retention cite; Art. 14(1)(b/c/d) sub-paragraph letters; the EU
  freeze→competent-authority wording). An MLRO *will* check a cited article. These are
  content-accuracy risks, not design — route to counsel, don't surface a wrong cite in the demo.
- 🟡 The seal's `ATTEST` gate shows `open` (dotted) until a live attested run exists. An officer
  could read "open" as "pending/incomplete". The `gatesFor()` honesty is correct; just be ready
  to explain the dotted state in the demo narration.

### Hackathon judge
- 🟢 Distinctive, non-templated aesthetic — the notarial-instrument register and living seal are
  memorable and defensible as *intentional*, not AI-default. Clears the "generic dapp" bar easily.
- 🟢 Depth-follows-meaning and the one-classifier honesty chain are the kind of substance a judge
  rewards when probed. The seal being **state-driven from real outcomes** (not decorative) is a
  strong talking point.
- 🟠 The single biggest judge risk is **not design**: no live attested record exists yet (CRE
  unwired, `cre login` dead, hosted build not deployed/screenshotted per DESIGN.md). The UI
  promises a live run the backend can't yet complete. Demo must lead with specimen + the honest
  "live on a real run" framing, or a judge who clicks "run" hits the 502. *Flag to build track,
  not a design change.*
- 🟡 OG/favicon were absent before this pass — now wired, so link-unfurls and the browser tab
  will carry the brand in the submission. (This audit's own deliverable closes that gap.)

---

## C. Top 3 findings

1. 🟠 **Legal-citation accuracy (content, counsel):** DESIGN.md's own open-items list flags the
   "Art. 26" retention cite and Art. 14 sub-paragraph letters as unverified. An MLRO/judge may
   check them. Route to counsel before the demo — do not fix blind. **[owner/counsel]**
2. 🟠 **No live attested path yet (build, not design):** CRE unwired + hosted build not deployed.
   The demo narrative must front-load SPECIMEN + fail-closed honesty so a judge never hits the
   502 as a surprise. Design is honest about this; the risk is in the live run.
3. 🟡 **`--ink-3` on small mono labels is borderline contrast + `depth.css` has a dead v1 shadow
   `:root`:** neither is a visible defect today, but both are worth a live-Chrome `getComputedStyle`
   contrast check and a (sign-off-gated) cleanup, respectively. **[owner sign-off to touch CSS]**

No finding above requires or proposes a redesign of the signed-off look.
