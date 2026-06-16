'use client'

import { useEffect, useState } from 'react'

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check localStorage first
    const saved = localStorage.getItem('theme')
    let prefersDark = false

    if (saved === 'dark' || saved === 'light') {
      prefersDark = saved === 'dark'
    } else {
      // Use system preference
      prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
    }

    setIsDark(prefersDark)
    applyTheme(prefersDark)
  }, [])

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newValue = !isDark
    setIsDark(newValue)
    applyTheme(newValue)
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
  }

  // Prevent hydration mismatch by not rendering button until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 w-10 h-10 sm:w-10 sm:h-10 rounded-full border border-solid border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--accent-soft)] flex items-center justify-center transition-colors flex-shrink-0"
        aria-label="Toggle theme"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <svg
            className="w-5 h-5 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zm.464-4.536a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zm-2.828-2.828l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414zM13 11a1 1 0 110-2 1 1 0 010 2zM6.464 3.536l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414zm2.828-2.828l.707.707a1 1 0 11-1.414 1.414L7.05 1.05A1 1 0 018.464.636zM3 11a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      {children}
    </>
  )
}
