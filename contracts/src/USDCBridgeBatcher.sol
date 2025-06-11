// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {USDCBridge} from "./USDCBridge.sol";
import {IERC20} from "@ccip/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@ccip/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title USDCBridgeBatcher
 * @author Ritesh Das
 * @notice Batch multiple USDC bridge transfers in a single transaction
 */
contract USDCBridgeBatcher {
    error USDCBridgeBatcher__NoTransfersSpecified();

    using SafeERC20 for IERC20;

    struct TransferRequest {
        uint64 destinationChainSelector;
        address receiver;
        uint256 amount;
    }

    USDCBridge public immutable i_usdcBridge;
    IERC20 public immutable i_usdcToken;
    IERC20 public immutable i_linkToken;

    event BatchTransferCompleted(
        address indexed sender,
        uint256 totalTransfers,
        bytes32[] messageIds,
        uint256 totalFees
    );

    constructor(address _usdcBridge, address _usdc, address _link) {
        i_usdcBridge = USDCBridge(payable(_usdcBridge));
        i_usdcToken = IERC20(_usdc);
        i_linkToken = IERC20(_link);
    }

    /**
     * @notice Execute multiple USDC transfers in a single transaction
     * @param transfers Array of transfer requests
     * @return messageIds Array of CCIP message IDs for each transfer
     */
    function batchSendUSDC(
        TransferRequest[] calldata transfers
    ) external returns (bytes32[] memory messageIds) {
        if (transfers.length <= 0) {
            revert USDCBridgeBatcher__NoTransfersSpecified();
        }
        
        uint256 totalUSDCNeeded = 0;
        uint256 totalFeesNeeded = 0;
        
        for (uint i = 0; i < transfers.length; i++) {
            totalUSDCNeeded += transfers[i].amount;
            
            uint256 fee = i_usdcBridge.getFee(
                transfers[i].destinationChainSelector,
                transfers[i].receiver,
                transfers[i].amount,
                address(i_linkToken)
            );
            totalFeesNeeded += fee;
        }

        i_usdcToken.safeTransferFrom(msg.sender, address(this), totalUSDCNeeded);
        i_linkToken.safeTransferFrom(msg.sender, address(this), totalFeesNeeded);

        i_usdcToken.approve(address(i_usdcBridge), totalUSDCNeeded);
        i_linkToken.approve(address(i_usdcBridge), totalFeesNeeded);

        i_usdcToken.safeTransfer(address(i_usdcBridge), totalUSDCNeeded);
        i_linkToken.safeTransfer(address(i_usdcBridge), totalFeesNeeded);

        messageIds = new bytes32[](transfers.length);
        for (uint i = 0; i < transfers.length; i++) {
            messageIds[i] = i_usdcBridge.sendUSDCPayLINK(
                transfers[i].destinationChainSelector,
                transfers[i].receiver,
                transfers[i].amount
            );
        }

        emit BatchTransferCompleted(
            msg.sender,
            transfers.length,
            messageIds,
            totalFeesNeeded
        );

        return messageIds;
    }

    /**
     * @notice Get total fees for a batch of transfers
     */
    function getBatchFees(
        TransferRequest[] calldata transfers
    ) external view returns (uint256 totalFees, uint256[] memory individualFees) {
        individualFees = new uint256[](transfers.length);
        totalFees = 0;

        for (uint i = 0; i < transfers.length; i++) {
            uint256 fee = i_usdcBridge.getFee(
                transfers[i].destinationChainSelector,
                transfers[i].receiver,
                transfers[i].amount,
                address(i_linkToken)
            );
            individualFees[i] = fee;
            totalFees += fee;
        }
    }
}