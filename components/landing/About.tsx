import Image from 'next/image'

export default function About() {
  return (
    <section id="about" className="py-12 px-6 md:py-20 md:px-8 max-w-6xl mx-auto overflow-visible">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Text side */}
        <div>
          <h2
            className="text-[2rem] md:text-[2.5rem] mb-6"
            style={{ fontFamily: 'var(--font-raleway)', color: '#2d2d2d', fontWeight: 500 }}
          >
            Nosotros
          </h2>
          <p
            className="text-[1.1rem] leading-[1.8] mb-6"
            style={{ color: '#5d5d5d', fontFamily: 'var(--font-raleway)' }}
          >
            Somos un grupo de 3 terapeutas que estamos iniciando con Interser para ser independientes.
            Actualmente trabajamos en el ámbito privado, con temas relacionados a desregulación emocional,
            ansiedad, depresión, conductas autolesivas e ideación suicida.
          </p>
        </div>

        {/* Image side */}
        <div className="relative h-[380px] md:h-[520px] overflow-hidden md:overflow-visible rounded-2xl md:rounded-none">
          <Image src="/assets/svc-trauma.jpg" alt="" width={500} height={500} className="absolute top-[-30px] left-0 pointer-events-none" style={{ width: '95%', height: 'auto', zIndex: 0, borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%' }} />
          <Image src="/assets/r19-circle.png" alt="" width={200} height={200}
            className="absolute top-[-60px] right-[-50px] opacity-60 pointer-events-none"
            style={{ width: '200px', height: 'auto', zIndex: 1 }} />
          <Image src="/assets/r15-orange.png" alt="" width={180} height={180}
            className="absolute bottom-[-10px] left-[-60px] opacity-80 pointer-events-none"
            style={{ width: '180px', height: 'auto', zIndex: 1 }} />
          <Image src="/assets/r13-pear.png" alt="" width={110} height={110}
            className="absolute bottom-0 right-[-0px] pointer-events-none"
            style={{ width: '110px', height: 'auto', zIndex: -10 }} />

          {/* Photo clipped to blob */}
          <div
            className="absolute overflow-hidden"
            style={{
              top: '30px',
              left: '30px',
              width: '85%',
              height: '400px',
              borderRadius: '55% 45% 60% 40% / 50% 55% 45% 50%',
              zIndex: 2,
            }}
          >
            <Image
              src="/assets/about-image.jpg"
              alt="Nosotros"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover object-center"
            />
          </div>

          {/* Quote overlay card */}
          <div
            className="absolute bg-white rounded-xl px-5 py-5 md:px-7 md:py-6 shadow-xl"
            style={{ bottom: '100px', left: '10px', zIndex: 3, maxWidth: '260px' }}
          >
            <div
              className="text-[2rem] leading-none mb-0 font-serif"
              style={{ color: '#c47a3a' }}
            >
              "
            </div>
            <p
              className="text-[0.9rem] leading-relaxed"
              style={{ color: '#2d2d2d', fontFamily: 'var(--font-raleway)' }}
            >
              Acompañarte en tu proceso de sanación emocional generando un entorno de confianza, calma y bienestar
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
