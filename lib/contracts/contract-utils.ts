import { ethers } from "ethers"
import EventTicketABI from "./EventTicket.json"

// Contract configuration
export const CONTRACT_CONFIG = {
  // These will be updated after deployment
  addresses: {
    localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Default Hardhat address
    sepolia: "", // Set after deployment
    goerli: "", // Set after deployment
    mainnet: "", // Set after deployment
  },
  abi: EventTicketABI.abi,
}

export function getContractAddress(chainId: number): string {
  switch (chainId) {
    case 1337: // Hardhat/Localhost
    case 31337: // Hardhat alternative
      return CONTRACT_CONFIG.addresses.localhost
    case 11155111: // Sepolia
      return CONTRACT_CONFIG.addresses.sepolia
    case 5: // Goerli
      return CONTRACT_CONFIG.addresses.goerli
    case 1: // Mainnet
      return CONTRACT_CONFIG.addresses.mainnet
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`)
  }
}

export function getEventTicketContract(provider: ethers.BrowserProvider, chainId: number) {
  const address = getContractAddress(chainId)
  return new ethers.Contract(address, CONTRACT_CONFIG.abi, provider)
}

export function getEventTicketContractWithSigner(signer: ethers.JsonRpcSigner, chainId: number) {
  const address = getContractAddress(chainId)
  return new ethers.Contract(address, CONTRACT_CONFIG.abi, signer)
}

// Helper functions for contract interactions
export async function mintTicket(
  signer: ethers.JsonRpcSigner,
  chainId: number,
  to: string,
  eventId: number,
  seat: string,
  metadataURI: string,
) {
  const contract = getEventTicketContractWithSigner(signer, chainId)
  const tx = await contract.mintTicket(to, eventId, seat, metadataURI)
  return tx.wait()
}

export async function verifyTicket(provider: ethers.BrowserProvider, chainId: number, tokenId: number) {
  const contract = getEventTicketContract(provider, chainId)
  return contract.isValid(tokenId)
}

export async function getTicketInfo(provider: ethers.BrowserProvider, chainId: number, tokenId: number) {
  const contract = getEventTicketContract(provider, chainId)
  return contract.getTicketInfo(tokenId)
}

export async function getEventInfo(provider: ethers.BrowserProvider, chainId: number, eventId: number) {
  const contract = getEventTicketContract(provider, chainId)
  return contract.getEventInfo(eventId)
}

// Format utilities
export function formatPrice(priceWei: string): string {
  return `${ethers.formatEther(priceWei)} ETH`
}

export function parsePrice(priceEth: string): bigint {
  return ethers.parseEther(priceEth)
}
