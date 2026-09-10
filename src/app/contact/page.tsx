import { COMPANY, SOCIALS } from '@/lib/site'
import { OFFICE_NOTES } from '@/data/company'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { ContactForm } from '@/components/ContactForm'
import { PageHero } from '@/components/PageHero'
import { Glyph, Label, Marker, Spec } from '@/components/ui'

export const metadata = pageMeta({
  title: 'Contact — two offices, one form, a 24-hour reply',
  description:
    'Tell us the system, who depends on it, and the condition it has to survive. Abuja and ' +
    'Okitipupa, or by email, phone and WhatsApp.',
  path: ROUTES.contact,
})

export default function ContactPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], [null, 'Contact']]}
        label="2 offices · 24-hour reply"
        title="Tell us what has to be right."
        lede="The useful first message is not a requirements document. It is the system, who depends on it, and the condition it has to survive — a bad network, a power cut, an audit six months later."
      />

      <section className="section">
        <div className="wrap">
          <div className="grid">
            <div className="span-7">
              {/* The contact page's CTA is the form itself. A page that already
                  is the action does not need a band telling you to take it —
                  design.md, Call to action. */}
              <Marker label="Project enquiry" note="Reply within 24 hours" />
              <ContactForm />
            </div>

            <div className="span-4 start-9 stack-lg">
              <div className="panel">
                <header className="panel-head">
                  <Label>Direct</Label>
                </header>
                <Spec
                  rows={[
                    [
                      'Email',
                      <a className="link" href={`mailto:${COMPANY.email}`} key="e">
                        {COMPANY.email}
                      </a>,
                    ],
                    [
                      'Phone',
                      <a className="link" href={`tel:${COMPANY.phone}`} key="p">
                        {COMPANY.phoneDisplay}
                      </a>,
                    ],
                    [
                      'WhatsApp',
                      <a
                        className="link"
                        href={COMPANY.whatsapp}
                        key="w"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Message us
                      </a>,
                    ],
                    ['Reply time', 'Within 24 hours'],
                  ]}
                />
              </div>

              <div className="panel">
                <header className="panel-head">
                  <Label>Offices</Label>
                </header>
                <div className="stack">
                  {OFFICE_NOTES.map(([city, region, note, glyph]) => (
                    <div key={city}>
                      <div className="tile-head" style={{ marginBottom: 'var(--s2)' }}>
                        <Glyph cells={glyph} size="sm" />
                        <h3>{city}</h3>
                      </div>
                      <p className="small">
                        {region} — {note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <header className="panel-head">
                  <Label>Elsewhere</Label>
                </header>
                <div className="stack">
                  {SOCIALS.map((s) => (
                    <a
                      className="link"
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {s.name} · {s.handle}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
