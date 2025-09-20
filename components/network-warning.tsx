"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-context"
import { AlertTriangle, X } from "lucide-react"
import { useState } from "react"

const SUPPORTED_NETWORKS = {
  1: "Ethereum Mainnet",
  5: "Goerli Testnet",
  11155111: "Sepolia Testnet",
}

export function NetworkWarning() {
  const { chainId, switchNetwork, isConnected } = useWallet()
  const [dismissed, setDismissed] = useState(false)

  if (!isConnected || !chainId || dismissed) return null

  const isSupported = chainId in SUPPORTED_NETWORKS
  if (isSupported) return null

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork(11155111) // Switch to Sepolia
    } catch (error) {
      console.error("Failed to switch network:", error)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-20 left-4 right-4 z-40 flex justify-center"
      >
        <Card className="bg-yellow-500/10 border-yellow-500/30 backdrop-blur-md p-4 max-w-md">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-yellow-400 font-semibold mb-1">Unsupported Network</h3>
              <p className="text-yellow-200 text-sm mb-3">Please switch to a supported network to use this dApp.</p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleSwitchNetwork}
                  className="bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  Switch to Sepolia
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDismissed(true)}
                  className="text-yellow-400 hover:bg-yellow-500/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
