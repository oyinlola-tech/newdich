'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

type Section = 'steps' | 'form' | 'success'

const STEPS = [
  { num: '01', title: 'SIWES programme', desc: 'Students Industrial Work Experience Scheme (ITF-supervised)' },
  { num: '02', title: 'Fill the SIWES registration form', desc: 'Institution, matric number, level & supervisor details' },
  { num: '03', title: 'Upload placement letter', desc: 'Letter of introduction / SIWES placement letter (PDF, under 5 MB)' },
  { num: '04', title: 'Accept terms & submit', desc: 'Receive your SIWES tracking number by email' },
  { num: '05', title: 'Track your application', desc: 'Use your tracking number at newdich.tech/track' },
]

const TRACKS = [
  'Full-Stack Software Engineering',
  'Frontend Application Development',
  'Backend Architecture & Cloud Engineering',
  'Mobile Application Engineering',
  'Artificial Intelligence & Data Systems',
] as const

const MODES = ['On-Campus', 'Virtual', 'Hybrid'] as const
const SCHEDULES = [
  'Weekday Morning Batch (9:00 AM – 1:00 PM)',
  'Weekday Evening Batch (4:00 PM – 7:00 PM)',
  'Weekend Batch (Saturdays & Sundays)',
] as const

const SIWES_LEVELS = ['200L', '300L'] as const

export default function ApplySiwesPage() {
  const [section, setSection] = useState<Section>('steps')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [letterUrl, setLetterUrl] = useState('')
  const [passportUrl, setPassportUrl] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  const fields: Record<string, string> = {}

  const setField = useCallback((name: string, value: string) => {
    fields[name] = value
  }, [])

  const handleUpload = async (file: File, fieldName: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('field', fieldName)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error ?? 'Upload failed')
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const body: any = { ...fields, application_type: 'siwes', passport_url: passportUrl || undefined, siwes_letter_url: letterUrl || undefined }
      const res = await fetch('/api/application', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setTrackingNumber(data.tracking_number)
      setSection('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (section === 'steps') {
    return (
      <>
        <Nav />
        <main style={{ padding: 'var(--s9) var(--gutter)' }}>
          <section className="section">
            <div className="wrap">
              <div className="section-head">
                <h2 className="display-xl">How to apply — SIWES / Industrial Training</h2>
                <p className="copy">
                  Newdich Technology Institute hosts SIWES (Students Industrial Work Experience Scheme) students for industrial attachment.
                  Both 200L and 300L students are eligible. Follow the steps below to register.
                </p>
              </div>

              <div style={{ marginTop: 'var(--s9)' }}>
                <ol style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--text-2)' }}>
                  {STEPS.map((s, i) => (
                    <li key={s.num} style={{ marginBottom: 'var(--s5)', display: 'flex', gap: 'var(--s4)', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--signal)', minWidth: '48px' }}>{s.num}</span>
                      <div>
                        <b>{s.title}</b>
                        <br />
                        <span style={{ color: 'var(--text-3)', fontSize: '0.9375rem' }}>{s.desc}</span>
                      </div>
                    </li>
                  ))}
                  <li style={{ marginTop: 'var(--s6)', color: 'var(--signal)', fontWeight: 600 }}>
                    Already applied? Track your SIWES application with your tracking number at{' '}
                    <Link href="/track" className="btn btn--solid">Track application</Link>
                  </li>
                </ol>
              </div>

              <div style={{ marginTop: 'var(--s10)', textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn btn--solid"
                  onClick={() => setSection('form')}
                >
                  Start SIWES application
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  if (section === 'success') {
    return (
      <>
        <Nav />
        <main style={{ padding: 'var(--s9) var(--gutter)' }}>
          <section className="section section--alt">
            <div className="wrap--narrow">
              <div className="section-head section--center">
                <h2 className="display-xl">SIWES application received</h2>
                <p className="copy">
                  Your industrial training application has been submitted. Keep your tracking number safe.
                </p>
              </div>
              <div style={{ marginTop: 'var(--s8)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', textAlign: 'center', color: 'var(--signal)' }}>
                {trackingNumber}
              </div>
              <div style={{ marginTop: 'var(--s6)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-3)' }}>
                  A confirmation has been sent to {fields.email}. You can now track your application at any time.
                </p>
                <Link href={`/track?ref=${trackingNumber}`} className="btn btn--solid" style={{ marginTop: 'var(--s5)', display: 'inline-block' }}>
                  Track your application
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main style={{ padding: 'var(--s4) var(--gutter)', minHeight: '100vh' }}>
        <section className="section--flush-top section--flush-bottom">
          <div className="wrap--narrow">
            <div className="section-head section--center" style={{ marginBottom: 'var(--s8)' }}>
              <h2 className="display-xl">SIWES registration form</h2>
              <p className="copy">
                Industrial Training · 200L / 300L · ITF-supervised · Software Engineering training
              </p>
            </div>

            {error && (
              <div style={{ background: 'rgba(59,155,255,.1)', border: '1px solid var(--signal-line)', color: 'var(--signal)', padding: 'var(--s4)', borderRadius: 'var(--r-2)', marginBottom: 'var(--s6)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', marginBottom: 'var(--s8)' }}>
                <legend style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', padding: '0 var(--s3)' }}>Personal information</legend>
                <div className="grid">
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Surname / Family name <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input name="surname" required value={fields.surname ?? ''} onChange={e => setField('surname', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>First name <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input name="first_name" required value={fields.first_name ?? ''} onChange={e => setField('first_name', e.target.value)} className="input" />
                  </div>
                  <div className="span-4">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Middle name</label>
                    <input name="middle_name" value={fields.middle_name ?? ''} onChange={e => setField('middle_name', e.target.value)} className="input" />
                  </div>
                  <div className="span-4">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Date of birth <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input type="date" name="date_of_birth" required value={fields.date_of_birth ?? ''} onChange={e => setField('date_of_birth', e.target.value)} className="input" />
                  </div>
                  <div className="span-4">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Gender <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <select name="gender" required value={fields.gender ?? ''} onChange={e => setField('gender', e.target.value)} className="input">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Matriculation number <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input name="siwes_matric_number" required value={fields.siwes_matric_number ?? ''} onChange={e => setField('siwes_matric_number', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Academic level <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <select name="siwes_level" required value={fields.siwes_level ?? ''} onChange={e => setField('siwes_level', e.target.value)} className="input">
                      <option value="">Select</option>
                      {SIWES_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Primary phone number <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input type="tel" name="primary_phone" required value={fields.primary_phone ?? ''} onChange={e => setField('primary_phone', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>WhatsApp number</label>
                    <input type="tel" name="whatsapp_phone" value={fields.whatsapp_phone ?? ''} onChange={e => setField('whatsapp_phone', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Email address <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input type="email" name="email" required value={fields.email ?? ''} onChange={e => setField('email', e.target.value)} className="input" />
                  </div>
                </div>
              </fieldset>

              <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', marginBottom: 'var(--s8)' }}>
                <legend style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', padding: '0 var(--s3)' }}>Institution details</legend>
                <div className="grid">
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Institution name <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input name="siwes_institution" required value={fields.siwes_institution ?? ''} onChange={e => setField('siwes_institution', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Department / Faculty <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input name="siwes_department" required value={fields.siwes_department ?? ''} onChange={e => setField('siwes_department', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>SIWES start date <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input type="date" name="siwes_start_date" required value={fields.siwes_start_date ?? ''} onChange={e => setField('siwes_start_date', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>SIWES end date <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input type="date" name="siwes_end_date" required value={fields.siwes_end_date ?? ''} onChange={e => setField('siwes_end_date', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>ITF reference / logbook number</label>
                    <input name="siwes_itf_reference" value={fields.siwes_itf_reference ?? ''} onChange={e => setField('siwes_itf_reference', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Institution supervisor name</label>
                    <input name="siwes_supervisor_name" value={fields.siwes_supervisor_name ?? ''} onChange={e => setField('siwes_supervisor_name', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Supervisor phone</label>
                    <input type="tel" name="siwes_supervisor_phone" value={fields.siwes_supervisor_phone ?? ''} onChange={e => setField('siwes_supervisor_phone', e.target.value)} className="input" />
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Supervisor email</label>
                    <input type="email" name="siwes_supervisor_email" value={fields.siwes_supervisor_email ?? ''} onChange={e => setField('siwes_supervisor_email', e.target.value)} className="input" />
                  </div>
                </div>
              </fieldset>

              <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', marginBottom: 'var(--s8)' }}>
                <legend style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', padding: '0 var(--s3)' }}>Programme preferences</legend>
                <div className="grid">
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Preferred track / specialization <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <select name="track" required value={fields.track ?? ''} onChange={e => setField('track', e.target.value)} className="input">
                      <option value="">Select</option>
                      {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Mode of study <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <select name="study_mode" required value={fields.study_mode ?? ''} onChange={e => setField('study_mode', e.target.value)} className="input">
                      <option value="">Select</option>
                      {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="span-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Class schedule / batch <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <select name="class_schedule" required value={fields.class_schedule ?? ''} onChange={e => setField('class_schedule', e.target.value)} className="input">
                      <option value="">Select</option>
                      {SCHEDULES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="span-12">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Letter of introduction / placement letter <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={async (e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      try {
                        const url = await handleUpload(f, 'siwes_letter')
                        setLetterUrl(url)
                      } catch (err) {
                        setError(err instanceof Error ? err.message : 'Upload failed')
                      }
                    }} />
                    {letterUrl && (
                      <p style={{ marginTop: 'var(--s2)', fontSize: '0.8125rem', color: 'var(--signal)' }}>Placement letter uploaded.</p>
                    )}
                  </div>
                  <div className="span-12">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Passport photograph <span style={{ color: 'var(--signal)' }}>*</span></label>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      try {
                        const url = await handleUpload(f, 'passport')
                        setPassportUrl(url)
                      } catch (err) {
                        setError(err instanceof Error ? err.message : 'Upload failed')
                      }
                    }} />
                    {passportUrl && (
                      <p style={{ marginTop: 'var(--s2)', fontSize: '0.8125rem', color: 'var(--signal)' }}>Passport uploaded.</p>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', marginBottom: 'var(--s8)' }}>
                <legend style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', padding: '0 var(--s3)' }}>Declaration</legend>
                <div className="grid">
                  <div className="span-12">
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s2)', cursor: 'pointer', fontWeight: 500 }}>
                      <input type="checkbox" name="terms_accepted" required onChange={() => setField('terms_accepted', '1')} />
                      I declare that all information provided is authentic and accurate. I am a bona fide student applying for SIWES industrial training at Newdich Technology Institute.
                    </label>
                  </div>
                </div>
              </fieldset>

              <div style={{ textAlign: 'center' }}>
                <button type="submit" disabled={submitting} className="btn btn--solid" style={{ paddingInline: 'var(--s8)' }}>
                  {submitting ? 'Submitting…' : 'Submit SIWES application'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
