'use client'

import Image from 'next/image'

const WA_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

export default function Contact() {
  return (
    <section
      id="contact"
      style={{ padding: '6rem 4rem', background: '#fafaf8', position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative flowers */}
      <Image
        src="/assets/r9-flower.svg"
        alt=""
        width={340}
        height={340}
        style={{ position: 'absolute', right: '-80px', bottom: '-60px', width: '340px', height: 'auto', opacity: 0.09, pointerEvents: 'none' }}
      />
      <Image
        src="/assets/r9-flower.svg"
        alt=""
        width={260}
        height={260}
        style={{ position: 'absolute', left: '-100px', top: '-60px', width: '260px', height: 'auto', opacity: 0.06, pointerEvents: 'none', transform: 'rotate(60deg)' }}
      />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2
            style={{
              fontSize: '2.8rem',
              fontFamily: 'var(--font-raleway)',
              color: '#2d1a0e',
              lineHeight: 1.2,
              marginBottom: '1.2rem',
              fontWeight: 500,
            }}
          >
            ¿Quieres agendar<br />una sesión?
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#5d5d5d',
              lineHeight: 1.75,
              fontFamily: 'var(--font-montserrat)',
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            Escríbenos directamente por WhatsApp y con gusto te orientamos para encontrar el acompañamiento que necesitas.
          </p>
        </div>

        {/* WhatsApp CTA card */}
        <div
          style={{
            background: '#2d3a28',
            borderRadius: '24px',
            padding: '3rem 3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2.5rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem', flex: 1, minWidth: '220px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-montserrat)', marginBottom: '0.3rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                WhatsApp
              </p>
              <p style={{ fontSize: '1.5rem', color: 'white', fontFamily: 'var(--font-raleway)', fontWeight: 600, letterSpacing: '0.02em' }}>
                +51 983 542 723
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/51983542723?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20sesi%C3%B3n."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.95rem 2rem',
              background: '#c47a3a',
              color: 'white',
              textDecoration: 'none',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              transition: 'background 0.3s, transform 0.2s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#b06830'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#c47a3a'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Escribirnos ahora
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* Bottom info row */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'stretch' }}>
          {/* Email */}
          <div
            style={{
              flex: 1,
              minWidth: '200px',
              background: '#f0eeec',
              borderRadius: '16px',
              padding: '1.8rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c47a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#9a8a7a', fontFamily: 'var(--font-montserrat)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Email
              </p>
              <p style={{ fontSize: '0.9rem', color: '#2d1a0e', fontFamily: 'var(--font-montserrat)', fontWeight: 600 }}>
                emphochumbiauca@gmail.com
              </p>
            </div>
          </div>

          {/* Social */}
          <div
            style={{
              flexShrink: 0,
              background: '#f0eeec',
              borderRadius: '16px',
              padding: '1.8rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <p style={{ fontSize: '0.8rem', color: '#9a8a7a', fontFamily: 'var(--font-montserrat)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
              Redes sociales
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {[
                {
                  href: 'https://instagram.com',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  href: 'https://facebook.com',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '42px',
                    height: '42px',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2d1a0e',
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
