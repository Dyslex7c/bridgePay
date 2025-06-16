"use client"

import * as React from "react"
import { useTheme } from "./theme-provider"

export default function BlockchainMarquee() {
  const { isDark } = useTheme()
  const [blockchains] = React.useState([
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

  const BlockchainItem = React.useCallback(
    ({ blockchain }: { blockchain: (typeof blockchains)[0] }) => (
      <div className="flex items-center space-x-4 mx-8 flex-shrink-0 group transition-colors duration-300">
        <div className="w-20 h-20 flex items-center justify-center transition-colors duration-300">
          <img
            src={blockchain.logo || "/placeholder.svg"}
            alt={blockchain.name}
            className="w-16 h-16 transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <span
          className={`text-xl transition-colors duration-300 ${
            isDark ? "text-gray-300" : "text-gray-700"
          } ${blockchain.fontStyle} group-hover:text-[var(--hoverColor)]`}
          style={{ "--hoverColor": blockchain.hoverColor } as React.CSSProperties}
        >
          {blockchain.name}
        </span>
      </div>
    ),
    [isDark],
  )

  return (
    <section className={`py-16 transition-colors ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="w-3/4 mx-auto relative overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 w-48 z-10 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)"
              : "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 20%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0) 100%)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        />

        <div
          className="absolute right-0 top-0 bottom-0 w-48 z-10 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)"
              : "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 20%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0) 100%)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />

        <div className="marquee-container">
          <div className="marquee-track">
            <div className="marquee-content">
              {blockchains.map((blockchain, index) => (
                <BlockchainItem key={`set1-${index}`} blockchain={blockchain} />
              ))}
            </div>

            <div className="marquee-content">
              {blockchains.map((blockchain, index) => (
                <BlockchainItem key={`set2-${index}`} blockchain={blockchain} />
              ))}
            </div>

            <div className="marquee-content">
              {blockchains.map((blockchain, index) => (
                <BlockchainItem key={`set3-${index}`} blockchain={blockchain} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        .marquee-track {
          display: flex;
          width: fit-content;
          animation: marquee-scroll 40s linear infinite;
        }
        
        .marquee-content {
          display: flex;
          flex-shrink: 0;
        }
        
        .marquee-track:hover {
          animation-play-state: paused;
        }
        
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
      `}</style>
    </section>
  )
}
