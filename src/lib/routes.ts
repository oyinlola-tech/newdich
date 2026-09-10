/**
 * The route table.
 *
 * Next's App Router resolves URLs from `src/app`, but a path that appears in a
 * link, a sitemap entry or a breadcrumb is decided here and nowhere else. A
 * literal string like "/services/cybersecurity" should never be typed twice.
 */

export const ROUTES = {
  home: '/',
  services: '/services',
  work: '/work',
  platforms: '/platforms',
  ansofra: '/platforms/ansofra',
  lan: '/platforms/newdich-lan',
  institute: '/institute',
  gallery: '/gallery',
  about: '/about',
  process: '/process',
  careers: '/careers',
  insights: '/insights',
  faq: '/faq',
  contact: '/contact',
  privacy: '/privacy',
} as const

export type RouteKey = keyof typeof ROUTES

/**
 * Practice slugs are short internal identifiers; their URL segments are spelled
 * out, because a URL is read by people and by search engines.
 */
export const PRACTICE_SEGMENTS = {
  software: 'software-engineering',
  iot: 'iot-robotics',
  security: 'cybersecurity',
  web3: 'blockchain-web3',
  ai: 'artificial-intelligence',
  data: 'data-science',
  games: 'game-development',
} as const

export type PracticeSlug = keyof typeof PRACTICE_SEGMENTS
export type PracticeSegment = (typeof PRACTICE_SEGMENTS)[PracticeSlug]

const SEGMENT_TO_SLUG = Object.fromEntries(
  Object.entries(PRACTICE_SEGMENTS).map(([slug, segment]) => [segment, slug]),
) as Record<PracticeSegment, PracticeSlug>

export const practiceUrl = (slug: PracticeSlug) => `/services/${PRACTICE_SEGMENTS[slug]}`
export const caseUrl = (slug: string) => `/work/${slug}`
export const articleUrl = (slug: string) => `/insights/${slug}`

export function practiceSlugFromSegment(segment: string): PracticeSlug | null {
  return SEGMENT_TO_SLUG[segment as PracticeSegment] ?? null
}

/**
 * The absolute URL for canonicals and the sitemap.
 *
 * `trailingSlash: true` in next.config.ts means every route is served as a
 * directory, so the canonical has to carry the slash too — otherwise the page
 * declares a canonical the host will redirect away from.
 */
export function canonical(domain: string, path: string): string {
  const withSlash = path.endsWith('/') ? path : `${path}/`
  return `${domain}${withSlash}`
}
