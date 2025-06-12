"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowUpDown, Users, Shield, Clock, DollarSign, Network, Sparkles, Target } from "lucide-react"
import { useState } from "react"

export default function EnterPage() {
  const { isDark } = useTheme()
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const bridgeOptions = [
    {
      id: "single",
      title: "Single Bridge",
      subtitle: "One-to-One Transfer",
      description: "Perfect for individual payments and simple cross-chain transfers",
      icon: ArrowUpDown,
      route: "/bridge",
      features: ["Single recipient", "Quick setup", "Instant execution", "Perfect for personal use"],
      gradient: "from-blue-500 to-indigo-600",
      glowColor: "blue",
      stats: { time: "~2 min", cost: "Low fees", complexity: "Simple" },
    },
    {
      id: "batch",
      title: "Batch Bridge",
      subtitle: "One-to-Many Transfer",
      description: "Ideal for payroll, airdrops, and bulk payment distributions",
      icon: Users,
      route: "/one-to-many",
      features: ["Multiple recipients", "Bulk operations", "Cost efficient", "Perfect for businesses"],
      gradient: "from-emerald-500 to-teal-600",
      glowColor: "emerald",
      stats: { time: "~5 min", cost: "Optimized fees", complexity: "Advanced" },
    },
  ]

  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 3 + (i % 3),
    size: 20 + (i % 3) * 10,
  }))

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"} relative overflow-hidden`}
    >
      <Header />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className={`absolute rounded-full opacity-10 animate-float-${element.id}`}
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${10 + element.id * 15}%`,
              top: `${20 + element.id * 10}%`,
              background: isDark
                ? `linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))`
                : `linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            <div className="space-y-6">
              <div
                className={`inline-block px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  isDark
                    ? "text-white/90 bg-gradient-to-r from-blue-800/50 to-teal-800/50 border border-white/20"
                    : "text-black/90 bg-gradient-to-r from-blue-200/50 to-purple-200/50 border border-black/20"
                } backdrop-blur-sm hover:scale-105`}
              >
                <Sparkles className="inline w-4 h-4 mr-2" />
                Choose Your Bridge Experience
              </div>

              <h1 className={`text-5xl lg:text-6xl font-bold leading-tight ${isDark ? "text-white" : "text-black"}`}>
                <span className="font-[Montserrat]">Select Your</span>
                <br />
                <span
                  className={`font-[Poppins] bg-gradient-to-r ${isDark ? "from-blue-500 to-indigo-500" : "from-blue-600 to-indigo-600"} bg-clip-text text-transparent`}
                >
                  Bridge Mode
                </span>
              </h1>

              <p
                className={`text-md max-w-3xl mx-auto leading-relaxed font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}
              >
                Choose between our streamlined single transfer bridge or our powerful batch payment system. Both powered
                by Chainlink CCIP for secure cross-chain transactions.
              </p>
            </div>
          </div>

          {/* Bridge Options */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {bridgeOptions.map((option, index) => (
              <Card
                key={option.id}
                className={`relative overflow-hidden transition-all duration-500 cursor-pointer group ${
                  hoveredCard === option.id ? "scale-105" : "hover:scale-102"
                } ${
                  isDark
                    ? "bg-gradient-to-br from-black/80 to-gray-900/80 border-white/10 backdrop-blur-xl"
                    : "bg-gradient-to-br from-white/80 to-gray-50/80 border-black/10 backdrop-blur-xl"
                } shadow-2xl`}
                onMouseEnter={() => setHoveredCard(option.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => router.push(option.route)}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r ${option.gradient} blur-xl`}
                />

                {/* Animated Border */}
                <div
                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    background: `linear-gradient(45deg, transparent, ${
                      option.glowColor === "blue" ? "rgba(59, 130, 246, 0.3)" : "rgba(16, 185, 129, 0.3)"
                    }, transparent)`,
                    padding: "2px",
                  }}
                >
                  <div className={`w-full h-full rounded-lg ${isDark ? "bg-black/90" : "bg-white/90"}`} />
                </div>

                <CardContent className="relative z-10 p-8 space-y-6">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${option.gradient} shadow-lg`}>
                        <option.icon className="w-8 h-8 text-white" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          isDark ? "border-white/20 text-white/80" : "border-black/20 text-black/80"
                        } font-[Inter]`}
                      >
                        {option.subtitle}
                      </Badge>
                    </div>

                    <div>
                      <h3 className={`text-2xl font-bold font-[Poppins] ${isDark ? "text-white" : "text-black"}`}>
                        {option.title}
                      </h3>
                      <p className={`text-base font-[Inter] mt-2 ${isDark ? "text-white/70" : "text-black/70"}`}>
                        {option.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`text-center p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                      <Clock className={`w-5 h-5 mx-auto mb-1 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                      <p className={`text-xs font-[Inter] ${isDark ? "text-white/60" : "text-black/60"}`}>Setup Time</p>
                      <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}>
                        {option.stats.time}
                      </p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                      <DollarSign className={`w-5 h-5 mx-auto mb-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
                      <p className={`text-xs font-[Inter] ${isDark ? "text-white/60" : "text-black/60"}`}>Cost</p>
                      <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}>
                        {option.stats.cost}
                      </p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                      <Target className={`w-5 h-5 mx-auto mb-1 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                      <p className={`text-xs font-[Inter] ${isDark ? "text-white/60" : "text-black/60"}`}>Complexity</p>
                      <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}>
                        {option.stats.complexity}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className={`text-sm font-semibold font-[Inter] ${isDark ? "text-white/80" : "text-black/80"}`}>
                      Key Features:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {option.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.gradient}`} />
                          <span className={`text-sm font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full h-14 text-lg font-[Poppins] transition-all duration-300 group-hover:scale-105 bg-gradient-to-r ${option.gradient} hover:shadow-xl text-white border-0`}
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center mt-16 space-y-6">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? "bg-blue-800" : "bg-blue-200"}`}
            >
              <Shield className="w-4 h-4" />
              <span className={`text-sm font-medium font-[Inter] ${isDark ? "text-white/80" : "text-black"}`}>
                Powered by Chainlink CCIP - Secure & Reliable
              </span>
            </div>

            <p className={`text-sm font-[Inter] ${isDark ? "text-white/60" : "text-black/60"}`}>
              Not sure which option to choose? Both bridges offer the same security and reliability.
              <br />
              Start with Single Bridge for simple transfers or Batch Bridge for multiple recipients.
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-35px) rotate(-180deg); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(-180deg); }
        }
        @keyframes pulse-out {
          0% { 
            transform: translateX(32px) scale(1); 
            opacity: 1; 
          }
          70% { 
            transform: translateX(80px) scale(0.8); 
            opacity: 0.7; 
          }
          100% { 
            transform: translateX(120px) scale(0); 
            opacity: 0; 
          }
        }
        .animate-float-0 { animation: float-0 3s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 3.5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 4.5s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 3.2s ease-in-out infinite; }
        .animate-float-5 { animation: float-5 4.2s ease-in-out infinite; }
        .animate-pulse-out { animation: pulse-out 2s ease-out infinite; }
      `}</style>
    </div>
  )
}
