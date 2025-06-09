// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    error HelperConfig__InvalidChainId();

    struct NetworkConfig {
        address ccipRouter;
        address usdc;
        address linkToken;
        uint64 chainSelector;
        string name;
    }

    uint256 public constant ETH_SEPOLIA_CHAIN_ID = 11155111;
    uint256 public constant ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
    uint256 public constant BASE_SEPOLIA_CHAIN_ID = 84532;
    uint256 public constant OPTIMISM_SEPOLIA_CHAIN_ID = 11155420;
    uint256 public constant AVALANCHE_FUJI_CHAIN_ID = 43113;

    mapping(uint256 => NetworkConfig) private networkConfigs;

    constructor() {
        networkConfigs[ETH_SEPOLIA_CHAIN_ID] = getEthSepoliaConfig();
        networkConfigs[ARBITRUM_SEPOLIA_CHAIN_ID] = getArbitrumSepoliaConfig();
        networkConfigs[BASE_SEPOLIA_CHAIN_ID] = getBaseSepoliaConfig();
        networkConfigs[OPTIMISM_SEPOLIA_CHAIN_ID] = getOptimismSepoliaConfig();
        networkConfigs[AVALANCHE_FUJI_CHAIN_ID] = getAvalancheFujiConfig();
    }

    function getEthSepoliaConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({
            ccipRouter: 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59,
            usdc: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238,
            linkToken: 0x779877A7B0D9E8603169DdbD7836e478b4624789,
            chainSelector: 16015286601757825753,
            name: "Ethereum Sepolia"
        });
    }

    function getArbitrumSepoliaConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({
            ccipRouter: 0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165,
            usdc: 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d,
            linkToken: 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E,
            chainSelector: 3478487238524512106,
            name: "Arbitrum Sepolia"
        });
    }

    function getBaseSepoliaConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({
            ccipRouter: 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93,
            usdc: 0x036CbD53842c5426634e7929541eC2318f3dCF7e,
            linkToken: 0xE4aB69C077896252FAFBD49EFD26B5D171A32410,
            chainSelector: 10344971235874465080,
            name: "Base Sepolia"
        });
    }

    function getOptimismSepoliaConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({
            ccipRouter: 0x114A20A10b43D4115e5aeef7345a1A71d2a60C57, 
            usdc: 0x5fd84259d66Cd46123540766Be93DFE6D43130D7,
            linkToken: 0xE4aB69C077896252FAFBD49EFD26B5D171A32410,
            chainSelector: 5224473277236331295,
            name: "Optimism Sepolia"
        });
    }

    function getAvalancheFujiConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({
            ccipRouter: 0xF694E193200268f9a4868e4Aa017A0118C9a8177,
            usdc: 0x5425890298aed601595a70AB815c96711a31Bc65,
            linkToken: 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846,
            chainSelector: 14767482510784806043,
            name: "Avalanche Fuji"
        });
    }

    function getConfigByChainId(uint256 chainId) public view returns (NetworkConfig memory) {
        if (networkConfigs[chainId].ccipRouter == address(0)) {
            revert HelperConfig__InvalidChainId();
        }
        return networkConfigs[chainId];
    }

    function getActiveNetworkConfig() public view returns (NetworkConfig memory) {
        return getConfigByChainId(block.chainid);
    }

    function getAllSupportedChainIds() public pure returns (uint256[] memory) {
        uint256[] memory chainIds = new uint256[](5);
        chainIds[0] = ETH_SEPOLIA_CHAIN_ID;
        chainIds[1] = ARBITRUM_SEPOLIA_CHAIN_ID;
        chainIds[2] = BASE_SEPOLIA_CHAIN_ID;
        chainIds[3] = OPTIMISM_SEPOLIA_CHAIN_ID;
        chainIds[4] = AVALANCHE_FUJI_CHAIN_ID;
        return chainIds;
    }

    function getChainName(uint256 chainId) public view returns (string memory) {
        return getConfigByChainId(chainId).name;
    }
}