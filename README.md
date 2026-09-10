# Newdich Technology — website

A thirty-three route site for Newdich Technology (Abuja & Okitipupa, Nigeria):
software engineering, IoT & robotics, cybersecurity, blockchain/Web3, AI, data
science and game development — plus Newdich LAN, the Ansofra framework and
Newdich Technology Institute.

Next.js App Router, TypeScript, React server components, static export. The
build writes `out/`: plain HTML, one CSS bundle and the client islands that
actually need JavaScript, deployable to any static host.

**`design.md` is the design authority.** If the code and that file disagree,
the code is wrong. Read it before changing anything visual.

---

## Build

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export into out/
npm run serve      # serve out/ locally
npm run typecheck  # tsc --noEmit
npm test           # typecheck, then the contact endpoint's guards
```

`npm test` runs `test/contact.test.mjs` against the compiled endpoint: the
method, content-type, origin, size, validation, header-injection and rate-limit
cases. Every one of them is decided before the Resend call, so it sends no mail
and needs no network and no key.

Routes are directories (`trailingSlash: true`), so serve `out/` from a domain
root or any host that resolves directory indexes — Netlify, Vercel, Cloudflare
Pages, GitHub Pages, S3, nginx. Opening `out/index.html` from `file://` will not
work.

---

## Routes

```
out/index.html                       ->  /
out/faq/index.html                   ->  /faq
out/work/smart-metering/index.html   ->  /work/smart-metering
out/404.html                         ->  the host convention
```

`src/lib/routes.ts` is the single place a path is decided. The App Router
resolves URLs from the `src/app` tree, but a path that appears in a link, a
sitemap entry or a breadcrumb comes from that table and nowhere else.

Dynamic segments — `services/[practice]`, `work/[slug]`, `insights/[slug]` —
enumerate through `generateStaticParams`. Metadata comes from the Metadata API
via `src/lib/meta.ts`, so every page carries its own title, description,
canonical and Open Graph card.

---

## Layout

```
design.md                 The design system. The authority.
api/contact.ts            The one function: takes the form, sends via Resend.
vercel.json               Response headers, Vercel.
netlify.toml              Build, function wiring and redirect, Netlify.
public/_headers           Response headers, Netlify and Cloudflare Pages.
next.config.ts            Static export, trailing slashes.
src/
  app/                    Routes. Server components unless marked otherwise.
    layout.tsx            Shell: fonts, theme script, nav, footer.
    not-found.tsx         The 404 — an instrument reporting "no route".
    error.tsx             The 500 — same panel, service fault.
    sitemap.ts            Generated from the route table.
  components/
    Nav.tsx               'use client' — rail, mega panel, drawer, theme.
    Footer.tsx            Status rail, sitemap, wordmark, legal.
    Console.tsx           'use client' — the shelf's telemetry loop.
    Gallery.tsx           'use client' — the pointer-reactive plate ring.
    Filmstrip.tsx         'use client' — the /gallery photo carousel.
    JsonLd.tsx            Structured data: breadcrumbs, FAQ, Article.
    HeroArc.tsx           'use client' — the dot-matrix arc.
    Wordmark.tsx          SVG nameplate that fills the page at any width.
    Instrument.tsx        The page instrument panel.
    Matrix.tsx            The capability matrix.
    ui.tsx                Panel, index, spec — the four structures.
  data/                   Company facts. Typed, and the only source of copy.
  lib/
    art.tsx               The nine drawn instruments, as inline SVG.
    routes.ts             The route table.
    nav.ts                Navigation, footer sitemap, the 404 route index.
  styles/                 Numbered sheets, imported in order by layout.tsx.
test/contact.test.mjs     The endpoint's guards. `npm test`.
public/.well-known/       security.txt — where to send a security report.
_legacy/                  The Python build this replaced. Not in the bundle.
```

### Client components

`'use client'` appears only where a component genuinely holds browser state:
`Nav`, `Console`, `Gallery`, `Filmstrip`, `HeroArc`, `Clock`, `Reveal`,
`ContactForm`, `FooterGroup`, `RequestedPath` and `error.tsx`. Everything else renders on the
server.

### Responsiveness

Checked, not assumed. Every route is walked at 360, 390, 768, 1024 and 1440 and
asserted to have no element escaping the viewport, excluding the deliberate
scroll containers (the capability matrix, the LAN package table) and the
off-screen skip link. Multi-column instruments step their column count down
rather than scaling a readout below the size at which it still reads; nothing
is dropped to make a breakpoint fit.

Every page is complete and readable with JavaScript off. The nav swaps its
menu triggers for the links behind them, the footer sitemap carries the full
route list, the FAQ is native `<details>`, and the instruments ship their
composed static frame in the markup rather than an empty panel.

---

## The contact endpoint

The site is a static export with one exception: `api/contact.ts`, a platform
function that receives the contact form and sends it with
[Resend](https://resend.com).

**It is a function and not browser code on purpose.** A Resend API key is a
secret — there is no publishable browser key. A key in the client bundle can be
lifted out and used to send mail as `newdich.tech`, which ends with the domain
blocklisted. Never put `RESEND_API_KEY` in a `NEXT_PUBLIC_*` variable.

### Environment

Copy `.env.example` and set these **on the host**, not in the repo. Never give
one of them a `NEXT_PUBLIC_` prefix — that prefix is the instruction to inline
the value into the browser bundle.

| Variable | Required | What |
|---|---|---|
| `RESEND_API_KEY` | yes | From https://resend.com/api-keys |
| `CONTACT_TO` | no | Where enquiries land. Defaults to `newdichngr@gmail.com` |
| `CONTACT_FROM` | no | Must be a sender on a domain verified in Resend. Until `newdich.tech` is verified, Resend's shared `onboarding@resend.dev` is used |
| `CONTACT_ORIGINS` | no | Comma-separated origins allowed to post. Set it. Unset, the origin is not checked, because this repo cannot know a deployment's hostname |

### Per host

The handler is written against the Web-standard `Request`/`Response` signature,
so its body does not change between the three. Only its location does.

- **Vercel** — the file stays at `api/contact.ts` and `vercel.json` supplies the
  headers.
- **Netlify** — move the file to `netlify/functions/contact.ts`. The redirect
  that maps `/api/contact` onto it is already in `netlify.toml`; it is a rewrite
  (`status = 200`) and not a redirect, because a 301 would drop the POST body.
- **Cloudflare Pages** — move it to `functions/api/contact.ts`. Pages Functions
  already speak `Request`/`Response` and already route `/api/contact`.

**Verify the endpoint on the first deployment, before the form is announced.**
A static export has no server of its own, so whether `/api/contact` resolves is
a property of the host's configuration and not of anything in this repo — and
the failure mode is silent from the outside: the form reports that it could not
send and offers the email address instead, which looks like a network problem
rather than a route that was never wired. Two calls settle it:

```bash
curl -i https://newdich.tech/api/contact                     # expect 405, not 404
curl -i -X POST https://newdich.tech/api/contact \
  -H 'content-type: application/json' -H 'origin: https://newdich.tech' \
  -d '{"name":"Test","email":"you@example.com","brief":"A deployment check, twenty characters or more."}'
```

A `404` on the first means the function is not deployed at that path. A `500`
on the second means `RESEND_API_KEY` is not set on the host.

### Behaviour

| Case | Response |
|---|---|
| `RESEND_API_KEY` unset | `500` — it refuses rather than pretending to send |
| Any method but `POST` | `405`; `OPTIONS` gets `204` and no CORS grant |
| Content type is not JSON | `415` |
| Origin is not in `CONTACT_ORIGINS` | `403` |
| Body over 16 KB | `413`, on the declared length and again on the read |
| Body is not a JSON object | `400` |
| Over the rate limit | `429` with `Retry-After` |
| Honeypot filled | `200` — accepted silently so a bot learns nothing |
| Field fails validation | `422` with a per-field message the form renders |
| Resend refuses | `502`, logged; the form offers the email address instead |

### What it defends against

The endpoint is unauthenticated, publicly reachable, and it spends money and
sender reputation when it runs. Each guard answers one line of that:

- **Flooding the inbox** — a rolling per-address limit (2 a minute, 5 an hour)
  and a ceiling on the endpoint as a whole (60 an hour). The counter lives in
  one function instance's memory, so it is a speed bump rather than a wall;
  the durable version belongs in front of the function (Vercel's firewall, a
  Cloudflare rate-limiting rule, or a shared store). This is written in the
  file rather than left to be discovered.
- **Mail sent as somebody else** — everything reaching the body is HTML-escaped
  including the apostrophe, the subject and every header value is stripped of
  CR/LF, control characters are removed from every field, and the reply-to must
  match a strict address shape with no whitespace, comma or angle bracket.
- **Being made to parse a large body** — the size is checked before the read,
  and the read is capped again, because a `Content-Length` is only a claim.
- **A cross-site post from a visitor's browser** — a JSON content type is
  required, which a browser cannot send cross-origin without a preflight, and
  no preflight is granted. `CONTACT_ORIGINS` closes it explicitly.

### Response headers

`next.config.ts` cannot carry them: a `headers()` block there is served by the
Next.js server, and `output: 'export'` means there is no server — only files,
and whatever host serves them. So the policy is written per host, and the two
copies must be changed together:

- `vercel.json` — Vercel.
- `public/_headers` — Netlify and Cloudflare Pages, both of which read it from
  the root of the published directory. `public/` is copied into `out/`, so it
  ships with the build.

Both set the same thing: HSTS, `nosniff`, `frame-ancestors 'none'`, a referrer
policy, a `Permissions-Policy` that turns off every device API this site does
not use, and a CSP. The CSP's `script-src` includes `'unsafe-inline'` and the
file says why — the App Router inlines its hydration payload and the theme
script must run before first paint, and a static export has no request to
derive a nonce from. Everything around that directive is closed: no plugins, no
framing, no base rewrite, forms post only to this origin, connections go
nowhere else.

`public/.well-known/security.txt` (RFC 9116) states where to send a report.
**Its `Expires` date is not optional and a stale file is worse than none** —
renew it before 2027-09-10.

---

## Placeholders to confirm

These are written from the company's public material and marked here rather
than being quietly presented as settled fact. Confirm before launch.

| Where | What to confirm |
|---|---|
| `src/data/careers.ts` | Which of the five roles are actually open, and their terms. The hiring steps describe a paid exercise — confirm that is the current process. |
| `src/data/company.ts` — `ENGAGEMENTS` | Commercial terms: discovery length, phase pricing, retainer shape and response times. |
| `src/data/company.ts` — `TIMELINE` | The 2016, 2018, 2021 and 2023 dates. 2014 (founding) and the Packagist release are published. |
| `src/data/institute.ts` | Fees, cohort dates and entry requirements are **not** published on the Institute page, so no page states any. Add them here when confirmed. |
| `src/data/lan.ts` | Package pricing is Newdich LAN's own and can change; the page says so and links to the live list. The two worked examples are labelled as projections, which is how the LAN site labels them — keep that label. |
| `src/data/gallery.ts` | The twelve Institute photographs are Newdich's own, pulled from `newdich.tech/institute` on 2026-09-10 and re-encoded. Confirm the company is happy for them to appear here, and that the people in them consent to being on this page. |
| `src/data/practices.ts` — `MATRIX` | The capability matrix. The empty cells are load-bearing; confirm each filled cell corresponds to shipped work. |

Sources checked on 2026-09-10: `newdich.tech/institute` (tracks, figures,
mentors, support services, location), `lanv2.newdich.tech` and its
`/api/getpackages` endpoint (LAN copy and package table), Packagist
(`newdich/ansofra`).

---

## Rules the content follows

From `design.md`, and enforced by review rather than by a linter:

- No client names, logos or testimonials until a signed reference exists. Case
  studies name the sector and the system.
- No invented outcome metrics. A number is either the company's own published
  figure or a property of the system itself.
- A projection is labelled a projection.
- Three colours: black, white, blue. State is carried by form, and the word is
  always present alongside the mark.
