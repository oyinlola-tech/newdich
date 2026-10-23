

import { Resend } from 'resend'

const TO = process.env.CONTACT_TO ?? 'newdichngr@gmail.com'

const FROM = process.env.CONTACT_FROM ?? 'Newdich site <onboarding@resend.dev>'


const LIMITS = { name: 120, email: 200, org: 160, practice: 120, brief: 5000 } as const

type Field = keyof typeof LIMITS


const MAX_BODY = 16 * 1024


const RATE = { windowMs: 60 * 60 * 1000, perAddress: 5, burst: 2, burstMs: 60 * 1000 }


const GLOBAL = { windowMs: 60 * 60 * 1000, max: 60 }

const hits = new Map<string, number[]>()
const globalHits: number[] = []


const recent = (stamps: number[], now: number, windowMs: number) => {
  const cutoff = now - windowMs
  let i = 0
  while (i < stamps.length && (stamps[i] ?? 0) <= cutoff) i += 1
  if (i > 0) stamps.splice(0, i)
  return stamps
}


const addressOf = (request: Request) => {
  const h = request.headers
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim()
  return h.get('cf-connecting-ip') ?? h.get('x-real-ip') ?? forwarded ?? 'unknown'
}


const sweep = (now: number) => {
  if (hits.size < 5000) return
  for (const [key, stamps] of hits) {
    if (recent(stamps, now, RATE.windowMs).length === 0) hits.delete(key)
  }
}

type Verdict = { ok: true } | { ok: false; retryAfter: number }

const takeToken = (address: string): Verdict => {
  const now = Date.now()
  sweep(now)

  if (recent(globalHits, now, GLOBAL.windowMs).length >= GLOBAL.max) {
    return { ok: false, retryAfter: Math.ceil(GLOBAL.windowMs / 1000) }
  }

  const stamps = recent(hits.get(address) ?? [], now, RATE.windowMs)
  hits.set(address, stamps)

  const burst = stamps.filter((t) => t > now - RATE.burstMs).length
  if (burst >= RATE.burst) return { ok: false, retryAfter: Math.ceil(RATE.burstMs / 1000) }

  if (stamps.length >= RATE.perAddress) {
    const oldest = stamps[0] ?? now
    return { ok: false, retryAfter: Math.max(1, Math.ceil((oldest + RATE.windowMs - now) / 1000)) }
  }

  stamps.push(now)
  globalHits.push(now)
  return { ok: true }
}


const ALLOWED_ORIGINS = (process.env.CONTACT_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const json = (status: number, body: object, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
      
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      ...headers,
    },
  })


const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Header injection: a newline in a subject or a name splits the header. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim()

/**
 * The C0 and C1 control characters, less the tab and the newline a brief may
 * legitimately contain. They have no business in a name or an address, and
 * they are how a value comes to mean one thing to a validator and another to
 * whatever reads it next.
 */
const CONTROLS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u2028\u2029\uFEFF]/g

const stripControls = (s: string) => s.replace(CONTROLS, '')

/**
 * The reply-to address, held to a stricter shape than a display check would
 * be. It becomes a mail header, so a value that survives this has no
 * whitespace, no control character, no comma and no angle bracket with which
 * to close the header early.
 */
const SAFE_EMAIL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/

export async function POST(request: Request): Promise<Response> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[contact] RESEND_API_KEY is not set')
    return json(500, { error: 'The contact endpoint is not configured.' })
  }

  /* A browser will not send a JSON content type cross-origin without a
     preflight, and this endpoint grants no preflight — so requiring the type
     is the thing that makes a silent cross-site post impossible. */
  const type = request.headers.get('content-type') ?? ''
  if (!type.toLowerCase().includes('application/json')) {
    return json(415, { error: 'Send this as application/json.' })
  }

  /* And where the browser states an origin, it has to be one of ours. */
  const origin = request.headers.get('origin')
  if (ALLOWED_ORIGINS.length > 0 && origin && !ALLOWED_ORIGINS.includes(origin)) {
    return json(403, { error: 'This endpoint does not accept posts from that origin.' })
  }

  /* Declared size first — cheap, and it turns away the obvious case before a
     byte is read. The read is capped again below, because the header is only a
     claim and a chunked body need not carry one at all. */
  const declared = Number(request.headers.get('content-length') ?? '')
  if (Number.isFinite(declared) && declared > MAX_BODY) {
    return json(413, { error: 'That message is too large.' })
  }

  const verdict = takeToken(addressOf(request))
  if (!verdict.ok) {
    return json(
      429,
      { error: 'That is a lot of enquiries at once. Try again shortly, or email us directly.' },
      { 'retry-after': String(verdict.retryAfter) },
    )
  }

  let raw: string
  try {
    raw = await request.text()
  } catch {
    return json(400, { error: 'The request body could not be read.' })
  }
  if (raw.length > MAX_BODY) return json(413, { error: 'That message is too large.' })

  let body: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return json(400, { error: 'Send this as a JSON object.' })
    }
    body = parsed as Record<string, unknown>
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
    return typeof v === 'string' ? stripControls(v).trim().slice(0, LIMITS[f]) : ''
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
  if (!SAFE_EMAIL.test(email))
    errors.email = 'That address is missing an @ or a domain — we cannot reply to it.'
  if (brief.length < 20)
    errors.brief = 'A sentence or two about the system and the constraint it runs under.'
  if (Object.keys(errors).length > 0) return json(422, { errors })

  const subject = oneLine(`Project enquiry — ${org || name}`).slice(0, 180)
  const lines = [
    ['Name', oneLine(name)],
    ['Email', email],
    org ? ['Organisation', oneLine(org)] : null,
    practice ? ['Practice', oneLine(practice)] : null,
  ].filter(Boolean) as Array<[string, string]>

  try {
    const resend = new Resend(key)
    const { error } = await resend.emails.send({
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
    /* The provider's message id is no use to the browser and is a detail of
       our own mail account, so it stays on this side of the wire. */
    return json(200, { ok: true })
  } catch (e) {
    console.error('[contact] send failed', e)
    return json(502, { error: 'The message could not be sent. Try again shortly.' })
  }
}

/** Anything that is not a POST has no business here. */
const refuse = (): Response => json(405, { error: 'POST a JSON enquiry to this endpoint.' })

export const GET = refuse
export const PUT = refuse
export const PATCH = refuse
export const DELETE = refuse
export const HEAD = refuse

/**
 * No CORS headers are returned, deliberately. Only this site's own pages post
 * here, and a same-origin post is never preflighted — so answering a preflight
 * with permission would grant only the request this endpoint does not want.
 */
export function OPTIONS(): Response {
  return new Response(null, {
    status: 204,
    headers: { allow: 'POST', 'cache-control': 'no-store' },
  })
}
