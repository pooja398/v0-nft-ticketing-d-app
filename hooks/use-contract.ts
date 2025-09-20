"use client"

import { useState, useEffect } from "react"
import type { ethers } from "ethers"
import { useWallet } from "@/contexts/wallet-context"
import { getEventTicketContract, getEventTicketContractWithSigner } from "@/lib/contracts/contract-utils"

export function useContract() {
  const { provider, signer, chainId } = useWallet()
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [contractWithSigner, setContractWithSigner] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    if (provider && chainId) {
      try {
        const contractInstance = getEventTicketContract(provider, chainId)
        setContract(contractInstance)
      } catch (error) {
        console.error("Error creating contract instance:", error)
        setContract(null)
      }
    } else {
      setContract(null)
    }
  }, [provider, chainId])

  useEffect(() => {
    if (signer && chainId) {
      try {
        const contractInstance = getEventTicketContractWithSigner(signer, chainId)
        setContractWithSigner(contractInstance)
      } catch (error) {
        console.error("Error creating contract instance with signer:", error)
        setContractWithSigner(null)
      }
    } else {
      setContractWithSigner(null)
    }
  }, [signer, chainId])

  // Contract read functions
  const isTicketValid = async (tokenId: number): Promise<boolean> => {
    if (!contract) throw new Error("Contract not initialized")
    return contract.isValid(tokenId)
  }

  const getTicketInfo = async (tokenId: number) => {
    if (!contract) throw new Error("Contract not initialized")
    return contract.getTicketInfo(tokenId)
  }

  const getEventInfo = async (eventId: number) => {
    if (!contract) throw new Error("Contract not initialized")
    return contract.getEventInfo(eventId)
  }

  const getTotalSupply = async (): Promise<number> => {
    if (!contract) throw new Error("Contract not initialized")
    const supply = await contract.totalSupply()
    return supply.toNumber()
  }

  // Contract write functions (require signer)
  const mintTicket = async (to: string, eventId: number, seat: string, metadataURI: string) => {
    if (!contractWithSigner) throw new Error("Contract with signer not initialized")
    const tx = await contractWithSigner.mintTicket(to, eventId, seat, metadataURI)
    return tx.wait()
  }

  const mintWithVoucher = async (
    to: string,
    eventId: number,
    seat: string,
    metadataURI: string,
    voucherHash: string,
    signature: string,
    value: bigint,
  ) => {
    if (!contractWithSigner) throw new Error("Contract with signer not initialized")
    const tx = await contractWithSigner.mintWithVoucher(to, eventId, seat, metadataURI, voucherHash, signature, {
      value,
    })
    return tx.wait()
  }

  const verifyTicket = async (tokenId: number) => {
    if (!contractWithSigner) throw new Error("Contract with signer not initialized")
    const tx = await contractWithSigner.verifyTicket(tokenId)
    return tx.wait()
  }

  const useTicket = async (tokenId: number) => {
    if (!contractWithSigner) throw new Error("Contract with signer not initialized")
    const tx = await contractWithSigner.useTicket(tokenId)
    return tx.wait()
  }

  return {
    contract,
    contractWithSigner,
    // Read functions
    isTicketValid,
    getTicketInfo,
    getEventInfo,
    getTotalSupply,
    // Write functions
    mintTicket,
    mintWithVoucher,
    verifyTicket,
    useTicket,
  }
}
