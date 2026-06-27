'use client'

import { useState } from 'react'

const mockSessions = [
  { id: 1, patient: 'María Pérez', therapist: 'Terapeuta 1', type: 'TCC', date: '2025-06-27', time: '10:00', duration: 60, status: 'Completada', amount: 85 },
  { id: 2, patient: 'Carlos Ruiz', therapist: 'Terapeuta 2', type: 'DBT', date: '2025-06-27', time: '11:00', duration: 60, status: 'Completada', amount: 85 },
  { id: 3, patient: 'Ana López', therapist: 'Terapeuta 1', type: 'Evaluación', date: '2025-06-28', time: '09:00', duration: 90, status: 'Programada', amount: 200 },
  { id: 4, patient: 'Juan García', therapist: 'Terapeuta 3', type: 'DBT', date: '2025-06-28', time: '15:00', duration: 60, status: 'Programada', amount: 85 },
  { id: 5, patient: 'Sofia M.', therapist: 'Terapeuta 2', type: 'TCC', date: '2025-06-29', time: '10:00', duration: 60, status: 'Pendiente', amount: 85 },
]

const statusColors: Record<string, { bg: string; text: string }> = {
  Completada: { bg: '#d4edda', text: '#155724' },
  Programada: { bg: '#cce5ff', text: '#004085' },
  Pendiente: { bg: '#fff3cd', text: '#856404' },
  Cancelada: { bg: '#f8d7da', text: '#721c24' },
}

export default function SesionesPage() {
  const [filter, setFilter] = useState('Todas')
  const filters = ['Todas', 'Completada', 'Programada', 'Pendiente', 'Cancelada']

  const filtered = filter === 'Todas' ? mockSessions : mockSessions.filter((s) => s.status === filter)

  return (
    <div className="px-10 py-8">
      <div className="flex justify-between items-center mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>
          Gestión de Sesiones
        </h1>
        <button
          className="px-6 py-2.5 text-white text-sm font-bold uppercase tracking-wider"
          style={{ background: '#c47a3a', fontFamily: 'var(--font-montserrat)', border: 'none', cursor: 'pointer' }}
        >
          + Nueva sesión
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="text-[0.8rem] font-semibold px-4 py-2 transition-all duration-200"
            style={{
              border: '1.5px solid #e0d9d3',
              background: filter === f ? '#c47a3a' : 'white',
              color: filter === f ? 'white' : '#9a8a7a',
              borderColor: filter === f ? '#c47a3a' : '#e0d9d3',
              fontFamily: 'var(--font-montserrat)',
              cursor: 'pointer',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: '#f5f3f0' }}>
              {['Paciente', 'Terapeuta', 'Tipo', 'Fecha', 'Hora', 'Duración', 'Monto', 'Estado'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[0.75rem] font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: '#2d3a28', borderBottom: '2px solid #e0d9d3', fontFamily: 'var(--font-montserrat)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f0ede9' }} className="hover:bg-[#fafaf8] transition-colors">
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>{s.patient}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{s.therapist}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{s.type}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{s.date}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{s.time}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{s.duration} min</td>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#2d3a28', fontFamily: 'var(--font-montserrat)' }}>S/ {s.amount}</td>
                <td className="px-4 py-3">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1"
                    style={{ background: statusColors[s.status].bg, color: statusColors[s.status].text, fontFamily: 'var(--font-montserrat)' }}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
