import { hash } from 'bcryptjs'
import { ensureMigrated, query } from '@/lib/db'

export async function POST(request: Request): Promise<Response> {
  await ensureMigrated()

  let body: { token?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON body.' })
  }

  const { token, password } = body
  if (!token || !password) {
    return json(400, { error: 'token and password are required.' })
  }
  if (password.length < 8) {
    return json(400, { error: 'Password must be at least 8 characters.' })
  }

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const rows = await query<{ id: number; reset_token_expires: string }>(
    `SELECT id, reset_token_expires FROM users WHERE reset_token = ? AND reset_token_expires > ?`,
    [token, now]
  )
  const user = rows[0]
  if (!user) {
    return json(401, { error: 'Invalid or expired setup link.' })
  }

  const passwordHash = await hash(password, 12)
  await query(
    `UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
    [passwordHash, user.id]
  )

  return json(200, { ok: true, message: 'Password set. You can now log in.' })
}

function json(status: number, body: object, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}
