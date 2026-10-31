// File: contracts/test/TravelRuleAttestation.t.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {TravelRuleAttestation} from "../src/TravelRuleAttestation.sol";

contract TravelRuleAttestationTest is Test {
    TravelRuleAttestation att;
    address forwarder = address(0xF0);
    bytes32 jobId = keccak256("job-1");

    function setUp() public { att = new TravelRuleAttestation(forwarder); }

    function test_onlyForwarderCanReport() public {
        bytes memory report = abi.encode(jobId, keccak256("c"), uint8(0));
        vm.expectRevert(TravelRuleAttestation.OnlyForwarder.selector);
        att.onReport("", report);
    }

    function test_verifyThenScreen_cleared() public {
        vm.startPrank(forwarder);
        att.onReport("", abi.encode(jobId, keccak256("c"), uint8(0)));      // verify PASS
        att.onReport("", abi.encode(jobId, uint8(0)));                       // screen CLEAR
        vm.stopPrank();
        (bytes32 c, uint8 v, uint8 s, uint64 ts) = att.getAttestation(jobId);
        assertEq(c, keccak256("c"));
        assertEq(v, 0);
        assertEq(s, 0);
        assertGt(ts, 0);
    }

    function test_badReportReverts() public {
        vm.prank(forwarder);
        vm.expectRevert(TravelRuleAttestation.BadReport.selector);
        att.onReport("", hex"1234");
    }

    function test_doubleVerifyReverts_noFlip() public {
        vm.startPrank(forwarder);
        att.onReport("", abi.encode(jobId, keccak256("c"), uint8(0))); // verify PASS lands
        vm.expectRevert(TravelRuleAttestation.AlreadySet.selector);     // a second verify cannot flip it
        att.onReport("", abi.encode(jobId, keccak256("c"), uint8(1)));
        vm.stopPrank();
    }

    function test_zeroForwarderDeployReverts() public {
        vm.expectRevert(TravelRuleAttestation.ZeroForwarder.selector);
        new TravelRuleAttestation(address(0));
    }

    event EnclaveAttestation(bytes32 indexed jobId, bytes32 commitmentHash, uint64 ts, uint8 verdict);

    // Regression (peer-review diff-1): a single leg landing must NOT emit a premature CLEARED.
    // The verify leg (PASS=0) lands first with the screen leg still unset (default 0); the OLD
    // code emitted verdict=0 CLEARED here — a false-clear before the OFAC screen ran.
    function test_singleLeg_doesNotEmitPrematureCleared() public {
        vm.prank(forwarder);
        vm.recordLogs();
        att.onReport("", abi.encode(jobId, keccak256("c"), uint8(0))); // verify PASS only
        Vm.Log[] memory logs = vm.getRecordedLogs();
        assertEq(logs.length, 0, "no event may emit until both legs land");
    }

    // Both legs landed → exactly one CLEARED event with verdict 0.
    function test_bothLegsClear_emitsSingleCleared() public {
        vm.startPrank(forwarder);
        att.onReport("", abi.encode(jobId, keccak256("c"), uint8(0)));
        vm.recordLogs();
        att.onReport("", abi.encode(jobId, uint8(0))); // screen CLEAR → now both set
        vm.stopPrank();
        Vm.Log[] memory logs = vm.getRecordedLogs();
        assertEq(logs.length, 1, "exactly one event when both legs land");
    }

    // Verify PASS + screen HIT → BLOCKED (verdict 1), never CLEARED.
    function test_screenHit_emitsBlocked() public {
        vm.startPrank(forwarder);
        att.onReport("", abi.encode(jobId, keccak256("c"), uint8(0))); // verify PASS
        vm.recordLogs();
        att.onReport("", abi.encode(jobId, uint8(1))); // screen HIT
        vm.stopPrank();
        Vm.Log[] memory logs = vm.getRecordedLogs();
        assertEq(logs.length, 1);
        (, , uint8 verdict) = abi.decode(logs[0].data, (bytes32, uint64, uint8));
        assertEq(verdict, 1, "a screen HIT must be BLOCKED, never CLEARED");
    }
}
