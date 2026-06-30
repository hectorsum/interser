const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export interface MonthlyReportData {
  month: number
  year: number
  totalIngresos: number
  totalPendiente: number
  sessionCount: number
  patientCount: number
  noReceiptCount: number
  dashboardUrl: string
}

export function MonthlyReportEmail({
  month, year, totalIngresos, totalPendiente,
  sessionCount, patientCount, noReceiptCount, dashboardUrl,
}: MonthlyReportData) {
  const monthName = MONTH_NAMES[month - 1]
  const baseUrl = dashboardUrl.replace('/admin', '')

  const kpis = [
    { label: 'TOTAL INGRESOS', value: `S/ ${totalIngresos.toFixed(2)}`, color: '#2d3a28' },
    { label: 'SESIONES', value: String(sessionCount), color: '#2d3a28' },
    { label: 'PACIENTES', value: String(patientCount), color: '#2d3a28' },
    { label: 'PENDIENTE', value: `S/ ${totalPendiente.toFixed(2)}`, color: '#c0392b' },
  ]

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Reporte Mensual — {monthName} {year}</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f3f0', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#f5f3f0', padding: '32px 16px' }}>
          <tbody>
            <tr>
              <td align="center">
                <table width="580" cellPadding={0} cellSpacing={0} style={{ maxWidth: '580px', width: '100%' }}>
                  <tbody>

                    {/* Header */}
                    <tr>
                      <td style={{ backgroundColor: '#2d3a28', padding: '28px 36px' }}>
                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  src={`${baseUrl}/assets/logo-admin.png`}
                                  alt="Interser"
                                  width={130}
                                  style={{ display: 'block', height: 'auto' }}
                                />
                              </td>
                              <td align="right">
                                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                  Reporte Mensual
                                </p>
                                <p style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: '600', color: '#c47a3a' }}>
                                  {monthName} {year}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Body */}
                    <tr>
                      <td style={{ backgroundColor: '#ffffff', padding: '32px 36px' }}>

                        <p style={{ margin: '0 0 24px', fontSize: '15px', color: '#5d5d5d', lineHeight: '1.6' }}>
                          Aquí está el resumen de ingresos de <strong style={{ color: '#2d2d2d' }}>{monthName} {year}</strong>.
                        </p>

                        {/* KPI grid */}
                        <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '28px' }}>
                          <tbody>
                            <tr>
                              {kpis.map((kpi, i) => (
                                <td key={i} width="25%" style={{ padding: i < kpis.length - 1 ? '0 8px 0 0' : '0' }}>
                                  <table width="100%" cellPadding={0} cellSpacing={0}>
                                    <tbody>
                                      <tr>
                                        <td style={{ border: '1px solid #e0d9d3', borderTop: `3px solid ${kpi.color}`, padding: '14px 12px' }}>
                                          <p style={{ margin: '0 0 8px', fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em', color: '#9a8a7a', textTransform: 'uppercase' as const }}>
                                            {kpi.label}
                                          </p>
                                          <p style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: kpi.color }}>
                                            {kpi.value}
                                          </p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>

                        {/* No receipt alert */}
                        {noReceiptCount > 0 && (
                          <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '28px' }}>
                            <tbody>
                              <tr>
                                <td style={{ backgroundColor: '#fdf6f0', borderLeft: '3px solid #c47a3a', padding: '14px 16px' }}>
                                  <p style={{ margin: 0, fontSize: '13px', color: '#5d5d5d', lineHeight: '1.5' }}>
                                    ⚠️ <strong style={{ color: '#2d2d2d' }}>{noReceiptCount} {noReceiptCount === 1 ? 'pago' : 'pagos'} sin recibo por honorarios</strong> emitido.
                                    Revisa los pagos pendientes en el dashboard.
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}

                        {/* CTA */}
                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody>
                            <tr>
                              <td align="center" style={{ paddingTop: '8px' }}>
                                <a href={dashboardUrl}
                                  style={{ display: 'inline-block', backgroundColor: '#2d3a28', color: '#ffffff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.06em', textDecoration: 'none', padding: '13px 32px', textTransform: 'uppercase' as const }}>
                                  Ver Dashboard →
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ padding: '20px 36px', textAlign: 'center' as const }}>
                        <p style={{ margin: 0, fontSize: '11px', color: '#9a8a7a', lineHeight: '1.6' }}>
                          Este correo fue generado automáticamente el día 1 de cada mes.<br />
                          Centro de Psicología Interser
                        </p>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}
