// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IRouterClient} from "@ccip/contracts/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@ccip/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@ccip/contracts/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@ccip/contracts/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@ccip/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@ccip/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title USDCBridge
 * @author Ritesh Das
 * @notice Facilitates USDC transfers across chains using Chainlink CCIP
 */
contract USDCBridge is CCIPReceiver, OwnerIsCreator {
    using SafeERC20 for IERC20;

    error USDCBridge__NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error USDCBridge__NothingToWithdraw();
    error USDCBridge__DestinationChainNotAllowed(uint64 destinationChainSelector);
    error USDCBridge__SourceChainNotAllowed(uint64 sourceChainSelector);
    error USDCBridge__SenderNotAllowed(address sender);
    error USDCBridge__InvalidReceiverAddress();

    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        uint256 amount,
        uint256 fees
    );

    event MessageReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender,
        address recipient,
        uint256 amount
    );

    IERC20 public immutable i_usdcToken;
    IERC20 public immutable i_linkToken;
    
    mapping(uint64 => bool) public allowlistedDestinationChains;
    mapping(uint64 => bool) public allowlistedSourceChains;
    mapping(address => bool) public allowlistedSenders;

    modifier onlyAllowlistedDestinationChain(uint64 _destinationChainSelector) {
        if (!allowlistedDestinationChains[_destinationChainSelector])
            revert USDCBridge__DestinationChainNotAllowed(_destinationChainSelector);
        _;
    }

    modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
        if (!allowlistedSourceChains[_sourceChainSelector])
            revert USDCBridge__SourceChainNotAllowed(_sourceChainSelector);
        if (!allowlistedSenders[_sender]) revert USDCBridge__SenderNotAllowed(_sender);
        _;
    }

    modifier validateReceiver(address _receiver) {
        if (_receiver == address(0)) revert USDCBridge__InvalidReceiverAddress();
        _;
    }

    constructor(address _router, address _usdc, address _linkToken) CCIPReceiver(_router) {
        i_usdcToken = IERC20(_usdc);
        i_linkToken = IERC20(_linkToken);
    }

    /**
     * @notice Sends USDC with LINK token for fees
     * @param _destinationChainSelector The identifier for the destination blockchain
     * @param _receiver The address of the recipient on the destination blockchain
     * @param _amount The amount of USDC to transfer
     * @return messageId The ID of the CCIP message that was sent
     */
    function sendUSDCPayLINK(
        uint64 _destinationChainSelector,
        address _receiver,
        uint256 _amount
    )
        external
        onlyAllowlistedDestinationChain(_destinationChainSelector)
        validateReceiver(_receiver)
        returns (bytes32 messageId)
    {
        Client.EVM2AnyMessage memory message = _buildCCIPMessage(_receiver, _amount, address(i_linkToken)); 

        // Initialize a router client instance to interact with cross-chain router
        IRouterClient router = IRouterClient(this.getRouter());

        uint256 fees = router.getFee(_destinationChainSelector, message);

        if (fees > i_linkToken.balanceOf(address(this)))
            revert USDCBridge__NotEnoughBalance(i_linkToken.balanceOf(address(this)), fees);

        // Approve the Router to transfer USDC tokens on contract's behalf
        i_usdcToken.approve(address(router), _amount);
        
        // Approve the Router to transfer LINK tokens for fees
        i_linkToken.approve(address(router), fees);

        // Send the message through the router and store the returned message ID
        messageId = router.ccipSend(_destinationChainSelector, message);

        emit MessageSent(
            messageId,
            _destinationChainSelector,
            _receiver,
            _amount,
            fees
        );

        return messageId;
    }

    /**
     * @notice Construct a CCIP message
     * @param _receiver The address of the receiver
     * @param _amount The amount of USDC to send
     * @param _feeTokenAddress The address of the token used for fees
     * @return Client.EVM2AnyMessage memory The constructed CCIP message
     */
    function _buildCCIPMessage(
        address _receiver,
        uint256 _amount,
        address _feeTokenAddress
    ) private view returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: address(i_usdcToken),
            amount: _amount
        });

        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver),
                data: "",
                tokenAmounts: tokenAmounts,
                extraArgs: Client._argsToBytes(
                    Client.EVMExtraArgsV1({gasLimit: 200_000})
                ),
                feeToken: _feeTokenAddress
            });
    }

    /**
     * @notice Handle received messages from other chains
     */
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    )
        internal
        override
        onlyAllowlisted(
            any2EvmMessage.sourceChainSelector,
            abi.decode(any2EvmMessage.sender, (address))
        )
    {
        bytes32 messageId = any2EvmMessage.messageId;
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector;
        address sender = abi.decode(any2EvmMessage.sender, (address));
        address originalSender = abi.decode(any2EvmMessage.data, (address));
        
        address token = any2EvmMessage.destTokenAmounts[0].token;
        uint256 amount = any2EvmMessage.destTokenAmounts[0].amount;

        IERC20(token).safeTransfer(originalSender, amount);

        emit MessageReceived(
            messageId,
            sourceChainSelector,
            sender,
            originalSender,
            amount
        );
    }

    /**
     * @notice Get estimated fees for sending USDC
     */
    function getFee(
        uint64 _destinationChainSelector,
        address _receiver,
        uint256 _amount,
        address _feeToken
    ) external view returns (uint256 fee) {
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _amount,
            _feeToken
        );
        return IRouterClient(this.getRouter()).getFee(_destinationChainSelector, evm2AnyMessage);
    }

    receive() external payable {}

    /**
     * @notice Allows the contract owner to withdraw the entire balance of a specific ERC20 token
     */
    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));
        if (amount == 0) revert USDCBridge__NothingToWithdraw();
        IERC20(_token).safeTransfer(_beneficiary, amount);
    }

    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedDestinationChains[_destinationChainSelector] = allowed;
    }

    function allowlistSourceChain(
        uint64 _sourceChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedSourceChains[_sourceChainSelector] = allowed;
    }

    function allowlistSender(address _sender, bool allowed) external onlyOwner {
        allowlistedSenders[_sender] = allowed;
    }
}