import { notFound } from 'next/navigation'

import { CASE_BY_SLUG } from '@/data/work'
import { PRACTICES, PRACTICE_BY_SLUG } from '@/data/practices'
import { pageMeta } from '@/lib/meta'
import { PRACTICE_SEGMENTS, ROUTES, practiceSlugFromSegment } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { JsonLd, breadcrumbs } from '@/components/JsonLd'
import { Instrument } from '@/components/Instrument'
import { PageHero } from '@/components/PageHero'
import {
  Btn,
  Faq,
  Facts,
  Glyph,
  Index,
  IndexRow,
  Kv,
  Label,
  Marker,
} from '@/components/ui'

type Params = { practice: string }

export function generateStaticParams(): Params[] {
  return Object.values(PRACTICE_SEGMENTS).map((practice) => ({ practice }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { practice } = await params
  const slug = practiceSlugFromSegment(practice)
  const p = slug ? PRACTICE_BY_SLUG[slug] : undefined
  if (!p) return {}
  return pageMeta({ title: p.title, description: p.blurb, path: p.url })
}

export default async function PracticePage({ params }: { params: Promise<Params> }) {
  const { practice } = await params
  const slug = practiceSlugFromSegment(practice)
  const p = slug ? PRACTICE_BY_SLUG[slug] : undefined
  if (!p) notFound()

  const related = p.cases.map((s) => CASE_BY_SLUG[s]).filter((c) => c !== undefined)
  const others = PRACTICES.filter((o) => o.slug !== p.slug)

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          ['Home', ROUTES.home],
          ['Services', ROUTES.services],
          [p.title, p.url],
        ])}
      />

      <PageHero
        trail={[['/', 'Home'], ['/services', 'Services'], [null, p.title]]}
        label={`Practice · ${p.short}`}
        title={p.title}
        lede={p.lede}
        actions={
          <>
            <Btn href="/contact" kind="solid">
              Talk about {p.short.toLowerCase()}
            </Btn>
            <Btn href="/work">Related work</Btn>
          </>
        }
      >
        <Instrument
          art={p.art}
          label={`${p.title} · reference build`}
          spec={p.stack.map(([k, v]) => [k, v])}
          foot={p.deliverables.slice(0, 3)}
        />
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="rack rack--8-4">
            <div>
              <Marker label="What it includes" note={`${p.includes.length} lines of work`} />
              <Facts items={p.includes} />
            </div>
            <div className="panel">
              <header className="panel-head">
                <Label>The stack</Label>
                <Glyph cells={p.glyph} size="sm" />
              </header>
              <Kv rows={p.stack.map(([k, v]) => [k, v])} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label="What you get" note="Deliverables, not status reports" />
          <Facts items={p.deliverables} />
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section">
          <div className="wrap">
            <Marker label="Related work" note={`${related.length} in production`} />
            <Index>
              {related.map((c, i) => (
                <IndexRow
                  key={c.slug}
                  href={c.url}
                  id={<Label>{String(i + 1).padStart(2, '0')}</Label>}
                  title={c.title}
                  note={c.summary}
                  aside={<Label>{c.sector}</Label>}
                />
              ))}
            </Index>
          </div>
        </section>
      ) : null}

      <section className="section section--alt">
        <div className="wrap">
          <Marker label="Questions we get" note="Answered plainly" />
          <Faq items={p.questions.map(([q, a]) => [q, a])} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Marker label="The other six" note="Same construction, different facet" />
          <Index>
            {others.map((o) => (
              <IndexRow
                key={o.slug}
                href={o.url}
                id={
                  <>
                    <Glyph cells={o.glyph} size="sm" />
                    <Label>{o.short}</Label>
                  </>
                }
                title={o.title}
                note={o.blurb}
              />
            ))}
          </Index>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
