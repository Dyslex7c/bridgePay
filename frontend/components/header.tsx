"use client"

import Link from "next/link"
import ThemeToggle from "./theme-toggle"
import CTAButton from "./cta-button"
import { useTheme } from "./theme-provider"

export default function Header() {
  const { isDark } = useTheme()

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300
        ${isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-black/10"}
      `}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200
                ${isDark ? "bg-white" : "bg-black"}
              `}
            >
              <div className={`w-4 h-4 rounded-full ${isDark ? "bg-black" : "bg-white"}`}></div>
            </div>
            <span
              className={`font-bold text-xl transition-colors duration-200 ${isDark ? "text-white" : "text-black"}`}
            >
              ChainPay
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className={`
                text-sm font-medium transition-colors duration-200
                ${isDark ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"}
              `}
            >
              Features
            </Link>
            <Link
              href="#chains"
              className={`
                text-sm font-medium transition-colors duration-200
                ${isDark ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"}
              `}
            >
              Supported Chains
            </Link>
            <Link
              href="#docs"
              className={`
                text-sm font-medium transition-colors duration-200
                ${isDark ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"}
              `}
            >
              Documentation
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              className={`
                text-sm font-medium transition-colors duration-200
                ${isDark ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"}
              `}
            >
              Sign In
            </button>
            <CTAButton size="sm">Get Started</CTAButton>
          </div>
        </div>
      </div>
    </header>
  )
}
