'use client'



import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { NAV, type NavItem } from '@/lib/nav'
import { COMPANY } from '@/lib/site'
import { PRACTICES } from '@/data/practices'
import { ROUTES } from '@/lib/routes'
import { Dot, Glyph, Label } from '@/components/ui'
import { Mark } from '@/components/Mark'

const Chevron = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="m4 6 4 4 4-4" />
  </svg>
)


function activeKey(pathname: string): string | null {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p === '/') return 'home'
  if (p.startsWith('/services')) return 'services'
  if (p.startsWith('/work')) return 'work'
  if (p.startsWith('/platforms')) return 'platforms'
  if (p.startsWith('/institute') || p.startsWith('/gallery')) return 'institute'
  return 'company'
}

export function Nav() {
  const pathname = usePathname() ?? '/'
  const active = activeKey(pathname)

  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const hoverTimer = useRef<number | null>(null)

  
  const clearHoverTimer = () => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
  }

  const onItemEnter = useCallback((key: string, pointerType: string) => {
    if (pointerType === 'touch') return
    clearHoverTimer()
    setOpenMenu(key)
  }, [])

  
  const onItemLeave = useCallback((pointerType: string) => {
    if (pointerType === 'touch') return
    clearHoverTimer()
    hoverTimer.current = window.setTimeout(() => setOpenMenu(null), 160)
  }, [])

  useEffect(() => clearHoverTimer, [])

  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  
  useEffect(() => {
    setOpenMenu(null)
    setDrawer(false)
  }, [pathname])

  
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (drawer) setDrawer(false)
      else if (openMenu) setOpenMenu(null)
    }
    const onDown = (e: MouseEvent) => {
      if (!openMenu) return
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [openMenu, drawer])

  
  useEffect(() => {
    if (!drawer) return
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPadding = document.body.style.paddingRight
    document.body.style.paddingRight = `${scrollbar}px`
    document.body.style.overflow = 'hidden'
    drawerRef.current?.querySelector<HTMLElement>('a,button')?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
    }
  }, [drawer])

  
  const onMenuKey = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const links = Array.from(
      e.currentTarget.querySelectorAll<HTMLAnchorElement>('.mega-link, .mega-foot a'),
    )
    if (links.length === 0) return
    e.preventDefault()
    const here = links.indexOf(document.activeElement as HTMLAnchorElement)
    const next =
      e.key === 'ArrowDown'
        ? (here + 1 + links.length) % links.length
        : (here - 1 + links.length) % links.length
    links[next]?.focus()
  }, [])

  return (
    <>
      <div className="railwrap" data-scrolled={scrolled ? 'true' : 'false'}>
        <div className="rail">
          <Link className="brand" href="/" aria-label={`${COMPANY.name} — home`}>
            <Mark />
            <span className="brand-text">
              <b>{COMPANY.name}</b>
              <em>{COMPANY.tagline}</em>
            </span>
          </Link>

          <nav className="nav" aria-label="Primary" ref={navRef}>
            {NAV.map((item) => (
              <NavEntry
                key={item.key}
                item={item}
                active={active === item.key}
                open={openMenu === item.key}
                onToggle={() => setOpenMenu(openMenu === item.key ? null : item.key)}
                onKeyDown={onMenuKey}
                onEnter={(t) => onItemEnter(item.key, t)}
                onLeave={onItemLeave}
              />
            ))}
          </nav>

          
          <div className="rail-read">
            <Label>
              <Dot />
              {PRACTICES.length} practices · 5 sectors
            </Label>
          </div>

          <div className="rail-acts">
            <ThemeButton />
            <button
              type="button"
              className="icon-btn burger"
              aria-expanded={drawer}
              aria-controls="drawer"
              aria-label={drawer ? 'Close menu' : 'Open menu'}
              onClick={() => setDrawer((d) => !d)}
            >
              {drawer ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      
      <div className="drawer" id="drawer" data-open={drawer ? 'true' : 'false'} ref={drawerRef} aria-hidden={!drawer} onClick={(e) => { if (e.target === e.currentTarget) setDrawer(false) }}>
        <div className="drawer-bar">
          <Link className="brand" href="/">
            <Mark />
            <span className="brand-text">
              <b>{COMPANY.name}</b>
            </span>
          </Link>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close menu"
            onClick={() => setDrawer(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          {NAV.map((item) =>
            item.type === 'link' ? (
              <div className="drawer-group" key={item.key}>
                <div className="drawer-links">
                  <Link
                    className="drawer-link"
                    href={item.href}
                    aria-current={active === item.key ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="drawer-group" key={item.key}>
                <Label>{item.note}</Label>
                <div className="drawer-links">
                  {item.children.map((c) => (
                    <Link className="drawer-link" href={c.href} key={c.key}>
                      <Glyph cells={c.glyph} size="sm" />
                      {c.title}
                    </Link>
                  ))}
                  <Link className="drawer-link" href={item.footer.href}>
                    {item.footer.text}
                  </Link>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="drawer-foot">
          <Link className="btn btn--solid btn--block" href={ROUTES.contact}>
            Start a project
          </Link>
          <a className="label" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
        </div>
      </div>
    </>
  )
}

function NavEntry({
  item,
  active,
  open,
  onToggle,
  onKeyDown,
  onEnter,
  onLeave,
}: {
  item: NavItem
  active: boolean
  open: boolean
  onToggle: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onEnter: (pointerType: string) => void
  onLeave: (pointerType: string) => void
}) {
  if (item.type === 'link') {
    return (
      <div className="nav-item">
        <Link
          className="nav-link"
          href={item.href}
          aria-current={active ? 'page' : undefined}
        >
          {item.label}
        </Link>
      </div>
    )
  }

  return (
    <div
      className="nav-item"
      data-menu
      onPointerEnter={(e) => onEnter(e.pointerType)}
      onPointerLeave={(e) => onLeave(e.pointerType)}
    >
      <button
        type="button"
        className="nav-link nav-link--js"
        aria-expanded={open}
        aria-current={active ? 'page' : undefined}
        onClick={onToggle}
      >
        {item.label}
        <Chevron />
      </button>
      
      <Link className="nav-link nav-link--nojs" href={item.href}>
        {item.label}
      </Link>

      <div
        className={item.align === 'right' ? 'mega mega--right' : 'mega'}
        data-open={open ? 'true' : 'false'}
        onKeyDown={onKeyDown}
      >
        <div className="mega-grid">
          {item.children.map((c) => (
            <Link className="mega-link" href={c.href} key={c.key} tabIndex={open ? 0 : -1}>
              <Glyph cells={c.glyph} size="sm" />
              <span>
                <b>{c.title}</b>
                <span>{c.note}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="mega-foot">
          <Label>{item.note}</Label>
          <Link className="arrow" href={item.footer.href} tabIndex={open ? 0 : -1}>
            {item.footer.text}
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path d="M3 8h9M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}


function ThemeButton() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem('nd-theme')
    if (stored === 'light' || stored === 'dark') setTheme(stored)
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const current =
      root.dataset.theme ??
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    const next = current === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next
    try {
      window.localStorage.setItem('nd-theme', next)
    } catch {
      
    }
    setTheme(next)
  }

  return (
    <button
      type="button"
      className="icon-btn theme-btn"
      onClick={toggle}
      aria-label={theme === 'light' ? 'Use the dark theme' : 'Use the light theme'}
    >
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
        <circle cx={12} cy={12} r={4} />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  )
}
