/**
 * The capability matrix — seven practices by five sectors, filled only where
 * work has shipped.
 *
 * design.md, Components: the empty cells are the credibility. They are the
 * reason a buyer believes the filled ones, so nothing here rounds a gap up.
 * A real <table> with scope, readable cell by cell by a screen reader.
 */

import Link from 'next/link'

import {
  MATRIX,
  MATRIX_FILLED,
  MATRIX_TOTAL,
  PRACTICE_BY_SLUG,
  SECTOR_COLUMNS,
} from '@/data/practices'
import { Glyph, Label } from '@/components/ui'

export function Matrix() {
  return (
    <>
      <div className="matrix-wrap">
        <table className="matrix">
          <caption>
            Shipped work · {MATRIX_FILLED} of {MATRIX_TOTAL} cells
          </caption>
          <thead>
            <tr>
              <th scope="col">Practice</th>
              {SECTOR_COLUMNS.map((s) => (
                <th scope="col" key={s}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX.map(([slug, cells]) => {
              const practice = PRACTICE_BY_SLUG[slug]
              if (!practice) return null
              return (
                <tr key={slug}>
                  <th scope="row">
                    <Link href={practice.url}>
                      <Glyph cells={practice.glyph} size="sm" />
                      {practice.title}
                    </Link>
                  </th>
                  {cells.map((on, i) => (
                    <td key={SECTOR_COLUMNS[i]}>
                      <span className={on ? 'cell' : 'cell cell--empty'} aria-hidden="true" />
                      <span className="sr">
                        {practice.title} · {SECTOR_COLUMNS[i]} ·{' '}
                        {on ? 'shipped' : 'not yet'}
                      </span>
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="matrix-key">
        <span>
          <span className="cell" aria-hidden="true" />
          <Label>Shipped</Label>
        </span>
        <span>
          <span className="cell cell--empty" aria-hidden="true" />
          <Label>Not yet</Label>
        </span>
      </div>
      <p className="small matrix-hint">
        The gaps are the point. A matrix with every cell filled is a brochure;
        this one says where we would be the wrong team.
      </p>
    </>
  )
}
