'use client'

import { useState, useMemo } from 'react'

type PaymentStatus = 'PAGADO' | 'PENDIENTE'
type Method = 'Efectivo' | 'Transferencia' | 'Tarjeta'

interface Payment {
  id: number
  patient: string
  concept: string
  amount: number
  method: Method
  status: PaymentStatus
  receipt: boolean
  date: string  // YYYY-MM-DD
}

const mockPayments: Payment[] = [
  { id: 1,  patient: 'Roberto Jiménez', concept: 'Sesión terapia',       amount: 120, method: 'Efectivo',      status: 'PENDIENTE', receipt: false, date: '2026-06-10' },
  { id: 2,  patient: 'Ana Rodríguez',   concept: '—',                    amount: 120, method: 'Transferencia', status: 'PENDIENTE', receipt: true,  date: '2026-06-10' },
  { id: 3,  patient: 'Sofía Herrera',   concept: 'Sesión TCC',           amount: 120, method: 'Efectivo',      status: 'PAGADO',    receipt: true,  date: '2026-06-03' },
  { id: 4,  patient: 'Isabel Moreno',   concept: 'Eval. seguimiento',    amount: 220, method: 'Tarjeta',       status: 'PAGADO',    receipt: true,  date: '2026-05-21' },
  { id: 5,  patient: 'Ana Rodríguez',   concept: 'Sesión DBT',           amount: 120, method: 'Transferencia', status: 'PAGADO',    receipt: true,  date: '2026-05-14' },
  { id: 6,  patient: 'María García',    concept: 'Sesión TCC',           amount: 120, method: 'Transferencia', status: 'PAGADO',    receipt: true,  date: '2026-05-06' },
  { id: 7,  patient: 'Pedro Torres',    concept: 'Apoyo hábitos',        amount: 100, method: 'Efectivo',      status: 'PENDIENTE', receipt: false, date: '2026-04-15' },
  { id: 8,  patient: 'Carlos Martínez', concept: 'Sesión terapia',       amount: 120, method: 'Transferencia', status: 'PAGADO',    receipt: true,  date: '2026-04-08' },
  { id: 9,  patient: 'Sofía Herrera',   concept: 'Sesión TCC',           amount: 120, method: 'Efectivo',      status: 'PAGADO',    receipt: true,  date: '2026-04-02' },
  { id: 10, patient: 'Roberto Jiménez', concept: 'Evaluación autismo',   amount: 200, method: 'Efectivo',      status: 'PENDIENTE', receipt: false, date: '2026-03-25' },
  { id: 11, patient: 'Juan López',      concept: 'Sesión terapia',       amount: 120, method: 'Transferencia', status: 'PAGADO',    receipt: true,  date: '2026-03-11' },
  { id: 12, patient: 'María García',    concept: 'Sesión TCC',           amount: 120, method: 'Efectivo',      status: 'PAGADO',    receipt: true,  date: '2026-02-19' },
]

const statusStyle: Record<PaymentStatus, { bg: string; color: string }> = {
  PAGADO:    { bg: 'rgba(39,174,96,0.12)',  color: '#1a7a45' },
  PENDIENTE: { bg: 'rgba(230,165,0,0.15)',  color: '#7a5500' },
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const patients = [...new Set(mockPayments.map((p) => p.patient))].sort()

function formatDate(d: string) {
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

type StatusFilter  = 'Todos' | 'PAGADO' | 'PENDIENTE'
type ReceiptFilter = 'Todos' | 'con' | 'sin'

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a7a45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function PagosPage() {
  const [statusFilter,  setStatusFilter]  = useState<StatusFilter>('Todos')
  const [patientFilter, setPatientFilter] = useState('all')
  const [receiptFilter, setReceiptFilter] = useState<ReceiptFilter>('Todos')
  const [periodFilter,  setPeriodFilter]  = useState('current-month')

  const now          = new Date()
  const currentYear  = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth() + 1

  const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`

  // Build dropdown options
  const periodOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [
      { value: 'current-month', label: `Mes actual (${MONTH_NAMES[currentMonth - 1]} ${currentYear})` },
      { value: `year-${currentYear}`, label: `${currentYear} completo` },
      { value: `year-${currentYear - 1}`, label: `${currentYear - 1} completo` },
    ]
    // months of current year up to now, descending
    for (let m = currentMonth; m >= 1; m--) {
      const key = `${currentYear}-${String(m).padStart(2, '0')}`
      opts.push({ value: key, label: `${MONTH_NAMES[m - 1]} ${currentYear}` })
    }
    // months of last year, descending
    for (let m = 12; m >= 1; m--) {
      const key = `${currentYear - 1}-${String(m).padStart(2, '0')}`
      opts.push({ value: key, label: `${MONTH_NAMES[m - 1]} ${currentYear - 1}` })
    }
    return opts
  }, [currentYear, currentMonth])

  const date = now.toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const filtered = useMemo(() => {
    return mockPayments.filter((p) => {
      const monthKey = p.date.slice(0, 7)          // YYYY-MM
      const yearKey  = p.date.slice(0, 4)          // YYYY

      const matchesPeriod =
        periodFilter === 'current-month'             ? monthKey === currentMonthKey :
        periodFilter.startsWith('year-')             ? yearKey  === periodFilter.replace('year-', '') :
                                                       monthKey === periodFilter

      const matchesStatus  = statusFilter  === 'Todos' || p.status === statusFilter
      const matchesPatient = patientFilter === 'all'   || p.patient === patientFilter
      const matchesReceipt =
        receiptFilter === 'Todos' ? true :
        receiptFilter === 'con'   ? p.receipt :
                                    !p.receipt

      return matchesPeriod && matchesStatus && matchesPatient && matchesReceipt
    })
  }, [periodFilter, statusFilter, patientFilter, receiptFilter, currentMonthKey])

  const totalPagado   = filtered.filter((p) => p.status === 'PAGADO').reduce((acc, p) => acc + p.amount, 0)
  const totalPendiente = filtered.filter((p) => p.status === 'PENDIENTE').reduce((acc, p) => acc + p.amount, 0)

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-montserrat)',
    background: active ? '#c47a3a' : 'white',
    color: active ? 'white' : '#5d5d5d',
    border: '1px solid #d0c9c2',
    fontSize: '0.85rem',
    fontWeight: 600,
    padding: '0.45rem 1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    whiteSpace: 'nowrap' as const,
  })

  const selectStyle: React.CSSProperties = {
    border: '1px solid #d0c9c2',
    background: 'white',
    fontFamily: 'var(--font-montserrat)',
    color: '#2d2d2d',
    fontSize: '0.85rem',
    padding: '0.45rem 2rem 0.45rem 0.75rem',
    cursor: 'pointer',
    outline: 'none',
  }

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>
          Gestión de Pagos
        </h1>
        <span className="text-[0.82rem] capitalize mt-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
          {date}
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-6">

        {/* Mobile: both button groups on one scrollable row */}
        <div className="flex overflow-x-auto gap-3 pb-0.5 sm:contents">
          {/* Status filter */}
          <div className="flex gap-0 shrink-0">
            {(['Todos', 'PAGADO', 'PENDIENTE'] as StatusFilter[]).map((f, i) => {
              const labels: Record<StatusFilter, string> = { Todos: 'Todos', PAGADO: '✓ Pagado', PENDIENTE: '⏳ Pendiente' }
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  style={{ ...filterBtnStyle(statusFilter === f), borderLeft: i > 0 ? 'none' : '1px solid #d0c9c2' }}
                >
                  {labels[f]}
                </button>
              )
            })}
          </div>

          {/* Receipt filter */}
          <div className="flex gap-0 shrink-0">
            {(['Todos', 'con', 'sin'] as ReceiptFilter[]).map((f, i) => {
              const labels: Record<ReceiptFilter, string> = { Todos: 'Todos', con: '📋 Con recibo', sin: 'Sin recibo' }
              return (
                <button
                  key={f}
                  onClick={() => setReceiptFilter(f)}
                  style={{ ...filterBtnStyle(receiptFilter === f), borderLeft: i > 0 ? 'none' : '1px solid #d0c9c2' }}
                >
                  {labels[f]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Period dropdown */}
        <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} style={{ ...selectStyle, width: '100%' }} className="sm:w-auto">
          {periodOptions.slice(0, 3).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
          <option disabled>──────────────</option>
          {periodOptions.slice(3, 3 + currentMonth).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
          <option disabled>──────────────</option>
          {periodOptions.slice(3 + currentMonth).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Patient dropdown */}
        <select value={patientFilter} onChange={(e) => setPatientFilter(e.target.value)} style={{ ...selectStyle, width: '100%' }} className="sm:w-auto">
          <option value="all">Todos los pacientes</option>
          {patients.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <div className="hidden sm:flex flex-1" />

        <button
          className="w-full sm:w-auto px-6 py-2 text-white text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
          style={{ background: '#c47a3a', fontFamily: 'var(--font-montserrat)', border: 'none', cursor: 'pointer' }}
        >
          + Agregar Pago
        </button>
      </div>

      {/* Table */}
      <div className="bg-white overflow-x-auto" style={{ border: '1px solid #e0d9d3' }}>
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr style={{ borderBottom: '1px solid #e0d9d3' }}>
              {['Paciente', 'Concepto', 'Monto', 'Método', 'Estado', 'Recibo', 'Fecha', 'Acciones'].map((h) => (
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
                  No se encontraron pagos.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-[#fafaf8]"
                  style={{ borderBottom: '1px solid #f0ede9' }}
                >
                  <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>
                    {p.patient}
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
                    {p.concept}
                  </td>
                  <td className="px-5 py-4 text-sm font-bold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>
                    S/ {p.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
                    {p.method}
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
                    {p.receipt ? <CheckIcon /> : <XIcon />}
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>
                    {formatDate(p.date)}
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
              ))
            )}
          </tbody>
        </table>

        {/* Totals footer */}
        <div
          className="flex justify-end items-stretch gap-0 px-6 py-5"
          style={{ borderTop: '1px solid #e0d9d3' }}
        >
          <div className="text-right pr-8" style={{ borderRight: '1px solid #e0d9d3' }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-widest mb-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
              Total Pagado
            </p>
            <p className="text-[1.4rem] font-bold leading-none" style={{ color: '#2d2d2d', fontFamily: 'var(--font-raleway)' }}>
              S/ {totalPagado.toFixed(2)}
            </p>
          </div>
          <div className="text-right pl-8">
            <p className="text-[0.68rem] font-bold uppercase tracking-widest mb-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
              Total Pendiente
            </p>
            <p className="text-[1.4rem] font-bold leading-none" style={{ color: '#c0392b', fontFamily: 'var(--font-raleway)' }}>
              S/ {totalPendiente.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
