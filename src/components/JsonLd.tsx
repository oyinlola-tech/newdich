/**
 * Structured data.
 *
 * One component, so every schema on the site is serialised the same way and a
 * page can never ship a half-escaped blob. The payload is authored in this
 * repository — it is never assembled from anything a visitor typed — so
 * setting it as HTML is safe here in a way it would not be for user content.
 */

import { COMPANY } from '@/lib/site'
import { canonical } from '@/lib/routes'

/**
 * `JSON.stringify` escapes for JSON, not for HTML, so the string `</script>`
 * inside any value would close this element and everything after it would be
 * parsed as markup. Nothing on this site puts a visitor's text into structured
 * data today — but "today" is the whole of that guarantee, and the fix is one
 * substitution that costs nothing and cannot be forgotten later. The escapes
 * below are still valid JSON, so a consumer reads exactly the same object.
 */
const jsonForHtml = (data: object) =>
  JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonForHtml(data) }} />
  )
}

/**
 * A BreadcrumbList matching the breadcrumb the page already renders. Search
 * results show the trail instead of a bare URL, and the two can never disagree
 * because both are built from the same route table.
 */
export function breadcrumbs(trail: Array<[string, string]>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: canonical(COMPANY.domain, path),
    })),
  }
}

/** An FAQPage, from the same question and answer pairs the page renders. */
export function faqPage(items: Array<[string, string]>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

/** An Article, for a piece in Insights. */
export function article({
  title,
  description,
  path,
  published,
  author,
  image,
}: {
  title: string
  description: string
  path: string
  published: string
  author: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: published,
    dateModified: published,
    author: { '@type': 'Person', name: author },
    publisher: {
      '@type': 'Organization',
      name: COMPANY.name,
      logo: { '@type': 'ImageObject', url: `${COMPANY.domain}/newdich.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical(COMPANY.domain, path) },
    image: `${COMPANY.domain}${image ?? '/og.png'}`,
  }
}
