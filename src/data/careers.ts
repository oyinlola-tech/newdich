/**
 * Open roles.
 *
 * These are written as example roles matching the practices the company runs.
 * Confirm which are actually open — and the terms — before launch. See the
 * README, "Placeholders to confirm".
 */

export const WHY_HERE: Array<[string, string]> = [
  [
    'Work that is load-bearing',
    'Meters that bill people, exams that decide places, ledgers that hold money. Nothing here ' +
      'is a landing page for a startup that may not exist next year.',
  ],
  [
    'Two offices, flexible weeks',
    'Abuja and Okitipupa, with remote-friendly schedules. Most of the team is in the office ' +
      'some days and not others.',
  ],
  [
    'You will be reviewed, properly',
    'Every change is read by somebody. It is the fastest way anybody has found to get better, ' +
      'and it is why our juniors stop being juniors quickly.',
  ],
  [
    'Teaching is part of the job',
    'The Institute runs on the same projects. Engineers here mentor, and it makes them ' +
      'better at explaining a system to a client.',
  ],
]

export type Role = {
  slug: string
  title: string
  place: string
  terms: string
  practice: string
  note: string
  wants: string[]
}

export const ROLES: Role[] = [
  {
    slug: 'backend-engineer',
    title: 'Backend Engineer',
    place: 'Abuja or remote',
    terms: 'Full time',
    practice: 'Software engineering',
    note:
      'You will work on payment, metering and examination systems: APIs, ledgers, queues and ' +
      'the jobs that reconcile them.',
    wants: [
      'Strong in PHP, Python or Go, and comfortable in SQL',
      'Has designed a schema somebody else had to live with',
      'Understands idempotency, retries and why money is an integer',
      'Writes tests without being asked to',
    ],
  },
  {
    slug: 'iot-engineer',
    title: 'IoT / Embedded Engineer',
    place: 'Okitipupa or Abuja',
    terms: 'Full time',
    practice: 'IoT & robotics',
    note:
      'Firmware and telemetry for devices deployed where the power and the network are not ' +
      'guaranteed.',
    wants: [
      'C/C++ on Arduino-class hardware, or Python on Linux boards',
      'Has debugged something in the field, not only on a bench',
      'Comfortable with MQTT, serial protocols and flaky links',
      'Thinks about power budgets and update paths',
    ],
  },
  {
    slug: 'security-engineer',
    title: 'Security Engineer',
    place: 'Abuja or remote',
    terms: 'Full time / contract',
    practice: 'Cybersecurity',
    note:
      'Threat modelling on systems being designed, and testing on systems already running — ' +
      'ours and our clients’.',
    wants: [
      'Hands-on web and API testing against OWASP ASVS',
      'Can write a finding a developer can act on',
      'Understands identity, sessions and access control deeply',
      'Discreet, and comfortable delivering unwelcome news',
    ],
  },
  {
    slug: 'frontend-engineer',
    title: 'Frontend Engineer',
    place: 'Remote (Nigeria)',
    terms: 'Full time',
    practice: 'Software engineering',
    note:
      'Dashboards, operator consoles and public-facing products — the surfaces where our ' +
      'systems meet the people using them.',
    wants: [
      'Modern JavaScript and TypeScript; React or equivalent',
      'Cares about accessibility and keyboard paths, not only layout',
      'Can build a dense data table that stays readable',
      'Has opinions about performance on low-spec machines',
    ],
  },
  {
    slug: 'instructor',
    title: 'Institute Instructor',
    place: 'Abuja or Okitipupa',
    terms: 'Part time',
    practice: 'Newdich Technology Institute',
    note:
      'Teach one track — software, data, AI, security, IoT or blockchain — and mentor projects ' +
      'through to certification.',
    wants: [
      'Working engineer, not a career trainer',
      'Can review someone’s code kindly and usefully',
      'Available for one cohort’s teaching schedule',
      'Willing to be asked hard questions by beginners',
    ],
  },
]

export const HOW_TO_APPLY = [
  'Send your CV and anything you have built to newdichngr@gmail.com, with the role in the ' +
    'subject line.',
  'We reply either way. If it is a no, we will say so rather than leave you waiting.',
  'First conversation is 30 minutes about what you have built and how you decided to build ' +
    'it that way.',
  'Then a short paid exercise close to real work — no whiteboard puzzles, no unpaid project.',
]
