import type { Metadata } from 'next'

import { ROUTE_INDEX } from '@/lib/nav'
import { ROUTES } from '@/lib/routes'
import { Btn, Degrade, Dot, Index, IndexRow, Label, Marker } from '@/components/ui'
import { Clock } from '@/components/Clock'
import { RequestedPath } from '@/components/RequestedPath'

export const metadata: Metadata = {
  title: 'No route · 404',
  description: 'That path does not exist on this site. Every route is listed here.',
  robots: { index: false, follow: true },
}

/**
 * The 404 — design.md, Error pages.
 *
 * 404s.design is dominated by playful and game-shaped error pages. They are
 * wrong here: a company whose argument is that its systems stay correct when
 * the power fails does not answer its own broken link with a cartoon. So the
 * 404 is an instrument reporting a real reading — signal lost — and the
 * recovery is the full route index rather than a lone "go home" button.
 */
export default function NotFound() {
  return (
    <section className="fault">
      <div className="wrap">
        <div className="fault-panel">
          <div className="fault-bar">
            <Label>Route resolution</Label>
            {/* State is form, not hue: hollow and still means held. The word
                travels with the mark. */}
            <Label>
              <Dot held />
              No route
            </Label>
            <Clock />
          </div>

          <div className="fault-body">
            <div className="fault-say">
              <h1 className="fault-code">404</h1>
              <p className="lede">
                The path resolved to nothing. Nothing buffered, nothing lost — the request simply
                named an address this site does not have.
              </p>
              <div className="btns">
                <Btn href={ROUTES.home} kind="solid">
                  Back to the front
                </Btn>
                <Btn href={ROUTES.contact}>Tell us what broke</Btn>
              </div>
            </div>

            <div className="fault-read">
              <Label>Requested</Label>
              <RequestedPath />
              <Label>Status · 404 · not found</Label>
            </div>
          </div>

          <div className="fault-foot">
            <Label>No data was written</Label>
            <Label>No session was lost</Label>
            <Label>{ROUTE_INDEX.length} routes exist</Label>
          </div>
        </div>

        {/* The recovery. Search-and-recover executed without a search box,
            which for fourteen routes is the better instrument. */}
        <div className="fault-index">
          <Marker label={`${ROUTE_INDEX.length} routes`} note="Every page on this site" />
          <Index>
            {ROUTE_INDEX.map(([href, title, note], i) => (
              <IndexRow
                key={href}
                href={href}
                id={<Label>{String(i + 1).padStart(2, '0')}</Label>}
                title={title}
                note={note}
              />
            ))}
          </Index>
        </div>

        <div style={{ marginTop: 'var(--s8)' }}>
          <Degrade
            items={[
              ['What buffers', 'Nothing was in flight. A missing route writes no state.'],
              ['What replays', 'Follow any route above; the site is static and always ready.'],
              [
                'What you still see',
                'Every page on this site, listed in full, with no search box to guess at.',
              ],
            ]}
          />
        </div>
      </div>
    </section>
  )
}
