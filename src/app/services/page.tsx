import { CLOUD, PRACTICES, SECTORS } from '@/data/practices'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { Instrument } from '@/components/Instrument'
import { Matrix } from '@/components/Matrix'
import { PageHero } from '@/components/PageHero'
import { Glyph, Index, IndexRow, Kv, Label, Marker } from '@/components/ui'

export const metadata = pageMeta({
  title: 'Services — seven engineering practices',
  description:
    'Software engineering, IoT and robotics, cybersecurity, blockchain and Web3, artificial ' +
    'intelligence, data science and game development, plus the cloud infrastructure under all ' +
    'seven.',
  path: ROUTES.services,
})

export default function ServicesPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], [null, 'Services']]}
        label={`${PRACTICES.length} practices · 5 sectors`}
        title="Seven practices, one construction."
        lede="Each practice is the same engineering discipline pointed at a different problem: write the design down, build the smallest slice that works end to end, and assume the field will interrupt it."
      >
        <Instrument
          art="architecture"
          label="System shape · every Newdich build"
          spec={[
            ['Edge', 'Meters, terminals, sensors — recording locally before anything is sent'],
            ['Gateway', 'APIs, auth, rate limits, idempotency keys'],
            ['Core', 'Ledger, rules, workflows — append-only where money or marks move'],
            ['Surface', 'Dashboards, apps and reports for the people who run it'],
          ]}
          foot={[
            'Observability spans all four',
            'Backups span all four',
            'Deployment spans all four',
          ]}
        />
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Marker label={`${PRACTICES.length} practices`} note="A different facet lit each time" />
          <Index>
            {PRACTICES.map((p) => (
              <IndexRow
                key={p.slug}
                href={p.url}
                id={
                  <>
                    <Glyph cells={p.glyph} size="sm" />
                    <Label>{p.short}</Label>
                  </>
                }
                title={p.title}
                note={p.blurb}
              />
            ))}
          </Index>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label="Cloud and infrastructure" note="Under all seven practices" />
          <div className="rack rack--4-8">
            <div>
              <h2>The layer nobody buys on its own.</h2>
              <p className="copy" style={{ marginTop: 'var(--s4)' }}>
                Every practice above ships onto the same substrate. It is not a separate
                engagement; it is the reason a deployment can be handed over and still run.
              </p>
            </div>
            <div className="panel">
              <Kv rows={CLOUD.map(([k, v]) => [k, v])} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Marker label="5 sectors" note="Where the work has landed" />
          <Index>
            {SECTORS.map(([name, note], i) => (
              <IndexRow
                key={name}
                id={<Label>{String(i + 1).padStart(2, '0')}</Label>}
                title={name}
                note={note}
              />
            ))}
          </Index>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label="Capability matrix" note="Filled where work has shipped" />
          <Matrix />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
