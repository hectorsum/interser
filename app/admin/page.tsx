'use client'

import Link from 'next/link'
import {
  BarChart, Bar, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const monthlyIncome = [
  { mes: 'Ene', value: 440 },
  { mes: 'Feb', value: 335 },
  { mes: 'Mar', value: 455 },
  { mes: 'Abr', value: 240 },
  { mes: 'May', value: 460 },
  { mes: 'Jun', value: 120 },
  { mes: 'Jul', value: 0 },
  { mes: 'Ago', value: 0 },
  { mes: 'Sep', value: 0 },
  { mes: 'Oct', value: 0 },
  { mes: 'Nov', value: 0 },
  { mes: 'Dic', value: 0 },
]

const monthlySessions = [
  { mes: 'Ene', value: 4 },
  { mes: 'Feb', value: 3 },
  { mes: 'Mar', value: 4 },
  { mes: 'Abr', value: 3 },
  { mes: 'May', value: 3 },
  { mes: 'Jun', value: 4 },
  { mes: 'Jul', value: 0 },
  { mes: 'Ago', value: 0 },
  { mes: 'Sep', value: 0 },
  { mes: 'Oct', value: 0 },
  { mes: 'Nov', value: 0 },
  { mes: 'Dic', value: 0 },
]

const kpis = [
  {
    label: 'INGRESOS DEL MES',
    value: 'S/ 120.00',
    sub: 'Jun 2026',
    color: '#c47a3a',
    valueColor: '#c47a3a',
  },
  {
    label: 'INGRESOS DEL AÑO',
    value: 'S/ 2,060.00',
    sub: 'Total 2026',
    color: '#1a1a18',
    valueColor: '#1a1a18',
  },
  {
    label: 'PACIENTES ACTIVOS',
    value: '7',
    sub: 'de 10 registrados',
    color: '#2d3a28',
    valueColor: '#2d3a28',
  },
  {
    label: 'PAGOS SIN RECIBO',
    value: '2',
    sub: 'Requieren atención',
    color: '#c0392b',
    valueColor: '#c0392b',
  },
]

export default function AdminDashboard() {
  const date = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const year = new Date().getUTCFullYear()

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex justify-between flex-col md:flex-row items-start md:items-center mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>
          Dashboard
        </h1>
        <span className="text-[0.82rem] capitalize" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
          {date}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-5 mb-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white px-5 pt-5 pb-6 shadow-sm"
            style={{ borderTop: `3px solid ${kpi.color}`, border: `1px solid #e0d9d3`, borderTopWidth: '3px', borderTopColor: kpi.color }}
          >
            <p
              className="text-[0.68rem] font-bold uppercase tracking-widest mb-3"
              style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}
            >
              {kpi.label}
            </p>
            <p
              className="text-[2rem] font-bold leading-none mb-2"
              style={{ color: kpi.valueColor, fontFamily: 'var(--font-raleway)' }}
            >
              {kpi.value}
            </p>
            <p className="text-[0.78rem]" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      <div
        className="flex items-center gap-3 px-5 py-3 mb-8 bg-white shadow-sm"
        style={{ borderLeft: '3px solid #c47a3a' }}
      >
        <svg width="16" height="16" fill="none" stroke="#c47a3a" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-[0.85rem]" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>
          <strong>2 pagos</strong> sin recibo emitido.{' '}
          <Link href="/admin/pagos" className="font-semibold" style={{ color: '#c47a3a' }}>
            Revisar pagos →
          </Link>
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
        {/* Bar chart — monthly income */}
        <div className="bg-white p-6 shadow-sm" style={{ border: '1px solid #e0d9d3' }}>
          <p
            className="text-[0.75rem] font-bold uppercase tracking-widest mb-6"
            style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}
          >
            Ingresos Mensuales · {year}
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyIncome} barSize={32} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="#e8e4df" strokeDasharray="" />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 11, fill: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `S/${v}`}
                tick={{ fontSize: 11, fill: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}
                axisLine={false}
                tickLine={false}
                width={56}
                domain={[0, 500]}
                ticks={[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]}
              />
              <Tooltip
                formatter={(v) => [`S/ ${Number(v).toFixed(2)}`, 'Ingresos']}
                contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', border: '1px solid #e0d9d3' }}
              />
              <Bar
                dataKey="value"
                fill="rgba(196,122,58,0.68)"
                stroke="rgba(180,100,38,0.55)"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area chart — sessions */}
        <div className="bg-white p-6 shadow-sm" style={{ border: '1px solid #e0d9d3' }}>
          <p
            className="text-[0.75rem] font-bold uppercase tracking-widest mb-6"
            style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}
          >
            Sesiones por Mes · {year}
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
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 10, fill: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
              />
              <Tooltip
                formatter={(v) => [Number(v), 'Sesiones']}
                contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', border: '1px solid #e0d9d3' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2d3a28"
                strokeWidth={2.5}
                fill="url(#sessionGrad)"
                dot={{ r: 4, fill: 'white', stroke: '#2d3a28', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#2d3a28' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
