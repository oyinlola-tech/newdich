import Link from 'next/link'
import TrackForm from './_form'

type Application = {
  tracking_number: string
  application_type: string
  status: string
  payment_status: string
  course_name: string
  course_price: number | null
  email: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  enrolled: 'Enrolled',
}

const PAYMENT_LABELS: Record<string, string> = {
  unpaid: 'Unpaid',
  partial: 'Partially Paid',
  paid: 'Paid',
}

export default function TrackPage({
  searchParams,
}: {
  searchParams: { ref?: string }
}) {
  const ref = searchParams.ref ?? ''

  return (
    <main style={{ padding: 'var(--s9) var(--gutter)' }}>
      <section className="section">
        <div className="wrap--narrow">
          <div className="section-head section--center" style={{ marginBottom: 'var(--s8)' }}>
            <h2 className="display-xl">Track your application</h2>
            <p className="copy">
              Enter your tracking number to check the status of your application at Newdich Technology Institute.
            </p>
          </div>

          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <TrackForm initialRef={ref} />
          </div>
        </div>
      </section>
    </main>
  )
}
