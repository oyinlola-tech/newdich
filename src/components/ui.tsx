/**
 * The four structures — panel, rack, index, spec — and the small parts they
 * are built from. design.md, Layout: cards as a uniform repeating grid unit do
 * not exist in this system, so there is no Card here to import.
 */

import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'

/* --- the mark's atom ------------------------------------------------------ */

/**
 * The module: which cells of the mark's 2x2 are lit. The same construction
 * every time, a different facet lit each time.
 */
export function Glyph({ cells, size }: { cells: number[]; size?: 'sm' | 'lg' }) {
  const cls = size ? `glyph glyph--${size}` : 'glyph'
  return (
    <span className={cls} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <i key={i} className={cells.includes(i) ? 'on' : undefined} />
      ))}
    </span>
  )
}

/**
 * A status mark. There is no spare colour for state, so state is form: solid
 * means running, hollow means held. The word always travels with it.
 */
export function Dot({ held }: { held?: boolean }) {
  return <span className={held ? 'dot dot--held' : 'dot'} aria-hidden="true" />
}

export function Label({
  children,
  accent,
  className,
}: {
  children: ReactNode
  accent?: boolean
  className?: string
}) {
  return (
    <span className={['label', accent ? 'label--accent' : '', className ?? ''].join(' ').trim()}>
      {children}
    </span>
  )
}

export function Pill({
  children,
  state,
}: {
  children: ReactNode
  state?: 'live' | 'held' | 'accent'
}) {
  return (
    <span className={state ? `pill pill--${state}` : 'pill'}>
      {state === 'live' ? <Dot /> : null}
      {state === 'held' ? <Dot held /> : null}
      {children}
    </span>
  )
}

const ArrowGlyph = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path d="M3 8h9M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Arrow({ children }: { children: ReactNode }) {
  return (
    <span className="arrow">
      {children}
      <ArrowGlyph />
    </span>
  )
}

/* --- buttons -------------------------------------------------------------- */

export function Btn({
  href,
  children,
  kind = 'line',
  small,
  block,
  external,
}: {
  href: string
  children: ReactNode
  kind?: 'solid' | 'line' | 'ghost'
  small?: boolean
  block?: boolean
  external?: boolean
}) {
  const cls = [
    'btn',
    `btn--${kind}`,
    small ? 'btn--sm' : '',
    block ? 'btn--block' : '',
  ]
    .join(' ')
    .trim()
  const body = (
    <>
      {children}
      <ArrowGlyph />
    </>
  )
  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer noopener">
        {body}
      </a>
    )
  }
  return (
    <Link className={cls} href={href}>
      {body}
    </Link>
  )
}

/* --- panel ---------------------------------------------------------------- */

/** The only container. Header rail (mono label left, status right), body. */
export function Panel({
  label,
  status,
  children,
  foot,
  className,
}: {
  label?: ReactNode
  status?: ReactNode
  children: ReactNode
  foot?: ReactNode
  className?: string
}) {
  return (
    <section className={['panel', className ?? ''].join(' ').trim()}>
      {label || status ? (
        <header className="panel-head">
          {label ? <Label>{label}</Label> : <span />}
          {status ?? null}
        </header>
      ) : null}
      {children}
      {foot ? <footer className="panel-foot">{foot}</footer> : null}
    </section>
  )
}

export function Well({ children }: { children: ReactNode }) {
  return <div className="well">{children}</div>
}

export function Callout({ children }: { children: ReactNode }) {
  return <div className="callout">{children}</div>
}

/* --- section furniture ---------------------------------------------------- */

/** A label, a rule, and a data note on the right. Labels carry data. */
export function Marker({ label, note }: { label: ReactNode; note?: ReactNode }) {
  return (
    <div className="marker">
      <Label>{label}</Label>
      {note ? <Label className="marker-note">{note}</Label> : null}
    </div>
  )
}

export function SectionHead({ title, copy }: { title: ReactNode; copy?: ReactNode }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {copy ? <p className="copy">{copy}</p> : null}
    </div>
  )
}

/* --- index ---------------------------------------------------------------- */

/**
 * A list of twelve things is an index, not twelve cards: full-width
 * hairline-ruled rows with a left identifier column.
 */
export function Index({ children }: { children: ReactNode }) {
  return <div className="index">{children}</div>
}

export function IndexRow({
  href,
  id,
  title,
  note,
  aside,
}: {
  href?: string
  id: ReactNode
  title: ReactNode
  note?: ReactNode
  aside?: ReactNode
}) {
  const inner = (
    <>
      <div className="index-id">{id}</div>
      <div className="index-main">
        <span className="index-title">{title}</span>
        {note ? <span className="index-note">{note}</span> : null}
      </div>
      <div className="index-aside">{aside ?? (href ? <Arrow>{''}</Arrow> : null)}</div>
    </>
  )
  if (!href) return <div className="index-row">{inner}</div>
  return (
    <Link className="index-row" href={href}>
      {inner}
    </Link>
  )
}

/* --- spec ----------------------------------------------------------------- */

/** A two-column label/value table for facts. A real table, with scope. */
export function Spec({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <table className="spec">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th scope="row">{k}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function Kv({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <div className="kv">
      {rows.map(([k, v]) => (
        <div key={k}>
          <b>{k}</b>
          <span>{v}</span>
        </div>
      ))}
    </div>
  )
}

export function Stats({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="stats">
      {items.map(([figure, name]) => (
        <div key={name}>
          <b>{figure}</b>
          <span>{name}</span>
        </div>
      ))}
    </div>
  )
}

/** Fact lists — the module is the bullet. */
export function Facts({ items }: { items: ReactNode[] }) {
  return (
    <ul className="facts">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

/** Numbered because the steps are an actual sequence. */
export function Steps({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="steps">
      {items.map(([title, note], i) => (
        <div className="step" key={title}>
          <div className="step-no">{String(i + 1).padStart(2, '0')}</div>
          <div>
            <h3>{title}</h3>
            <p>{note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Native <details>, so the FAQ needs no JavaScript. */
export function Faq({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="faq">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <div className="answer">{a}</div>
        </details>
      ))}
    </div>
  )
}

/**
 * The degradation strip — what happens when power or network fails. It is the
 * differentiator, so it gets a fixed place in the layout.
 */
export function Degrade({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="degrade">
      <div className="degrade-head">
        <Dot />
        <Label accent>When the power or the network goes</Label>
      </div>
      {items.map(([k, v]) => (
        <div key={k}>
          <b>{k}</b>
          <span>{v}</span>
        </div>
      ))}
    </div>
  )
}

export function Breadcrumbs({ trail }: { trail: Array<[string, string] | [null, string]> }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {trail.map(([href, text], i) => (
        <Fragment key={text}>
          {i > 0 ? <span aria-hidden="true">/</span> : null}
          {href ? <Link href={href}>{text}</Link> : <span aria-current="page">{text}</span>}
        </Fragment>
      ))}
    </nav>
  )
}

export function Person({
  name,
  initials,
  role,
  note,
}: {
  name: string
  initials: string
  role: string
  note: string
}) {
  return (
    <div className="tile person">
      <span className="avatar" aria-hidden="true">
        {initials}
      </span>
      <div>
        <h3>{name}</h3>
        <p className="role">{role}</p>
        <p>{note}</p>
      </div>
    </div>
  )
}

export function Code({ caption, code }: { caption: string; code: string }) {
  return (
    <div className="code">
      <div className="code-bar">
        <Label>{caption}</Label>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
