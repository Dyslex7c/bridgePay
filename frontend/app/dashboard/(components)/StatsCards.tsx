"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TransactionStats } from "@/types/transaction"
import { TrendingUp, DollarSign, CheckCircle, Clock, XCircle, Fuel, BarChart3, Globe } from "lucide-react"

interface StatsCardsProps {
  stats: TransactionStats | null
  loading: boolean
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const successRate =
    stats.totalTransactions > 0 ? ((stats.successfulTransactions / stats.totalTransactions) * 100).toFixed(1) : "0"

  const statsData = [
    {
      title: "Total Transactions",
      value: stats.totalTransactions.toLocaleString(),
      icon: BarChart3,
      gradient: "from-blue-600/20 to-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      title: "Total Volume",
      value: `$${stats.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: "from-green-600/20 to-green-500/10",
      iconColor: "text-green-400",
    },
    {
      title: "Successful",
      value: stats.successfulTransactions.toLocaleString(),
      icon: CheckCircle,
      gradient: "from-emerald-600/20 to-emerald-500/10",
      iconColor: "text-emerald-400",
      subtitle: `${successRate}% success rate`,
    },
    {
      title: "Pending",
      value: stats.pendingTransactions.toLocaleString(),
      icon: Clock,
      gradient: "from-yellow-600/20 to-yellow-500/10",
      iconColor: "text-yellow-400",
    },
    {
      title: "Failed",
      value: stats.failedTransactions.toLocaleString(),
      icon: XCircle,
      gradient: "from-red-600/20 to-red-500/10",
      iconColor: "text-red-400",
    },
    {
      title: "Gas Fees",
      value: `$${stats.totalGasFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Fuel,
      gradient: "from-purple-600/20 to-purple-500/10",
      iconColor: "text-purple-400",
    },
    {
      title: "Avg Transaction",
      value: `$${stats.averageTransactionSize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      gradient: "from-indigo-600/20 to-indigo-500/10",
      iconColor: "text-indigo-400",
    },
    {
      title: "Most Used Chain",
      value: stats.mostUsedChain,
      icon: Globe,
      gradient: "from-cyan-600/20 to-cyan-500/10",
      iconColor: "text-cyan-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${stat.gradient} border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            {stat.subtitle && <p className="text-xs text-gray-400">{stat.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
