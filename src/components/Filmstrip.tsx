'use client'



import { useCallback, useEffect, useRef, useState } from 'react'

import { SHOTS, shotUrl } from '@/data/gallery'
import { Label } from '@/components/ui'

const Chevron = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path
      d={back ? 'M13 8H4M7.5 4l-4 4 4 4' : 'M3 8h9M8.5 4l4 4-4 4'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function Filmstrip() {
  const rail = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  
  const syncEnds = useCallback(() => {
    const el = rail.current
    if (!el) return
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2)
  }, [])

  useEffect(() => {
    const el = rail.current
    if (!el) return
    syncEnds()
    el.addEventListener('scroll', syncEnds, { passive: true })
    const ro = new ResizeObserver(syncEnds)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', syncEnds)
      ro.disconnect()
    }
  }, [syncEnds])

  
  const step = () => {
    const el = rail.current
    if (!el) return 320
    const card = el.querySelector<HTMLElement>('.film-card')
    return card ? card.offsetWidth + 16 : Math.round(el.clientWidth * 0.8)
  }

  const nudge = useCallback((dir: 1 | -1) => {
    rail.current?.scrollBy({
      left: dir * step(),
      behavior: reduced() ? 'auto' : 'smooth',
    })
  }, [])

  
  const onWheel = useCallback((e: React.WheelEvent<HTMLUListElement>) => {
    const el = rail.current
    if (!el) return
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
    const next = el.scrollLeft + e.deltaY
    
    if (next > 0 && next < el.scrollWidth - el.clientWidth) {
      e.preventDefault()
      el.scrollLeft = next
    }
  }, [])

  
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === 'touch') return
    const el = rail.current
    if (!el) return
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false }
    el.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = rail.current
    const d = drag.current
    if (!el || !d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 3) d.moved = true
    el.scrollLeft = d.left - dx
  }

  const endDrag = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = rail.current
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    
    if (drag.current?.moved) {
      const swallow = (ev: Event) => ev.preventDefault()
      window.addEventListener('click', swallow, { capture: true, once: true })
      window.setTimeout(
        () => window.removeEventListener('click', swallow, { capture: true }),
        0,
      )
    }
    drag.current = null
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      nudge(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      nudge(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      rail.current?.scrollTo({ left: 0, behavior: reduced() ? 'auto' : 'smooth' })
    } else if (e.key === 'End') {
      e.preventDefault()
      const el = rail.current
      el?.scrollTo({ left: el.scrollWidth, behavior: reduced() ? 'auto' : 'smooth' })
    }
  }

  return (
    <div className="film">
      <div className="film-bar">
        <Label>
          {SHOTS.length} photographs · Newdich Technology Institute
        </Label>
        <div className="film-controls">
          <button
            type="button"
            className="icon-btn"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label="Scroll the gallery back"
          >
            <Chevron back />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label="Scroll the gallery forward"
          >
            <Chevron />
          </button>
        </div>
      </div>

      <ul
        className="film-rail"
        ref={rail}
        tabIndex={0}
        role="list"
        aria-label="Photographs from Newdich Technology Institute. Use the arrow keys to move along the strip."
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        {SHOTS.map((shot, i) => (
          <li
            className="film-card"
            key={shot.file}
            style={{ ['--ar' as string]: `${shot.w} / ${shot.h}` }}
          >
            <figure>
              <span className="film-shot">
                <img
                  src={shotUrl(shot.file)}
                  alt={shot.alt}
                  width={shot.w}
                  height={shot.h}
                  
                  loading={i < 3 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : undefined}
                  decoding="async"
                  draggable={false}
                />
              </span>
              <figcaption className="film-cap">
                <Label>{shot.group}</Label>
                <b>{shot.caption}</b>
                <span>{shot.note}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}
