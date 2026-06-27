'use client'

import { useState } from 'react'
import Image from 'next/image'

const evaluaciones = [
  {
    img: '/assets/svc-eval-integral.png',
    title: 'Evaluación integral',
    subtitle: 'TDAH, autismo, altas capacidades',
    price: '100 USD / 400 soles',
  },
  {
    img: '/assets/svc-eval-autismo.png',
    title: 'Evaluación de autismo',
    subtitle: ' ',
    price: '50 USD / 200 soles',
  },
  {
    img: '/assets/svc-eval-tdah.png',
    title: 'Evaluación de TDAH y funciones ejecutivas',
    subtitle: ' ',
    price: '50 USD / 200 soles',
  },
  {
    img: '/assets/svc-eval-psicoeducativa.png',
    title: 'Evaluación psicoeducativa',
    subtitle: 'Dificultades de aprendizaje',
    price: '45 USD / 180 soles',
  },
  {
    img: '/assets/svc-eval-altas-capacidades.png',
    title: 'Evaluación de altas capacidades',
    subtitle: ' ',
    price: '45 USD / 180 soles',
  },
  {
    img: '/assets/svc-eval-salud-mental.png',
    title: 'Evaluación en salud mental',
    subtitle: ' ',
    price: '50 USD / 200 soles',
  },
]

const acompanamiento = [
  {
    img: '/assets/svc-dbt.png',
    title: 'Terapia Dialéctica Conductual',
    subtitle: 'DBT',
    price: '25 USD / 85 soles por sesión',
  },
  {
    img: '/assets/svc-tcc.png',
    title: 'Terapia Cognitivo Conductual',
    subtitle: 'TCC',
    price: '25 USD / 85 soles por sesión',
  },
  {
    img: '/assets/svc-habitos.png',
    title: 'Apoyo en hábitos de estudio y aprendizaje',
    subtitle: ' ',
    price: '25 USD / 85 soles por sesión',
  },
]

function ServiceCard({ img, title, subtitle, price }: { img: string; title: string; subtitle: string; price: string }) {
  return (
    <div
      className="bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderRadius: '16px', border: '1px solid rgba(212,165,130,0.25)' }}
    >
      <div className="h-[180px] overflow-hidden relative">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 350px"
          className="object-cover object-center"
        />
      </div>
      <div className="p-5">
        <p className="text-[0.92rem] font-semibold mb-1" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>
          {title}
        </p>
        <p className="text-[0.78rem] mb-3" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
          {subtitle}
        </p>
        <span className="text-[0.88rem] font-semibold" style={{ color: '#c47a3a', fontFamily: 'var(--font-montserrat)' }}>
          {price}
        </span>
      </div>
    </div>
  )
}

export default function Services() {
  const [tab, setTab] = useState<'eval' | 'acomp'>('eval')

  return (
    <section id="services" className="py-20 px-12" style={{ background: '#fafaf8' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2
            className="text-[2.5rem] mb-2"
            style={{ fontFamily: 'var(--font-raleway)', color: '#2d2d2d', fontWeight: 500 }}
          >
            Nuestros Servicios
          </h2>
          <p className="text-base" style={{ color: '#7a6a5a', fontFamily: 'var(--font-montserrat)' }}>
            Todos los servicios disponibles de forma presencial y online.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-10">
          {(['eval', 'acomp'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-7 py-3 text-sm font-semibold border-2 transition-all duration-200"
              style={{
                background: tab === t ? '#2d3a28' : 'transparent',
                color: tab === t ? 'white' : '#2d3a28',
                borderColor: '#2d3a28',
                fontFamily: 'var(--font-montserrat)',
                opacity: tab === t ? 1 : 0.5,
              }}
            >
              {t === 'eval' ? 'Evaluaciones' : 'Acompañamiento Terapéutico'}
            </button>
          ))}
        </div>

        {/* Evaluaciones panel */}
        {tab === 'eval' && (
          <div>
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-[0.78rem] font-semibold"
              style={{ background: 'rgba(196,122,58,0.1)', color: '#c47a3a', border: '1px solid rgba(196,122,58,0.25)' }}
            >
              Todas desde los 13 años
            </div>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {evaluaciones.map((s, i) => <ServiceCard key={i} {...s} />)}
            </div>
            <a
              href="https://wa.me/51983542723?text=Hola%2C%20me%20interesa%20consultar%20sobre%20las%20Evaluaciones"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold text-sm uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: '#c47a3a' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar sobre Evaluaciones
            </a>
          </div>
        )}

        {/* Acompañamiento panel */}
        {tab === 'acomp' && (
          <div>
            <div className="grid grid-cols-3 gap-6 mb-6">
              {acompanamiento.map((s, i) => <ServiceCard key={i} {...s} />)}
            </div>
            {/* Package highlight */}
            <div
              className="flex items-center justify-between px-6 py-4 mb-8"
              style={{ background: 'rgba(196,122,58,0.08)', border: '1px solid rgba(196,122,58,0.2)' }}
            >
              <div className="flex items-center gap-4">
                <span className="text-base font-medium italic" style={{ color: '#2d2d2d', fontFamily: 'var(--font-raleway)' }}>
                  Paquete 4 sesiones
                </span>
                <span
                  className="text-[0.72rem] font-bold px-3 py-1 text-white"
                  style={{ background: '#2d3a28', borderRadius: '999px' }}
                >
                  Solo Perú
                </span>
              </div>
              <span className="text-base font-bold" style={{ color: '#c47a3a', fontFamily: 'var(--font-montserrat)' }}>
                280 soles
              </span>
            </div>
            <a
              href="https://wa.me/51983542723?text=Hola%2C%20me%20interesa%20consultar%20sobre%20el%20Acompa%C3%B1amiento%20Terap%C3%A9utico"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold text-sm uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: '#c47a3a' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar sobre Acompañamiento
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
