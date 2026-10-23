import { compare } from 'bcryptjs'
import { ensureMigrated, query, createSession } from '@/lib/db'

export async function POST(request: Request): Promise<Response> {
  await ensureMigrated()

  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON body.' })
  }

  const { email, password } = body
  if (!email || !password) {
    return json(400, { error: 'email and password are required.' })
  }

  const rows = await query<{ id: number; email: string; password_hash: string; role: string; is_active: number }>(
    `SELECT id, email, password_hash, role, is_active FROM users WHERE email = ?`,
    [email]
  )
  const user = rows[0]
  if (!user || !user.password_hash) {
    return json(401, { error: 'Invalid credentials.' })
  }
  if (!user.is_active) {
    return json(401, { error: 'Account is inactive.' })
  }

  const ok = await compare(password, user.password_hash)
  if (!ok) {
    return json(401, { error: 'Invalid credentials.' })
  }

  const token = await createSession(user.id, 7 * 24 * 60 * 60 * 1000)

  return json(200, {
    ok: true,
    token,
    user: { id: user.id, email: user.email, role: user.role },
  })
}

function json(status: number, body: object, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}
