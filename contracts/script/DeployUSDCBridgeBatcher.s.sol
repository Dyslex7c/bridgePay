// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {USDCBridgeBatcher} from "src/USDCBridgeBatcher.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployUSDCBridgeBatcher is Script {
    function run() external returns (USDCBridgeBatcher batcher, HelperConfig helperConfig) {
        helperConfig = new HelperConfig();
        HelperConfig.NetworkConfig memory config = helperConfig.getEthSepoliaConfig();
        
        return deployUSDCBridgeBatcher(config);
    }

    function deployUSDCBridgeBatcher(
        HelperConfig.NetworkConfig memory config
    ) public returns (USDCBridgeBatcher batcher, HelperConfig helperConfig) {
        address usdcBridgeAddress = vm.envAddress("ETH_BRIDGE_ADDRESS");
        
        vm.startBroadcast();
        
        batcher = new USDCBridgeBatcher(
            usdcBridgeAddress,
            config.usdc,
            config.linkToken
        );
        
        vm.stopBroadcast();
        
        console.log("USDCBridgeBatcher deployed at:", address(batcher));
        console.log("Network:", config.name);
        console.log("USDCBridge Address:", usdcBridgeAddress);
        
        return (batcher, new HelperConfig());
    }
}