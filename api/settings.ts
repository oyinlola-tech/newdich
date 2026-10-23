import { ensureMigrated, query } from '@/lib/db'

export async function GET(request: Request): Promise<Response> {
  await ensureMigrated()

  const rows = await query<{ key: string; value: string }>(
    `SELECT key, value FROM settings`
  )

  const settings: Record<string, string> = {}
  for (const row of rows) {
    settings[row.key] = row.value
  }

  return json(200, settings)
}

export async function POST(request: Request): Promise<Response> {
  await ensureMigrated()

  let body: { key?: string; value?: string }
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON body.' })
  }

  const { key, value } = body
  if (!key || value === undefined) {
    return json(400, { error: 'key and value are required.' })
  }

  await query(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = CURRENT_TIMESTAMP`,
    [key, String(value)]
  )

  return json(200, { ok: true, key, value })
}

function json(status: number, body: object, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}
