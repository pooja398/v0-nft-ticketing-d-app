import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { WalletProvider } from "@/contexts/wallet-context"
import { AuthProvider } from "@/contexts/auth-context"
import { NetworkWarning } from "@/components/network-warning"
import "./globals.css"

export const metadata: Metadata = {
  title: "NFT Tickets - Blockchain Event Ticketing",
  description: "Experience events like never before with blockchain-verified NFT tickets and 3D collectibles",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <WalletProvider>
            <NetworkWarning />
            <Suspense fallback={null}>{children}</Suspense>
          </WalletProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
