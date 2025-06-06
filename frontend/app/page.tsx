"use client"

import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Hero from "@/components/hero"
import BlockchainMarquee from "@/components/blockchain-marquee"
import Features from "@/components/features"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Header />
        <Hero />
        <BlockchainMarquee />
        <Features />
        <CTASection />
        <Footer />
      </div>
    </ThemeProvider>
  )
}