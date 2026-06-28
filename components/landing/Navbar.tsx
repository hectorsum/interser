'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '#about', label: 'Nosotros' },
    { href: '#approach', label: 'Enfoque' },
    { href: '#services', label: 'Servicios' },
    { href: '#testimonials', label: 'Testimonios' },
    { href: '#contact', label: 'Contacto' },
  ]

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300 border-0"
        style={{
          padding: scrolled ? '0.7rem 2rem' : '1.2rem 2rem',
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', width: '180px', height: '60px', position: 'relative' }}>
          <Image
            src="/assets/logo-main.png"
            alt="Interser"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.95rem] font-medium transition-colors duration-200 hover:text-[#c47a3a]"
              style={{
                fontFamily: 'var(--font-raleway)',
                color: scrolled ? '#2d2d2d' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              padding: '0.5rem 1.2rem',
              background: '#c47a3a',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: 'var(--font-montserrat)',
            }}
          >
            Agendar
          </a>
        </nav>

        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Abrir menú"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span className="w-6 h-0.5 block transition-colors" style={{ background: scrolled ? '#2d2d2d' : 'white' }} />
          <span className="w-6 h-0.5 block transition-colors" style={{ background: scrolled ? '#2d2d2d' : 'white' }} />
          <span className="w-6 h-0.5 block transition-colors" style={{ background: scrolled ? '#2d2d2d' : 'white' }} />
        </button>

        <div
          className="absolute bottom-0 left-0 h-0.5"
          style={{ width: `${progress}%`, background: '#c47a3a' }}
        />
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10"
          style={{ background: '#2d3a28' }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#c47a3a] transition-colors"
              style={{
                fontSize: '1.6rem',
                fontFamily: 'var(--font-raleway)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '0.8rem 2.4rem',
              background: '#c47a3a',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: 'var(--font-montserrat)',
            }}
          >
            Agendar
          </a>
        </div>
      )}
    </>
  )
}
