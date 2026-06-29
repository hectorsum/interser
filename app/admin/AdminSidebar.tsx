'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from './actions'

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[17px] h-[17px]" strokeWidth={1.8}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'patients',
    label: 'Pacientes',
    href: '/admin/pacientes',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[17px] h-[17px]" strokeWidth={1.8}>
        <circle cx="9" cy="7" r="4" /><path d="M3 21c0-3.314 2.686-6 6-6s6 2.686 6 6" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21c0-2.76-2.24-5-5-5" />
      </svg>
    ),
  },
  {
    id: 'sessions',
    label: 'Sesiones',
    href: '/admin/sesiones',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[17px] h-[17px]" strokeWidth={1.8}>
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: 'payments',
    label: 'Pagos',
    href: '/admin/pagos',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[17px] h-[17px]" strokeWidth={1.8}>
        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Reportes',
    href: '/admin/reportes',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[17px] h-[17px]" strokeWidth={1.8}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[90] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-[255px] flex-shrink-0 flex flex-col overflow-y-auto fixed h-full z-[100] transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#2d3a28' }}
      >
        {/* Logo */}
        <div className="px-6 py-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Image
            src="/assets/logo-main.svg"
            alt="Interser"
            width={100}
            height={100}
            style={{ width: '170px', height: 'auto' }}
            className="object-contain object-left"
            priority
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-6 py-[0.85rem] text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? '#c47a3a' : 'rgba(255,255,255,0.55)',
                  background: isActive ? 'rgba(196,122,58,0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid #c47a3a' : '3px solid transparent',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-[0.8rem] font-semibold transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="flex items-center gap-4 px-4 py-3 md:hidden fixed top-0 left-0 right-0 z-[80]" style={{ background: '#2d3a28' }}>
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col gap-1.5 p-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Abrir menú"
        >
          <span className="w-5 h-0.5 block bg-white" />
          <span className="w-5 h-0.5 block bg-white" />
          <span className="w-5 h-0.5 block bg-white" />
        </button>
        <Image
          src="/assets/logo-main.svg"
          alt="Interser"
          width={100}
          height={100}
          style={{ width: '130px', height: 'auto' }}
          className="object-contain object-left"
          priority
        />
      </div>
    </>
  )
}
