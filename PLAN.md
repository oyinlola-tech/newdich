# Newdich Technology Institute — Registration, Tracking & Admin Plan

## Overview

Add two student registration paths (standard trainee + SIWES/industrial training), an admin dashboard to track applications and messages, a student tracking page, and a contact system where admins reply to students by email.

Current repo: Next.js 16 (App Router), static output, Tailwind-free custom CSS, TypeScript. Existing contact API at `api/contact.ts`.

---

## 1. Registration Routes & Application Forms

### A. Normal student registration
Route: `/apply` → page `src/app/apply/page.tsx`
- Form matches the provided 3-page PDF (Sections 1–7, incl. passport upload).
- Fields: biodata, next of kin, education, tech background, track/specialization, study mode, schedule, payment plan, terms/declaration, passport photo.
- Generates a dedicated application/tracking number: `NDTI/SE/2026/XXXXX`.

### B. SIWES student registration
Route: `/apply/siwes` → page `src/app/apply/siwes/page.tsx`
- SIWES = Students Industrial Work Experience Scheme (Nigeria, ITF-supervised industrial attachment).
- Extra SIWES-specific fields to research/capture:
  - Institution (university/polytechnic/college of education)
  - Department / Faculty
  - Matriculation number
  - Academic level (ND1, ND2, HND1, HND2, B.Sc 300L, etc.)
  - SIWES duration / attachment period (start–end dates)
  - ITF/SIWES reference or logbook number
  - Institution supervisor name & contact
  - Letter of introduction / SIWES placement letter upload
  - Preferred training track (same as normal students)
- Also generates a dedicated tracking number (prefix `NDTI/SIWES/2026/XXXXX`).

### C. Shared behaviour
- Both forms POST to the same backend route (`api/application.ts`) that writes to a database/JSON store, assigns status `pending`, sends a confirmation email/SMS with the tracking number, and redirects to `/track?ref=XXXXXX`.
- Passport/document uploads stored (e.g., R2/S3 or local `/uploads` for now) with a public URL.

---

## 2. SIWES Details — Confirmed Fields

- Academic level includes both **200L** and **300L** (both do SIWES).
- SIWES-specific fields: institution, department, matric number, level (200L/300L), start/end dates, ITF reference/logbook no., supervisor name + phone + email, letter of introduction upload.

## 3. Backend Stack (confirmed)

- **Language:** TypeScript (Next.js API routes)
- **Database:** MySQL, raw SQL via `mysql2/promise` (no Prisma/ORM)
- **Migrations:** Auto-run on first DB access. `CREATE TABLE IF NOT EXISTS` so re-running is safe. Idempotent seed inserts (superadmin only created if no users exist).
- **Auth:** Session tokens stored in DB. Superadmin + admin roles. Superadmin creates admin users; each new admin gets a one-time password-setup link (expires 24h).
- **Password hashing:** bcryptjs

---

## 3. Admin Dashboard

Route: `/admin` (protected, admin-only)

### A. Applications tracker
Table/list view of all applications with:
- Tracking number
- Name, email, phone
- Type (Standard / SIWES)
- Program track
- Status: `pending | approved | rejected | enrolled`
- Payment status: `unpaid | partial | paid`
- Date applied
- Actions: View details, Approve, Reject, Mark enrolled

Clicking an application opens the full form data + uploaded passport/documents.

### B. Student management
- List of enrolled students with their tracking number
- Edit student profile (contact, batch, track)
- Deactivate / reactivate a student
- Reset or reissue tracking number

### C. Contact / message inbox
- All messages from the contact form (`api/contact.ts` existing endpoint)
- Fields: name, email, phone, message, student tracking number (if logged in), date, read/unread
- Admin can open a message and hit **Reply** → sends email to the student (via Resend, already a dependency)
- Admin replies are stored as a thread linked to the student

---

## 4. Student Tracking Page

Route: `/track` (public lookup by ref) and `/track/my` (authenticated student dashboard)

### Public lookup (`/track?ref=NDTI/...`)
- Enter tracking number → shows application status only (pending/approved/rejected/enrolled).

### Student dashboard (`/track/my`)
Requires login (session/cookie). Shows:
- Profile: name, email, phone, tracking number, batch, track
- Application status + payment status
- Attendance: "You've attended X of Y classes" (class sessions attended vs total)
- Projects: list of projects with status (submitted / pending / graded) and marks
- Percentage: overall course percentage / grade
- Upcoming sessions / schedule

---

## 5. Contact System (student ↔ admin)

### Frontend
- Contact page (existing `/contact`) updated so logged-in students auto-fill name/email/tracking number.
- Message textarea + optional file attachment.

### Backend
- `api/contact.ts` stores each message with `studentRef`, `read: false`, `replied: false`.
- Admin dashboard lists messages, marks as read, and replies.

### Email reply
- Admin writes reply in dashboard → Resend sends email to student's registered email with subject "Re: your message to Newdich Technology Institute".
- Student sees the reply in their dashboard thread too (optional v2).

---

## 6. Dedicated Tracking Numbers

Every application (standard and SIWES) gets a unique reference:
- Standard: `NDTI/SE/2026/00001`
- SIWES: `NDTI/SIWES/2026/00001`
- Format stored on the student record; used for `/track` lookup and contact messages.

---

## 7. Suggested Implementation Order

| Phase | Task |
|---|---|
| 1 | Add database (or JSON/file store) + application model; `api/application.ts` endpoint |
| 2 | Build `/apply` form (normal student) + passport upload |
| 3 | Research & build `/apply/siwes` form |
| 4 | Build `/track` public lookup + `/track/my` student dashboard (attendance, projects, percentage) |
| 5 | Build `/admin` dashboard: applications, student management, message inbox |
| 6 | Wire contact form replies via Resend; admin can answer and student receives email |
| 7 | Protect admin routes (auth middleware); add student login/session |
| 8 | UI polish + mobile testing (recent nav fixes apply) |

---

## 8. Files to create / modify (in this repo)

**New:**
- `src/app/apply/page.tsx` — normal student form
- `src/app/apply/siwes/page.tsx` — SIWES form
- `src/app/track/page.tsx` — public lookup by ref
- `src/app/track/my/page.tsx` — student dashboard
- `src/app/admin/page.tsx` — admin dashboard shell
- `src/app/admin/applications/page.tsx` — application tracker
- `src/app/admin/students/page.tsx` — student management
- `src/app/admin/messages/page.tsx` — contact inbox + reply
- `api/application.ts` — application submission endpoint
- `src/lib/applications.ts` — application data helpers

**Modify:**
- `api/contact.ts` — store `studentRef`, `read`, `replied` flags
- `src/components/ContactForm.tsx` — add tracking number field
- `src/app/layout.tsx` — add nav links for Apply / Track / Admin

---

## Next step

Confirm with the institute which SIWES fields are mandatory, then I can start scaffolding the `/apply` route and the application API.
