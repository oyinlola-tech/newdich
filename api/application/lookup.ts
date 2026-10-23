import { ensureMigrated, query } from '@/lib/db'

export async function GET(request: Request): Promise<Response> {
  await ensureMigrated()

  const { searchParams } = new URL(request.url)
  const ref = searchParams.get('ref') ?? ''

  if (!ref) {
    return json(400, { error: 'ref is required.' })
  }

  const rows = await query<{
    id: number
    tracking_number: string
    application_type: string
    status: string
    payment_status: string
    course_name: string
    course_price: number | null
    email: string
    created_at: string
  }[]>(
    `SELECT tracking_number, application_type, status, payment_status, course_name, course_price, email, created_at FROM applications WHERE tracking_number = ?`,
    [ref]
  )

  if (!rows[0]) {
    return json(404, { error: 'Application not found.' })
  }

  return json(200, rows[0])
}

function json(status: number, body: object, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}
