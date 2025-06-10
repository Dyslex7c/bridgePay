"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Loader2, ExternalLink } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface TransactionStatusProps {
  loading: boolean
  transactionHash?: `0x${string}`
  messageId?: `0x${string}`
  isProcessingReceipt: boolean
}

export default function TransactionStatus({
  transactionHash,
  messageId,
  isProcessingReceipt,
}: TransactionStatusProps) {
  const { isDark } = useTheme()

  return (
    <Card
      className={`transition-all duration-500 animate-in slide-in-from-bottom-4 ${
        isDark
          ? "bg-gradient-to-br from-black to-blue-700/20 border-black backdrop-blur-xl shadow-2xl"
          : "bg-gradient-to-br from-white to-blue-500/10 border-white backdrop-blur-xl shadow-2xl"
      }`}
    >
      <CardHeader>
        <CardTitle className={`flex items-center gap-3 text-xl font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
          {isProcessingReceipt ? (
            <>
              <Clock className="w-6 h-6 animate-pulse text-orange-500" />
              Processing Transaction
            </>
          ) : transactionHash ? (
            <>
              <CheckCircle className="w-6 h-6 text-green-500" />
              Transaction Complete
            </>
          ) : (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              Submitting Transaction
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {transactionHash && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}>
                Transaction Hash
              </span>
              <Badge
                variant="outline"
                className={`font-[Inter] ${
                  isDark ? "border-white/20 text-white" : "border-black/20 bg-white text-black"
                } ${isProcessingReceipt ? "animate-pulse" : ""}`}
              >
                {isProcessingReceipt ? "Confirming..." : "Confirmed"}
              </Badge>
            </div>

            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                isDark
                  ? "border-white/20 hover:border-white/40 hover:bg-white/10 bg-gradient-to-r from-white/5 to-transparent"
                  : "border-black/20 hover:border-black/40 hover:bg-black/10 bg-transparent"
              }`}
            >
              <span className={`text-sm font-mono font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
                {`${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}`}
              </span>
              <div className="ml-auto flex flex-row space-x-2">
                <span className="text-sm font-mono">View on Etherscan</span>
                <ExternalLink className="w-5 h-5" />
              </div>
            </a>

            {messageId && (
              <div className="space-y-2">
                <span className={`text-sm font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}>
                  CCIP Message ID
                </span>
                <a
                  href={`https://ccip.chain.link/msg/${messageId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                    isDark
                      ? "border-white/20 hover:border-white/40 hover:bg-white/10 bg-gradient-to-r from-white/5 to-transparent"
                      : "border-black/20 hover:border-black/40 hover:bg-black/10 bg-transparent"
                  }`}
                >
                  <span className={`text-sm font-mono font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
                    {`${messageId.slice(0, 10)}...${messageId.slice(-8)}`}
                  </span>
                  <div className="ml-auto flex flex-row space-x-2">
                    <span className="text-sm font-mono">View on CCIP Explorer</span>
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
