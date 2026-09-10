import { GROUPS, SHOTS, shotUrl } from '@/data/gallery'
import { STATS, TRACKS } from '@/data/institute'
import { COMPANY } from '@/lib/site'
import { pageMeta } from '@/lib/meta'
import { ROUTES, canonical } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { Filmstrip } from '@/components/Filmstrip'
import { JsonLd, breadcrumbs } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { Btn, Label, Marker, Stats } from '@/components/ui'

export const metadata = pageMeta({
  title: 'Gallery — Newdich Technology Institute in session',
  description:
    'Photographs of Newdich Technology Institute in Okitipupa: classes in session, project ' +
    'reviews, certification days and the engineers who teach there. 1,200+ graduates since 2014.',
  path: ROUTES.gallery,
  image: shotUrl('lecture3.jpg'),
})

/**
 * An ImageGallery with every photograph declared, so the pictures are
 * indexable in their own right rather than being twelve anonymous <img> tags
 * inside a scroller.
 */
const galleryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Newdich Technology Institute — gallery',
  description:
    'Photographs of Newdich Technology Institute in Okitipupa, Ondo State: teaching, ' +
    'graduation, and the engineers who teach there.',
  url: canonical(COMPANY.domain, ROUTES.gallery),
  isPartOf: { '@type': 'WebSite', name: COMPANY.name, url: `${COMPANY.domain}/` },
  about: {
    '@type': 'EducationalOrganization',
    name: 'Newdich Technology Institute',
    url: canonical(COMPANY.domain, ROUTES.institute),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Okitipupa',
      addressRegion: 'Ondo',
      addressCountry: 'NG',
    },
  },
  image: SHOTS.map((s) => ({
    '@type': 'ImageObject',
    contentUrl: `${COMPANY.domain}${shotUrl(s.file)}`,
    caption: s.caption,
    description: s.alt,
    width: s.w,
    height: s.h,
    creditText: COMPANY.name,
    copyrightNotice: `© ${COMPANY.name}`,
  })),
}

export default function GalleryPage() {
  const counts = GROUPS.map(
    (g) => [g, SHOTS.filter((s) => s.group === g).length] as [string, number],
  )

  return (
    <>
      <JsonLd data={galleryJsonLd} />
      <JsonLd
        data={breadcrumbs([
          ['Home', ROUTES.home],
          ['Institute', ROUTES.institute],
          ['Gallery', ROUTES.gallery],
        ])}
      />

      <PageHero
        trail={[['/', 'Home'], ['/institute', 'Institute'], [null, 'Gallery']]}
        label={`${SHOTS.length} photographs · Okitipupa`}
        title="The school, photographed."
        lede="Everything else on this site is drawn, because a drawing of a metering pipeline says more than a photograph of one. The Institute is the exception: a room full of people learning is the thing itself, and no illustration improves on it."
        actions={
          <>
            <Btn href={ROUTES.institute} kind="solid">
              Tracks and enrolment
            </Btn>
            <Btn href={ROUTES.contact}>Enrol on a track</Btn>
          </>
        }
      >
        <Filmstrip />
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Marker
            label={counts.map(([g, n]) => `${n} ${g.toLowerCase()}`).join(' · ')}
            note="Newdich’s own photographs, not stock"
          />
          <div className="rack rack--8-4">
            <div>
              <h2>Taught by engineers who ship.</h2>
              <p className="copy" style={{ marginTop: 'var(--s4)' }}>
                The Institute runs on the same projects the practice does. The people in these
                photographs are reviewing work that has to survive a power cut and a billing
                dispute, which is why the teaching is project-first and the certificate comes
                with something you built.
              </p>
              <p className="copy" style={{ marginTop: 'var(--s4)' }}>
                {TRACKS.length} certification tracks, taught in Okitipupa and remote-friendly,
                as bootcamps, part-time courses or assessed certificates.
              </p>
            </div>
            <div className="panel">
              <header className="panel-head">
                <Label>Institute · published figures</Label>
              </header>
              <Stats items={STATS} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Come and learn where the work is."
        note="Tell us the track you want and the format that fits your week. We confirm it is right for where you are starting from before you commit to anything."
        action={{ href: ROUTES.contact, text: 'Enrol on a track' }}
      />
    </>
  )
}
