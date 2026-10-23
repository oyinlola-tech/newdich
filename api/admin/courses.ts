import { ensureMigrated, query, validateSession } from '@/lib/db'

const SUPERADMIN_EMAILS = new Set((process.env.SUPERADMIN_EMAILS ?? 'superadmin@newdich.tech').split(',').map(s => s.trim()).filter(Boolean))

async function isSuperadmin(token: string): Promise<boolean> {
  const user = await validateSession(token)
  if (!user) return false
  return SUPERADMIN_EMAILS.has(user.email)
}

export async function GET(request: Request): Promise<Response> {
  await ensureMigrated()
  const rows = await query<{ id: number; name: string; description: string | null; price: number | null; currency: string; duration: string | null; is_active: number }[]>(
    `SELECT id, name, description, price, currency, duration, is_active FROM courses ORDER BY name`
  )
  return json(200, { courses: rows })
}

export async function POST(request: Request): Promise<Response> {
  await ensureMigrated()
  const token = request.headers.get('authorization')?.replace(/^Bearer\s/i, '') ?? ''
  if (!(await isSuperadmin(token))) {
    return json(401, { error: 'Superadmin only.' })
  }

  let body: { name?: string; description?: string; price?: number; currency?: string; duration?: string; is_active?: boolean }
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON body.' })
  }

  const { name, description, price, currency = 'NGN', duration, is_active = true } = body
  if (!name) {
    return json(400, { error: 'name is required.' })
  }

  const [result] = await query(
    `INSERT INTO courses (name, description, price, currency, duration, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description ?? null, price ?? null, currency, duration ?? null, is_active ? 1 : 0]
  )
  const id = (result as any).insertId ?? (result as any).affectedRows ?? 0

  return json(200, { ok: true, id })
}

export async function PUT(request: Request): Promise<Response> {
  await ensureMigrated()
  const token = request.headers.get('authorization')?.replace(/^Bearer\s/i, '') ?? ''
  if (!(await isSuperadmin(token))) {
    return json(401, { error: 'Superadmin only.' })
  }

  let body: { id?: number; name?: string; description?: string; price?: number; currency?: string; duration?: string; is_active?: boolean }
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON body.' })
  }

  const { id, ...updates } = body
  if (!id) {
    return json(400, { error: 'id is required.' })
  }

  const fields = Object.entries(updates)
    .filter(([k]) => k !== 'id')
    .map(([k]) => `${k} = ?`)
    .join(', ')
  if (!fields) {
    return json(400, { error: 'No fields to update.' })
  }

  const values = Object.values(updates)
  values.push(id)

  await query(`UPDATE courses SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values)

  return json(200, { ok: true })
}

export async function DELETE(request: Request): Promise<Response> {
  await ensureMigrated()
  const token = request.headers.get('authorization')?.replace(/^Bearer\s/i, '') ?? ''
  if (!(await isSuperadmin(token))) {
    return json(401, { error: 'Superadmin only.' })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return json(400, { error: 'id is required.' })
  }

  await query(`DELETE FROM courses WHERE id = ?`, [id])
  return json(200, { ok: true })
}

function json(status: number, body: object, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}
