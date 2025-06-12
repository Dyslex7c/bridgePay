"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { destinationChains } from "@/app/constants"
import type { Chain } from "wagmi/chains"

interface ChainSelectorProps {
  chains: readonly [Chain, ...Chain[]]
  chainId: number
  destinationChainSelector: string
  setDestinationChainSelector: (selector: string) => void
  isConnected: boolean
  onChainSwitch: (chainId: number) => void
}

export default function ChainSelector({
  chains,
  chainId,
  destinationChainSelector,
  setDestinationChainSelector,
  isConnected,
  onChainSwitch,
}: ChainSelectorProps) {
  const { isDark } = useTheme()
  const [sourceChainModalOpen, setSourceChainModalOpen] = useState(false)
  const [destChainModalOpen, setDestChainModalOpen] = useState(false)

  // Map testnet chain IDs to mainnet names and logos
  const chainMapping = {
    11155111: { name: "Ethereum", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
    421614: {
      name: "Arbitrum",
      logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
    },
    11155420: { name: "Optimism", logo: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png" },
    43113: {
      name: "Avalanche",
      logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
    },
    84532: {
      name: "Base",
      logo: "https://raw.githubusercontent.com/base/brand-kit/main/logo/symbol/Base_Symbol_Blue.png",
    },
  }

  const getCurrentChain = () => {
    const chain = chains.find((chain) => chain.id === chainId)
    if (chain && chainMapping[chain.id as keyof typeof chainMapping]) {
      return {
        ...chain,
        name: chainMapping[chain.id as keyof typeof chainMapping].name,
        logo: chainMapping[chain.id as keyof typeof chainMapping].logo,
      }
    }
    return chain
  }

  const getDestinationChainName = () => {
    return destinationChains.find((chain) => chain.selector === destinationChainSelector)?.name || "Select destination"
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

  const handleChainSwitch = async (targetChainId: number) => {
    try {
      await onChainSwitch(targetChainId)
      setSourceChainModalOpen(false)
    } catch (err) {
      console.error("Failed to switch chain:", err)
    }
  }

  return (
    <div className="flex flex-row space-x-4 w-full">
      {isConnected && (
        <div className="space-y-4 flex-1">
          <Dialog open={sourceChainModalOpen} onOpenChange={setSourceChainModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className={`w-full h-16 justify-between text-left font-[Inter] transition-all duration-300 hover:scale-[1.02] ${
                  isDark
                    ? "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                    : "bg-black/5 border-black/20 text-black hover:bg-black/10 hover:border-black/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  {getCurrentChain() && (
                    <img
                      src={getChainLogo(getCurrentChain()?.name || "")}
                      alt={getCurrentChain()?.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-lg">{getCurrentChain()?.name || "Select Chain"}</div>
                    <div className={`text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>Source Network</div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`max-w-md modal-content-animate ${
                isDark ? "bg-black/95 border-white/20" : "bg-white/95 border-black/20"
              } backdrop-blur-xl`}
            >
              <DialogHeader className="modal-header-animate">
                <DialogTitle className={`text-xl font-[Poppins] ${isDark ? "text-white" : "text-black"}`}>
                  Select Source Chain
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {chains.map((chain, index) => {
                  const mappedChain = chainMapping[chain.id as keyof typeof chainMapping]
                  return (
                    <div
                      key={chain.id}
                      className="chain-item-animate"
                      style={{ animationDelay: `${index * 100 + 200}ms` }}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => handleChainSwitch(chain.id)}
                        className={`w-full h-16 justify-start gap-4 font-[Inter] transition-all duration-300 hover:scale-[1.02] ${
                          chainId === chain.id
                            ? isDark
                              ? "bg-white/20 border border-white/30"
                              : "bg-black/20 border border-black/30"
                            : isDark
                              ? "hover:bg-white/10"
                              : "hover:bg-black/10"
                        }`}
                      >
                        <img
                          src={mappedChain?.logo || "/placeholder.svg"}
                          alt={mappedChain?.name || chain.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="text-left">
                          <div className="font-semibold text-lg">{mappedChain?.name || chain.name}</div>
                          <div className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
                            {chainId === chain.id ? "Currently selected" : "Available"}
                          </div>
                        </div>
                      </Button>
                    </div>
                  )
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="space-y-4 flex-1">
        <Dialog open={destChainModalOpen} onOpenChange={setDestChainModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={`w-full h-16 justify-between text-left font-[Inter] transition-all duration-300 hover:scale-[1.02] ${
                isDark
                  ? "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                  : "bg-black/5 border-black/20 text-black hover:bg-black/10 hover:border-black/40"
              }`}
            >
              <div className="flex items-center gap-4">
                {destinationChainSelector && (
                  <img
                    src={getChainLogo(getDestinationChainName()) || "/placeholder.svg"}
                    alt={getDestinationChainName()}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="text-left">
                  <div className="font-semibold text-lg">{getDestinationChainName()}</div>
                  <div className={`text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>Destination Network</div>
                </div>
              </div>
              <ChevronDown className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`max-w-md modal-content-animate ${
              isDark ? "bg-black/95 border-white/20" : "bg-white/95 border-black/20"
            } backdrop-blur-xl`}
          >
            <DialogHeader className="modal-header-animate">
              <DialogTitle className={`text-xl font-[Poppins] ${isDark ? "text-white" : "text-black"}`}>
                Select Destination Chain
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {destinationChains.map((chain, index) => (
                <div
                  key={chain.selector}
                  className="chain-item-animate"
                  style={{ animationDelay: `${index * 100 + 200}ms` }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setDestinationChainSelector(chain.selector)
                      setDestChainModalOpen(false)
                    }}
                    className={`w-full h-16 justify-start gap-4 font-[Inter] transition-all duration-300 hover:scale-[1.02] ${
                      destinationChainSelector === chain.selector
                        ? isDark
                          ? "bg-white/20 border border-white/30"
                          : "bg-black/20 border border-black/30"
                        : isDark
                          ? "hover:bg-white/10"
                          : "hover:bg-black/10"
                    }`}
                  >
                    <img
                      src={getChainLogo(chain.name) || "/placeholder.svg"}
                      alt={chain.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-lg">{chain.name}</div>
                      <div className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
                        {destinationChainSelector === chain.selector ? "Currently selected" : "Available"}
                      </div>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
