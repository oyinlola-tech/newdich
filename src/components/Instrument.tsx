/**
 * The page instrument — design.md, Overview.
 *
 * Every system page opens with the running instrument for its own subject; the
 * headline comes second. The side column and the rails are built from that
 * page's own real content — the case's facts, the practice's stack — never
 * from figures invented to fill the panel.
 *
 * An instrument that has no reading does not ship, which is why company pages
 * call PageSpec instead.
 */

import type { ReactNode } from 'react'

import { Art, type ArtKey } from '@/lib/art'
import { Clock } from '@/components/Clock'
import { Dot, Label } from '@/components/ui'

export function Instrument({
  art,
  label,
  status = 'Live',
  spec,
  foot,
  held,
}: {
  art: ArtKey
  label: string
  status?: string
  spec: Array<[string, ReactNode]>
  foot?: string[]
  held?: boolean
}) {
  return (
    <figure className="instrument">
      <div className="instrument-bar">
        <Label>{label}</Label>
        <Label accent={!held}>
          <Dot held={held} />
          {status}
        </Label>
        <Clock />
      </div>

      <div className="instrument-body">
        <div className="instrument-art">
          <Art name={art} />
        </div>
        <dl className="instrument-spec">
          {spec.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {foot && foot.length > 0 ? (
        <figcaption className="instrument-foot">
          {foot.map((f) => (
            <Label key={f}>{f}</Label>
          ))}
        </figcaption>
      ) : null}
    </figure>
  )
}
