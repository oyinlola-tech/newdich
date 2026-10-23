import { ensureMigrated, query } from '@/lib/db'

const PREFIX = { standard: 'NDTI/SE', siwes: 'NDTI/SIWES' } as const

function trackingNumber(type: 'standard' | 'siwes'): string {
  const now = new Date()
  const year = now.getFullYear()
  const seq = Math.floor(10000 + Math.random() * 90000)
  return `${PREFIX[type]}/${year}/${seq}`
}

export async function POST(request: Request): Promise<Response> {
  await ensureMigrated()

  let body: any
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON body.' })
  }

  const {
    application_type = 'standard',
    surname, first_name, middle_name,
    date_of_birth, gender, marital_status, nationality,
    state_of_origin, lga, residential_address, city_state_residence,
    primary_phone, whatsapp_phone, email, id_type, id_number,
    next_of_kin_name, next_of_kin_relationship, next_of_kin_phone,
    next_of_kin_whatsapp_email, next_of_kin_address,
    highest_qualification, institution_attended, course_of_study,
    year_of_graduation, current_status, employer_school, current_role,
    experience_level, owns_laptop, laptop_specs, track, study_mode,
    class_schedule, heard_from, heard_from_other,
    siwes_institution, siwes_department, siwes_matric_number, siwes_level,
    siwes_start_date, siwes_end_date, siwes_itf_reference,
    siwes_supervisor_name, siwes_supervisor_phone, siwes_supervisor_email,
    siwes_letter_url,
    payment_plan, sponsor_name, payment_channel, amount_paid,
    terms_accepted, trainee_signature_url, sponsor_signature_url, signed_date,
    passport_url,
  } = body

  if (!surname || !first_name || !email || !primary_phone) {
    return json(400, { error: 'surname, first_name, email and primary_phone are required.' })
  }
  if (!['standard', 'siwes'].includes(application_type)) {
    return json(400, { error: 'application_type must be standard or siwes.' })
  }

  const trk = trackingNumber(application_type as 'standard' | 'siwes')

  try {
    await query(
      `INSERT INTO applications (
        tracking_number, application_type, status, payment_status,
        surname, first_name, middle_name, date_of_birth, gender, marital_status,
        nationality, state_of_origin, lga, residential_address, city_state_residence,
        primary_phone, whatsapp_phone, email, id_type, id_number,
        next_of_kin_name, next_of_kin_relationship, next_of_kin_phone,
        next_of_kin_whatsapp_email, next_of_kin_address,
        highest_qualification, institution_attended, course_of_study,
        year_of_graduation, current_status, employer_school, current_role,
        experience_level, owns_laptop, laptop_specs, track, study_mode,
        class_schedule, heard_from, heard_from_other,
        siwes_institution, siwes_department, siwes_matric_number, siwes_level,
        siwes_start_date, siwes_end_date, siwes_itf_reference,
        siwes_supervisor_name, siwes_supervisor_phone, siwes_supervisor_email,
        siwes_letter_url,
        payment_plan, sponsor_name, payment_channel, amount_paid,
        terms_accepted, trainee_signature_url, sponsor_signature_url, signed_date,
        passport_url
      ) VALUES (?, ?, 'pending', 'unpaid', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trk, application_type,
        surname, first_name, middle_name ?? null, date_of_birth ?? null, gender, marital_status,
        nationality ?? null, state_of_origin ?? null, lga ?? null, residential_address ?? null,
        city_state_residence ?? null, primary_phone, whatsapp_phone ?? null, email, id_type ?? null,
        id_number ?? null, next_of_kin_name ?? null, next_of_kin_relationship ?? null,
        next_of_kin_phone ?? null, next_of_kin_whatsapp_email ?? null, next_of_kin_address ?? null,
        highest_qualification ?? null, institution_attended ?? null, course_of_study ?? null,
        year_of_graduation ?? null, current_status ?? null, employer_school ?? null,
        current_role ?? null, experience_level ?? null,
        owns_laptop ? 1 : 0, laptop_specs ?? null, track ?? null, study_mode ?? null,
        class_schedule ?? null, heard_from ?? null, heard_from_other ?? null,
        application_type === 'siwes' ? siwes_institution ?? null : null,
        application_type === 'siwes' ? siwes_department ?? null : null,
        application_type === 'siwes' ? siwes_matric_number ?? null : null,
        application_type === 'siwes' ? siwes_level ?? null : null,
        application_type === 'siwes' ? siwes_start_date ?? null : null,
        application_type === 'siwes' ? siwes_end_date ?? null : null,
        application_type === 'siwes' ? siwes_itf_reference ?? null : null,
        application_type === 'siwes' ? siwes_supervisor_name ?? null : null,
        application_type === 'siwes' ? siwes_supervisor_phone ?? null : null,
        application_type === 'siwes' ? siwes_supervisor_email ?? null : null,
        application_type === 'siwes' ? siwes_letter_url ?? null : null,
        payment_plan ?? null, sponsor_name ?? null, payment_channel ?? null,
        amount_paid ?? null, terms_accepted ? 1 : 0,
        trainee_signature_url ?? null, sponsor_signature_url ?? null,
        signed_date ?? null, passport_url ?? null,
      ]
    )
  } catch (err) {
    console.error('[application] insert failed:', err)
    return json(500, { error: 'Could not save application.' })
  }

  return json(200, {
    ok: true,
    tracking_number: trk,
    message: 'Application received. Keep your tracking number to check your status.',
  })
}

function json(status: number, body: object, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}
