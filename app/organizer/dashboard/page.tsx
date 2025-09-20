"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Calendar, Users, DollarSign, TrendingUp, Plus, Eye, Edit, Trash2, Home } from "lucide-react"
import Link from "next/link"

export default function OrganizerDashboard() {
  const { user } = useAuth()

  const stats = [
    { title: "Total Events", value: "12", icon: Calendar, change: "+2 this month" },
    { title: "Total Attendees", value: "2,847", icon: Users, change: "+15% from last month" },
    { title: "Revenue", value: "45.23 ETH", icon: DollarSign, change: "+22% from last month" },
    { title: "Avg. Ticket Price", value: "0.085 ETH", icon: TrendingUp, change: "+5% from last month" },
  ]

  const events = [
    {
      id: 1,
      title: "Neon Dreams Festival",
      date: "2024-03-15",
      status: "active",
      sold: 450,
      total: 500,
      revenue: "22.5 ETH",
    },
    {
      id: 2,
      title: "Digital Art Expo",
      date: "2024-03-22",
      status: "draft",
      sold: 0,
      total: 200,
      revenue: "0 ETH",
    },
    {
      id: 3,
      title: "Tech Conference 2024",
      date: "2024-04-05",
      status: "active",
      sold: 180,
      total: 300,
      revenue: "15.3 ETH",
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
          <p className="text-slate-400">Manage your blockchain events and track your success</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                        <p className="text-green-400 text-xs mt-1">{stat.change}</p>
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

        {/* Events Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Your Events</CardTitle>
                  <CardDescription className="text-slate-400">Manage and track your event performance</CardDescription>
                </div>
                <Link href="/organizer/create-event">
                  <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold">{event.title}</h3>
                        <Badge
                          variant={event.status === "active" ? "default" : "secondary"}
                          className={
                            event.status === "active"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-slate-600 hover:bg-slate-700"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-slate-400">
                        <span>📅 {event.date}</span>
                        <span>
                          🎫 {event.sold}/{event.total} sold
                        </span>
                        <span>💰 {event.revenue}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
