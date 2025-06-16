"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId, usePublicClient, useSwitchChain, useWriteContract } from "wagmi"
import { parseUnits } from "viem"
import { useTheme } from "@/components/theme-provider"
import Header from "@/components/header"
import BridgeForm from "./(components)/BridgeForm"
import TransactionStatus from "./(components)/TransactionStatus"
import { contractAddress, usdcBridgeAbi } from "../constants"
import Footer from "@/components/footer"
import type { Employee } from "@/types/employee"

export default function Bridge() {
  const [recipientName, setRecipientName] = useState("")
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("")
  const [usdcAmount, setUsdcAmount] = useState("")
  const [destinationChainSelector, setDestinationChainSelector] = useState("")
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>()
  const [messageId, setMessageId] = useState<`0x${string}` | undefined>()
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeesLoading, setEmployeesLoading] = useState(true)

  const { isDark } = useTheme()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()
  const { chains, switchChain } = useSwitchChain()
  const chainId = useChainId()
  const { isConnected } = useAccount()

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setEmployeesLoading(true)
        const response = await fetch("/api/employees")
        if (response.ok) {
          const data = await response.json()
          setEmployees(data.employees || [])
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
      } finally {
        setEmployeesLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleSubmit = async () => {
    if (!recipientName || !beneficiaryAddress || !usdcAmount || !destinationChainSelector) {
      return
    }

    if (Number(usdcAmount) <= 0) {
      setErrorMessage("Please enter a valid USDC amount (greater than zero)")
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      setIsProcessingReceipt(false)
      setTransactionHash(undefined)
      setMessageId(undefined)

      const usdcAmountInUnits = parseUnits(usdcAmount, 6)

      const txHash = await writeContractAsync({
        abi: usdcBridgeAbi,
        address: contractAddress,
        functionName: "sendUSDCPayLINK",
        args: [destinationChainSelector, beneficiaryAddress, usdcAmountInUnits],
      })

      setTransactionHash(txHash)
      setIsProcessingReceipt(true)

      if (publicClient) {
        try {
          const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
          setMessageId(receipt.logs[receipt.logs.length - 1].topics[1])
        } catch (receiptError) {
          console.error("Error waiting for transaction receipt:", receiptError)
        } finally {
          setIsProcessingReceipt(false)
        }
      }
    } catch (err) {
      console.error("Transaction failed:", err)
      setErrorMessage("Transaction failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChainSwitch = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId })
    } catch (err) {
      console.error("Failed to switch chain:", err)
    }
  }

  return (
    <div className={`min-h-screen pt-20 pb-12 transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`}>
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-48">
        <div className="space-y-8">
          <BridgeForm
            recipientName={recipientName}
            setRecipientName={setRecipientName}
            beneficiaryAddress={beneficiaryAddress}
            setBeneficiaryAddress={setBeneficiaryAddress}
            usdcAmount={usdcAmount}
            setUsdcAmount={setUsdcAmount}
            destinationChainSelector={destinationChainSelector}
            setDestinationChainSelector={setDestinationChainSelector}
            loading={loading}
            isConnected={isConnected}
            chains={chains}
            chainId={chainId}
            onSubmit={handleSubmit}
            onChainSwitch={handleChainSwitch}
            errorMessage={errorMessage}
            employees={employees}
            employeesLoading={employeesLoading}
          />
          {(loading || transactionHash) && (
            <TransactionStatus
              loading={loading}
              transactionHash={transactionHash}
              messageId={messageId}
              isProcessingReceipt={isProcessingReceipt}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
