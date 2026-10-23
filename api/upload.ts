import { ensureMigrated, query } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export const config = { api: { bodyParser: false } }

export async function POST(request: Request): Promise<Response> {
  await ensureMigrated()
  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const field = formData.get('field') as string ?? 'file'

  if (!file) {
    return json(400, { error: 'No file provided.' })
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  if (!allowed.includes(file.type)) {
    return json(400, { error: 'Only JPG, PNG, WEBP images and PDF files are allowed.' })
  }

  const maxBytes = 5 * 1024 * 1024
  const arrayBuffer = await file.arrayBuffer()
  if (arrayBuffer.byteLength > maxBytes) {
    return json(400, { error: 'File must be under 5 MB.' })
  }

  const ext = file.name.split('.').pop() ?? 'bin'
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`
  const dest = path.join(UPLOAD_DIR, safeName)
  await fs.writeFile(dest, Buffer.from(arrayBuffer))

  const url = `/uploads/${safeName}`
  return json(200, { ok: true, url, field })
}

function json(status: number, body: object, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })
}
