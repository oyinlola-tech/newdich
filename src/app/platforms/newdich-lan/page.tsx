import {
  AGENT_COMMISSION,
  AGENT_EXAMPLE,
  AGENT_STEPS,
  AGENT_SUMMARY,
  CURRENCIES,
  KYC_IDS,
  LAN_FAQ,
  MERCHANT_EXAMPLE,
  MERCHANT_PROMISES,
  MERCHANT_STEPS,
  PACKAGES,
  RATE_PER_STEP,
  SITE,
  STEP_METRES,
  SUMMARY,
  TAGLINE,
  coverageLabel,
  naira,
} from '@/data/lan'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { Instrument } from '@/components/Instrument'
import { PageHero } from '@/components/PageHero'
import { Btn, Facts, Faq, Kv, Label, Marker, Steps } from '@/components/ui'

export const metadata = pageMeta({
  title: 'Newdich LAN — protected territories from 300 m to 3 km',
  description:
    'Newdich LAN is the local internet business Newdich owns and operates. A merchant takes a ' +
    'protected territory and resells inside it; agents refer with a code. Packages run from ' +
    '300 m to 3 km of coverage.',
  path: ROUTES.lan,
})

export default function LanPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], ['/platforms', 'Platforms'], [null, 'Newdich LAN']]}
        label={`${PACKAGES.length} packages · 300 m to 3 km`}
        title={TAGLINE}
        lede={SUMMARY}
        actions={
          <>
            <Btn href={SITE} kind="solid" external>
              Apply on the LAN site
            </Btn>
            <Btn href={ROUTES.contact}>Ask us about it</Btn>
          </>
        }
      >
        <Instrument
          art="lan"
          label="Territory · LAN C3KM"
          spec={[
            ['Coverage', '3,000 m radius, the largest package'],
            ['Sized for', '6,000 users'],
            ['Overlap', 'None — a territory is verified before it is issued'],
            ['Rate', `${naira(RATE_PER_STEP)} per ${STEP_METRES} m of coverage, every tier`],
          ]}
          foot={['Verified in 24 hours', 'Weekly payouts', 'Platform run by Newdich']}
        />
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Marker label="The merchant programme" note="A territory of your own" />
          <Steps items={MERCHANT_STEPS.map(([t, n]) => [t, n])} />
          <div className="rack rack--2" style={{ marginTop: 'var(--s7)' }}>
            {MERCHANT_PROMISES.map(([name, note]) => (
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
          <Marker
            label={`${PACKAGES.length} packages`}
            note={`${naira(RATE_PER_STEP)} per ${STEP_METRES} m`}
          />
          <div className="matrix-wrap">
            <table className="matrix">
              <caption>Coverage packages · price set by Newdich LAN and subject to change</caption>
              <thead>
                <tr>
                  <th scope="col">Package</th>
                  <th scope="col">Coverage</th>
                  <th scope="col">Sized for</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {PACKAGES.map((p) => (
                  <tr key={p.name}>
                    <th scope="row">{p.name}</th>
                    <td>{coverageLabel(p.metres)}</td>
                    <td>{p.people.toLocaleString('en-NG')} users</td>
                    <td>{naira(p.naira)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small matrix-hint">
            Every tier is the same rate — {naira(RATE_PER_STEP)} per {STEP_METRES} m of coverage.
            Pricing is set by Newdich LAN and can change; the live list is on{' '}
            <a className="link" href={SITE} target="_blank" rel="noreferrer noopener">
              the LAN site
            </a>
            .
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Marker label="The agent programme" note="A code, not a territory" />
          <div className="rack rack--8-4">
            <div>
              <p className="copy">{AGENT_SUMMARY}</p>
              <div style={{ marginTop: 'var(--s6)' }}>
                <Steps items={AGENT_STEPS.map(([t, n]) => [t, n])} />
              </div>
            </div>
            <div className="panel">
              <header className="panel-head">
                <Label>Commission</Label>
              </header>
              <p className="small">{AGENT_COMMISSION}</p>
              <footer className="panel-foot">
                <Label>KYC accepted</Label>
              </footer>
              <Facts items={KYC_IDS} />
            </div>
          </div>
        </div>
      </section>

      {/* The LAN site labels these as projections rather than results, and so
          does this page. design.md forbids presenting a projection as an
          outcome. */}
      <section className="section section--alt">
        <div className="wrap">
          <Marker label="Worked examples" note="Projections, not results" />
          <div className="rack rack--2">
            <div className="panel">
              <header className="panel-head">
                <Label>Merchant · worked example</Label>
                <Label>Projection</Label>
              </header>
              <Kv rows={MERCHANT_EXAMPLE.map(([k, v]) => [k, v])} />
            </div>
            <div className="panel">
              <header className="panel-head">
                <Label>Agent · worked example</Label>
                <Label>Projection</Label>
              </header>
              <Kv rows={AGENT_EXAMPLE.map(([k, v]) => [k, v])} />
            </div>
          </div>
          <p className="small matrix-hint">
            Both figures are published by Newdich LAN as worked examples of how revenue and
            commission can grow. They are not outcomes, and nothing here promises them.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="rack rack--4-8">
            <div className="panel">
              <header className="panel-head">
                <Label>Currencies accepted</Label>
              </header>
              <Facts items={CURRENCIES} />
            </div>
            <div>
              <Marker label="Questions" note="From the LAN site" />
              <Faq items={LAN_FAQ} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Take a territory, or refer into one."
        note="Merchants are onboarded within one to two business days after verification. Agents need KYC and a payout account, and nothing else."
        action={{ href: ROUTES.contact, text: 'Talk to us about LAN' }}
      />
    </>
  )
}
