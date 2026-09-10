/**
 * Newdich LAN — the local internet business Newdich owns and operates.
 *
 * Everything here was taken from the product itself at https://lanv2.newdich.tech
 * on 2026-09-09: the copy from its own pages, and the package table from its
 * live `/api/getpackages` endpoint. Nothing on this page is invented.
 *
 * Two figures on the LAN site are worked examples rather than results, and it
 * labels them that way itself ("Projected revenue for a single territory",
 * "Example of how commission can grow with customer activity"). They are
 * carried here with the same label — design.md forbids presenting a projection
 * as an outcome.
 *
 * Pricing is set by Newdich LAN and can change. The page says so and links to
 * the live list rather than pretending a static site is the source of truth.
 */

export const SITE = 'https://lanv2.newdich.tech'

export const TAGLINE = 'Launch a fast, reliable internet business in your community.'

export const SUMMARY =
  'Newdich LAN is the local internet business we own and run ourselves. A merchant takes a ' +
  'protected territory, resells internet inside it, and we operate the platform, the billing ' +
  'and the support underneath.'

/** The merchant programme, in its own words. */
export const MERCHANT_STEPS: Array<[string, string]> = [
  [
    'Apply & get verified',
    'Submit your business details. Our team verifies your territory within 24 hours.',
  ],
  [
    'Launch your territory',
    'Receive a branded marketing kit, sales script, and local activation support.',
  ],
  [
    'Grow recurring revenue',
    'Earn weekly payouts while Newdich LAN handles platform operations and support.',
  ],
]

export const MERCHANT_PROMISES: Array<[string, string]> = [
  [
    'Territory protection',
    'A verified territory with no overlap, so two merchants are never sold the same street.',
  ],
  [
    'Marketing support',
    'A branded kit, a sales script and local activation support, rather than a logo and good luck.',
  ],
  ['Fast payouts', 'Settled weekly, with the dashboard showing what is owed and why.'],
]

/** The agent programme. */
export const AGENT_SUMMARY =
  'Agents do not take a territory. They refer buyers with a code and earn commission on ' +
  'eligible plans, which suits campus reps, community promoters and anyone already selling ' +
  'in a neighbourhood.'

export const AGENT_STEPS: Array<[string, string]> = [
  [
    'Register with KYC',
    'Submit your details so the Newdich LAN team can verify your identity and payout account.',
  ],
  [
    'Get approved',
    'Once approved, your dashboard will show your referral code, account balance, and ' +
      'commission rate.',
  ],
  [
    'Track referred buyers',
    'See users who buy data with your code, the plan they bought, and the commission earned.',
  ],
]

export const AGENT_COMMISSION =
  'Agents currently earn about 3% commission on every eligible plan bought through their ' +
  'referral code. This percentage is subject to change by Newdich LAN and may go up or down.'

export const KYC_IDS = ['NIN', 'Driver’s licence', 'International passport', 'Voter’s card']

export const CURRENCIES = [
  'Nigerian naira',
  'Ghanaian cedi',
  'South African rand',
  'US dollar',
]

/**
 * The package table, verbatim from /api/getpackages. Coverage is a radius in
 * metres, population is the users a package is sized for, price is in naira.
 * Every tier is the same rate: NGN 3,650,000 per 300 m of coverage.
 */
export const RATE_PER_STEP = 3_650_000
export const STEP_METRES = 300

export type Package = {
  name: string
  metres: number
  people: number
  naira: number
}

export const PACKAGES: Package[] = [
  { name: 'LAN C300', metres: 300, people: 500, naira: 3_650_000 },
  { name: 'LAN C500', metres: 500, people: 1000, naira: 6_083_330 },
  { name: 'LAN C800', metres: 800, people: 1500, naira: 9_733_330 },
  { name: 'LAN C1KM', metres: 1000, people: 2000, naira: 12_166_700 },
  { name: 'LAN C1.3KM', metres: 1300, people: 2500, naira: 15_816_700 },
  { name: 'LAN C1.5KM', metres: 1500, people: 3000, naira: 18_250_000 },
  { name: 'LAN C1.8KM', metres: 1800, people: 3500, naira: 21_900_000 },
  { name: 'LAN C2KM', metres: 2000, people: 4000, naira: 24_333_300 },
  { name: 'LAN C2.3KM', metres: 2300, people: 4500, naira: 27_983_300 },
  { name: 'LAN C2.5KM', metres: 2500, people: 5000, naira: 30_416_700 },
  { name: 'LAN C2.8KM', metres: 2800, people: 5500, naira: 34_066_700 },
  { name: 'LAN C3KM', metres: 3000, people: 6000, naira: 36_500_000 },
]

/** Worked examples published on the LAN site. Labelled, never presented as results. */
export const MERCHANT_EXAMPLE: Array<[string, string]> = [
  ['Active customers', '128'],
  ['Average ARPU', '₦42,000'],
  ['Weekly payout', '₦5,376,000'],
]

export const AGENT_EXAMPLE: Array<[string, string]> = [
  ['Referral customers', '42'],
  ['Eligible data sales', '₦840,000'],
  ['Estimated commission', '₦25,200'],
]

export const LAN_FAQ: Array<[string, string]> = [
  [
    'What regions can I cover?',
    'We support city-wide, estate, and neighborhood territories based on demand and coverage.',
  ],
  [
    'How soon can I start selling?',
    'Most merchants are onboarded within 1-2 business days after verification.',
  ],
  [
    'Do I need technical expertise?',
    'No. We provide the tools, onboarding, and support. You focus on acquiring customers.',
  ],
]

/** Naira, grouped, no decimals — these are whole-naira package prices. */
export const naira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

export const coverageLabel = (metres: number) =>
  metres < 1000 ? `${metres.toLocaleString('en-NG')} m` : `${(metres / 1000).toFixed(1)} km`
