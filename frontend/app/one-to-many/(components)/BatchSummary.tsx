"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, DollarSign, Link, Trash2, ArrowRight, Loader2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { chainSelectorMapping } from "../../constants"

type Beneficiary = {
  nickname: string
  destinationChainSelector: string
  beneficiaryAddress: string
  usdcAmount: string
}

interface BatchSummaryProps {
  beneficiaries: Beneficiary[]
  onRemoveBeneficiary: (index: number) => void
  onExecuteBatch: () => void
  loading: boolean
  isConnected: boolean
}

export default function BatchSummary({
  beneficiaries,
  onRemoveBeneficiary,
  onExecuteBatch,
  loading,
  isConnected,
}: BatchSummaryProps) {
  const { isDark } = useTheme()

  const totalUSDCAmount = beneficiaries.reduce((sum, beneficiary) => sum + Number(beneficiary.usdcAmount), 0)

  const getChainLogo = (chainName: string) => {
    const logos: Record<string, string> = {
      Ethereum: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      Arbitrum: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
      Optimism: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
      Avalanche: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
      Base: "https://raw.githubusercontent.com/base/brand-kit/main/logo/symbol/Base_Symbol_Blue.png",
    }
    return logos[chainName] || "/placeholder.svg"
  }

  if (beneficiaries.length === 0) {
    return null
  }

  return (
    <Card
      className={`transition-all duration-500 animate-in slide-in-from-bottom-4 ${isDark ? "bg-gradient-to-br from-black to-blue-700/20 border-black backdrop-blur-xl shadow-2xl" : "bg-gradient-to-br from-white to-blue-500/10 border-white backdrop-blur-xl shadow-2xl"}`}
    >
      <CardHeader className="pb-6">
        <CardTitle
          className={`flex items-center gap-3 text-2xl font-[Poppins] ${isDark ? "text-white" : "text-black"}`}
        >
          <div className={`p-2 rounded-xl ${isDark ? "bg-green-400/80" : "bg-green-300/60"}`}>
            <Users className="w-6 h-6" />
          </div>
          Batch Summary
        </CardTitle>
        <CardDescription className={`text-sm font-[Inter] ${isDark ? "text-white/60" : "text-black/60"}`}>
          Review your batch payment details before execution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 border transition-all duration-300 ${isDark ? "border-white/10 bg-blue-400/5" : "border-black/10 bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              <div>
                <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>Recipients</p>
                <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>{beneficiaries.length}</p>
              </div>
            </div>
          </div>
          <div
            className={`p-4 border transition-all duration-300 ${isDark ? "border-white/10 bg-blue-400/5" : "border-black/10 bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <DollarSign className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
              <div>
                <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>Total Amount</p>
                <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                  {totalUSDCAmount.toFixed(2)} USDC
                </p>
              </div>
            </div>
          </div>
          <div
            className={`p-4 border transition-all duration-300 ${isDark ? "border-white/10 bg-blue-400/5" : "border-black/10 bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <Link className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              <div>
                <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>Unique Chains</p>
                <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                  {new Set(beneficiaries.map((b) => b.destinationChainSelector)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className={isDark ? "bg-white/10" : "bg-black/10"} />

        <div className="space-y-4">
          {beneficiaries.map((beneficiary, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${isDark ? "border-white/10 bg-black hover:bg-white/10" : "border-black/10 bg-white hover:bg-green-300/30"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={getChainLogo(
                        chainSelectorMapping[beneficiary.destinationChainSelector]?.name || "Unknown Chain",
                      )}
                      alt={chainSelectorMapping[beneficiary.destinationChainSelector]?.name || "Unknown Chain"}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{beneficiary.nickname}</p>
                      <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
                        {`${beneficiary.beneficiaryAddress.slice(0, 6)}...${beneficiary.beneficiaryAddress.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto mr-4">
                    <Badge
                      variant="outline"
                      className={`${isDark ? "border-white/20 text-white" : "border-black/20 text-black"}`}
                    >
                      {chainSelectorMapping[beneficiary.destinationChainSelector]?.name || "Unknown Chain"}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <img
                        src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
                        alt="USDC"
                        className="w-5 h-5"
                      />
                      <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                        {beneficiary.usdcAmount} USDC
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveBeneficiary(idx)}
                  className={`text-red-500 hover:text-red-700 hover:bg-red-500/10 ${isDark ? "hover:bg-red-500/20" : ""}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={onExecuteBatch}
          disabled={loading || !isConnected || beneficiaries.length === 0}
          className={`w-full h-16 text-lg font-[Poppins] transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white disabled:from-white/20 disabled:to-white/20 disabled:text-white/50" : "bg-gradient-to-r from-black to-gray-900 text-white hover:from-gray-900 hover:to-black disabled:from-black/20 disabled:to-black/20 disabled:text-black/50"} shadow-xl`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Processing Batch Transfer...
            </>
          ) : (
            <>
              Execute Batch Transfer ({beneficiaries.length} transfers)
              <ArrowRight className="w-5 h-5 ml-3" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
