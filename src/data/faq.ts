/**
 * Frequently asked questions, grouped. Answers are plain and specific; where
 * an answer depends on commercial terms the company must confirm, it says what
 * it depends on rather than inventing a number.
 */

export type FaqGroup = {
  name: string
  items: Array<[string, string]>
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    name: 'Working with us',
    items: [
      [
        'How do projects usually start?',
        'With a discovery of one to three weeks. We map the system, the constraints and the ' +
          'risks, and produce a written design and a phased estimate. It is a deliverable you ' +
          'own — you can take it to another firm if you would rather build it elsewhere.',
      ],
      [
        'What does a first phase look like?',
        'The smallest slice a real user can complete end to end, running on real ' +
          'infrastructure. It is the only estimate anyone should trust, and it surfaces the ' +
          'integration problems while they are still cheap to fix.',
      ],
      [
        'Can you work with our existing team?',
        'Yes. A good deal of our work is joining an in-house team — reviewing the ' +
          'architecture, taking a workstream, or doing the parts nobody has bandwidth for.',
      ],
      [
        'Do you take over systems somebody else built?',
        'Regularly. We start with an audit: what runs, what it depends on, where the risks ' +
          'are, and what it would cost to make it safe to change. You get that assessment ' +
          'whether or not you continue with us.',
      ],
    ],
  },
  {
    name: 'Delivery and handover',
    items: [
      [
        'Who owns the code?',
        'You do, from the first commit. The repository, the pipeline and the documentation ' +
          'are yours, and handover is scheduled work in the plan rather than a favour at the ' +
          'end.',
      ],
      [
        'How do we see progress?',
        'Working software every phase and a demo every fortnight, against the design document ' +
          'agreed at the start. Status reports are not a substitute for a running system.',
      ],
      [
        'What happens after launch?',
        'Either a monthly retainer — support, monitoring, updates and a named engineer who ' +
          'knows your system — or a clean handover to your own team. Both are normal endings, ' +
          'and we will tell you which one we think fits.',
      ],
      [
        'Do you sign NDAs?',
        'Yes, before anything confidential is shared. For public-sector work we can also work ' +
          'within your procurement documentation.',
      ],
    ],
  },
  {
    name: 'Technical',
    items: [
      [
        'What is Ansofra, and do we have to use it?',
        'Ansofra is the PHP framework we publish on Packagist under MIT and build much of our ' +
          'own work on. You are not required to use it, and we will say plainly when your ' +
          'project is better served by something else.',
      ],
      [
        'Can it work without a reliable internet connection?',
        'That is the assumption we design under. Devices buffer locally, uploads are ' +
          'idempotent, and reconciliation catches whatever the network missed. Our LAN ' +
          'point-of-sale runs entirely on a merchant’s own network.',
      ],
      [
        'How do you handle security?',
        'Threat modelling before the build, review during it, and testing against it ' +
          'afterwards. For systems handling money or identity we also expect an independent ' +
          'test — sometimes ours, sometimes somebody else’s.',
      ],
      [
        'Where is our data hosted?',
        'Wherever your requirements say. We deploy to cloud regions, to on-premise hardware, ' +
          'and to a mix where a public office needs the data to stay in the building.',
      ],
    ],
  },
  {
    name: 'The Institute',
    items: [
      [
        'Who are the courses for?',
        'Beginners moving into tech, and working professionals adding a discipline. Each of ' +
          'the six tracks runs as a bootcamp, a part-time course or a professional certificate.',
      ],
      [
        'Is it remote?',
        'Schedules are flexible and remote-friendly, with in-person teaching from both ' +
          'offices. Tell us which format fits your week when you apply.',
      ],
      [
        'Do you help with placement?',
        'Yes — placement help and career guidance are part of the programme. The company’s ' +
          'published figure is an 80% placement rate across graduates to date.',
      ],
      [
        'What do I leave with?',
        'A certificate, and a project you built and can show. The project is the part ' +
          'employers ask about.',
      ],
    ],
  },
]
