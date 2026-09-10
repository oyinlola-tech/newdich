'use client'

/**
 * The contact form — design.md, Components.
 *
 * Label above input, error stated below in words. There is no red to use, so
 * an invalid field is marked by its blue focus border and the message says
 * what is wrong. Nothing here depends on hue alone.
 *
 * It posts to `/api/contact`, a platform function that holds the Resend key.
 * The key is never in this bundle: a Resend key is a secret, and one shipped
 * to the browser can be lifted out and used to send mail as newdich.tech.
 *
 * Validation runs here as a courtesy to the person filling the form and again
 * on the server as the actual check, because nothing stops a post that never
 * went near this component.
 */

import { useState } from 'react'

import { COMPANY } from '@/lib/site'
import { PRACTICES } from '@/data/practices'
import { Label } from '@/components/ui'

type Errors = Partial<Record<'name' | 'email' | 'brief', string>>
type State = 'idle' | 'sending' | 'sent' | 'failed'

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<State>('idle')
  const [failure, setFailure] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (state === 'sending') return

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      org: String(data.get('org') ?? '').trim(),
      practice: String(data.get('practice') ?? '').trim(),
      brief: String(data.get('brief') ?? '').trim(),
      /* The honeypot travels with the rest; the server decides what it means. */
      company: String(data.get('company') ?? ''),
    }

    const next: Errors = {}
    if (payload.name.length < 2)
      next.name = 'Tell us your name so we know who we are replying to.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      next.email = 'That address is missing an @ or a domain — we cannot reply to it.'
    if (payload.brief.length < 20)
      next.brief = 'A sentence or two about the system and the constraint it runs under.'
    setErrors(next)
    if (Object.keys(next).length > 0) {
      form
        .querySelector<HTMLElement>(
          '[data-invalid="true"] input, [data-invalid="true"] textarea',
        )
        ?.focus()
      return
    }

    setState('sending')
    setFailure('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 422) {
        const body = (await res.json()) as { errors?: Errors }
        setErrors(body.errors ?? {})
        setState('idle')
        return
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        setFailure(body.error ?? 'The message could not be sent.')
        setState('failed')
        return
      }

      form.reset()
      setState('sent')
    } catch {
      /* Offline, blocked, or the endpoint is not deployed yet. Say so, and
         hand over the address rather than losing what they wrote. */
      setFailure('The message could not be sent — you may be offline.')
      setState('failed')
    }
  }

  if (state === 'sent') {
    return (
      <div className="formmsg" role="status">
        <Label accent>Sent</Label>
        <p style={{ marginTop: 'var(--s2)' }}>
          Your brief is with us. We reply within 24 hours, either way — and if it is a no, we
          will say so rather than leave you waiting.
        </p>
        <button
          className="btn btn--line btn--sm"
          type="button"
          style={{ marginTop: 'var(--s4)' }}
          onClick={() => setState('idle')}
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field-row">
        <div className="field" data-invalid={errors.name ? 'true' : undefined}>
          <label htmlFor="f-name">Your name</label>
          <input id="f-name" name="name" type="text" autoComplete="name" maxLength={120} />
          {errors.name ? <p className="field-err">{errors.name}</p> : null}
        </div>
        <div className="field" data-invalid={errors.email ? 'true' : undefined}>
          <label htmlFor="f-email">Email</label>
          <input id="f-email" name="email" type="email" autoComplete="email" maxLength={200} />
          {errors.email ? <p className="field-err">{errors.email}</p> : null}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-org">Organisation</label>
          <input id="f-org" name="org" type="text" autoComplete="organization" maxLength={160} />
        </div>
        <div className="field">
          <label htmlFor="f-practice">Closest practice</label>
          <select id="f-practice" name="practice" defaultValue="">
            <option value="">Not sure yet</option>
            {PRACTICES.map((p) => (
              <option key={p.slug} value={p.title}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field" data-invalid={errors.brief ? 'true' : undefined}>
        <label htmlFor="f-brief">What has to be right?</label>
        <textarea
          id="f-brief"
          name="brief"
          maxLength={5000}
          placeholder="The system, who depends on it, and the condition it has to survive — a bad network, a power cut, an audit six months later."
        />
        {errors.brief ? <p className="field-err">{errors.brief}</p> : null}
      </div>

      {/* The honeypot. No person sees it, no keyboard reaches it, and no
          screen reader announces it — so anything in it came from something
          filling every input it found. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-company">Company (leave this empty)</label>
        <input id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="btns">
        <button className="btn btn--solid" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send the brief'}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M3 8h9M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <Label>We reply within 24 hours.</Label>
      </div>

      {state === 'failed' ? (
        <p className="formmsg" role="alert">
          {failure} Send it straight to{' '}
          <a className="link" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>{' '}
          instead — nothing you typed has been lost.
        </p>
      ) : (
        <p className="formnote">
          Goes to {COMPANY.email}, delivered by Resend. We use what you send to reply to you and
          for nothing else — there is no list to be added to. See the{' '}
          <a className="link" href="/privacy">privacy page</a>.
        </p>
      )}
    </form>
  )
}
