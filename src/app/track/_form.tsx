'use client'

import { useState } from 'react'

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

export default function TrackForm({ initialRef }: { initialRef?: string }) {
  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lookupRef, setLookupRef] = useState(initialRef ?? '')

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/application/lookup?ref=${encodeURIComponent(lookupRef)}`)
      if (res.status === 404) {
        setError('No application found with this tracking number.')
        setApp(null)
        return
      }
      if (!res.ok) {
        setError('Could not look up application. Please try again.')
        return
      }
      const data = await res.json()
      setApp(data)
    } catch {
      setError('Could not look up application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (app) {
    const price =
      app.course_price !== null && app.course_price !== undefined
        ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(app.course_price)
        : 'To be confirmed'

    return (
      <>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap', marginBottom: 'var(--s8)' }}>
          <input
            type="text"
            name="ref"
            placeholder="e.g. NDTI/SE/2026/00001"
            value={lookupRef}
            onChange={e => setLookupRef(e.target.value)}
            className="input"
            style={{ flex: 1, minWidth: 0 }}
          />
          <button type="submit" disabled={loading} className="btn btn--solid">
            {loading ? 'Looking up…' : 'Track'}
          </button>
        </form>
        {error && (
          <p style={{ color: 'var(--signal)', marginBottom: 'var(--s6)', fontSize: '0.9375rem' }}>{error}</p>
        )}
        <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', background: 'var(--bg-2)' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', marginBottom: 'var(--s4)' }}>
            Application Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s5) var(--s6)', fontSize: '0.9375rem' }}>
            <div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tracking Number</div>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>{app.tracking_number}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application Type</div>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>{app.application_type}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course</div>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>{app.course_name}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course Fee</div>
              <div style={{ fontWeight: 600, color: 'var(--signal)' }}>{price}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
              <div style={{ fontWeight: 600, color: 'var(--signal)' }}>{STATUS_LABELS[app.status] ?? app.status}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Status</div>
              <div style={{ fontWeight: 600, color: 'var(--signal)' }}>{PAYMENT_LABELS[app.payment_status] ?? app.payment_status}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applied On</div>
              <div style={{ color: 'var(--text)' }}>{new Date(app.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--s6)', textAlign: 'center' }}>
            <a
              href={`/api/application/pdf?ref=${app.tracking_number}`}
              className="btn btn--solid"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Form & Invoice (PDF)
            </a>
          </div>
        </div>
      </>
    )
  }

  return (
    <form onSubmit={handleLookup} style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap' }}>
      <input
        type="text"
        name="ref"
        placeholder="e.g. NDTI/SE/2026/00001"
        value={lookupRef}
        onChange={e => setLookupRef(e.target.value)}
        className="input"
        style={{ flex: 1, minWidth: 0 }}
      />
      <button type="submit" disabled={loading} className="btn btn--solid">
        {loading ? 'Looking up…' : 'Track'}
      </button>
      {error && (
        <p style={{ color: 'var(--signal)', marginTop: 'var(--s3)', fontSize: '0.9375rem' }}>{error}</p>
      )}
    </form>
  )
}
