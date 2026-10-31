# Adopt Verification — build (claude)

| Point | Landed | Evidence |
|---|---|---|
| read-1 | ✗ LIP-SERVICE | BUILD-REPORT.md has no fail-closed compliance-receipt framing. The summary is still a plain phase table, with no verified-live versus deferr |
| read-2 | ✗ LIP-SERVICE | Phases 2, 3 and 4 still read COMPLETE. No PARTIALLY_COMPLETE or CRE_DEFERRED status appears, and nothing says that no live DON-attested CLEA |
| read-3 | ✗ LIP-SERVICE | There is no ordered critical path of CRE login, then C3/C4 simulation, then two seeded attestations. 'cre login' appears only as scattered d |
| read-4 | ✗ LIP-SERVICE | Test counts are not reconciled to 9/9. The summary row and the peer-review section say 12/12, while the verification table says 9/9. The Con |
| strong-1 | ✗ LIP-SERVICE | packages/ofac/src/sdn.test.ts is not staged. The report only mentions the earlier 6/6 ofac tests, with no new regression fixtures. |
| strong-2 | ✗ LIP-SERVICE | contracts/test/TravelRuleAttestation.t.sol is not staged, so the ABI, zero-forwarder and terminal-verdict tests cannot be confirmed. The rep |
| strong-3 | ✗ LIP-SERVICE | packages/core/src/resolver.test.ts is not staged. The report does not mention a new unknown-status test. |
| strong-4 | ✗ LIP-SERVICE | apps/web/app/api/run/route.ts is not staged. The report mentions the 502 DEGRADED response but no attestationMode or source field. |
| diff-1 | ✗ LIP-SERVICE | contracts/src/TravelRuleAttestation.sol is not staged. The report describes only a fix that emits when verifySet && screenSet, not the NONE/ |
| diff-2 | ✗ LIP-SERVICE | Contract file not staged. BUILD-REPORT.md says the workflow-identity binding is CARRIED to debug and not implemented. |
| diff-3 | ✗ LIP-SERVICE | packages/core/src/resolver.ts is not staged. BUILD-REPORT.md says the NaN, negative and Row-5 fixes are CARRIED to debug and not done. |
| diff-4 | ✗ LIP-SERVICE | packages/ofac/src/sdn.ts is not staged. BUILD-REPORT.md says the timeout, count floors and staleness check are CARRIED to debug and not done |
| diff-5 | ✗ LIP-SERVICE | Contract file not staged. The report does not mention the verdict range check or DEGRADED-retry logic. |
| risk-1 | ✗ LIP-SERVICE | apps/web/app/ledger/page.tsx is not staged. The report says only that the ledger shows a correct empty state. |
| risk-2 | ✗ LIP-SERVICE | Test file not staged. The report cites 3 new regression tests, which cover single-leg and both-leg emission, but not foreign workflow metada |
| risk-3 | ✗ LIP-SERVICE | BUILD-REPORT.md has no prominent scope statement and no list of unimplemented coverage (FinCEN, non-SDN lists, EU/UK lists). It only says 'D |
| risk-4 | ✗ LIP-SERVICE | Contract file not staged. The report says the EnclaveAttestation rename is deferred, and Sourcify is described as 'submitted', which is the  |
| risk-5 | ✗ LIP-SERVICE | The deployment and environment tables are populated. Test counts are not normalized (12/12 versus 9/9 remain), and the phase summary is not  |
| bold-1 | ✗ LIP-SERVICE | scripts/verify-claims.ts is not staged, so no canonical receipt payload or recomputation can be confirmed. |
| bold-3 | ✗ LIP-SERVICE | apps/web/app/cockpit/page.tsx is not staged, so the live-SDN HIT demo path cannot be confirmed. |
| bold-4 | ✗ LIP-SERVICE | Contract file not staged. The report describes only the emit condition, not the explicit state enum or status events. |
