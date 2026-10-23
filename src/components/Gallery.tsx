'use client'



import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'

import { Art, type ArtKey } from '@/lib/art'
import { CASE_BY_SLUG } from '@/data/work'
import { ROUTES } from '@/lib/routes'
import { Label } from '@/components/ui'

type Plate = {
  art: ArtKey
  title: string
  note: string
  href: string
  
  at: [number, number]
}

const fromCase = (slug: string, art: ArtKey, at: [number, number]): Plate => {
  const c = CASE_BY_SLUG[slug]
  return {
    art,
    title: c?.title ?? slug,
    note: c?.sector ?? '',
    href: c?.url ?? ROUTES.work,
    at,
  }
}


const PLATES: Plate[] = [
  fromCase('smart-metering', 'meter', [1, 1]),
  fromCase('payments-gateway', 'ledger', [2, 1]),
  fromCase('cbt-examinations', 'exam', [3, 1]),
  fromCase('queue-management', 'queue', [4, 1]),
  fromCase('p2p-escrow', 'exchange', [1, 2]),
  fromCase('identity-verification', 'identity', [4, 2]),
  {
    art: 'pos',
    title: 'LAN point of sale',
    note: 'Commerce · offline',
    href: ROUTES.lan,
    at: [2, 3],
  },
  {
    art: 'lan',
    title: 'Newdich LAN territory',
    note: 'Connectivity · 300 m – 3 km',
    href: ROUTES.lan,
    at: [3, 3],
  },
]

export function Gallery() {
  const ringRef = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  
  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const ring = ringRef.current
    if (!ring) return
    const px = e.clientX
    const py = e.clientY

    window.cancelAnimationFrame(frame.current)
    frame.current = window.requestAnimationFrame(() => {
      for (const plate of Array.from(ring.querySelectorAll<HTMLElement>('.plate'))) {
        const r = plate.getBoundingClientRect()
        const dx = px - (r.left + r.width / 2)
        const dy = py - (r.top + r.height / 2)
        const dist = Math.hypot(dx, dy)
        
        const pull = Math.max(0, 1 - dist / 620)
        const amount = 12 * pull * pull
        plate.style.setProperty('--px', `${((dx / (dist || 1)) * amount).toFixed(2)}px`)
        plate.style.setProperty('--py', `${((dy / (dist || 1)) * amount).toFixed(2)}px`)
        plate.style.setProperty('--lift', pull.toFixed(3))
      }
    })
  }, [])

  const settle = useCallback(() => {
    window.cancelAnimationFrame(frame.current)
    const ring = ringRef.current
    if (!ring) return
    for (const plate of Array.from(ring.querySelectorAll<HTMLElement>('.plate'))) {
      plate.style.setProperty('--px', '0px')
      plate.style.setProperty('--py', '0px')
      plate.style.setProperty('--lift', '0')
    }
  }, [])

  useEffect(() => () => window.cancelAnimationFrame(frame.current), [])

  return (
    <div
      className="gallery-ring"
      ref={ringRef}
      onPointerMove={onMove}
      onPointerLeave={settle}
    >
      <div className="gallery-say">
        <h2 className="gallery-head">Drawn, not stocked.</h2>
        <p className="copy">
          Every illustration on this site is a system the company shipped, drawn as vector and
          coloured by the same three tokens as the page around it. There is no photography here
          and there is no stock: a picture of somebody else’s office would tell you nothing about
          what we build.
        </p>
        <Link className="arrow" href={ROUTES.work}>
          Every case study
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M3 8h9M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {PLATES.map((p) => (
        <Link
          className="plate"
          key={`${p.art}-${p.at[0]}-${p.at[1]}`}
          href={p.href}
          style={
            {
              '--col': p.at[0],
              '--row': p.at[1],
            } as React.CSSProperties
          }
        >
          <span className="plate-art">
            <Art name={p.art} />
          </span>
          <span className="plate-rail">
            <Label>{p.note}</Label>
            <b>{p.title}</b>
          </span>
        </Link>
      ))}
    </div>
  )
}
