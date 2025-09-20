"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { NeonButton } from "@/components/neon-button"
import { QrCode, CheckCircle, XCircle, Scan, Search, Clock } from "lucide-react"

interface VerificationResult {
  isValid: boolean
  ticket?: {
    tokenId: number
    eventName: string
    date: string
    venue: string
    seat: string
    owner: string
    status: "active" | "used" | "expired"
    verifiedAt: string
  }
  error?: string
}

export default function VerifyPage() {
  const [tokenId, setTokenId] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async () => {
    if (!tokenId.trim()) return

    setIsLoading(true)
    setVerificationResult(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock verification result
    const mockResult: VerificationResult = {
      isValid: Math.random() > 0.3, // 70% chance of valid ticket
      ticket: {
        tokenId: Number.parseInt(tokenId) || 1337,
        eventName: "Neon Dreams Festival",
        date: "2024-03-15",
        venue: "Cyber Arena",
        seat: "A-42",
        owner: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c",
        status: "active",
        verifiedAt: new Date().toISOString(),
      },
    }

    if (!mockResult.isValid) {
      mockResult.error = "Ticket not found or invalid"
    }

    setVerificationResult(mockResult)
    setIsLoading(false)
  }

  const handleScan = () => {
    setIsScanning(true)
    // Simulate QR scan
    setTimeout(() => {
      setTokenId("1337")
      setIsScanning(false)
      handleVerify()
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Ticket Verification</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Verify the authenticity of NFT tickets using blockchain technology
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Verification Input */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-slate-900/50 border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Verify Ticket</h2>

                <div className="space-y-6">
                  {/* Manual Input */}
                  <div>
                    <label className="block text-white font-semibold mb-3">Enter Token ID</label>
                    <div className="flex space-x-3">
                      <Input
                        type="text"
                        placeholder="e.g., 1337"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                      />
                      <Button
                        onClick={handleVerify}
                        disabled={!tokenId.trim() || isLoading}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1 h-px bg-slate-600"></div>
                    <span className="text-slate-400 text-sm">OR</span>
                    <div className="flex-1 h-px bg-slate-600"></div>
                  </div>

                  {/* QR Scanner */}
                  <div className="text-center">
                    <NeonButton onClick={handleScan} disabled={isScanning} className="w-full">
                      {isScanning ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2"
                          >
                            <Scan className="h-5 w-5" />
                          </motion.div>
                          Scanning QR Code...
                        </>
                      ) : (
                        <>
                          <QrCode className="h-5 w-5 mr-2" />
                          Scan QR Code
                        </>
                      )}
                    </NeonButton>
                  </div>

                  {isScanning && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-800 rounded-lg p-6 text-center"
                    >
                      <div className="w-32 h-32 border-2 border-cyan-500 rounded-lg mx-auto mb-4 relative overflow-hidden">
                        <motion.div
                          className="absolute inset-0 border-t-2 border-cyan-400"
                          animate={{ y: [0, 128, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                      </div>
                      <p className="text-slate-300">Point camera at QR code</p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Verification Result */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-slate-900/50 border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Verification Result</h2>

                {isLoading ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-slate-300">Verifying on blockchain...</p>
                  </div>
                ) : verificationResult ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Status */}
                    <div className="text-center">
                      {verificationResult.isValid ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", duration: 0.6 }}
                        >
                          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-green-400 mb-2">Valid Ticket</h3>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Verified on Blockchain
                          </Badge>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", duration: 0.6 }}
                        >
                          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-red-400 mb-2">Invalid Ticket</h3>
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Not Found</Badge>
                        </motion.div>
                      )}
                    </div>

                    {/* Ticket Details */}
                    {verificationResult.isValid && verificationResult.ticket && (
                      <div className="space-y-4">
                        <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Token ID</span>
                            <span className="text-white font-mono">#{verificationResult.ticket.tokenId}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Event</span>
                            <span className="text-white">{verificationResult.ticket.eventName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Date</span>
                            <span className="text-white">{verificationResult.ticket.date}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Venue</span>
                            <span className="text-white">{verificationResult.ticket.venue}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Seat</span>
                            <span className="text-white">{verificationResult.ticket.seat}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Status</span>
                            <Badge
                              className={
                                verificationResult.ticket.status === "active"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                              }
                            >
                              {verificationResult.ticket.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center text-slate-400 text-sm">
                            <Clock className="h-4 w-4 mr-2" />
                            Verified at {new Date(verificationResult.ticket.verifiedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {verificationResult.error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-400 text-center">{verificationResult.error}</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <QrCode className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">Enter a token ID or scan a QR code to verify</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Recent Verifications */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <Card className="bg-slate-900/50 border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Verifications</h2>

              <div className="space-y-4">
                {[
                  { tokenId: 1337, status: "valid", event: "Neon Dreams Festival", time: "2 minutes ago" },
                  { tokenId: 2468, status: "valid", event: "Digital Art Expo", time: "5 minutes ago" },
                  { tokenId: 9999, status: "invalid", event: "Unknown", time: "8 minutes ago" },
                ].map((verification, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {verification.status === "valid" ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <div>
                        <p className="text-white font-semibold">#{verification.tokenId}</p>
                        <p className="text-slate-400 text-sm">{verification.event}</p>
                      </div>
                    </div>
                    <span className="text-slate-500 text-sm">{verification.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
