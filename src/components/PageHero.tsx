

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
