## Chain DNA: EVM testnet + Chainlink CRE (the sponsor runtime)

**Unique capabilities:** Chainlink CRE (Chainlink Runtime Environment) is mainnet-live and the hackathon's named sponsor primitive (7/16 builds use it). Its primitives: Triggers (cron/event), HTTP fetch, **Confidential HTTP (in-enclave fetch so PII never touches the public ledger)**, EVM Read, EVM Write (DON-signed), Solana Read/Write. The DON (Decentralized Oracle Network) co-signs any off-chain fact it brings on-chain → a workflow result carries an independent multi-party attestation, not a single oracle's say-so.

**Founding thesis:** bring verifiable off-chain computation + real-world data on-chain with a decentralized trust guarantee — the oracle problem, generalized to arbitrary workflows.

**Community builds (this hackathon):** AI trading-agent verdicts hashed on-chain (saturated); sanctions screening; KYB/notary; x402-paid workflows. Dominant anti-pattern: "agent does X → hash it on-chain" = integrity proof to a blockchain auditor, NOT to a lawyer.

**Path of least resistance:** CRE Confidential HTTP for privacy-preserving verification (screen a credential/registry in-enclave, write only the DON-signed verdict + hash on-chain) is the capability the field under-uses. EVM Write for an append-only, tamper-evident legal audit trail is trivial and judge-legible.

**Honest constraints:** CRE is a workflow runtime, not a document engine or a legal brain — the lawyer-facing credibility must be built by us (cited frameworks + human-readable output). The chain cannot verify legal correctness; it can only attest that a stated check ran and produced a signed result at a timestamp.

**Top community/legal frustrations (the richest signal):** (1) compliance officers cannot meet the FATF Travel Rule floor; (2) SAR narratives are the most-cited examiner deficiency; (3) RWA "asset confusion" — the token is traded but the SPV/title linkage is unproven; (4) crypto-in-trust custody (IOLTA) has no reconciliation leg that ties the client ledger to the chain.

**Why on THIS stack (U6):** the DON-signed CRE result is the trust layer a lawyer-filable document needs — an independent, multi-party, timestamped attestation that the cited check actually ran. On a plain web app the "we screened the counterparty" claim is self-asserted; with CRE + EVM Write it is third-party-attested and tamper-evident. The chain is the notary, not the product.
