'use client'

import { useEffect, useState } from 'react'

/**
 * Lagos time, tabular. It renders nothing until it has mounted: a clock that
 * ships a server-rendered time is a clock showing the build time, which is a
 * dead readout, and design.md would rather hide a readout than fake one.
 */
export function Clock() {
  const [now, setNow] = useState<string | null>(null)

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Lagos',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date()),
      )
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  if (!now) return null
  return (
    <span className="label clock">
      {now} <span aria-hidden="true">·</span> WAT
    </span>
  )
}
