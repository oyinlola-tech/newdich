import { ensureMigrated, query, validateSession } from '@/lib/db'
import { Resend } from 'resend'

const SUPERADMIN_EMAILS = new Set((process.env.SUPERADMIN_EMAILS ?? 'superadmin@newdich.tech').split(',').map(s => s.trim()).filter(Boolean))
const resend = new Resend(process.env.RESEND_API_KEY)

async function isAdmin(token: string): Promise<boolean> {
  const user = await validateSession(token)
  if (!user) return false
  return SUPERADMIN_EMAILS.has(user.email) || user.role === 'admin'
}

export async function POST(request: Request): Promise<Response> {
  await ensureMigrated()

  const token = request.headers.get('authorization')?.replace(/^Bearer\s/i, '') ?? ''
  if (!(await isAdmin(token))) {
    return json(401, { error: 'Admin only.' })
  }

  let body: { tracking_number?: string; status?: 'approved' | 'rejected' | 'enrolled'; admin_note?: string }
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON body.' })
  }

  const { tracking_number, status, admin_note } = body
  if (!tracking_number || !status) {
    return json(400, { error: 'tracking_number and status are required.' })
  }

  const rows = await query<{ id: number; email: string; application_type: string; course_name: string; status: string }>(
    `SELECT id, email, application_type, course_name, status FROM applications WHERE tracking_number = ?`,
    [tracking_number]
  )
  const app = rows[0]
  if (!app) {
    return json(404, { error: 'Application not found.' })
  }

  await query(
    `UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE tracking_number = ?`,
    [status, tracking_number]
  )

  // Send email to student
  try {
    const statusLabels: Record<string, string> = {
      approved: 'Approved',
      rejected: 'Rejected',
      enrolled: 'Enrolled',
    }
    await resend.emails.send({
      from: process.env.CONTACT_FROM ?? 'Newdich Institute <onboarding@resend.dev>',
      to: [app.email],
      subject: `Your Newdich application (${tracking_number}) — ${statusLabels[status]}`,
      html: `
        <h2>Application Update — Newdich Technology Institute</h2>
        <p>Dear applicant,</p>
        <p>Your application <strong>${tracking_number}</strong> for <strong>${app.course_name}</strong> (${app.application_type}) has been <strong>${statusLabels[status]}</strong>.</p>
        ${admin_note ? `<p><strong>Admin note:</strong> ${admin_note}</p>` : ''}
        <p>You can track your application anytime at <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/track?ref=${tracking_number}">${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/track?ref=${tracking_number}</a></p>
        <p>— Newdich Technology Institute</p>
      `,
    })
  } catch (err) {
    console.error('[approve] email failed:', err)
  }

  return json(200, { ok: true, tracking_number, status })
}

function json(status: number, body: object, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}
