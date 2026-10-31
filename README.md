# TravelProof

**A privacy-preserving FATF Travel Rule compliance tool for crypto VASPs: verify the counterparty, keep their identity off the ledger, and produce a lawyer-filable, independently-attested transfer record.**

> Prove who the counterparty is. Keep who they are off the ledger.

[![Live](https://img.shields.io/badge/live-travelproof.vercel.app-111)](https://travelproof.vercel.app)
[![Contract](https://img.shields.io/badge/Base%20Sepolia-0xEE4D%E2%80%A6E7cD-0052FF)](https://sepolia.basescan.org/address/0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD)
[![Tests](https://img.shields.io/badge/tests-37%20JS%20%2B%208%20Solidity-success)](#tests)
[![License](https://img.shields.io/badge/license-MIT-black)](LICENSE)

**Live demo:** https://travelproof.vercel.app
**On-chain attestation contract:** [`0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD`](https://sepolia.basescan.org/address/0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD) on Base Sepolia (chainId 84532)

Built for the BLI Legal Tech Hackathon 2 (LegalTech & RegTech track, Chainlink CRE bounty).

---

## The problem

The FATF Travel Rule forces a Virtual Asset Service Provider (VASP) to *transmit* verified originator and beneficiary identity on transfers above a threshold, **while simultaneously protecting that PII**. Those two obligations pull in opposite directions, and most exchanges still cannot cleanly meet both. Meanwhile OFAC's SDN list now carries digital-currency-address entries across roughly 20 chains (verified live against `sanctionslistservice.ofac.treas.gov`, publish date 2026-10-28).

TravelProof resolves that contradiction: it proves identity *and* protects it, and emits a record a compliance officer can actually file.

## How it works

```
  Officer cockpit (Next.js)
        │  enter a pending transfer
        ▼
  Deterministic resolver  ──►  classifies against FATF Rec.16 / EU TFR Art.14
  (statute-encoded, NO AI       assembles an IVMS 101.2023 message
   on the decision path)        cites the governing authority verbatim
        │
        ├─►  CRE Confidential-HTTP verify   (counterparty VASP + originator verified inside a TEE;
        │                                    PII never touches the public ledger)
        ├─►  CRE DON-consensus OFAC screen  (counterparty screened against the live SDN feed)
        ▼
  DON-signed report  ──►  TravelRuleAttestation contract (Base Sepolia)
                          stores ONLY a commitment hash + two verdicts; emits an attestation event
        │
        ▼
  Filable IVMS101 record + one-page officer memo (PDF) with an on-chain-verifiable footer
```

The chain stores a commitment hash and two verdicts. It never stores a name, an account, or any PII: that is structurally unrepresentable by the contract's storage type (see Core Invariants).

## Core Invariants

These are the non-negotiable properties the system is built to enforce. Each is proven by code, not asserted.

- **No PII on-chain.** The `Attestation` storage struct holds only `bytes32 commitmentHash, uint8 verifyVerdict, uint8 screenVerdict, uint64 ts, bool verifySet, bool screenSet`. There are zero string fields, so a PII write is unrepresentable by the type system. Proof: `TravelProof/contracts/src/TravelRuleAttestation.sol`.
- **No AI on the decision path.** The legal classification is a deterministic resolver; the decision module imports no model or LLM. Proof gate: `grep -rniE 'openai|anthropic|llm' packages/core/src` returns zero.
- **Never fail open.** A verify failure is never described as a sanctions hit, a single verdict leg never emits a premature `CLEARED`, and a malformed transfer value (negative / NaN / Infinity) escalates to `NEEDS_HUMAN_REVIEW` rather than silently applying the lighter reduced-data regime. The `/api/run` endpoint fails closed to a DEGRADED state; it never fabricates a `CLEARED`.
- **Correct authority, cited verbatim.** The resolver cites EU TFR Article 14 and FATF Recommendation 16, not the bank-MSB 31 CFR 1010.410(f) misread. A resolver citation is tested to never present `1010.410(f)` as the crypto-VASP authority.

## Live transactions

| What | Value | Explorer |
|------|-------|----------|
| Attestation contract | `0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD` | [BaseScan](https://sepolia.basescan.org/address/0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD) |
| Deploy tx | `0xd8d5d6543e906bb448f50415973aa092c1a5aac97789fe25f230913be94a5530` (block 52683257) | [BaseScan](https://sepolia.basescan.org/tx/0xd8d5d6543e906bb448f50415973aa092c1a5aac97789fe25f230913be94a5530) |
| KeystoneForwarder (constructor) | `0xF8344CFd5c43616a4366C34E3EEE75af79a74482` | official Chainlink CRE Base Sepolia forwarder |
| Deployer | `0xc211C942946011859ca634F22400d80570ED12A5` | Base Sepolia |

## Honesty ledger

TravelProof is deliberately explicit about what is live versus what is scoped-but-deferred.

| Capability | Status | Evidence |
|------------|--------|----------|
| No-PII attestation contract, deployed and on-chain-readable | LIVE on Base Sepolia | contract `0xEE4D…E7cD`, 8/8 Solidity tests |
| Live OFAC SDN screen | LIVE | publish date 2026-10-28, 1058 crypto addresses indexed, Garantex demo HIT self-check passes |
| Deterministic legal resolver + IVMS101 builder | LIVE | `packages/core`, 17/17 tests, deterministic round-trip |
| Officer cockpit, record, proof, and ledger views + filable PDF memo | LIVE | 11 routes build and render; hosted PDF at `/record/[jobId]/memo.pdf` |
| On-chain read path (`/ledger`, `/proof/[jobId]`) | LIVE | queries the real contract; populates with zero code change once seeded |
| CRE Confidential-HTTP verify workflow (TEE privacy path) | NOT LIVE (beta access pending) | real workflow code against cre-sdk 1.23.0; gated on the Confidential Workflows private-beta invite |
| Two seeded attestations (CLEARED + DO-NOT-TRANSMIT) | DEFERRED | produced by `scripts/run-cre.sh` (fail-loud stub) pending `cre login`; `/api/run` fails closed to DEGRADED until wired |
| VASP registry | DISCLOSED MOCK | real TRISA directory lookup with a disclosed synthetic fallback (surfaced via `source`) |

Specimen records shown in the UI are labelled SPECIMEN. The deliverable is a Travel Rule **transmittal** record, not a regulatory "filing".

## Running locally

```bash
git clone https://github.com/dmustapha/travelproof.git
cd travelproof/TravelProof
pnpm install
pnpm build          # builds all workspaces
pnpm test           # 37 JS/TS tests; contract tests run via forge test from contracts/
pnpm verify:claims  # recomputes every headline claim from committed source
pnpm dev            # runs the Next.js officer cockpit
```

Requires Node 20+, pnpm 9, and (for the contract tests) Foundry.

Copy `TravelProof/.env.example` to `TravelProof/.env` and supply a Base Sepolia RPC URL. No secrets are committed to this repository.

## Project structure

```
TravelProof/
├── apps/web/            # Next.js officer cockpit, record/proof/ledger views, PDF memo
├── contracts/           # TravelRuleAttestation (Foundry); no-PII storage struct
├── packages/
│   ├── core/            # deterministic legal resolver, IVMS101 builder, commitment hashing
│   ├── ofac/            # live OFAC SDN screening
│   ├── cre/             # Chainlink CRE verify + screen workflows
│   └── vasp-registry/   # TRISA directory lookup (disclosed synthetic fallback)
├── scripts/             # seed, verify-claims recompute gate, clean-room verify, CRE runner
└── docs/pipeline/       # claims.json machine ledger (recomputed by verify:claims)
```

## Tech stack

TypeScript, Next.js 15, React 19, Foundry / Solidity 0.8.24 (Base Sepolia), Chainlink CRE (cre-sdk 1.23.0), pnpm workspaces, viem, pdfkit.

## Documentation

- [`TravelProof/PRD.md`](TravelProof/PRD.md): product requirements and judging-criteria mapping
- [`TravelProof/ARCHITECTURE.md`](TravelProof/ARCHITECTURE.md): system architecture
- [`TravelProof/DECISIONS.md`](TravelProof/DECISIONS.md): architecture decision log
- [`TravelProof/SECURITY.md`](TravelProof/SECURITY.md): threat model and what is not defended against
- [`TravelProof/LIMITATIONS.md`](TravelProof/LIMITATIONS.md): scope boundaries
- [`TravelProof/INVARIANTS.md`](TravelProof/INVARIANTS.md): the non-negotiable properties
- [`TravelProof/CLAIMS.md`](TravelProof/CLAIMS.md): claim ledger and how to recompute it
- [`TravelProof/SUBMISSION_STATUS.md`](TravelProof/SUBMISSION_STATUS.md): what is live versus deferred
- [`TravelProof/DESIGN_SYSTEM.md`](TravelProof/DESIGN_SYSTEM.md): brand and design system

## License

MIT. See [LICENSE](LICENSE).
