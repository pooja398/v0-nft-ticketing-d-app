"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { NeonButton } from "@/components/neon-button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { Wallet, Copy, ExternalLink, LogOut, ChevronDown, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface WalletButtonProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function WalletButton({ size = "sm", className }: WalletButtonProps) {
  const { account, isConnecting, isConnected, chainId, balance, ensName, connectWallet, disconnectWallet } = useWallet()

  const [showDropdown, setShowDropdown] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "Ethereum"
      case 5:
        return "Goerli"
      case 11155111:
        return "Sepolia"
      case 137:
        return "Polygon"
      case 80001:
        return "Mumbai"
      default:
        return "Unknown"
    }
  }

  const getNetworkColor = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "bg-blue-500"
      case 5:
      case 11155111:
        return "bg-yellow-500"
      case 137:
        return "bg-purple-500"
      case 80001:
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!isConnected) {
    return (
      <NeonButton size={size} className={cn("relative", className)} onClick={connectWallet} disabled={isConnecting}>
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </>
        )}
      </NeonButton>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size={size}
        className={cn("border-slate-600 text-slate-300 hover:bg-slate-800 bg-slate-900/50 backdrop-blur-sm", className)}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center space-x-2">
          <div className={cn("w-2 h-2 rounded-full", getNetworkColor(chainId || 1))} />
          <span className="font-mono">{ensName || formatAddress(account || "")}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", showDropdown && "rotate-180")} />
        </div>
      </Button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50"
            >
              <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-md p-4 min-w-[280px]">
                {/* Account Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Account</span>
                    <Badge className={cn("text-xs text-white", getNetworkColor(chainId || 1))}>
                      {getNetworkName(chainId || 1)}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{ensName || "Wallet"}</p>
                      <p className="text-slate-400 text-sm font-mono">{formatAddress(account || "")}</p>
                    </div>
                  </div>

                  {balance && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Balance</span>
                      <span className="text-white font-semibold">{Number.parseFloat(balance).toFixed(4)} ETH</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                    onClick={handleCopyAddress}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copied ? "Copied!" : "Copy Address"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                    onClick={() => {
                      window.open(`https://etherscan.io/address/${account}`, "_blank")
                      setShowDropdown(false)
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Etherscan
                  </Button>

                  <div className="border-t border-slate-700 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => {
                        disconnectWallet()
                        setShowDropdown(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
