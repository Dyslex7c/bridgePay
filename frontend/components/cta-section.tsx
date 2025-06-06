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
