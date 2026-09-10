'use client'

/**
 * The gallery — an oversized headline ringed by plates that hold still until
 * the pointer arrives, then orbit.
 *
 * The structure is taken from ThreeUI's gallery heading: a headline at the
 * centre of a ring of 4:3 plates, motionless until a pointer enters, each
 * plate then displaced by where the pointer is relative to it.
 *
 * Two things are adapted rather than copied. The reference fills its plates
 * with flat colour shaded by a procedural noise field; this site has no fourth
 * colour to shade and no stock imagery, so each plate holds a **drawn
 * instrument** — one of the systems the company actually ships. And the orbit
 * is restrained to a few pixels of transform: design.md puts motion at 3/10
 * and animates transform and opacity only, so the plates lean toward the
 * pointer rather than revolving around the headline.
 *
 * With JavaScript off, or under prefers-reduced-motion, the ring is a still
 * composition that reads exactly the same. Nothing here depends on the motion
 * to be understood.
 */

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
  /** Where the plate sits in the ring: [column, row]. */
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

/**
 * Eight plates, ringing the headline: four above, one to each side, two below.
 *
 * The ninth drawing the site owns is `architecture`, and it is deliberately
 * not here — it is a diagram of the shape every build takes, not a system that
 * shipped, and this is a gallery of systems.
 */
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

  /* One rAF per pointer move, and the write is a pair of custom properties per
     plate — no layout property is touched, so the whole ring stays on the
     compositor. */
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
        /* Falls off with distance, so the ring settles as the pointer leaves
           rather than every plate reacting to every move. */
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
