/**
 * Newdich Technology Institute — tracks, mentors, enrolment.
 *
 * Checked against the Institute's own page at https://newdich.tech/institute
 * on 2026-09-10: the tagline, the six tracks and their descriptions, the two
 * published figures, the mentor list, the support services and the Okitipupa
 * location are the Institute's own. Fees, cohort dates and entry requirements
 * are not published there, so this page does not state any — see the README
 * under "Placeholders to confirm".
 */

export const TAGLINE = 'Train · Build · Launch'

export const LOCATION = 'Okitipupa, Ondo State, Nigeria'

export const STATS: Array<[string, string]> = [
  ['1,200+', 'Graduates'],
  ['80%', 'Placement rate'],
  ['6', 'Certification tracks'],
  ['2014', 'Training since'],
]

export type Track = {
  name: string
  glyph: number[]
  summary: string
  builds: string
  modules: string[]
}

export const TRACKS: Track[] = [
  {
    name: 'Software Engineering',
    glyph: [0],
    summary:
      'Full-stack web and mobile development, system design, testing and deployment.',
    builds: 'A working product with an API, tests and a deployment you can show.',
    modules: [
      'Programming fundamentals and version control',
      'Databases and schema design',
      'Web applications end to end',
      'APIs, authentication and testing',
      'Deployment, CI and monitoring',
    ],
  },
  {
    name: 'Data Science',
    glyph: [1],
    summary: 'Data wrangling, visualisation, statistical modelling and pipelines.',
    builds: 'An analysis and a dashboard built on a pipeline you wrote.',
    modules: [
      'Python for data work',
      'SQL and data modelling',
      'Cleaning, joining and validating real data',
      'Visualisation and reporting',
      'Statistics and forecasting',
    ],
  },
  {
    name: 'AI & Machine Learning',
    glyph: [2],
    summary:
      'Supervised and unsupervised learning, deep learning, MLOps and deployment.',
    builds: 'A model served behind an API, with evaluation and monitoring.',
    modules: [
      'Maths you actually need, and no more',
      'Classical machine learning',
      'Deep learning and transfer learning',
      'Evaluation, bias and failure modes',
      'Serving, monitoring and drift',
    ],
  },
  {
    name: 'Cybersecurity',
    glyph: [3],
    summary:
      'Security fundamentals, threat modelling, penetration testing and response.',
    builds:
      'A tested application and a findings report written the way clients receive them.',
    modules: [
      'Networking and operating system fundamentals',
      'Web and API vulnerabilities in practice',
      'Threat modelling and secure design',
      'Testing tools and methodology',
      'Reporting, disclosure and incident response',
    ],
  },
  {
    name: 'IoT & Robotics',
    glyph: [0, 3],
    summary:
      'Embedded systems, sensors, robotics integration and cloud-connected devices.',
    builds: 'A device that measures something real and gets the reading home.',
    modules: [
      'Electronics and microcontrollers',
      'Sensors, actuators and control',
      'Communication: serial, MQTT, GSM',
      'Edge buffering and power budgets',
      'Cloud integration and remote update',
    ],
  },
  {
    name: 'Blockchain & Cloud',
    glyph: [1, 2],
    summary: 'Smart contracts, decentralised apps and cloud-native infrastructure.',
    builds:
      'A deployed contract with tests, and the cloud infrastructure it runs against.',
    modules: [
      'How chains actually work',
      'Solidity and contract testing',
      'Wallets, custody and key handling',
      'Cloud fundamentals and containers',
      'CI/CD and infrastructure as code',
    ],
  },
]

export const MENTORS: Array<[string, string, string, string]> = [
  [
    'Samuel Idebi',
    'SI',
    'Tech consultant',
    'Software, DevOps, cybersecurity, IoT and games. Author of the Ansofra framework.',
  ],
  [
    'Silas Ikusaanu',
    'SK',
    'Fullstack · cybersecurity · data',
    'Application security and full-stack delivery.',
  ],
  ['Olumide David', 'OD', 'Fullstack · data analyst', 'Product engineering and analytics.'],
  ['Shola Ekundayo', 'SE', 'Fullstack · data analyst', 'Front-end systems and reporting.'],
]

/** The three support services the Institute names on its own page. */
export const SUPPORT: Array<[string, string]> = [
  [
    'Industry mentors',
    'Taught and reviewed by engineers working in industry, not by career trainers.',
  ],
  [
    'Project portfolio',
    'You ship a real system on the track you chose, and you leave with it.',
  ],
  [
    'Career support',
    'CV review, interview preparation and introductions to employers.',
  ],
]

export const HOW_IT_RUNS = [
  'Instructors who work in industry rather than career trainers',
  'Practical skills taught through real project work',
  'Project reviews and one-to-one mentorship',
  'Certification on completion',
  'Placement help and career guidance',
  'Bootcamp, part-time and certificate formats',
]

export const FORMATS: Array<[string, string, string]> = [
  ['Bootcamp', 'Intensive', 'Full-time weeks, one track, fastest route to a portfolio project.'],
  [
    'Part-time',
    'Evenings and weekends',
    'For people already working. Same curriculum, longer calendar.',
  ],
  [
    'Certificate',
    'Assessed',
    'Structured assessment and certification for a specific discipline.',
  ],
]

export const ENROLMENT: Array<[string, string]> = [
  [
    'Send the enrolment form',
    'Tell us the track you want, the format that fits your week, and where you are starting ' +
      'from. There is no entry exam.',
  ],
  [
    'Have a short conversation',
    'We confirm the track fits, agree a schedule, and answer whatever you want to ask about ' +
      'the teaching and the fees.',
  ],
  [
    'Start building',
    'You join the next cohort. Mentorship, project reviews and certification run through the ' +
      'programme, and placement help follows it.',
  ],
]
