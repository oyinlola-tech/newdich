import { COMPANY } from '@/lib/site'
import { pageMeta } from '@/lib/meta'
import { ROUTES } from '@/lib/routes'
import { PageHero } from '@/components/PageHero'
import { Label, Marker, Spec } from '@/components/ui'

export const metadata = pageMeta({
  title: 'Privacy',
  description:
    'What this site collects, what Newdich Technology does with an enquiry, and how to have it ' +
    'deleted.',
  path: ROUTES.privacy,
})

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        trail={[['/', 'Home'], [null, 'Privacy']]}
        label="Site · what it collects"
        title="What this site collects."
        lede="Almost nothing. It is a static build with no analytics, no advertising pixels and no third-party tracking, and the only personal data that reaches us is what you put in an enquiry."
      >
        <div className="panel">
          <header className="panel-head">
            <Label>Data · at a glance</Label>
            <Label accent>No trackers</Label>
          </header>
          <Spec
            rows={[
              ['Analytics', 'None on this site'],
              ['Cookies', 'None. Your theme choice is stored in your own browser only'],
              ['Third parties', 'Google Fonts serves the three typefaces'],
              ['Enquiries', 'What you send by mail, kept while we are talking'],
            ]}
          />
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap wrap--narrow">
          <Marker label="In full" />
          <div className="prose">
            <h2 id="what-we-collect">What we collect</h2>
            <p>
              This site is a static export served as files. It sets no cookies, runs no analytics
              and carries no advertising or social tracking pixels. Your theme preference is
              written to your own browser’s local storage and never leaves the device.
            </p>
            <p>
              The three typefaces are served by Google Fonts, which means your browser makes a
              request to <strong>fonts.googleapis.com</strong> and{' '}
              <strong>fonts.gstatic.com</strong>. Google receives the request as part of serving
              the files; we receive nothing from it.
            </p>

            <h2 id="enquiries">Enquiries</h2>
            <p>
              The contact form has no server behind it. Submitting it opens your own mail client
              with the fields filled in, so nothing is transmitted until you send that mail
              yourself. When you do, we receive whatever you wrote — normally a name, an email
              address, an organisation and a description of the system you want built.
            </p>
            <p>
              We keep an enquiry while we are in conversation about it and for as long afterwards
              as our own record-keeping requires. We do not sell it, share it with advertisers, or
              add you to a mailing list — there is no mailing list.
            </p>

            <h2 id="client-data">Client data</h2>
            <p>
              Data inside the systems we build for clients belongs to the client, is governed by
              the agreement covering that engagement, and is hosted wherever those requirements
              say — a cloud region, on-premise hardware, or a mix where a public office needs the
              data to stay in the building. This page covers this website only.
            </p>

            <h2 id="deletion">Correction and deletion</h2>
            <p>
              Write to <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> and ask. We will
              confirm what we hold and delete it on request, and we will reply either way within
              24 hours.
            </p>

            <h2 id="changes">Changes</h2>
            <p>
              If this page changes, the change ships with the site. There is no archived version
              to compare against, so if the detail matters to you, keep a copy of what you read.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
