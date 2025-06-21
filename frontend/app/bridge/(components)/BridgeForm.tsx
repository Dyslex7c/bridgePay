"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowUpDown, AlertCircle, Loader2, Users, User } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import ChainSelector from "../../(components)/ChainSelector"
import TransactionSummary from "./TransactionSummary"
import type { Chain } from "wagmi/chains"
import type { Employee } from "@/types/employee"

interface BridgeFormProps {
  recipientName: string
  setRecipientName: (name: string) => void
  beneficiaryAddress: string
  setBeneficiaryAddress: (address: string) => void
  usdcAmount: string
  setUsdcAmount: (amount: string) => void
  destinationChainSelector: string
  setDestinationChainSelector: (selector: string) => void
  loading: boolean
  isConnected: boolean
  chains: readonly [Chain, ...Chain[]]
  chainId: number
  onSubmit: () => void
  onChainSwitch: (chainId: number) => void
  errorMessage: string | null
  employees: Employee[]
  employeesLoading: boolean
}

export default function BridgeForm({
  recipientName,
  setRecipientName,
  beneficiaryAddress,
  setBeneficiaryAddress,
  usdcAmount,
  setUsdcAmount,
  destinationChainSelector,
  setDestinationChainSelector,
  loading,
  isConnected,
  chains,
  chainId,
  onSubmit,
  onChainSwitch,
  errorMessage,
  employees,
  employeesLoading,
}: BridgeFormProps) {
  const { isDark } = useTheme()
  const isFormValid = beneficiaryAddress && usdcAmount && destinationChainSelector && isConnected

  const handleEmployeeSelect = (employeeId: string) => {
    if (employeeId === "manual") {
      setRecipientName("")
      setBeneficiaryAddress("")
      setUsdcAmount("")
      setDestinationChainSelector("")
      return
    }

    const employee = employees.find((emp) => emp._id === employeeId)
    if (employee) {
      setRecipientName(employee.name)
      setBeneficiaryAddress(employee.walletAddress)
      setUsdcAmount(employee.monthlySalary.toString())
      setDestinationChainSelector(employee.preferredChain)
    }
  }

  const getEmployeeInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <Card
        className={`transition-all duration-500 ${
          isDark
            ? "bg-gradient-to-br from-black to-blue-700/20 border-black backdrop-blur-xl shadow-2xl"
            : "bg-gradient-to-br from-white to-blue-500/10 border-white backdrop-blur-xl shadow-2xl"
        }`}
      >
        <CardHeader className="pb-6">
          <CardTitle
            className={`flex items-center gap-3 text-2xl font-[Poppins] ${isDark ? "text-white" : "text-black"}`}
          >
            <div className={`p-2 rounded-xl ${isDark ? "bg-blue-500/40" : "bg-blue-300/60"}`}>
              <ArrowUpDown className="w-6 h-6" />
            </div>
            Bridge Configuration
          </CardTitle>
          <CardDescription className={`text-sm font-[Inter] ${isDark ? "text-white/60" : "text-black/60"}`}>
            Configure your cross-chain USDC transfer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <label className={`text-base font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
              Quick Select Employee
            </label>
            <Select onValueChange={handleEmployeeSelect}>
              <SelectTrigger
                className={`h-14 text-lg font-[Inter] transition-all duration-300 ${
                  isDark
                    ? "bg-white/5 border-white/20 text-white focus:border-white/40"
                    : "bg-white border-black/10 text-black focus:border-black/30"
                }`}
              >
                <SelectValue
                  placeholder={employeesLoading ? "Loading employees..." : "Select an employee or enter manually"}
                />
              </SelectTrigger>
              <SelectContent
                className={`${
                  isDark
                    ? "bg-black/95 border-white/20 backdrop-blur-xl"
                    : "bg-white/95 border-black/10 backdrop-blur-xl"
                }`}
              >
                <SelectItem value="manual" className="py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "bg-white/10" : "bg-black/10"}`}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-[Inter]">Manual Entry</span>
                  </div>
                </SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee._id} value={employee._id ?? ""} className="py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? "bg-blue-500/40 text-white" : "bg-blue-300/60 text-black"}`}
                      >
                        {getEmployeeInitials(employee.name)}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-[Inter] font-medium">{employee.name}</span>
                        <span className={`text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>
                          ${employee.monthlySalary} USDC/month
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {employees.length > 0 && (
              <div className={`flex items-center gap-2 text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
                <Users className="w-4 h-4" />
                <span className="font-[Inter]">{employees.length} employees available</span>
              </div>
            )}
          </div>

          <ChainSelector
            chains={chains}
            chainId={chainId}
            destinationChainSelector={destinationChainSelector}
            setDestinationChainSelector={setDestinationChainSelector}
            isConnected={isConnected}
            onChainSwitch={onChainSwitch}
          />

          <div className="space-y-2">
            <label className={`text-base font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
              Recipient Name (Optional)
            </label>
            <Input
              placeholder="Enter recipient name (optional)"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className={`h-14 text-lg font-[Inter] transition-all duration-300 focus:scale-[1.02] ${
                isDark
                  ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  : "bg-white border-black/10 text-black placeholder:text-black/50 focus:border-black/30"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-base font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
              Recipient Address
            </label>
            <Input
              placeholder="0x..."
              value={beneficiaryAddress}
              onChange={(e) => setBeneficiaryAddress(e.target.value)}
              className={`h-14 text-lg font-[Inter] transition-all duration-300 focus:scale-[1.02] ${
                isDark
                  ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  : "bg-white border-black/10 text-black placeholder:text-black/50 focus:border-black/30"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-base font-[Inter] ${isDark ? "text-white" : "text-black"}`}>Amount</label>
            <div className="relative">
              <Input
                placeholder="0.00"
                type="number"
                value={usdcAmount}
                onChange={(e) => setUsdcAmount(e.target.value)}
                className={`h-14 text-lg font-[Inter] pr-20 transition-all duration-300 focus:scale-[1.02] ${
                  isDark
                    ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    : "bg-white border-black/10 text-black placeholder:text-black/50 focus:border-black/30"
                }`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <img
                  src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
                  alt="USDC"
                  className="w-6 h-6"
                />
                <span className={`text-lg font-semibold font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}>
                  USDC
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={onSubmit}
            disabled={!isFormValid || loading}
            className={`w-full h-16 text-lg font-[Poppins] transition-all duration-300 hover:scale-[1.02] ${
              isDark
                ? "bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white disabled:from-white/20 disabled:to-white/20 disabled:text-white/50"
                : "bg-gradient-to-r from-black to-gray-900 text-white hover:from-gray-900 hover:to-black disabled:from-black/20 disabled:to-black/20 disabled:text-black/50"
            } shadow-xl`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Processing Transaction...
              </>
            ) : (
              <>
                Bridge USDC
                <ArrowRight className="w-5 h-5 ml-3" />
              </>
            )}
          </Button>

          {!isConnected && (
            <Alert
              className={`${isDark ? "border-yellow-500/20 bg-yellow-500/10" : "border-yellow-600/20 bg-yellow-600/10"}`}
            >
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <AlertDescription className={`font-[Inter] ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>
                Please connect your wallet to continue with the bridge transaction
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {errorMessage && (
        <Alert className={`${isDark ? "border-red-500/20 bg-red-500/10" : "border-red-600/20 bg-red-600/10"}`}>
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className={`font-[Inter] font-medium pt-1 ${isDark ? "text-red-500" : "text-red-600"}`}>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      <TransactionSummary
        recipientName={recipientName}
        beneficiaryAddress={beneficiaryAddress}
        usdcAmount={usdcAmount}
        destinationChainSelector={destinationChainSelector}
      />
    </>
  )
}
