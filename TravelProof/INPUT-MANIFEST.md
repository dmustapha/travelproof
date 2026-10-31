# INPUT MANIFEST — TravelProof (Checkpoint 3)

Every input the architecture needs, not just env vars. `required` rows hard-gate the build; `deferred-until-<phase>` rows are needed by that later phase; `optional` may be skipped/degraded.

| ID | Category | Tier | Used By | How To Obtain | Required Before | Status |
|----|----------|------|---------|---------------|:---------------:|:------:|
| BASE_SEPOLIA_RPC_URL | live-config | required | C7 deploy + C10 | Alchemy/Infura or public sepolia.base.org | build | resolved (default) |
| BASE_SEPOLIA_RPC_FALLBACK | live-config | optional | C10 fallback | 2nd provider | demo | resolved (default) |
| **DEPLOYER_PRIVATE_KEY** | credential | **required** | C7 deploy | fresh testnet key + Base Sepolia faucet | build | **UNRESOLVED** |
| **KEYSTONE_FORWARDER_ADDR** | contract-addr | deferred-until-wire | C7 constructor | CRE docs/CLI (Base Sepolia) | deploy | **UNRESOLVED** |
| **VASP_VERIFY_URL** | live-config | deferred-until-wire | C3/C6 | our deployed verify endpoint | wire | **UNRESOLVED** |
| **VASP_VERIFY_KEY** | credential | deferred-until-wire | C3 (Vault DON secret) | generate; register in CRE Vault DON | wire | **UNRESOLVED** |
| OFAC_SDN_URL | live-config | required | C5 | fixed (verified live) | build | resolved (fixed) |
| DEMO_HIT_ADDRESS | live-config | optional | C5 self-check + flip | fixed Garantex (re-verify day-of) | demo | resolved (fixed) |
| **ATTESTATION_ADDRESS** | contract-addr | deferred-until-deploy | C9/C10 | recorded at deploy | demo | **UNRESOLVED** |
| CRE_WORKFLOW_TARGET | live-config | required | C3/C4 | fixed (ethereum-testnet-sepolia-base-1) | wire | resolved (fixed) |
| **CRE_ACCOUNT_LOGIN** | approval | deferred-until-wire | cre simulate | `cre login` | wire | **UNRESOLVED** |
| CRE_DEPLOY_ALLOWLIST | approval | optional | managed-DON deploy | `cre account access` | deploy | unresolved (simulate avoids) |
| CRE_CONFIDENTIAL_BETA | approval | optional | Confidential HTTP (managed DON) | private-beta form | deploy | unresolved (simulate avoids) |
| TRISA_DIRECTORY | live-config | optional | C6 production path | TRISA testnet directory | deploy | unresolved (mock for demo) |

**CP3 hard-gate (build cannot start until resolved):** `DEPLOYER_PRIVATE_KEY` (required). All other `required` rows are resolved by fixed defaults. The `deferred-until-wire/deploy` rows block their later phase, not build start. The CRE approval rows are optional because the demo runs via `cre workflow simulate` (only `cre login` needed).
