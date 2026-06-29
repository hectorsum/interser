'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart, Bar, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { supabase } from '@/lib/supabase'

const MONTH_NAMES_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const emptyMonths = (n: number) =>
  MONTH_NAMES_SHORT.slice(0, n).map((mes) => ({ mes, value: 0 }))

export default function AdminDashboard() {
  const now          = new Date()
  const currentYear  = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth() + 1

  const date = now.toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const [monthIncome,    setMonthIncome]    = useState(0)
  const [yearIncome,     setYearIncome]     = useState(0)
  const [activePatients, setActivePatients] = useState(0)
  const [noReceipt,      setNoReceipt]      = useState(0)
  const [monthlyIncome,  setMonthlyIncome]  = useState(emptyMonths(12))
  const [monthlySessions,setMonthlySessions]= useState(emptyMonths(12))

  useEffect(() => {
    const yearStart = `${currentYear}-01-01`
    const yearEnd   = `${currentYear}-12-31`
    const mm        = String(currentMonth).padStart(2, '0')
    const monthStart = `${currentYear}-${mm}-01`
    const monthEnd   = `${currentYear}-${mm}-31`

    Promise.all([
      // Active patients count
      supabase?.from('pacientes').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVO'),
      // Payments without receipt count
      supabase?.from('pagos').select('id', { count: 'exact', head: true }).eq('receipt', false),
      // All paid pagos of current year (for income calculations + chart)
      supabase?.from('pagos').select('date, amount').eq('status', 'PAGADO').gte('date', yearStart).lte('date', yearEnd),
      // All sesiones of current year (for chart)
      supabase?.from('sesiones').select('date').gte('date', yearStart).lte('date', yearEnd),
    ]).then(([pacRes, recRes, pagosRes, sesRes]) => {
      // KPIs
      setActivePatients(pacRes?.count ?? 0)
      setNoReceipt(recRes?.count ?? 0)

      // Income calculations + monthly chart
      const pagos = (pagosRes?.data ?? []) as { date: string; amount: number }[]
      const incomeByMonth = Array(12).fill(0)
      let month = 0
      let year  = 0
      pagos.forEach((p) => {
        const m = parseInt(p.date.slice(5, 7)) - 1
        incomeByMonth[m] = (incomeByMonth[m] ?? 0) + p.amount
        year += p.amount
        if (p.date >= monthStart && p.date <= monthEnd) month += p.amount
      })
      setYearIncome(year)
      setMonthIncome(month)
      setMonthlyIncome(MONTH_NAMES_SHORT.map((mes, i) => ({ mes, value: incomeByMonth[i] })))

      // Sessions chart
      const sesiones = (sesRes?.data ?? []) as { date: string }[]
      const countByMonth = Array(12).fill(0)
      sesiones.forEach((s) => {
        const m = parseInt(s.date.slice(5, 7)) - 1
        countByMonth[m] = (countByMonth[m] ?? 0) + 1
      })
      setMonthlySessions(MONTH_NAMES_SHORT.map((mes, i) => ({ mes, value: countByMonth[i] })))
    })
  }, [currentYear, currentMonth])

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex justify-between flex-col md:flex-row items-start md:items-center mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>Dashboard</h1>
        <span className="text-[0.82rem] capitalize" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{date}</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { label: 'INGRESOS DEL MES',   value: `S/ ${monthIncome.toFixed(2)}`, sub: `${MONTH_NAMES_SHORT[currentMonth - 1]} ${currentYear}`, color: '#c47a3a', valueColor: '#c47a3a' },
          { label: 'INGRESOS DEL AÑO',   value: `S/ ${yearIncome.toFixed(2)}`,  sub: `Total ${currentYear}`,                                   color: '#1a1a18', valueColor: '#1a1a18' },
          { label: 'PACIENTES ACTIVOS',   value: String(activePatients),         sub: 'en estado activo',                                        color: '#2d3a28', valueColor: '#2d3a28' },
          { label: 'PAGOS SIN RECIBO',    value: String(noReceipt),              sub: 'Requieren atención',                                      color: '#c0392b', valueColor: '#c0392b' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white px-5 pt-5 pb-6 shadow-sm"
            style={{ border: '1px solid #e0d9d3', borderTopWidth: '3px', borderTopColor: kpi.color }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-widest mb-3" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{kpi.label}</p>
            <p className="text-[2rem] font-bold leading-none mb-2" style={{ color: kpi.valueColor, fontFamily: 'var(--font-raleway)' }}>{kpi.value}</p>
            <p className="text-[0.78rem]" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Alert banner — only shown when there are payments without receipt */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
        <div className="bg-white p-6 shadow-sm" style={{ border: '1px solid #e0d9d3' }}>
          <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-6" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>
            Ingresos Mensuales · {currentYear}
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyIncome} barSize={32} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="#e8e4df" strokeDasharray="" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `S/${v}`} tick={{ fontSize: 11, fill: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }} axisLine={false} tickLine={false} width={56} />
              <Tooltip formatter={(v) => [`S/ ${Number(v).toFixed(2)}`, 'Ingresos']}
                contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', border: '1px solid #e0d9d3' }} />
              <Bar dataKey="value" fill="rgba(196,122,58,0.68)" stroke="rgba(180,100,38,0.55)" strokeWidth={1} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 shadow-sm" style={{ border: '1px solid #e0d9d3' }}>
          <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-6" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>
            Sesiones por Mes · {currentYear}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlySessions} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d0ccc8" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#d0ccc8" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e8e4df" strokeDasharray="" />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip formatter={(v) => [Number(v), 'Sesiones']}
                contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', border: '1px solid #e0d9d3' }} />
              <Area type="monotone" dataKey="value" stroke="#2d3a28" strokeWidth={2.5} fill="url(#sessionGrad)"
                dot={{ r: 4, fill: 'white', stroke: '#2d3a28', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#2d3a28' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
