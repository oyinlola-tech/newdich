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
              ['Third parties', 'Google Fonts serves the typefaces; Resend delivers the form'],
              ['Enquiries', 'What you type in the form, kept while we are talking'],
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
              The contact form posts what you typed to one endpoint on this site, which turns it
              into an email addressed to us. That is the only part of this site with a server
              behind it, and it runs only when you press send. What reaches us is what you wrote —
              normally a name, an email address, an organisation, the practice you picked and a
              description of the system you want built.
            </p>
            <p>
              The mail itself is delivered by <strong>Resend</strong>, an email provider, which
              processes the message in order to deliver it and keeps a delivery record. Your
              address is used as the reply-to on that mail so that answering it reaches you. If
              you would rather not involve a third party at all, write to{' '}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> directly — it is the same
              inbox.
            </p>
            <p>
              The endpoint also reads the network address your request arrives from. It is used
              for one thing — counting requests, so the form cannot be used to flood the inbox —
              and it is held in memory for that count and not written to a database.
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
