"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { WalletButton } from "@/components/wallet-button"
import { useAuth } from "@/contexts/auth-context"
import { Ticket, Home, User, QrCode, LogOut, Settings, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Header3D } from "@/components/3d-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  const showBackButton =
    pathname.includes("/dashboard") ||
    pathname.includes("/events/") ||
    pathname.includes("/my-tickets") ||
    pathname.includes("/verify")
  const getBackPath = () => {
    if (pathname.includes("/organizer/dashboard")) return "/"
    if (pathname.includes("/buyer/dashboard")) return "/"
    if (pathname.includes("/events/")) return "/"
    if (pathname.includes("/my-tickets")) return "/buyer/dashboard"
    if (pathname.includes("/verify")) return user?.role === "organizer" ? "/organizer/dashboard" : "/buyer/dashboard"
    return "/"
  }

  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { href: "/", label: "Home", icon: Home },
        { href: "/login", label: "Login", icon: User },
      ]
    }

    if (user?.role === "organizer") {
      return [
        { href: "/organizer/dashboard", label: "Dashboard", icon: Home },
        { href: "/", label: "Browse Events", icon: Ticket },
        { href: "/verify", label: "Verify", icon: QrCode },
      ]
    }

    return [
      { href: "/buyer/dashboard", label: "Dashboard", icon: Home },
      { href: "/", label: "Events", icon: Ticket },
      { href: "/my-tickets", label: "My Tickets", icon: User },
      { href: "/verify", label: "Verify", icon: QrCode },
    ]
  }

  const navItems = getNavItems()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(getBackPath())}
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}

              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <Ticket className="h-5 w-5 text-white z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 animate-pulse" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  NFT Tickets
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors",
                        isActive && "text-cyan-400 bg-slate-800/50",
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && <WalletButton className="hidden sm:flex" />}

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-slate-300 hover:text-white">
                      <User className="h-4 w-4 mr-2" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                    <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 hover:bg-slate-800"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                    Login
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="md:hidden text-slate-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {pathname === "/" && (
        <div className="fixed top-16 left-0 right-0 z-40 pointer-events-none">
          <Header3D className="opacity-30" />
        </div>
      )}
    </>
  )
}
