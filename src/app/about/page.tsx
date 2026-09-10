import { OFFICE_NOTES, TEAM, TIMELINE, VALUES } from '@/data/company'
import { CASES } from '@/data/work'
import { PRACTICES } from '@/data/practices'
import { STATS } from '@/data/institute'
import { COMPANY, PHONE_DISPLAY } from '@/lib/site'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { Matrix } from '@/components/Matrix'
import { PageHero } from '@/components/PageHero'
import { Glyph, Index, IndexRow, Label, Marker, Person, Spec, Stats } from '@/components/ui'

export const metadata = pageMeta({
  title: 'About — twelve years, two offices, seven practices',
  description:
    'Newdich Technology has built software since 2014 from Okitipupa and Abuja: metering, ' +
    'payments, examinations, queues, identity and escrow, plus a framework and a school.',
  path: ROUTES.about,
})

export default function AboutPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], [null, 'About']]}
        label={`Since ${COMPANY.founded} · 2 offices`}
        title="A firm that builds the things people argue about."
        lede="Meters that bill, exams that decide places, ledgers that hold money. Everything here has to be right when somebody checks it, which is a narrower brief than 'software company' and the reason the capability matrix has gaps in it."
      >
        <div className="panel">
          <header className="panel-head">
            <Label>Company · at a glance</Label>
            <Label accent>Abuja · Okitipupa</Label>
          </header>
          <Stats
            items={[
              [COMPANY.founded, 'Founded'],
              [String(PRACTICES.length), 'Practices'],
              [String(CASES.length), 'Systems shipped'],
              [STATS[0]?.[0] ?? '1,200+', 'Institute graduates'],
            ]}
          />
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Marker label={`${VALUES.length} values`} note="How a decision gets made here" />
          <div className="rack rack--2">
            {VALUES.map(([name, note]) => (
              <div className="tile" key={name}>
                <h3>{name}</h3>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label={`${TIMELINE.length} marks`} note={`${COMPANY.founded} to 2026`} />
          <Index>
            {TIMELINE.map(([year, title, note]) => (
              <IndexRow
                key={year}
                id={<Label>{year}</Label>}
                title={title}
                note={note}
              />
            ))}
          </Index>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Marker label={`${TEAM.length} people`} note="Who you will actually work with" />
          <div className="cards cards--2">
            {TEAM.map(([name, initials, role, note]) => (
              <Person key={name} name={name} initials={initials} role={role} note={note} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="rack rack--8-4">
            <div>
              <Marker label="Two offices" note="One head office, one origin" />
              <div className="rack rack--2">
                {OFFICE_NOTES.map(([city, region, note, glyph]) => (
                  <div className="tile" key={city}>
                    <div className="tile-head">
                      <Glyph cells={glyph} />
                      <h3>{city}</h3>
                    </div>
                    <p className="role">{region}</p>
                    <p>{note}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <header className="panel-head">
                <Label>Reach us</Label>
              </header>
              <Spec
                rows={[
                  ['Email', <a className="link" href={`mailto:${COMPANY.email}`} key="e">{COMPANY.email}</a>],
                  ['Phone', <a className="link" href={`tel:${COMPANY.phone}`} key="p">{PHONE_DISPLAY}</a>],
                  ['WhatsApp', <a className="link" href={COMPANY.whatsapp} key="w" target="_blank" rel="noreferrer noopener">Message us</a>],
                  ['Reply time', 'Within 24 hours'],
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Marker label="What we can and cannot do" note="The gaps are the point" />
          <Matrix />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
