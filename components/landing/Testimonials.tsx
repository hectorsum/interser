'use client'

import { useState } from 'react'
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

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  return (
    <section
      id="testimonials"
      style={{ position: 'relative', width: '100%', padding: '5rem 0 4rem', background: '#f5f0eb', overflow: 'hidden' }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-raleway)',
          fontSize: '2.5rem',
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

      {/* Arrow left */}
      <button
        onClick={prev}
        style={{
          position: 'absolute',
          left: '3%',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          fontSize: '2.2rem',
          color: '#c47a3a',
          cursor: 'pointer',
          zIndex: 2,
          lineHeight: 1,
        }}
      >
        ‹
      </button>

      {/* Content */}
      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '0 5rem',
          position: 'relative',
          zIndex: 1,
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
            fontSize: '1.4rem',
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

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? '28px' : '10px',
                height: '10px',
                borderRadius: i === current ? '5px' : '50%',
                background: i === current ? '#c47a3a' : 'rgba(196,122,58,0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Arrow right */}
      <button
        onClick={next}
        style={{
          position: 'absolute',
          right: '3%',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          fontSize: '2.2rem',
          color: '#c47a3a',
          cursor: 'pointer',
          zIndex: 2,
          lineHeight: 1,
        }}
      >
        ›
      </button>
    </section>
  )
}
