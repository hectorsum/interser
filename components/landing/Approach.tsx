import Image from 'next/image'

const pillars = [
  {
    num: '01',
    title: 'Personalización Integral',
    desc: 'Cada tratamiento se adapta a ti, no al revés.',
  },
  {
    num: '02',
    title: 'Enfoque Práctico y Funcional',
    desc: 'Herramientas que funcionan en tu vida cotidiana.',
  },
  {
    num: '03',
    title: 'Seguridad y Contención',
    desc: 'Especialmente en situaciones de crisis y trauma.',
  },
]

export default function Approach() {
  return (
    <section
      id="approach"
      className="relative overflow-hidden py-16 px-6 md:py-24 md:px-8"
      style={{ background: '#2d3a28' }}
    >
      {/* Decorative assets */}
      <Image
        src="/assets/r9-flower.svg"
        alt=""
        width={320}
        height={320}
        className="absolute right-[-60px] bottom-[-40px] opacity-10 pointer-events-none"
      // style={{ width: '320px', height: 'auto' }}
      />
      <Image
        src="/assets/r12.png"
        alt=""
        width={160}
        height={160}
        className="absolute left-[-20px] top-[-20px] opacity-10 pointer-events-none"
        style={{ width: '160px', height: 'auto' }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16">
          <p
            className="text-[0.78rem] font-semibold tracking-[0.15em] uppercase mb-4"
            style={{ color: '#c47a3a', fontFamily: 'var(--font-montserrat)' }}
          >
            Cómo trabajamos
          </p>
          <h2
            className="text-[2rem] md:text-[3rem] leading-[1.15] text-white mb-4"
            style={{ fontFamily: 'var(--font-raleway)', fontWeight: 500 }}
          >
            Nuestro Enfoque
          </h2>
          <p
            className="text-base leading-relaxed max-w-xl"
            style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-montserrat)' }}
          >
            Trabajamos desde un modelo contextual que reconoce tu singularidad. Combinamos técnicas de
            probada eficacia con un espacio seguro para el cambio genuino.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {pillars.map((p) => (
            <div
              key={p.num}
              className="p-10 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 cursor-default"
            >
              <div
                className="text-[3rem] font-bold leading-none mb-3"
                style={{ color: '#c47a3a', fontFamily: 'var(--font-raleway)' }}
              >
                {p.num}
              </div>
              <div className="w-10 h-px mb-6" style={{ background: 'rgba(196,122,58,0.5)' }} />
              <h4
                className="text-[1.15rem] font-semibold text-white mb-3"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {p.title}
              </h4>
              <p
                className="text-[0.92rem] leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-montserrat)' }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
