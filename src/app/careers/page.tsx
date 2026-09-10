import { HOW_TO_APPLY, ROLES, WHY_HERE } from '@/data/careers'
import { COMPANY } from '@/lib/site'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { PageHero } from '@/components/PageHero'
import { Facts, Index, IndexRow, Label, Marker, Spec, Steps } from '@/components/ui'

export const metadata = pageMeta({
  title: 'Careers — open roles and how we hire',
  description:
    'Backend, IoT, security and frontend engineering, plus Institute instructors. Two offices, ' +
    'remote-friendly weeks, and a paid exercise instead of whiteboard puzzles.',
  path: ROUTES.careers,
})

export default function CareersPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], [null, 'Careers']]}
        label={`${ROLES.length} roles · 2 offices`}
        title="Work that somebody has to be able to defend."
        lede="Meters that bill people, exams that decide places, ledgers that hold money. Every change here is read by somebody before it ships, and teaching on the Institute's tracks is part of the job rather than a favour."
      >
        <div className="panel">
          <header className="panel-head">
            <Label>Hiring · how it runs</Label>
            <Label accent>We reply either way</Label>
          </header>
          <Spec
            rows={[
              ['Where', 'Abuja and Okitipupa, remote-friendly weeks'],
              ['First step', 'CV and anything you have built, to ' + COMPANY.email],
              ['First conversation', '30 minutes on what you built and why you built it that way'],
              ['Exercise', 'Short, paid, close to real work — no whiteboard puzzles'],
            ]}
          />
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Marker label="Why here" note={`${WHY_HERE.length} honest reasons`} />
          <div className="rack rack--2">
            {WHY_HERE.map(([name, note]) => (
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
          <Marker label={`${ROLES.length} open roles`} note="Confirm terms in the first call" />
          <Index>
            {ROLES.map((r) => (
              <IndexRow
                key={r.slug}
                id={<Label>{r.terms}</Label>}
                title={r.title}
                note={r.note}
                aside={<Label>{r.place}</Label>}
              />
            ))}
          </Index>

          <div className="cards cards--2" style={{ marginTop: 'var(--s8)' }}>
            {ROLES.map((r) => (
              <article className="tile" key={r.slug} id={r.slug}>
                <header className="panel-head">
                  <Label>{r.practice}</Label>
                  <Label accent>{r.place}</Label>
                </header>
                <h3>{r.title}</h3>
                <p>{r.note}</p>
                <Facts items={r.wants} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Marker label="How to apply" note={`${HOW_TO_APPLY.length} steps`} />
          <Steps
            items={HOW_TO_APPLY.map((step, i) => [
              ['Send it', 'We reply', 'We talk', 'A paid exercise'][i] ?? 'Next',
              step,
            ])}
          />
        </div>
      </section>

      <CtaBand
        title="Send us what you have built."
        note={`CV and anything you have built to ${COMPANY.email}, with the role in the subject line. If it is a no, we will say so rather than leave you waiting.`}
        action={{ href: `mailto:${COMPANY.email}`, text: 'Email an application' }}
      />
    </>
  )
}
