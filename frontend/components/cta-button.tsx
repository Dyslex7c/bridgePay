"use client"

import type React from "react"
import { useTheme } from "./theme-provider"
import type { ButtonHTMLAttributes } from "react"

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export default function CTAButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: CTAButtonProps) {
  const { isDark } = useTheme()

  const baseStyles =
    "font-semibold transition-all duration-200 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-10 outline-none"

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const variantStyles = {
    primary: isDark
      ? "bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105"
      : "bg-black text-white hover:bg-gray-900 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: isDark
      ? "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
      : "bg-black/10 text-black border border-black/20 hover:bg-black/20 hover:border-black/40 backdrop-blur-sm",
    outline: isDark
      ? "border border-white/30 text-white hover:bg-white/5 hover:border-white/50 bg-transparent"
      : "border border-black/30 text-black hover:bg-black/5 hover:border-black/50 bg-transparent",
  }

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  )
}
