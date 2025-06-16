"use client"

import Link from "next/link"
import ThemeToggle from "./theme-toggle"
import CTAButton from "./cta-button"
import { useTheme } from "./theme-provider"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useRouter } from "next/navigation"

export default function Header() {
  const { isDark } = useTheme()
  const router = useRouter();

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300
      `}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div onClick={() => router.push("/")} className="flex items-center space-x-3 hover:cursor-pointer">
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
              BridgePay
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
              href="/employees"
              className={`
                text-sm font-medium transition-colors duration-200
                ${isDark ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"}
              `}
            >
              Team
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
            <ConnectButton />
            <CTAButton size="sm">Get Started</CTAButton>
          </div>
        </div>
      </div>
    </header>
  )
}
