export default function ReportesPage() {
  const reports = [
    { title: 'Resumen mensual de sesiones', desc: 'Total de sesiones por terapeuta, tipo y estado en el mes actual.', icon: '📊' },
    { title: 'Estado de pagos', desc: 'Ingresos cobrados, pendientes y vencidos del periodo seleccionado.', icon: '💳' },
    { title: 'Lista de pacientes activos', desc: 'Registro completo de pacientes con sesiones activas.', icon: '👥' },
    { title: 'Historial de sesiones', desc: 'Todas las sesiones en un rango de fechas exportable a CSV.', icon: '📅' },
  ]

  return (
    <div className="px-10 py-8">
      <div className="flex justify-between items-center mb-8 pb-5" style={{ borderBottom: '1px solid #e0d9d3' }}>
        <h1 className="text-[1.75rem] font-semibold" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>
          Reportes Descargables
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {reports.map((r) => (
          <div key={r.title} className="bg-white p-8 shadow-sm flex items-start gap-5">
            <span className="text-4xl flex-shrink-0">{r.icon}</span>
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-2" style={{ fontFamily: 'var(--font-raleway)', color: '#2d3a28' }}>
                {r.title}
              </h3>
              <p className="text-sm mb-5" style={{ color: '#9a8a7a', fontFamily: 'var(--font-montserrat)' }}>
                {r.desc}
              </p>
              <button
                className="text-sm font-bold px-5 py-2.5 text-white uppercase tracking-wider"
                style={{ background: '#c47a3a', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}
              >
                Descargar CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
