'use client'

/**
 * The instrument shelf — four systems reporting at once, across the page.
 *
 * design.md, Elevation & Depth: one requestAnimationFrame loop on a ~8s cycle,
 * paused when off-screen, when the tab is hidden, and under
 * prefers-reduced-motion — where the composed static frame still reads
 * correctly. The values below are the frame that ships in the markup, so with
 * JavaScript off the rig is a still photograph rather than an empty one.
 *
 * Every figure here is a property of the system being drawn — a meter count, a
 * ticket number, a settlement window — not an invented business result.
 */

import { useEffect, useRef, useState } from 'react'

import { Clock } from '@/components/Clock'
import { Dot, Label } from '@/components/ui'

/** The composed frame: what the rig reads before, and without, the loop. */
const FRAME = {
  kwh: 4128.6,
  online: 1284,
  ticket: 118,
  waiting: 23,
  wait: 252,
  matched: 3,
}

const SPARK = [30, 34, 28, 40, 46, 42, 52, 60, 55, 64, 72, 68, 78, 86, 80, 92]

function sparkPath(values: number[], w = 260, h = 38) {
  const step = w / (values.length - 1)
  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)} ${(h - (v / 100) * h).toFixed(1)}`)
    .join(' ')
}

const mmss = (seconds: number) =>
  `${Math.floor(seconds / 60)}m ${String(Math.floor(seconds % 60)).padStart(2, '0')}s`

export function Console({ layout = 'shelf' }: { layout?: 'shelf' | 'rack' }) {
  const [state, setState] = useState(FRAME)
  const [live, setLive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let visible = false
    let start = 0

    const loop = (t: number) => {
      if (start === 0) start = t
      /* One ~8s cycle. Everything on the rig is a function of its phase, so
         the four panels stay in step with each other. */
      const phase = ((t - start) / 8000) % 1
      const wave = Math.sin(phase * Math.PI * 2)

      setState({
        kwh: FRAME.kwh + phase * 46.4,
        online: FRAME.online + Math.round(wave * 6),
        ticket: FRAME.ticket + Math.floor(phase * 4),
        waiting: FRAME.waiting + Math.round(wave * 3),
        wait: FRAME.wait + Math.round(wave * 18),
        matched: phase > 0.72 ? 4 : 3,
      })
      raf = window.requestAnimationFrame(loop)
    }

    const run = () => {
      if (raf !== 0) return
      if (!visible || document.hidden) return
      setLive(true)
      raf = window.requestAnimationFrame(loop)
    }
    const stop = () => {
      window.cancelAnimationFrame(raf)
      raf = 0
      setLive(false)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false
        if (visible) run()
        else stop()
      },
      { threshold: 0.15 },
    )
    if (ref.current) io.observe(ref.current)

    const onVisibility = () => (document.hidden ? stop() : run())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const serving = `A-${state.ticket}`

  return (
    <div className={`console console--${layout}`} ref={ref}>
      <div className="console-bar">
        <Label>
          <Dot held={!live} />
          {live ? 'Live' : 'Held'}
        </Label>
        <Label>4 systems</Label>
        <Clock />
      </div>

      <div className="console-grid">
        {/* 1 — metering */}
        <section className="panel">
          <header className="panel-head">
            <Label>Consumption · feeder 04</Label>
            <Label accent>kWh</Label>
          </header>
          <div className="reading reading--live">
            {state.kwh.toFixed(1)}
            <small>kWh</small>
          </div>
          <svg className="spark" viewBox="0 0 260 38" preserveAspectRatio="none" aria-hidden="true">
            <path className="area" d={`${sparkPath(SPARK)} L260 38 L0 38 Z`} />
            <path d={sparkPath(SPARK)} />
          </svg>
          <Label>
            {state.online.toLocaleString('en-NG')} / 1,300 online · 6 exceptions
          </Label>
        </section>

        {/* 2 — the queue board */}
        <section className="panel">
          <header className="panel-head">
            <Label>Smart queue · public office</Label>
            <Label accent>{state.waiting} waiting</Label>
          </header>
          <div className="reading">{serving}</div>
          <div className="queue">
            <div className="queue-row is-serving">
              <span>Counter 03</span>
              <b>{serving}</b>
            </div>
            <div className="queue-row">
              <span>Counter 01</span>
              <b>A-{state.ticket + 1}</b>
            </div>
            <div className="queue-row">
              <span>Average wait</span>
              <b>{mmss(state.wait)}</b>
            </div>
          </div>
        </section>

        {/* 3 — LAN point of sale */}
        <section className="panel">
          <header className="panel-head">
            <Label>LAN point of sale</Label>
            <Label>Offline</Label>
          </header>
          <div className="receipt">
            <div>
              <span>Items · 4</span>
              <span>₦11,200.00</span>
            </div>
            <div>
              <span>VAT</span>
              <span>₦1,250.00</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>₦12,450.00</span>
            </div>
          </div>
          <Label>Runs on the merchant’s own network</Label>
        </section>

        {/* 4 — the reconciliation ledger */}
        <section className="panel">
          <header className="panel-head">
            <Label>Reconciliation</Label>
            <Label accent>{state.matched} / 4 matched</Label>
          </header>
          <table className="ledger">
            <thead>
              <tr>
                <th scope="col">Txn</th>
                <th scope="col">Statement</th>
                <th scope="col">State</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TXN-9014</td>
                <td>STMT-402</td>
                <td className="ok">Settled</td>
              </tr>
              <tr>
                <td>TXN-9024</td>
                <td>STMT-403</td>
                <td className="ok">Settled</td>
              </tr>
              <tr>
                <td>TXN-9034</td>
                <td>STMT-404</td>
                <td className={state.matched === 4 ? 'ok' : 'pending'}>
                  {state.matched === 4 ? 'Settled' : 'Pending'}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <div className="console-foot">
        <Label>Buffers on power loss</Label>
        <Label>Replays on reconnect</Label>
        <Label>Exceptions raised, never estimated</Label>
      </div>
    </div>
  )
}
