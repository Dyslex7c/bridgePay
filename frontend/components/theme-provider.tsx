"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type ThemeContextType = {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("chainpay-theme")
    if (savedTheme) {
      const isDarkTheme = savedTheme === "dark"
      setIsDark(isDarkTheme)
      document.documentElement.classList.toggle("dark", isDarkTheme)
      document.documentElement.classList.toggle("light", !isDarkTheme)
    } else {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem("chainpay-theme", newTheme ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newTheme)
    document.documentElement.classList.toggle("light", !newTheme)
  }

  // Provide a default context value even when not mounted
  const contextValue = {
    isDark,
    toggleTheme,
  }

  // Always render the provider, but show loading state if not mounted
  return (
    <ThemeContext.Provider value={contextValue}>
      {mounted ? children : <div className="min-h-screen bg-black" />}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
