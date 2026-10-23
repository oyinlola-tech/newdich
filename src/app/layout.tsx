import type { Metadata, Viewport } from 'next'

import '@/styles/01-tokens.css'
import '@/styles/02-base.css'
import '@/styles/03-type.css'
import '@/styles/04-layout.css'
import '@/styles/05-nav.css'
import '@/styles/06-buttons.css'
import '@/styles/07-panel.css'
import '@/styles/08-index.css'
import '@/styles/09-instrument.css'
import '@/styles/10-content.css'
import '@/styles/11-forms.css'
import '@/styles/12-footer.css'
import '@/styles/13-motion.css'
import '@/styles/14-hero.css'
import '@/styles/15-error.css'
import '@/styles/16-gallery.css'
import '@/styles/17-filmstrip.css'

import { COMPANY, ORG_JSONLD } from '@/lib/site'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { Nav } from '@/components/Nav'
import { Reveal } from '@/components/Reveal'
import { ThemeScript } from '@/components/ThemeScript'


const FONTS =
  'https://fonts.googleapis.com/css2' +
  '?family=Anybody:wdth,wght@100..150,400..800' +
  '&family=Martian+Mono:wdth,wght@75..112.5,400..700' +
  '&family=Public+Sans:wght@400;500;600;700' +
  '&display=swap'

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.domain),
  title: {
    default:
      'Newdich Technology — software, IoT, security and AI for systems that must be right',
    template: '%s | Newdich Technology',
  },
  description:
    'Newdich Technology builds metering, payments, examination, queue and blockchain systems ' +
    'for fintech, government, schools and commerce in Nigeria — and trains engineers at ' +
    'Newdich Technology Institute.',
  applicationName: COMPANY.name,
  icons: { icon: '/mark.svg', apple: '/newdich.png' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#04070B' },
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <html lang="en-NG" className="js" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
        <ThemeScript />
        
        <JsonLd data={ORG_JSONLD} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
      </body>
    </html>
  )
}
