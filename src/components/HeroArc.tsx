'use client'

import { useEffect, useRef } from 'react'

/**
 * The hero arc — design.md, Hero.
 *
 * A dot-matrix arc built from the mark's module, painted to a canvas and
 * masked (in CSS) to dissolve top and bottom so it reads as a horizon under
 * the sentence rather than a ring around it.
 *
 * Opacity falloff only: no glow, no blur, no second hue. Every dot is the
 * signal colour read off the live computed style, so it follows the theme.
 */
export function HeroArc() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0

    const paint = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = parent.clientWidth
      const h = parent.clientHeight
      if (w === 0 || h === 0) return

      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const signal = getComputedStyle(document.documentElement)
        .getPropertyValue('--signal')
        .trim() || '#3B9BFF'

      /* The arc sits low and wide: its centre is below the panel, so what
         shows is the top of a very large circle. Both the centre and the
         radius are driven by the width, so the arc keeps the same shape
         whether the hero is 600px tall or 1400. */
      const cx = w * 0.5
      const cy = h + w * 0.34
      const radius = w * 0.78

      const gap = 15
      const module = 3.2
      const rings = 7

      for (let ring = 0; ring < rings; ring += 1) {
        const r = radius - ring * gap
        /* Arc length fixed in pixels, so the dot spacing stays even as the
           ring shrinks rather than crowding toward the middle. */
        const steps = Math.max(24, Math.round((Math.PI * r) / gap))
        for (let i = 0; i <= steps; i += 1) {
          const angle = Math.PI + (i / steps) * Math.PI
          const x = cx + Math.cos(angle) * r
          const y = cy + Math.sin(angle) * r
          if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue

          /* Falloff: brightest at the crown of the arc and on the outer ring,
             dissolving toward the ends and inward. */
          const fromCrown = Math.abs(x - cx) / (w * 0.62)
          const alpha =
            0.5 * (1 - ring / rings) * Math.max(0, 1 - fromCrown * fromCrown) * 0.85
          if (alpha <= 0.012) continue

          ctx.globalAlpha = alpha
          ctx.fillStyle = signal
          ctx.beginPath()
          const size = module * (1 - ring / (rings * 2.4))
          /* The module's own 27.3% radius, drawn at dot scale. */
          ctx.roundRect(x - size / 2, y - size / 2, size, size, size * 0.273)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(paint)
    }

    schedule()
    const ro = new ResizeObserver(schedule)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    /* The dots are painted in the theme's signal colour, so a theme change
       has to repaint them. */
    const mo = new MutationObserver(schedule)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    mq.addEventListener('change', schedule)

    return () => {
      window.cancelAnimationFrame(frame)
      ro.disconnect()
      mo.disconnect()
      mq.removeEventListener('change', schedule)
    }
  }, [])

  return <canvas className="hero-arc" ref={ref} aria-hidden="true" />
}
