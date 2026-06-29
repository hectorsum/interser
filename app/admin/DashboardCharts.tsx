'use client'

import {
  BarChart, Bar, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface MonthPoint { mes: string; value: number }

export default function DashboardCharts({
  monthlyIncome,
  monthlySessions,
  currentYear,
}: {
  monthlyIncome: MonthPoint[]
  monthlySessions: MonthPoint[]
  currentYear: number
}) {
  return (
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
            <Tooltip
              formatter={(v) => [`S/ ${Number(v).toFixed(2)}`, 'Ingresos']}
              contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', border: '1px solid #e0d9d3' }}
            />
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
            <Tooltip
              formatter={(v) => [Number(v), 'Sesiones']}
              contentStyle={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', border: '1px solid #e0d9d3' }}
            />
            <Area type="monotone" dataKey="value" stroke="#2d3a28" strokeWidth={2.5} fill="url(#sessionGrad)"
              dot={{ r: 4, fill: 'white', stroke: '#2d3a28', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#2d3a28' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
