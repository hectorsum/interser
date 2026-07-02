'use client'

import { useState, useEffect, useMemo } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { supabase } from '@/lib/supabase/client'
import { getPacientes, getPagos, getCached, getPacienteNames, invalidate } from '@/lib/queries'
import { sanitizeForm } from '@/lib/sanitize'

type PaymentStatus = 'PAGADO' | 'PENDIENTE'
type Method = 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Yape-Plin'

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
interface Patient {
  id: number
  name: string
  dni: string
  phone: string
  email: string
  service: string
  status: 'ACTIVO' | 'INACTIVO'
}

const statusStyle: Record<PaymentStatus, { bg: string; color: string }> = {
  PAGADO: { bg: 'rgba(39,174,96,0.12)', color: '#1a7a45' },
  PENDIENTE: { bg: 'rgba(230,165,0,0.15)', color: '#7a5500' },
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function formatDate(d: string) {
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

function fromDateObj(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function toDateObj(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

type StatusFilter = 'Todos' | 'PAGADO' | 'PENDIENTE'
type ReceiptFilter = 'Todos' | 'con' | 'sin'

type FormState = {
  patient: string; concept: string; date: Date | null
  amount: string; method: Method; status: PaymentStatus; receipt: boolean
}
const emptyForm: FormState = { patient: '', concept: '', date: new Date(), amount: '', method: 'Efectivo', status: 'PAGADO', receipt: false }

const fieldStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #c8bfb5', padding: '0.6rem 0.75rem',
  fontSize: '0.88rem', fontFamily: 'var(--font-montserrat)', color: '#2d2d2d',
  outline: 'none', background: '#f5f3f0', transition: 'border-color 0.15s, background 0.15s',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: '#9a8a7a', fontFamily: 'var(--font-montserrat)', marginBottom: '0.4rem',
}
function focus(e: React.FocusEvent<HTMLElement>) {
  const t = e.target as HTMLElement & { style: CSSStyleDeclaration }
  t.style.borderColor = '#c47a3a'; t.style.background = 'white'
}
function blur(e: React.FocusEvent<HTMLElement>) {
  const t = e.target as HTMLElement & { style: CSSStyleDeclaration }
  t.style.borderColor = '#c8bfb5'; t.style.background = '#f5f3f0'
}

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

function Backdrop({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-[200]" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose} />
}

function mapRow(r: Record<string, unknown>): Payment {
  return {
    id: r.id as number,
    patient: r.patient as string,
    concept: (r.concept as string) ?? '',
    amount: r.amount as number,
    method: r.method as Method,
    status: r.status as PaymentStatus,
    receipt: r.receipt as boolean,
    date: (r.date as string).slice(0, 10),
  }
}

export default function PagosPage() {
  const [payments, setPayments] = useState<Payment[]>(() => getCached<Payment[]>('pagos') ?? [])
  const [patientOptions, setPatientOptions] = useState<string[]>(() => getPacienteNames() ?? [])
  const [loading, setLoading] = useState(() => getCached('pagos') === null)
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos')
  const [patientFilter, setPatientFilter] = useState('all')
  const [receiptFilter, setReceiptFilter] = useState<ReceiptFilter>('Todos')
  const [periodFilter, setPeriodFilter] = useState('current-month')
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<Payment | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null)
  const [form, setForm] = useState<FormState>({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const now = new Date()
  const currentYear = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth() + 1
  const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`

  const date = now.toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  useEffect(() => {
    // Init receipt filter from URL query param (e.g. ?receipt=sin)
    const params = new URLSearchParams(window.location.search)
    const r = params.get('receipt')
    if (r === 'sin' || r === 'con') setReceiptFilter(r as ReceiptFilter)

    // Load data
    Promise.all([
      // supabase?.from('pagos').select('*').order('date', { ascending: false }),
      // supabase?.from('pacientes').select('name').order('name'),
      getPagos().then((data) => {
        setPayments(data.map(mapRow))
      }),
      getPacientes().then((data) => {
        setPatientOptions(data.map((p: Patient) => p.name))
      }),
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  const allPatients = [...new Set(payments.map((p) => p.patient))].sort()

  const periodOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [
      { value: 'current-month', label: `Mes actual (${MONTH_NAMES[currentMonth - 1]} ${currentYear})` },
      { value: `year-${currentYear}`, label: `${currentYear} completo` },
      { value: `year-${currentYear - 1}`, label: `${currentYear - 1} completo` },
    ]
    for (let m = currentMonth; m >= 1; m--)
      opts.push({ value: `${currentYear}-${String(m).padStart(2, '0')}`, label: `${MONTH_NAMES[m - 1]} ${currentYear}` })
    for (let m = 12; m >= 1; m--)
      opts.push({ value: `${currentYear - 1}-${String(m).padStart(2, '0')}`, label: `${MONTH_NAMES[m - 1]} ${currentYear - 1}` })
    return opts
  }, [currentYear, currentMonth])

  const filtered = useMemo(() => payments.filter((p) => {
    const monthKey = p.date.slice(0, 7)
    const yearKey = p.date.slice(0, 4)
    const matchesPeriod =
      periodFilter === 'current-month' ? monthKey === currentMonthKey :
        periodFilter.startsWith('year-') ? yearKey === periodFilter.replace('year-', '') :
          monthKey === periodFilter
    return matchesPeriod &&
      (statusFilter === 'Todos' || p.status === statusFilter) &&
      (patientFilter === 'all' || p.patient === patientFilter) &&
      (receiptFilter === 'Todos' ? true : receiptFilter === 'con' ? p.receipt : !p.receipt)
  }), [payments, periodFilter, statusFilter, patientFilter, receiptFilter, currentMonthKey])

  const totalPagado = filtered.filter((p) => p.status === 'PAGADO').reduce((a, p) => a + p.amount, 0)
  const totalPendiente = filtered.filter((p) => p.status === 'PENDIENTE').reduce((a, p) => a + p.amount, 0)

  function openAdd() { setForm({ ...emptyForm, date: new Date() }); setErrors({}); setShowAdd(true) }
  function openEdit(p: Payment) {
    setForm({ patient: p.patient, concept: p.concept, date: toDateObj(p.date), amount: String(p.amount), method: p.method, status: p.status, receipt: p.receipt })
    setErrors({}); setEditTarget(p)
  }
  function closeModal() { setShowAdd(false); setEditTarget(null) }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.patient) e.patient = 'Requerido'
    if (!form.date) e.date = 'Requerido'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Ingresa un monto válido'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    const payload = sanitizeForm({
      patient: form.patient, concept: form.concept, date: fromDateObj(form.date!),
      amount: Number(form.amount), method: form.method, status: form.status, receipt: form.receipt,
    })
    if (showAdd) {
      const { data } = await supabase!.from('pagos').insert([payload]).select().single()
      if (data) setPayments((prev) => [mapRow(data), ...prev])
    } else if (editTarget) {
      await supabase!.from('pagos').update(payload).eq('id', editTarget.id)
      setPayments((prev) => prev.map((p) => p.id === editTarget.id ? { id: editTarget.id, ...payload } : p))
    }
    invalidate('pagos', `dashboard-${new Date().getFullYear()}-${new Date().getMonth() + 1}`)
    setSaving(false)
    closeModal()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setSaving(true)
    await supabase!.from('pagos').delete().eq('id', deleteTarget.id)
    setPayments((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    invalidate('pagos', `dashboard-${new Date().getFullYear()}-${new Date().getMonth() + 1}`)
    setSaving(false)
    setDeleteTarget(null)
  }

  const isModalOpen = showAdd || !!editTarget || !!deleteTarget

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-montserrat)', background: active ? '#c47a3a' : 'white',
    color: active ? 'white' : '#5d5d5d', border: '1px solid #d0c9c2',
    fontSize: '0.85rem', fontWeight: 600, padding: '0.45rem 1rem',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' as const,
  })
  const selectStyle: React.CSSProperties = {
    border: '1px solid #d0c9c2', background: 'white', fontFamily: 'var(--font-montserrat)',
    color: '#2d2d2d', fontSize: '0.85rem', padding: '0.45rem 2rem 0.45rem 0.75rem', cursor: 'pointer', outline: 'none',
  }

  return (
    <div className="px-8 py-8 pt-20 md:pt-8">

      {/* Add / Edit modal */}
      {(showAdd || !!editTarget) && (
        <>
          <Backdrop onClose={closeModal} />
          <div className="fixed z-[300] bg-white w-full max-w-[540px] p-8"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[1.1rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d2d2d' }}>
                {showAdd ? 'Agregar Pago' : 'Editar Pago'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a8a7a', fontSize: '1.3rem', lineHeight: 1 }}>×</button>
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Paciente *</label>
              <select value={form.patient} onChange={(e) => setForm((f) => ({ ...f, patient: e.target.value }))}
                style={{ ...fieldStyle, cursor: 'pointer', borderColor: errors.patient ? '#c0392b' : '#c8bfb5' }}
                onFocus={focus} onBlur={blur}>
                <option value="">— Seleccionar paciente —</option>
                {patientOptions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.patient && <p className="text-[0.72rem] mt-1" style={{ color: '#c0392b', fontFamily: 'var(--font-montserrat)' }}>{errors.patient}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label style={labelStyle}>Concepto</label>
                <input placeholder="Ej: Sesión TCC" value={form.concept}
                  onChange={(e) => setForm((f) => ({ ...f, concept: e.target.value }))}
                  style={fieldStyle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>Fecha *</label>
                <DatePicker selected={form.date}
                  onChange={(d: Date | null) => setForm((f) => ({ ...f, date: d }))}
                  dateFormat="dd/MM/yyyy" placeholderText="DD/MM/YYYY"
                  wrapperClassName="w-full"
                  customInput={
                    <input style={{ ...fieldStyle, borderColor: errors.date ? '#c0392b' : '#c8bfb5', width: '100%' }}
                      onFocus={(e) => { e.target.style.borderColor = '#c47a3a'; e.target.style.background = 'white' }}
                      onBlur={(e) => { e.target.style.borderColor = errors.date ? '#c0392b' : '#c8bfb5'; e.target.style.background = '#f5f3f0' }} />
                  } />
                {errors.date && <p className="text-[0.72rem] mt-1" style={{ color: '#c0392b', fontFamily: 'var(--font-montserrat)' }}>{errors.date}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label style={labelStyle}>Monto (S/) *</label>
                <input type="number" min="0" step="0.01" placeholder="0.00" value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  style={{ ...fieldStyle, borderColor: errors.amount ? '#c0392b' : '#c8bfb5' }}
                  onFocus={focus} onBlur={blur} />
                {errors.amount && <p className="text-[0.72rem] mt-1" style={{ color: '#c0392b', fontFamily: 'var(--font-montserrat)' }}>{errors.amount}</p>}
              </div>
              <div>
                <label style={labelStyle}>Método de Pago</label>
                <select value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value as Method }))}
                  style={{ ...fieldStyle, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Yape-Plin">Yape / Plin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-7">
              <div>
                <label style={labelStyle}>Estado</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PaymentStatus }))}
                  style={{ ...fieldStyle, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                  <option value="PAGADO">PAGADO</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <label style={labelStyle}>Recibo Emitido</label>
                <label className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.88rem', color: '#2d2d2d', paddingBottom: '0.65rem' }}>
                  <input type="checkbox" checked={form.receipt} onChange={(e) => setForm((f) => ({ ...f, receipt: e.target.checked }))}
                    style={{ width: '16px', height: '16px', accentColor: '#c47a3a', cursor: 'pointer' }} />
                  Sí, se emitió recibo
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={closeModal} disabled={saving}
                className="px-6 py-2.5 text-sm font-semibold hover:bg-[#f5f3f0] transition-colors"
                style={{ border: '1px solid #d0c9c2', background: 'white', color: '#5d5d5d', fontFamily: 'var(--font-montserrat)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: '#c47a3a', border: 'none', fontFamily: 'var(--font-montserrat)', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete modal */}
      {!!deleteTarget && (
        <>
          <Backdrop onClose={() => setDeleteTarget(null)} />
          <div className="fixed z-[300] bg-white w-full max-w-[400px] p-8"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[1.05rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d2d2d' }}>¿Eliminar pago?</h2>
              <button onClick={() => setDeleteTarget(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a8a7a', fontSize: '1.2rem' }}>×</button>
            </div>
            <p className="text-sm mb-7" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)', lineHeight: 1.6 }}>
              Vas a eliminar el pago de <strong>{deleteTarget.patient}</strong> del <strong>{formatDate(deleteTarget.date)}</strong> por <strong>S/ {deleteTarget.amount.toFixed(2)}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={saving}
                className="px-6 py-2.5 text-sm font-semibold hover:bg-[#f5f3f0] transition-colors"
                style={{ border: '1px solid #d0c9c2', background: 'white', color: '#5d5d5d', fontFamily: 'var(--font-montserrat)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={saving}
                className="px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: '#c0392b', border: 'none', fontFamily: 'var(--font-montserrat)', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Page */}
      <div style={{ filter: isModalOpen ? 'blur(1px)' : 'none', transition: 'filter 0.15s' }}>
        <div className="flex justify-between items-start mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
          <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>Gestión de Pagos</h1>
          <span className="text-[0.82rem] capitalize mt-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{date}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-6">
          <div className="flex overflow-x-auto gap-3 pb-0.5 sm:contents">
            <div className="flex gap-0 shrink-0">
              {(['Todos', 'PAGADO', 'PENDIENTE'] as StatusFilter[]).map((f, i) => {
                const labels: Record<StatusFilter, string> = { Todos: 'Todos', PAGADO: '✓ Pagado', PENDIENTE: '⏳ Pendiente' }
                return (
                  <button key={f} onClick={() => setStatusFilter(f)}
                    style={{ ...filterBtnStyle(statusFilter === f), borderLeft: i > 0 ? 'none' : '1px solid #d0c9c2' }}>
                    {labels[f]}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-0 shrink-0">
              {(['Todos', 'con', 'sin'] as ReceiptFilter[]).map((f, i) => {
                const labels: Record<ReceiptFilter, string> = { Todos: 'Todos', con: '📋 Con recibo', sin: 'Sin recibo' }
                return (
                  <button key={f} onClick={() => setReceiptFilter(f)}
                    style={{ ...filterBtnStyle(receiptFilter === f), borderLeft: i > 0 ? 'none' : '1px solid #d0c9c2' }}>
                    {labels[f]}
                  </button>
                )
              })}
            </div>
          </div>
          <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className="w-full sm:w-auto" style={selectStyle}>
            {periodOptions.slice(0, 3).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            <option disabled>──────────────</option>
            {periodOptions.slice(3, 3 + currentMonth).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            <option disabled>──────────────</option>
            {periodOptions.slice(3 + currentMonth).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={patientFilter} onChange={(e) => setPatientFilter(e.target.value)} className="w-full sm:w-auto" style={selectStyle}>
            <option value="all">Todos los pacientes</option>
            {allPatients.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="flex-1" />
          <button onClick={openAdd}
            className="w-full sm:w-auto px-6 py-2 text-white text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
            style={{ background: '#c47a3a', fontFamily: 'var(--font-montserrat)', border: 'none', cursor: 'pointer' }}>
            + Agregar Pago
          </button>
        </div>

        <div className="bg-white overflow-x-auto" style={{ border: '1px solid #e0d9d3' }}>
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #e0d9d3' }}>
                {['Paciente', 'Concepto', 'Monto', 'Método', 'Estado', 'Recibo', 'Fecha', 'Acciones'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                    style={{ color: '#2d3a28', fontFamily: 'var(--font-montserrat)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>No se encontraron pagos.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-[#fafaf8]" style={{ borderBottom: '1px solid #f0ede9' }}>
                  <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>{p.patient}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{p.concept}</td>
                  <td className="px-5 py-4 text-sm font-bold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>S/ {p.amount.toFixed(2)}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{p.method}</td>
                  <td className="px-5 py-4">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1"
                      style={{ background: statusStyle[p.status].bg, color: statusStyle[p.status].color, fontFamily: 'var(--font-montserrat)' }}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">{p.receipt ? <CheckIcon /> : <XIcon />}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{formatDate(p.date)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-xs font-bold px-4 py-1.5 text-white hover:opacity-80 transition-opacity"
                        style={{ background: '#2d3a28', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>Editar</button>
                      <button onClick={() => setDeleteTarget(p)} className="text-xs font-bold px-4 py-1.5 text-white hover:opacity-80 transition-opacity"
                        style={{ background: '#c0392b', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end items-stretch gap-0 px-6 py-5" style={{ borderTop: '1px solid #e0d9d3' }}>
            <div className="text-right pr-8" style={{ borderRight: '1px solid #e0d9d3' }}>
              <p className="text-[0.68rem] font-bold uppercase tracking-widest mb-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>Total Pagado</p>
              <p className="text-[1.4rem] font-bold leading-none" style={{ color: '#2d2d2d', fontFamily: 'var(--font-raleway)' }}>S/ {totalPagado.toFixed(2)}</p>
            </div>
            <div className="text-right pl-8">
              <p className="text-[0.68rem] font-bold uppercase tracking-widest mb-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>Total Pendiente</p>
              <p className="text-[1.4rem] font-bold leading-none" style={{ color: '#c0392b', fontFamily: 'var(--font-raleway)' }}>S/ {totalPendiente.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
