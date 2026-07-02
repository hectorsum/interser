import { createCachedClient } from './supabase/cached'

const TTL = 5 * 60 * 1000 // 5 minutos
const cache: Record<string, { data: unknown; ts: number }> = {}

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache[key]
  if (hit && Date.now() - hit.ts < TTL) return hit.data as T
  const data = await fn()
  cache[key] = { data, ts: Date.now() }
  return data
}

export function invalidate(...keys: string[]) {
  keys.forEach((k) => delete cache[k])
}

export function getCached<T>(key: string): T | null {
  const hit = cache[key]
  if (hit && Date.now() - hit.ts < TTL) return hit.data as T
  return null
}

export function getPacienteNames(): string[] | null {
  const pacientes = getCached<{ name: string }[]>('pacientes')
  return pacientes ? pacientes.map((p) => p.name) : null
}

export function getPacientes() {
  return cached('pacientes', async () => {
    const sb = createCachedClient()
    const { data } = await sb.from('pacientes').select('*').order('name')
    return data ?? []
  })
}

export function getSesiones() {
  return cached('sesiones', async () => {
    const sb = createCachedClient()
    const { data } = await sb.from('sesiones').select('*').order('date', { ascending: false })
    return data ?? []
  })
}

export function getPagos() {
  return cached('pagos', async () => {
    const sb = createCachedClient()
    const { data } = await sb.from('pagos').select('*').order('date', { ascending: false })
    return data ?? []
  })
}

export function getDashboardData(year: number, month: number, client?: ReturnType<typeof createCachedClient>) {
  return cached(`dashboard-${year}-${month}`, async () => {
    const sb = client ?? createCachedClient()
    const mm         = String(month).padStart(2, '0')
    const yearStart  = `${year}-01-01`
    const yearEnd    = `${year}-12-31`
    const monthStart = `${year}-${mm}-01`
    const monthEnd   = `${year}-${mm}-31`

    const [pacRes, recRes, pagosRes, sesRes] = await Promise.all([
      sb.from('pacientes').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVO'),
      sb.from('pagos').select('id', { count: 'exact', head: true }).eq('receipt', false),
      sb.from('pagos').select('date, amount').eq('status', 'PAGADO').gte('date', yearStart).lte('date', yearEnd),
      sb.from('sesiones').select('date').gte('date', yearStart).lte('date', yearEnd),
    ])

    const pagos = (pagosRes.data ?? []) as { date: string; amount: number }[]
    const incomeByMonth = Array(12).fill(0)
    let monthIncome = 0
    let yearIncome  = 0
    pagos.forEach((p) => {
      const m = parseInt(p.date.slice(5, 7)) - 1
      incomeByMonth[m] += Number(p.amount)
      yearIncome       += Number(p.amount)
      if (p.date >= monthStart && p.date <= monthEnd) monthIncome += Number(p.amount)
    })

    const sesiones = (sesRes.data ?? []) as { date: string }[]
    const countByMonth = Array(12).fill(0)
    sesiones.forEach((s) => {
      countByMonth[parseInt(s.date.slice(5, 7)) - 1] += 1
    })

    return {
      activePatients: pacRes.count ?? 0,
      noReceipt:      recRes.count ?? 0,
      monthIncome,
      yearIncome,
      incomeByMonth,
      countByMonth,
    }
  })
}
