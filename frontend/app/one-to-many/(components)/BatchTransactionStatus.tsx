"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Loader2, ExternalLink } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface BatchTransactionStatusProps {
  loading: boolean
  transactionHash?: `0x${string}`
  isProcessingReceipt: boolean
}

export default function BatchTransactionStatus({
  loading,
  transactionHash,
  isProcessingReceipt,
}: BatchTransactionStatusProps) {
  const { isDark } = useTheme()

  if (!loading && !transactionHash) {
    return null
  }

  return (
    <Card
      className={`transition-all duration-500 animate-in slide-in-from-bottom-4 ${isDark ? "bg-gradient-to-br from-black to-blue-700/20 border-black backdrop-blur-xl shadow-2xl" : "bg-gradient-to-br from-white to-blue-500/10 border-white backdrop-blur-xl shadow-2xl"}`}
    >
      <CardHeader>
        <CardTitle className={`flex items-center gap-3 text-xl font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
          {isProcessingReceipt ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              Processing Transaction
            </>
          ) : transactionHash ? (
            <>
              <CheckCircle className="w-6 h-6 text-green-500" />
              Batch Transfer Complete
            </>
          ) : (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              Submitting Batch Transfer
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {transactionHash && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}>
                Transaction Hash
              </span>
              <Badge
                variant="outline"
                className={`font-[Inter] ${isDark ? "border-white/20 text-white" : "border-black/20 bg-white text-black"} ${isProcessingReceipt ? "animate-pulse" : ""}`}
              >
                {isProcessingReceipt ? "Confirming..." : "Confirmed"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${isDark ? "border-white/20 hover:border-white/40 hover:bg-white/10 bg-gradient-to-r from-white/5 to-transparent" : "border-black/20 hover:border-black/40 hover:bg-black/10 bg-transparent"}`}
              >
                <div className="flex-1">
                  <p className={`text-sm font-mono font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
                    {`${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}`}
                  </p>
                  <p className={`text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>View on Etherscan</p>
                </div>
                <ExternalLink className="w-5 h-5" />
              </a>

              <a
                href={`https://ccip.chain.link/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${isDark ? "border-white/20 hover:border-white/40 hover:bg-white/10 bg-gradient-to-r from-white/5 to-transparent" : "border-black/20 hover:border-black/40 hover:bg-black/10 bg-transparent"}`}
              >
                <div className="flex-1">
                  <p className={`text-sm font-mono font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
                    {`${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}`}
                  </p>
                  <p className={`text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>View on CCIP Explorer</p>
                </div>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
