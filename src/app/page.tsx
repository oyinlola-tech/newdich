import Link from 'next/link'

import { CASES } from '@/data/work'
import { PRACTICES } from '@/data/practices'
import { STATS } from '@/data/institute'
import { COMPANY } from '@/lib/site'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { Console } from '@/components/Console'
import { Gallery } from '@/components/Gallery'
import { CtaBand } from '@/components/CtaBand'
import { HeroArc } from '@/components/HeroArc'
import { Matrix } from '@/components/Matrix'
import {
  Arrow,
  Btn,
  Degrade,
  Dot,
  Glyph,
  Index,
  IndexRow,
  Label,
  Marker,
  Pill,
} from '@/components/ui'

export const metadata = pageMeta({
  title:
    'Newdich Technology — software, IoT, security and AI for systems that must be right',
  description:
    'Newdich Technology builds metering, payments, examination, queue and blockchain systems ' +
    'for fintech, government, schools and commerce in Nigeria — and trains engineers at ' +
    'Newdich Technology Institute.',
  path: ROUTES.home,
})

export default function HomePage() {
  return (
    <>
      {/* --------------------------------------------------------------
          The hero — design.md, Hero. Large type, a UI mockup and visible
          borders: the statement runs the page at true hero scale, a ruled
          rail states the figures under it, and the running instrument sits
          beneath as a shelf spanning the page. An instrument panel is wide,
          so the claim and the evidence read as one rack front rather than as
          a sentence with a sidebar.
          -------------------------------------------------------------- */}
      <section className="hero hero--stack">
        <HeroArc />
        <div className="wrap">
          {/* On a phone this block fills the viewport on its own, so the
              statement and its two actions are the whole first screen and the
              figures and the shelf are the reward for scrolling. */}
          <div className="hero-view">
            {/* A chip carrying a sentence of current state, not a tag. */}
            <div className="hero-chip">
              <Pill state="live">
                Two offices · Abuja and Okitipupa · building since {COMPANY.founded}
              </Pill>
            </div>

            <h1 className="display-hero">Systems that keep counting when the power fails.</h1>

            <div className="hero-lead">
              <p className="lede">
                We build metering, payments, examinations, queues and escrow for Nigerian field
                conditions — where the network drops, the power goes, and the number still has to
                survive an argument.
              </p>
              <div className="btns">
                <Btn href={ROUTES.contact} kind="solid">
                  Start a project
                </Btn>
                <Btn href={ROUTES.work}>See what we built</Btn>
              </div>
            </div>

            {/* Four figures, each traceable to a fact about the company. The
                logo wall a hero gallery would put here needs signed client
                references, and design.md forbids inventing them. On a phone
                this rail is what turns the first screen from a statement with
                space under it into a screen with content in it. */}
            <div className="hero-rail">
              <div>
                <b>{COMPANY.founded}</b>
                <Label>Founded</Label>
              </div>
              <div>
                <b>{PRACTICES.length}</b>
                <Label>Practices</Label>
              </div>
              <div>
                <b>{CASES.length}</b>
                <Label>Systems in production</Label>
              </div>
              <div>
                <b>{STATS[0]?.[0]}</b>
                <Label>Institute graduates</Label>
              </div>
            </div>
          </div>

          <div className="hero-shelf">
            <Console />
          </div>
        </div>
      </section>

      {/* --- the capability matrix ---------------------------------------- */}
      <section className="section section--alt">
        <div className="wrap">
          <Marker
            label={`${PRACTICES.length} practices · 5 sectors`}
            note="Filled where work has shipped"
          />
          <div className="grid">
            <div className="span-4">
              <h2>Where we have actually shipped.</h2>
              <p className="copy" style={{ marginTop: 'var(--s4)' }}>
                Seven practices across five sectors. The cells are filled only where a system is
                running in production, which is why the empty ones are the useful part of the
                table.
              </p>
              <div className="btns" style={{ marginTop: 'var(--s6)' }}>
                <Btn href={ROUTES.services}>All seven practices</Btn>
              </div>
            </div>
            <div className="span-8">
              <Matrix />
            </div>
          </div>
        </div>
      </section>

      {/* --- the work index ----------------------------------------------- */}
      <section className="section">
        <div className="wrap">
          <Marker label={`${CASES.length} systems`} note="Sector named, client not" />
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
          <div className="btns" style={{ marginTop: 'var(--s6)' }}>
            <Btn href={ROUTES.work}>Every case study</Btn>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------
          The gallery — design.md, Gallery. An oversized headline ringed by
          plates that hold still until the pointer arrives.
          -------------------------------------------------------------- */}
      <section className="section section--alt gallery">
        <div className="wrap">
          <Marker label="8 systems, drawn" note="No photography anywhere on this site" />
          <Gallery />
        </div>
      </section>

      {/* --- the practices index ------------------------------------------ */}
      <section className="section">
        <div className="wrap">
          <Marker label="Seven practices" note="One construction, a different facet lit" />
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

      {/* --- the degradation strip ---------------------------------------- */}
      <section className="section section--alt">
        <div className="wrap">
          <Degrade
            items={[
              [
                'What buffers',
                'Devices and terminals record locally and hold the reading with the time it was ' +
                  'taken, not the time it was sent.',
              ],
              [
                'What replays',
                'Uploads are idempotent and rate-limited on reconnect, so a replayed buffer is ' +
                  'never double counted.',
              ],
              [
                'What a user still sees',
                'The exam resumes on the question they left. The POS keeps selling. Anything ' +
                  'unmatched raises an exception rather than becoming an estimate.',
              ],
            ]}
          />
        </div>
      </section>

      {/* --- platforms and the Institute ---------------------------------- */}
      <section className="section">
        <div className="wrap">
          <Marker label="What we own and publish" note="MIT · Packagist · 12 territories" />
          <div className="rack rack--8-4">
            <Link className="tile tile--feature" href={ROUTES.lan}>
              <div className="tile-head">
                <Glyph cells={[0, 1]} />
                <h3>Newdich LAN</h3>
              </div>
              <p>
                Our own internet business. A merchant takes a protected territory from 300 m to
                3 km, resells inside it, and we run the platform, the billing and the support
                underneath.
              </p>
              <div className="tile-foot">
                <Arrow>The merchant and agent programmes</Arrow>
              </div>
            </Link>

            <Link className="tile" href={ROUTES.ansofra}>
              <div className="tile-head">
                <Glyph cells={[2]} />
                <h3>Ansofra</h3>
              </div>
              <p>
                The CQRS PHP framework we publish on Packagist under MIT. Two dependencies, and
                products instead of folders.
              </p>
              <div className="tile-foot">
                <Arrow>The framework</Arrow>
              </div>
            </Link>
          </div>

          <div className="rack rack--4-8" style={{ marginTop: 'var(--gutter)' }}>
            <Link className="tile" href={ROUTES.institute}>
              <div className="tile-head">
                <Glyph cells={[3]} />
                <h3>The Institute</h3>
              </div>
              <p>
                Six certification tracks, taught by engineers who work on the same systems.
                {' '}
                {STATS[0]?.[0]} graduates, {STATS[1]?.[0]} placement rate.
              </p>
              <div className="tile-foot">
                <Arrow>Tracks and enrolment</Arrow>
              </div>
            </Link>

            <div className="tile">
              <div className="tile-head">
                <Dot />
                <h3>How an engagement runs</h3>
              </div>
              <p>
                Discovery of one to three weeks producing a written design you own, then build in
                phases where a phase is the smallest slice a real user can finish end to end.
              </p>
              <div className="tile-foot">
                <Link className="arrow" href={ROUTES.process}>
                  Map, design, slice, harden, ship, hand over
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path d="M3 8h9M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
