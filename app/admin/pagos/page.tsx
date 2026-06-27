'use client'

import { useState } from 'react'

const mockPayments = [
  { id: 1, patient: 'María Pérez', concept: 'TCC - Sesión', date: '2025-06-27', method: 'Transferencia', amount: 85, status: 'Pagado' },
  { id: 2, patient: 'Carlos Ruiz', concept: 'DBT - Paquete 4 sesiones', date: '2025-06-25', method: 'Yape', amount: 280, status: 'Pagado' },
  { id: 3, patient: 'Ana López', concept: 'Evaluación integral', date: '2025-06-28', method: 'Efectivo', amount: 400, status: 'Pendiente' },
  { id: 4, patient: 'Juan García', concept: 'DBT - Sesión', date: '2025-06-28', method: 'Transferencia', amount: 85, status: 'Pendiente' },
  { id: 5, patient: 'Sofia M.', concept: 'TCC - Sesión', date: '2025-06-20', method: 'Yape', amount: 85, status: 'Vencido' },
]

const statusColors: Record<string, { bg: string; text: string }> = {
  Pagado: { bg: '#d4edda', text: '#155724' },
  Pendiente: { bg: '#fff3cd', text: '#856404' },
  Vencido: { bg: '#f8d7da', text: '#721c24' },
}

export default function PagosPage() {
  const totalIngresos = mockPayments.filter((p) => p.status === 'Pagado').reduce((a, p) => a + p.amount, 0)
  const totalPendiente = mockPayments.filter((p) => p.status !== 'Pagado').reduce((a, p) => a + p.amount, 0)

  return (
    <div className="px-10 py-8">
      <div className="flex justify-between items-center mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>
          Gestión de Pagos
        </h1>
        <button className="px-6 py-2.5 text-white text-sm font-bold uppercase tracking-wider"
          style={{ background: '#c47a3a', fontFamily: 'var(--font-montserrat)', border: 'none', cursor: 'pointer' }}>
          + Registrar pago
        </button>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Ingresos cobrados', value: `S/ ${totalIngresos}`, color: '#2d3a28' },
          { label: 'Pendiente de cobro', value: `S/ ${totalPendiente}`, color: '#c47a3a' },
          { label: 'Total transacciones', value: mockPayments.length.toString(), color: '#2d3a28' },
        ].map((k) => (
          <div key={k.label} className="p-6 bg-white shadow-sm">
            <p className="text-[0.71rem] font-bold uppercase tracking-widest mb-3" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>{k.label}</p>
            <p className="text-[1.85rem] font-bold leading-none" style={{ color: k.color, fontFamily: 'var(--font-raleway)' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: '#f5f3f0' }}>
              {['Paciente', 'Concepto', 'Fecha', 'Método', 'Monto', 'Estado', 'Acción'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[0.75rem] font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: '#2d3a28', borderBottom: '2px solid #e0d9d3', fontFamily: 'var(--font-montserrat)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockPayments.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f0ede9' }} className="hover:bg-[#fafaf8] transition-colors">
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>{p.patient}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{p.concept}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{p.date}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{p.method}</td>
                <td className="px-4 py-3 text-sm font-bold" style={{ color: '#2d3a28', fontFamily: 'var(--font-montserrat)' }}>S/ {p.amount}</td>
                <td className="px-4 py-3">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1"
                    style={{ background: statusColors[p.status].bg, color: statusColors[p.status].text, fontFamily: 'var(--font-montserrat)' }}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.status !== 'Pagado' && (
                    <button className="text-xs font-bold px-3 py-1.5 text-white"
                      style={{ background: '#2d3a28', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}>
                      Marcar pagado
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
