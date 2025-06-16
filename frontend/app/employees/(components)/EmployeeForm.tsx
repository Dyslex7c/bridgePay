"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, User, Wallet, DollarSign } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import ChainSelector from "../../(components)/ChainSelector"
import type { Employee, CreateEmployeeRequest } from "@/types/employee"
import type { Chain } from "wagmi/chains"

interface EmployeeFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (employee: CreateEmployeeRequest) => Promise<void>
  employee?: Employee | null
  chains: readonly [Chain, ...Chain[]]
  chainId: number
  onChainSwitch: (chainId: number) => void
  isConnected: boolean
}

export default function EmployeeForm({
  isOpen,
  onClose,
  onSubmit,
  employee,
  chains,
  chainId,
  onChainSwitch,
  isConnected,
}: EmployeeFormProps) {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    name: "",
    walletAddress: "",
    preferredChain: "",
    monthlySalary: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        walletAddress: employee.walletAddress,
        preferredChain: employee.preferredChain,
        monthlySalary: employee.monthlySalary.toString(),
      })
    } else {
      setFormData({
        name: "",
        walletAddress: "",
        preferredChain: "",
        monthlySalary: "",
      })
    }
    setError(null)
  }, [employee, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required")
      return
    }

    if (!formData.walletAddress.trim()) {
      setError("Wallet address is required")
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress)) {
      setError("Invalid wallet address format")
      return
    }

    if (!formData.preferredChain) {
      setError("Please select a preferred chain")
      return
    }

    if (!formData.monthlySalary || Number(formData.monthlySalary) <= 0) {
      setError("Monthly salary must be greater than 0")
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name: formData.name.trim(),
        walletAddress: formData.walletAddress.trim(),
        preferredChain: formData.preferredChain,
        monthlySalary: Number(formData.monthlySalary),
      })
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to save employee")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-2xl modal-content-animate ${
          isDark ? "bg-black/95 border-white/20" : "bg-white/95 border-black/20"
        } backdrop-blur-xl`}
      >
        <DialogHeader className="modal-header-animate">
          <DialogTitle
            className={`text-2xl font-[Poppins] flex items-center gap-3 ${isDark ? "text-white" : "text-black"}`}
          >
            <div className={`p-2 rounded-xl ${isDark ? "bg-blue-500/40" : "bg-blue-300/60"}`}>
              <User className="w-6 h-6" />
            </div>
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={`text-sm font-[Inter] ${isDark ? "text-white" : "text-black"}`}>Employee Name</Label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/50" : "text-black/50"}`}
                />
                <Input
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`h-14 text-lg font-[Inter] pl-12 transition-all duration-300 focus:scale-[1.02] ${
                    isDark
                      ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                      : "bg-white border-black/10 text-black placeholder:text-black/50 focus:border-black/30"
                  }`}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className={`text-sm font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
                Monthly Salary (USDC)
              </Label>
              <div className="relative">
                <DollarSign
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/50" : "text-black/50"}`}
                />
                <Input
                  type="number"
                  placeholder="5000"
                  value={formData.monthlySalary}
                  onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                  className={`h-14 text-lg font-[Inter] pl-12 pr-20 transition-all duration-300 focus:scale-[1.02] ${
                    isDark
                      ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                      : "bg-white border-black/10 text-black placeholder:text-black/50 focus:border-black/30"
                  }`}
                  disabled={loading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
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
          </div>

          <div className="space-y-2">
            <Label className={`text-sm font-[Inter] ${isDark ? "text-white" : "text-black"}`}>Wallet Address</Label>
            <div className="relative">
              <Wallet
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/50" : "text-black/50"}`}
              />
              <Input
                placeholder="0x..."
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                className={`h-14 text-lg font-[Inter] pl-12 transition-all duration-300 focus:scale-[1.02] ${
                  isDark
                    ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    : "bg-white border-black/10 text-black placeholder:text-black/50 focus:border-black/30"
                }`}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className={`text-sm font-[Inter] ${isDark ? "text-white" : "text-black"}`}>Preferred Chain</Label>
            <ChainSelector
              chains={chains}
              chainId={chainId}
              destinationChainSelector={formData.preferredChain}
              setDestinationChainSelector={(selector) => setFormData({ ...formData, preferredChain: selector })}
              isConnected={isConnected}
              onChainSwitch={onChainSwitch}
            />
          </div>

          {error && (
            <Alert className={`${isDark ? "border-red-500/20 bg-red-500/10" : "border-red-600/20 bg-red-600/10"}`}>
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className={`font-[Inter] font-medium ${isDark ? "text-red-500" : "text-red-600"}`}>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className={`flex-1 h-14 text-lg font-[Poppins] transition-all duration-300 ${
                isDark ? "border-white/20 text-white hover:bg-white/10" : "border-black/20 text-black hover:bg-black/10"
              }`}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`flex-1 h-14 text-lg font-[Poppins] transition-all duration-300 hover:scale-[1.02] ${
                isDark
                  ? "bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white disabled:from-white/20 disabled:to-white/20 disabled:text-white/50"
                  : "bg-gradient-to-r from-black to-gray-900 text-white hover:from-gray-900 hover:to-black disabled:from-black/20 disabled:to-black/20 disabled:text-black/50"
              } shadow-xl`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  {employee ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{employee ? "Update Employee" : "Create Employee"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
