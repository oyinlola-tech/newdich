import type { NextConfig } from 'next'

/**
 * Static export. Every route is prerendered to HTML at build time, so the
 * output in `out/` deploys to any static host — the same deployment story the
 * site has always had, now with a real router in front of it.
 *
 * `trailingSlash` makes each route a directory with an index.html inside it,
 * which is what lets a host resolve `/faq` without an extension.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
}

export default nextConfig
