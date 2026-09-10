/**
 * The seven engineering practices, in the order the company lists them.
 *
 * `glyph` is which cells of the mark's 2x2 module are lit for this practice —
 * the same construction every time, a different facet lit each time. It is the
 * practice's fingerprint across the whole site, so a visitor who clicks a row
 * in the capability matrix lands on the identifier they clicked.
 */

import { practiceUrl, type PracticeSlug } from '@/lib/routes'
import type { ArtKey } from '@/lib/art'

export type Practice = {
  slug: PracticeSlug
  title: string
  short: string
  glyph: number[]
  blurb: string
  lede: string
  includes: string[]
  stack: Array<[string, string]>
  deliverables: string[]
  art: ArtKey
  questions: Array<[string, string]>
  cases: string[]
  url: string
}

const practice = (p: Omit<Practice, 'url'>): Practice => ({ ...p, url: practiceUrl(p.slug) })

export const PRACTICES: Practice[] = [
  practice({
    slug: 'software',
    title: 'Software Engineering',
    short: 'Software',
    glyph: [0],
    blurb: 'Web, mobile, desktop and APIs, built with modern practice and real tests.',
    lede:
      'Most of what we are asked for starts here: a system that several groups of people ' +
      'depend on, that has to be correct, and that somebody has to run after we hand it over.',
    includes: [
      'Full-stack web platforms and internal tools',
      'Native and cross-platform mobile applications',
      'Desktop builds for Windows, macOS and Linux',
      'REST and GraphQL APIs with written documentation',
      'System design, code review and deployment',
    ],
    stack: [
      ['Languages', 'PHP 8, Python, JavaScript and TypeScript, Java, C#'],
      ['Frameworks', 'Ansofra (our own), Laravel, Django, FastAPI, React, React Native'],
      ['Data', 'PostgreSQL, MySQL, Redis, object storage'],
      ['Delivery', 'Git, CI pipelines with test gates, containerised deploys'],
    ],
    deliverables: [
      'A written system design before any code is merged',
      'An automated test suite that runs on every commit',
      'API documentation your other vendors can build against',
      'A deployment your team can run without us',
    ],
    art: 'architecture',
    questions: [
      [
        'How do you scope a first phase?',
        'We look for the smallest slice that a real user can complete end to end, and build ' +
          'that first. It is the only estimate anyone can trust, and it puts something in front ' +
          'of your users in weeks.',
      ],
      [
        'Will we be locked in to you?',
        'No. The repository, the pipeline and the documentation are yours from day one, and ' +
          'handover is part of the engagement rather than a favour at the end.',
      ],
    ],
    cases: ['smart-metering', 'payments-gateway'],
  }),

  practice({
    slug: 'iot',
    title: 'IoT & Robotics',
    short: 'IoT',
    glyph: [1],
    blurb: 'Edge devices, sensors, telemetry and embedded systems that survive the field.',
    lede:
      'Hardware is where software stops being forgiving. Power fails, networks drop, and the ' +
      'device is three hours away — so the design has to assume all of that on day one.',
    includes: [
      'Embedded firmware and Arduino-class hardware',
      'Sensor networks and telemetry pipelines',
      'Smart metering and utility consumption tracking',
      'Robotics integration and control systems',
      'Cloud-connected devices with remote management',
    ],
    stack: [
      ['Edge', 'Arduino, ESP32, Raspberry Pi, industrial gateways'],
      ['Transport', 'MQTT, HTTP, GSM/GPRS fallback, LAN'],
      ['Pipeline', 'Ingest, queue, time-series storage, alerting'],
      ['Operations', 'Remote firmware update, device registry, health checks'],
    ],
    deliverables: [
      'Firmware with an update path you can use remotely',
      'A telemetry pipeline that buffers when the network is down',
      'A device registry with health and last-seen per unit',
      'Dashboards for the people who actually read the meter',
    ],
    art: 'meter',
    questions: [
      [
        'What happens when the network drops?',
        'The device keeps recording and buffers locally, then replays when it reconnects. A ' +
          'reading that only exists while the connection is up is not a reading.',
      ],
      [
        'Do you supply the hardware?',
        'We specify and integrate it, and we work with your supplier. Where a client has no ' +
          'preference we recommend units we have already deployed and can support.',
      ],
    ],
    cases: ['smart-metering'],
  }),

  practice({
    slug: 'security',
    title: 'Cybersecurity',
    short: 'Security',
    glyph: [2],
    blurb: 'Secure architecture, audits, penetration testing and incident readiness.',
    lede:
      'Security work is cheapest before the build and most expensive after the breach. We do ' +
      'both ends: designing systems that resist attack, and testing the ones already running.',
    includes: [
      'Security architecture and threat modelling',
      'Penetration testing and vulnerability assessment',
      'Code and infrastructure audits',
      'Identity verification and access control',
      'Incident response planning and readiness drills',
    ],
    stack: [
      ['Assessment', 'OWASP ASVS and Top 10, network and API testing'],
      ['Identity', 'MFA, session and token design, RBAC, KYC flows'],
      ['Hardening', 'Secrets management, least privilege, patch policy'],
      ['Response', 'Runbooks, log retention, tabletop exercises'],
    ],
    deliverables: [
      'A findings report ranked by exploitability, not by scanner score',
      'A fix list your engineers can work through, with retest included',
      'Threat model and trust boundaries, written down',
      'An incident runbook naming who does what, in order',
    ],
    art: 'identity',
    questions: [
      [
        'Do you test systems you did not build?',
        'Often. An external test of somebody else’s build is the most common way clients ' +
          'start with us, and we report exactly what we found and what we could not reach.',
      ],
      [
        'Will testing take our system down?',
        'We agree a window and a scope in writing first, and destructive tests only run ' +
          'against a staging copy unless you ask otherwise.',
      ],
    ],
    cases: ['payments-gateway', 'identity-verification'],
  }),

  practice({
    slug: 'web3',
    title: 'Blockchain / Web3',
    short: 'Web3',
    glyph: [3],
    blurb: 'Wallets, exchanges, P2P desks and contracts, with custody taken seriously.',
    lede:
      'The interesting problem in Web3 is rarely the chain. It is custody, settlement and what ' +
      'happens when a trade goes wrong at two in the morning.',
    includes: [
      'Web3 wallets for digital asset custody',
      'Centralised and decentralised exchanges (CEX, DEX)',
      'Peer-to-peer trading platforms with escrow',
      'Smart contracts and DeFi protocols',
      'Blockchain network APIs and transaction gateways',
    ],
    stack: [
      ['Chains', 'EVM networks, Bitcoin, Tron; node and provider APIs'],
      ['Contracts', 'Solidity, test coverage, third-party review before mainnet'],
      ['Custody', 'Hot/warm/cold split, signing policy, withdrawal limits'],
      ['Trading', 'Order book, matching, escrow, dispute workflow'],
    ],
    deliverables: [
      'A custody model written down before any key is generated',
      'Contracts with tests and an independent review',
      'An escrow and dispute flow that a support agent can operate',
      'Reconciliation between chain state and your own ledger',
    ],
    art: 'exchange',
    questions: [
      [
        'Can you audit an existing contract?',
        'We review and test it, and we say plainly where we would want a specialist audit ' +
          'firm as well. For anything holding significant value, two sets of eyes is the ' +
          'minimum.',
      ],
      [
        'What about regulation?',
        'We build to the compliance requirements you give us and we design for the ones ' +
          'likely to arrive — KYC hooks, audit trails, exportable records.',
      ],
    ],
    cases: ['p2p-escrow'],
  }),

  practice({
    slug: 'ai',
    title: 'Artificial Intelligence',
    short: 'AI',
    glyph: [0, 3],
    blurb: 'Models put into production, monitored, and wired into the work people do.',
    lede:
      'A model in a notebook is a demo. The engineering is everything after: serving it, ' +
      'watching it drift, and putting its output where somebody’s job actually happens.',
    includes: [
      'Production machine learning systems',
      'Chatbots and intelligent automation',
      'Face detection and identity recognition',
      'Model deployment and monitoring',
      'Decision support built into existing workflows',
    ],
    stack: [
      ['Modelling', 'PyTorch, scikit-learn, transformer fine-tunes'],
      ['Vision', 'Detection, face matching, liveness'],
      ['Serving', 'Batch and real-time inference, GPU or CPU as the load needs'],
      ['Operations', 'Drift monitoring, human review queues, rollback'],
    ],
    deliverables: [
      'An evaluation set and a baseline before any model ships',
      'A serving path with latency and cost measured',
      'A human review queue for the cases the model should not decide',
      'Monitoring that tells you when accuracy moves',
    ],
    art: 'identity',
    questions: [
      [
        'Do we have enough data?',
        'Frequently less than you think and more than you fear. The first step is a data ' +
          'audit, and sometimes the honest answer is that a rules engine solves it today.',
      ],
      [
        'Where should a human stay in the loop?',
        'Anywhere the cost of a wrong answer lands on a person — identity, money, ' +
          'eligibility. We design the review queue as part of the system, not as an add-on.',
      ],
    ],
    cases: ['identity-verification'],
  }),

  practice({
    slug: 'data',
    title: 'Data Science',
    short: 'Data',
    glyph: [1, 2],
    blurb: 'Pipelines, dashboards and forecasts built on numbers that reconcile.',
    lede:
      'Reporting is only worth having if the figures survive being checked. We start with the ' +
      'pipeline and the definitions, then build the dashboard on top of something solid.',
    includes: [
      'Data wrangling and pipeline engineering',
      'Dashboards and visual reporting',
      'Statistical modelling and forecasting',
      'Production-based tracking analytics',
      'Advertising and campaign metrics',
    ],
    stack: [
      ['Pipelines', 'Python, SQL, scheduled and event-driven jobs'],
      ['Storage', 'PostgreSQL, warehouse tables, time-series stores'],
      ['Reporting', 'Dashboards in-product or in your BI tool'],
      ['Quality', 'Tests on the data itself, not only on the code'],
    ],
    deliverables: [
      'A written definition for every metric on the dashboard',
      'Pipelines with data tests and alerting when a load fails',
      'Reports that reconcile with your finance numbers',
      'A forecast with its assumptions stated',
    ],
    art: 'meter',
    questions: [
      [
        'Why do two reports disagree?',
        'Usually because the same word means two things in two teams. The first deliverable ' +
          'is a metric dictionary, and it settles more arguments than any chart.',
      ],
      [
        'Can you work with our existing warehouse?',
        'Yes. Most of this work is joining what you already have rather than replacing it.',
      ],
    ],
    cases: ['smart-metering'],
  }),

  practice({
    slug: 'games',
    title: 'Game Development',
    short: 'Games',
    glyph: [0, 1],
    blurb: 'Mobile, web and Telegram games, with the backend that keeps them fair.',
    lede:
      'Games are the one place where our teams get to be playful about latency, and strict ' +
      'about the ledger behind the leaderboard.',
    includes: [
      'Mobile and web game builds',
      'Blockchain-based and play-to-earn games',
      'Telegram mini-app games',
      'Game backends, scoring and leaderboards',
      'Art pipeline and asset integration',
    ],
    stack: [
      ['Clients', 'Unity, web canvas, Telegram mini apps'],
      ['Backend', 'Authoritative scoring, anti-cheat checks, leaderboards'],
      ['Economy', 'Reward ledgers, on-chain settlement where it is asked for'],
      ['Live ops', 'Seasons, events, analytics on retention'],
    ],
    deliverables: [
      'A playable build early, not a design document',
      'An authoritative backend so scores cannot be forged',
      'A reward economy modelled before it goes live',
      'Analytics on what players actually do',
    ],
    art: 'exchange',
    questions: [
      [
        'Do we need a blockchain in our game?',
        'Usually not. It earns its place when players must own or trade something outside ' +
          'your game; otherwise it is cost and latency for nothing.',
      ],
      [
        'How long is a first build?',
        'A vertical slice — one level, one loop, on the real backend — is normally the ' +
          'first milestone, and it tells you more than a year of planning.',
      ],
    ],
    cases: [],
  }),
]

export const PRACTICE_BY_SLUG: Record<string, Practice> = Object.fromEntries(
  PRACTICES.map((p) => [p.slug, p]),
)

export const CLOUD: Array<[string, string]> = [
  ['Orchestration', 'Kubernetes clusters, container builds and rolling deployment.'],
  ['Serverless', 'Event-driven functions for spiky and scheduled workloads.'],
  ['Pipelines', 'CI/CD with automated testing gates before anything reaches production.'],
  ['Networking', 'Cloud networking, LAN deployment and on-premise installs for merchants.'],
  ['Migration', 'Moving existing systems to the cloud without a hard cutover.'],
]

export const SECTORS: Array<[string, string]> = [
  [
    'Fintech',
    'Payment gateways, bill payment and VTU platforms, investment software, reconciliation engines.',
  ],
  [
    'Government',
    'Identity verification, smart queue systems for public offices, utility metering.',
  ],
  ['Education', 'CBT examination software, school platforms, student and results management.'],
  [
    'Commerce',
    'Storefronts, dropshipping systems, and LAN point-of-sale that runs on a merchant’s own device.',
  ],
  ['Web3', 'Wallets, exchanges, P2P trading desks, DEX tooling and on-chain games.'],
]

/**
 * The capability matrix. The gaps are deliberate: a matrix that is entirely
 * filled is a brochure — design.md, Components.
 */
export const SECTOR_COLUMNS = ['Fintech', 'Gov', 'Education', 'Commerce', 'Web3'] as const

export const MATRIX: Array<[PracticeSlug, boolean[]]> = [
  ['software', [true, true, true, true, true]],
  ['iot', [false, true, false, true, false]],
  ['security', [true, true, true, true, true]],
  ['web3', [true, false, false, false, true]],
  ['ai', [true, true, true, true, false]],
  ['data', [true, true, true, true, true]],
  ['games', [false, false, false, false, true]],
]

export const MATRIX_FILLED = MATRIX.reduce(
  (n, [, cells]) => n + cells.filter(Boolean).length,
  0,
)
export const MATRIX_TOTAL = MATRIX.length * SECTOR_COLUMNS.length
