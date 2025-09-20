"use client"

import { cn } from "@/lib/utils"

import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ticket3D } from "@/components/ticket-3d"
import { NeonButton } from "@/components/neon-button"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, Calendar, MapPin, Users, Star, Sparkles, Lock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

// Mock event data - in real app this would come from API/database
const eventData = {
  1: {
    id: 1,
    name: "Neon Dreams Festival",
    date: "2024-03-15",
    time: "19:00",
    venue: "Cyber Arena",
    location: "Neo Tokyo, Sector 7",
    price: "0.05 ETH",
    image: "/futuristic-concert-stage-with-neon-lights.jpg",
    description:
      "Experience the future of music at Neon Dreams Festival. Featuring top electronic artists, holographic performances, and immersive 3D visuals that will transport you to another dimension.",
    capacity: 5000,
    sold: 3247,
    features: ["3D Holographic Stage", "VR Experience Zones", "NFT Art Gallery", "Exclusive Merch"],
    artists: ["CyberSynth", "Neon Pulse", "Digital Dreams", "Quantum Beat"],
  },
  2: {
    id: 2,
    name: "Digital Art Expo",
    date: "2024-03-22",
    time: "14:00",
    venue: "Meta Gallery",
    location: "Virtual District, Level 42",
    price: "0.03 ETH",
    image: "/digital-art-gallery-with-holographic-displays.jpg",
    description:
      "Discover the cutting-edge of digital art in this immersive exhibition featuring NFT masterpieces, interactive installations, and live digital art creation.",
    capacity: 2000,
    sold: 1456,
    features: ["Interactive NFT Gallery", "Live Art Creation", "AR Exhibitions", "Artist Meet & Greet"],
    artists: ["PixelMaster", "CryptoCanvas", "MetaArt Collective", "Digital Dreamers"],
  },
  3: {
    id: 3,
    name: "Blockchain Summit",
    date: "2024-04-01",
    time: "09:00",
    venue: "Tech Hub",
    location: "Innovation Center, Floor 50",
    price: "0.08 ETH",
    image: "/futuristic-tech-conference-with-blockchain-visuals.jpg",
    description:
      "Join industry leaders and innovators at the premier blockchain conference. Learn about the latest developments in DeFi, NFTs, and Web3 technologies.",
    capacity: 3000,
    sold: 2789,
    features: ["Expert Keynotes", "Networking Sessions", "Tech Demos", "Startup Showcase"],
    artists: ["Vitalik Buterin", "Changpeng Zhao", "Brian Armstrong", "Cathie Wood"],
  },
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { isAuthenticated, user } = useAuth()

  const event = eventData[params.id as keyof typeof eventData]

  if (!event) {
    return <div>Event not found</div>
  }

  const availableSeats = event.capacity - event.sold
  const soldPercentage = (event.sold / event.capacity) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Event Info */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="relative mb-8">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.name}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent rounded-lg" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">{event.price}</Badge>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{event.name}</h1>

              <div className="flex flex-wrap gap-4 mb-6 text-slate-300">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-cyan-400" />
                  {event.date} at {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-purple-400" />
                  {event.venue}, {event.location}
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-pink-400" />
                  {availableSeats} seats available
                </div>
              </div>

              <p className="text-slate-300 text-lg mb-8 leading-relaxed">{event.description}</p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Event Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {event.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-slate-300">
                      <Star className="h-4 w-4 mr-2 text-cyan-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Artists/Speakers */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">{event.id === 3 ? "Speakers" : "Artists"}</h3>
                <div className="flex flex-wrap gap-2">
                  {event.artists.map((artist, index) => (
                    <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                      {artist}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <Card className="bg-slate-900/50 border-slate-700 p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-semibold">Availability</span>
                  <span className="text-slate-300">
                    {event.sold} / {event.capacity} sold
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${soldPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400">
                  {soldPercentage > 80 ? "Almost sold out!" : "Good availability"}
                </p>
              </Card>
            </motion.div>

            {/* 3D Ticket Preview & Purchase */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-slate-900/50 border-slate-700 p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Your NFT Ticket Preview</h3>

                {/* 3D Ticket */}
                <div className="h-64 mb-6">
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <Suspense fallback={null}>
                      <Environment preset="night" />
                      <ambientLight intensity={0.2} />
                      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#ff00ff" />

                      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
                        <Ticket3D />
                      </Float>

                      <OrbitControls enableZoom={false} enablePan={false} />
                    </Suspense>
                  </Canvas>
                </div>

                <p className="text-center text-slate-400 mb-6 text-sm">
                  Click and drag to rotate • Click ticket to flip and see QR code
                </p>

                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <Lock className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h4 className="text-white font-semibold mb-2">Login Required</h4>
                    <p className="text-slate-400 mb-6">Please login to purchase tickets</p>
                    <Link href="/login">
                      <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                        Login to Purchase
                      </Button>
                    </Link>
                  </div>
                ) : user?.role !== "buyer" ? (
                  <div className="text-center py-8">
                    <Lock className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h4 className="text-white font-semibold mb-2">Buyer Account Required</h4>
                    <p className="text-slate-400 mb-6">Only buyer accounts can purchase tickets</p>
                    <Link href="/buyer/dashboard">
                      <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Seat Selection */}
                    <div className="mb-6">
                      <label className="block text-white font-semibold mb-3">Select Seat Type</label>
                      <div className="grid grid-cols-1 gap-3">
                        {["General Admission", "VIP Section", "Premium Floor"].map((seatType) => (
                          <button
                            key={seatType}
                            onClick={() => setSelectedSeat(seatType)}
                            className={cn(
                              "p-3 rounded-lg border text-left transition-all",
                              selectedSeat === seatType
                                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                                : "border-slate-600 text-slate-300 hover:border-slate-500",
                            )}
                          >
                            <div className="flex justify-between items-center">
                              <span>{seatType}</span>
                              <span className="font-semibold">{event.price}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-6">
                      <label className="block text-white font-semibold mb-3">Quantity</label>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="border-slate-600 text-slate-300"
                        >
                          -
                        </Button>
                        <span className="text-white font-semibold px-4">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="border-slate-600 text-slate-300"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">
                          Total ({quantity} ticket{quantity > 1 ? "s" : ""})
                        </span>
                        <span className="text-2xl font-bold text-white">
                          {(Number.parseFloat(event.price.replace(" ETH", "")) * quantity).toFixed(3)} ETH
                        </span>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <NeonButton className="w-full text-lg py-6" disabled={!selectedSeat}>
                      <Sparkles className="mr-2 h-5 w-5" />
                      {selectedSeat ? "Purchase NFT Ticket" : "Select Seat Type"}
                    </NeonButton>

                    <p className="text-center text-slate-500 text-xs mt-4">
                      Secure blockchain transaction • Instant NFT minting
                    </p>
                  </>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
