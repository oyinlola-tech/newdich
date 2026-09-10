'use client'

import { useEffect, useState } from 'react'

/**
 * The route the visitor asked for, stated in full as captured — design.md,
 * Error pages. The first thing a person needs from a 404 is confirmation that
 * the machine heard them correctly.
 *
 * The page is a static export, so the path is only knowable in the browser.
 * Until it is read, the panel states that rather than showing a placeholder
 * dressed up as a reading.
 */
export function RequestedPath() {
  const [path, setPath] = useState<string | null>(null)

  useEffect(() => {
    setPath(window.location.pathname + window.location.search)
  }, [])

  return <code>{path ?? 'the address in your bar'}</code>
}
