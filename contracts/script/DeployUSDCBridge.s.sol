// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {USDCBridge} from "src/USDCBridge.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployUSDCBridge is Script {
    error DeployUSDCBridge__UnsupportedChainName(string chainName);

    struct DeploymentResult {
        address bridgeAddress;
        uint256 chainId;
        string chainName;
        address router;
        address usdc;
        address linkToken;
        uint64 chainSelector;
    }

    mapping(uint256 => address) public deployedBridges;
    DeploymentResult[] public deploymentHistory;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        string memory targetChainEnv = vm.envOr("TARGET_CHAIN", string(""));
        
        if (bytes(targetChainEnv).length > 0) {
            uint256 targetChainId = getChainIdFromName(targetChainEnv);
            deployToChain(deployerPrivateKey, targetChainId);
        } else {
            deployToCurrentChain(deployerPrivateKey);
        }
    }

    function deployToCurrentChain(uint256 deployerPrivateKey) public returns (address) {
        return deployToChain(deployerPrivateKey, block.chainid);
    }

    function deployToChain(uint256 deployerPrivateKey, uint256 chainId) public returns (address) {
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfigByChainId(chainId);
        
        console.log("Deploying USDCBridge to:", config.name);
        console.log("Chain ID:", chainId);
        console.log("CCIP Router:", config.ccipRouter);
        console.log("USDC Token:", config.usdc);
        console.log("LINK Token:", config.linkToken);
        console.log("Chain Selector:", config.chainSelector);

        vm.startBroadcast(deployerPrivateKey);
        
        USDCBridge bridge = new USDCBridge(
            config.ccipRouter,
            config.usdc,
            config.linkToken
        );

        vm.stopBroadcast();

        address bridgeAddress = address(bridge);
        deployedBridges[chainId] = bridgeAddress;
        
        deploymentHistory.push(DeploymentResult({
            bridgeAddress: bridgeAddress,
            chainId: chainId,
            chainName: config.name,
            router: config.ccipRouter,
            usdc: config.usdc,
            linkToken: config.linkToken,
            chainSelector: config.chainSelector
        }));

        console.log("USDCBridge deployed at address:", bridgeAddress);
        console.log("Deployment successful on", config.name);

        return bridgeAddress;
    }

    function deployToAllChains(uint256 deployerPrivateKey) external returns (address[] memory) {
        HelperConfig helperConfig = new HelperConfig();
        uint256[] memory chainIds = helperConfig.getAllSupportedChainIds();
        address[] memory bridges = new address[](chainIds.length);

        for (uint256 i = 0; i < chainIds.length; i++) {
            try this.deployToChain(deployerPrivateKey, chainIds[i]) returns (address bridge) {
                bridges[i] = bridge;
                console.log("Successfully deployed to chain ID:", chainIds[i]);
            } catch Error(string memory reason) {
                console.log("Failed to deploy to chain ID:", chainIds[i]);
                console.log("Reason:", reason);
                bridges[i] = address(0);
            } catch {
                console.log("Failed to deploy to chain ID:", chainIds[i]);
                console.log("Unknown error occurred");
                bridges[i] = address(0);
            }
        }

        return bridges;
    }

    function deployToSpecificChains(
        uint256 deployerPrivateKey, 
        uint256[] memory chainIds
    ) external returns (address[] memory) {
        address[] memory bridges = new address[](chainIds.length);

        for (uint256 i = 0; i < chainIds.length; i++) {
            bridges[i] = deployToChain(deployerPrivateKey, chainIds[i]);
        }

        return bridges;
    }

    function getChainIdFromName(string memory chainName) public pure returns (uint256) {
        bytes32 nameHash = keccak256(abi.encodePacked(chainName));
        
        if (nameHash == keccak256(abi.encodePacked("ethereum"))) {
            return 11155111;
        } else if (nameHash == keccak256(abi.encodePacked("arbitrum"))) {
            return 421614;
        } else if (nameHash == keccak256(abi.encodePacked("base"))) {
            return 84532;
        } else if (nameHash == keccak256(abi.encodePacked("optimism"))) {
            return 11155420;
        } else if (nameHash == keccak256(abi.encodePacked("avalanche"))) {
            return 43113;
        } else {
            revert DeployUSDCBridge__UnsupportedChainName(chainName);
        }
    }

    function getDeploymentHistory() external view returns (DeploymentResult[] memory) {
        return deploymentHistory;
    }

    function getBridgeAddress(uint256 chainId) external view returns (address) {
        return deployedBridges[chainId];
    }

    function setupAllowlists(
        address bridgeAddress,
        uint64[] memory destinationChains,
        uint64[] memory sourceChains,
        address[] memory senders
    ) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        USDCBridge bridge = USDCBridge(payable(bridgeAddress));
        
        for (uint256 i = 0; i < destinationChains.length; i++) {
            bridge.allowlistDestinationChain(destinationChains[i], true);
            console.log("Allowlisted destination chain:", destinationChains[i]);
        }
        
        for (uint256 i = 0; i < sourceChains.length; i++) {
            bridge.allowlistSourceChain(sourceChains[i], true);
            console.log("Allowlisted source chain:", sourceChains[i]);
        }
        
        for (uint256 i = 0; i < senders.length; i++) {
            bridge.allowlistSender(senders[i], true);
            console.log("Allowlisted sender:", senders[i]);
        }
        
        vm.stopBroadcast();
        
        console.log("Allowlist setup completed for bridge:", bridgeAddress);
    }
}