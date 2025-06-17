"use client"

import { useState, useEffect, useCallback } from "react"
import type { Transaction, TransactionStats } from "@/types/transaction"
import StatsCards from "./(components)/StatsCards"
import TransactionFilters from "./(components)/TransactionFilters"
import TransactionList from "./(components)/TransactionList"
import Pagination from "./(components)/Pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<TransactionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(typeFilter !== "all" && { type: typeFilter }),
        ...(search && { search }),
      })

      const response = await fetch(`/api/transactions?${params}`)
      if (!response.ok) throw new Error("Failed to fetch transactions")

      const data = await response.json()
      setTransactions(data.transactions)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, limit, statusFilter, typeFilter, search])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const response = await fetch("/api/transactions/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setStats(null)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, typeFilter])

  const handleRefresh = () => {
    fetchTransactions()
    fetchStats()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold font-[Inter] bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Transaction Dashboard
            </h1>
          </div>
          <p className="text-sm text-gray-200">Monitor and analyze all your cross-chain transactions in one place</p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} loading={statsLoading} />

        {/* Transactions Section */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
              <span>Transaction History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <TransactionFilters
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              onRefresh={handleRefresh}
              loading={loading}
            />

            {/* Transaction List */}
            <TransactionList transactions={transactions} loading={loading} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
