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
import { batchContractAddress, batcherAbi } from "../constants"
import type { Employee } from "@/types/employee"

type Beneficiary = {
  nickname: string
  destinationChainSelector: string
  beneficiaryAddress: string
  usdcAmount: string
}

export default function OneToMany() {
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
  const { isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

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

      const employeeBeneficiaries: Beneficiary[] = employees.map((employee) => ({
        nickname: employee.name,
        beneficiaryAddress: employee.walletAddress,
        destinationChainSelector: employee.preferredChain,
        usdcAmount: employee.monthlySalary.toString(),
      }))

      const existingAddresses = new Set(listOfBeneficiaries.map((b) => b.beneficiaryAddress.toLowerCase()))
      const newBeneficiaries = employeeBeneficiaries.filter(
        (emp) => !existingAddresses.has(emp.beneficiaryAddress.toLowerCase()),
      )

      if (newBeneficiaries.length === 0) {
        setErrorMessage("All employees are already added to the batch")
        return
      }

      setListOfBeneficiaries((prev) => [...prev, ...newBeneficiaries])

      const addedCount = newBeneficiaries.length
      const skippedCount = employees.length - addedCount

      if (skippedCount > 0) {
        setErrorMessage(`Added ${addedCount} employees. ${skippedCount} were already in the batch.`)
      }

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

      if (publicClient) {
        try {
          await publicClient.waitForTransactionReceipt({ hash: TxHash })
        } catch (receiptError) {
          console.error("Error waiting for transaction receipt:", receiptError)
        } finally {
          setIsProcessingReceipt(false)
        }
      }
    } catch (err) {
      console.error("Batch transfer failed:", err)
      setErrorMessage("Batch transfer failed. Please try again.")
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
        <div className="space-y-8">
          <PageHeader />

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
