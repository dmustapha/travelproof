# TravelProof - Design System (as built)

Formalized from the signed-off implementation (Dami, 2026-10-31 "looks good"). This documents
**reality**; it prescribes no changes. Source of truth for color is the `oklch()` set in
`apps/web/app/globals.css`; hex values below are baked sRGB equivalents for standalone assets
(SVG/PNG) that cannot reference the app's CSS variables.

Register: **a notarised transmittal record on a lit legal-paper desk** - a light instrument,
not a dark dapp. The world is constructed paper (ruled lines, margin rule, grain, warm lamp
glow) with a living notarial seal.

---

## 1. Color palette

### Desk ground (the surface everything rests on)
| Token | oklch | hex |
|---|---|---|
| desk-top | `oklch(93% .02 85)` | `#eee7d9` |
| desk-bottom | `oklch(87% .03 80)` | `#dfd3bf` |

The record/proof/ledger `<main>` is a `linear-gradient` desk-top→desk-bottom, overlaid with
blue + amber corner lamp pools, a 26px dot field and a 72px rule grid.

### Paper (printed surfaces)
| Token | oklch | hex | use |
|---|---|---|---|
| `--paper` | `oklch(96.4% .016 88)` | `#f8f3e7` | body ground |
| `--sheet` | `oklch(99% .007 88)` | `#fefcf7` | cards, panels, nav |
| `--well` | `oklch(93.6% .017 88)` | `#eee9dd` | recessed slots, table heads |

### Ink / pit (dark surfaces + text)
| Token | oklch | hex | use |
|---|---|---|---|
| `--ink` | `oklch(21% .035 258)` | `#0e1928` | primary text, solid buttons |
| ink-deep | `oklch(19% .05 262)` | `#07132a` | deep button/pit fills |
| enclave-top / bottom | `oklch(30% .06 262)` / `oklch(23% .05 262)` | `#1d2d4c` / `#101c34` | the private enclave panel (sunken dark) |
| enclave-fg | `oklch(92% .02 250)` | `#dbe6f2` | text inside enclave/pit |

`--ink-2` (72%), `--ink-3` (52%), `--rule` (14%), `--rule-lo` (8%) are opacity mixes of `--ink`.

### Accent
| Token | oklch | hex | use |
|---|---|---|---|
| `--cite` | `oklch(38% .11 258)` | `#18417c` | citation/seal blue - the one brand accent; seal, links, em, enclave border |

### State colors
| Token | oklch | hex | meaning |
|---|---|---|---|
| `--ok` | `oklch(40% .09 158)` | `#085634` | verdigris - verified / CLEARED |
| `--ok-bg` | `oklch(94% .035 158)` | `#d9f3e2` | ok badge ground |
| `--stop` | `oklch(42% .15 25)` | `#8d1a1e` | oxblood - DO NOT TRANSMIT / fail |
| `--stop-bg` | `oklch(94.5% .03 25)` | `#ffe6e3` | block ground |
| `--warn` | `oklch(48% .11 75)` | `#815200` | amber - degraded / open gate |

---

## 2. Elevation scale (`apps/web/app/depth.css`)

One system. Every surface gets a level and **looks** like it; adjacent levels must differ;
depth follows meaning. Shadows are tight contact + soft warm ambient ( v2 recut - no large grey
offsets).

| Level | Name | Shadow var | What it is |
|---|---|---|---|
| e-1 | **sunken** | `--sunk` / `--sunk-deep` | carved in: inner shadow, darker, recessed. Inputs, enclave, "how it works" tray, glossary |
| e0 | **ground** | - | the desk: texture only, no shadow |
| e1 | **flat** | - | printed on the surface: paper tone + hairline, no shadow |
| e2 | **raised** | `--e2` | card on desk: 2-layer shadow + lit top edge |
| e3 | **lifted** | `--e3` | slip/sheet above cards: long soft + contact shadow |
| e4 | **floating** | `--e4` | nav, CTAs, verdict plate: tall blur + ambient blue glow |
| e5 | **protruding** | `--e5` | stamps, seal, section ribbon tabs, nodes: tight dark contact + highlight, overlaps parent edge |

Cues beyond shadow: overlap/occlusion, light-vs-dark contrast between levels, parallax, hover
lift. `clip-path` runs after `filter`, so drop-shadow goes on a **wrapper** of any clipped
element. Hero tilt/parallax: `components/DeskParallax.tsx` (disabled under
`prefers-reduced-motion`).

Depth-follows-meaning examples:
- Record §2: the transfer (subject) is raised; the two parties are peers at the same level;
  VASPs (reference) are flat.
- The `/record` boundary: PRIVATE enclave is **sunken + dark** (held close); the PUBLIC chain
  view is **lifted + light** (published).

---

## 3. Typography

Three families, three jobs - never cross roles.

| Family | Stack | Role |
|---|---|---|
| **Source Serif 4** | `"Source Serif 4", "Iowan Old Style", Georgia, serif` | **voice** - headings, document body, determinations, the § glyph |
| **IBM Plex Sans** | `"IBM Plex Sans", system-ui, sans-serif` | **UI** - nav, buttons, labels, helper copy |
| **IBM Plex Mono** | `"IBM Plex Mono", ui-monospace, Menlo, monospace` | **data** - ring text, gate labels, field keys, hashes, eyebrows |

Scale (key steps): body 17px/1.6 serif · lede 19px · eyebrow-mono 11.5px/.12em uppercase ·
hero h1 `clamp(2.8rem,5.5vw,5.3rem)` −0.035em · cockpit h1 `clamp(2rem,3.6vw,3.1rem)` ·
record h1 `clamp(1.9rem,3.4vw,2.9rem)` · determination 25px serif/.1em.
PDF memo: serif + sans embedded, **Courier** for data (Plex Mono crashes fontkit on hex).

---

## 4. The Seal (`components/Seal.tsx`)

TravelProof's signature object - a state-driven notarial rosette, never decorative.

**Geometry**: three guilloché rings (`G1`/`G2`/`G3`, counter-rotating), an outer edge ring
(r95) + inner ring (r58), mono ring text, four 78°-wide gate arcs at r64 inscribed at the
cardinal quadrants, a core disc (r34), and the § center glyph (Source Serif 4). viewBox
`0 0 200 200`.

**Four gates** (`GATES`): `CLASSIFY · ENCLAVE · SCREEN · ATTEST`.

**Gate states** (`GateState`): `idle | active | pass | fail | open`.
- `active` - sweeping dash (run in progress)
- `pass` - arc inscribes in, label engraves to full opacity
- `fail` - arc inscribes in oxblood + flickers, label turns `--stop`
- `open` - dotted arc (a step not yet taken, e.g. not-yet-attested)
- `idle` - track only

**Void state** (`voided`): color flips to `--stop`, core gets a hatched fill, the § is struck
through at low opacity, and a crack path is drawn across the mark. Ring text becomes
`DO NOT TRANSMIT · …`.

**Honesty mapping - `gatesFor(outcome)`**: maps a real run outcome onto the four gates so
nothing is ever shown as passed that did not pass:
- `RUNNING` → all four `active`
- `CLEARED` → `pass pass pass` + ATTEST `pass` if attested else `open`
- `DO_NOT_TRANSMIT` → CLASSIFY `pass`; ENCLAVE from `verifyVerdict` (0 pass / 1 fail / else idle);
  SCREEN `fail` on OFAC `HIT`, `idle` on degraded; ATTEST `pass`/`open`; whole seal `voided`
- `NOT_APPLICABLE` → CLASSIFY `pass`, rest `idle`
- `INCOMPLETE` → CLASSIFY `fail`, rest `idle`

The exported logo assets (`public/logo.svg`, `logo-lockup.svg`) are the idle-attested **all-pass**
state with the default ring text `TRAVELPROOF · TRAVEL RULE TRANSMITTAL RECORD · `, colors baked
to hex so they stand alone.

---

## 5. The TEAR - private ↔ public signature (`lib/tear.ts`)

The identity of the product. Every surface that shows the boundary shows the **tear** between
what stays private and what goes on-chain:
- **PRIVATE** (identity - stays with the officer / in the enclave): the sunken dark panel.
- **PUBLIC CHAIN** (pass/fail + fingerprint + time): the lifted light panel.
An irregular torn-paper edge with a fibre fringe, a glowing seam, and the badge
**"No identity crosses"**. Recurs on: hero folder, the dark "pit" section, the `/record`
boundary (`.boundary` → `.enclave` | `.crossing` | `.onchain-view`), and the cockpit.

---

## 6. Component inventory (`components/`)

| Component | Role |
|---|---|
| `Masthead.tsx` | floating nav (e4), small-caps serif brand, sans nav links, CTA pill |
| `Seal.tsx` | the living seal + `gatesFor()` honesty map (§4) |
| `Boundary.tsx` | the private↔public tear boundary (§5) |
| `DeskParallax.tsx` | hero lit-desk mouse-tilt + scroll parallax (reduced-motion safe) |
| `GateRows.tsx` | the staged verdict row list (CLASSIFY/ENCLAVE/SCREEN/ATTEST with dots + values) |
| `RecordDocument.tsx` | the full transmittal record sheet (docket margin, determination band, IVMS sections, signature block, VOID takeover) |
| `SealStage.tsx` | the landing hero seal + animated specimen stage panel |

---

## 7. Honesty copy laws (do not weaken)

- **Transmittal, never "filing".** Copy law: it is a *Travel Rule transmittal record*, never
  "filing a Travel Rule".
- **SPECIMEN.** Demo/specimen records are watermarked `SPECIMEN`, make no chain / clearance /
  enclave claim, and carry "Next step (on a live run)".
- **One classifier drives everything** (`lib/outcome.ts`): `CLEARED / SDN_HIT / VERIFY_FAILED /
  VERIFY_DEGRADED / SCREEN_DEGRADED` drive all copy, gates, and required action. Only `SDN_HIT`
  carries OFAC blocking text.
- **Attested means attested** (`lib/attest.ts`): "attested" is claimed only if the chain hash +
  both verdicts match the run.
- **Fail closed.** Live `/api/run` returns 502 until CRE is wired - it never fabricates a pass.

---

## 8. Brand assets (`apps/web/public/`)

| File | What | Notes |
|---|---|---|
| `logo.svg` | the Seal logomark, all-pass idle-attested, hex-baked | viewBox 0 0 200 200, self-contained |
| `logo-lockup.svg` | seal + "TravelProof" serif wordmark, horizontal | |
| `favicon.svg` | size-reduced seal: ringed disc + § + 4 cardinal gate ticks | legible at 16–32px; same mark, fine guilloché/ring-text dropped |
| `favicon.ico` | multi-size 16/32/48 | packed from the favicon SVG |
| `icon-180.png` | apple-touch icon | 180×180 |
| `og.png` | 1200×630 social card: seal + wordmark + tagline on lit-desk ground | |

Wired in `app/layout.tsx` `metadata` export (`icons`, `openGraph`, `twitter`).
