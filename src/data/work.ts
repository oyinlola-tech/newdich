/**
 * Case studies.
 *
 * design.md, Do's and Don'ts: no client names, no logos, no invented outcome
 * figures. Each of these describes a system Newdich has built, the sector it
 * was built for, and the engineering decisions behind it. Where a number
 * appears it is either the company's own published figure or a property of the
 * system itself (a polling interval, a batch size), never an invented business
 * result.
 *
 * When a client signs off on being named, add `client` and a quote to the
 * entry and the template will render it.
 */

import { caseUrl, type PracticeSlug } from '@/lib/routes'
import type { ArtKey } from '@/lib/art'

export type CaseStudy = {
  slug: string
  title: string
  sector: string
  summary: string
  art: ArtKey
  practices: PracticeSlug[]
  facts: Array<[string, string]>
  problem: string[]
  approach: string[]
  build: string[]
  result: string
  stack: Array<[string, string]>
  url: string
}

const study = (c: Omit<CaseStudy, 'url'>): CaseStudy => ({ ...c, url: caseUrl(c.slug) })

export const CASES: CaseStudy[] = [
  study({
    slug: 'smart-metering',
    title: 'Smart metering and consumption analytics',
    sector: 'Utilities · IoT',
    summary:
      'Meters in the field, a telemetry pipeline that tolerates a bad network, and the ' +
      'dashboards the billing team actually opens each morning.',
    art: 'meter',
    practices: ['iot', 'data', 'software'],
    facts: [
      ['Practice', 'IoT & robotics, data science'],
      ['Sector', 'Utilities and government'],
      ['Shape', 'Edge devices → ingest → time-series → dashboard'],
      ['Field constraint', 'Intermittent GSM, frequent power loss'],
    ],
    problem: [
      'Utility consumption in Nigeria is measured in places where the network is not ' +
        'dependable and the power is not continuous. A metering system that assumes either ' +
        'one will produce a billing dispute every month.',
      'The brief was consumption tracking and analytics: read the meter, get the reading ' +
        'home, and give the people who bill it something they can defend to a customer.',
    ],
    approach: [
      'We designed the reading as the unit of truth rather than the connection. Each device ' +
        'records on its own schedule and buffers locally; the pipeline replays whatever it ' +
        'missed when the link returns, and every reading carries the time it was taken rather ' +
        'than the time it arrived.',
      'On the billing side, the analytics were built on definitions agreed with the finance ' +
        'team first — what counts as a reading, what counts as an estimate, and how an ' +
        'exception is raised — so the dashboard and the invoice cannot disagree.',
    ],
    build: [
      'Firmware with local buffering and remote update',
      'Ingest that is idempotent, so a replayed reading is never double counted',
      'A time-series store with per-device health and last-seen',
      'Exception queue for meters that stop reporting or report impossible jumps',
      'Estate, feeder and per-meter views for the billing team',
    ],
    result:
      'The system reads, buffers, replays and reconciles without an operator watching it, and ' +
      'an unmatched reading raises an exception rather than quietly becoming an estimate.',
    stack: [
      ['Edge', 'Arduino-class hardware, GSM with local buffer'],
      ['Transport', 'MQTT with store-and-forward'],
      ['Core', 'Python ingest, PostgreSQL with time-series tables'],
      ['Surface', 'Web dashboards, scheduled exports for billing'],
    ],
  }),

  study({
    slug: 'payments-gateway',
    title: 'PCI-compliant payments gateway and reconciliation',
    sector: 'Fintech',
    summary:
      'A payments API built for volume and for auditability, with a reconciliation engine ' +
      'behind it that closes the day automatically.',
    art: 'ledger',
    practices: ['software', 'security', 'data'],
    facts: [
      ['Practice', 'Software engineering, cybersecurity'],
      ['Sector', 'Fintech'],
      ['Shape', 'API → ledger → reconciliation → settlement report'],
      ['Standard', 'PCI-aligned handling; card data never at rest in the app'],
    ],
    problem: [
      'Anyone can take a payment. The expensive part arrives at the end of the day, when the ' +
        'gateway’s numbers, the bank statement and the merchant’s own records have to agree — ' +
        'and one of them is always late.',
      'The requirement was a gateway that could carry volume, and an audit trail that could ' +
        'survive somebody asking what happened to a specific transaction six months ago.',
    ],
    approach: [
      'Money moves through a double-entry ledger rather than a status column. Every ' +
        'transaction writes balanced entries, nothing is ever updated in place, and a ' +
        'correction is a new entry — so the history is always reconstructable.',
      'Reconciliation runs on a schedule against the provider statement, matches on amount, ' +
        'reference and window, and puts anything it cannot match in front of a human instead ' +
        'of guessing.',
    ],
    build: [
      'Idempotent payment API with request keys, so a retry cannot charge twice',
      'Double-entry ledger with immutable entries',
      'Scheduled reconciliation with an exception queue',
      'Webhook delivery with retries and a replay endpoint',
      'Role-based back office with an audit log on every action',
    ],
    result:
      'The day closes on its own, and the transactions that need a person are the only ones ' +
      'that reach a person.',
    stack: [
      ['API', 'PHP 8 on Ansofra, idempotency keys, signed webhooks'],
      ['Ledger', 'PostgreSQL, append-only entries, minor-unit integers'],
      ['Security', 'Tokenised card handling, MFA on the back office, full audit trail'],
      ['Reporting', 'Settlement and exception reports, exportable'],
    ],
  }),

  study({
    slug: 'cbt-examinations',
    title: 'CBT examination platform for schools',
    sector: 'Education',
    summary:
      'Computer-based testing that keeps a candidate’s answers when the building loses power, ' +
      'and gives the exam office a result it can defend.',
    art: 'exam',
    practices: ['software', 'data'],
    facts: [
      ['Practice', 'Software engineering'],
      ['Sector', 'Education'],
      ['Shape', 'Question bank → sitting → autosave → results'],
      ['Field constraint', 'Power cuts mid-exam; shared, low-spec machines'],
    ],
    problem: [
      'An examination system fails in a way no other software does: when it drops a ' +
        'candidate’s answers, there is no retry. The exam is the event.',
      'Schools needed computer-based testing on the machines they already had, in halls ' +
        'where the power is not guaranteed for the length of a paper.',
    ],
    approach: [
      'Every answer is saved as it is given, locally and then to the server, and a sitting ' +
        'can be resumed on another machine from the last saved state. The candidate sees the ' +
        'same question palette they left.',
      'Question delivery is randomised per candidate from a bank, so neighbouring screens ' +
        'do not show the same paper, and marking is deterministic and re-runnable from the ' +
        'stored answers.',
    ],
    build: [
      'Autosave with local fallback and resume-after-power-cut',
      'Per-candidate randomisation from a question bank',
      'Invigilator view: who is sitting, who stalled, who finished',
      'Re-runnable marking, so a key correction reissues results correctly',
      'Exports for the results office',
    ],
    result:
      'A power cut becomes an interruption rather than a lost paper, and the results office ' +
      'can re-run marking without re-running the exam.',
    stack: [
      ['Client', 'Browser-based, works on low-spec lab machines'],
      ['Sync', 'Local storage first, server sync on reconnect'],
      ['Core', 'PHP 8, PostgreSQL, deterministic marking jobs'],
      ['Reporting', 'Per-candidate, per-question and cohort views'],
    ],
  }),

  study({
    slug: 'queue-management',
    title: 'Smart queue for public offices',
    sector: 'Government',
    summary:
      'Ticketing, counter displays and the wait-time data that tells a manager where the ' +
      'morning actually goes.',
    art: 'queue',
    practices: ['software', 'iot', 'data'],
    facts: [
      ['Practice', 'Software engineering, IoT'],
      ['Sector', 'Government and public services'],
      ['Shape', 'Ticket → counter → display → wait analytics'],
      ['Environment', 'Public halls, screens on the wall, staff at counters'],
    ],
    problem: [
      'A queue in a public office is not a technology problem until you try to measure it. ' +
        'Nobody can say how long people wait, which counter stalls, or whether a new desk ' +
        'would help.',
      'The brief was a working queue — tickets, calling, displays — that also produced the ' +
        'numbers to answer those questions.',
    ],
    approach: [
      'The system is a small state machine per ticket: issued, called, being served, ' +
        'completed or abandoned. Everything else — the wall display, the counter keypad, the ' +
        'report — is a view of that state.',
      'Because every transition is timestamped, wait and service time come out of the data ' +
        'rather than out of an estimate, per counter and per hour of the day.',
    ],
    build: [
      'Ticket issue with category routing',
      'Counter control and wall display, kept in sync',
      'Abandonment tracked, not silently dropped',
      'Wait and service time by counter, hour and day',
      'Runs on the office’s own network',
    ],
    result:
      'The hall runs the same way it always did, and the manager finally has the numbers for ' +
      'the staffing conversation.',
    stack: [
      ['Displays', 'Browser-based wall boards on cheap hardware'],
      ['Control', 'Counter web app and physical keypad support'],
      ['Core', 'Event-sourced ticket states, PostgreSQL'],
      ['Deployment', 'On-premise on the office LAN'],
    ],
  }),

  study({
    slug: 'p2p-escrow',
    title: 'P2P trading desk with escrow and disputes',
    sector: 'Web3',
    summary:
      'A peer-to-peer market where the asset is held in escrow, the timers are explicit, and ' +
      'a support agent has a defined path when a trade goes wrong.',
    art: 'exchange',
    practices: ['web3', 'security', 'software'],
    facts: [
      ['Practice', 'Blockchain / Web3, cybersecurity'],
      ['Sector', 'Digital assets'],
      ['Shape', 'Order → escrow → payment window → release or dispute'],
      ['Hard part', 'Custody, timers and the dispute path'],
    ],
    problem: [
      'In peer-to-peer trading the software is not the hard part — deciding who holds the ' +
        'asset, for how long, and who decides when the two sides disagree is the hard part.',
      'The desk needed escrow that could not be talked around, and a dispute process that a ' +
        'support agent could follow without improvising.',
    ],
    approach: [
      'Escrow is a state machine with explicit timers: funds are locked at order creation, ' +
        'the payment window is fixed and visible to both sides, and auto-release and ' +
        'auto-cancel are rules rather than someone’s judgement at midnight.',
      'Custody is split hot, warm and cold with signing policy and withdrawal limits written ' +
        'down before any key was generated, and every state change is written to an audit log ' +
        'no operator can edit.',
    ],
    build: [
      'Escrow with locked funds and visible timers',
      'Dispute queue with evidence upload and a defined resolution path',
      'Hot/warm/cold custody split and withdrawal limits',
      'Chain state reconciled against the internal ledger',
      'Audit trail on every state change and every admin action',
    ],
    result:
      'Both sides can see what happens next and when, and the operator can prove what ' +
      'happened afterwards.',
    stack: [
      ['Chains', 'EVM networks and Tron; provider APIs with fallback'],
      ['Custody', 'Split wallets, policy-bound signing'],
      ['Core', 'Order and escrow state machines, append-only ledger'],
      ['Support', 'Dispute console with full evidence trail'],
    ],
  }),

  study({
    slug: 'identity-verification',
    title: 'Identity verification and face matching',
    sector: 'Fintech · Gov',
    summary:
      'Document capture, liveness and face matching, with a human review queue for everything ' +
      'the model should not decide alone.',
    art: 'identity',
    practices: ['ai', 'security', 'software'],
    facts: [
      ['Practice', 'Artificial intelligence, cybersecurity'],
      ['Sector', 'Fintech, government'],
      ['Shape', 'Capture → checks → score → decision or review'],
      ['Principle', 'A person decides anything that costs a person'],
    ],
    problem: [
      'Onboarding fails in two directions: letting the wrong person in, and locking the ' +
        'right person out. The second is the one that never shows up in a demo.',
      'The requirement was verification that could run at volume without turning a false ' +
        'negative into a customer with no way back.',
    ],
    approach: [
      'The pipeline runs document authenticity, liveness and face match as separate checks ' +
        'with separate scores, rather than one opaque verdict. Thresholds are set per check ' +
        'and are tuneable without redeploying.',
      'Anything in the uncertain band goes to a review queue with the evidence attached, and ' +
        'the reviewer’s decision is recorded — which also produces the labelled data the model ' +
        'needs to improve.',
    ],
    build: [
      'Guided capture that rejects an unusable photo before submission',
      'Separate document, liveness and match scores',
      'Tuneable thresholds per check and per risk tier',
      'Human review queue with the evidence and a recorded decision',
      'Full audit trail, retention rules and export for the compliance file',
    ],
    result:
      'Clear passes and clear failures are automatic; the uncertain band reaches a person ' +
      'with everything they need to decide.',
    stack: [
      ['Vision', 'Detection, liveness and face matching models'],
      ['Serving', 'Queued inference with latency budgets'],
      ['Review', 'Operator console with evidence and decision log'],
      ['Compliance', 'Retention policy, audit trail, exportable case file'],
    ],
  }),
]

export const CASE_BY_SLUG: Record<string, CaseStudy> = Object.fromEntries(
  CASES.map((c) => [c.slug, c]),
)
