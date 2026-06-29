import { createClient } from '@/lib/supabase/server'
import PrintButton from '../PrintButton'

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function fmt(n: number) {
  return `S/ ${n.toFixed(2)}`
}

function fmtDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${parseInt(d)}/${parseInt(m)}/${y}`
}

export default async function MensualReportPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const { month } = await searchParams
  const now = new Date()
  const fallback = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const [yearStr, monthStr] = (month || fallback).split('-')
  const year = parseInt(yearStr)
  const monthNum = parseInt(monthStr)

  const startDate = `${year}-${String(monthNum).padStart(2, '0')}-01`
  const nextMonth = monthNum === 12 ? 1 : monthNum + 1
  const nextYear = monthNum === 12 ? year + 1 : year
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`

  const supabase = await createClient()
  const [{ data: sessions }, { data: allPayments }] = await Promise.all([
    supabase.from('sesiones').select('*').gte('date', startDate).lt('date', endDate).order('date'),
    supabase.from('pagos').select('*').gte('date', startDate).lt('date', endDate).order('date'),
  ])

  const paid = (allPayments || []).filter(p => p.status === 'PAGADO')
  const pending = (allPayments || []).filter(p => p.status === 'PENDIENTE')

  const totalIngresos = paid.reduce((s, p) => s + Number(p.amount), 0)
  const totalPendiente = pending.reduce((s, p) => s + Number(p.amount), 0)
  const sessionCount = (sessions || []).length
  const uniquePatients = new Set((sessions || []).map(s => s.patient)).size

  // Patient breakdown: group sessions, then attach paid payment data
  const sessionsByPatient: Record<string, number> = {}
  ;(sessions || []).forEach(s => {
    sessionsByPatient[s.patient] = (sessionsByPatient[s.patient] || 0) + 1
  })

  const paymentsByPatient: Record<string, { concepts: string[]; total: number }> = {}
  paid.forEach(p => {
    if (!paymentsByPatient[p.patient]) paymentsByPatient[p.patient] = { concepts: [], total: 0 }
    if (p.concept) paymentsByPatient[p.patient].concepts.push(p.concept)
    paymentsByPatient[p.patient].total += Number(p.amount)
  })

  const patientRows = Object.entries(sessionsByPatient).map(([name, count]) => ({
    name,
    sessions: count,
    concepts: paymentsByPatient[name]?.concepts.filter(Boolean).join(', ') || null,
    total: paymentsByPatient[name]?.total || 0,
  }))

  const allHaveReceipt = paid.length > 0 && paid.every(p => p.receipt)
  const monthName = MONTH_NAMES[monthNum - 1]
  const today = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`

  const cell: React.CSSProperties = { padding: '9px 0', fontSize: '0.875rem' }
  const th: React.CSSProperties = { padding: '10px 0', color: '#888', fontWeight: '500', fontSize: '0.78rem', borderBottom: '1px solid #e0d9d3', textAlign: 'left' }

  return (
    <>
      <PrintButton />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 48px', fontFamily: 'var(--font-montserrat)', color: '#2d2d2d' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, fontFamily: 'var(--font-raleway)' }}>
              Reporte Mensual de Ingresos — {monthName} {year}
            </h1>
            <p style={{ color: '#777', fontSize: '0.85rem', margin: '4px 0 0' }}>Centro de Psicología Interser</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-main.svg" alt="Interser" style={{ height: '36px', width: 'auto', marginTop: '4px' }} />
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #2d2d2d', margin: '14px 0 28px' }} />

        {/* Period + Generated */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', fontSize: '0.9rem' }}>
          <span>Período: <strong>{monthName} {year}</strong></span>
          <span>Generado: <strong>{today}</strong></span>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '36px' }}>
          {([
            { label: 'TOTAL\nINGRESOS', value: fmt(totalIngresos), color: '#2d3a28' },
            { label: 'SESIONES\nREALIZADAS', value: String(sessionCount), color: '#2d3a28' },
            { label: 'PACIENTES\nATENDIDOS', value: String(uniquePatients), color: '#2d3a28' },
            { label: 'PAGOS\nPENDIENTES', value: fmt(totalPendiente), color: '#b94040' },
          ] as const).map(({ label, value, color }) => (
            <div key={label} style={{ border: '1px solid #d0c9c2', padding: '14px 16px' }}>
              <p style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.07em', color: '#666', margin: '0 0 10px', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                {label}
              </p>
              <p style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Desglose por Paciente */}
        <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 8px', fontFamily: 'var(--font-raleway)' }}>
          Desglose por Paciente
        </h2>
        <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 0' }} />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '36px' }}>
          <thead>
            <tr>
              <th style={th}>Paciente</th>
              <th style={th}>Sesiones</th>
              <th style={th}>Concepto(s)</th>
              <th style={{ ...th, textAlign: 'right' }}>Monto Pagado</th>
            </tr>
          </thead>
          <tbody>
            {patientRows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0ebe5' }}>
                <td style={cell}>{row.name}</td>
                <td style={cell}>{row.sessions}</td>
                <td style={{ ...cell, color: row.concepts ? '#2d2d2d' : '#aaa' }}>{row.concepts || '—'}</td>
                <td style={{ ...cell, textAlign: 'right', fontWeight: '700' }}>{fmt(row.total)}</td>
              </tr>
            ))}
            <tr style={{ borderTop: '2px solid #ccc' }}>
              <td colSpan={3} style={{ ...cell, fontWeight: '700' }}>Total</td>
              <td style={{ ...cell, textAlign: 'right', fontWeight: '700' }}>{fmt(totalIngresos)}</td>
            </tr>
          </tbody>
        </table>

        {/* Pagos Pendientes */}
        {pending.length > 0 && (
          <>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 8px', fontFamily: 'var(--font-raleway)', color: '#b94040' }}>
              Pagos Pendientes
            </h2>
            <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 0' }} />
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px' }}>
              <thead>
                <tr>
                  <th style={th}>Paciente</th>
                  <th style={th}>Concepto</th>
                  <th style={th}>Método</th>
                  <th style={th}>Fecha</th>
                  <th style={{ ...th, textAlign: 'right' }}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0ebe5' }}>
                    <td style={cell}>{p.patient}</td>
                    <td style={{ ...cell, color: p.concept ? '#2d2d2d' : '#aaa' }}>{p.concept || '—'}</td>
                    <td style={cell}>{p.method}</td>
                    <td style={cell}>{fmtDate(p.date)}</td>
                    <td style={{ ...cell, textAlign: 'right', fontWeight: '700' }}>{fmt(Number(p.amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Receipt note */}
        {allHaveReceipt && (
          <p style={{ color: '#2d7a2d', fontSize: '0.875rem', marginBottom: '28px' }}>
            ✓ Todos los pagos de este mes tienen recibo emitido.
          </p>
        )}

        {/* Footer */}
        <blockquote style={{ borderLeft: '3px solid #c47a3a', paddingLeft: '16px', margin: '0', color: '#666', fontSize: '0.85rem', lineHeight: '1.6' }}>
          Este reporte es de referencia interna. Utilícelo para completar manualmente los recibos por honorarios correspondientes.
        </blockquote>

      </div>
    </>
  )
}
