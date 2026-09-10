import { ANSOFRA } from '@/data/products'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { Instrument } from '@/components/Instrument'
import { PageHero } from '@/components/PageHero'
import { Btn, Code, Index, IndexRow, Label, Marker, Spec } from '@/components/ui'

export const metadata = pageMeta({
  title: 'Ansofra — the CQRS PHP framework',
  description:
    'Ansofra is the CQRS PHP framework Newdich publishes on Packagist under MIT: commands and ' +
    'queries separated, products instead of folders, and two dependencies in total.',
  path: ROUTES.ansofra,
})

export default function AnsofraPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], ['/platforms', 'Platforms'], [null, 'Ansofra']]}
        label="MIT · Packagist · PHP 8.1+"
        title="Ansofra"
        lede="The framework we build much of our own work on, published so anyone can use it. Commands and queries stay apart, an application is a group of products rather than a tree of folders, and the dependency list is two lines long."
        actions={
          <>
            <Btn href={ANSOFRA.packagist} kind="solid" external>
              View on Packagist
            </Btn>
            <Btn href={ANSOFRA.repo} external>
              Source on GitHub
            </Btn>
          </>
        }
      >
        <Instrument
          art="architecture"
          label="Ansofra · request path"
          spec={[
            ['Edge', 'HTTP entry, routing into a product'],
            ['Gateway', 'Command or query — never both on one path'],
            ['Core', 'Handler, repository, event emit'],
            ['Surface', 'Response, mail, or a queued job'],
          ]}
          foot={['CQRS core', 'Product scaffolding', 'Two dependencies']}
        />
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="rack rack--8-4">
            <div>
              <Marker label="Why it exists" note="Rewritten scaffolding, once too often" />
              <div className="stack-lg">
                {ANSOFRA.why.map(([title, note]) => (
                  <div key={title}>
                    <h3>{title}</h3>
                    <p className="copy" style={{ marginTop: 'var(--s2)' }}>
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <header className="panel-head">
                <Label>Package</Label>
              </header>
              <Spec rows={ANSOFRA.spec.map(([k, v]) => [k, v])} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label="Install" note="One line" />
          <Code caption="composer" code={ANSOFRA.install} />
          <div style={{ marginTop: 'var(--gutter)' }}>
            <Code caption="A command, end to end" code={ANSOFRA.quickstart} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Marker label="Roadmap" note="Shipped, in development, planned" />
          <Index>
            {ANSOFRA.roadmap.map(([state, note], i) => (
              <IndexRow
                key={note}
                id={<Label>{String(i + 1).padStart(2, '0')}</Label>}
                title={note}
                aside={<Label accent={state === 'Shipped'}>{state}</Label>}
              />
            ))}
          </Index>
        </div>
      </section>

      <CtaBand
        title="Building on Ansofra?"
        note="We will say plainly when your project is better served by something else. When it is not, we can review the design, take a workstream, or build the whole thing."
      />
    </>
  )
}
