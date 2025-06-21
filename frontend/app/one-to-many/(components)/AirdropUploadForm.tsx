"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, FileText, AlertCircle, CheckCircle, Download, Users, DollarSign, PlaneTakeoff } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { chainSelectorMapping } from "../../constants"

type Beneficiary = {
  nickname: string
  destinationChainSelector: string
  beneficiaryAddress: string
  usdcAmount: string
}

interface AirdropUploadFormProps {
  csvFile: File | null
  parsedRecipients: Beneficiary[]
  uploadError: string | null
  onFileUpload: (file: File) => void
  isConnected: boolean
}

export default function AirdropUploadForm({
  csvFile,
  parsedRecipients,
  uploadError,
  onFileUpload,
  isConnected,
}: AirdropUploadFormProps) {
  const { isDark } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        onFileUpload(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0])
    }
  }

  const downloadTemplate = () => {
    const csvContent =
      "wallet_address,amount,chain,name\n0x1234567890123456789012345678901234567890,100,Ethereum,John Doe\n0x0987654321098765432109876543210987654321,250,Arbitrum,Jane Smith"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "airdrop_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totalAmount = parsedRecipients.reduce((sum, recipient) => sum + Number(recipient.usdcAmount), 0)
  const uniqueChains = new Set(parsedRecipients.map((r) => r.destinationChainSelector)).size

  const getChainLogo = (chainSelector: string) => {
    return chainSelectorMapping[chainSelector]?.logo || "/placeholder.svg"
  }

  const getChainName = (chainSelector: string) => {
    return chainSelectorMapping[chainSelector]?.name || "Unknown Chain"
  }

  return (
    <div className="space-y-6">
      <Card
        className={`transition-all duration-500 ${isDark ? "bg-gradient-to-br from-black to-blue-700/20 border-black backdrop-blur-xl shadow-2xl" : "bg-gradient-to-br from-white to-blue-500/10 border-white backdrop-blur-xl shadow-2xl"}`}
      >
        <CardHeader className="pb-6">
          <CardTitle
            className={`flex items-center gap-3 text-2xl font-[Poppins] ${isDark ? "text-white" : "text-black"}`}
          >
            <div className={`p-2 rounded-xl ${isDark ? "bg-red-500/80" : "bg-red-400/70"}`}>
              <PlaneTakeoff className="w-6 h-6" />
            </div>
            Airdrop Distribution
          </CardTitle>
          <CardDescription className={`text-sm font-[Inter] ${isDark ? "text-white/60" : "text-black/60"}`}>
            Upload a CSV file containing recipient details for batch distribution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Download */}
          <div
            className={`p-4 rounded-xl border ${isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-500/10 border-blue-500/20"}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${isDark ? "bg-blue-500/20" : "bg-blue-500/20"}`}>
                <Download className={`w-5 h-5 ${isDark ? "text-blue-300" : "text-blue-700"}`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold font-[Inter] mb-1 ${isDark ? "text-blue-200" : "text-blue-800"}`}>
                  CSV Template
                </h4>
                <p className={`text-sm mb-3 ${isDark ? "text-blue-400" : "text-blue-700/80"}`}>
                  Download our template to ensure your CSV file has the correct format
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={`${isDark ? "border-blue-300/30 text-blue-300" : "border-blue-600/30 text-blue-600"}`}
                  >
                    wallet_address
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${isDark ? "border-blue-300/30 text-blue-300" : "border-blue-600/30 text-blue-600"}`}
                  >
                    amount
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${isDark ? "border-blue-300/30 text-blue-300" : "border-blue-600/30 text-blue-600"}`}
                  >
                    chain
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${isDark ? "border-blue-300/30 text-blue-300" : "border-blue-600/30 text-blue-600"}`}
                  >
                    name (optional)
                  </Badge>
                </div>
                <Button
                  onClick={downloadTemplate}
                  variant="outline"
                  size="sm"
                  className={`${isDark ? "border-blue-400/30 text-blue-300 hover:bg-blue-500/10" : "border-blue-600/30 text-blue-600 hover:bg-blue-500/10"}`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? isDark
                  ? "border-purple-400 bg-purple-500/10"
                  : "border-purple-600 bg-purple-500/10"
                : isDark
                  ? "border-white/20 hover:border-white/40"
                  : "border-black/20 hover:border-black/40"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${isDark ? "bg-red-600/50" : "bg-red-500/40"}`}
              >
                <FileText className={`w-8 h-8 ${isDark ? "text-white" : "text-black"}`} />
              </div>

              <div>
                <h3 className={`text-lg font-[Poppins] font-semibold mb-2 ${isDark ? "text-white" : "text-black"}`}>
                  {csvFile ? csvFile.name : "Drop your CSV file here"}
                </h3>
                <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>or click to browse files</p>
              </div>

              {csvFile && (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isDark ? "bg-green-500/20 text-green-300" : "bg-green-500/20 text-green-700"}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  File uploaded successfully
                </div>
              )}
            </div>
          </div>

          {uploadError && (
            <Alert className={`${isDark ? "border-red-500/20 bg-red-500/10" : "border-red-600/20 bg-red-600/10"}`}>
              <AlertCircle className="h-5 w-5" />
              <AlertDescription
                className={`font-[Inter] whitespace-pre-line ${isDark ? "text-red-400" : "text-red-600"}`}
              >
                {uploadError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Parsed Recipients Preview */}
      {parsedRecipients.length > 0 && (
        <Card
          className={`transition-all duration-500 animate-in slide-in-from-bottom-4 ${isDark ? "bg-gradient-to-br from-black to-green-700/20 border-black backdrop-blur-xl shadow-2xl" : "bg-gradient-to-br from-white to-green-500/10 border-white backdrop-blur-xl shadow-2xl"}`}
        >
          <CardHeader className="pb-6">
            <CardTitle
              className={`flex items-center gap-3 text-2xl font-[Poppins] ${isDark ? "text-white" : "text-black"}`}
            >
              <div className={`p-2 rounded-xl ${isDark ? "bg-green-400/80" : "bg-green-300/60"}`}>
                <Users className="w-6 h-6" />
              </div>
              Parsed Recipients
            </CardTitle>
            <CardDescription className={`text-sm font-[Inter] ${isDark ? "text-white/60" : "text-black/60"}`}>
              Review the recipients parsed from your CSV file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 border transition-all duration-300 ${isDark ? "border-white/10 bg-blue-400/5" : "border-black/10 bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                  <div>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>Recipients</p>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                      {parsedRecipients.length}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`p-4 border transition-all duration-300 ${isDark ? "border-white/10 bg-blue-400/5" : "border-black/10 bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <DollarSign className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <div>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>Total Amount</p>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                      {totalAmount.toFixed(2)} USDC
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`p-4 border transition-all duration-300 ${isDark ? "border-white/10 bg-blue-400/5" : "border-black/10 bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded ${isDark ? "bg-purple-400" : "bg-purple-600"}`} />
                  <div>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>Unique Chains</p>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>{uniqueChains}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className={isDark ? "bg-white/10" : "bg-black/10"} />

            {/* Recipients List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {parsedRecipients.slice(0, 5).map((recipient, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all duration-300 ${isDark ? "border-white/10 bg-black/50" : "border-black/10 bg-white/50"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={getChainLogo(recipient.destinationChainSelector) || "/placeholder.svg"}
                        alt={getChainName(recipient.destinationChainSelector)}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <p className={`font-medium ${isDark ? "text-white" : "text-black"}`}>{recipient.nickname}</p>
                        <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
                          {`${recipient.beneficiaryAddress.slice(0, 6)}...${recipient.beneficiaryAddress.slice(-4)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${isDark ? "border-white/20 text-white" : "border-black/20 text-black"}`}
                      >
                        {getChainName(recipient.destinationChainSelector)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <img
                          src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
                          alt="USDC"
                          className="w-4 h-4"
                        />
                        <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                          {recipient.usdcAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {parsedRecipients.length > 5 && (
                <div className={`text-center py-2 text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
                  ... and {parsedRecipients.length - 5} more recipients
                </div>
              )}
            </div>

            {parsedRecipients.length > 0 && (
              <div
                className={`p-4 rounded-xl border ${isDark ? "bg-green-500/10 border-green-500/20" : "bg-green-500/10 border-green-500/20"}`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className={`w-5 h-5 ${isDark ? "text-green-300" : "text-green-700"}`} />
                  <div>
                    <h4 className={`font-semibold font-[Inter] ${isDark ? "text-green-200" : "text-green-800"}`}>
                      Recipients Added Successfully!
                    </h4>
                    <p className={`text-sm ${isDark ? "text-green-400" : "text-green-700/80"}`}>
                      {parsedRecipients.length} recipients have been automatically added to your batch
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isConnected && (
              <Alert
                className={`${isDark ? "border-yellow-500/20 bg-yellow-500/10" : "border-yellow-600/20 bg-yellow-600/10"}`}
              >
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <AlertDescription className={`font-[Inter] ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>
                  Please connect your wallet to add recipients
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
