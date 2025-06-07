"use client"

import CTAButton from "./cta-button"
import { useTheme } from "./theme-provider"
import { useEffect, useState } from "react"

export default function Hero() {
  const { isDark } = useTheme()

  return (
    <section
      className={`
        min-h-screen flex items-center pt-16 transition-colors duration-300
        ${isDark ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div
                className={`
                  inline-block px-4 py-2 border rounded-full text-sm font-medium transition-colors duration-200
                  ${isDark ? "border-white/20 text-white/80 bg-blue-800" : "border-black/20 text-black/80 bg-blue-200"}
                `}
              >
                Powered by Chainlink CCIP
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Multi-Chain
                <br />
                <span className={isDark ? "text-white/60" : "text-black/60"}>Payroll</span>
                <br />
                System
              </h1>
              <p className={`text-md max-w-lg leading-relaxed font-[Poppins] ${isDark ? "text-white/70" : "text-black/70"}`}>
                Pay your global workforce across multiple blockchains with ease, speed and trust, enabling instant and secure salary disbursements, anywhere.
              </p>
            </div>

            <div className="flex items-center space-x-3 mb-8">
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-black/80"}`}>
                Supported chains
              </span>
              <div className="flex items-center space-x-3">
                <img
                  src="https://assets.coingecko.com/coins/images/279/small/ethereum.png"
                  alt="Ethereum"
                  className="w-6 h-6"
                  title="Ethereum"
                />
                <img
                  src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png"
                  alt="Arbitrum"
                  className="w-6 h-6"
                  title="Arbitrum"
                />
                <img
                  src="https://assets.coingecko.com/coins/images/25244/small/Optimism.png"
                  alt="Optimism"
                  className="w-6 h-6"
                  title="Optimism"
                />
                <img
                  src="https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png"
                  alt="Avalanche"
                  className="w-6 h-6"
                  title="Avalanche"
                />
                <img
                  src="https://raw.githubusercontent.com/base/brand-kit/main/logo/symbol/Base_Symbol_Blue.png"
                  alt="Base"
                  className="w-6 h-6"
                  title="Base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <CTAButton size="lg" className="rounded-xl">
                Request Early Access
              </CTAButton>
              <CTAButton variant="outline" size="lg" className="rounded-xl">
                View Demo
              </CTAButton>
            </div>
          </div>

          <div className="relative">
            <CrossChainPayrollAnimation isDark={isDark} />
          </div>
        </div>
      </div>
    </section>
  )
}

function CrossChainPayrollAnimation({ isDark }: { isDark: boolean }) {
  const strokeColor = isDark ? "white" : "black"
  const bgColor = isDark ? "black" : "white"

  // State to control the animation cycles
  const [animationCycle, setAnimationCycle] = useState(0)

  // Trigger a new animation cycle every 4 seconds (3s for animation + 1s gap)
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationCycle((prev) => (prev + 1) % 1000) // Large number to avoid overflow
    }, 4000) // Changed from 4000 to 5000 (4s animation + 1s gap)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Central Ethereum Wallet */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className={`relative w-20 h-20 rounded-full border-4 border-blue-500 ${bgColor === "black" ? "bg-gray-900" : "bg-white"} flex items-center justify-center shadow-lg`}
          >
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-pulse opacity-30"></div>
            <img
              src="https://assets.coingecko.com/coins/images/279/small/ethereum.png"
              alt="Ethereum"
              className="w-10 h-10"
            />
          </div>
          <div className="text-center mt-2">
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>Ethereum</p>
          </div>
        </div>

        {/* Destination Chains - Better positioned for precise alignment */}
        {/* Arbitrum - Top Right */}
        <div className="absolute" style={{ top: "64px", right: "64px" }}>
          <div
            className={`relative w-16 h-16 rounded-full border-2 border-[#2d394a] ${bgColor === "black" ? "bg-gray-800" : "bg-gray-50"} flex items-center justify-center overflow-hidden`}
          >
            <img
              src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png"
              alt="Arbitrum"
              className="w-8 h-8"
            />
            {/* Absorption effect - triggers for every cycle */}
            <div
              key={`arbitrum-absorb-${animationCycle}`}
              className="absolute inset-0 rounded-full bg-[#2d394a] opacity-0 animate-absorb"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
          <p className={`text-xs text-center mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Arbitrum</p>
        </div>

        {/* Optimism - Top Left */}
        <div className="absolute" style={{ top: "64px", left: "64px" }}>
          <div
            className={`relative w-16 h-16 rounded-full border-2 border-red-400 ${bgColor === "black" ? "bg-gray-800" : "bg-gray-50"} flex items-center justify-center overflow-hidden`}
          >
            <img
              src="https://assets.coingecko.com/coins/images/25244/small/Optimism.png"
              alt="Optimism"
              className="w-8 h-8"
            />
            {/* Absorption effect */}
            <div
              key={`optimism-absorb-${animationCycle}`}
              className="absolute inset-0 rounded-full bg-red-400 opacity-0 animate-absorb"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
          <p className={`text-xs text-center mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Optimism</p>
        </div>

        {/* Base - Bottom Left */}
        <div className="absolute" style={{ bottom: "64px", left: "64px" }}>
          <div
            className={`relative w-16 h-16 rounded-full border-2 border-blue-600 ${bgColor === "black" ? "bg-gray-800" : "bg-gray-50"} flex items-center justify-center overflow-hidden`}
          >
            <img src="https://raw.githubusercontent.com/base/brand-kit/main/logo/symbol/Base_Symbol_Blue.png" alt="Base" className="w-8 h-8" />
            {/* Absorption effect */}
            <div
              key={`base-absorb-${animationCycle}`}
              className="absolute inset-0 rounded-full bg-blue-600 opacity-0 animate-absorb"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
          <p className={`text-xs text-center mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Base</p>
        </div>

        {/* Avalanche - Bottom Right */}
        <div className="absolute" style={{ bottom: "64px", right: "64px" }}>
          <div
            className={`relative w-16 h-16 rounded-full border-2 border-red-500 ${bgColor === "black" ? "bg-gray-800" : "bg-gray-50"} flex items-center justify-center overflow-hidden`}
          >
            <img
              src="https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png"
              alt="Avalanche"
              className="w-8 h-8"
            />
            {/* Absorption effect */}
            <div
              key={`avalanche-absorb-${animationCycle}`}
              className="absolute inset-0 rounded-full bg-red-500 opacity-0 animate-absorb"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
          <p className={`text-xs text-center mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Avalanche</p>
        </div>

        {/* USDC Transfer Animations - Enter inside blockchain nodes */}
        {/* To Arbitrum */}
        <div
          key={`arbitrum-${animationCycle}`}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-to-arbitrum shadow-lg">
            <img
              src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
              alt="USDC"
              className="w-6 h-6"
            />
          </div>
        </div>

        {/* To Optimism */}
        <div
          key={`optimism-${animationCycle}`}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-to-optimism shadow-lg">
            <img
              src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
              alt="USDC"
              className="w-6 h-6"
            />
          </div>
        </div>

        {/* To Base */}
        <div
          key={`base-${animationCycle}`}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-to-base shadow-lg">
            <img
              src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
              alt="USDC"
              className="w-6 h-6"
            />
          </div>
        </div>

        {/* To Avalanche */}
        <div
          key={`avalanche-${animationCycle}`}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-to-avalanche shadow-lg">
            <img
              src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
              alt="USDC"
              className="w-6 h-6"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes to-arbitrum {
          0% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
            animation-timing-function: ease-out;
          }
          70% { 
            transform: translate(-50%, -50%) translate(120px, -120px) scale(1); 
            opacity: 1; 
            animation-timing-function: ease-in;
          }
          85% { 
            transform: translate(-50%, -50%) translate(128px, -128px) scale(0.6); 
            opacity: 0.8; 
          }
          100% { 
            transform: translate(-50%, -50%) translate(128px, -128px) scale(0); 
            opacity: 0; 
          }
        }

        @keyframes to-optimism {
          0% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
            animation-timing-function: ease-out;
          }
          70% { 
            transform: translate(-50%, -50%) translate(-120px, -120px) scale(1); 
            opacity: 1; 
            animation-timing-function: ease-in;
          }
          85% { 
            transform: translate(-50%, -50%) translate(-128px, -128px) scale(0.6); 
            opacity: 0.8; 
          }
          100% { 
            transform: translate(-50%, -50%) translate(-128px, -128px) scale(0); 
            opacity: 0; 
          }
        }

        @keyframes to-base {
          0% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
            animation-timing-function: ease-out;
          }
          70% { 
            transform: translate(-50%, -50%) translate(-120px, 120px) scale(1); 
            opacity: 1; 
            animation-timing-function: ease-in;
          }
          85% { 
            transform: translate(-50%, -50%) translate(-128px, 128px) scale(0.6); 
            opacity: 0.8; 
          }
          100% { 
            transform: translate(-50%, -50%) translate(-128px, 128px) scale(0); 
            opacity: 0; 
          }
        }

        @keyframes to-avalanche {
          0% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
            animation-timing-function: ease-out;
          }
          70% { 
            transform: translate(-50%, -50%) translate(120px, 120px) scale(1); 
            opacity: 1; 
            animation-timing-function: ease-in;
          }
          85% { 
            transform: translate(-50%, -50%) translate(128px, 128px) scale(0.6); 
            opacity: 0.8; 
          }
          100% { 
            transform: translate(-50%, -50%) translate(128px, 128px) scale(0); 
            opacity: 0; 
          }
        }

        @keyframes absorb {
          0% { 
            opacity: 0; 
            transform: scale(0.5); 
          }
          50% { 
            opacity: 0.5; 
            transform: scale(1.4); 
          }
          100% { 
            opacity: 0; 
            transform: scale(1); 
          }
        }

        .animate-to-arbitrum {
          animation: to-arbitrum 3s forwards;
        }

        .animate-to-optimism {
          animation: to-optimism 3s forwards;
          animation-delay: 0.4s;
        }

        .animate-to-base {
          animation: to-base 3s forwards;
          animation-delay: 1.0s;
        }

        .animate-to-avalanche {
          animation: to-avalanche 3s forwards;
          animation-delay: 1.4s;
        }

        .animate-absorb {
          animation: absorb 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
