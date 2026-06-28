'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError
        router.push('/admin')
      } else {
        throw new Error('Correo o contraseña incorrectos.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Correo o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#2d3a28' }}
    >
      {/* Decorative background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(196,122,58,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%)
          `,
        }}
      />

      {/* Decorative leaves */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/r15.png" alt="" aria-hidden="true"
        style={{ width: '260px', height: 'auto' }}
        className="absolute bottom-[-40px] right-[-40px] opacity-[0.12] brightness-[10] pointer-events-none" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/r12.png" alt="" aria-hidden="true"
        style={{ width: '200px', height: 'auto' }}
        className="absolute top-[-30px] left-[-30px] opacity-[0.08] brightness-[10] rotate-180 pointer-events-none" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[420px] mx-6 py-12 px-11"
        style={{ background: 'rgba(255,255,255,0.97)' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8 relative">
          <Image
            src="/assets/logo-main.svg"
            alt="Interser"
            width={100}
            height={100}
            style={{ width: '150px', height: 'auto' }}
            className="object-contain object-left"
            priority
          />
        </div>

        {/* Divider */}
        <div className="w-10 h-0.5 mx-auto mb-8" style={{ background: '#c47a3a' }} />

        <h1
          className="text-[1.5rem] font-semibold text-center mb-1"
          style={{ fontFamily: 'var(--font-raleway)', color: '#2d1a0e' }}
        >
          Acceso Administración
        </h1>
        <p
          className="text-[0.82rem] text-center mb-9"
          style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)', letterSpacing: '0.03em' }}
        >
          Ingresa tus credenciales para continuar
        </p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-5">
            <label
              className="block text-[0.75rem] font-semibold uppercase tracking-widest mb-2"
              style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-[0.95rem] outline-none transition-all duration-200"
              style={{ background: '#f5f3f0', border: '1.5px solid transparent', fontFamily: 'var(--font-montserrat)', color: '#2d2d2d' }}
              onFocus={(e) => { e.target.style.borderColor = '#c47a3a'; e.target.style.background = '#fff' }}
              onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f5f3f0' }}
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label
              className="block text-[0.75rem] font-semibold uppercase tracking-widest mb-2"
              style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 text-[0.95rem] outline-none transition-all duration-200"
                style={{ background: '#f5f3f0', border: '1.5px solid transparent', fontFamily: 'var(--font-montserrat)', color: '#2d2d2d' }}
                onFocus={(e) => { e.target.style.borderColor = '#c47a3a'; e.target.style.background = '#fff' }}
                onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f5f3f0' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors duration-200"
                style={{ color: '#9a8a7a', background: 'none', border: 'none' }}
              >
                {showPw ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[0.8rem] mb-4" style={{ color: '#c0392b' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-white font-bold text-[0.88rem] uppercase tracking-widest mt-2 transition-all duration-200 hover:-translate-y-px disabled:opacity-60"
            style={{ background: '#c47a3a', fontFamily: 'var(--font-montserrat)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 mt-7 text-[0.8rem] no-underline transition-colors duration-200"
          style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Volver al sitio
        </Link>
      </div>
    </div>
  )
}
