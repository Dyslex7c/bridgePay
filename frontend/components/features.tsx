"use client"

import { useTheme } from "./theme-provider"

export default function Features() {
  const { isDark } = useTheme()

  const features = [
    {
      title: "Cross-Chain Payments",
      description: "Execute payroll across multiple blockchains seamlessly with Chainlink CCIP",
      icon: "⛓️",
    },
    {
      title: "Real-time Analytics",
      description: "Monitor payroll operations across all chains with comprehensive dashboards",
      icon: "📊",
    },
  ]

  return (
    <section className={`py-20 transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`} id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl font-bold mb-6 transition-colors duration-200 ${isDark ? "text-white" : "text-black"}`}
          >
            Features
          </h2>
          <p
            className={`text-xl max-w-2xl mx-auto transition-colors duration-200 ${isDark ? "text-white/70" : "text-black/70"}`}
          >
            Built for modern organizations that need reliable, secure, and scalable payroll solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                border rounded-xl p-6 transition-all duration-300 group hover:scale-105
                ${
                  isDark
                    ? "border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
                    : "border-black/10 hover:border-black/30 bg-black/5 hover:bg-black/10"
                }
              `}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3
                className={`font-semibold text-xl mb-3 transition-colors duration-200 ${isDark ? "text-white" : "text-black"}`}
              >
                {feature.title}
              </h3>
              <p
                className={`leading-relaxed transition-colors duration-200 ${isDark ? "text-white/70" : "text-black/70"}`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
