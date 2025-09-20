"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { ethers } from "ethers"

interface WalletContextType {
  account: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  isConnecting: boolean
  isConnected: boolean
  chainId: number | null
  balance: string | null
  ensName: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [ensName, setEnsName] = useState<string | null>(null)

  const isConnected = !!account && !!provider

  // Check if wallet is already connected on page load
  useEffect(() => {
    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accounts[0])
          updateWalletInfo(accounts[0])
        }
      }

      const handleChainChanged = (chainId: string) => {
        setChainId(Number.parseInt(chainId, 16))
        window.location.reload() // Recommended by MetaMask
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()

        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const network = await provider.getNetwork()

          setProvider(provider)
          setSigner(signer)
          setAccount(accounts[0].address)
          setChainId(Number(network.chainId))

          await updateWalletInfo(accounts[0].address)
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const updateWalletInfo = async (address: string) => {
    if (!provider) return

    try {
      // Get balance
      const balance = await provider.getBalance(address)
      setBalance(ethers.formatEther(balance))

      // Try to get ENS name
      try {
        const ensName = await provider.lookupAddress(address)
        setEnsName(ensName)
      } catch (error) {
        setEnsName(null)
      }
    } catch (error) {
      console.error("Error updating wallet info:", error)
    }
  }

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      setProvider(provider)
      setSigner(signer)
      setAccount(address)
      setChainId(Number(network.chainId))

      await updateWalletInfo(address)

      // Store connection state
      localStorage.setItem("walletConnected", "true")
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      if (error.code === 4001) {
        // User rejected the request
        alert("Please connect to MetaMask to continue.")
      } else {
        alert("Error connecting to wallet. Please try again.")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
    setBalance(null)
    setEnsName(null)
    localStorage.removeItem("walletConnected")
  }

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        console.error("Network not added to MetaMask")
      } else {
        console.error("Error switching network:", error)
      }
    }
  }

  const value: WalletContextType = {
    account,
    provider,
    signer,
    isConnecting,
    isConnected,
    chainId,
    balance,
    ensName,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
