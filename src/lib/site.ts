

export const COMPANY = {
  name: 'Newdich Technology',
  short: 'Newdich',
  tagline: 'Engineering · IoT · AI · Training',
  founded: '2014',
  
  phone: '+2348070560103',
  email: 'newdichngr@gmail.com',
  domain: 'https://newdich.tech',
  whatsapp: 'https://wa.me/2348070560103',
  offices: [
    { city: 'Abuja', region: 'Federal Capital Territory', note: 'Head office.' },
    { city: 'Okitipupa', region: 'Ondo State', note: 'Second office.' },
  ],
} as const


export const PHONE_DISPLAY = COMPANY.phone.replace(
  /^(\+\d{3})(\d{3})(\d{3})(\d{4})$/,
  '$1 $2 $3 $4',
)

export const SOCIALS = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/newdichtechnology',
    handle: '/company/newdichtechnology',
  },
  { name: 'X', url: 'https://x.com/newdichtech', handle: '@newdichtech' },
  { name: 'Facebook', url: 'https://facebook.com/newdich', handle: '/newdich' },
] as const

export const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Newdich Technology',
  url: 'https://newdich.tech/',
  logo: 'https://newdich.tech/newdich.png',
  foundingDate: '2014',
  email: 'newdichngr@gmail.com',
  telephone: COMPANY.phone,
  address: [
    { '@type': 'PostalAddress', addressLocality: 'Abuja', addressCountry: 'NG' },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Okitipupa',
      addressRegion: 'Ondo',
      addressCountry: 'NG',
    },
  ],
  sameAs: [
    'https://www.linkedin.com/company/newdichtechnology',
    'https://x.com/newdichtech',
    'https://facebook.com/newdich',
  ],
  description:
    'Newdich Technology builds software, IoT and robotics, blockchain/Web3 applications, games, cybersecurity, data science, AI, cloud and networking — and trains tech talent at Newdich Technology Institute.',
} as const
