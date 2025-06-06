"use client"

import CTAButton from "./cta-button"
import { useTheme } from "./theme-provider"

export default function CTASection() {
  const { isDark } = useTheme()

  return (
    <section className={`py-20 transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={`text-4xl lg:text-6xl font-bold mb-6 transition-colors duration-200 ${isDark ? "text-white" : "text-black"}`}
          >
            Ready to Transform
            <br />
            Your Payroll?
          </h2>
          <p
            className={`text-xl mb-8 max-w-2xl mx-auto transition-colors duration-200 ${isDark ? "text-white/70" : "text-black/70"}`}
          >
            Join the waitlist for early access to the future of cross-chain payroll management. Be among the first to
            experience seamless multi-blockchain payments.
          </p>

          {/* Blockchain Icons */}
          <div className="flex justify-center items-center space-x-6 mb-12">
            <EthereumIcon isDark={isDark} />
            <ArbitrumIcon isDark={isDark} />
            <OptimismIcon isDark={isDark} />
            <PolygonIcon isDark={isDark} />
            <AvalancheIcon isDark={isDark} />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className={`
                  border rounded-lg px-6 py-4 text-base placeholder-opacity-50 focus:outline-none transition-all duration-200 min-w-80
                  ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/15"
                      : "bg-black/5 border-black/20 text-black placeholder-black/50 focus:border-black/50 focus:bg-black/10"
                  }
                `}
              />
              <CTAButton size="lg">Request Access</CTAButton>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton variant="outline" size="md">
              Schedule Demo
            </CTAButton>
            <CTAButton variant="outline" size="md">
              View Documentation
            </CTAButton>
          </div>

          <p className={`text-sm mt-8 transition-colors duration-200 ${isDark ? "text-white/50" : "text-black/50"}`}>
            No spam, unsubscribe at any time. Early access is limited.
          </p>
        </div>
      </div>
    </section>
  )
}

function EthereumIcon({ isDark }: { isDark: boolean }) {
  const color = isDark ? "white" : "black"
  return (
    <div className="w-8 h-8">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0L8 16.5L16 22L24 16.5L16 0Z" fill={color} fillOpacity="0.6" />
        <path d="M16 0L24 16.5L16 12V0Z" fill={color} />
        <path d="M16 24L8 18L16 32L24 18L16 24Z" fill={color} fillOpacity="0.6" />
        <path d="M16 32L24 18L16 24V32Z" fill={color} />
      </svg>
    </div>
  )
}

function ArbitrumIcon({ isDark }: { isDark: boolean }) {
  const color = isDark ? "white" : "black"
  return (
    <div className="w-8 h-8">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4L26 14V22L16 28L6 22V14L16 4Z" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M16 10L20 14V18L16 22L12 18V14L16 10Z" fill={color} />
      </svg>
    </div>
  )
}

function OptimismIcon({ isDark }: { isDark: boolean }) {
  const bgColor = isDark ? "white" : "black"
  const fgColor = isDark ? "black" : "white"
  return (
    <div className="w-8 h-8">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill={bgColor} />
        <circle cx="13" cy="14" r="2.5" fill={fgColor} />
        <circle cx="19" cy="14" r="2.5" fill={fgColor} />
        <path d="M11 19C11 19 13 21 16 21C19 21 21 19 21 19" stroke={fgColor} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function PolygonIcon({ isDark }: { isDark: boolean }) {
  const color = isDark ? "white" : "black"
  return (
    <div className="w-8 h-8">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 12L16 9L12 12V20L16 23L20 20V12Z" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M16 9V16L20 13V12L16 9Z" fill={color} />
        <path d="M12 12V13L16 16V9L12 12Z" fill={color} fillOpacity="0.6" />
      </svg>
    </div>
  )
}

function AvalancheIcon({ isDark }: { isDark: boolean }) {
  const color = isDark ? "white" : "black"
  return (
    <div className="w-8 h-8">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 6L23 18H9L16 6Z" fill={color} />
        <path d="M11 20H21L24 26H8L11 20Z" fill={color} />
      </svg>
    </div>
  )
}
