'use client'

import { useEffect, useState } from 'react'
import { Heart, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Medical Need', href: '#medical-need' },
  { label: 'Progress', href: '#progress' },
  { label: 'Donate', href: '#donate' },
  { label: 'Documents', href: '#documents' },
  { label: 'Contact', href: '#contact' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/95 shadow-sm backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <a
          href="#home"
          className={cn(
            'flex items-center gap-2 font-heading text-lg font-bold transition-colors',
            scrolled ? 'text-primary' : 'text-white',
          )}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-urgent text-urgent-foreground">
            <Heart className="size-5" fill="currentColor" aria-hidden="true" />
          </span>
          Save A Life
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-teal',
                  scrolled ? 'text-foreground' : 'text-white/90',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#donate"
            className="hidden rounded-full bg-urgent px-5 py-2 text-sm font-semibold text-urgent-foreground shadow-md transition-transform hover:scale-105 sm:inline-flex"
          >
            Donate Now
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className={cn(
              'inline-flex size-10 items-center justify-center rounded-md lg:hidden',
              scrolled ? 'text-foreground' : 'text-white',
            )}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <ul className="space-y-1 px-4 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#donate"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-urgent px-5 py-2.5 text-center text-base font-semibold text-urgent-foreground"
              >
                Donate Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
