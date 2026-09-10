import { ARTICLES } from '@/data/insights'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { PageHero } from '@/components/PageHero'
import { Index, IndexRow, Label, Marker, Spec } from '@/components/ui'

export const metadata = pageMeta({
  title: 'Insights — writing from the practice',
  description:
    'Offline-first design for Nigerian deployments, why a payment system needs a ledger rather ' +
    'than a status column, and the checklist we work through before an exam day.',
  path: ROUTES.insights,
})

export default function InsightsPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], [null, 'Insights']]}
        label={`${ARTICLES.length} pieces · from the practice`}
        title="Writing from the work, not around it."
        lede="Each of these came out of a system that had to survive something — a dropped link, a disputed transaction, a power cut in the middle of a paper."
      >
        <div className="panel">
          <header className="panel-head">
            <Label>Index</Label>
            <Label accent>{ARTICLES.length} pieces</Label>
          </header>
          <Spec
            rows={ARTICLES.map((a) => [a.displayDate, `${a.title} · ${a.minutes} min`])}
          />
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Marker label={`${ARTICLES.length} pieces`} note="Newest first" />
          <Index>
            {ARTICLES.map((a) => (
              <IndexRow
                key={a.slug}
                href={a.url}
                id={<Label>{a.displayDate}</Label>}
                title={a.title}
                note={a.dek}
                aside={
                  <Label>
                    {a.tag} · {a.minutes} min
                  </Label>
                }
              />
            ))}
          </Index>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
