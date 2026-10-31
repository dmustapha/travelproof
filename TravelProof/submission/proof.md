# TravelProof — on-chain proof

## Deployed contract
- **TravelRuleAttestation**: `0xa8CD17A860f3A0DE51e1135248F22560d4721738`
- **Network**: Base Sepolia (chainId 84532)
- **KeystoneForwarder (constructor)**: `0xF8344CFd5c43616a4366C34E3EEE75af79a74482` (official Chainlink CRE Base Sepolia production forwarder)
- **Deploy tx**: `0x14328bc1f06ec5dfa6b87d503af7e0dd03c4d7593fdb216dc4c7692e3b9545d8` (block 52676285, status success)
- **BaseScan**: https://sepolia.basescan.org/address/0xa8CD17A860f3A0DE51e1135248F22560d4721738
- **Deployer**: 0xc211C942946011859ca634F22400d80570ED12A5

## No-PII structural proof (INVARIANT 1)
On-chain storage struct `Attestation` holds ONLY: bytes32 commitmentHash, uint8 verifyVerdict, uint8 screenVerdict, uint64 ts, bool verifySet, bool screenSet. Zero string fields — a PII write is unrepresentable by the type system.

## Live OFAC (INVARIANT 2)
Live SDN feed smoke (orchestrator-verified): publishDate 10/28/2026, 1058 crypto addresses indexed, Garantex demo HIT self-check PASS.

## Attestations (P4.3 seed — DEFERRED to cre login)
The two live attestations (CLEARED + DO-NOT-TRANSMIT) are produced by `scripts/run-cre.sh` driving the real CRE verify+screen workflows and broadcasting to C7. That runner is a FAIL-LOUD stub pending `cre login` (interactive OAuth — needs Dami) + the CRE project scaffold (wire phase). It will NEVER emit a constant/fabricated verdict (A-G4 #2); `api/run` fails closed to 502 DEGRADED until wired.
- **Read path is LIVE now:** `readLedger()` + `getAttestation()` query the real contract 0xa8CD17A8...1738 (currently 0 rows — correct empty state). The moment the seed runs, `/ledger` + `/proof/[jobId]` populate with zero code change.
- **The thesis is already proven live tonight:** the no-PII contract is deployed + on-chain-readable, the OFAC screen hits the live SDN feed (publishDate 10/28/2026, Garantex HIT self-check PASS), the commitment round-trips (verify:claims green).
