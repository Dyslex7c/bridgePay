"use client"

import { useTheme } from "@/components/theme-provider"

export default function PageHeader() {
  const { isDark } = useTheme()

  return (
    <div className="text-center space-y-4">
      <div
        className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${isDark ? "text-white/80 bg-blue-800" : "text-black/80 bg-blue-200"}`}
      >
        Batch Payments
      </div>
      <div className={`text-2xl lg:text-4xl font-bold ${isDark ? "text-white" : "text-black"}`}>
        One-to-Many
        <br />
        <span className={isDark ? "text-white/60" : "text-black/60"}>Payroll System</span>
      </div>
      <p
        className={`text-md max-w-2xl mx-auto leading-relaxed font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}
      >
        Send USDC to multiple recipients across different blockchains in a single transaction
      </p>
    </div>
  )
}
