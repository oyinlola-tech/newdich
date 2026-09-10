import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CASES, CASE_BY_SLUG } from '@/data/work'
import { PRACTICE_BY_SLUG } from '@/data/practices'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { JsonLd, breadcrumbs } from '@/components/JsonLd'
import { Instrument } from '@/components/Instrument'
import { PageHero } from '@/components/PageHero'
import {
  Btn,
  Facts,
  Glyph,
  Index,
  IndexRow,
  Kv,
  Label,
  Marker,
  Spec,
} from '@/components/ui'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return CASES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const c = CASE_BY_SLUG[slug]
  if (!c) return {}
  return pageMeta({ title: c.title, description: c.summary, path: c.url })
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const c = CASE_BY_SLUG[slug]
  if (!c) notFound()

  const practices = c.practices.map((s) => PRACTICE_BY_SLUG[s]).filter((p) => p !== undefined)
  const others = CASES.filter((o) => o.slug !== c.slug).slice(0, 3)

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          ['Home', ROUTES.home],
          ['Work', ROUTES.work],
          [c.title, c.url],
        ])}
      />

      <PageHero
        trail={[['/', 'Home'], ['/work', 'Work'], [null, c.title]]}
        label={`Case · ${c.sector}`}
        title={c.title}
        lede={c.summary}
      >
        <Instrument
          art={c.art}
          label={`${c.sector} · reference build`}
          spec={c.facts.map(([k, v]) => [k, v])}
          foot={c.build.slice(0, 3)}
        />
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="rack rack--8-4">
            <div className="stack-lg">
              <div>
                <Marker label="The problem" />
                {c.problem.map((para) => (
                  <p className="copy" key={para.slice(0, 24)} style={{ marginTop: 'var(--s4)' }}>
                    {para}
                  </p>
                ))}
              </div>
              <div>
                <Marker label="The approach" />
                {c.approach.map((para) => (
                  <p className="copy" key={para.slice(0, 24)} style={{ marginTop: 'var(--s4)' }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="panel">
              <header className="panel-head">
                <Label>Facts</Label>
              </header>
              <Spec rows={c.facts.map(([k, v]) => [k, v])} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="rack rack--4-8">
            <div>
              <h2>What we built.</h2>
              <p className="copy" style={{ marginTop: 'var(--s4)' }}>
                {c.result}
              </p>
            </div>
            <div className="panel">
              <header className="panel-head">
                <Label>{c.build.length} components</Label>
              </header>
              <Facts items={c.build} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="rack rack--8-4">
            <div>
              <Marker label="The stack" note="What it actually runs on" />
              <Kv rows={c.stack.map(([k, v]) => [k, v])} />
            </div>
            <div className="panel">
              <header className="panel-head">
                <Label>Practices involved</Label>
              </header>
              <div className="stack">
                {practices.map((p) => (
                  <Link className="index-row" href={p.url} key={p.slug} style={{ padding: 'var(--s3) 0' }}>
                    <div className="index-id">
                      <Glyph cells={p.glyph} size="sm" />
                    </div>
                    <div className="index-main">
                      <span className="index-title" style={{ fontSize: '1rem' }}>
                        {p.title}
                      </span>
                    </div>
                    <div className="index-aside" />
                  </Link>
                ))}
              </div>
              <footer className="panel-foot">
                <Btn href="/services" kind="ghost" small>
                  All practices
                </Btn>
              </footer>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label="Other systems" note={`${others.length} more`} />
          <Index>
            {others.map((o, i) => (
              <IndexRow
                key={o.slug}
                href={o.url}
                id={<Label>{String(i + 1).padStart(2, '0')}</Label>}
                title={o.title}
                note={o.summary}
                aside={<Label>{o.sector}</Label>}
              />
            ))}
          </Index>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
