import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ARTICLES, ARTICLE_BY_SLUG } from '@/data/insights'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { ArticleBody } from '@/components/ArticleBody'
import { CtaBand } from '@/components/CtaBand'
import { JsonLd, article, breadcrumbs } from '@/components/JsonLd'
import { Breadcrumbs, Label, Marker } from '@/components/ui'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const a = ARTICLE_BY_SLUG[slug]
  if (!a) return {}
  return pageMeta({ title: a.title, description: a.dek, path: a.url })
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const a = ARTICLE_BY_SLUG[slug]
  if (!a) notFound()

  const here = ARTICLES.findIndex((x) => x.slug === a.slug)
  const prev = here > 0 ? ARTICLES[here - 1] : undefined
  const next = here < ARTICLES.length - 1 ? ARTICLES[here + 1] : undefined

  return (
    <>
      <JsonLd
        data={article({
          title: a.title,
          description: a.dek,
          path: a.url,
          published: a.date,
          author: a.author,
        })}
      />
      <JsonLd
        data={breadcrumbs([
          ['Home', ROUTES.home],
          ['Insights', ROUTES.insights],
          [a.title, a.url],
        ])}
      />

      <section className="pagehero">
        <div className="wrap wrap--narrow">
          <Breadcrumbs trail={[['/', 'Home'], ['/insights', 'Insights'], [null, a.title]]} />
          <Label accent>
            {a.tag} · {a.minutes} min read
          </Label>
          <h1 className="display-xl" style={{ marginTop: 'var(--s4)' }}>
            {a.title}
          </h1>
          <p className="lede">{a.dek}</p>
          <div className="meta-row" style={{ marginTop: 'var(--s6)' }}>
            <div>
              <b>{a.displayDate}</b>
              <Label>Published</Label>
            </div>
            <div>
              <b>{a.author}</b>
              <Label>Written by</Label>
            </div>
            <div>
              <b>{a.minutes} min</b>
              <Label>Reading time</Label>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid">
            <div className="span-8">
              <ArticleBody blocks={a.blocks} />
            </div>
            <aside className="span-3 start-10">
              <nav className="toc" aria-label="On this page">
                <Label>On this page</Label>
                {a.headings.map((h) => (
                  <a href={`#${h.id}`} key={h.id}>
                    {h.text}
                  </a>
                ))}
              </nav>
            </aside>
          </div>
        </div>
      </section>

      {prev || next ? (
        <section className="section section--flush-top">
          <div className="wrap">
            <Marker label="More writing" note={`${ARTICLES.length} pieces`} />
            <div className="pager">
              {prev ? (
                <Link href={prev.url}>
                  <Label>Previous</Label>
                  <span className="index-title">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link className="next" href={next.url}>
                  <Label>Next</Label>
                  <span className="index-title">{next.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  )
}
