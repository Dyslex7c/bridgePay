-include .env
export

ETH_SEPOLIA_SELECTOR := 16015286601757825753
ARBITRUM_SEPOLIA_SELECTOR := 3478487238524512106
BASE_SEPOLIA_SELECTOR := 10344971235874465080
OPTIMISM_SEPOLIA_SELECTOR := 5224473277236331295
AVALANCHE_FUJI_SELECTOR := 14767482510784806043

.PHONY: bridge

bridge:
	@if [ "$(filter-out $@,$(MAKECMDGOALS))" = "ethereum-arbitrum" ]; then \
		$(MAKE) setup-ethereum-arbitrum; \
	elif [ "$(filter-out $@,$(MAKECMDGOALS))" = "ethereum-base" ]; then \
		$(MAKE) setup-ethereum-base; \
	elif [ "$(filter-out $@,$(MAKECMDGOALS))" = "ethereum-optimism" ]; then \
		$(MAKE) setup-ethereum-optimism; \
	elif [ "$(filter-out $@,$(MAKECMDGOALS))" = "ethereum-avalanche" ]; then \
		$(MAKE) setup-ethereum-avalanche; \
	elif [ "$(filter-out $@,$(MAKECMDGOALS))" = "all" ]; then \
		$(MAKE) setup-all-bridges; \
	else \
		echo "Invalid bridge configuration. Use 'make help' for available options."; \
		exit 1; \
	fi

.PHONY: setup-ethereum-arbitrum
setup-ethereum-arbitrum:
	@forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --sig "setupAllowlists(address,uint64[],uint64[],address[])" $(ETH_BRIDGE_ADDRESS) "[$(ARBITRUM_SEPOLIA_SELECTOR)]" "[]" "[]" --rpc-url $(SEPOLIA_RPC_URL) --broadcast
	@forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --sig "setupAllowlists(address,uint64[],uint64[],address[])" $(ARB_BRIDGE_ADDRESS) "[]" "[$(ETH_SEPOLIA_SELECTOR)]" "[$(ETH_BRIDGE_ADDRESS)]" --rpc-url $(ARBITRUM_SEPOLIA_RPC_URL) --broadcast

.PHONY: setup-ethereum-base
setup-ethereum-base:
	@forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --sig "setupAllowlists(address,uint64[],uint64[],address[])" $(ETH_BRIDGE_ADDRESS) "[$(BASE_SEPOLIA_SELECTOR)]" "[]" "[]" --rpc-url $(SEPOLIA_RPC_URL) --broadcast
	@forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --sig "setupAllowlists(address,uint64[],uint64[],address[])" $(BASE_BRIDGE_ADDRESS) "[]" "[$(ETH_SEPOLIA_SELECTOR)]" "[$(ETH_BRIDGE_ADDRESS)]" --rpc-url $(BASE_SEPOLIA_RPC_URL) --broadcast

.PHONY: setup-ethereum-optimism
setup-ethereum-optimism:
	@forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --sig "setupAllowlists(address,uint64[],uint64[],address[])" $(ETH_BRIDGE_ADDRESS) "[$(OPTIMISM_SEPOLIA_SELECTOR)]" "[]" "[]" --rpc-url $(SEPOLIA_RPC_URL) --broadcast
	@forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --sig "setupAllowlists(address,uint64[],uint64[],address[])" $(OPTIMISM_BRIDGE_ADDRESS) "[]" "[$(ETH_SEPOLIA_SELECTOR)]" "[$(ETH_BRIDGE_ADDRESS)]" --rpc-url $(OPTIMISM_SEPOLIA_RPC_URL) --broadcast

.PHONY: setup-ethereum-avalanche
setup-ethereum-avalanche:
	@forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --sig "setupAllowlists(address,uint64[],uint64[],address[])" $(ETH_BRIDGE_ADDRESS) "[$(AVALANCHE_FUJI_SELECTOR)]" "[]" "[]" --rpc-url $(SEPOLIA_RPC_URL) --broadcast
	@forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --sig "setupAllowlists(address,uint64[],uint64[],address[])" $(AVALANCHE_BRIDGE_ADDRESS) "[]" "[$(ETH_SEPOLIA_SELECTOR)]" "[$(ETH_BRIDGE_ADDRESS)]" --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

.PHONY: setup-all-bridges
setup-all-bridges:
	@$(MAKE) setup-ethereum-arbitrum
	@$(MAKE) setup-ethereum-base
	@$(MAKE) setup-ethereum-optimism
	@$(MAKE) setup-ethereum-avalanche

deploy-eth:
	TARGET_CHAIN=ethereum forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --rpc-url $(SEPOLIA_RPC_URL) --account myaccount default --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv

deploy-arb:
	TARGET_CHAIN=arbitrum forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --rpc-url $(ARBITRUM_SEPOLIA_RPC_URL) --account myaccount default --broadcast --verify -vvvv

deploy-base:
	TARGET_CHAIN=base forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --rpc-url $(BASE_SEPOLIA_RPC_URL) --account myaccount default --broadcast --verify -vvvv

deploy-op:
	TARGET_CHAIN=base forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --rpc-url $(OP_SEPOLIA_RPC_URL) --account myaccount default --broadcast --verify -vvvv

deploy-avax:
	TARGET_CHAIN=base forge script script/DeployUSDCBridge.s.sol:DeployUSDCBridge --rpc-url $(AVAX_FUJI_RPC_URL) --account myaccount default --broadcast --verify -vvvv