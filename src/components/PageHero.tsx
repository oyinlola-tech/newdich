/**
 * The page hero — every route that is not the home page.
 *
 * Breadcrumb, a mono label carrying data, the headline at display-xl, a lede,
 * and then — on a system page — the running instrument directly beneath.
 * Company pages pass their own spec or index as `children` instead.
 */

import type { ReactNode } from 'react'

import { Breadcrumbs, Label } from '@/components/ui'

export function PageHero({
  trail,
  label,
  title,
  lede,
  actions,
  children,
}: {
  trail?: Array<[string, string] | [null, string]>
  label: string
  title: string
  lede?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="pagehero">
      <div className="wrap">
        {trail ? <Breadcrumbs trail={trail} /> : null}
        <Label accent>{label}</Label>
        <h1 className="display-xl" style={{ marginTop: 'var(--s4)' }}>
          {title}
        </h1>
        {lede ? <p className="lede">{lede}</p> : null}
        {actions ? <div className="btns">{actions}</div> : null}
        {children ? <div className="hero-instrument">{children}</div> : null}
      </div>
    </section>
  )
}
