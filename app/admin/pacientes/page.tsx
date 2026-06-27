'use client'

import { useState } from 'react'

const mockPatients = [
  { id: 1, name: 'María Pérez', email: 'maria@email.com', phone: '+51 999 111 222', type: 'TCC', status: 'Activo', sessions: 8 },
  { id: 2, name: 'Carlos Ruiz', email: 'carlos@email.com', phone: '+51 999 333 444', type: 'DBT', status: 'Activo', sessions: 12 },
  { id: 3, name: 'Ana López', email: 'ana@email.com', phone: '+51 999 555 666', type: 'Evaluación', status: 'Nuevo', sessions: 1 },
  { id: 4, name: 'Juan García', email: 'juan@email.com', phone: '+51 999 777 888', type: 'DBT', status: 'Activo', sessions: 5 },
  { id: 5, name: 'Sofia M.', email: 'sofia@email.com', phone: '+51 999 000 111', type: 'TCC', status: 'Inactivo', sessions: 20 },
]

const statusColors: Record<string, { bg: string; text: string }> = {
  Activo: { bg: '#d4edda', text: '#155724' },
  Nuevo: { bg: '#cce5ff', text: '#004085' },
  Inactivo: { bg: '#f8d7da', text: '#721c24' },
}

export default function PacientesPage() {
  const [search, setSearch] = useState('')

  const filtered = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-10 py-8">
      <div
        className="flex justify-between items-center mb-8 pb-5"
        style={{ borderBottom: '1px solid #e0d9d3' }}
      >
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>
          Gestión de Pacientes
        </h1>
        <button
          className="px-6 py-2.5 text-white text-sm font-bold uppercase tracking-wider"
          style={{ background: '#c47a3a', fontFamily: 'var(--font-montserrat)', border: 'none', cursor: 'pointer' }}
        >
          + Nuevo paciente
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 text-sm outline-none"
          style={{
            border: '1.5px solid #e0d9d3',
            background: 'white',
            fontFamily: 'var(--font-montserrat)',
            color: '#2d2d2d',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#c47a3a')}
          onBlur={(e) => (e.target.style.borderColor = '#e0d9d3')}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: '#f5f3f0' }}>
              {['Nombre', 'Contacto', 'Tipo', 'Sesiones', 'Estado', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[0.75rem] font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: '#2d3a28', borderBottom: '2px solid #e0d9d3', fontFamily: 'var(--font-montserrat)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f0ede9' }} className="hover:bg-[#fafaf8] transition-colors">
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>{p.name}</td>
                <td className="px-4 py-3">
                  <div className="text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{p.email}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{p.phone}</div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{p.type}</td>
                <td className="px-4 py-3 text-sm text-center" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{p.sessions}</td>
                <td className="px-4 py-3">
                  <span
                    className="text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1"
                    style={{ background: statusColors[p.status].bg, color: statusColors[p.status].text, fontFamily: 'var(--font-montserrat)' }}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-xs font-bold px-3 py-1.5 text-white" style={{ background: '#2d3a28', border: 'none', cursor: 'pointer' }}>
                      Ver
                    </button>
                    <button className="text-xs font-bold px-3 py-1.5 text-white" style={{ background: '#c47a3a', border: 'none', cursor: 'pointer' }}>
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
