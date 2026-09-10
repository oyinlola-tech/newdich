/**
 * The company itself: how it works, who is in it, what it believes, what it
 * charges for.
 *
 * Anything here the company should confirm before launch is marked in the
 * README under "Placeholders to confirm" rather than being quietly presented
 * as fact.
 */

export const VALUES: Array<[string, string]> = [
  [
    'Correct before clever',
    'The systems we build count money, readings and exam answers. A clever design that is ' +
      'occasionally wrong is worse than a plain one that is always right.',
  ],
  [
    'Assume the network fails',
    'Nigerian deployments lose power and connectivity as a matter of routine. Everything we ' +
      'ship buffers, retries and reconciles, because the alternative is a dispute.',
  ],
  [
    'Hand it over properly',
    'The repository, the pipeline and the documentation belong to the client from the first ' +
      'commit. Handover is scheduled work, not a favour at the end.',
  ],
  [
    'Say what we cannot do',
    'Our capability matrix has empty cells on purpose. Telling a client we are the wrong team ' +
      'costs one project; not telling them costs the relationship.',
  ],
]

export type Engagement = {
  name: string
  shape: string
  note: string
  gives: string[]
}

export const ENGAGEMENTS: Engagement[] = [
  {
    name: 'Discovery',
    shape: 'One to three weeks',
    note:
      'We map the system, the constraints and the risks, and produce a written design with an ' +
      'estimate you can take to somebody else if you want to.',
    gives: ['System design document', 'Risk and constraint register', 'Phased estimate'],
  },
  {
    name: 'Build',
    shape: 'Per phase, fixed scope',
    note:
      'A phase is the smallest slice a real user can complete end to end. You see working ' +
      'software every phase, not a status report.',
    gives: ['Working software each phase', 'Tests and CI from day one', 'Fortnightly demo'],
  },
  {
    name: 'Run',
    shape: 'Monthly retainer',
    note:
      'Support, monitoring, updates and a named engineer who knows your system. Or a clean ' +
      'handover to your own team — both are normal endings.',
    gives: ['Agreed response times', 'Monitoring and backups', 'Documented handover'],
  },
]

export const PROCESS: Array<[string, string]> = [
  [
    'Map it',
    'We sit with the people who will use the thing, and with whoever has to run it ' +
      'afterwards. Most of the risk in a project is found in this room, not in the code.',
  ],
  [
    'Design it',
    'A written system design: the shape, the data, the failure modes, the trust boundaries. ' +
      'It is short, and it is the document everything else is checked against.',
  ],
  [
    'Build a slice',
    'One path through the system, end to end, on real infrastructure. It is the only estimate ' +
      'anybody should trust, and it exposes the integration problems while they are cheap.',
  ],
  [
    'Harden it',
    'Tests, load, security review, and the failure cases: what happens with no network, no ' +
      'power, a duplicate request, a hostile user.',
  ],
  [
    'Ship and watch',
    'Deploy behind a switch, watch the numbers, and keep the rollback ready. A launch is a ' +
      'week, not an evening.',
  ],
  [
    'Hand it over',
    'Documentation, a walkthrough with your engineers, and access that belongs to you. Then ' +
      'support on a retainer if you want it.',
  ],
]

export const TIMELINE: Array<[string, string, string]> = [
  ['2014', 'Newdich Technology founded', 'Contract software work out of Okitipupa, Ondo State.'],
  ['2016', 'Institute opens', 'Training begins alongside the client work, on the same projects.'],
  [
    '2018',
    'Fintech and government work',
    'Payments, identity and metering become the core of the practice.',
  ],
  ['2021', 'Ansofra published', 'The internal PHP framework is released on Packagist under MIT.'],
  [
    '2023',
    'Abuja office',
    'A second office in the Federal Capital Territory, closer to the public-sector work.',
  ],
  [
    '2026',
    'Seven practices, five sectors',
    'The capability matrix on the home page is the current, honest scope.',
  ],
]

export const TEAM: Array<[string, string, string, string]> = [
  [
    'Samuel Idebi',
    'SI',
    'Founder & tech consultant',
    'Software, DevOps, cybersecurity, IoT and games. Author of the Ansofra framework.',
  ],
  [
    'Silas Ikusaanu',
    'SK',
    'Fullstack · cybersecurity · data',
    'Application security and full-stack delivery across fintech and government work.',
  ],
  [
    'Olumide David',
    'OD',
    'Fullstack · data analyst',
    'Product engineering and the analytics behind the reporting we ship.',
  ],
  [
    'Shola Ekundayo',
    'SE',
    'Fullstack · data analyst',
    'Front-end systems and reporting, and mentoring on the Institute’s tracks.',
  ],
]

export const OFFICE_NOTES: Array<[string, string, string, number[]]> = [
  [
    'Abuja',
    'Federal Capital Territory',
    'Head office. Closest to the public-sector and fintech work.',
    [0],
  ],
  [
    'Okitipupa',
    'Ondo State',
    'Where the company started in 2014, and where much of the Institute teaching runs.',
    [3],
  ],
]
