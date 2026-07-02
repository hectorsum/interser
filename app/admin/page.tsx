import Link from 'next/link'
import { getDashboardData } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import DashboardCharts from './DashboardCharts'

const MONTH_NAMES_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default async function AdminDashboard() {
  const now = new Date()
  const currentYear = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth() + 1

  const date = now.toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const supabase = await createClient()
  const { activePatients, noReceipt, monthIncome, yearIncome, incomeByMonth, countByMonth } =
    await getDashboardData(currentYear, currentMonth, supabase)

  const monthlyIncome = MONTH_NAMES_SHORT.map((mes, i) => ({ mes, value: incomeByMonth[i] }))
  const monthlySessions = MONTH_NAMES_SHORT.map((mes, i) => ({ mes, value: countByMonth[i] }))

  const kpis = [
    { label: 'INGRESOS DEL MES', value: `S/ ${monthIncome.toFixed(2)}`, sub: `${MONTH_NAMES_SHORT[currentMonth - 1]} ${currentYear}`, color: '#c47a3a' },
    { label: 'INGRESOS DEL AÑO', value: `S/ ${yearIncome.toFixed(2)}`, sub: `Total ${currentYear}`, color: '#1a1a18' },
    { label: 'PACIENTES ACTIVOS', value: String(activePatients), sub: 'en estado activo', color: '#2d3a28' },
    { label: 'PAGOS SIN RECIBO', value: String(noReceipt), sub: 'Requieren atención', color: '#c0392b' },
  ]

  return (
    <div className="px-8 py-8 pt-20 md:pt-8">
      {/* Header */}
      <div className="flex justify-between flex-col md:flex-row items-start md:items-center mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>Dashboard</h1>
        <span className="text-[0.82rem] capitalize" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{date}</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white px-5 pt-5 pb-6 shadow-sm"
            style={{ border: '1px solid #e0d9d3', borderTopWidth: '3px', borderTopColor: kpi.color }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-widest mb-3" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{kpi.label}</p>
            <p className="text-[2rem] font-bold leading-none mb-2" style={{ color: kpi.color, fontFamily: 'var(--font-raleway)' }}>{kpi.value}</p>
            <p className="text-[0.78rem]" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {noReceipt > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 mb-8 bg-white shadow-sm" style={{ borderLeft: '3px solid #c47a3a' }}>
          <svg width="16" height="16" fill="none" stroke="#c47a3a" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[0.85rem]" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>
            <strong>{noReceipt} {noReceipt === 1 ? 'pago' : 'pagos'}</strong> sin recibo emitido.{' '}
            <Link href="/admin/pagos?receipt=sin" className="font-semibold" style={{ color: '#c47a3a' }}>
              Revisar pagos →
            </Link>
          </p>
        </div>
      )}

      {/* Charts — Client Component */}
      <DashboardCharts
        monthlyIncome={monthlyIncome}
        monthlySessions={monthlySessions}
        currentYear={currentYear}
      />
    </div>
  )
}
