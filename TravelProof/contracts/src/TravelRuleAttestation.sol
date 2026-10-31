// File: contracts/src/TravelRuleAttestation.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IReceiver, IERC165} from "./interfaces/IReceiver.sol";

/// @notice Stores DON-attested Travel Rule verdicts. Holds NO PII — there is no string/bytes
/// identity field in storage, so a PII write is unrepresentable (INVARIANTS section 1, structural).
contract TravelRuleAttestation is IReceiver {
    struct Attestation {
        bytes32 commitmentHash; // keccak256(canonical verified-claims payload) — NOT a TEE quote
        uint8 verifyVerdict;    // 0=PASS 1=FAIL 2=DEGRADED
        uint8 screenVerdict;    // 0=CLEAR 1=HIT 2=DEGRADED
        uint64 ts;
        bool verifySet;         // write-once guard: verify leg landed
        bool screenSet;         // write-once guard: screen leg landed
    }

    address public immutable s_forwarderAddress;
    mapping(bytes32 => Attestation) private s_attestations;

    event EnclaveAttestation(bytes32 indexed jobId, bytes32 commitmentHash, uint64 ts, uint8 verdict);

    error OnlyForwarder();
    error BadReport();
    error ZeroForwarder();
    error AlreadySet(); // write-once: a verdict leg cannot be overwritten (replay/flip guard)

    constructor(address forwarder) {
        if (forwarder == address(0)) revert ZeroForwarder(); // fail-closed: a real forwarder is mandatory
        s_forwarderAddress = forwarder;
    }

    function onReport(bytes calldata, bytes calldata report) external override {
        // Always enforce — no zero-address bypass (the constructor already forbids a zero forwarder).
        if (msg.sender != s_forwarderAddress) revert OnlyForwarder();
        _processReport(report);
    }

    function _processReport(bytes calldata report) internal {
        // Two report shapes: verify (jobId,commitment,verifyVerdict)=96 bytes, screen (jobId,screenVerdict)=64 bytes.
        if (report.length == 96) {
            (bytes32 jobId, bytes32 commitment, uint8 verifyVerdict) = abi.decode(report, (bytes32, bytes32, uint8));
            Attestation storage a = s_attestations[jobId];
            if (a.verifySet) revert AlreadySet(); // write-once: cannot flip a landed verify verdict
            a.commitmentHash = commitment;
            a.verifyVerdict = verifyVerdict;
            a.verifySet = true;
            if (a.ts == 0) a.ts = uint64(block.timestamp);
            _maybeEmit(jobId, a);
        } else if (report.length == 64) {
            (bytes32 jobId, uint8 screenVerdict) = abi.decode(report, (bytes32, uint8));
            Attestation storage a = s_attestations[jobId];
            if (a.screenSet) revert AlreadySet(); // write-once: cannot flip a landed screen verdict
            a.screenVerdict = screenVerdict;
            a.screenSet = true;
            if (a.ts == 0) a.ts = uint64(block.timestamp);
            _maybeEmit(jobId, a);
        } else {
            revert BadReport();
        }
    }

    function _maybeEmit(bytes32 jobId, Attestation storage a) internal {
        // Emit ONLY when BOTH legs have landed. A single leg landing with the default-0 other leg
        // would otherwise emit verdict=0 (CLEARED) before the OFAC screen ran — a premature
        // false-CLEARED, the exact false-negative a sanctions tool must never produce. The verdict
        // is CLEARED iff verify PASSED (0) AND screen is CLEAR (0); any non-zero leg is BLOCKED.
        if (!(a.verifySet && a.screenSet)) return;
        uint8 verdict = (a.verifyVerdict == 0 && a.screenVerdict == 0) ? 0 : 1; // 0=CLEARED 1=BLOCKED
        emit EnclaveAttestation(jobId, a.commitmentHash, a.ts, verdict);
    }

    function getAttestation(bytes32 jobId)
        external
        view
        returns (bytes32 commitmentHash, uint8 verifyVerdict, uint8 screenVerdict, uint64 ts)
    {
        Attestation storage a = s_attestations[jobId];
        return (a.commitmentHash, a.verifyVerdict, a.screenVerdict, a.ts);
    }

    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return interfaceId == type(IReceiver).interfaceId || interfaceId == type(IERC165).interfaceId;
    }
}
