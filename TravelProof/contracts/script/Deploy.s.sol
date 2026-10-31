// File: contracts/script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {TravelRuleAttestation} from "../src/TravelRuleAttestation.sol";

contract Deploy is Script {
    function run() external returns (TravelRuleAttestation att) {
        address forwarder = vm.envAddress("KEYSTONE_FORWARDER_ADDR");
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(pk);
        att = new TravelRuleAttestation(forwarder);
        vm.stopBroadcast();
        console.log("TravelRuleAttestation:", address(att));
    }
}
