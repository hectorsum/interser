import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createCachedClient } from '@/lib/supabase/cached'
import { MonthlyReportEmail } from '@/emails/MonthlyReport'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export async function GET(request: Request) {
  // Only allow Vercel Cron or requests with the correct secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Report is for the PREVIOUS month
    const now = new Date()
    const reportDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const year = reportDate.getFullYear()
    const month = reportDate.getMonth() + 1
    const mm = String(month).padStart(2, '0')
    const startDate = `${year}-${mm}-01`
    const endDate = `${year}-${mm}-31`

    const sb = createCachedClient()

    const [pagosRes, sesRes, noReceiptRes] = await Promise.all([
      sb.from('pagos').select('patient, amount, status').gte('date', startDate).lte('date', endDate),
      sb.from('sesiones').select('patient').gte('date', startDate).lte('date', endDate),
      sb.from('pagos').select('id', { count: 'exact', head: true }).eq('receipt', false),
    ])

    const pagos = pagosRes.data ?? []
    const paid = pagos.filter(p => p.status === 'PAGADO')
    const pending = pagos.filter(p => p.status === 'PENDIENTE')

    const totalIngresos = paid.reduce((s, p) => s + Number(p.amount), 0)
    const totalPendiente = pending.reduce((s, p) => s + Number(p.amount), 0)
    const sessionCount = (sesRes.data ?? []).length
    const patientCount = new Set((sesRes.data ?? []).map(s => s.patient)).size
    const noReceiptCount = noReceiptRes.count ?? 0

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.ADMIN_EMAIL!,
      subject: `Reporte Mensual — ${MONTH_NAMES[month - 1]} ${year}`,
      react: MonthlyReportEmail({
        month,
        year,
        totalIngresos,
        totalPendiente,
        sessionCount,
        patientCount,
        noReceiptCount,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      }),
    })

    return NextResponse.json({ ok: true, period: `${MONTH_NAMES[month - 1]} ${year}` })
  } catch (error) {
    console.error('[cron/monthly-report]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
