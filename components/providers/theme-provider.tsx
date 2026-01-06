"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("bonsai_theme") as Theme | null
    if (stored && (stored === "light" || stored === "dark")) {
      setThemeState(stored)
    }
    setMounted(true)

    // Listen for theme sync events from AuthProvider
    const handleThemeSync = (event: CustomEvent<{ theme: Theme }>) => {
      if (event.detail.theme === "light" || event.detail.theme === "dark") {
        setThemeState(event.detail.theme)
      }
    }

    window.addEventListener("theme-sync", handleThemeSync as EventListener)
    return () => {
      window.removeEventListener("theme-sync", handleThemeSync as EventListener)
    }
  }, [])

  // Apply theme class to document element
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // Remove both classes first
    root.classList.remove("light", "dark")

    // Add the current theme class
    root.classList.add(theme)
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("bonsai_theme", newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
