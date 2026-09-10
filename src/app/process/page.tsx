import { ENGAGEMENTS, PROCESS } from '@/data/company'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { PageHero } from '@/components/PageHero'
import { Facts, Label, Marker, Spec, Steps } from '@/components/ui'

export const metadata = pageMeta({
  title: 'How we work — map, design, slice, harden, ship, hand over',
  description:
    'Discovery producing a written system design you own, build in phases where a phase is the ' +
    'smallest slice a real user can complete end to end, then a retainer or a clean handover.',
  path: ROUTES.process,
})

export default function ProcessPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], [null, 'How we work']]}
        label={`${PROCESS.length} steps · ${ENGAGEMENTS.length} engagement shapes`}
        title="Map, design, slice, harden, ship, hand over."
        lede="The order matters more than the ceremony. Most of the risk in a project is found in the first room, and most of the cost is created by skipping the third step."
      >
        <div className="panel">
          <header className="panel-head">
            <Label>Engagement · shape and duration</Label>
            <Label accent>You own every deliverable</Label>
          </header>
          <Spec rows={ENGAGEMENTS.map((e) => [e.name, `${e.shape} — ${e.note}`])} />
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Marker label={`${PROCESS.length} steps`} note="In this order, every time" />
          <Steps items={PROCESS.map(([t, n]) => [t, n])} />
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label={`${ENGAGEMENTS.length} engagement shapes`} note="Pick the one that fits" />
          <div className="rack rack--2">
            {ENGAGEMENTS.map((e) => (
              <div className="panel" key={e.name}>
                <header className="panel-head">
                  <Label>{e.name}</Label>
                  <Label accent>{e.shape}</Label>
                </header>
                <p className="copy" style={{ marginBottom: 'var(--s4)' }}>
                  {e.note}
                </p>
                <Facts items={e.gives} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Start with a discovery."
        note="One to three weeks, and you leave with a written system design, a risk register and a phased estimate — yours to take elsewhere if you would rather build it with somebody else."
      />
    </>
  )
}
