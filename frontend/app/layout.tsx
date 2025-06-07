import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { cookieToInitialState } from "wagmi"
import { getConfig } from "./config"
import { headers } from "next/headers"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "BridgePay - Multi-Chain Payroll System",
  description:
    "Seamlessly manage cross-chain payroll operations with Chainlink's Cross-Chain Interoperability Protocol",
  viewport: "width=100%, initial-scale=1",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie")
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-black text-white">
        <ThemeProvider>
          <Providers initialState={initialState}>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
