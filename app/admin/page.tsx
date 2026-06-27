export default function AdminDashboard() {
  const date = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const kpis = [
    { label: 'Pacientes activos', value: '24', color: '#2d3a28' },
    { label: 'Sesiones este mes', value: '87', color: '#c47a3a' },
    { label: 'Ingresos del mes', value: 'S/ 4,280', color: '#2d3a28' },
    { label: 'Pagos pendientes', value: '3', color: '#c76767' },
  ]

  const recentSessions = [
    { patient: 'María Pérez', type: 'TCC', date: '27 Jun 2025', status: 'Completada' },
    { patient: 'Carlos Ruiz', type: 'DBT', date: '27 Jun 2025', status: 'Completada' },
    { patient: 'Ana López', type: 'Evaluación', date: '28 Jun 2025', status: 'Programada' },
    { patient: 'Juan García', type: 'DBT', date: '28 Jun 2025', status: 'Programada' },
    { patient: 'Sofia M.', type: 'TCC', date: '29 Jun 2025', status: 'Pendiente' },
  ]

  const statusColors: Record<string, string> = {
    'Completada': '#d4edda',
    'Programada': '#cce5ff',
    'Pendiente': '#fff3cd',
  }
  const statusTextColors: Record<string, string> = {
    'Completada': '#155724',
    'Programada': '#004085',
    'Pendiente': '#856404',
  }

  return (
    <div className="px-10 py-8">
      {/* Page header */}
      <div
        className="flex justify-between items-center mb-8 pb-5"
        style={{ borderBottom: '1px solid #e0d9d3' }}
      >
        <h1
          className="text-[1.75rem] font-semibold"
          style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}
        >
          Dashboard
        </h1>
        <span
          className="text-[0.82rem] capitalize"
          style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}
        >
          {date}
        </span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="p-6 shadow-sm"
            style={{ background: 'white' }}
          >
            <p
              className="text-[0.71rem] font-bold uppercase tracking-widest mb-3"
              style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}
            >
              {kpi.label}
            </p>
            <p
              className="text-[1.85rem] font-bold leading-none"
              style={{ color: kpi.color, fontFamily: 'var(--font-raleway)' }}
            >
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent sessions */}
      <div className="bg-white shadow-sm">
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #f0ede9' }}
        >
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}
          >
            Sesiones recientes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: '#f5f3f0' }}>
                {['Paciente', 'Tipo', 'Fecha', 'Estado'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[0.75rem] font-bold uppercase tracking-wider"
                    style={{ color: '#2d3a28', borderBottom: '2px solid #e0d9d3', fontFamily: 'var(--font-montserrat)', whiteSpace: 'nowrap' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((s, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid #f0ede9' }}
                  className="hover:bg-[#fafaf8] transition-colors"
                >
                  <td className="px-4 py-3 text-sm" style={{ color: '#2d2d2d', fontFamily: 'var(--font-montserrat)' }}>{s.patient}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{s.type}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#5d5d5d', fontFamily: 'var(--font-montserrat)' }}>{s.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1"
                      style={{
                        background: statusColors[s.status],
                        color: statusTextColors[s.status],
                        fontFamily: 'var(--font-montserrat)',
                      }}
                    >
                      {s.status}
                    </span>
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
