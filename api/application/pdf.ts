import { ensureMigrated, query } from '@/lib/db'
import PDFDocument from 'pdfkit'

export const config = { api: { bodyParser: false } }

export async function GET(request: Request): Promise<Response> {
  await ensureMigrated()

  const { searchParams } = new URL(request.url)
  const tracking_number = searchParams.get('ref') ?? ''

  if (!tracking_number) {
    return json(400, { error: 'ref is required.' })
  }

  const rows = await query<any>(
    `SELECT * FROM applications WHERE tracking_number = ?`,
    [tracking_number]
  )
  const app = rows[0]
  if (!app) {
    return json(404, { error: 'Application not found.' })
  }

  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  // Header
  doc.fontSize(20).fillColor('#04070B').text('NEWDICH TECHNOLOGY INSTITUTE', { align: 'center' })
  doc.fontSize(10).fillColor('#3B9BFF').text('Excellence in Software Engineering & Digital Academy', { align: 'center' })
  doc.fontSize(9).fillColor('#7589A0').text('Call / WhatsApp: +2347032095559  |  Email: newdichngr@gmail.com  |  www.newdich.tech', { align: 'center' })
  doc.moveDown()

  // Title
  doc.fontSize(14).fillColor('#04070B').text('Registration Form & Invoice', { align: 'center' })
  doc.fontSize(10).fillColor('#7589A0').text(`Tracking Number: ${tracking_number}`, { align: 'center' })
  doc.moveDown()

  const section = (title: string) => {
    doc.moveDown(0.5)
    doc.fontSize(11).fillColor('#3B9BFF').text(title, { underline: true })
    doc.moveDown(0.3)
  }

  const field = (label: string, value: any) => {
    doc.fontSize(9.5).fillColor('#7589A0').text(label)
    doc.fontSize(10).fillColor('#04070B').text(String(value ?? '—'), { width: 400, align: 'left' })
    doc.moveDown(0.2)
  }

  // Section 1: Personal
  section('SECTION 1 — PERSONAL INFORMATION')
  field('Surname / Family name', app.surname)
  field('First name', app.first_name)
  field('Middle name', app.middle_name)
  field('Date of birth', app.date_of_birth)
  field('Gender', app.gender)
  field('Marital status', app.marital_status)
  field('Nationality', app.nationality)
  field('State of origin', app.state_of_origin)
  field('Local Govt. Area (LGA)', app.lga)
  field('Residential address', app.residential_address)
  field('City / State of residence', app.city_state_residence)
  field('Primary phone number', app.primary_phone)
  field('WhatsApp number', app.whatsapp_phone)
  field('Email address', app.email)
  field('Identification type', app.id_type)
  field('ID / Document number', app.id_number)

  // Section 2: Next of kin
  section('SECTION 2 — EMERGENCY CONTACT & NEXT OF KIN')
  field('Next of kin / sponsor name', app.next_of_kin_name)
  field('Relationship', app.next_of_kin_relationship)
  field('Phone number', app.next_of_kin_phone)
  field('WhatsApp & email', app.next_of_kin_whatsapp_email)
  field('Address', app.next_of_kin_address)

  // Section 3: Education
  section('SECTION 3 — EDUCATIONAL & PROFESSIONAL BACKGROUND')
  field('Highest qualification', app.highest_qualification)
  field('Institution attended', app.institution_attended)
  field('Course of study / Major', app.course_of_study)
  field('Year of graduation', app.year_of_graduation)
  field('Current occupation', app.current_status)
  field('Employer / School / Organisation', app.employer_school)
  field('Current role / designation', app.current_role)

  // Section 4: Technical & Programme
  section('SECTION 4 — TECHNICAL BACKGROUND & PROGRAMME PREFERENCES')
  field('Experience level', app.experience_level)
  field('Owns laptop', app.owns_laptop ? 'Yes' : 'No')
  field('Laptop specifications', app.laptop_specs)
  field('Course / Track', app.course_name)
  field('Mode of study', app.study_mode)
  field('Class schedule / batch', app.class_schedule)
  field('Heard from', app.heard_from)
  field('Heard from (other)', app.heard_from_other)

  // SIWES fields if applicable
  if (app.application_type === 'siwes') {
    section('SECTION 4B — SIWES / INDUSTRIAL TRAINING DETAILS')
    field('Institution', app.siwes_institution)
    field('Department / Faculty', app.siwes_department)
    field('Matriculation number', app.siwes_matric_number)
    field('Academic level', app.siwes_level)
    field('SIWES start date', app.siwes_start_date)
    field('SIWES end date', app.siwes_end_date)
    field('ITF reference / logbook no.', app.siwes_itf_reference)
    field('Supervisor name', app.siwes_supervisor_name)
    field('Supervisor phone', app.siwes_supervisor_phone)
    field('Supervisor email', app.siwes_supervisor_email)
  }

  // Section 5: Payment
  section('SECTION 5 — TUITION FEE & PAYMENT')
  field('Course fee', app.course_price !== null && app.course_price !== undefined ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: app.currency ?? 'NGN' }).format(app.course_price) : 'To be confirmed')
  field('Payment plan', app.payment_plan)
  field('Sponsor / Corporate name', app.sponsor_name)
  field('Payment channel', app.payment_channel)
  field('Amount paid', app.amount_paid !== null && app.amount_paid !== undefined ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: app.currency ?? 'NGN' }).format(app.amount_paid) : '—')
  field('Status', app.status)
  field('Payment status', app.payment_status)

  // Section 6: Declaration
  section('SECTION 6 — TERMS & DECLARATION')
  field('Terms accepted', app.terms_accepted ? 'Yes' : 'No')
  field('Signed date', app.signed_date)

  doc.moveDown()
  doc.fontSize(10).fillColor('#3B9BFF').text('INVOICE — PAYMENT ADVICE', { underline: true })
  doc.moveDown(0.3)
  field('Tracking Number', tracking_number)
  field('Applicant', `${app.surname} ${app.first_name} ${app.middle_name ?? ''}`.trim())
  field('Course', app.course_name)
  field('Amount Payable', app.course_price !== null && app.course_price !== undefined ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: app.currency ?? 'NGN' }).format(app.course_price) : 'TBC')
  field('Payment Channel', app.payment_channel ?? 'To be selected')
  field('Invoice Date', new Date().toLocaleDateString())
  field('Instructions', 'Present this invoice at the Newdich Technology Institute office for payment verification and next steps.')

  doc.moveDown(1)
  doc.fontSize(8).fillColor('#7589A0').text('Generated by Newdich Technology Institute — www.newdich.tech', { align: 'center' })

  doc.end()

  const buffer = Buffer.concat(chunks)

  return new Response(buffer, {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="newdich-application-${tracking_number}.pdf"`,
      'cache-control': 'no-store',
    },
  })
}

function json(status: number, body: object, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}
