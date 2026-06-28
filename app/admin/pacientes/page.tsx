'use client'

import { useState } from 'react'

const mockPatients = [
  { id: 1,  name: 'María García',    dni: '12345678', phone: '912345678', service: 'Terapia Cognitivo Conductual - TCC',              status: 'INACTIVO' },
  { id: 2,  name: 'Juan López',      dni: '87654321', phone: '987654321', service: 'Evaluación integral',                              status: 'ACTIVO'   },
  { id: 3,  name: 'Ana Rodríguez',   dni: '11223344', phone: '911223344', service: 'Terapia Dialéctica Conductual - DBT',              status: 'ACTIVO'   },
  { id: 4,  name: 'Carlos Martínez', dni: '44332211', phone: '944332211', service: 'Evaluación de TDAH y funciones ejecutivas',        status: 'ACTIVO'   },
  { id: 5,  name: 'Laura Sánchez',   dni: '55667788', phone: '955667788', service: 'Evaluación psicoeducativa',                       status: 'INACTIVO' },
  { id: 6,  name: 'Pedro Torres',    dni: '99887766', phone: '999887766', service: 'Apoyo en hábitos de estudio y aprendizaje',       status: 'ACTIVO'   },
  { id: 7,  name: 'Sofía Herrera',   dni: '22334455', phone: '922334455', service: 'Terapia Cognitivo Conductual - TCC',              status: 'ACTIVO'   },
  { id: 8,  name: 'Diego Vargas',    dni: '66778899', phone: '966778899', service: 'Evaluación en salud mental',                      status: 'INACTIVO' },
  { id: 9,  name: 'Isabel Moreno',   dni: '33445566', phone: '933445566', service: 'Evaluación de altas capacidades',                 status: 'ACTIVO'   },
  { id: 10, name: 'Roberto Jiménez', dni: '77889900', phone: '977889900', service: 'Evaluación de autismo',                           status: 'ACTIVO'   },
]

const statusStyle: Record<string, { bg: string; color: string }> = {
  ACTIVO:   { bg: 'rgba(39,174,96,0.12)',  color: '#1a7a45' },
  INACTIVO: { bg: 'rgba(192,57,43,0.10)',  color: '#c0392b' },
}

type Filter = 'Todos' | 'Activos' | 'Inactivos'

export default function PacientesPage() {
  const [filter, setFilter]   = useState<Filter>('Todos')
  const [search, setSearch]   = useState('')

  const date = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const filtered = mockPatients.filter((p) => {
    const matchesFilter =
      filter === 'Todos'     ? true :
      filter === 'Activos'   ? p.status === 'ACTIVO' :
                               p.status === 'INACTIVO'
    const q = search.toLowerCase()
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.dni.includes(q)
    return matchesFilter && matchesSearch
  })

  const filterBtns: Filter[] = ['Todos', 'Activos', 'Inactivos']

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>
          Gestión de Pacientes
        </h1>
        <span className="text-[0.82rem] capitalize mt-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
          {date}
        </span>
      </div>

      {/* Toolbar: filters + search + add */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Filter buttons */}
        <div className="flex gap-0">
          {filterBtns.map((f, i) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-5 py-2 text-sm font-semibold transition-all duration-150"
              style={{
                fontFamily: 'var(--font-montserrat)',
                background: filter === f ? '#c47a3a' : 'white',
                color: filter === f ? 'white' : '#5d5d5d',
                border: '1px solid #d0c9c2',
                borderLeft: i > 0 ? 'none' : '1px solid #d0c9c2',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <input
          type="text"
          placeholder="Buscar nombre o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 text-sm outline-none w-56"
          style={{
            border: '1px solid #d0c9c2',
            background: 'white',
            fontFamily: 'var(--font-montserrat)',
            color: '#2d2d2d',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#c47a3a')}
          onBlur={(e) => (e.target.style.borderColor = '#d0c9c2')}
        />

        {/* Add button */}
        <button
          className="px-6 py-2 text-white text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
          style={{ background: '#c47a3a', fontFamily: 'var(--font-montserrat)', border: 'none', cursor: 'pointer' }}
        >
          + Agregar Paciente
        </button>
      </div>

      {/* Table */}
      <div className="bg-white" style={{ border: '1px solid #e0d9d3' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid #e0d9d3' }}>
              {['Nombre', 'DNI', 'Teléfono', 'Servicio', 'Estado', 'Acciones'].map((h) => (
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
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="transition-colors hover:bg-[#fafaf8]"
                style={{ borderBottom: '1px solid #f0ede9' }}
              >
                <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>
                  {p.name}
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
                  {p.dni}
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: '#c47a3a', fontFamily: 'var(--font-montserrat)' }}>
                  {p.phone}
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>
                  {p.service}
                </td>
                <td className="px-5 py-4">
                  <span
                    className="text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1"
                    style={{
                      background: statusStyle[p.status].bg,
                      color: statusStyle[p.status].color,
                      fontFamily: 'var(--font-montserrat)',
                    }}
                  >
                    {p.status}
                  </span>
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
                  No se encontraron pacientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
