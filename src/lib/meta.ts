import type { Metadata } from 'next'

import { COMPANY } from '@/lib/site'
import { canonical } from '@/lib/routes'


export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title: string
  description: string
  path: string
  
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
