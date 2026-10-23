import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'
import { ensureMigrated, query, validateSession, destroySession } from '@/lib/db'

const SUPERADMIN_EMAILS = new Set((process.env.SUPERADMIN_EMAILS ?? 'superadmin@newdich.tech').split(',').map(s => s.trim()).filter(Boolean))

async function isSuperadmin(token: string): Promise<boolean> {
  const user = await validateSession(token)
  if (!user) return false
  return SUPERADMIN_EMAILS.has(user.email)
}

export async function GET(request: Request): Promise<Response> {
  await ensureMigrated()
  const token = request.headers.get('authorization')?.replace(/^Bearer\s/i, '') ?? ''
  if (!(await isSuperadmin(token))) {
    return json(401, { error: 'Superadmin only.' })
  }
  const rows = await query<{ id: number; email: string; role: string; is_active: number; created_at: string }>(
    `SELECT id, email, role, is_active, created_at FROM users WHERE role = 'admin' ORDER BY created_at DESC`
  )
  return json(200, { admins: rows })
}

export async function POST(request: Request): Promise<Response> {
  await ensureMigrated()
  const token = request.headers.get('authorization')?.replace(/^Bearer\s/i, '') ?? ''
  if (!(await isSuperadmin(token))) {
    return json(401, { error: 'Superadmin only.' })
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON body.' })
  }

  const { email } = body
  if (!email) {
    return json(400, { error: 'email is required.' })
  }

  const existing = await query<{ id: number }>('SELECT id FROM users WHERE email = ?', [email])
  if (existing[0]) {
    return json(409, { error: 'An account with this email already exists.' })
  }

  const resetToken = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')

  await query(
    `INSERT INTO users (email, password_hash, role, is_active, reset_token, reset_token_expires) VALUES (?, '', 'admin', 1, ?, ?)`,
    [email, resetToken, expiresAt]
  )

  const setupLink = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/setup-password?token=${resetToken}`

  return json(200, {
    ok: true,
    email,
    setupLink,
    message: 'Admin invited. Share the setupLink so they can create their password (expires in 24h).',
  })
}

function json(status: number, body: object, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}
