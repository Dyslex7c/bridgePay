"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId, useSwitchChain, useWriteContract, usePublicClient } from "wagmi"
import { parseUnits } from "viem"
import { useTheme } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeader from "./(components)/PageHeader"
import AddBeneficiaryForm from "./(components)/AddBeneficiaryForm"
import BatchSummary from "./(components)/BatchSummary"
import BatchTransactionStatus from "./(components)/BatchTransactionStatus"
import { batchContractAddress, batcherAbi, chainSelectorMapping } from "../constants"
import type { Employee } from "@/types/employee"
import AirdropUploadForm from "./(components)/AirdropUploadForm"

type Beneficiary = {
  nickname: string
  destinationChainSelector: string
  beneficiaryAddress: string
  usdcAmount: string
}

const getChainSelectorFromName = (chainName: string): string | null => {
  const normalizedName = chainName.toLowerCase().trim()
  const chainMapping: Record<string, string> = {
    ethereum: "16015286601757825753",
    arbitrum: "3478487238524512106",
    optimism: "5224473277236331295",
    avalanche: "14767482510784806043",
    base: "10344971235874465080",
  }
  return chainMapping[normalizedName] || null
}

export default function OneToMany() {
  const [mode, setMode] = useState<"manual" | "airdrop">("manual")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [parsedRecipients, setParsedRecipients] = useState<Beneficiary[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [beneficiaryAddress, setBeneficiaryAddress] = useState<string>("")
  const [nickname, setNickname] = useState("")
  const [usdcAmount, setUsdcAmount] = useState("")
  const [listOfBeneficiaries, setListOfBeneficiaries] = useState<Beneficiary[]>([])
  const [destinationChainSelector, setDestinationChainSelector] = useState("")
  const [loading, setLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>()
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [addingAllEmployees, setAddingAllEmployees] = useState(false)

  const { isDark } = useTheme()
  const { chains, switchChain } = useSwitchChain()
  const chainId = useChainId()
  const { isConnected, address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

  // Helper function to get chain name from selector
  const getChainName = (selector: string) => {
    return chainSelectorMapping[selector].name
  }

  // Helper function to get current chain name
  const getCurrentChainName = () => {
    const currentChain = chains.find((chain) => chain.id === chainId)
    return currentChain?.name || "Unknown Chain"
  }

  const parseCsvFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split("\n").filter((line) => line.trim())
          const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

          const data = lines.slice(1).map((line) => {
            const values = line.split(",").map((v) => v.trim())
            const row: any = {}
            headers.forEach((header, index) => {
              row[header] = values[index] || ""
            })
            return row
          })

          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const handleCsvUpload = async (file: File) => {
    try {
      setUploadError(null)
      setCsvFile(file)

      const data = await parseCsvFile(file)
      setCsvData(data)

      // Validate and convert CSV data to beneficiaries
      const recipients: Beneficiary[] = []
      const errors: string[] = []

      data.forEach((row, index) => {
        const address = row["wallet_address"] || row["address"] || row["wallet"]
        const amount = row["amount"] || row["usdc_amount"] || row["usdc"]
        const chainName = row["chain"] || row["chain_name"] || row["network"]
        const name = row["name"] || row["nickname"] || `Recipient ${index + 1}`

        if (!address) {
          errors.push(`Row ${index + 1}: Missing wallet address`)
          return
        }

        if (!amount || isNaN(Number(amount))) {
          errors.push(`Row ${index + 1}: Invalid amount`)
          return
        }

        if (!chainName) {
          errors.push(`Row ${index + 1}: Missing chain name`)
          return
        }

        const chainSelector = getChainSelectorFromName(chainName)
        if (!chainSelector) {
          errors.push(
            `Row ${index + 1}: Invalid chain name "${chainName}". Supported: Ethereum, Arbitrum, Optimism, Avalanche, Base`,
          )
          return
        }

        recipients.push({
          nickname: name,
          beneficiaryAddress: address,
          destinationChainSelector: chainSelector,
          usdcAmount: amount.toString(),
        })
      })

      if (errors.length > 0) {
        setUploadError(`CSV validation errors:\n${errors.join("\n")}`)
        return
      }

      setParsedRecipients(recipients)
      // Automatically add to batch
      setListOfBeneficiaries((prev) => [...prev, ...recipients])
    } catch (error) {
      setUploadError("Failed to parse CSV file. Please check the format.")
    }
  }

  // Function to save batch transaction to database
  const saveBatchTransactionToDatabase = async (
    txHash: `0x${string}`,
    status: "pending" | "completed" | "failed" = "pending",
  ) => {
    try {
      const recipients = listOfBeneficiaries.map((beneficiary) => ({
        name: beneficiary.nickname,
        address: beneficiary.beneficiaryAddress,
        amount: Number(beneficiary.usdcAmount),
        chain: beneficiary.destinationChainSelector,
        chainName: getChainName(beneficiary.destinationChainSelector),
      }))

      const totalAmount = recipients.reduce((sum, recipient) => sum + recipient.amount, 0)

      const transactionData = {
        transactionId: txHash,
        type: "one-to-many" as const,
        senderAddress: address || "",
        senderName: "", // Could be enhanced to get sender name
        recipients,
        sourceChain: chainId?.toString() || "",
        sourceChainName: getCurrentChainName(),
        totalAmount,
        status,
        transactionHash: txHash,
        gasUsed: 0, // Will be updated when receipt is processed
        gasFee: 0, // Will be updated when receipt is processed
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      })

      if (!response.ok) {
        console.error("Failed to save batch transaction to database")
      }
    } catch (error) {
      console.error("Error saving batch transaction:", error)
    }
  }

  // Function to update transaction status
  const updateTransactionStatus = async (
    txHash: `0x${string}`,
    status: "completed" | "failed",
    gasUsed?: number,
    gasFee?: number,
  ) => {
    try {
      const updateData = {
        status,
        completedAt: new Date(),
        ...(gasUsed && { gasUsed }),
        ...(gasFee && { gasFee }),
      }

      await fetch(`/api/transactions/${txHash}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
    } catch (error) {
      console.error("Error updating transaction status:", error)
    }
  }

  const handleChainSwitch = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId })
    } catch (err) {
      console.error("Failed to switch chain:", err)
    }
  }

  const handleAddBeneficiary = () => {
    if (!nickname || !beneficiaryAddress || !destinationChainSelector || !usdcAmount) {
      setErrorMessage("Please fill in all fields")
      return
    }

    if (Number(usdcAmount) <= 0) {
      setErrorMessage("Please enter a valid USDC amount (greater than zero)")
      return
    }

    const newBeneficiary: Beneficiary = {
      nickname,
      beneficiaryAddress,
      destinationChainSelector,
      usdcAmount,
    }

    setListOfBeneficiaries((prev) => [...prev, newBeneficiary])
    setNickname("")
    setBeneficiaryAddress("")
    setUsdcAmount("")
    setDestinationChainSelector("")
    setErrorMessage(null)
  }

  const handleAddAllEmployees = async () => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet first")
      return
    }

    if (employees.length === 0) {
      setErrorMessage("No employees found to add")
      return
    }

    try {
      setAddingAllEmployees(true)
      setErrorMessage(null)

      // Convert all employees to beneficiaries
      const employeeBeneficiaries: Beneficiary[] = employees.map((employee) => ({
        nickname: employee.name,
        beneficiaryAddress: employee.walletAddress,
        destinationChainSelector: employee.preferredChain,
        usdcAmount: employee.monthlySalary.toString(),
      }))

      // Filter out employees that are already in the batch (by wallet address)
      const existingAddresses = new Set(listOfBeneficiaries.map((b) => b.beneficiaryAddress.toLowerCase()))
      const newBeneficiaries = employeeBeneficiaries.filter(
        (emp) => !existingAddresses.has(emp.beneficiaryAddress.toLowerCase()),
      )

      if (newBeneficiaries.length === 0) {
        setErrorMessage("All employees are already added to the batch")
        return
      }

      // Add all new beneficiaries to the list
      setListOfBeneficiaries((prev) => [...prev, ...newBeneficiaries])

      // Show success message
      const addedCount = newBeneficiaries.length
      const skippedCount = employees.length - addedCount

      if (skippedCount > 0) {
        setErrorMessage(`Added ${addedCount} employees. ${skippedCount} were already in the batch.`)
      } else {
        setErrorMessage(`Successfully added all ${addedCount} employees to the batch!`)
      }

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    } catch (error) {
      console.error("Failed to add all employees:", error)
      setErrorMessage("Failed to add employees. Please try again.")
    } finally {
      setAddingAllEmployees(false)
    }
  }

  const handleBatchTransfer = async () => {
    if (listOfBeneficiaries.length === 0) {
      setErrorMessage("Please add at least one beneficiary")
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      setTransactionHash(undefined)
      setIsProcessingReceipt(false)

      const transfers = listOfBeneficiaries.map((beneficiary) => ({
        destinationChainSelector: BigInt(beneficiary.destinationChainSelector),
        receiver: beneficiary.beneficiaryAddress as `0x${string}`,
        amount: parseUnits(beneficiary.usdcAmount, 6),
      }))

      const TxHash = await writeContractAsync({
        abi: batcherAbi,
        address: batchContractAddress,
        functionName: "batchSendUSDC",
        args: [transfers],
      })

      setTransactionHash(TxHash)
      setIsProcessingReceipt(true)

      // Save batch transaction to database as pending
      await saveBatchTransactionToDatabase(TxHash, "pending")

      if (publicClient) {
        try {
          const receipt = await publicClient.waitForTransactionReceipt({ hash: TxHash })

          // Calculate gas fee (gasUsed * gasPrice)
          const gasUsed = Number(receipt.gasUsed)
          const gasPrice = receipt.effectiveGasPrice || 0
          const gasFee = Number(gasUsed * Number(gasPrice)) / 1e18 // Convert to ETH

          // Update transaction status to completed
          await updateTransactionStatus(TxHash, "completed", gasUsed, gasFee)
        } catch (receiptError) {
          console.error("Error waiting for transaction receipt:", receiptError)
          // Update transaction status to failed
          await updateTransactionStatus(TxHash, "failed")
        } finally {
          setIsProcessingReceipt(false)
        }
      }
    } catch (err) {
      console.error("Batch transfer failed:", err)
      setErrorMessage("Batch transfer failed. Please try again.")

      if (transactionHash) {
        await updateTransactionStatus(transactionHash, "failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const removeBeneficiary = (index: number) => {
    setListOfBeneficiaries((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true)
        const response = await fetch("/api/employees")
        if (response.ok) {
          const data = await response.json()
          setEmployees(data.employees || [])
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error)
      } finally {
        setLoadingEmployees(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleSelectEmployee = (employee: Employee) => {
    setNickname(employee.name)
    setBeneficiaryAddress(employee.walletAddress)
    setDestinationChainSelector(employee.preferredChain)
    setUsdcAmount(employee.monthlySalary.toString())
    setErrorMessage(null)
  }

  return (
    <div className={`min-h-screen pt-20 pb-12 transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`}>
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-48">
        <div className="space-y-4">
          <PageHeader />

          <div className="flex justify-end w-full">
            <div className="flex items-center gap-3">
              <label className={`text-sm font-[Inter] ${isDark ? "text-white/80" : "text-black/80"}`}>Mode:</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "manual" | "airdrop")}
                className={`px-4 py-2 rounded-lg border text-sm font-[Inter] transition-all duration-300 ${
                  isDark
                    ? "bg-black border-white/20 text-white focus:border-white/40"
                    : "bg-white border-black/20 text-black focus:border-black/40"
                }`}
              >
                <option value="manual">Normal Distribution</option>
                <option value="airdrop">Airdrop Distribution</option>
              </select>
            </div>
          </div>

          {mode === "manual" ? (
            <AddBeneficiaryForm
              nickname={nickname}
              setNickname={setNickname}
              beneficiaryAddress={beneficiaryAddress}
              setBeneficiaryAddress={setBeneficiaryAddress}
              usdcAmount={usdcAmount}
              setUsdcAmount={setUsdcAmount}
              destinationChainSelector={destinationChainSelector}
              setDestinationChainSelector={setDestinationChainSelector}
              onAddBeneficiary={handleAddBeneficiary}
              isConnected={isConnected}
              chains={chains}
              chainId={chainId}
              onChainSwitch={handleChainSwitch}
              errorMessage={errorMessage}
              employees={employees}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              onSelectEmployee={handleSelectEmployee}
              loadingEmployees={loadingEmployees}
              onAddAllEmployees={handleAddAllEmployees}
              addingAllEmployees={addingAllEmployees}
            />
          ) : (
            <AirdropUploadForm
              csvFile={csvFile}
              parsedRecipients={parsedRecipients}
              uploadError={uploadError}
              onFileUpload={handleCsvUpload}
              isConnected={isConnected}
            />
          )}

          <BatchSummary
            beneficiaries={listOfBeneficiaries}
            onRemoveBeneficiary={removeBeneficiary}
            onExecuteBatch={handleBatchTransfer}
            loading={loading}
            isConnected={isConnected}
          />

          <BatchTransactionStatus
            loading={loading}
            transactionHash={transactionHash}
            isProcessingReceipt={isProcessingReceipt}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}
