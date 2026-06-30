const LIMITS: Record<string, number> = {
  name: 120,
  email: 254,
  phone: 20,
  dni: 20,
  notes: 2000,
  concept: 200,
  default: 500,
}

function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&lt;|&gt;|&amp;|&#x27;|&quot;/gi, (m) => ({
    '&lt;': '<', '&gt;': '>', '&amp;': '&', '&#x27;': "'", '&quot;': '"',
  })[m] ?? m)
}

export function sanitizeText(value: string, field = 'default'): string {
  const limit = LIMITS[field] ?? LIMITS.default
  return stripTags(value.trim()).slice(0, limit)
}

export function sanitizeForm<T extends Record<string, unknown>>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      typeof v === 'string' ? sanitizeText(v, k) : v,
    ])
  ) as T
}
