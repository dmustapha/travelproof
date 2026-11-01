# TravelProof - on-chain proof

## Deployed contract
> Re-deployed after a peer-review finding (diff-1): the first version could emit a premature CLEARED event when a single verdict leg landed. Fixed (_maybeEmit emits only when both legs are set) + 3 regression tests; re-deployed at the address below. Old (superseded): 0xa8CD17A860f3A0DE51e1135248F22560d4721738
- **TravelRuleAttestation**: `0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD`
- **Network**: Base Sepolia (chainId 84532)
- **KeystoneForwarder (constructor)**: `0xF8344CFd5c43616a4366C34E3EEE75af79a74482` (official Chainlink CRE Base Sepolia production forwarder)
- **Deploy tx**: `0xd8d5d6543e906bb448f50415973aa092c1a5aac97789fe25f230913be94a5530` (block 52683257, status success)
- **BaseScan**: https://sepolia.basescan.org/address/0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD
- **Deployer**: 0xc211C942946011859ca634F22400d80570ED12A5
- **On-chain re-verified (2026-11-01)**: two independent Base Sepolia RPCs confirm 2.6KB of bytecode at the address and the creation tx status success. Event-log count on the contract is 0 (no attestation written yet, see On-chain attestation below).

## No-PII structural proof (INVARIANT 1)
On-chain storage struct `Attestation` holds ONLY: bytes32 commitmentHash, uint8 verifyVerdict, uint8 screenVerdict, uint64 ts, bool verifySet, bool screenSet. Zero string fields - a PII write is unrepresentable by the type system.

## Live OFAC (INVARIANT 2)
Live SDN feed smoke (orchestrator-verified): publishDate 10/28/2026, 1058 crypto addresses indexed, Garantex demo HIT self-check PASS. Reproduce live: `curl "https://travelproof.vercel.app/api/ofac?address=3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1"` returns `{"hit":true}`.

## CRE verdicts (WIRED via local simulation, 2026-11-01)
The verify and screen workflows are wired end-to-end and return REAL verdicts via `cre workflow simulate` (local CRE simulation: the DON and enclave emulated on the host, real OFAC + TRISA data, a real DON-signed report in simulation). Proven cases:
- clean address + registered VASP -> `CLEARED` (verify 0, screen CLEAR)
- Garantex SDN address -> `DO NOT TRANSMIT` (screen HIT, live feed)
- clean address + unregistered VASP -> `DO NOT TRANSMIT` (verify 1)
- runner not wired -> `/api/run` returns 502 (fail-closed, never a fabricated CLEARED)

Run it: `cd apps/web && CRE_WIRED=1 VASP_VERIFY_KEY=<key> npx next dev -p 3001`, then POST a complete IVMS intent to `/api/run`. (`cre login` is done; local simulation needs no beta.)

## On-chain attestation (managed-DON beta-gated, honestly empty)
No attestation is written on-chain yet, and `/ledger` is correctly empty. Writing one requires a report relayed by the real KeystoneForwarder, which only relays production managed-DON signatures. That needs Chainlink deployment access (`cre account access`; org status currently `GATED`, requested 2026-11-01). A local `simulate --broadcast` cannot produce a signature the real forwarder accepts, so no honest on-chain write is possible without deploy access. When access lands, `cre workflow deploy` writes real attestations and the read path (`readLedger()` + `getAttestation()`, already querying the live contract `0xEE4D49549Cf0B9163687D8d042821dE736F6E7cD`) populates `/ledger` + `/proof/[jobId]` with zero code change.

## Recompute, no wallet
`pnpm install && pnpm verify:claims` recomputes every committed commitment from source and compares it to on-chain (non-zero exit on any mismatch). The claims ledger is intentionally empty today (no on-chain attestations yet); the gate recomputes an empty set and passes honestly rather than reading back a fabricated row.
