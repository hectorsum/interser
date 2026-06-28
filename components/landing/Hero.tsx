'use client'

import Image from 'next/image'

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row min-h-screen relative overflow-hidden">
      {/* Left: dark green text column */}
      <div
        className="w-full md:w-[52%] flex items-center pt-28 pb-12 px-6 md:pt-32 md:pb-16 md:pl-24 md:pr-16 relative z-[2] shrink-0"
        style={{ background: '#2d3a28' }}
      >
        <Image
          src="/assets/r12.png"
          alt=""
          width={160}
          height={160}
          style={{ position: 'absolute', bottom: '-10px', left: '-20px', width: '160px', height: 'auto', opacity: 0.15, filter: 'brightness(10)', pointerEvents: 'none' }}
        />
        <Image
          src="/assets/r15.png"
          alt=""
          width={180}
          height={180}
          style={{ position: 'absolute', bottom: '-20px', left: '120px', width: '180px', height: 'auto', opacity: 0.18, pointerEvents: 'none' }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
          {/* Label pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(196,122,58,0.15)',
              border: '1px solid rgba(196,122,58,0.3)',
              borderRadius: '50px',
              padding: '0.4rem 1rem',
              marginBottom: '2rem',
            }}
          >
            <span style={{ width: '7px', height: '7px', background: '#c47a3a', borderRadius: '50%', display: 'block', flexShrink: 0 }} />
            <span
              style={{
                fontSize: '0.78rem',
                color: '#c47a3a',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Psicología basada en evidencia
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 1.1,
              color: 'white',
              fontFamily: 'var(--font-raleway)',
              fontWeight: 600,
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            Construyendo<br />
            mentes<br />
            <em style={{ color: '#c47a3a', fontStyle: 'italic', fontWeight: 500 }}>resilientes</em>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.65)',
              fontFamily: 'var(--font-montserrat)',
              marginBottom: '2.5rem',
            }}
          >
            Descubre un enfoque personalizado a la terapia que respeta y se adapta a tus necesidades únicas.
          </p>

          {/* CTA */}
          <a
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.95rem 2rem',
              background: '#c47a3a',
              color: 'white',
              textDecoration: 'none',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '3.5rem',
              transition: 'background 0.3s, transform 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#b06830'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#c47a3a'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Agendar una sesión
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

          {/* Stats */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '2rem', display: 'flex', gap: 0 }}>
            {[
              { value: '3+', label: 'Terapeutas', border: true },
              { value: '100+', label: 'Pacientes', border: true },
              { value: '5', label: 'Especialidades', border: false },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: i === 0 ? '0 2rem 0 0' : i === 1 ? '0 2rem' : '0 0 0 2rem',
                  borderRight: stat.border ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#c47a3a', fontFamily: 'var(--font-raleway)', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-montserrat)', marginTop: '0.4rem', letterSpacing: '0.04em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: image with organic shape — hidden on mobile */}
      <div
        className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ padding: '6rem 2rem 1rem 1rem', background: '#2d3a28' }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: '520px', height: '680px' }}>
          {/* Photo clipped to organic blob */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '92%',
              height: '72%',
              overflow: 'hidden',
              borderRadius: '60% 40% 55% 45% / 50% 55% 45% 50%',
              zIndex: 2,
            }}
          >
            <Image
              src="/assets/hero-therapy-new.jpg"
              alt="Consultorio Interser"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
              priority
            />
          </div>

          <Image
            src="/assets/r15-orange.png"
            alt=""
            width={300}
            height={300}
            style={{ position: 'absolute', top: '260px', left: '-20px', width: '300px', height: 'auto', zIndex: 1, opacity: 0.45, pointerEvents: 'none' }}
          />
          <Image
            src="/assets/r13-pear.png"
            alt=""
            width={175}
            height={175}
            style={{ position: 'absolute', top: '240px', right: '0px', width: '175px', height: 'auto', zIndex: 1, opacity: 0.45, pointerEvents: 'none' }}
          />
          <Image
            src="/assets/r19-circle.png"
            alt=""
            width={160}
            height={160}
            style={{ position: 'absolute', top: '-15px', right: '-25px', width: '160px', height: 'auto', zIndex: 3, opacity: 0.5, pointerEvents: 'none' }}
          />
        </div>
      </div>
    </section>
  )
}
