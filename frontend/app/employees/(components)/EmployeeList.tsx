"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Users, Wallet, DollarSign, ExternalLink } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { chainSelectorMapping } from "../../constants"
import type { Employee } from "@/types/employee"

interface EmployeeListProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  loading: boolean
}

export default function EmployeeList({ employees, onEdit, onDelete, loading }: EmployeeListProps) {
  const { isDark } = useTheme()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getChainLogo = (chainSelector: string) => {
    const chainInfo = chainSelectorMapping[chainSelector]
    return chainInfo?.logo || "/placeholder.svg"
  }

  const getChainName = (chainSelector: string) => {
    const chainInfo = chainSelectorMapping[chainSelector]
    return chainInfo?.name || "Unknown Chain"
  }

  const handleDelete = async (employee: Employee) => {
    if (!employee._id) return

    setDeletingId(employee._id)
    try {
      await onDelete(employee)
    } finally {
      setDeletingId(null)
    }
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className={`transition-all duration-500 animate-pulse ${
              isDark
                ? "bg-gradient-to-br from-black to-blue-700/20 border-black backdrop-blur-xl"
                : "bg-gradient-to-br from-white to-blue-500/10 border-white backdrop-blur-xl"
            }`}
          >
            <CardHeader className="pb-4">
              <div className={`h-6 rounded ${isDark ? "bg-white/10" : "bg-black/10"}`} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`h-4 rounded ${isDark ? "bg-white/10" : "bg-black/10"}`} />
              <div className={`h-4 rounded w-3/4 ${isDark ? "bg-white/10" : "bg-black/10"}`} />
              <div className={`h-4 rounded w-1/2 ${isDark ? "bg-white/10" : "bg-black/10"}`} />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <Card
        className={`transition-all duration-500 ${
          isDark
            ? "bg-gradient-to-br from-black to-blue-700/20 border-black backdrop-blur-xl shadow-2xl"
            : "bg-gradient-to-br from-white to-blue-500/10 border-white backdrop-blur-xl shadow-2xl"
        }`}
      >
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className={`p-4 rounded-full mb-4 ${isDark ? "bg-white/10" : "bg-black/10"}`}>
            <Users className={`w-12 h-12 ${isDark ? "text-white/50" : "text-black/50"}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-black"}`}>No employees found</h3>
          <p className={`text-center ${isDark ? "text-white/60" : "text-black/60"}`}>
            Get started by adding your first employee to the system.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map((employee, index) => (
        <Card
          key={employee._id}
          className={`transition-all duration-500 hover:scale-[1.02] group ${
            isDark
              ? "bg-gradient-to-br from-black to-blue-700/20 border-black backdrop-blur-xl shadow-2xl hover:shadow-3xl"
              : "bg-gradient-to-br from-white to-blue-500/10 border-white backdrop-blur-xl shadow-2xl hover:shadow-3xl"
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="pb-4">
            <CardTitle
              className={`flex items-center justify-between text-lg font-[Poppins] ${isDark ? "text-white" : "text-black"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDark ? "bg-blue-500/40" : "bg-blue-300/60"}`}>
                  <Users className="w-5 h-5" />
                </div>
                <span className="truncate">{employee.name}</span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(employee)}
                  className={`h-8 w-8 p-0 ${
                    isDark
                      ? "hover:bg-white/10 text-white/70 hover:text-white"
                      : "hover:bg-black/10 text-black/70 hover:text-black"
                  }`}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(employee)}
                  disabled={deletingId === employee._id}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-500/10"
                >
                  {deletingId === employee._id ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Wallet className={`w-4 h-4 ${isDark ? "text-white/60" : "text-black/60"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-mono ${isDark ? "text-white" : "text-black"} truncate`}>
                      {`${employee.walletAddress.slice(0, 6)}...${employee.walletAddress.slice(-4)}`}
                    </p>
                    <a
                      href={`https://sepolia.etherscan.io/address/${employee.walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
                <div>
                  <p className={`text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>Monthly Salary</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}>
                      {formatSalary(employee.monthlySalary)} USDC
                    </p>
                    <img
                      src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
                      alt="USDC"
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={getChainLogo(employee.preferredChain) || "/placeholder.svg"}
                    alt={getChainName(employee.preferredChain)}
                    className="w-6 h-6 rounded-full"
                  />
                  <div>
                    <p className={`text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>Preferred Chain</p>
                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>
                      {getChainName(employee.preferredChain)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    isDark
                      ? "border-green-500/20 text-green-400 bg-green-500/10"
                      : "border-green-600/20 text-green-600 bg-green-600/10"
                  }`}
                >
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
