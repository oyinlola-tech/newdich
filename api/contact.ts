/**
 * The contact endpoint — the one piece of server on this site.
 *
 * The site itself is still a static export (`output: 'export'`); this is a
 * standalone platform function deployed alongside it, and it exists for one
 * reason: a Resend API key is a secret. There is no publishable browser key.
 * A key shipped in client JavaScript can be lifted out of the bundle by
 * anybody who opens the network tab, and then anybody can send mail as
 * newdich.tech — which ends with the domain in a blocklist. So the key lives
 * here, in an environment variable the browser never sees.
 *
 * Written against the Web-standard Request/Response signature, which is what
 * Vercel Functions, Netlify Functions and Cloudflare Pages Functions all
 * speak. See the README for the per-host wiring.
 *
 * Env:
 *   RESEND_API_KEY  required — the secret key
 *   CONTACT_TO      optional — where enquiries land (default newdichngr@gmail.com)
 *   CONTACT_FROM    optional — a verified Resend sender on your own domain
 */

import { Resend } from 'resend'

const TO = process.env.CONTACT_TO ?? 'newdichngr@gmail.com'
/* Resend will only send from a domain you have verified. Until newdich.tech is
   verified in the Resend dashboard, their shared onboarding sender works. */
const FROM = process.env.CONTACT_FROM ?? 'Newdich site <onboarding@resend.dev>'

/** Caps, so a malformed or hostile post cannot arrive as a megabyte of body. */
const LIMITS = { name: 120, email: 200, org: 160, practice: 120, brief: 5000 } as const

type Field = keyof typeof LIMITS

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })

/**
 * Everything that reaches the mail body is escaped. The message is assembled
 * from what a stranger typed into a public form, so it is treated as hostile
 * text rather than as markup — an unescaped `<` here is how a contact form
 * becomes a phishing relay.
 */
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Header injection: a newline in a subject or a name splits the header. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim()

export async function POST(request: Request): Promise<Response> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[contact] RESEND_API_KEY is not set')
    return json(500, { error: 'The contact endpoint is not configured.' })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json(400, { error: 'Send this as JSON.' })
  }

  /* A honeypot: a field no person can see and no person fills in. Bots fill
     every input they find, so anything in it is not a human enquiry. It is
     accepted with a 200 so the bot has nothing to learn from the response. */
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return json(200, { ok: true })
  }

  const read = (f: Field) => {
    const v = body[f]
    return typeof v === 'string' ? v.trim().slice(0, LIMITS[f]) : ''
  }

  const name = read('name')
  const email = read('email')
  const org = read('org')
  const practice = read('practice')
  const brief = read('brief')

  /* The same rules the form applies in the browser, applied again here.
     Client-side validation is a courtesy to the person filling the form; it is
     not a check, because nothing stops a post that never went near the form. */
  const errors: Record<string, string> = {}
  if (name.length < 2) errors.name = 'Tell us your name so we know who we are replying to.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'That address is missing an @ or a domain — we cannot reply to it.'
  if (brief.length < 20)
    errors.brief = 'A sentence or two about the system and the constraint it runs under.'
  if (Object.keys(errors).length > 0) return json(422, { errors })

  const subject = oneLine(`Project enquiry — ${org || name}`)
  const lines = [
    ['Name', name],
    ['Email', email],
    org ? ['Organisation', org] : null,
    practice ? ['Practice', practice] : null,
  ].filter(Boolean) as Array<[string, string]>

  try {
    const resend = new Resend(key)
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      subject,
      /* Replying in a mail client should reach the person, not the site. */
      replyTo: email,
      text: [...lines.map(([k, v]) => `${k}: ${v}`), '', brief].join('\n'),
      html: [
        '<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6">',
        '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px">',
        ...lines.map(
          ([k, v]) =>
            `<tr><td style="padding:2px 16px 2px 0;color:#667">${esc(k)}</td>` +
            `<td style="padding:2px 0"><strong>${esc(v)}</strong></td></tr>`,
        ),
        '</table>',
        `<div style="white-space:pre-wrap;border-left:2px solid #3B9BFF;padding-left:12px">${esc(
          brief,
        )}</div>`,
        '</div>',
      ].join(''),
    })

    if (error) {
      console.error('[contact] resend rejected the send', error)
      return json(502, { error: 'The mail service refused the message. Try again shortly.' })
    }
    return json(200, { ok: true, id: data?.id })
  } catch (e) {
    console.error('[contact] send failed', e)
    return json(502, { error: 'The message could not be sent. Try again shortly.' })
  }
}

/** Anything that is not a POST has no business here. */
export function GET(): Response {
  return json(405, { error: 'POST a JSON enquiry to this endpoint.' })
}
