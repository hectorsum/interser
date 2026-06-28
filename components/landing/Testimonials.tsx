'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

const testimonials = [
  {
    quote: 'El proceso terapéutico ha sido transformador. Encontré un espacio seguro donde pude trabajar mis miedos con mucha profesionalidad.',
    author: 'María R.',
    role: 'Paciente',
  },
  {
    quote: 'La evaluación fue muy completa y los resultados me ayudaron a entender mucho mejor a mi hijo. Recomiendo totalmente.',
    author: 'Claudia M.',
    role: 'Madre de paciente',
  },
  {
    quote: 'Gracias al acompañamiento aprendí herramientas reales para manejar mi ansiedad en el día a día. Un cambio enorme en mi vida.',
    author: 'Diego S.',
    role: 'Paciente',
  },
]

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [dir, setDir] = useState<1 | -1>(1)
  const [paused, setPaused] = useState(false)
  const [hoverLeft, setHoverLeft] = useState(false)
  const [hoverRight, setHoverRight] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((index: number, direction: 1 | -1) => {
    if (transitioning) return
    setDir(direction)
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(index)
      setTransitioning(false)
    }, 320)
  }, [transitioning])

  const prev = useCallback(() => go((current - 1 + testimonials.length) % testimonials.length, -1), [current, go])
  const next = useCallback(() => go((current + 1) % testimonials.length, 1), [current, go])

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      go((current + 1) % testimonials.length, 1)
    }, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [current, paused, go])

  const arrowBase: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: 'rgba(196,122,58,0.35)',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 2,
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    color: '#c47a3a',
  }

  const arrowHover: React.CSSProperties = {
    background: '#c47a3a',
    borderColor: '#c47a3a',
    color: 'white',
    boxShadow: '0 6px 20px rgba(196,122,58,0.35)',
    transform: 'translateY(-50%) scale(1.08)',
  }

  return (
    <section
      id="testimonials"
      className="relative w-full py-14 px-4 md:py-20 md:px-0 bg-[#f5f0eb] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-raleway)',
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          color: '#2d2d2d',
          marginBottom: '3rem',
          position: 'relative',
          zIndex: 1,
          fontWeight: 500,
        }}
      >
        Lo Que Dicen Nuestros Pacientes
      </h2>

      {/* Deco left */}
      <Image
        src="/assets/r9-flower.svg"
        alt=""
        width={280}
        height={280}
        style={{ position: 'absolute', left: '-60px', bottom: '-40px', width: '280px', height: 'auto', opacity: 0.18, pointerEvents: 'none' }}
      />
      {/* Deco right */}
      <Image
        src="/assets/r14.png"
        alt=""
        width={260}
        height={260}
        style={{ position: 'absolute', right: '-30px', bottom: '-20px', width: '260px', height: 'auto', opacity: 0.35, pointerEvents: 'none' }}
      />

      {/* Carousel wrapper */}
      <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto', padding: '0 5rem', zIndex: 1 }}>

        {/* Arrow left */}
        <button
          onClick={prev}
          onMouseEnter={() => setHoverLeft(true)}
          onMouseLeave={() => setHoverLeft(false)}
          style={{ ...arrowBase, left: '0', ...(hoverLeft ? arrowHover : {}) }}
          aria-label="Anterior testimonio"
        >
          <ChevronLeft />
        </button>

        {/* Animated content */}
        <div
          style={{
            textAlign: 'center',
            opacity: transitioning ? 0 : 1,
            transform: transitioning
              ? `translateX(${dir === 1 ? '-24px' : '24px'})`
              : 'translateX(0)',
            transition: 'opacity 0.32s ease, transform 0.32s ease',
          }}
        >
          <div
            style={{
              fontSize: '4.5rem',
              color: '#c47a3a',
              lineHeight: 0.8,
              marginBottom: '1.5rem',
              fontFamily: 'Georgia, serif',
            }}
          >
            &#x201C;&#x201C;
          </div>
          <p
            style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
              lineHeight: 1.75,
              color: '#2d2018',
              fontFamily: 'var(--font-raleway)',
              fontWeight: 600,
              marginBottom: '2.5rem',
            }}
          >
            {testimonials[current].quote}
          </p>
          <h4
            style={{
              fontSize: '0.95rem',
              color: '#c47a3a',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 600,
              marginBottom: '0.4rem',
            }}
          >
            {testimonials[current].author}
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#7a6a5a', fontFamily: 'var(--font-montserrat)' }}>
            {testimonials[current].role}
          </p>
        </div>

        {/* Arrow right */}
        <button
          onClick={next}
          onMouseEnter={() => setHoverRight(true)}
          onMouseLeave={() => setHoverRight(false)}
          style={{ ...arrowBase, right: '0', ...(hoverRight ? arrowHover : {}) }}
          aria-label="Siguiente testimonio"
        >
          <ChevronRight />
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? 1 : -1)}
              aria-label={`Ir al testimonio ${i + 1}`}
              style={{
                width: i === current ? '28px' : '10px',
                height: '10px',
                borderRadius: i === current ? '5px' : '50%',
                background: i === current ? '#c47a3a' : 'rgba(196,122,58,0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Auto-advance progress bar */}
        {!paused && (
          <div
            style={{
              position: 'absolute',
              bottom: '-2rem',
              left: '5rem',
              right: '5rem',
              height: '2px',
              background: 'rgba(196,122,58,0.15)',
              borderRadius: '1px',
              overflow: 'hidden',
            }}
          >
            <div
              key={current}
              style={{
                height: '100%',
                background: '#c47a3a',
                borderRadius: '1px',
                animation: 'progress 5s linear forwards',
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
