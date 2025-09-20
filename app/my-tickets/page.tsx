"use client"

import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ticket3D } from "@/components/ticket-3d"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Calendar, MapPin, QrCode, Download, Share2, Eye } from "lucide-react"

// Mock user tickets data
const userTickets = [
  {
    id: 1,
    tokenId: 1337,
    eventName: "Neon Dreams Festival",
    date: "2024-03-15",
    venue: "Cyber Arena",
    seat: "A-42",
    price: "0.05 ETH",
    image: "/futuristic-concert-stage-with-neon-lights.jpg",
    status: "active",
    purchaseDate: "2024-02-15",
  },
  {
    id: 2,
    tokenId: 2468,
    eventName: "Digital Art Expo",
    date: "2024-03-22",
    venue: "Meta Gallery",
    seat: "VIP-12",
    price: "0.03 ETH",
    image: "/digital-art-gallery-with-holographic-displays.jpg",
    status: "active",
    purchaseDate: "2024-02-20",
  },
  {
    id: 3,
    tokenId: 9876,
    eventName: "Blockchain Summit",
    date: "2024-04-01",
    venue: "Tech Hub",
    seat: "PREM-8",
    price: "0.08 ETH",
    image: "/futuristic-tech-conference-with-blockchain-visuals.jpg",
    status: "used",
    purchaseDate: "2024-01-28",
  },
]

export default function MyTicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null)
  const [showQR, setShowQR] = useState<number | null>(null)

  return (
    <AuthGuard requiredRole="buyer">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <Navigation />

        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">My NFT Tickets</h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Your collection of blockchain-verified event tickets
              </p>
            </motion.div>

            {userTickets.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <QrCode className="h-12 w-12 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No tickets yet</h3>
                <p className="text-slate-400 mb-8">Purchase your first NFT ticket to get started</p>
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">Browse Events</Button>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Tickets Grid */}
                <div className="lg:col-span-2">
                  <div className="grid md:grid-cols-2 gap-6">
                    {userTickets.map((ticket, index) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedTicket(ticket.id)}
                      >
                        <Card
                          className={`bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 overflow-hidden ${
                            selectedTicket === ticket.id ? "ring-2 ring-cyan-500" : ""
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={ticket.image || "/placeholder.svg"}
                              alt={ticket.eventName}
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                            <div className="absolute top-3 right-3">
                              <Badge
                                className={
                                  ticket.status === "active"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                                }
                              >
                                {ticket.status === "active" ? "Active" : "Used"}
                              </Badge>
                            </div>
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs">
                                #{ticket.tokenId}
                              </Badge>
                            </div>
                          </div>

                          <div className="p-4">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                              {ticket.eventName}
                            </h3>

                            <div className="space-y-1 text-sm text-slate-400 mb-4">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-2" />
                                {ticket.date}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-2" />
                                {ticket.venue} • Seat {ticket.seat}
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-slate-300 font-semibold">{ticket.price}</span>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowQR(showQR === ticket.id ? null : ticket.id)
                                  }}
                                >
                                  <QrCode className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                                >
                                  <Share2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {showQR === ticket.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-4 p-4 bg-white rounded-lg"
                              >
                                <div className="w-32 h-32 bg-black mx-auto mb-2 flex items-center justify-center">
                                  <QrCode className="h-16 w-16 text-white" />
                                </div>
                                <p className="text-center text-xs text-slate-600">Scan at venue entrance</p>
                              </motion.div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 3D Ticket Preview */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <Card className="bg-slate-900/50 border-slate-700 p-6 sticky top-24">
                      <h3 className="text-xl font-bold text-white mb-4 text-center">3D Ticket View</h3>

                      {selectedTicket ? (
                        <>
                          <div className="h-64 mb-4">
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

                          <div className="space-y-3">
                            <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                              <Download className="h-4 w-4 mr-2" />
                              Download Ticket
                            </Button>
                            <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                              <Eye className="h-4 w-4 mr-2" />
                              View on OpenSea
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <QrCode className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                          <p className="text-slate-400">Select a ticket to view in 3D</p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
