"use client"

import { useTheme } from "./theme-provider"
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 
        ${
          isDark
            ? "bg-white/10 hover:bg-white/20 text-white"
            : "bg-black/10 hover:bg-black/20 text-black"
        }
      `}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
