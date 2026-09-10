import { CASES } from '@/data/work'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { CtaBand } from '@/components/CtaBand'
import { Instrument } from '@/components/Instrument'
import { PageHero } from '@/components/PageHero'
import { Arrow, Degrade, Glyph, Index, IndexRow, Label, Marker } from '@/components/ui'

export const metadata = pageMeta({
  title: 'Work — case studies',
  description:
    'Metering, payments and reconciliation, CBT examinations, smart queues, P2P escrow and ' +
    'identity verification: what we built, and the engineering decisions behind it.',
  path: ROUTES.work,
})

export default function WorkPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], [null, 'Work']]}
        label={`${CASES.length} systems · in production`}
        title="Six systems, and the decisions behind them."
        lede="Each one names the sector and the system, never the customer — until a signed reference exists, a client name on a website is somebody else's property."
      >
        <Instrument
          art="meter"
          label="Consumption · feeder 04"
          spec={[
            ['Sector', 'Utilities and government'],
            ['Shape', 'Edge devices → ingest → time-series → dashboard'],
            ['Field constraint', 'Intermittent GSM, frequent power loss'],
            ['Exceptions', 'Raised for review, never quietly estimated'],
          ]}
          foot={['Buffers on power loss', 'Replays on reconnect', 'Idempotent ingest']}
        />
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Marker label={`${CASES.length} case studies`} note="Sector named, client not" />
          <Index>
            {CASES.map((c, i) => (
              <IndexRow
                key={c.slug}
                href={c.url}
                id={
                  <>
                    <Glyph cells={[i % 4]} size="sm" />
                    <Label>{String(i + 1).padStart(2, '0')}</Label>
                  </>
                }
                title={c.title}
                note={c.summary}
                aside={
                  <>
                    <Label>{c.sector}</Label>
                    <Arrow>{''}</Arrow>
                  </>
                }
              />
            ))}
          </Index>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Degrade
            items={[
              [
                'What buffers',
                'Every one of these systems records locally first and carries the time the ' +
                  'event happened, not the time it was received.',
              ],
              [
                'What replays',
                'Ingest is idempotent everywhere, so a replayed buffer is never counted twice.',
              ],
              [
                'What a user still sees',
                'A candidate resumes on the question they left; a merchant keeps selling; a ' +
                  'trade shows both sides the same timer.',
              ],
            ]}
          />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
