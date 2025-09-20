"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type UserRole = "organizer" | "buyer"

interface User {
  id: string
  email: string
  role: UserRole
  name: string
  walletAddress?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")

      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - replace with actual API response
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role,
        name: email.split("@")[0],
      }

      const token = `mock_token_${Date.now()}`

      localStorage.setItem("auth_token", token)
      localStorage.setItem("user_data", JSON.stringify(userData))

      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - replace with actual API response
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role,
        name,
      }

      const token = `mock_token_${Date.now()}`

      localStorage.setItem("auth_token", token)
      localStorage.setItem("user_data", JSON.stringify(userData))

      setUser(userData)
    } catch (error) {
      console.error("Signup error:", error)
      throw new Error("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setUser(null)
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const updatedUser = { ...user, ...updates }
      localStorage.setItem("user_data", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error("Profile update error:", error)
      throw new Error("Failed to update profile")
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
