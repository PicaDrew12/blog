'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ThemeContextType = {
  isDark: boolean
  mounted: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  mounted: false,
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    let prefersDark = false
    if (saved === 'dark' || saved === 'light') {
      prefersDark = saved === 'dark'
    } else {
      prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    setIsDark(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ isDark, mounted, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
