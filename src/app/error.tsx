'use client'

import { useEffect } from 'react'

import { COMPANY } from '@/lib/site'
import { ROUTES } from '@/lib/routes'
import { Btn, Dot, Label } from '@/components/ui'
import { Clock } from '@/components/Clock'

/**
 * The 500 — design.md, Error pages. The same panel as the 404 with the reading
 * changed to a service fault, and the recovery reduced to a retry and the
 * contact channels.
 *
 * It states that the error was logged, because on this site that is true: the
 * boundary reports it to the console where a browser or an error reporter can
 * pick it up.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[newdich] render fault', error)
  }, [error])

  return (
    <section className="fault">
      <div className="wrap">
        <div className="fault-panel">
          <div className="fault-bar">
            <Label>Render</Label>
            <Label>
              <Dot held />
              Service fault
            </Label>
            <Clock />
          </div>

          <div className="fault-body">
            <div className="fault-say">
              <h1 className="fault-code">500</h1>
              <p className="lede">
                This page failed to render. The fault was logged. Retrying re-runs the render
                rather than reloading the whole site, which is usually enough.
              </p>
              <div className="btns">
                <button className="btn btn--solid" type="button" onClick={reset}>
                  Retry this page
                </button>
                <Btn href={ROUTES.home}>Back to the front</Btn>
              </div>
            </div>

            <div className="fault-read">
              <Label>Reference</Label>
              <code>{error.digest ?? 'no digest issued'}</code>
              <Label>Status · 500 · render fault</Label>
            </div>
          </div>

          <div className="fault-foot">
            <Label>Logged</Label>
            <a className="label" href={`mailto:${COMPANY.email}`}>
              {COMPANY.email}
            </a>
            <a className="label" href={`tel:${COMPANY.phone}`}>
              {COMPANY.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
