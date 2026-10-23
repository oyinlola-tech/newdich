'use client'

import { useEffect, useState } from 'react'


export function RequestedPath() {
  const [path, setPath] = useState<string | null>(null)

  useEffect(() => {
    setPath(window.location.pathname + window.location.search)
  }, [])

  return <code>{path ?? 'the address in your bar'}</code>
}
