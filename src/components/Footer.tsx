/**
 * The footer — design.md, Footer.
 *
 * Large type over grid, dark, flat. footer.design's other house styles —
 * cards, illustration — are banned elsewhere in this system and do not get an
 * exemption at the bottom of the page.
 *
 * Four rails: a status reading, the sitemap beside the direct channels, the
 * wordmark, and the legal line. It is also this site's no-JavaScript
 * navigation, which is why every link in it is a plain anchor.
 */

import Link from 'next/link'

import { COMPANY, PHONE_DISPLAY, SOCIALS } from '@/lib/site'
import { FOOTER_LINKS } from '@/lib/nav'
import { ROUTES } from '@/lib/routes'
import { Clock } from '@/components/Clock'
import { FooterGroup } from '@/components/FooterGroup'
import { Dot, Label } from '@/components/ui'
import { Wordmark } from '@/components/Wordmark'

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        {/* 1 · the status rail. A footer that opens with a reading is
            consistent with a site that opens every page with one. */}
        <div className="foot-status">
          <Label accent>
            <Dot />
            Live
          </Label>
          {COMPANY.offices.map((o) => (
            <Label key={o.city}>
              {o.city} · {o.region}
            </Label>
          ))}
          <Clock />
        </div>

        {/* 2 · the sitemap, and the direct channels beside it */}
        <div className="foot-main">
          <nav className="foot-map" aria-label="Sitemap">
            {FOOTER_LINKS.map((group) => (
              <FooterGroup key={group.name} name={group.name} links={group.links} />
            ))}
          </nav>

          <div className="foot-direct">
            <Label>Direct</Label>
            <a className="foot-line" href={`mailto:${COMPANY.email}`}>
              {COMPANY.email}
            </a>
            <a className="foot-line" href={`tel:${COMPANY.phone}`}>
              {PHONE_DISPLAY}
            </a>
            <a
              className="foot-line"
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
            >
              WhatsApp
            </a>
            <Label accent>We reply within 24 hours.</Label>
            <Link className="btn btn--line btn--sm" href={ROUTES.contact}>
              Start a project
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M3 8h9M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 3 · the wordmark. Used once, --line coloured: a nameplate stamped
            into the enclosure, not a headline. */}
        <div className="foot-mark">
          <Wordmark text="NEWDICH" />
        </div>

        {/* 4 · the legal rail */}
        <div className="foot-legal">
          <Label>
            © {COMPANY.founded}–2026 {COMPANY.name}
          </Label>
          <Link className="label" href={ROUTES.privacy}>
            Privacy
          </Link>
          <div className="foot-socials">
            {SOCIALS.map((s) => (
              <a
                className="label"
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
