/**
 * Navigation and the footer sitemap — design.md, Navigation and Footer.
 *
 * A "menu" entry renders a mega panel on desktop and a grouped block in the
 * full-screen drawer; every child is a real link, so the nav degrades to a
 * plain list of links with JavaScript off.
 *
 * Notes on children carry data — the sector, the shape, the coverage — never a
 * category word. design.md bans `WHAT WE DO` and its relatives.
 */

import { CASES } from '@/data/work'
import { PRACTICES } from '@/data/practices'
import { ROUTES } from '@/lib/routes'

export type NavChild = {
  href: string
  title: string
  note: string
  glyph: number[]
  key: string
}

export type NavItem =
  | { type: 'link'; key: string; label: string; href: string }
  | {
      type: 'menu'
      key: string
      label: string
      href: string
      note: string
      children: NavChild[]
      footer: { href: string; text: string }
      align?: 'right'
    }

export const NAV: NavItem[] = [
  {
    type: 'menu',
    key: 'services',
    label: 'Services',
    href: ROUTES.services,
    note: 'Seven practices, one construction',
    children: PRACTICES.map((p) => ({
      href: p.url,
      title: p.title,
      note: p.blurb,
      glyph: p.glyph,
      key: p.slug,
    })),
    footer: { href: ROUTES.services, text: 'All seven practices' },
  },
  {
    type: 'menu',
    key: 'work',
    label: 'Work',
    href: ROUTES.work,
    note: 'Systems in production',
    children: CASES.map((c, i) => ({
      href: c.url,
      title: c.title,
      note: c.sector,
      glyph: [i % 4],
      key: c.slug,
    })),
    footer: { href: ROUTES.work, text: 'Every case study' },
  },
  {
    type: 'menu',
    key: 'platforms',
    label: 'Platforms',
    href: ROUTES.platforms,
    note: 'What we own and publish',
    children: [
      {
        href: ROUTES.lan,
        title: 'Newdich LAN',
        note: 'Our own internet business: protected territories, 300 m to 3 km',
        glyph: [0, 1],
        key: 'lan',
      },
      {
        href: ROUTES.ansofra,
        title: 'Ansofra',
        note: 'The CQRS framework we publish on Packagist, MIT licensed',
        glyph: [2],
        key: 'ansofra',
      },
      {
        href: ROUTES.platforms,
        title: 'Platforms & products',
        note: 'The App Store and the library we deploy from',
        glyph: [3],
        key: 'platforms',
      },
    ],
    footer: { href: ROUTES.platforms, text: 'Everything we publish' },
  },
  {
    type: 'menu',
    key: 'institute',
    label: 'Institute',
    href: ROUTES.institute,
    note: 'Six tracks, 1,200+ graduates',
    children: [
      {
        href: ROUTES.institute,
        title: 'The Institute',
        note: 'Six certification tracks, taught by working engineers',
        glyph: [0, 3],
        key: 'institute',
      },
      {
        href: ROUTES.gallery,
        title: 'Gallery',
        note: 'The school photographed: teaching, graduation, people',
        glyph: [1, 2],
        key: 'gallery',
      },
    ],
    footer: { href: ROUTES.institute, text: 'Tracks and enrolment' },
  },
  {
    type: 'menu',
    key: 'company',
    label: 'Company',
    href: ROUTES.about,
    note: 'Who we are and how we work',
    align: 'right',
    children: [
      {
        href: ROUTES.about,
        title: 'About',
        note: 'Twelve years, two offices, seven practices',
        glyph: [0],
        key: 'about',
      },
      {
        href: ROUTES.process,
        title: 'How we work',
        note: 'Map, design, slice, harden, ship, hand over',
        glyph: [1],
        key: 'process',
      },
      {
        href: ROUTES.insights,
        title: 'Insights',
        note: 'Writing from the practice',
        glyph: [2],
        key: 'insights',
      },
      {
        href: ROUTES.careers,
        title: 'Careers',
        note: 'Open roles and how we hire',
        glyph: [3],
        key: 'careers',
      },
      {
        href: ROUTES.faq,
        title: 'FAQ',
        note: 'The questions clients ask first',
        glyph: [0, 3],
        key: 'faq',
      },
      {
        href: ROUTES.contact,
        title: 'Contact',
        note: 'Two offices, one form, 24-hour reply',
        glyph: [1, 2],
        key: 'contact',
      },
    ],
    footer: { href: ROUTES.contact, text: 'Talk to us' },
  },
]

export const FOOTER_LINKS: Array<{ name: string; links: Array<[string, string]> }> = [
  {
    name: 'Services',
    links: [
      ...PRACTICES.map((p) => [p.url, p.title] as [string, string]),
      [ROUTES.services, 'All services'],
    ],
  },
  {
    name: 'Work',
    links: [
      ...CASES.slice(0, 5).map(
        (c) => [c.url, c.title.split(' and ')[0] ?? c.title] as [string, string],
      ),
      [ROUTES.work, 'All case studies'],
    ],
  },
  {
    name: 'Platforms',
    links: [
      [ROUTES.platforms, 'Platforms & products'],
      [ROUTES.lan, 'Newdich LAN'],
      [ROUTES.ansofra, 'Ansofra framework'],
      [ROUTES.institute, 'Institute'],
      [ROUTES.gallery, 'Gallery'],
      [ROUTES.insights, 'Insights'],
    ],
  },
  {
    name: 'Company',
    links: [
      [ROUTES.about, 'About'],
      [ROUTES.process, 'How we work'],
      [ROUTES.careers, 'Careers'],
      [ROUTES.faq, 'FAQ'],
      [ROUTES.contact, 'Contact'],
      [ROUTES.privacy, 'Privacy'],
    ],
  },
]

/**
 * The 404's recovery index — design.md, Error pages. Every top-level route with
 * its own one-line note, so a visitor lands on what they were reaching for
 * rather than on the front door.
 */
export const ROUTE_INDEX: Array<[string, string, string]> = [
  [ROUTES.home, 'Home', 'The capability matrix and what runs in production'],
  [ROUTES.services, 'Services', 'Seven engineering practices and the cloud under them'],
  [ROUTES.work, 'Work', 'Six systems, and the engineering decisions behind each'],
  [ROUTES.platforms, 'Platforms', 'The App Store and the product library'],
  [ROUTES.lan, 'Newdich LAN', 'Protected territories from 300 m to 3 km'],
  [ROUTES.ansofra, 'Ansofra', 'The CQRS PHP framework, MIT on Packagist'],
  [ROUTES.institute, 'Institute', 'Six tracks, 1,200+ graduates, since 2014'],
  [ROUTES.gallery, 'Gallery', 'The school photographed: teaching, graduation, people'],
  [ROUTES.about, 'About', 'Twelve years, two offices, four values'],
  [ROUTES.process, 'How we work', 'Map, design, slice, harden, ship, hand over'],
  [ROUTES.insights, 'Insights', 'Writing from the practice'],
  [ROUTES.careers, 'Careers', 'Open roles and how we hire'],
  [ROUTES.faq, 'FAQ', 'The questions clients ask first'],
  [ROUTES.contact, 'Contact', 'Two offices, one form, 24-hour reply'],
  [ROUTES.privacy, 'Privacy', 'What we collect and what we do not'],
]
