import type { MetadataRoute } from 'next'

import { ARTICLES } from '@/data/insights'
import { CASES } from '@/data/work'
import { PRACTICES } from '@/data/practices'
import { COMPANY } from '@/lib/site'
import { ROUTES, canonical } from '@/lib/routes'

/** Required by `output: 'export'` — the sitemap is generated once, at build. */
export const dynamic = 'force-static'

/**
 * Every route this site prerenders, from the same table the links come from —
 * design.md, Routes and output. A path is never typed twice.
 */
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
