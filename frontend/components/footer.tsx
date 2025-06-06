"use client"

import Link from "next/link"
import CTAButton from "./cta-button"
import { useTheme } from "./theme-provider"

export default function Footer() {
  const { isDark } = useTheme()

  return (
    <footer
      className={`border-t transition-colors duration-300 ${isDark ? "bg-black border-white/10" : "bg-white border-black/10"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
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
            <p className={`text-sm transition-colors duration-200 ${isDark ? "text-white/60" : "text-black/60"}`}>
              The future of cross-chain payroll management, powered by Chainlink CCIP.
            </p>
            <div className="pt-4">
              <CTAButton variant="secondary" size="sm">
                Get Started Today
              </CTAButton>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 transition-colors duration-200 ${isDark ? "text-white" : "text-black"}`}>
              Product
            </h4>
            <div className="space-y-2">
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                Features
              </Link>
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                Pricing
              </Link>
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                Security
              </Link>
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                Integrations
              </Link>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 transition-colors duration-200 ${isDark ? "text-white" : "text-black"}`}>
              Developers
            </h4>
            <div className="space-y-2">
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                Documentation
              </Link>
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                API Reference
              </Link>
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                SDKs
              </Link>
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                GitHub
              </Link>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 transition-colors duration-200 ${isDark ? "text-white" : "text-black"}`}>
              Company
            </h4>
            <div className="space-y-2">
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                About
              </Link>
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                Blog
              </Link>
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                Careers
              </Link>
              <Link
                href="#"
                className={`
                  block text-sm transition-colors duration-200
                  ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}
                `}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`
            border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center transition-colors duration-300
            ${isDark ? "border-white/10" : "border-black/10"}
          `}
        >
          <p className={`text-sm transition-colors duration-200 ${isDark ? "text-white/50" : "text-black/50"}`}>
            © 2024 ChainPay. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link
              href="#"
              className={`
                text-sm transition-colors duration-200
                ${isDark ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black"}
              `}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className={`
                text-sm transition-colors duration-200
                ${isDark ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black"}
              `}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
