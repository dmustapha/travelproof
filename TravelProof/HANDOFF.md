# HANDOFF

The one page a judge or teammate opens to reproduce TravelProof from a cold clone.

## Target commit

```
git checkout 137efeb
```
The reviewed commit (`137efeb`, pushed to `main`): CRE wiring + deploy artifacts.

## Fresh-clone verify (no wallet, no keys)

```
git clone https://github.com/dmustapha/travelproof && cd travelproof
pnpm install
pnpm verify:claims      # recomputes every committed commitment vs on-chain; non-zero exit on mismatch
pnpm -r test            # deterministic resolver + outcome truth-table + chain read path
forge test -C contracts # contract suite incl the write-once / forwarder-bound invariants
```

Expected:
- `pnpm -r test` and `forge test` both exit 0 (all green). The adversarial stress battery recorded 101 of 101.
- `pnpm verify:claims` exits 0. Note: the on-chain claims ledger (`docs/pipeline/claims.json`) is intentionally empty today because on-chain attestation is managed-DON beta-gated (see `submission/HONESTY-LEDGER.md`); the gate recomputes an empty set and passes honestly rather than reading back a fabricated row.

Live, no clone:
```
curl "https://travelproof.vercel.app/api/ofac?address=3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1"   # {"hit":true}  (Garantex SDN, live Treasury feed)
```

## Demo walkthrough

1. Open https://travelproof.vercel.app.
2. In the cockpit, submit a transfer intent; watch `lib/outcome.ts` pick the regime (FATF R.16 vs EU TFR Art.14 vs de-minimis) and the citation.
3. See the record render: the `keccak256` commitment, the two verdict enums, and the cited IVMS101 memo. On the public Vercel instance the finished `CLEARED` / `DO NOT TRANSMIT` records are labelled `SPECIMEN` (serverless cannot run the `cre` binary); a host that runs `cre workflow simulate` returns the real live verdict.
4. `/ledger` renders the examiner evidence log (empty until a managed-DON deploy writes attestations; the no-PII contract is live and on-chain-readable now).

## Deployed contract

- `TravelRuleAttestation` `0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD` on Base Sepolia (chainId 84532). Creation tx `0xd8d5d6...a5530`, block 52683257, verified on-chain via RPC.
- Constructor forwarder: `0xF8344CFd5c43616a4366C34E3EEE75af79a74482` (official Chainlink CRE Base Sepolia KeystoneForwarder).

## Do-not-modify (freeze list)

Load-bearing for the recorded proof; changing these invalidates it:
- `apps/web/lib/outcome.ts`: the single classifier of record (regime + citation + required action).
- `contracts/src/TravelRuleAttestation.sol`: the no-PII struct + forwarder-bound, write-once attestation invariants.
- `packages/cre/cre-run/{screen,verify}/main.ts`: the CRE workflows the verdicts come from.
- `apps/web/app/api/run/route.ts`: the fail-closed boundary (rejects any non-enum verdict as `502`, never a fabricated `CLEARED`).
