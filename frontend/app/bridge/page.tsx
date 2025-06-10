"use client"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import { contractAddress, destinationChains, usdcBridgeAbi } from "../constants";
import { useAccount, useChainId, usePublicClient, useSwitchChain, useWriteContract } from "wagmi";
import { parseUnits } from "viem";

export default function Bridge() {
    const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
    const [usdcAmount, setUsdcAmount] = useState("");
    const [destinationChainSelector, setDestinationChainSelector] = useState("");
    const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
    const [messageId, setMessageId] = useState<`0x${string}` | undefined>();
    const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
    
    const [loading, setLoading] = useState(false);    

    const { writeContractAsync } = useWriteContract();
    const publicClient = usePublicClient();
    const { chains, switchChain } = useSwitchChain();
    const chainId = useChainId();
    const { isConnected } = useAccount();
    
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setIsProcessingReceipt(false);

            const usdcAmountInUnits = parseUnits(usdcAmount, 6);
    
            const txHash = await writeContractAsync({
                abi: usdcBridgeAbi,
                address: contractAddress,
                functionName: "sendUSDCPayLINK",
                args: [
                    destinationChainSelector,
                    beneficiaryAddress,
                    usdcAmountInUnits
                ]
            });
    
            setTransactionHash(txHash);
            setIsProcessingReceipt(true);

            if (publicClient) {
                try {
                    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
                    setMessageId(receipt.logs[receipt.logs.length - 1].topics[1]);
                } catch (receiptError) {
                    console.error("Error waiting for transaction receipt:", receiptError);
                } finally {
                    setIsProcessingReceipt(false);
                }
            }

        } catch(err) {
            console.error("Transaction failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChainSwitch = async (targetChainId: number) => {
        try {
            await switchChain({ chainId: targetChainId });
        } catch (err) {
            console.error("Failed to switch chain:", err);
        }
    };

    const getCurrentChain = () => {
        return chains.find(chain => chain.id === chainId);
    }

    const getDestinationChainName = () => {
        return destinationChains.find(chain => chain.selector === destinationChainSelector)?.name || 'Unknown';
    }

    const shouldShowLinks = transactionHash && !isProcessingReceipt;
    const shouldShowCCIPLink = shouldShowLinks && messageId;

    return (
        <div className="space-y-4 p-4">
            {isConnected && (
                <div className="flex items-center gap-4">
                    <span>Current Chain: {getCurrentChain()?.name || 'Unknown'}</span>
                    <select 
                        value={chainId} 
                        onChange={(e) => handleChainSwitch(Number(e.target.value))}
                        className="border rounded px-3 py-1"
                    >
                        {chains.map((chain) => (
                            <option key={chain.id} value={chain.id}>
                                {chain.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Destination Chain (Where to Bridge)</h3>
                <div className="flex items-center gap-4">
                    <span>Bridge to: {getDestinationChainName()}</span>
                    <select 
                        value={destinationChainSelector} 
                        onChange={(e) => setDestinationChainSelector(e.target.value)}
                        className="border rounded px-3 py-1"
                    >
                        {destinationChains.map((chain) => (
                            <option key={chain.selector} value={chain.selector}>
                                {chain.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <Input 
                placeholder="Beneficiary Address"
                value={beneficiaryAddress}
                onChange={e => setBeneficiaryAddress(e.target.value)} 
            />
            <Input 
                placeholder="USDC Amount"
                type="number"
                value={usdcAmount}
                onChange={e => setUsdcAmount(e.target.value)} 
            />
            <button onClick={handleSubmit}>
                {loading ? "Processing" : "Bridge USDC"}
            </button>

            {shouldShowLinks && (
                <>
                    <div>
                        <a 
                            href={`https://sepolia.etherscan.io/tx/${transactionHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            View on Etherscan
                        </a>
                    </div>
                    {shouldShowCCIPLink && (<div>
                        <a 
                            href={`https://ccip.chain.link/msg/${messageId}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            View on CCIP Explorer
                        </a>
                    </div>)}
                    <details className="mt-2">
                        <summary className="text-sm text-gray-600 cursor-pointer">Debug Info</summary>
                        <div className="mt-2 text-xs text-gray-500">
                            <p>Transaction Hash: {transactionHash}</p>
                            <p>Message ID: {messageId || "Not found"}</p>
                        </div>
                    </details>
                </>
            )}
        </div>
    )
}