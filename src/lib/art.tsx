/**
 * Drawn product art — design.md, Do's and Don'ts.
 *
 * Every illustration on this site is one of the systems the company actually
 * ships, drawn as vector: a metering dashboard, a queue board, a POS terminal,
 * an exam screen, an exchange, a reconciliation ledger. Nothing here is stock
 * and nothing is decorative.
 *
 * They are inline SVG rather than files so they take their colour from the
 * theme tokens — `var(--signal)` inside an inline SVG resolves against the
 * page. All of them are drawn on a 400x240 canvas and scale to their
 * container.
 */

import type { JSX, ReactNode } from 'react'

const W = 400
const H = 240

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

type TextProps = {
  x: number
  y: number
  children: ReactNode
  size?: number
  fill?: string
  weight?: number | string
  anchor?: 'start' | 'middle' | 'end'
  family?: string
}

function T({
  x,
  y,
  children,
  size = 8,
  fill = 'var(--text-3)',
  weight = 500,
  anchor = 'start',
  family = 'var(--mono)',
}: TextProps) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={family}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      textAnchor={anchor}
      letterSpacing="0.4"
    >
      {children}
    </text>
  )
}

function P({
  x,
  y,
  w,
  h,
  r = 8,
  fill = 'var(--bg-2)',
  stroke = 'var(--line-2)',
}: {
  x: number
  y: number
  w: number
  h: number
  r?: number
  fill?: string
  stroke?: string
}) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} />
}

function Bar({
  x,
  y,
  w,
  h,
  fill = 'var(--line)',
  r = 2,
}: {
  x: number
  y: number
  w: number
  h: number
  fill?: string
  r?: number
}) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
}

/** The outer enclosure every instrument is drawn inside. */
function Frame() {
  return <P x={8} y={8} w={384} h={224} r={10} fill="var(--surface)" stroke="var(--line)" />
}

/* ------------------------------------------------------------------------
   1 — Smart metering: the consumption dashboard
   ------------------------------------------------------------------------ */

function MeterDashboard() {
  const points = [30, 34, 28, 40, 46, 42, 52, 60, 55, 64, 72, 68, 78, 86, 80, 92]
  const step = 250 / (points.length - 1)
  const top = 60
  const bottom = 148
  const path = points
    .map((v, i) => {
      const x = 24 + i * step
      const y = bottom - (v / 100) * (bottom - top)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <Svg>
      <Frame />
      <T x={24} y={32}>CONSUMPTION · FEEDER 04</T>
      <circle cx={286} cy={28} r={3} fill="var(--signal)" />
      <T x={296} y={32} fill="var(--signal)">LIVE</T>
      <T x={24} y={52} size={15} fill="var(--text)" weight={600} family="var(--display)">
        4,128.6 kWh
      </T>
      {[60, 82, 104, 126, 148].map((y) => (
        <line key={y} x1={24} y1={y} x2={274} y2={y} stroke="var(--line-2)" />
      ))}
      <path d={`${path} L274 ${bottom} L24 ${bottom} Z`} fill="var(--signal-soft)" />
      <path d={path} stroke="var(--signal)" strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={274} cy={bottom - 0.92 * (bottom - top)} r={3} fill="var(--signal)" />
      <T x={24} y={164}>00:00</T>
      <T x={150} y={164}>12:00</T>
      <T x={262} y={164}>NOW</T>
      <P x={288} y={60} w={96} h={108} />
      <T x={296} y={72} size={7}>BY ESTATE</T>
      {[60, 44, 52, 30, 38].map((w, i) => (
        <Bar
          key={i}
          x={296}
          y={78 + i * 18}
          w={20 + w}
          h={8}
          fill={i === 0 ? 'var(--signal)' : 'var(--line)'}
        />
      ))}
      <P x={24} y={178} w={352} h={44} />
      <T x={36} y={196}>METERS ONLINE</T>
      <T x={36} y={212} size={9} fill="var(--text)">1,284 / 1,300</T>
      <T x={168} y={196}>BILLED TODAY</T>
      <T x={168} y={212} size={9} fill="var(--text)">₦3.42m</T>
      <T x={292} y={196}>EXCEPTIONS</T>
      <T x={292} y={212} size={9} fill="var(--text-3)">6 open</T>
    </Svg>
  )
}

/* ------------------------------------------------------------------------
   2 — Smart queue: the counter board
   ------------------------------------------------------------------------ */

function QueueBoard() {
  const rows: Array<[string, string, boolean]> = [
    ['A-118', 'Counter 03', true],
    ['A-119', 'Counter 01', false],
    ['A-120', 'Counter 05', false],
    ['A-121', '—', false],
  ]
  return (
    <Svg>
      <Frame />
      <T x={24} y={32}>NOW SERVING</T>
      <T x={24} y={76} size={34} fill="var(--text)" weight={700} family="var(--display)">
        A-118
      </T>
      <T x={150} y={76} size={9} fill="var(--signal)">COUNTER 03</T>
      <T x={150} y={92}>AVG WAIT 4m 12s</T>
      <P x={288} y={40} w={88} h={48} />
      <T x={300} y={58} size={7}>IN QUEUE</T>
      <T x={300} y={78} size={16} fill="var(--text)" weight={700} family="var(--display)">
        23
      </T>
      {rows.map(([ticket, counter, on], i) => {
        const y = 118 + i * 26
        return (
          <g key={ticket}>
            <P
              x={24}
              y={y}
              w={352}
              h={20}
              r={5}
              fill={on ? 'var(--signal-soft)' : 'var(--bg-2)'}
              stroke={on ? 'transparent' : 'var(--line-2)'}
            />
            <T x={36} y={y + 14} size={9} fill={on ? 'var(--signal)' : 'var(--text-2)'}>
              {ticket}
            </T>
            <T x={120} y={y + 14} fill={on ? 'var(--signal)' : 'var(--text-3)'}>
              {counter}
            </T>
            <T
              x={364}
              y={y + 14}
              size={7}
              fill={on ? 'var(--signal)' : 'var(--text-3)'}
              anchor="end"
            >
              {on ? 'SERVING' : 'WAITING'}
            </T>
          </g>
        )
      })}
    </Svg>
  )
}

/* ------------------------------------------------------------------------
   3 — LAN point of sale: the terminal
   ------------------------------------------------------------------------ */

function PosTerminal() {
  return (
    <Svg>
      <Frame />
      <P x={36} y={28} w={176} h={184} r={12} fill="var(--bg-2)" stroke="var(--line)" />
      <P x={52} y={44} w={144} h={68} r={6} fill="var(--surface)" stroke="var(--line-2)" />
      <T x={64} y={64} size={7}>AMOUNT DUE</T>
      <T x={64} y={88} size={13} fill="var(--text)" weight={600} family="var(--display)">
        ₦12,450.00
      </T>
      <circle cx={180} cy={60} r={3} fill="var(--signal)" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={52 + (i % 3) * 38}
          y={132 + Math.floor(i / 3) * 26}
          width={30}
          height={20}
          rx={4}
          fill="var(--raised)"
        />
      ))}
      <P x={240} y={60} w={128} h={152} />
      <T x={258} y={80} size={7}>RECEIPT · 0492</T>
      {[92, 68, 84, 54].map((w, i) => (
        <Bar key={i} x={258} y={96 + i * 14} w={w} h={4} />
      ))}
      <line x1={258} y1={162} x2={350} y2={162} stroke="var(--line)" strokeDasharray="2 3" />
      <T x={258} y={180} size={7}>TOTAL</T>
      <T x={350} y={180} fill="var(--text)" anchor="end">₦12,450.00</T>
      <T x={258} y={198} size={7} fill="var(--signal)">OFFLINE · LAN</T>
      <T x={36} y={224} size={7}>RUNS ON THE MERCHANT’S OWN NETWORK</T>
    </Svg>
  )
}

/* ------------------------------------------------------------------------
   4 — CBT examinations: the candidate screen
   ------------------------------------------------------------------------ */

function ExamScreen() {
  const options: Array<[string, boolean]> = [
    ['A', false],
    ['B', true],
    ['C', false],
    ['D', false],
  ]
  return (
    <Svg>
      <Frame />
      <T x={24} y={32}>QUESTION 12 OF 60</T>
      <P x={288} y={20} w={88} h={22} r={6} />
      <T x={300} y={35} fill="var(--text-2)">42:18 LEFT</T>
      <Bar x={24} y={48} w={232} h={5} />
      <Bar x={24} y={62} w={190} h={5} />
      <Bar x={24} y={76} w={150} h={5} />
      {options.map(([letter, chosen], i) => {
        const y = 108 + i * 26
        return (
          <g key={letter}>
            <P
              x={24}
              y={y}
              w={232}
              h={20}
              r={5}
              fill={chosen ? 'var(--signal-soft)' : 'var(--bg-2)'}
              stroke={chosen ? 'var(--signal)' : 'var(--line-2)'}
            />
            <T x={36} y={y + 14} fill={chosen ? 'var(--signal)' : 'var(--text-3)'}>
              {letter}
            </T>
            <Bar
              x={52}
              y={y + 8}
              w={150 - i * 18}
              h={4}
              fill={chosen ? 'var(--signal)' : 'var(--line)'}
            />
          </g>
        )
      })}
      <T x={280} y={78} size={7}>ANSWERED 11 / 60</T>
      {Array.from({ length: 24 }, (_, i) => {
        const fill = i < 11 ? 'var(--signal)' : i === 11 ? 'var(--signal-soft)' : 'var(--bg-2)'
        const stroke = i < 11 ? 'transparent' : i === 11 ? 'var(--signal)' : 'var(--line-2)'
        return (
          <rect
            key={i}
            x={280 + (i % 4) * 26}
            y={92 + Math.floor(i / 4) * 22}
            width={18}
            height={16}
            rx={4}
            fill={fill}
            stroke={stroke}
          />
        )
      })}
      <T x={24} y={224} size={7} fill="var(--signal)">
        AUTOSAVED · RESUMES AFTER A POWER CUT
      </T>
    </Svg>
  )
}

/* ------------------------------------------------------------------------
   5 — Wallets and exchange: balances and the book
   ------------------------------------------------------------------------ */

function ExchangeBook() {
  const points = [40, 46, 42, 52, 48, 58, 66, 62, 72, 68, 78, 74, 84, 90]
  const step = 150 / (points.length - 1)
  const line = points
    .map(
      (v, i) =>
        `${i === 0 ? 'M' : 'L'}${(218 + i * step).toFixed(1)} ${(150 - v * 0.7).toFixed(1)}`,
    )
    .join(' ')

  return (
    <Svg>
      <Frame />
      <T x={24} y={32}>WALLET BALANCE</T>
      <T x={24} y={58} size={14} fill="var(--text)" weight={600} family="var(--display)">
        ₦8,412,900.00
      </T>
      <P x={24} y={72} w={176} h={140} />
      <T x={36} y={88} size={7}>P2P ORDER BOOK</T>
      {Array.from({ length: 5 }, (_, i) => {
        const y = 96 + i * 20
        return (
          <g key={i}>
            <T x={36} y={y} fill="var(--signal)">
              {(1421.5 - i * 0.75).toFixed(2)}
            </T>
            <T x={110} y={y} fill="var(--text-3)" anchor="end">
              {`${i + 1},${String(240 - i * 37).padStart(3, '0')}`}
            </T>
            <Bar x={120} y={y - 7} w={60 - i * 9} h={8} fill="var(--signal-soft)" />
          </g>
        )
      })}
      <P x={212} y={72} w={164} h={140} />
      <T x={224} y={88} size={7}>USDT / NGN</T>
      <T x={224} y={108} size={12} fill="var(--text)" weight={600} family="var(--display)">
        1,421.50
      </T>
      <T x={300} y={108} fill="var(--signal)">+1.8%</T>
      <path d={line} stroke="var(--signal)" strokeWidth={1.8} strokeLinecap="round" />
      <T x={224} y={196} size={7}>SETTLEMENT T+0 · ESCROW HELD</T>
    </Svg>
  )
}

/* ------------------------------------------------------------------------
   6 — The reconciliation ledger: two sides, matched
   ------------------------------------------------------------------------ */

function LedgerReconcile() {
  const states = ['ok', 'ok', 'ok', 'pending']
  return (
    <Svg>
      <Frame />
      <T x={24} y={32}>RECONCILIATION · 24 SEP</T>
      <T x={24} y={68} size={7} fill="var(--signal)">GATEWAY</T>
      <T x={236} y={68} size={7} fill="var(--signal)">BANK STATEMENT</T>
      {states.map((state, i) => {
        const y = 88 + i * 30
        const matched = state === 'ok'
        const colour = matched ? 'var(--signal)' : 'var(--text-3)'
        return (
          <g key={i}>
            <P x={24} y={y} w={140} h={22} r={5} />
            <T x={36} y={y + 15} size={7} fill="var(--text-2)">{`TXN-90${i + 1}4`}</T>
            <P x={236} y={y} w={140} h={22} r={5} />
            <T x={248} y={y + 15} size={7} fill="var(--text-2)">{`STMT-40${i + 2}`}</T>
            <path
              d={`M164 ${y + 11} C 190 ${y + 11}, 210 ${y + 11}, 236 ${y + 11}`}
              stroke={colour}
              strokeWidth={1.4}
              strokeDasharray={matched ? undefined : '3 3'}
            />
            <circle cx={200} cy={y + 11} r={3.5} fill={colour} />
          </g>
        )
      })}
      <P x={24} y={196} w={352} h={26} r={6} />
      <T x={36} y={213} fill="var(--signal)">MATCHED 3 / 4</T>
      <T x={160} y={213} fill="var(--text-3)">UNMATCHED ₦18,400</T>
      <T x={364} y={213} size={7} fill="var(--text-3)" anchor="end">AUTO · 15 MIN</T>
    </Svg>
  )
}

/* ------------------------------------------------------------------------
   7 — Identity: verification pipeline
   ------------------------------------------------------------------------ */

function IdentityCheck() {
  const checks: Array<[string, boolean]> = [
    ['DOCUMENT', true],
    ['LIVENESS', true],
    ['FACE MATCH', true],
    ['SANCTIONS', false],
  ]
  return (
    <Svg>
      <Frame />
      <T x={24} y={32}>IDENTITY VERIFICATION</T>
      <P x={24} y={56} w={148} h={166} />
      <rect
        x={52}
        y={80}
        width={92}
        height={112}
        rx={10}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={1.4}
        strokeDasharray="14 8"
      />
      <circle cx={98} cy={124} r={22} fill="var(--raised)" />
      <path d="M70 176c6-18 50-18 56 0" fill="var(--raised)" />
      <T x={52} y={208} size={7} fill="var(--signal)">LIVENESS PASSED</T>
      <T x={196} y={78} size={7}>CHECKS</T>
      {checks.map(([name, ok], i) => {
        const y = 96 + i * 30
        return (
          <g key={name}>
            <P x={196} y={y} w={180} h={22} r={5} />
            <T x={210} y={y + 15} size={7} fill="var(--text-2)">{name}</T>
            <circle
              cx={358}
              cy={y + 11}
              r={4}
              fill={ok ? 'var(--signal)' : 'var(--text-3)'}
            />
          </g>
        )
      })}
      <T x={196} y={226} size={7}>AUDIT TRAIL WRITTEN · 04:12</T>
    </Svg>
  )
}

/* ------------------------------------------------------------------------
   8 — Architecture: how a Newdich system is put together
   ------------------------------------------------------------------------ */

function Architecture() {
  const boxes: Array<[string, string, number]> = [
    ['EDGE', 'Meters, terminals, sensors', 16],
    ['GATEWAY', 'APIs, auth, rate limits', 116],
    ['CORE', 'Ledger, rules, workflows', 216],
    ['SURFACE', 'Dashboards, apps, reports', 316],
  ]
  return (
    <Svg>
      <Frame />
      {boxes.map(([name, note, x], i) => {
        const accent = i === 1 || i === 2
        const words = note.split(' ')
        const lines: string[] = []
        for (let j = 0; j < words.length; j += 2) lines.push(words.slice(j, j + 2).join(' '))
        return (
          <g key={name}>
            <P
              x={x + 8}
              y={72}
              w={68}
              h={96}
              fill={accent ? 'var(--signal-soft)' : 'var(--bg-2)'}
              stroke={accent ? 'var(--signal)' : 'var(--line-2)'}
            />
            <T
              x={x + 42}
              y={96}
              size={7}
              fill={accent ? 'var(--signal)' : 'var(--text-3)'}
              anchor="middle"
            >
              {name}
            </T>
            {lines.map((l, j) => (
              <T key={l} x={x + 42} y={118 + j * 12} size={6.5} anchor="middle">
                {l}
              </T>
            ))}
            {i < 3 ? (
              <>
                <path
                  d={`M${x + 76} 120 L${x + 108} 120`}
                  stroke="var(--line)"
                  strokeWidth={1.2}
                />
                <path
                  d={`M${x + 102} 116 L${x + 108} 120 L${x + 102} 124`}
                  stroke="var(--signal)"
                  strokeWidth={1.2}
                  fill="none"
                />
              </>
            ) : null}
          </g>
        )
      })}
      <T x={24} y={40}>SYSTEM SHAPE · EVERY NEWDICH BUILD</T>
      <T x={24} y={200} size={7}>OBSERVABILITY, BACKUPS AND DEPLOYMENT SPAN ALL FOUR</T>
      <Bar x={24} y={210} w={352} h={4} />
    </Svg>
  )
}

/* ------------------------------------------------------------------------
   9 — Newdich LAN: the territory coverage panel
   ------------------------------------------------------------------------ */

function LanCoverage() {
  const cx = 150
  const cy = 142
  const reach = 74
  const blocks: JSX.Element[] = []
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 11; col += 1) {
      const x = 32 + col * 21
      const y = 88 + row * 17
      const dx = x - cx
      const dy = y - cy
      const inside = Math.sqrt(dx * dx + dy * dy) < reach - 4
      blocks.push(
        <rect
          key={`${row}-${col}`}
          x={x.toFixed(1)}
          y={y.toFixed(1)}
          width={7}
          height={7}
          rx={1.9}
          fill={inside ? 'var(--signal-lo)' : 'var(--line)'}
        />,
      )
    }
  }
  return (
    <Svg>
      <Frame />
      <T x={24} y={32}>TERRITORY · LAN C3KM</T>
      <circle cx={286} cy={28} r={3} fill="var(--signal)" />
      <T x={296} y={32} fill="var(--signal)">VERIFIED</T>
      <T x={24} y={54} size={15} fill="var(--text)" weight={600} family="var(--display)">
        3.0 km
      </T>
      <T x={92} y={54} size={7}>radius</T>
      {[26, 44, 60].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--line-2)" />
      ))}
      <circle
        cx={cx}
        cy={cy}
        r={reach}
        fill="var(--signal-soft)"
        stroke="var(--signal)"
        strokeOpacity={0.55}
      />
      {blocks}
      <rect x={cx - 2.5} y={cy - 2.5} width={5} height={5} rx={1.4} fill="var(--signal)" />
      <line
        x1={cx}
        y1={cy}
        x2={cx + reach}
        y2={cy}
        stroke="var(--signal)"
        strokeOpacity={0.7}
        strokeDasharray="2 3"
      />
      <T x={cx + 14} y={cy - 6} size={7} fill="var(--signal)">3,000 m</T>
      <P x={288} y={66} w={96} h={54} />
      <T x={296} y={80} size={7}>POPULATION</T>
      <T x={296} y={98} size={11} fill="var(--text)" weight={600} family="var(--display)">
        6,000
      </T>
      <P x={24} y={194} w={352} h={30} />
      <T x={36} y={206}>COVERAGE</T>
      <T x={36} y={218} fill="var(--text)">3,000 m</T>
      <T x={150} y={206}>PACKAGE</T>
      <T x={150} y={218} fill="var(--text)">LAN C3KM</T>
      <T x={268} y={206}>OVERLAP</T>
      <T x={268} y={218} fill="var(--signal)">None</T>
    </Svg>
  )
}

export const ART = {
  meter: MeterDashboard,
  queue: QueueBoard,
  pos: PosTerminal,
  exam: ExamScreen,
  exchange: ExchangeBook,
  ledger: LedgerReconcile,
  identity: IdentityCheck,
  architecture: Architecture,
  lan: LanCoverage,
} as const

export type ArtKey = keyof typeof ART

export function Art({ name }: { name: ArtKey }) {
  const Component = ART[name]
  return <Component />
}
