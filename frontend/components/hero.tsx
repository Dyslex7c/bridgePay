"use client"

import CTAButton from "./cta-button"
import { useTheme } from "./theme-provider"

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
                  ${isDark ? "border-white/20 text-white/80 bg-white/5" : "border-black/20 text-black/80 bg-black/5"}
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
              <p className={`text-xl max-w-lg leading-relaxed ${isDark ? "text-white/70" : "text-black/70"}`}>
                Seamlessly manage cross-chain payroll operations with Chainlink's Cross-Chain Interoperability Protocol.
                Pay your global workforce across multiple blockchains with enterprise-grade security.
              </p>
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
            <ChainIllustration isDark={isDark} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ChainIllustration({ isDark }: { isDark: boolean }) {
  const strokeColor = isDark ? "white" : "black"

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="animate-pulse">
          <circle cx="80" cy="80" r="25" stroke={strokeColor} strokeWidth="2" fill="none" />
          <circle cx="80" cy="80" r="15" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="200" cy="60" r="25" stroke={strokeColor} strokeWidth="2" fill="none" />
          <circle cx="200" cy="60" r="15" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="320" cy="80" r="25" stroke={strokeColor} strokeWidth="2" fill="none" />
          <circle cx="320" cy="80" r="15" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="140" cy="150" r="25" stroke={strokeColor} strokeWidth="2" fill="none" />
          <circle cx="140" cy="150" r="15" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="260" cy="150" r="25" stroke={strokeColor} strokeWidth="2" fill="none" />
          <circle cx="260" cy="150" r="15" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="200" cy="220" r="25" stroke={strokeColor} strokeWidth="2" fill="none" />
          <circle cx="200" cy="220" r="15" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.5" />
        </g>

        <g className="opacity-60">
          <line x1="105" y1="80" x2="175" y2="60" stroke={strokeColor} strokeWidth="1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="225" y1="60" x2="295" y2="80" stroke={strokeColor} strokeWidth="1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="95" y1="100" x2="125" y2="135" stroke={strokeColor} strokeWidth="1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="165" y1="150" x2="235" y2="150" stroke={strokeColor} strokeWidth="1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="285" y1="150" x2="315" y2="100" stroke={strokeColor} strokeWidth="1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="155" y1="170" x2="185" y2="200" stroke={strokeColor} strokeWidth="1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="245" y1="170" x2="215" y2="200" stroke={strokeColor} strokeWidth="1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
        </g>

        <g>
          <circle cx="80" cy="80" r="3" fill={strokeColor}>
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="60" r="3" fill={strokeColor}>
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="320" cy="80" r="3" fill={strokeColor}>
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="140" cy="150" r="3" fill={strokeColor}>
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="260" cy="150" r="3" fill={strokeColor}>
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="220" r="3" fill={strokeColor}>
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="1.5s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  )
}
