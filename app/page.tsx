"use client"

import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Ticket3D } from "@/components/ticket-3d"
import { NeonButton } from "@/components/neon-button"
import { WalletButton } from "@/components/wallet-button"
import { Navigation } from "@/components/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { useAuth } from "@/contexts/auth-context"
import { ArrowRight, Sparkles, Zap, LogIn } from "lucide-react"
import Link from "next/link"

const events = [
  {
    id: 1,
    name: "Neon Dreams Festival",
    date: "2024-03-15",
    venue: "Cyber Arena",
    price: "0.05 ETH",
    image: "/futuristic-concert-stage-with-neon-lights.jpg",
  },
  {
    id: 2,
    name: "Digital Art Expo",
    date: "2024-03-22",
    venue: "Meta Gallery",
    price: "0.03 ETH",
    image: "/digital-art-gallery-with-holographic-displays.jpg",
  },
  {
    id: 3,
    name: "Blockchain Summit",
    date: "2024-04-01",
    venue: "Tech Hub",
    price: "0.08 ETH",
    image: "/futuristic-tech-conference-with-blockchain-visuals.jpg",
  },
]

export default function HomePage() {
  const { isConnected } = useWallet()
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Navigation />

      {/* Hero Section with 3D Ticket */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />

        <div className="container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
                <div className="flex-1">
                  <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 text-balance">
                    NFT Tickets
                    <br />
                    <span className="text-4xl lg:text-5xl">Reimagined</span>
                  </h1>
                  <p className="text-xl text-slate-300 mb-8 text-pretty">
                    Experience events like never before with blockchain-verified tickets, 3D collectibles, and seamless
                    verification.
                  </p>
                </div>
                <div className="lg:hidden w-full max-w-md">
                  <img
                    src="/futuristic-concert-stage-with-neon-lights.jpg"
                    alt="Futuristic NFT Event Experience"
                    className="w-full h-64 object-cover rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {isAuthenticated ? (
                  <Link href={user?.role === "organizer" ? "/organizer/dashboard" : "/buyer/dashboard"}>
                    <NeonButton size="lg" className="group">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </NeonButton>
                  </Link>
                ) : (
                  <Link href="/login">
                    <NeonButton size="lg" className="group">
                      <LogIn className="mr-2 h-5 w-5" />
                      Login to Get Started
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </NeonButton>
                  </Link>
                )}
                {!isConnected && isAuthenticated && (
                  <WalletButton
                    size="lg"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
                  />
                )}
              </div>
            </motion.div>

            {/* 3D Ticket Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-96 lg:h-[500px] relative"
            >
              <div className="hidden lg:block absolute inset-0 rounded-2xl overflow-hidden">
                <img
                  src="/futuristic-concert-stage-with-neon-lights.jpg"
                  alt="Futuristic NFT Event Experience"
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              </div>

              <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="relative z-10">
                <Suspense fallback={null}>
                  <Environment preset="night" />
                  <ambientLight intensity={0.2} />
                  <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                  <pointLight position={[-10, -10, 10]} intensity={0.5} color="#ff00ff" />

                  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Ticket3D />
                  </Float>

                  <OrbitControls enableZoom={false} enablePan={false} />
                </Suspense>
              </Canvas>
            </motion.div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Events Carousel */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Upcoming Events</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Discover exclusive events and secure your NFT tickets with blockchain verification
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Link href={`/events/${event.id}`}>
                  <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {event.price}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-slate-400 mb-1">{event.venue}</p>
                      <p className="text-slate-500 text-sm mb-4">{event.date}</p>

                      <NeonButton className="w-full group-hover:scale-105 transition-transform">
                        <Sparkles className="mr-2 h-4 w-4" />
                        View Details
                      </NeonButton>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instant Verification</h3>
              <p className="text-slate-400">
                QR codes linked to blockchain ensure authentic, tamper-proof ticket verification
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">3D Collectibles</h3>
              <p className="text-slate-400">Each ticket is a unique 3D NFT collectible with interactive animations</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Seamless Experience</h3>
              <p className="text-slate-400">
                Connect your wallet, buy tickets, and verify entry with just a few clicks
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
