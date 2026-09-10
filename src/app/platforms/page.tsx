import { APPSTORE_ITEMS, PRODUCTS } from '@/data/products'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { Instrument } from '@/components/Instrument'
import { PageHero } from '@/components/PageHero'
import { Btn, Facts, Glyph, Index, IndexRow, Label, Marker } from '@/components/ui'

export const metadata = pageMeta({
  title: 'Platforms & products',
  description:
    'Newdich LAN, Ansofra — the CQRS PHP framework we publish on Packagist — the Newdich App ' +
    'Store, and the library of systems we configure and deploy for clients.',
  path: ROUTES.platforms,
})

export default function PlatformsPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], [null, 'Platforms']]}
        label={`${PRODUCTS.length} products · 2 platforms`}
        title="What we own, and what we publish."
        lede="Two things we run ourselves — a local internet business and a PHP framework — and a library of systems we configure and deploy rather than rebuild from nothing each time."
      >
        <Instrument
          art="lan"
          label="Territory · LAN C3KM"
          spec={[
            ['Coverage', '300 m to 3 km, sold in 300 m steps'],
            ['Overlap', 'None — a territory is verified before it is issued'],
            ['Operated by', 'Newdich; the merchant sells, we run the platform'],
            ['Payouts', 'Weekly, with the dashboard showing what is owed and why'],
          ]}
          foot={['Merchant programme', 'Agent programme', 'KYC before payout']}
        />
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Marker label="Platforms we run" note="Owned, not resold" />
          <div className="rack rack--2">
            <a className="tile tile--feature" href={ROUTES.lan}>
              <div className="tile-head">
                <Glyph cells={[0, 1]} />
                <h3>Newdich LAN</h3>
              </div>
              <p>
                A merchant takes a protected territory, resells internet inside it, and we run the
                platform, the billing and the support underneath. Agents refer with a code
                instead.
              </p>
              <div className="tile-foot">
                <Label accent>Territories, packages and payouts</Label>
              </div>
            </a>
            <a className="tile" href={ROUTES.ansofra}>
              <div className="tile-head">
                <Glyph cells={[2]} />
                <h3>Ansofra</h3>
              </div>
              <p>
                The CQRS PHP framework we publish on Packagist under MIT. Commands and queries
                separated, products instead of folders, and two dependencies in total.
              </p>
              <div className="tile-foot">
                <Label accent>The framework</Label>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Marker label={`${PRODUCTS.length} in the library`} note="Configured and deployed, not rebuilt" />
          <Index>
            {PRODUCTS.map(([kind, name, note, glyph]) => (
              <IndexRow
                key={name}
                id={
                  <>
                    <Glyph cells={glyph} size="sm" />
                    <Label>{kind}</Label>
                  </>
                }
                title={name}
                note={note}
              />
            ))}
          </Index>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="rack rack--4-8">
            <div>
              <h2>The App Store.</h2>
              <p className="copy" style={{ marginTop: 'var(--s4)' }}>
                Where the company publishes what it has built for itself, and what clients have
                agreed can be sold on.
              </p>
              <div className="btns" style={{ marginTop: 'var(--s6)' }}>
                <Btn href={ROUTES.contact}>Ask what is available</Btn>
              </div>
            </div>
            <div className="panel">
              <header className="panel-head">
                <Label>{APPSTORE_ITEMS.length} categories</Label>
              </header>
              <Facts items={APPSTORE_ITEMS} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
