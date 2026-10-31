// File: contracts/test/TravelRuleAttestation.t.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
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
}
