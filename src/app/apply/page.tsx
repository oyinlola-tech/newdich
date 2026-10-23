'use client'

import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'

type Section = 'steps' | 'course' | 'form' | 'success'

const STEPS = [
  { num: '01', title: 'Choose your course', desc: 'Select the programme you want to study' },
  { num: '02', title: 'Fill the registration form', desc: 'Personal, educational & technical details' },
  { num: '03', title: 'Upload your passport', desc: 'Recent passport photograph (JPG / PNG / WEBP, under 5 MB)' },
  { num: '04', title: 'Accept terms & submit', desc: 'Receive your tracking number by email' },
  { num: '05', title: 'Track your application', desc: 'Use your tracking number at newdich.tech/track' },
]

const MODES = ['On-Campus', 'Virtual', 'Hybrid'] as const
const SCHEDULES = [
  'Weekday Morning Batch (9:00 AM – 1:00 PM)',
  'Weekday Evening Batch (4:00 PM – 7:00 PM)',
  'Weekend Batch (Saturdays & Sundays)',
] as const

type Course = {
  id: number
  name: string
  description: string | null
  price: number | null
  currency: string
  duration: string | null
  is_active: number
}

export default function ApplyPage() {
  const [section, setSection] = useState<Section>('steps')
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [passportUrl, setPassportUrl] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const fields: Record<string, string> = {}

  const setField = useCallback((name: string, value: string) => {
    fields[name] = value
  }, [])

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses')
      const data = await res.json()
      setCourses((data.courses ?? []).filter((c: Course) => c.is_active))
    } catch { }
  }

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
      const body: any = {
        ...fields,
        application_type: 'standard',
        course_id: selectedCourse?.id,
        course_name: selectedCourse?.name,
        course_price: selectedCourse?.price,
        passport_url: passportUrl || undefined,
      }
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

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return 'Price to be confirmed'
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price)
  }

  if (section === 'steps') {
    return (
      <main style={{ padding: 'var(--s9) var(--gutter)' }}>
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2 className="display-xl">How to apply — Newdich Technology Institute</h2>
              <p className="copy">
                Newdich Technology Institute runs intensive training & certification programmes. Choose your course, fill the registration form,
                and receive your tracking number to track your application.
              </p>
            </div>

            <div style={{ marginTop: 'var(--s9)' }}>
              <ol style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--text-2)' }}>
                {STEPS.map((s) => (
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
                  Already applied? Track your application with your tracking number at{' '}
                  <Link href="/track" className="btn btn--solid">Track application</Link>
                </li>
              </ol>
            </div>

            <div style={{ marginTop: 'var(--s10)', textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn--solid"
                onClick={() => setSection('course')}
              >
                Start application
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (section === 'course') {
    return (
      <main style={{ padding: 'var(--s9) var(--gutter)' }}>
        <section className="section section--flush-top">
          <div className="wrap--narrow">
            <div className="section-head section--center" style={{ marginBottom: 'var(--s8)' }}>
              <h2 className="display-xl">Choose your course</h2>
              <p className="copy">Select the programme you want to study. Your fee will be shown based on the course.</p>
            </div>

            {courses.length === 0 && (
              <p style={{ color: 'var(--text-3)', textAlign: 'center', marginTop: 'var(--s6)' }}>
                No courses available right now. Please check back later.
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--s6)', marginTop: 'var(--s6)' }}>
              {courses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourse(c)}
                  style={{
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-3)',
                    padding: 'var(--s6)',
                    cursor: 'pointer',
                    transition: 'border-color var(--t-fast) var(--in)',
                    background: selectedCourse?.id === c.id ? 'rgba(59,155,255,.05)' : 'transparent',
                    borderColor: selectedCourse?.id === c.id ? 'var(--signal)' : 'transparent',
                  }}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: 'var(--s2)' }}>{c.name}</div>
                  {c.description && (
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', marginBottom: 'var(--s4)', lineHeight: 1.5 }}>{c.description}</p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--s4)' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)' }}>{formatPrice(c.price)}</span>
                    {c.duration && <span style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>{c.duration}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'var(--s8)', textAlign: 'center' }}>
              {selectedCourse ? (
                <>
                  <button
                    type="button"
                    className="btn btn--solid"
                    onClick={() => setSection('form')}
                    disabled={submitting}
                  >
                    Continue to registration form
                  </button>
                  <button
                    type="button"
                    className="btn btn--line"
                    onClick={() => setSection('steps')}
                    style={{ marginLeft: 'var(--s4)' }}
                  >
                    Back
                  </button>
                </>
              ) : (
                <p style={{ color: 'var(--text-3)', marginTop: 'var(--s4)' }}>
                  Please select a course to continue.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (section === 'success') {
    return (
      <main style={{ padding: 'var(--s9) var(--gutter)' }}>
        <section className="section section--alt">
          <div className="wrap--narrow">
            <div className="section-head section--center">
              <h2 className="display-xl">Application received</h2>
              <p className="copy">
                Your application has been submitted. Keep your tracking number safe — you’ll need it to check your status.
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
    )
  }

  // form section
  return (
    <main style={{ padding: 'var(--s4) var(--gutter)', minHeight: '100vh' }}>
      <section className="section--flush-top section--flush-bottom">
        <div className="wrap--narrow">
          <div className="section-head section--center" style={{ marginBottom: 'var(--s8)' }}>
            <h2 className="display-xl">Registration form</h2>
            <p className="copy">
              {selectedCourse?.name} · {selectedCourse?.duration ?? ''} · {formatPrice(selectedCourse?.price)}
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(59,155,255,.1)', border: '1px solid var(--signal-line)', color: 'var(--signal)', padding: 'var(--s4)', borderRadius: 'var(--r-2)', marginBottom: 'var(--s6)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <input type="hidden" name="course_id" value={String(selectedCourse?.id ?? '')} />
            <input type="hidden" name="course_name" value={selectedCourse?.name ?? ''} />
            <input type="hidden" name="course_price" value={String(selectedCourse?.price ?? '')} />

            {/* Section 1: Personal */}
            <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', marginBottom: 'var(--s8)' }}>
              <legend style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', padding: '0 var(--s3)' }}>Section 1 · Personal information</legend>
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
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Marital status <span style={{ color: 'var(--signal)' }}>*</span></label>
                  <select name="marital_status" required value={fields.marital_status ?? ''} onChange={e => setField('marital_status', e.target.value)} className="input">
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="span-4">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Nationality</label>
                  <input name="nationality" value="Nigeria" onChange={e => setField('nationality', e.target.value)} className="input" />
                </div>
                <div className="span-4">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>State of origin</label>
                  <input name="state_of_origin" value={fields.state_of_origin ?? ''} onChange={e => setField('state_of_origin', e.target.value)} className="input" />
                </div>
                <div className="span-4">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Local Govt. Area (LGA)</label>
                  <input name="lga" value={fields.lga ?? ''} onChange={e => setField('lga', e.target.value)} className="input" />
                </div>
                <div className="span-12">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Residential address (Street, Landmark)</label>
                  <textarea name="residential_address" rows={2} value={fields.residential_address ?? ''} onChange={e => setField('residential_address', e.target.value)} className="input" />
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>City / State of residence</label>
                  <input name="city_state_residence" value={fields.city_state_residence ?? ''} onChange={e => setField('city_state_residence', e.target.value)} className="input" />
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
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Identification type <span style={{ color: 'var(--signal)' }}>*</span></label>
                  <select name="id_type" required value={fields.id_type ?? ''} onChange={e => setField('id_type', e.target.value)} className="input">
                    <option value="">Select</option>
                    <option value="NIN">NIN</option>
                    <option value="Voter's Card">Voter's Card</option>
                    <option value="Int'l Passport">Int'l Passport</option>
                    <option value="Driver's License">Driver's License</option>
                  </select>
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>ID / Document number <span style={{ color: 'var(--signal)' }}>*</span></label>
                  <input name="id_number" required value={fields.id_number ?? ''} onChange={e => setField('id_number', e.target.value)} className="input" />
                </div>
              </div>
            </fieldset>

            {/* Section 2: Next of kin */}
            <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', marginBottom: 'var(--s8)' }}>
              <legend style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', padding: '0 var(--s3)' }}>Section 2 · Emergency contact & next of kin</legend>
              <div className="grid">
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Full name of next of kin / sponsor</label>
                  <input name="next_of_kin_name" value={fields.next_of_kin_name ?? ''} onChange={e => setField('next_of_kin_name', e.target.value)} className="input" />
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Relationship</label>
                  <select name="next_of_kin_relationship" value={fields.next_of_kin_relationship ?? ''} onChange={e => setField('next_of_kin_relationship', e.target.value)} className="input">
                    <option value="">Select</option>
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Sponsor / Other">Sponsor / Other</option>
                  </select>
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Phone number</label>
                  <input type="tel" name="next_of_kin_phone" value={fields.next_of_kin_phone ?? ''} onChange={e => setField('next_of_kin_phone', e.target.value)} className="input" />
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>WhatsApp & email</label>
                  <input name="next_of_kin_whatsapp_email" value={fields.next_of_kin_whatsapp_email ?? ''} onChange={e => setField('next_of_kin_whatsapp_email', e.target.value)} className="input" />
                </div>
                <div className="span-12">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Residential / Office address</label>
                  <textarea name="next_of_kin_address" rows={2} value={fields.next_of_kin_address ?? ''} onChange={e => setField('next_of_kin_address', e.target.value)} className="input" />
                </div>
              </div>
            </fieldset>

            {/* Section 3: Education */}
            <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', marginBottom: 'var(--s8)' }}>
              <legend style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', padding: '0 var(--s3)' }}>Section 3 · Educational & professional background</legend>
              <div className="grid">
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Highest academic qualification <span style={{ color: 'var(--signal)' }}>*</span></label>
                  <select name="highest_qualification" required value={fields.highest_qualification ?? ''} onChange={e => setField('highest_qualification', e.target.value)} className="input">
                    <option value="">Select</option>
                    <option value="SSCE / O-Level">SSCE / O-Level</option>
                    <option value="OND / NCE">OND / NCE</option>
                    <option value="HND / B.Sc / B.Tech">HND / B.Sc / B.Tech</option>
                    <option value="M.Sc / Post-Grad">M.Sc / Post-Grad</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Name of institution attended</label>
                  <input name="institution_attended" value={fields.institution_attended ?? ''} onChange={e => setField('institution_attended', e.target.value)} className="input" />
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Course of study / Major</label>
                  <input name="course_of_study" value={fields.course_of_study ?? ''} onChange={e => setField('course_of_study', e.target.value)} className="input" />
                </div>
                <div className="span-4">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Year of graduation</label>
                  <input type="number" name="year_of_graduation" value={fields.year_of_graduation ?? ''} onChange={e => setField('year_of_graduation', e.target.value)} className="input" />
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Current occupation / activity <span style={{ color: 'var(--signal)' }}>*</span></label>
                  <select name="current_status" required value={fields.current_status ?? ''} onChange={e => setField('current_status', e.target.value)} className="input">
                    <option value="">Select</option>
                    <option value="Student">Student</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="NYSC Corps Member">NYSC Corps Member</option>
                    <option value="Seeking Opportunities">Seeking Opportunities</option>
                  </select>
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Employer / School / Organisation</label>
                  <input name="employer_school" value={fields.employer_school ?? ''} onChange={e => setField('employer_school', e.target.value)} className="input" />
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Current role / designation</label>
                  <input name="current_role" value={fields.current_role ?? ''} onChange={e => setField('current_role', e.target.value)} className="input" />
                </div>
              </div>
            </fieldset>

            {/* Section 4: Technical */}
            <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', marginBottom: 'var(--s8)' }}>
              <legend style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', padding: '0 var(--s3)' }}>Section 4 · Technical background & programme preferences</legend>
              <div className="grid">
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Prior experience level <span style={{ color: 'var(--signal)' }}>*</span></label>
                  <select name="experience_level" required value={fields.experience_level ?? ''} onChange={e => setField('experience_level', e.target.value)} className="input">
                    <option value="">Select</option>
                    <option value="Absolute Beginner">Absolute Beginner (No prior coding experience)</option>
                    <option value="Basic Computer Literacy">Basic Computer Literacy</option>
                    <option value="Intermediate">Intermediate (HTML / CSS / programming logic)</option>
                    <option value="Advanced">Advanced (Write code in one or more languages)</option>
                  </select>
                </div>
                <div className="span-12">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Do you own a personal laptop for practice? <span style={{ color: 'var(--signal)' }}>*</span></label>
                  <div style={{ display: 'flex', gap: 'var(--s5)', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', cursor: 'pointer', fontWeight: 500 }}>
                      <input type="radio" name="owns_laptop" value="1" defaultChecked onChange={() => setField('owns_laptop', '1')} /> Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', cursor: 'pointer', fontWeight: 500 }}>
                      <input type="radio" name="owns_laptop" value="0" onChange={() => setField('owns_laptop', '0')} /> No
                    </label>
                  </div>
                </div>
                <div className="span-12">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Laptop specifications (OS / RAM / Processor)</label>
                  <input name="laptop_specs" placeholder="e.g. Windows 11, Core i5, 16GB RAM, 512GB SSD" value={fields.laptop_specs ?? ''} onChange={e => setField('laptop_specs', e.target.value)} className="input" />
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
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>How did you hear about us? <span style={{ color: 'var(--signal)' }}>*</span></label>
                  <select name="heard_from" required value={fields.heard_from ?? ''} onChange={e => setField('heard_from', e.target.value)} className="input">
                    <option value="">Select</option>
                    <option value="Social Media">Social Media (Instagram / Facebook / X / LinkedIn)</option>
                    <option value="Friend / Alumni Referral">Friend / Alumni Referral</option>
                    <option value="Google Search / Institute Website">Google Search / Institute Website</option>
                    <option value="Event / Tech Workshop">Event / Tech Workshop</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="span-6" style={{ display: fields.heard_from === 'Other' ? 'block' : 'none' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Please specify</label>
                  <input name="heard_from_other" value={fields.heard_from_other ?? ''} onChange={e => setField('heard_from_other', e.target.value)} className="input" />
                </div>
              </div>
            </fieldset>

            {/* Section 5: Payment */}
            <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', marginBottom: 'var(--s8)' }}>
              <legend style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', padding: '0 var(--s3)' }}>Section 5 · Tuition fee & payment plan</legend>
              {selectedCourse?.price === null ? (
                <p style={{ color: 'var(--text-3)', marginBottom: 'var(--s4)' }}>
                  Course fee: To be confirmed by the Institute. An admin will contact you with the final amount.
                </p>
              ) : selectedCourse ? (
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-3)', marginBottom: 'var(--s4)' }}>
                  Course fee: {formatPrice(selectedCourse.price)}
                </p>
              ) : null}
              <div className="grid">
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Payment plan <span style={{ color: 'var(--signal)' }}>*</span></label>
                  <select name="payment_plan" required value={fields.payment_plan ?? ''} onChange={e => setField('payment_plan', e.target.value)} className="input">
                    <option value="">Select</option>
                    <option value="Outright / Single Payment">Option A — Outright / Single Payment</option>
                    <option value="Standard Installmental">Option B — Standard Installmental</option>
                    <option value="Corporate Sponsorship / Scholarship">Option C — Corporate Sponsorship / Scholarship</option>
                  </select>
                </div>
                <div className="span-6" style={{ display: fields.payment_plan === 'Corporate Sponsorship / Scholarship' ? 'block' : 'none' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Sponsor / Corporate name</label>
                  <input name="sponsor_name" value={fields.sponsor_name ?? ''} onChange={e => setField('sponsor_name', e.target.value)} className="input" />
                </div>
                <div className="span-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Payment channel <span style={{ color: 'var(--signal)' }}>*</span></label>
                  <select name="payment_channel" required value={fields.payment_channel ?? ''} onChange={e => setField('payment_channel', e.target.value)} className="input">
                    <option value="">Select</option>
                    <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                    <option value="Online Payment Portal / Card">Online Payment Portal / Card</option>
                    <option value="Cheque / POS at Office">Cheque / POS at Office</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Section 6: Passport + Terms */}
            <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 'var(--s7)', marginBottom: 'var(--s8)' }}>
              <legend style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--signal)', padding: '0 var(--s3)' }}>Section 6 · Passport photograph & declaration</legend>
              <div className="grid">
                <div className="span-6">
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
                <div className="span-6">
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s2)', cursor: 'pointer', fontWeight: 500, marginBottom: 'var(--s4)' }}>
                    <input type="checkbox" name="terms_accepted" required onChange={() => setField('terms_accepted', '1')} />
                    I declare that all information provided is authentic and accurate. I agree to the terms & conditions of enrollment at Newdich Technology Institute.
                  </label>
                </div>
              </div>
            </fieldset>

            <div style={{ textAlign: 'center' }}>
              <button type="submit" disabled={submitting} className="btn btn--solid" style={{ paddingInline: 'var(--s8)' }}>
                {submitting ? 'Submitting…' : 'Submit application'}
              </button>
              <button type="button" onClick={() => setSection('course')} className="btn btn--line" style={{ marginLeft: 'var(--s4)', paddingInline: 'var(--s8)' }}>
                Change course
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
