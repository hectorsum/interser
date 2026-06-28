'use client'

import { useState, useMemo } from 'react'

type SessionType = 'TERAPIA' | 'EVALUACIÓN'

interface Session {
  id: number
  date: string   // YYYY-MM-DD
  time: string
  patient: string
  type: SessionType
  notes: string
}

const mockSessions: Session[] = [
  // Junio 2026
  { id: 1, date: '2026-06-18', time: '10:00', patient: 'María García', type: 'TERAPIA', notes: '' },
  { id: 2, date: '2026-06-10', time: '16:00', patient: 'Roberto Jiménez', type: 'TERAPIA', notes: '' },
  { id: 3, date: '2026-06-10', time: '10:00', patient: 'Juan López', type: 'EVALUACIÓN', notes: '' },
  { id: 4, date: '2026-06-03', time: '14:00', patient: 'Sofía Herrera', type: 'TERAPIA', notes: '' },
  // Mayo 2026
  { id: 5, date: '2026-05-21', time: '15:00', patient: 'Isabel Moreno', type: 'EVALUACIÓN', notes: '' },
  { id: 6, date: '2026-05-14', time: '09:00', patient: 'Ana Rodríguez', type: 'TERAPIA', notes: '' },
  { id: 7, date: '2026-05-06', time: '10:00', patient: 'María García', type: 'TERAPIA', notes: '' },
  // Abril 2026
  { id: 8, date: '2026-04-22', time: '11:00', patient: 'Carlos Martínez', type: 'EVALUACIÓN', notes: '' },
  { id: 9, date: '2026-04-15', time: '10:00', patient: 'Pedro Torres', type: 'TERAPIA', notes: '' },
  { id: 10, date: '2026-04-08', time: '14:00', patient: 'Sofía Herrera', type: 'TERAPIA', notes: '' },
  // Marzo 2026
  { id: 11, date: '2026-03-25', time: '10:00', patient: 'Juan López', type: 'TERAPIA', notes: '' },
  { id: 12, date: '2026-03-18', time: '09:00', patient: 'Ana Rodríguez', type: 'EVALUACIÓN', notes: '' },
  { id: 13, date: '2026-03-11', time: '16:00', patient: 'María García', type: 'TERAPIA', notes: '' },
  { id: 14, date: '2026-03-04', time: '15:00', patient: 'Diego Vargas', type: 'TERAPIA', notes: '' },
  // Febrero 2026
  { id: 15, date: '2026-02-19', time: '10:00', patient: 'Isabel Moreno', type: 'TERAPIA', notes: '' },
  { id: 16, date: '2026-02-12', time: '14:00', patient: 'Pedro Torres', type: 'EVALUACIÓN', notes: '' },
  { id: 17, date: '2026-02-05', time: '11:00', patient: 'Sofía Herrera', type: 'TERAPIA', notes: '' },
  // Enero 2026
  { id: 18, date: '2026-01-28', time: '10:00', patient: 'Carlos Martínez', type: 'TERAPIA', notes: '' },
  { id: 19, date: '2026-01-21', time: '09:00', patient: 'Juan López', type: 'EVALUACIÓN', notes: '' },
  { id: 20, date: '2026-01-14', time: '15:00', patient: 'María García', type: 'TERAPIA', notes: '' },
  { id: 21, date: '2026-01-07', time: '10:00', patient: 'Roberto Jiménez', type: 'TERAPIA', notes: '' },
]

const typeStyle: Record<SessionType, { bg: string; color: string }> = {
  TERAPIA: { bg: 'rgba(39,174,96,0.12)', color: '#1a7a45' },
  EVALUACIÓN: { bg: 'rgba(74,112,196,0.12)', color: '#2a4a9a' },
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const patients = [...new Set(mockSessions.map((s) => s.patient))].sort()

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export default function SesionesPage() {
  const now = new Date()
  const currentYear = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth() + 1

  const [patientFilter, setPatientFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')

  const date = now.toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const monthOptions = Array.from({ length: currentMonth }, (_, i) => {
    const m = currentMonth - i
    return {
      value: `${currentYear}-${String(m).padStart(2, '0')}`,
      label: `${MONTH_NAMES[m - 1]} ${currentYear}`,
    }
  })

  const filtered = useMemo(() => {
    return mockSessions.filter((s) => {
      const [y, m] = s.date.split('-')
      const monthKey = `${y}-${m}`
      const matchesPatient = patientFilter === 'all' || s.patient === patientFilter
      const matchesMonth = monthFilter === 'all' || monthKey === monthFilter
      return matchesPatient && matchesMonth
    })
  }, [patientFilter, monthFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, Session[]>()
    filtered.forEach((s) => {
      const key = s.date.slice(0, 7)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    })
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  const selectStyle: React.CSSProperties = {
    border: '1px solid #d0c9c2',
    background: 'white',
    fontFamily: 'var(--font-montserrat)',
    color: '#2d2d2d',
    fontSize: '0.88rem',
    padding: '0.5rem 2rem 0.5rem 0.875rem',
    cursor: 'pointer',
    outline: 'none',
  }

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>
          Gestión de Sesiones
        </h1>
        <span className="text-[0.82rem] capitalize mt-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
          {date}
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <select value={patientFilter} onChange={(e) => setPatientFilter(e.target.value)} className="w-full sm:w-auto" style={selectStyle}>
          <option value="all">Todos los pacientes</option>
          {patients.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="w-full sm:w-auto" style={selectStyle}>
          <option value="all">Todos los meses</option>
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <div className="flex-1" />

        <button
          className="w-full sm:w-auto px-6 py-2 text-white text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
          style={{ background: '#c47a3a', fontFamily: 'var(--font-montserrat)', border: 'none', cursor: 'pointer' }}
        >
          + Agregar Sesión
        </button>
      </div>

      {/* Month groups */}
      {grouped.length === 0 ? (
        <p className="text-sm py-12 text-center" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
          No se encontraron sesiones.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {grouped.map(([monthKey, sessions]) => {
            const [y, m] = monthKey.split('-')
            const monthLabel = MONTH_NAMES[parseInt(m) - 1].toUpperCase()
            return (
              <div key={monthKey}>
                {/* Month heading */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span
                    className="text-[0.8rem] font-bold tracking-wider"
                    style={{ color: '#c47a3a', fontFamily: 'var(--font-montserrat)' }}
                  >
                    {monthLabel} {y}
                  </span>
                  <span
                    className="text-[0.75rem] font-semibold tracking-widest uppercase"
                    style={{ color: '#b0a090', fontFamily: 'var(--font-montserrat)' }}
                  >
                    {sessions.length} {sessions.length === 1 ? 'SESIÓN' : 'SESIONES'}
                  </span>
                </div>

                {/* Table */}
                <div className="bg-white overflow-x-auto" style={{ border: '1px solid #e0d9d3' }}>
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e0d9d3' }}>
                        {['Fecha', 'Hora', 'Paciente', 'Tipo', 'Notas', 'Acciones'].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                            style={{ color: '#2d3a28', fontFamily: 'var(--font-montserrat)' }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s) => (
                        <tr
                          key={s.id}
                          className="transition-colors hover:bg-[#fafaf8]"
                          style={{ borderBottom: '1px solid #f0ede9' }}
                        >
                          <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>
                            {formatDate(s.date)}
                          </td>
                          <td className="px-5 py-4 text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
                            {s.time}
                          </td>
                          <td className="px-5 py-4 text-sm" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>
                            {s.patient}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className="text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1"
                              style={{
                                background: typeStyle[s.type].bg,
                                color: typeStyle[s.type].color,
                                fontFamily: 'var(--font-montserrat)',
                              }}
                            >
                              {s.type}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
                            {s.notes || '—'}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button
                                className="text-xs font-bold px-4 py-1.5 text-white transition-opacity hover:opacity-80"
                                style={{ background: '#2d3a28', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}
                              >
                                Editar
                              </button>
                              <button
                                className="text-xs font-bold px-4 py-1.5 text-white transition-opacity hover:opacity-80"
                                style={{ background: '#c0392b', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}
                              >
                                Eliminar
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
          })}
        </div>
      )}
    </div>
  )
}
