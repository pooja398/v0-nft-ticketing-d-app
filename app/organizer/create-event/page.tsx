"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useWallet } from "@/contexts/wallet-context"
import { useContract } from "@/hooks/use-contract"
import { Calendar, MapPin, DollarSign, Users, Upload, Loader2 } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"

function CreateEventForm() {
  const router = useRouter()
  const { user } = useAuth()
  const { isConnected, account } = useWallet()
  const { contract, isLoading: contractLoading } = useContract()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    venue: "",
    price: "",
    totalTickets: "",
    image: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !contract || !account) {
      alert("Please connect your wallet first")
      return
    }

    setIsCreating(true)

    try {
      console.log("[v0] Creating event on blockchain...")

      // Convert price from ETH to Wei
      const priceInWei = (Number.parseFloat(formData.price) * 1e18).toString()

      // Create event on smart contract
      const tx = await contract.createEvent(
        formData.name,
        formData.description,
        Math.floor(new Date(formData.date).getTime() / 1000), // Convert to Unix timestamp
        formData.venue,
        priceInWei,
        Number.parseInt(formData.totalTickets),
        formData.image || `https://picsum.photos/800/400?random=${Date.now()}`,
      )

      console.log("[v0] Transaction sent:", tx.hash)

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("[v0] Event created successfully:", receipt)

      // Also save to backend API
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ...formData,
          organizerId: user?.id,
          contractAddress: contract.address,
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
        }),
      })

      if (response.ok) {
        console.log("[v0] Event saved to database")
        router.push("/organizer/dashboard")
      } else {
        throw new Error("Failed to save event to database")
      }
    } catch (error) {
      console.error("[v0] Error creating event:", error)
      alert("Failed to create event. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Event</h1>
          <p className="text-slate-400">Launch your event on the blockchain</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Event Details</CardTitle>
              <CardDescription className="text-slate-400">
                Fill in the information for your blockchain-verified event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEvent} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">
                      Event Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter event name"
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue" className="text-slate-300">
                      Venue
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        placeholder="Event venue"
                        className="bg-slate-800 border-slate-700 text-white pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your event..."
                    className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-slate-300">
                      Event Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="date"
                        name="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-slate-700 text-white pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-slate-300">
                      Ticket Price (ETH)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.001"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.05"
                        className="bg-slate-800 border-slate-700 text-white pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalTickets" className="text-slate-300">
                      Total Tickets
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="totalTickets"
                        name="totalTickets"
                        type="number"
                        value={formData.totalTickets}
                        onChange={handleInputChange}
                        placeholder="500"
                        className="bg-slate-800 border-slate-700 text-white pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-slate-300">
                    Event Image URL (Optional)
                  </Label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="image"
                      name="image"
                      type="url"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="bg-slate-800 border-slate-700 text-white pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || contractLoading || !isConnected}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Event...
                      </>
                    ) : (
                      "Create Event"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default function CreateEventPage() {
  return (
    <AuthGuard requiredRole="organizer">
      <CreateEventForm />
    </AuthGuard>
  )
}
