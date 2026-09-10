'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Label } from '@/components/ui'

/**
 * One column of the footer sitemap — design.md, Footer.
 *
 * Above 900px it is a plain ruled link list under a mono label. Below it, the
 * label becomes a real disclosure button, because eleven links per column
 * unstacked is a phone screen of nothing but links.
 *
 * It renders the desktop shape on the server, so a visitor with no JavaScript
 * gets every link at every width — the footer is this site's no-JavaScript
 * navigation and it is not allowed to swallow itself. The collapse is applied
 * on mount, once the media query can actually be read.
 */
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
