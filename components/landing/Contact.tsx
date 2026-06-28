'use client'

import Image from 'next/image'

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-16 px-6 md:py-24 md:px-16 relative overflow-hidden bg-[#fafaf8]"
    >
      {/* Decorative flowers */}
      <Image
        src="/assets/r9-flower.svg"
        alt=""
        width={340}
        height={340}
        style={{ width: '340px', height: 'auto' }}
        className="absolute right-[-80px] bottom-[-60px] opacity-[0.09] pointer-events-none"
      />
      <Image
        src="/assets/r9-flower.svg"
        alt=""
        width={260}
        height={260}
        style={{ width: '260px', height: 'auto' }}
        className="absolute left-[-100px] top-[-60px] opacity-[0.06] pointer-events-none rotate-[60deg]"
      />

      <div className="max-w-[900px] mx-auto relative z-[1]">
        {/* Title */}
        <div className="text-center mb-16">
          <h2
            className="leading-[1.2] mb-5 font-medium"
            style={{
              fontSize: 'clamp(2rem, 5vw, 2.8rem)',
              fontFamily: 'var(--font-raleway)',
              color: '#2d1a0e',
            }}
          >
            ¿Quieres agendar<br />una sesión?
          </h2>
          <p
            className="text-[1.05rem] leading-[1.75] max-w-[520px] mx-auto"
            style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}
          >
            Escríbenos directamente por WhatsApp y con gusto te orientamos para encontrar el acompañamiento que necesitas.
          </p>
        </div>

        {/* WhatsApp CTA card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 p-6 md:p-14 rounded-3xl bg-[#2d3a28]">
          <div className="flex items-center gap-7 flex-1 min-w-[220px]">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p
                className="text-[0.85rem] mb-1 uppercase tracking-[0.08em]"
                style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-montserrat)' }}
              >
                WhatsApp
              </p>
              <p
                className="text-[1.5rem] font-semibold tracking-[0.02em] text-white"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                +51 983 542 723
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/51983542723?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20sesi%C3%B3n."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#c47a3a] hover:bg-[#b06830] text-white text-[0.88rem] font-bold uppercase tracking-[0.06em] whitespace-nowrap shrink-0 transition-all duration-200 hover:-translate-y-0.5 no-underline"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Escribenos ahora
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* Bottom info row */}
        <div className="flex flex-wrap gap-6 justify-center items-stretch">
          {/* Email */}
          <div className="flex-1 min-w-[200px] bg-[#f0eeec] rounded-2xl p-7 flex items-center gap-5">
            <div className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c47a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <p
                className="text-[0.8rem] mb-1 uppercase tracking-[0.07em]"
                style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}
              >
                Email
              </p>
              <p
                className="text-[0.9rem] font-semibold"
                style={{ color: '#2d1a0e', fontFamily: 'var(--font-montserrat)' }}
              >
                emphochumbiauca@gmail.com
              </p>
            </div>
          </div>

          {/* Social */}
          <div className="shrink-0 bg-[#f0eeec] rounded-2xl p-7 flex justify-between md:justify-center items-center gap-6 w-full md:w-auto">
            <p
              className="text-[0.8rem] uppercase tracking-[0.07em] whitespace-nowrap"
              style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}
            >
              Redes sociales
            </p>
            <div className="flex gap-4 items-center">
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
                  className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center text-[#2d1a0e] no-underline transition-transform duration-200 hover:-translate-y-0.5"
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
