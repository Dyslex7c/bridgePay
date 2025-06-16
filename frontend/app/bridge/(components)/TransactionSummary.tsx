"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"
import { destinationChains } from "@/app/constants"

interface TransactionSummaryProps {
  recipientName: string
  beneficiaryAddress: string
  usdcAmount: string
  destinationChainSelector: string
}

export default function TransactionSummary({
  recipientName,
  beneficiaryAddress,
  usdcAmount,
  destinationChainSelector,
}: TransactionSummaryProps) {
  const { isDark } = useTheme()

  const getDestinationChainName = () => {
    return destinationChains.find((chain) => chain.selector === destinationChainSelector)?.name || ""
  }

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

  return (
    <Card
      className={`transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-black to-blue-700/20 border-black backdrop-blur-xl shadow-2xl"
          : "bg-gradient-to-br from-white to-blue-500/10 border-white backdrop-blur-xl shadow-2xl"
      }`}
    >
      <CardHeader>
        <CardTitle className={`text-xl font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
          Transaction Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recipientName && (
          <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-transparent to-white/5">
            <span className={`text-sm font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}>Recipient Name</span>
            <span className={`text-sm font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
              {recipientName}
            </span>
          </div>
        )}
        {beneficiaryAddress && (
          <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-transparent to-white/5">
            <span className={`text-sm font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}>Recipient</span>
            <span className={`text-sm font-mono ${isDark ? "text-white" : "text-black"}`}>
              {`${beneficiaryAddress.slice(0, 6)}...${beneficiaryAddress.slice(-4)}`}
            </span>
          </div>
        )}

        {usdcAmount && (
          <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-transparent to-white/5">
            <span className={`text-sm font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}>Amount</span>
            <div className="flex items-center gap-3">
              <span className={`text-base font-[Poppins] ${isDark ? "text-white" : "text-black"}`}>
                {usdcAmount} USDC
              </span>
              <img
                src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
                alt="USDC"
                className="w-6 h-6"
              />
            </div>
          </div>
        )}

        {destinationChainSelector && (
          <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-transparent to-white/5">
            <span className={`text-sm font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}>Destination</span>
            <div className="flex items-center gap-3">
              <img
                src={getChainLogo(getDestinationChainName()) || "/placeholder.svg"}
                alt={getDestinationChainName()}
                className="w-6 h-6"
              />
              <span className={`text-base font-semibold font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
                {getDestinationChainName()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
