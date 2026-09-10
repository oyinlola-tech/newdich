/**
 * The Institute gallery.
 *
 * These are Newdich's own photographs of its own school, taken from
 * https://newdich.tech/institute on 2026-09-10 and re-encoded for the web.
 * design.md bans **stock** photography; a company's own record of its own
 * classroom is evidence, not decoration, and it is the one place on this site
 * where a photograph tells you something a drawing cannot.
 *
 * Dimensions are the real intrinsic sizes of the files in `public/gallery/`.
 * They ship on every <img> so the filmstrip reserves the right box before the
 * image arrives and the row never jumps.
 */

export type Shot = {
  file: string
  w: number
  h: number
  /** What the picture is, for a screen reader and for search. */
  alt: string
  group: 'Teaching' | 'Graduation' | 'People'
  caption: string
  note: string
}

export const SHOTS: Shot[] = [
  {
    file: 'lecture3.jpg',
    w: 1008,
    h: 756,
    alt: 'A Newdich Technology Institute class in session, students at workstations facing an instructor.',
    group: 'Teaching',
    caption: 'A class in session',
    note: 'Okitipupa · practical track',
  },
  {
    file: 'lecture1.jpg',
    w: 756,
    h: 1008,
    alt: 'An instructor working through a problem with a student at the Institute.',
    group: 'Teaching',
    caption: 'One-to-one review',
    note: 'Project mentorship',
  },
  {
    file: 'lecture4.jpg',
    w: 1008,
    h: 756,
    alt: 'Students at the Institute working on laptops during a training session.',
    group: 'Teaching',
    caption: 'Cohort at work',
    note: 'Hands-on · industry-led',
  },
  {
    file: 'lecture2.jpg',
    w: 735,
    h: 731,
    alt: 'A teaching session at the Newdich Technology Institute.',
    group: 'Teaching',
    caption: 'Teaching floor',
    note: 'Six certification tracks',
  },
  {
    file: 'lecture5.jpg',
    w: 1008,
    h: 756,
    alt: 'A full classroom at the Newdich Technology Institute during training.',
    group: 'Teaching',
    caption: 'Full room',
    note: 'Bootcamp format',
  },
  {
    file: 'grad1.jpg',
    w: 922,
    h: 1100,
    alt: 'A Newdich Technology Institute graduate at the certification ceremony.',
    group: 'Graduation',
    caption: 'Certification day',
    note: 'Graduating cohort',
  },
  {
    file: 'grad2.jpg',
    w: 801,
    h: 1100,
    alt: 'Graduates of the Newdich Technology Institute at their ceremony.',
    group: 'Graduation',
    caption: 'Graduates',
    note: '1,200+ to date',
  },
  {
    file: 'grad3.jpg',
    w: 825,
    h: 1100,
    alt: 'A graduate receiving their Newdich Technology Institute certificate.',
    group: 'Graduation',
    caption: 'Receiving the certificate',
    note: 'Assessed track',
  },
  {
    file: 'grad4.jpg',
    w: 738,
    h: 1100,
    alt: 'Newdich Technology Institute graduates photographed after the ceremony.',
    group: 'Graduation',
    caption: 'After the ceremony',
    note: '80% placement rate',
  },
  {
    file: 'dir2.jpg',
    w: 1033,
    h: 1100,
    alt: 'Samuel Idebi, founder of Newdich Technology and author of the Ansofra framework.',
    group: 'People',
    caption: 'Samuel Idebi',
    note: 'Founder · Tech consultant',
  },
  {
    file: 'silas.jpg',
    w: 1058,
    h: 1100,
    alt: 'Silas Ikusaanu, full-stack and cybersecurity instructor at the Institute.',
    group: 'People',
    caption: 'Silas Ikusaanu',
    note: 'Fullstack · Cybersecurity · Data',
  },
  {
    /**
     * The source page serves this file as `olu.jpg` but repeats the previous
     * image's alt text on it, so the two disagree about who it is. The
     * filename points at Olumide David; the alt points at Silas Ikusaanu.
     * Rather than pick one and publish a real person under the wrong name, the
     * card states the role and leaves the name to be confirmed — see the
     * README, "Placeholders to confirm".
     */
    file: 'olu.jpg',
    w: 588,
    h: 568,
    alt: 'An instructor at the Newdich Technology Institute.',
    group: 'People',
    caption: 'Olumide David',
    note: 'Fullstack · Data · DevOps',
  },
]

export const GROUPS = ['Teaching', 'Graduation', 'People'] as const

export const shotUrl = (file: string) => `/gallery/${file}`
