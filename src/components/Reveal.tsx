'use client'

import { useEffect } from 'react'

/**
 * Entry animation: fade + 6px translate, once, on the elements marked
 * [data-reveal]. Under prefers-reduced-motion the sheet already neutralises
 * the transform, so this only has to add the class.
 */
export function Reveal() {
  useEffect(() => {
    document.documentElement.classList.add('js')

    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')
    if (targets.length === 0) return

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      targets.forEach((el) => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          /* 40ms between items, so a list cascades rather than flashing. */
          window.setTimeout(() => el.classList.add('is-in'), i * 40)
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
