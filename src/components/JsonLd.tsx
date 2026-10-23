

import { COMPANY } from '@/lib/site'
import { canonical } from '@/lib/routes'


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
