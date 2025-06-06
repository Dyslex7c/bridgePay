"use client"

import * as React from "react"
import { useTheme } from "./theme-provider"

export default function BlockchainMarquee() {
  return <MarqueeContent />
}

function MarqueeContent() {
  const { isDark } = useTheme()
  const [blockchains, setBlockchains] = React.useState([
    {
      name: "Ethereum",
      logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      fontStyle: "font-[Inter] font-bold",
      hoverColor: "#627EEA",
    },
    {
      name: "Arbitrum",
      logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
      fontStyle: "font-[Inter] font-bold",
      hoverColor: "#28A0F0",
    },
    {
      name: "Optimism",
      logo: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
      fontStyle: "font-[Inter] font-bold",
      hoverColor: "#FF0420",
    },
    {
      name: "Avalanche",
      logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
      fontStyle: "font-[Poppins] font-bold",
      hoverColor: "#E84142",
    },
    {
      name: "Base",
      logo: "https://raw.githubusercontent.com/base/brand-kit/main/logo/symbol/Base_Symbol_Blue.png",
      fontStyle: "font-[Inter] font-bold",
      hoverColor: "#0052FF",
    },
  ])

  return (
    <section className={`py-16 overflow-hidden transition-colors ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...blockchains, ...blockchains, ...blockchains].map((blockchain, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 mx-8 flex-shrink-0 group transition-colors duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center transition-colors duration-300">
                <img
                  src={blockchain.logo || "/placeholder.svg"}
                  alt={blockchain.name}
                  className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span
                className={`text-xl transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"} ${blockchain.fontStyle} group-hover:text-[var(--hoverColor)]`}
                style={{ "--hoverColor": blockchain.hoverColor } as React.CSSProperties}
              >
                {blockchain.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
