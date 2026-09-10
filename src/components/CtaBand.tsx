/**
 * The closing band — design.md, Call to action.
 *
 * A console, not a banner. cta.gallery sorts CTAs by mechanism; this site
 * ships button, form and navigation and refuses modal, pop-up, download,
 * newsletter and pricing. A promise in a CTA is either specific or absent, so
 * the reply commitment is stated in words.
 */

import Link from 'next/link'

import { COMPANY, PHONE_DISPLAY } from '@/lib/site'
import { ROUTES } from '@/lib/routes'
import { Label } from '@/components/ui'

export function CtaBand({
  title = 'Tell us what has to be right.',
  note = 'Send the shape of the problem and the constraint it runs under. You get a written system design and a phased estimate you own — whether or not you build it with us.',
  action = { href: ROUTES.contact, text: 'Start a project' },
}: {
  title?: string
  note?: string
  action?: { href: string; text: string }
}) {
  return (
    <section className="cta-band">
      <div className="wrap cta-inner">
        <div className="cta-copy">
          <h2 className="display">{title}</h2>
          <p className="copy" style={{ marginTop: 'var(--s4)' }}>
            {note}
          </p>
        </div>
        <div className="cta-act">
          <Link className="btn btn--solid" href={action.href}>
            {action.text}
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path d="M3 8h9M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <a className="label" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
          <a className="label" href={`tel:${COMPANY.phone}`}>
            {PHONE_DISPLAY}
          </a>
          <a className="label" href={COMPANY.whatsapp} target="_blank" rel="noreferrer noopener">
            WhatsApp
          </a>
          <Label accent>We reply within 24 hours.</Label>
        </div>
      </div>
    </section>
  )
}
