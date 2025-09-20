"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Ticket, Calendar, MapPin, Clock, QrCode, Download, Home } from "lucide-react"
import Link from "next/link"

export default function BuyerDashboard() {
  const { user } = useAuth()

  const stats = [
    { title: "Tickets Owned", value: "8", icon: Ticket },
    { title: "Events Attended", value: "12", icon: Calendar },
    { title: "Upcoming Events", value: "3", icon: Clock },
  ]

  const tickets = [
    {
      id: 1,
      eventTitle: "Neon Dreams Festival",
      date: "2024-03-15",
      time: "19:00",
      venue: "Cyber Arena",
      section: "VIP",
      seat: "A-15",
      status: "active",
      qrCode: "QR123456789",
    },
    {
      id: 2,
      eventTitle: "Digital Art Expo",
      date: "2024-03-22",
      time: "14:00",
      venue: "Future Gallery",
      section: "General",
      seat: "GA-001",
      status: "active",
      qrCode: "QR987654321",
    },
    {
      id: 3,
      eventTitle: "Tech Conference 2024",
      date: "2024-02-10",
      time: "09:00",
      venue: "Innovation Center",
      section: "Premium",
      seat: "P-42",
      status: "used",
      qrCode: "QR456789123",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Holographic Concert",
      date: "2024-04-12",
      image: "/futuristic-concert-stage-with-neon-lights.jpg",
      price: "$120",
    },
    {
      id: 2,
      title: "Blockchain Summit",
      date: "2024-04-18",
      image: "/futuristic-tech-conference-with-blockchain-visuals.jpg",
      price: "$85",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-20 pb-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400">Your tickets and upcoming events</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-cyan-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Tickets */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">My Tickets</CardTitle>
                <CardDescription className="text-slate-400">Your NFT tickets and event access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold mb-1">{ticket.eventTitle}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {ticket.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {ticket.time}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={ticket.status === "active" ? "default" : "secondary"}
                          className={
                            ticket.status === "active"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-slate-600 hover:bg-slate-700"
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {ticket.venue} • {ticket.section} {ticket.seat}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                            <QrCode className="h-4 w-4 mr-1" />
                            QR Code
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/my-tickets">
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:text-white bg-transparent"
                    >
                      View All Tickets
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Discover Events */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Discover Events</CardTitle>
                <CardDescription className="text-slate-400">Upcoming events you might like</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{event.title}</h3>
                          <p className="text-slate-400 text-sm mb-2">{event.date}</p>
                          <p className="text-cyan-400 font-semibold">{event.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/">
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                      Browse All Events
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
