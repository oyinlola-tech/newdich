/**
 * Insights — writing from the practice.
 *
 * Each article is a list of blocks. `p` and `ul` items may carry inline markup
 * (<strong>, <em>, <a>); it is authored copy in this repository, never user
 * input, and the article renderer sets it as HTML.
 */

import { articleUrl } from '@/lib/routes'
import type { ArtKey } from '@/lib/art'

export type Block =
  | { t: 'p'; html: string }
  | { t: 'h2'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'quote'; text: string }
  | { t: 'code'; caption: string; code: string }
  | { t: 'art'; key: ArtKey }

export type Article = {
  slug: string
  title: string
  dek: string
  date: string
  displayDate: string
  author: string
  minutes: number
  tag: string
  blocks: Block[]
  url: string
  headings: Array<{ id: string; text: string }>
}

export function anchor(text: string): string {
  let keep = text
    .toLowerCase()
    .split('')
    .map((c) => (/[a-z0-9]/.test(c) ? c : '-'))
    .join('')
  while (keep.includes('--')) keep = keep.replace(/--/g, '-')
  return keep.replace(/^-+|-+$/g, '')
}

const article = (
  a: Omit<Article, 'url' | 'headings'>,
): Article => ({
  ...a,
  url: articleUrl(a.slug),
  headings: a.blocks
    .filter((b): b is Extract<Block, { t: 'h2' }> => b.t === 'h2')
    .map((b) => ({ id: anchor(b.text), text: b.text })),
})

export const ARTICLES: Article[] = [
  article({
    slug: 'offline-first-nigeria',
    title: 'Build for the network you have, not the one in the diagram',
    dek:
      'Power cuts and dropped links are not edge cases in a Nigerian deployment. They are ' +
      'the operating conditions, and they belong in the design document.',
    date: '2026-07-14',
    displayDate: '14 July 2026',
    author: 'Samuel Idebi',
    minutes: 7,
    tag: 'Engineering',
    blocks: [
      {
        t: 'p',
        html:
          'Every architecture diagram we have ever been handed by a vendor has an arrow ' +
          'between two boxes, and the arrow is always solid. In the field the arrow is ' +
          'dashed: the GSM link drops for forty minutes, the office loses power in the ' +
          'middle of an exam, the merchant’s router is rebooted by whoever needed the socket.',
      },
      {
        t: 'p',
        html:
          'This is not a complaint about infrastructure. It is a design input. Systems ' +
          'that assume continuity produce disputes — a missing meter reading becomes an ' +
          'estimate, an estimate becomes an argument, and the argument reaches somebody ' +
          'senior. Systems that assume interruption produce a slightly longer ' +
          'reconciliation and nothing else.',
      },
      { t: 'h2', text: 'Record locally, transmit opportunistically' },
      {
        t: 'p',
        html:
          'The unit of truth is the reading, not the transmission. A device should write ' +
          'its measurement to local storage the moment it takes it, with the timestamp of ' +
          'the measurement rather than the timestamp of the upload, and then attempt ' +
          'delivery whenever it can.',
      },
      {
        t: 'ul',
        items: [
          'Buffer on the device, with enough storage for the longest outage you have ' +
            'actually seen — then double it.',
          'Timestamp at capture. A reading that arrives at 4pm for a 9am event is a 9am reading.',
          'Make the upload idempotent, so replaying a buffer cannot double-count.',
          'Track last-seen per device, so silence is visible rather than assumed to be zero.',
        ],
      },
      { t: 'h2', text: 'Idempotency is the whole game' },
      {
        t: 'p',
        html:
          'Once a device replays, the server will see the same reading more than once. ' +
          'The fix is not deduplication after the fact; it is an identity for every event ' +
          'that the device generates and the server respects.',
      },
      {
        t: 'code',
        caption: 'Ingest with a natural key',
        code:
          '-- The device supplies (device_id, taken_at). The server stores at most\n' +
          '-- one row for that pair, no matter how many times it is replayed.\n' +
          'INSERT INTO reading (device_id, taken_at, kwh, received_at)\n' +
          'VALUES ($1, $2, $3, now())\n' +
          'ON CONFLICT (device_id, taken_at) DO NOTHING;',
      },
      {
        t: 'p',
        html:
          'The same principle covers payments, where the client supplies an idempotency ' +
          'key with the request: a retry after a timeout returns the original result ' +
          'rather than charging a second time. If your API cannot survive being called ' +
          'twice, it will eventually charge somebody twice.',
      },
      { t: 'h2', text: 'Design the reconnect, not just the connect' },
      {
        t: 'p',
        html:
          'The interesting code runs at the moment the link returns: a hundred buffered ' +
          'events arrive at once, from four hundred devices, all at the moment the tower ' +
          'comes back. Rate-limit the replay, spread it with jitter, and make sure the ' +
          'queue in front of your database is the thing that absorbs the burst.',
      },
      {
        t: 'quote',
        text:
          'A system that only works while the connection is up is not a system. It is a ' +
          'demo with good weather.',
      },
      { t: 'h2', text: 'Make degradation visible' },
      {
        t: 'p',
        html:
          'The worst failure is the silent one: a meter that stopped reporting three weeks ' +
          'ago and is quietly being estimated, a POS terminal that has not synced since ' +
          'Tuesday. Every system we ship has a health view that answers one question — ' +
          'what is not talking to us right now — and an exception queue for anything the ' +
          'system refused to guess about.',
      },
      { t: 'art', key: 'meter' },
      {
        t: 'p',
        html:
          'That queue is the deliverable clients end up valuing most. It converts an ' +
          'invisible data-quality problem into a short list of things somebody can go and ' +
          'fix this morning.',
      },
    ],
  }),

  article({
    slug: 'ledger-not-status-column',
    title: 'Your payment system needs a ledger, not a status column',
    dek:
      'The difference between a status field and double-entry bookkeeping shows up on the ' +
      'day somebody asks what happened to one transaction six months ago.',
    date: '2026-05-28',
    displayDate: '28 May 2026',
    author: 'Newdich engineering',
    minutes: 8,
    tag: 'Fintech',
    blocks: [
      {
        t: 'p',
        html:
          'Most payment systems start the same way: a payments table, a status column, ' +
          'and an UPDATE statement. It works for months. It fails on the day a customer ' +
          'disputes a transaction and the only evidence you have is the current value of ' +
          'a field that has been overwritten four times.',
      },
      { t: 'h2', text: 'What the status column loses' },
      {
        t: 'ul',
        items: [
          '<strong>History.</strong> An UPDATE erases the previous state. You know it is ' +
            '‘failed’; you cannot show when it stopped being ‘pending’ or who changed it.',
          '<strong>Balance.</strong> A status does not tell you how much money is where. ' +
            'Summing a payments table is not the same as knowing a balance.',
          '<strong>Correction.</strong> When something is wrong, the temptation is to ' +
            'edit the row. Now the audit trail is a lie.',
        ],
      },
      { t: 'h2', text: 'The alternative is old and boring' },
      {
        t: 'p',
        html:
          'Double-entry bookkeeping predates computing by several centuries and has one ' +
          'rule: every movement of value writes at least two entries, and they sum to ' +
          'zero. Nothing is ever updated. A correction is a new pair of entries that ' +
          'reverses the old one.',
      },
      {
        t: 'code',
        caption: 'One payment, as entries',
        code:
          '-- A ₦12,450 card payment, settled to a merchant, 1.5% fee.\n' +
          '-- Amounts are integers in kobo. Never floats. Ever.\n' +
          'entry  txn_id   account              debit      credit\n' +
          '-----  -------  -------------------  ---------  ---------\n' +
          '1      TXN-904  cash.gateway         1,245,000\n' +
          '2      TXN-904  liability.merchant              1,226,325\n' +
          '3      TXN-904  income.fees                        18,675',
      },
      {
        t: 'p',
        html:
          'Balances are derived by summing entries, not stored and updated. That sounds ' +
          'expensive until you realise it is a single indexed aggregate, and that the ' +
          'alternative — a stored balance that drifts from its own history — is the bug ' +
          'you will spend a quarter chasing.',
      },
      { t: 'h2', text: 'Money is an integer' },
      {
        t: 'p',
        html:
          'Store minor units. ₦12,450.00 is 1,245,000 kobo, held in a 64-bit integer. ' +
          'Floating point in a financial system is not a rounding problem, it is a ' +
          'reconciliation problem: it produces differences of a few kobo that nobody can ' +
          'explain and everybody has to investigate.',
      },
      { t: 'h2', text: 'Reconciliation is a scheduled job, not a heroic effort' },
      {
        t: 'p',
        html:
          'The ledger tells you what you think happened. The provider statement tells you ' +
          'what they think happened. Reconciliation is the job that matches the two on ' +
          'amount, reference and time window, and — this is the important part — refuses ' +
          'to guess.',
      },
      { t: 'art', key: 'ledger' },
      {
        t: 'p',
        html:
          'Everything it cannot match goes into an exception queue with both sides ' +
          'attached. A good day is an empty queue. A bad day is four items, which is still ' +
          'a working morning rather than a forensic project.',
      },
      {
        t: 'quote',
        text:
          'If your system cannot answer ‘what happened to this transaction’ without ' +
          'someone reading application logs, it does not have a ledger.',
      },
      { t: 'h2', text: 'What we build now, by default' },
      {
        t: 'ul',
        items: [
          'Append-only entries; no UPDATE on anything financial',
          'Integer minor units, currency stored alongside the amount',
          'Idempotency keys on every write endpoint',
          'Scheduled reconciliation with a human exception queue',
          'An audit log on every administrative action, immutable to operators',
        ],
      },
    ],
  }),

  article({
    slug: 'exam-day-checklist',
    title: 'What we check before an exam day',
    dek:
      'A CBT platform has one property no other system needs: when it drops an answer, there ' +
      'is no retry. Here is the list we work through before a sitting.',
    date: '2026-03-09',
    displayDate: '9 March 2026',
    author: 'Newdich engineering',
    minutes: 6,
    tag: 'Education',
    blocks: [
      {
        t: 'p',
        html:
          'Most software gets a second chance. A user reloads, retries, comes back ' +
          'tomorrow. An examination does not: two hundred candidates are in a hall for a ' +
          'fixed two hours, and whatever the system does during those two hours is the outcome.',
      },
      {
        t: 'p',
        html:
          'So the engineering that matters happens before the day. This is the list we ' +
          'actually work through, in order.',
      },
      { t: 'h2', text: 'The hall, not the datacentre' },
      {
        t: 'ul',
        items: [
          'Walk the hall. Count sockets, count machines, note which ones are on the same breaker.',
          'Test on the oldest machine in the room, not on a developer laptop.',
          'Confirm what happens when the power goes: how long does the router stay up, ' +
            'and does the local server have a battery?',
          'Check the network path from a candidate machine to the server, and time it ' +
            'with every machine talking at once.',
        ],
      },
      { t: 'h2', text: 'Autosave, then prove it' },
      {
        t: 'p',
        html:
          'Every answer writes locally as it is given and syncs to the server behind it. ' +
          'That is not the interesting part. The interesting part is the drill: pull the ' +
          'plug on a machine mid-paper, bring it back, and confirm the candidate resumes ' +
          'on the question they left with every prior answer intact.',
      },
      { t: 'art', key: 'exam' },
      {
        t: 'p',
        html:
          'We do this drill on the actual hardware in the actual hall. It has found a ' +
          'problem every time we have skipped it and assumed.',
      },
      { t: 'h2', text: 'Randomisation that survives scrutiny' },
      {
        t: 'p',
        html:
          'Each candidate gets their own draw from the question bank, so adjacent screens ' +
          'differ. The seed is stored with the sitting, which means the exact paper a ' +
          'candidate saw can be reconstructed later — necessary when a result is challenged.',
      },
      { t: 'h2', text: 'Marking you can re-run' },
      {
        t: 'p',
        html:
          'Marking reads stored answers and produces results deterministically. If a key ' +
          'is corrected after the fact, the office re-runs marking rather than editing ' +
          'scores by hand, and the change is recorded.',
      },
      { t: 'h2', text: 'The invigilator’s screen' },
      {
        t: 'p',
        html:
          'Finally, someone in the room needs to see the sitting as it happens: who has ' +
          'started, whose machine has gone quiet, who has finished. Most incidents on the ' +
          'day are handled by a person noticing early, and that only happens if the ' +
          'software shows them.',
      },
    ],
  }),
]

export const ARTICLE_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a]),
)
