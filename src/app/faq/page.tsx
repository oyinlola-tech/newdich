import { FAQ_GROUPS } from '@/data/faq'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { JsonLd, breadcrumbs, faqPage } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { Faq, Label, Marker, Spec } from '@/components/ui'

export const metadata = pageMeta({
  title: 'FAQ — the questions clients ask first',
  description:
    'How projects start, who owns the code, what happens after launch, whether it works without ' +
    'a reliable connection, and how the Institute runs.',
  path: ROUTES.faq,
})

const total = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0)

export default function FaqPage() {
  const everyQuestion = FAQ_GROUPS.flatMap((g) => g.items)

  return (
    <>
      <JsonLd data={faqPage(everyQuestion)} />
      <JsonLd data={breadcrumbs([['Home', ROUTES.home], ['FAQ', ROUTES.faq]])} />

      {/* A company page has no system to show, so it opens with its own spec
          rather than an instrument. An instrument with no reading is
          decoration — design.md, Overview. */}
      <PageHero
        trail={[['/', 'Home'], [null, 'FAQ']]}
        label={`${total} questions · ${FAQ_GROUPS.length} groups`}
        title="The questions clients ask first."
        lede="Answered plainly. Where an answer depends on commercial terms we have not agreed yet, it says what it depends on rather than inventing a number."
      >
        <div className="panel">
          <header className="panel-head">
            <Label>Index</Label>
            <Label accent>{total} answered</Label>
          </header>
          <Spec
            rows={FAQ_GROUPS.map((g) => [g.name, `${g.items.length} questions`])}
          />
        </div>
      </PageHero>

      {FAQ_GROUPS.map((group, i) => (
        <section className={i % 2 === 0 ? 'section' : 'section section--alt'} key={group.name}>
          <div className="wrap">
            <Marker label={group.name} note={`${group.items.length} questions`} />
            <Faq items={group.items} />
          </div>
        </section>
      ))}

      <CtaBand
        title="Not answered here?"
        note="Ask it directly. If the answer depends on something we have not seen yet, we will tell you what we would need to look at rather than guess."
      />
    </>
  )
}
