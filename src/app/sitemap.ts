import type { MetadataRoute } from 'next'

import { ARTICLES } from '@/data/insights'
import { CASES } from '@/data/work'
import { PRACTICES } from '@/data/practices'
import { COMPANY } from '@/lib/site'
import { ROUTES, canonical } from '@/lib/routes'


export const dynamic = 'force-static'


export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...Object.values(ROUTES),
    ...PRACTICES.map((p) => p.url),
    ...CASES.map((c) => c.url),
    ...ARTICLES.map((a) => a.url),
  ]

  return paths.map((path) => ({
    url: canonical(COMPANY.domain, path),
    lastModified: new Date('2026-09-10'),
    changeFrequency: path === ROUTES.home ? 'weekly' : 'monthly',
    priority: path === ROUTES.home ? 1 : 0.7,
  }))
}
