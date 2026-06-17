'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'

// Show progress on individual post/piece pages, not listing pages
function isReadingPage(pathname: string) {
  return (
    /^\/blog\/.+/.test(pathname) ||
    /^\/creative\/[^/]+\/.+/.test(pathname)
  )
}

export default function Header() {
  const { isDark, mounted, toggleTheme } = useTheme()
  const pathname = usePathname()
  const reading = isReadingPage(pathname)

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!reading) {
      setProgress(0)
      return
    }

    const update = () => {
      const scrolled = window.scrollY
      const total =
        document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? scrolled / total : 0)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [reading, pathname])

  const navLinks = [
    { href: '/blog', label: 'Writing' },
    { href: '/creative', label: 'Creative' },
  ]

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
        {/* Site name */}
        <Link
          href="/"
          className="text-base font-semibold tracking-tight transition-opacity hover:opacity-70"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}
        >
          [Your Name]
        </Link>

        {/* Nav + toggle */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm transition-colors"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  textDecoration: active ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                }}
              >
                {link.label}
              </Link>
            )
          })}

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{
              color: 'var(--text-muted)',
              opacity: mounted ? 1 : 0,
              pointerEvents: mounted ? 'auto' : 'none',
            }}
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>

      {/* Reading progress — thin bar at very bottom of header */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'var(--border)' }}
        aria-hidden="true"
      >
        <div
          className="h-full"
          style={{
            width: reading ? `${progress * 100}%` : '0%',
            background: 'var(--accent)',
            transition: progress === 0 ? 'none' : 'width 0.1s linear',
          }}
        />
      </div>
    </header>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-9.9l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464L4.343 5.757a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  )
}
