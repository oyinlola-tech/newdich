'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Label } from '@/components/ui'


export function FooterGroup({
  name,
  links,
}: {
  name: string
  links: Array<[string, string]>
}) {
  const [collapsible, setCollapsible] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const sync = () => setCollapsible(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const list = (
    <div className="foot-links">
      {links.map(([href, text]) => (
        <Link href={href} key={href}>
          {text}
        </Link>
      ))}
    </div>
  )

  if (!collapsible) {
    return (
      <div className="foot-col">
        <Label>{name}</Label>
        {list}
      </div>
    )
  }

  return (
    <div className="foot-col foot-col--fold" data-open={open ? 'true' : 'false'}>
      <button
        type="button"
        className="foot-fold"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Label>{name}</Label>
        <span className="foot-fold-mark" aria-hidden="true" />
      </button>
      {open ? list : null}
    </div>
  )
}
