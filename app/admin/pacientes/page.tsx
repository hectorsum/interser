'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getPacientes, getCached, invalidate } from '@/lib/queries'
import { sanitizeForm } from '@/lib/sanitize'

interface Patient {
  id: number
  name: string
  dni: string
  phone: string
  email: string
  service: string
  status: 'ACTIVO' | 'INACTIVO'
}

const SERVICES = [
  'Terapia Cognitivo Conductual - TCC',
  'Terapia Dialéctica Conductual - DBT',
  'Evaluación integral',
  'Evaluación de TDAH y funciones ejecutivas',
  'Evaluación psicoeducativa',
  'Evaluación en salud mental',
  'Evaluación de altas capacidades',
  'Evaluación de autismo',
  'Apoyo en hábitos de estudio y aprendizaje',
]

const statusStyle: Record<string, { bg: string; color: string }> = {
  ACTIVO: { bg: 'rgba(39,174,96,0.12)', color: '#1a7a45' },
  INACTIVO: { bg: 'rgba(192,57,43,0.10)', color: '#c0392b' },
}

type Filter = 'Todos' | 'Activos' | 'Inactivos'
type PatientStatus = 'ACTIVO' | 'INACTIVO'
type FormState = { name: string; dni: string; phone: string; email: string; service: string; status: PatientStatus }
const emptyForm: FormState = { name: '', dni: '', phone: '', email: '', service: '', status: 'ACTIVO' }

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #c8bfb5', padding: '0.6rem 0.75rem',
  fontSize: '0.88rem', fontFamily: 'var(--font-montserrat)', color: '#2d2d2d',
  outline: 'none', background: '#f5f3f0', transition: 'border-color 0.15s, background 0.15s',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: '#9a8a7a', fontFamily: 'var(--font-montserrat)', marginBottom: '0.4rem',
}

function Backdrop({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-[200]" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose} />
}

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>(() => getCached<Patient[]>('pacientes') ?? [])
  const [loading, setLoading] = useState(() => getCached('pacientes') === null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<Filter>('Todos')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<Patient | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null)
  const [form, setForm] = useState<FormState>({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const date = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  useEffect(() => {
    getPacientes().then((data) => {
      setPatients(data as Patient[])
      setLoading(false)
    })
  }, [])

  const filtered = patients.filter((p) => {
    const matchesFilter = filter === 'Todos' ? true : filter === 'Activos' ? p.status === 'ACTIVO' : p.status === 'INACTIVO'
    const q = search.toLowerCase()
    return matchesFilter && (!q || p.name.toLowerCase().includes(q) || p.dni.includes(q))
  })

  function openAdd() { setForm({ ...emptyForm }); setErrors({}); setShowAdd(true) }
  function openEdit(p: Patient) { setForm({ name: p.name, dni: p.dni, phone: p.phone, email: p.email, service: p.service, status: p.status }); setErrors({}); setEditTarget(p) }
  function closeModal() { setShowAdd(false); setEditTarget(null) }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Requerido'
    if (!form.dni.trim()) e.dni = 'Requerido'
    if (!form.service) e.service = 'Selecciona un servicio'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    const payload = sanitizeForm({ name: form.name, dni: form.dni, phone: form.phone, email: form.email, service: form.service, status: form.status })
    if (showAdd) {
      const { data } = await supabase!.from('pacientes').insert([payload]).select().single()
      if (data) setPatients((prev) => [...prev, data as Patient])
    } else if (editTarget) {
      await supabase!.from('pacientes').update(payload).eq('id', editTarget.id)
      setPatients((prev) => prev.map((p) => p.id === editTarget.id ? { ...p, ...payload } : p))
    }
    invalidate('pacientes', `dashboard-${new Date().getFullYear()}-${new Date().getMonth() + 1}`)
    setSaving(false)
    closeModal()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setSaving(true)
    await supabase!.from('pacientes').delete().eq('id', deleteTarget.id)
    setPatients((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    invalidate('pacientes', `dashboard-${new Date().getFullYear()}-${new Date().getMonth() + 1}`)
    setSaving(false)
    setDeleteTarget(null)
  }

  const isModalOpen = showAdd || !!editTarget || !!deleteTarget

  return (
    <div className="px-8 py-8">

      {/* Add / Edit modal */}
      {(showAdd || !!editTarget) && (
        <>
          <Backdrop onClose={closeModal} />
          <div className="fixed z-[300] bg-white w-full max-w-[560px] p-8"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[1.1rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d2d2d' }}>
                {showAdd ? 'Agregar Paciente' : 'Editar Paciente'}
              </h2>
              <button onClick={closeModal} className="text-xl leading-none" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a8a7a' }}>×</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label style={labelStyle}>Nombre completo *</label>
                <input placeholder="Nombre y apellidos" value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={{ ...inputStyle, borderColor: errors.name ? '#c0392b' : '#c8bfb5' }}
                  onFocus={(e) => { e.target.style.borderColor = '#c47a3a'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = errors.name ? '#c0392b' : '#c8bfb5'; e.target.style.background = '#f5f3f0' }} />
                {errors.name && <p className="text-[0.72rem] mt-1" style={{ color: '#c0392b', fontFamily: 'var(--font-montserrat)' }}>{errors.name}</p>}
              </div>
              <div>
                <label style={labelStyle}>DNI *</label>
                <input placeholder="12345678" value={form.dni}
                  onChange={(e) => setForm((f) => ({ ...f, dni: e.target.value }))}
                  style={{ ...inputStyle, borderColor: errors.dni ? '#c0392b' : '#c8bfb5' }}
                  onFocus={(e) => { e.target.style.borderColor = '#c47a3a'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = errors.dni ? '#c0392b' : '#c8bfb5'; e.target.style.background = '#f5f3f0' }} />
                {errors.dni && <p className="text-[0.72rem] mt-1" style={{ color: '#c0392b', fontFamily: 'var(--font-montserrat)' }}>{errors.dni}</p>}
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input placeholder="9XXXXXXXX" value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#c47a3a'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = '#c8bfb5'; e.target.style.background = '#f5f3f0' }} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input placeholder="correo@ejemplo.com" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#c47a3a'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = '#c8bfb5'; e.target.style.background = '#f5f3f0' }} />
              </div>
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Servicio</label>
              <select value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                style={{ ...inputStyle, borderColor: errors.service ? '#c0392b' : '#c8bfb5', cursor: 'pointer' }}>
                <option value="">— Seleccionar —</option>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.service && <p className="text-[0.72rem] mt-1" style={{ color: '#c0392b', fontFamily: 'var(--font-montserrat)' }}>{errors.service}</p>}
            </div>

            <div className="mb-7">
              <label style={labelStyle}>Estado</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PatientStatus }))}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={closeModal} disabled={saving}
                className="px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-[#f5f3f0]"
                style={{ border: '1px solid #d0c9c2', background: 'white', color: '#5d5d5d', fontFamily: 'var(--font-montserrat)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
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
              <h2 className="text-[1.05rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d2d2d' }}>¿Eliminar paciente?</h2>
              <button onClick={() => setDeleteTarget(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a8a7a', fontSize: '1.2rem' }}>×</button>
            </div>
            <p className="text-sm mb-7" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)', lineHeight: 1.6 }}>
              Vas a eliminar a <strong>{deleteTarget.name}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={saving}
                className="px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-[#f5f3f0]"
                style={{ border: '1px solid #d0c9c2', background: 'white', color: '#5d5d5d', fontFamily: 'var(--font-montserrat)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={saving}
                className="px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
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
          <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>Gestión de Pacientes</h1>
          <span className="text-[0.82rem] capitalize mt-1" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{date}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-6">
          <div className="flex gap-0">
            {(['Todos', 'Activos', 'Inactivos'] as Filter[]).map((f, i) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-5 py-2 text-sm font-semibold transition-all duration-150"
                style={{ fontFamily: 'var(--font-montserrat)', background: filter === f ? '#c47a3a' : 'white', color: filter === f ? 'white' : '#5d5d5d', border: '1px solid #d0c9c2', borderLeft: i > 0 ? 'none' : '1px solid #d0c9c2', cursor: 'pointer' }}>
                {f}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex flex-1" />
          <input type="text" placeholder="Buscar nombre o DNI..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 text-sm outline-none w-full sm:w-48"
            style={{ border: '1px solid #d0c9c2', background: 'white', fontFamily: 'var(--font-montserrat)', color: '#2d2d2d' }}
            onFocus={(e) => (e.target.style.borderColor = '#c47a3a')}
            onBlur={(e) => (e.target.style.borderColor = '#d0c9c2')} />
          <button onClick={openAdd}
            className="w-full sm:w-auto px-6 py-2 text-white text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
            style={{ background: '#c47a3a', fontFamily: 'var(--font-montserrat)', border: 'none', cursor: 'pointer' }}>
            + Agregar Paciente
          </button>
        </div>

        <div className="bg-white overflow-x-auto" style={{ border: '1px solid #e0d9d3' }}>
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #e0d9d3' }}>
                {['Nombre', 'DNI', 'Teléfono', 'Servicio', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                    style={{ color: '#2d3a28', fontFamily: 'var(--font-montserrat)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>No se encontraron pacientes.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-[#fafaf8]" style={{ borderBottom: '1px solid #f0ede9' }}>
                  <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>{p.name}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{p.dni}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: '#c47a3a', fontFamily: 'var(--font-montserrat)' }}>{p.phone}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{p.service}</td>
                  <td className="px-5 py-4">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1"
                      style={{ background: statusStyle[p.status].bg, color: statusStyle[p.status].color, fontFamily: 'var(--font-montserrat)' }}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-xs font-bold px-4 py-1.5 text-white transition-opacity hover:opacity-80"
                        style={{ background: '#2d3a28', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>Editar</button>
                      <button onClick={() => setDeleteTarget(p)} className="text-xs font-bold px-4 py-1.5 text-white transition-opacity hover:opacity-80"
                        style={{ background: '#c0392b', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
