'use client'

import { useState, useEffect, useMemo } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { supabase } from '@/lib/supabase'

type SessionType = 'TERAPIA' | 'EVALUACIÓN'

interface Session {
  id: number
  date: string   // YYYY-MM-DD
  time: string   // HH:MM
  patient: string
  type: SessionType
  notes: string
}

const typeStyle: Record<SessionType, { bg: string; color: string }> = {
  TERAPIA:    { bg: 'rgba(39,174,96,0.12)',  color: '#1a7a45' },
  EVALUACIÓN: { bg: 'rgba(74,112,196,0.12)', color: '#2a4a9a' },
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function toDateObj(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function fromDateObj(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

type FormState = { patient: string; date: Date | null; time: string; type: SessionType; notes: string }
const emptyForm: FormState = { patient: '', date: new Date(), time: '10:00', type: 'TERAPIA', notes: '' }

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

function Backdrop({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-[200]" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose} />
}

function mapRow(r: Record<string, unknown>): Session {
  return {
    id: r.id as number,
    patient: r.patient as string,
    date: (r.date as string).slice(0, 10),
    time: r.time as string,
    type: r.type as SessionType,
    notes: (r.notes as string) ?? '',
  }
}

export default function SesionesPage() {
  const [sessions,       setSessions]       = useState<Session[]>([])
  const [patientOptions, setPatientOptions] = useState<string[]>([])
  const [loading,        setLoading]        = useState(true)
  const [saving,         setSaving]         = useState(false)
  const [patientFilter,  setPatientFilter]  = useState('all')
  const [monthFilter,    setMonthFilter]    = useState('all')
  const [showAdd,        setShowAdd]        = useState(false)
  const [editTarget,     setEditTarget]     = useState<Session | null>(null)
  const [deleteTarget,   setDeleteTarget]   = useState<Session | null>(null)
  const [form,           setForm]           = useState<FormState>({ ...emptyForm })
  const [errors,         setErrors]         = useState<Record<string, string>>({})

  const now          = new Date()
  const currentYear  = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth() + 1

  const date = now.toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  useEffect(() => {
    Promise.all([
      supabase?.from('sesiones').select('*').order('date', { ascending: false }),
      supabase?.from('pacientes').select('name').eq('status', 'ACTIVO').order('name'),
    ]).then(([sesRes, pacRes]) => {
      if (sesRes?.data) setSessions(sesRes.data.map(mapRow))
      if (pacRes?.data) setPatientOptions(pacRes.data.map((p: { name: string }) => p.name))
      setLoading(false)
    })
  }, [])

  const monthOptions = Array.from({ length: currentMonth }, (_, i) => {
    const m = currentMonth - i
    return { value: `${currentYear}-${String(m).padStart(2, '0')}`, label: `${MONTH_NAMES[m - 1]} ${currentYear}` }
  })

  const allPatients = [...new Set(sessions.map((s) => s.patient))].sort()

  const filtered = useMemo(() => sessions.filter((s) => {
    const monthKey = s.date.slice(0, 7)
    return (patientFilter === 'all' || s.patient === patientFilter) &&
           (monthFilter   === 'all' || monthKey  === monthFilter)
  }), [sessions, patientFilter, monthFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, Session[]>()
    filtered.forEach((s) => {
      const key = s.date.slice(0, 7)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    })
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  function openAdd() { setForm({ ...emptyForm, date: new Date() }); setErrors({}); setShowAdd(true) }
  function openEdit(s: Session) { setForm({ patient: s.patient, date: toDateObj(s.date), time: s.time, type: s.type, notes: s.notes }); setErrors({}); setEditTarget(s) }
  function closeModal() { setShowAdd(false); setEditTarget(null) }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.patient) e.patient = 'Requerido'
    if (!form.date)    e.date    = 'Requerido'
    if (!form.time)    e.time    = 'Requerido'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    const payload = { patient: form.patient, date: fromDateObj(form.date!), time: form.time, type: form.type, notes: form.notes }
    if (showAdd) {
      const { data } = await supabase!.from('sesiones').insert([payload]).select().single()
      if (data) setSessions((prev) => [mapRow(data), ...prev])
    } else if (editTarget) {
      await supabase!.from('sesiones').update(payload).eq('id', editTarget.id)
      setSessions((prev) => prev.map((s) => s.id === editTarget.id ? { ...s, ...payload } : s))
    }
    setSaving(false)
    closeModal()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setSaving(true)
    await supabase!.from('sesiones').delete().eq('id', deleteTarget.id)
    setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id))
    setSaving(false)
    setDeleteTarget(null)
  }

  const isModalOpen = showAdd || !!editTarget || !!deleteTarget
  const selectStyle = { ...fieldStyle, cursor: 'pointer' }

  return (
    <div className="px-8 py-8">

      {/* Add / Edit modal */}
      {(showAdd || !!editTarget) && (
        <>
          <Backdrop onClose={closeModal} />
          <div className="fixed z-[300] bg-white w-full max-w-[520px] p-8"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[1.1rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d2d2d' }}>
                {showAdd ? 'Agregar Sesión' : 'Editar Sesión'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a8a7a', fontSize: '1.3rem', lineHeight: 1 }}>×</button>
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Paciente *</label>
              <select value={form.patient} onChange={(e) => setForm((f) => ({ ...f, patient: e.target.value }))}
                style={{ ...selectStyle, borderColor: errors.patient ? '#c0392b' : '#c8bfb5' }}
                onFocus={focus} onBlur={blur}>
                <option value="">— Seleccionar paciente —</option>
                {patientOptions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.patient && <p className="text-[0.72rem] mt-1" style={{ color: '#c0392b', fontFamily: 'var(--font-montserrat)' }}>{errors.patient}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
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
              <div>
                <label style={labelStyle}>Hora *</label>
                <input type="time" value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  style={{ ...fieldStyle, borderColor: errors.time ? '#c0392b' : '#c8bfb5' }}
                  onFocus={focus} onBlur={blur} />
                {errors.time && <p className="text-[0.72rem] mt-1" style={{ color: '#c0392b', fontFamily: 'var(--font-montserrat)' }}>{errors.time}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Tipo de Sesión</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as SessionType }))}
                style={selectStyle} onFocus={focus} onBlur={blur}>
                <option value="TERAPIA">Terapia</option>
                <option value="EVALUACIÓN">Evaluación</option>
              </select>
            </div>

            <div className="mb-7">
              <label style={labelStyle}>Notas</label>
              <textarea rows={3} placeholder="Observaciones de la sesión..." value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                style={{ ...fieldStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
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
              <h2 className="text-[1.05rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d2d2d' }}>¿Eliminar sesión?</h2>
              <button onClick={() => setDeleteTarget(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a8a7a', fontSize: '1.2rem' }}>×</button>
            </div>
            <p className="text-sm mb-7" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)', lineHeight: 1.6 }}>
              Vas a eliminar la sesión de <strong>{deleteTarget.patient}</strong> del <strong>{formatDate(deleteTarget.date)}</strong>. Esta acción no se puede deshacer.
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
          <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>Gestión de Sesiones</h1>
          <span className="text-[0.82rem] capitalize mt-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{date}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <select value={patientFilter} onChange={(e) => setPatientFilter(e.target.value)} className="w-full sm:w-auto"
            style={{ border: '1px solid #d0c9c2', background: 'white', fontFamily: 'var(--font-montserrat)', color: '#2d2d2d', fontSize: '0.88rem', padding: '0.5rem 2rem 0.5rem 0.875rem', cursor: 'pointer', outline: 'none' }}>
            <option value="all">Todos los pacientes</option>
            {allPatients.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="w-full sm:w-auto"
            style={{ border: '1px solid #d0c9c2', background: 'white', fontFamily: 'var(--font-montserrat)', color: '#2d2d2d', fontSize: '0.88rem', padding: '0.5rem 2rem 0.5rem 0.875rem', cursor: 'pointer', outline: 'none' }}>
            <option value="all">Todos los meses</option>
            {monthOptions.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <div className="flex-1" />
          <button onClick={openAdd}
            className="w-full sm:w-auto px-6 py-2 text-white text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
            style={{ background: '#c47a3a', fontFamily: 'var(--font-montserrat)', border: 'none', cursor: 'pointer' }}>
            + Agregar Sesión
          </button>
        </div>

        {loading ? (
          <p className="text-sm py-12 text-center" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>Cargando...</p>
        ) : grouped.length === 0 ? (
          <p className="text-sm py-12 text-center" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>No se encontraron sesiones.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {grouped.map(([monthKey, monthSessions]) => {
              const [y, m] = monthKey.split('-')
              return (
                <div key={monthKey}>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-[0.8rem] font-bold tracking-wider" style={{ color: '#c47a3a', fontFamily: 'var(--font-montserrat)' }}>
                      {MONTH_NAMES[parseInt(m) - 1].toUpperCase()} {y}
                    </span>
                    <span className="text-[0.75rem] font-semibold tracking-widest uppercase" style={{ color: '#b0a090', fontFamily: 'var(--font-montserrat)' }}>
                      {monthSessions.length} {monthSessions.length === 1 ? 'SESIÓN' : 'SESIONES'}
                    </span>
                  </div>
                  <div className="bg-white overflow-x-auto" style={{ border: '1px solid #e0d9d3' }}>
                    <table className="w-full border-collapse min-w-[600px]">
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e0d9d3' }}>
                          {['Fecha', 'Hora', 'Paciente', 'Tipo', 'Notas', 'Acciones'].map((h) => (
                            <th key={h} className="px-5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                              style={{ color: '#2d3a28', fontFamily: 'var(--font-montserrat)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {monthSessions.map((s) => (
                          <tr key={s.id} className="transition-colors hover:bg-[#fafaf8]" style={{ borderBottom: '1px solid #f0ede9' }}>
                            <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>{formatDate(s.date)}</td>
                            <td className="px-5 py-4 text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{s.time}</td>
                            <td className="px-5 py-4 text-sm" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>{s.patient}</td>
                            <td className="px-5 py-4">
                              <span className="text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1"
                                style={{ background: typeStyle[s.type].bg, color: typeStyle[s.type].color, fontFamily: 'var(--font-montserrat)' }}>
                                {s.type}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{s.notes || '—'}</td>
                            <td className="px-5 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => openEdit(s)} className="text-xs font-bold px-4 py-1.5 text-white hover:opacity-80 transition-opacity"
                                  style={{ background: '#2d3a28', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>Editar</button>
                                <button onClick={() => setDeleteTarget(s)} className="text-xs font-bold px-4 py-1.5 text-white hover:opacity-80 transition-opacity"
                                  style={{ background: '#c0392b', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>Eliminar</button>
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
    </div>
  )
}
