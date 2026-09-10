/**
 * The contact endpoint's guards, exercised.
 *
 *   npm run test:contact
 *
 * Every case asserted here is decided before the Resend call, so this sends no
 * mail and touches no network. The key below is a string, not a credential.
 *
 * It runs against the compiled endpoint in `.test-build/`, which `npm run
 * test:contact` produces — the endpoint is TypeScript and this repo has no
 * transform hook to load it directly.
 */
process.env.RESEND_API_KEY = 're_test_not_a_real_key'
process.env.CONTACT_ORIGINS = 'https://newdich.tech'

const mod = await import('../.test-build/contact.mjs')

let pass = 0
let fail = 0
const check = (label, got, want) => {
  if (got === want) {
    pass += 1
    console.log(`  ok   ${label} -> ${got}`)
  } else {
    fail += 1
    console.log(`  FAIL ${label} -> got ${got}, wanted ${want}`)
  }
}

/* Every call gets its own client address unless a test names one. The rate
   limiter runs before validation — deliberately, so a malformed post is not a
   free one — which means two cases sharing an address would make the second
   one answer 429 instead of the code it is actually testing. */
let nth = 0
const post = (body, headers = {}, opts = {}) => {
  nth += 1
  return mod.POST(
    new Request('https://newdich.tech/api/contact', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://newdich.tech',
        'x-forwarded-for': opts.ip ?? `198.51.100.${nth}`,
        ...headers,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )
}

const valid = {
  name: 'Ada Okoro',
  email: 'ada@example.com',
  org: 'Example Ltd',
  practice: 'Software engineering',
  brief: 'We run a metering system that has to settle offline for days at a time.',
}

console.log('method guards')
check('GET', mod.GET().status, 405)
check('DELETE', mod.DELETE().status, 405)
check('OPTIONS', mod.OPTIONS().status, 204)
check('OPTIONS grants no CORS', mod.OPTIONS().headers.get('access-control-allow-origin'), null)

console.log('\nrequest shape')
check('form content-type refused', (await post(valid, { 'content-type': 'application/x-www-form-urlencoded' })).status, 415)
check('foreign origin refused', (await post(valid, { origin: 'https://evil.example' })).status, 403)
check('declared oversize refused', (await post(valid, { 'content-length': String(2 * 1024 * 1024) })).status, 413)
check('undeclared oversize refused', (await post(JSON.stringify({ ...valid, brief: 'x'.repeat(64 * 1024) }))).status, 413)
check('non-JSON refused', (await post('not json at all')).status, 400)
check('JSON array refused', (await post([1, 2, 3])).status, 400)

console.log('\nvalidation')
check('short name', (await post({ ...valid, name: 'A' })).status, 422)
check('bad email', (await post({ ...valid, email: 'nope' })).status, 422)
check('email with CR', (await post({ ...valid, email: 'a@b.com\r\nbcc: x@y.com' })).status, 422)
check('email with angle bracket', (await post({ ...valid, email: 'a@b.com>, evil@x.com' })).status, 422)
check('short brief', (await post({ ...valid, brief: 'hi' })).status, 422)
check('honeypot accepted silently', (await post({ ...valid, company: 'bot' })).status, 200)

const errBody = await (await post({ ...valid, name: '' })).json()
check('422 names the field', Object.keys(errBody.errors ?? {}).includes('name'), true)

console.log('\nrate limiting (one address)')
const ip = '203.0.113.9'
const codes = []
for (let i = 0; i < 4; i += 1) codes.push((await post(valid, {}, { ip })).status)
check('first two attempts pass the guards', codes.slice(0, 2).every((c) => c !== 429), true)
check('third attempt in the burst window', codes[2], 429)
const limited = await post(valid, {}, { ip })
check('retry-after is stated', Number(limited.headers.get('retry-after')) > 0, true)

console.log('\nresponse hygiene')
const r = await post({ ...valid, name: 'A' })
check('nosniff', r.headers.get('x-content-type-options'), 'nosniff')
check('no-store', r.headers.get('cache-control'), 'no-store')
check('no referrer', r.headers.get('referrer-policy'), 'no-referrer')

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)
