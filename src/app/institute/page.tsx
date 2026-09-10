import {
  ENROLMENT,
  FORMATS,
  HOW_IT_RUNS,
  LOCATION,
  MENTORS,
  STATS,
  SUPPORT,
  TAGLINE,
  TRACKS,
} from '@/data/institute'
import { FAQ_GROUPS } from '@/data/faq'
import { COMPANY } from '@/lib/site'
import { pageMeta } from '@/lib/meta'
import { ROUTES, canonical } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { JsonLd, breadcrumbs } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import {
  Btn,
  Faq,
  Facts,
  Glyph,
  Index,
  IndexRow,
  Kv,
  Label,
  Marker,
  Person,
  Stats,
  Steps,
} from '@/components/ui'

export const metadata = pageMeta({
  title: 'Newdich Technology Institute — train, build, launch',
  description:
    'Six certification tracks — software engineering, data science, AI and machine learning, ' +
    'cybersecurity, IoT and robotics, blockchain and cloud — taught by engineers working in ' +
    'industry. 1,200+ graduates, 80% placement rate, training since 2014.',
  path: ROUTES.institute,
})

const instituteFaq = FAQ_GROUPS.find((g) => g.name === 'The Institute')

/**
 * The Institute as an EducationalOrganization, with each track declared as a
 * Course it offers. Fees and cohort dates are not published, so no `offers`
 * block is emitted — a price of zero would be a lie and an empty one is noise.
 */
const instituteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Newdich Technology Institute',
  url: canonical(COMPANY.domain, ROUTES.institute),
  parentOrganization: { '@type': 'Organization', name: COMPANY.name, url: `${COMPANY.domain}/` },
  slogan: TAGLINE,
  email: COMPANY.email,
  telephone: COMPANY.phone,
  foundingDate: '2016',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Okitipupa',
    addressRegion: 'Ondo',
    addressCountry: 'NG',
  },
  hasCourse: TRACKS.map((t) => ({
    '@type': 'Course',
    name: t.name,
    description: t.summary,
    provider: { '@type': 'EducationalOrganization', name: 'Newdich Technology Institute' },
    hasCourseInstance: FORMATS.map(([mode]) => ({
      '@type': 'CourseInstance',
      courseMode: mode === 'Bootcamp' ? 'full-time' : 'part-time',
      courseWorkload: mode,
    })),
  })),
}

export default function InstitutePage() {
  return (
    <>
      <JsonLd data={instituteJsonLd} />
      <JsonLd
        data={breadcrumbs([['Home', ROUTES.home], ['Institute', ROUTES.institute]])}
      />

      <PageHero
        trail={[['/', 'Home'], [null, 'Institute']]}
        label={`${TRACKS.length} tracks · ${TAGLINE}`}
        title="The school runs on the same projects the company does."
        lede="Newdich Technology Institute teaches six disciplines the way the practice works them: you ship a real system, an engineer who builds for a living reviews it, and you leave with the project as well as the certificate."
        actions={
          <>
            <Btn href={ROUTES.contact} kind="solid">
              Enrol on a track
            </Btn>
            <Btn href={ROUTES.careers}>Teach a cohort</Btn>
          </>
        }
      >
        <div className="panel">
          <header className="panel-head">
            <Label>Institute · published figures</Label>
            <Label accent>{LOCATION}</Label>
          </header>
          <Stats items={STATS} />
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Marker label={`${TRACKS.length} certification tracks`} note="Each one ships a project" />
          <Index>
            {TRACKS.map((t, i) => (
              <IndexRow
                key={t.name}
                id={
                  <>
                    <Glyph cells={t.glyph} size="sm" />
                    <Label>{String(i + 1).padStart(2, '0')}</Label>
                  </>
                }
                title={t.name}
                note={t.summary}
                aside={<Label>{t.modules.length} modules</Label>}
              />
            ))}
          </Index>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label="What each track builds" note="The project is what employers ask about" />
          <div className="cards cards--2">
            {TRACKS.map((t) => (
              <article className="tile" key={t.name}>
                <div className="tile-head">
                  <Glyph cells={t.glyph} />
                  <h3>{t.name}</h3>
                </div>
                <p>{t.builds}</p>
                <Facts items={t.modules} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="rack rack--8-4">
            <div>
              <Marker label={`${FORMATS.length} formats`} note="Same curriculum, different calendar" />
              <Kv rows={FORMATS.map(([name, shape, note]) => [`${name} · ${shape}`, note])} />
            </div>
            <div className="panel">
              <header className="panel-head">
                <Label>How it runs</Label>
              </header>
              <Facts items={HOW_IT_RUNS} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label="Support" note="Named on the Institute's own page" />
          <div className="rack rack--2">
            {SUPPORT.map(([name, note]) => (
              <div className="tile" key={name}>
                <h3>{name}</h3>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Marker label={`${MENTORS.length} mentors`} note="Working engineers, not career trainers" />
          <div className="cards cards--2">
            {MENTORS.map(([name, initials, role, note]) => (
              <Person key={name} name={name} initials={initials} role={role} note={note} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label="Enrolment" note="No entry exam" />
          <Steps items={ENROLMENT.map(([t, n]) => [t, n])} />
          <p className="small" style={{ marginTop: 'var(--s6)' }}>
            Fees, cohort dates and entry requirements are agreed in the conversation rather than
            published here — write to {COMPANY.email} or call {COMPANY.phoneDisplay} and we will
            tell you what the next cohort costs and when it starts.
          </p>
        </div>
      </section>

      {instituteFaq ? (
        <section className="section">
          <div className="wrap">
            <Marker label="Questions" note={`${instituteFaq.items.length} answered`} />
            <Faq items={instituteFaq.items} />
          </div>
        </section>
      ) : null}

      <CtaBand
        title="Take a track, or teach one."
        note="Tell us the discipline you want and the format that fits your week. We confirm the track is right for where you are starting from before you commit to anything."
        action={{ href: ROUTES.contact, text: 'Enrol on a track' }}
      />
    </>
  )
}
