'use client'

/**
 * The contact form — design.md, Components.
 *
 * Label above input, error stated below in words. There is no red to use, so
 * an invalid field is marked by its blue focus border and the message says
 * what is wrong. Nothing here depends on hue alone.
 *
 * The site is a static export with no backend, so submitting composes a mail
 * to the company with the fields filled in. The form says that in words rather
 * than pretending to post somewhere.
 */

import { useState } from 'react'

import { COMPANY } from '@/lib/site'
import { PRACTICES } from '@/data/practices'
import { Label } from '@/components/ui'

type Errors = Partial<Record<'name' | 'email' | 'brief', string>>

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const org = String(data.get('org') ?? '').trim()
    const practice = String(data.get('practice') ?? '').trim()
    const brief = String(data.get('brief') ?? '').trim()

    const next: Errors = {}
    if (name.length < 2) next.name = 'Tell us your name so we know who we are replying to.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = 'That address is missing an @ or a domain — we cannot reply to it.'
    if (brief.length < 20)
      next.brief = 'A sentence or two about the system and the constraint it runs under.'
    setErrors(next)
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>('[data-invalid="true"] input, [data-invalid="true"] textarea')?.focus()
      return
    }

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      org ? `Organisation: ${org}` : null,
      practice ? `Practice: ${practice}` : null,
      '',
      brief,
    ]
      .filter(Boolean)
      .join('\n')

    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
      `Project enquiry — ${org || name}`,
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field-row">
        <div className="field" data-invalid={errors.name ? 'true' : undefined}>
          <label htmlFor="f-name">Your name</label>
          <input id="f-name" name="name" type="text" autoComplete="name" />
          {errors.name ? <p className="field-err">{errors.name}</p> : null}
        </div>
        <div className="field" data-invalid={errors.email ? 'true' : undefined}>
          <label htmlFor="f-email">Email</label>
          <input id="f-email" name="email" type="email" autoComplete="email" />
          {errors.email ? <p className="field-err">{errors.email}</p> : null}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-org">Organisation</label>
          <input id="f-org" name="org" type="text" autoComplete="organization" />
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
          placeholder="The system, who depends on it, and the condition it has to survive — a bad network, a power cut, an audit six months later."
        />
        {errors.brief ? <p className="field-err">{errors.brief}</p> : null}
      </div>

      <div className="btns">
        <button className="btn btn--solid" type="submit">
          Send the brief
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M3 8h9M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <Label>We reply within 24 hours.</Label>
      </div>

      {sent ? (
        <p className="formmsg" role="status">
          Your mail client should have opened with the brief filled in. If it did not, send the
          same note straight to <a className="link" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
        </p>
      ) : (
        <p className="formnote">
          This site is a static build with no server behind it, so the form opens your mail
          client with the fields filled in rather than posting anywhere. Prefer to write it
          yourself? {COMPANY.email}.
        </p>
      )}
    </form>
  )
}
