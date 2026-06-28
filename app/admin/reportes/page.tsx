'use client'

import { useState } from 'react'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const DownloadIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const FileIcon = () => (
  <svg width="22" height="22" fill="none" stroke="#c47a3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="22" height="22" fill="none" stroke="#2d3a28" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

export default function ReportesPage() {
  const now          = new Date()
  const currentYear  = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth() + 1

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentYear}-${String(currentMonth).padStart(2, '0')}`
  )
  const [selectedYear, setSelectedYear] = useState(String(currentYear))

  const date = now.toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // Build month options: current year descending, then previous year
  const monthOptions: { value: string; label: string }[] = []
  for (let m = currentMonth; m >= 1; m--) {
    const key = `${currentYear}-${String(m).padStart(2, '0')}`
    monthOptions.push({ value: key, label: `${MONTH_NAMES[m - 1]} ${currentYear}` })
  }
  for (let m = 12; m >= 1; m--) {
    const key = `${currentYear - 1}-${String(m).padStart(2, '0')}`
    monthOptions.push({ value: key, label: `${MONTH_NAMES[m - 1]} ${currentYear - 1}` })
  }

  const yearOptions = [String(currentYear), String(currentYear - 1)]

  const selectStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid #d0c9c2',
    background: 'white',
    fontFamily: 'var(--font-montserrat)',
    color: '#2d2d2d',
    fontSize: '0.9rem',
    padding: '0.65rem 2rem 0.65rem 0.875rem',
    cursor: 'pointer',
    outline: 'none',
  }

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>
          Reportes Descargables
        </h1>
        <span className="text-[0.82rem] capitalize mt-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
          {date}
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Monthly report */}
        <div className="bg-white p-7" style={{ border: '1px solid #e0d9d3', borderTop: '3px solid #c47a3a' }}>
          <div className="flex items-center gap-3 mb-3">
            <FileIcon />
            <h2 className="text-[1.15rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d2d2d' }}>
              Reporte Mensual
            </h2>
          </div>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
            Resumen del mes: total de ingresos, desglose por paciente, pagos pendientes y sin recibo.
          </p>
          <p className="text-[0.68rem] font-bold uppercase tracking-widest mb-2" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
            Seleccionar Mes
          </p>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={selectStyle}
            className="mb-5"
          >
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white uppercase tracking-wide transition-opacity hover:opacity-90"
            style={{ background: '#c47a3a', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}
          >
            <DownloadIcon /> Generar PDF Mensual
          </button>
        </div>

        {/* Annual report */}
        <div className="bg-white p-7" style={{ border: '1px solid #e0d9d3', borderTop: '3px solid #2d3a28' }}>
          <div className="flex items-center gap-3 mb-3">
            <CalendarIcon />
            <h2 className="text-[1.15rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d2d2d' }}>
              Reporte Anual
            </h2>
          </div>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
            Resumen anual: desglose por mes, total de ingresos del año y comparativa mensual.
          </p>
          <p className="text-[0.68rem] font-bold uppercase tracking-widest mb-2" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
            Seleccionar Año
          </p>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={selectStyle}
            className="mb-5"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white uppercase tracking-wide transition-opacity hover:opacity-90"
            style={{ background: '#2d3a28', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}
          >
            <DownloadIcon /> Generar PDF Anual
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="px-5 py-4 bg-white" style={{ borderLeft: '3px solid #c47a3a', border: '1px solid #e0d9d3', borderLeftWidth: '3px', borderLeftColor: '#c47a3a' }}>
        <p className="text-sm leading-relaxed" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>
          <strong>💡 Cómo guardar como PDF:</strong> Al hacer clic en &quot;Generar&quot;, se abrirá la ventana de impresión del navegador. Selecciona{' '}
          <em>&quot;Guardar como PDF&quot;</em> como destino de impresión para obtener el archivo.
        </p>
      </div>
    </div>
  )
}
