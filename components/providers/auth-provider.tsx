"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem("bonsai_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - replace with real API call
    const mockUser: User = {
      id: "1",
      name: "Zen Gardener",
      email,
      avatar: "/diverse-group.png",
    }
    setUser(mockUser)
    localStorage.setItem("bonsai_user", JSON.stringify(mockUser))
  }

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup - replace with real API call
    const mockUser: User = {
      id: "2",
      name,
      email,
      avatar: "/diverse-group.png",
    }
    setUser(mockUser)
    localStorage.setItem("bonsai_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bonsai_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
