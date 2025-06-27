"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/types/transaction"
import { ExternalLink, Users, User, Clock, CheckCircle, XCircle, BarChart3, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { chainSelectorMapping } from "@/app/constants"

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
}

const getChainLogo = (chain: string) => {
  return chainSelectorMapping[chain].logo
}

export default function TransactionList({ transactions, loading }: TransactionListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="bg-white/5 backdrop-blur-sm border-white/10 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No transactions found</h3>
            <p className="text-sm">Start making transactions to see them here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-600/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-500/30"
    }
  }

  const getExplorerUrl = (hash: string) => {
      return `https://sepolia.etherscan.io/tx/${hash}`
  }

  const getCCIPExplorerUrl = (hash: string) => {
    return `https://ccip.chain.link/tx/${hash}`
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card
          key={transaction._id}
          className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {transaction.type === "one-to-many" ? (
                    <Users className="h-5 w-5 text-blue-400" />
                  ) : (
                    <User className="h-5 w-5 text-green-400" />
                  )}
                  <span className="font-medium text-white font-mono text-sm">
                    {transaction.transactionId.slice(0, 8)}...{transaction.transactionId.slice(-6)}
                  </span>
                </div>
                <Badge variant="outline" className={getStatusColor(transaction.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(transaction.status)}
                    <span className="capitalize">{transaction.status}</span>
                  </div>
                </Badge>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end space-x-2 text-lg font-bold text-white">
                  <img
                    src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
                    alt="USDC"
                    className="w-5 h-5"
                  />
                  <span>
                    {transaction.totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="text-sm text-gray-200">
                  {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-2">From</div>
                <div className="text-white">
                  {transaction.senderName && <div className="font-medium mb-1">{transaction.senderName}</div>}
                  <div className="font-mono text-sm text-gray-300 mb-2">
                    {transaction.senderAddress.slice(0, 6)}...{transaction.senderAddress.slice(-4)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={"https://assets.coingecko.com/coins/images/279/small/ethereum.png"}
                      alt={transaction.sourceChainName}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-gray-200">{transaction.sourceChainName}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">
                  To ({transaction.recipients.length} recipient{transaction.recipients.length > 1 ? "s" : ""})
                </div>
                <div className="space-y-3">
                  {transaction.recipients.slice(0, 2).map((recipient, index) => (
                    <div key={index} className="text-white">
                      {recipient.name && <div className="font-medium text-sm mb-1">{recipient.name}</div>}
                      <div className="font-mono text-sm text-gray-300 mb-1">
                        {recipient.address.slice(0, 6)}...{recipient.address.slice(-4)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={getChainLogo(recipient.chain) || "/placeholder.svg"}
                            alt={recipient.chainName}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-xs text-gray-200">{recipient.chainName}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-green-400 font-medium text-sm">
                          <img
                            src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
                            alt="USDC"
                            className="w-4 h-4"
                          />
                          <span>
                            {recipient.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {transaction.recipients.length > 2 && (
                    <div className="text-sm text-gray-400 italic">
                      +{transaction.recipients.length - 2} more recipients
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center space-x-4 text-sm text-gray-200">
                <span>Type: {transaction.type === "one-to-many" ? "Batch Payment" : "Single Payment"}</span>
              </div>

              {transaction.transactionHash && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30"
                    onClick={() =>
                      window.open(getExplorerUrl(transaction.transactionHash ?? ""), "_blank")
                    }
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Etherscan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 hover:border-blue-400/50"
                    onClick={() => window.open(getCCIPExplorerUrl(transaction.transactionHash ?? ""), "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    CCIP
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
