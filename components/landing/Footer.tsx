'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const links = [
    { href: '#about', label: 'Nosotros' },
    { href: '#approach', label: 'Enfoque' },
    { href: '#services', label: 'Servicios' },
    { href: '#testimonials', label: 'Testimonios' },
    { href: '#contact', label: 'Contacto' },
  ]

  const socialLinks = [
    {
      href: 'https://instagram.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      href: 'https://facebook.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      href: 'https://wa.me/51983542723',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
    {
      href: 'mailto:emphochumbiauca@gmail.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
  ]

  return (
    <footer style={{ background: '#1a1a18', color: 'white', padding: '5rem 4rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Top 3-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr 1fr',
            gap: '3rem',
            marginBottom: '4rem',
            alignItems: 'start',
          }}
        >
          {/* Col 1: Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/assets/logo-footer.png"
              alt="Interser"
              width={360}
              height={120}
              style={{ width: '180px', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Col 2: About + social */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-raleway)',
                fontSize: '1.2rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: 'white',
              }}
            >
              Sobre Interser
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.9rem',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.65)',
                marginBottom: '1.5rem',
              }}
            >
              Somos un grupo de 3 terapeutas comprometidos con tu bienestar. Trabajamos desde un espacio seguro y confidencial, con enfoque en regulación emocional, trauma y conductas de riesgo.
            </p>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'white')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Nav links */}
          <div style={{ justifySelf: 'center' }}>
            <h3
              style={{
                fontFamily: 'var(--font-raleway)',
                fontSize: '1.2rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: 'white',
              }}
            >
              Enlaces
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-start' }}>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'white')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }} />

        {/* Copyright */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <p
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.4)',
              margin: 0,
            }}
          >
            © 2025 Interser. Todos los derechos reservados.&nbsp;&nbsp;|&nbsp;&nbsp;Developed by{' '}
            <span style={{ color: '#c47a3a' }}>Hector Herrera</span>
          </p>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'rgba(255,255,255,0.2)',
              textDecoration: 'none',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              transition: 'color 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Administración
          </Link>
        </div>
      </div>
    </footer>
  )
}
