import type { Metadata } from 'next'

import { COMPANY } from '@/lib/site'
import { canonical } from '@/lib/routes'

/**
 * One place a page's metadata is assembled, so a title, a canonical and an
 * Open Graph card can never drift apart. design.md, Routes and output.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title: string
  description: string
  path: string
  /** A page-specific social card. Falls back to the site card. */
  image?: string
}): Metadata {
  const url = canonical(COMPANY.domain, path)
  const card = `${COMPANY.domain}${image ?? '/og.png'}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: COMPANY.name,
      type: 'website',
      locale: 'en_NG',
      images: [{ url: card, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [card],
    },
  }
}
