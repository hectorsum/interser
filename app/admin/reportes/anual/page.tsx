import { createClient } from '@/lib/supabase/server'
import PrintButton from '../PrintButton'

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function fmt(n: number) {
  return n > 0 ? `S/ ${n.toFixed(2)}` : '—'
}

export default async function AnualReportPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>
}) {
  const { year: yearParam } = await searchParams
  const now = new Date()
  const year = parseInt(yearParam || String(now.getFullYear()))

  const startDate = `${year}-01-01`
  const endDate = `${year + 1}-01-01`

  const supabase = await createClient()
  const [{ data: sessions }, { data: allPayments }] = await Promise.all([
    supabase.from('sesiones').select('patient, date').gte('date', startDate).lt('date', endDate),
    supabase.from('pagos').select('patient, amount, status, date').gte('date', startDate).lt('date', endDate),
  ])

  // Build monthly breakdown
  type MonthRow = { sessions: number; ingresos: number; pendiente: number }
  const monthly: MonthRow[] = Array.from({ length: 12 }, () => ({ sessions: 0, ingresos: 0, pendiente: 0 }))

  ;(sessions || []).forEach(s => {
    const m = parseInt(s.date.split('-')[1]) - 1
    monthly[m].sessions += 1
  })

  ;(allPayments || []).forEach(p => {
    const m = parseInt(p.date.split('-')[1]) - 1
    if (p.status === 'PAGADO') monthly[m].ingresos += Number(p.amount)
    else monthly[m].pendiente += Number(p.amount)
  })

  const totalIngresos = monthly.reduce((s, m) => s + m.ingresos, 0)
  const totalPendiente = monthly.reduce((s, m) => s + m.pendiente, 0)
  const totalSessions = monthly.reduce((s, m) => s + m.sessions, 0)
  const uniquePatients = new Set((sessions || []).map(s => s.patient)).size

  const bestMonthIdx = monthly.reduce((best, m, i) => m.ingresos > monthly[best].ingresos ? i : best, 0)
  const hasBestMonth = monthly[bestMonthIdx].ingresos > 0

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
              Reporte Anual de Ingresos — {year}
            </h1>
            <p style={{ color: '#777', fontSize: '0.85rem', margin: '4px 0 0' }}>Centro de Psicología Interser</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-main.svg" alt="Interser" style={{ height: '36px', width: 'auto', marginTop: '4px' }} />
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #2d2d2d', margin: '14px 0 28px' }} />

        {/* Period + Generated */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', fontSize: '0.9rem' }}>
          <span>Período: <strong>Enero — Diciembre {year}</strong></span>
          <span>Generado: <strong>{today}</strong></span>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '36px' }}>
          {([
            { label: 'TOTAL\nINGRESOS AÑO', value: `S/ ${totalIngresos.toFixed(2)}`, color: '#2d3a28' },
            { label: 'SESIONES\nTOTALES', value: String(totalSessions), color: '#2d3a28' },
            { label: 'PACIENTES\nATENDIDOS', value: String(uniquePatients), color: '#2d3a28' },
            { label: 'PENDIENTE\nTOTAL', value: `S/ ${totalPendiente.toFixed(2)}`, color: '#b94040' },
          ] as const).map(({ label, value, color }) => (
            <div key={label} style={{ border: '1px solid #d0c9c2', padding: '14px 16px' }}>
              <p style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.07em', color: '#666', margin: '0 0 10px', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                {label}
              </p>
              <p style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Desglose Mensual */}
        <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 8px', fontFamily: 'var(--font-raleway)' }}>
          Desglose Mensual
        </h2>
        <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 0' }} />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
          <thead>
            <tr>
              <th style={th}>Mes</th>
              <th style={th}>Sesiones</th>
              <th style={th}>Ingresos</th>
              <th style={th}>Pendiente</th>
              <th style={th}>Comparativa</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((row, i) => {
              const empty = row.sessions === 0 && row.ingresos === 0 && row.pendiente === 0
              return (
                <tr key={i} style={{ borderBottom: '1px solid #f0ebe5' }}>
                  <td style={{ ...cell, fontWeight: '700' }}>{MONTH_NAMES[i]}</td>
                  <td style={{ ...cell, color: empty ? '#aaa' : '#2d2d2d' }}>{empty ? '—' : row.sessions}</td>
                  <td style={{ ...cell, fontWeight: '700', color: empty ? '#aaa' : '#2d3a28' }}>
                    {empty ? '—' : `S/ ${row.ingresos.toFixed(2)}`}
                  </td>
                  <td style={{ ...cell, color: row.pendiente > 0 ? '#b94040' : '#aaa' }}>
                    {row.pendiente > 0 ? `S/ ${row.pendiente.toFixed(2)}` : '—'}
                  </td>
                  <td style={{ ...cell, color: '#aaa' }}>—</td>
                </tr>
              )
            })}
            <tr style={{ borderTop: '2px solid #ccc' }}>
              <td style={{ ...cell, fontWeight: '700' }}>Total {year}</td>
              <td style={{ ...cell, fontWeight: '700' }}>{totalSessions}</td>
              <td style={{ ...cell, fontWeight: '700' }}>S/ {totalIngresos.toFixed(2)}</td>
              <td style={{ ...cell, fontWeight: '700' }}>S/ {totalPendiente.toFixed(2)}</td>
              <td style={cell}></td>
            </tr>
          </tbody>
        </table>

        {/* Best month */}
        {hasBestMonth && (
          <blockquote style={{ borderLeft: '3px solid #c47a3a', paddingLeft: '16px', margin: '0', color: '#555', fontSize: '0.875rem', lineHeight: '1.6' }}>
            📈 <strong>Mejor mes del año:</strong> {MONTH_NAMES[bestMonthIdx]} con{' '}
            <strong>S/ {monthly[bestMonthIdx].ingresos.toFixed(2)}</strong> en ingresos y{' '}
            {monthly[bestMonthIdx].sessions} sesiones.
          </blockquote>
        )}

      </div>
    </>
  )
}
