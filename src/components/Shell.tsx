import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Activity, Award, Briefcase, Dna, LayoutDashboard, Map, Menu, MessageCircle, Moon, RotateCcw, Sparkles, Sun, UserRound, X } from 'lucide-react'
import { Logo } from './Logo'
import { Button, cx } from './ui'
import { useApp } from '../context/AppContext'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/results', label: 'Skill DNA', icon: Dna },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/studio', label: 'Studio', icon: Sparkles },
  { to: '/careers', label: 'Careers', icon: Briefcase },
  { to: '/analytics', label: 'Analytics', icon: Activity },
  { to: '/achievements', label: 'Achievements', icon: Award },
  { to: '/assistant', label: 'Coach', icon: MessageCircle },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

export function Shell() {
  const { mode, theme, setTheme, aiOn, resetDemo, beginStudent, student } = useApp()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const reduce = useReducedMotion()
  const home = student.profile ? (student.attempts.length ? '/dashboard' : '/assessment') : '/onboarding'

  const nav = (
    <nav className="grid gap-1" aria-label="Learning">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => cx('nav-link', isActive && 'active')} onClick={() => setOpen(false)}>
            <Icon size={16} aria-hidden="true" />
            {link.label}
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <div className="mx-auto grid min-h-screen max-w-[1440px] md:grid-cols-[250px_1fr]">
      <aside className="hidden border-r border-line px-4 py-5 md:block">
        <Logo />
        <p className="mt-3 px-2 text-xs leading-5 text-muted">Discover your potential. Engineer your future.</p>
        <div className="mt-6">{nav}</div>
      </aside>
      <div>
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[color-mix(in_srgb,var(--color-canvas)_84%,transparent)] px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2 md:hidden">
            <button type="button" className="btn ghost px-3" aria-expanded={open} aria-label="Open menu" onClick={() => setOpen((value) => !value)}>
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
            <Logo />
          </div>
          <p className="text-sm text-muted">{aiOn ? 'Live model connected on this server.' : 'Demo tutor. No API key is configured.'}</p>
          <div className="flex flex-wrap items-center gap-2">
            {mode === 'demo' ? (
              <>
                <Button variant="ghost" onClick={() => { resetDemo(); navigate('/dashboard') }}><RotateCcw size={15} /> Reset demo</Button>
                <Button variant="quiet" onClick={() => { beginStudent(); navigate(home) }}>Exit demo</Button>
              </>
            ) : null}
            <button type="button" className="btn ghost px-3" aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>
        {open ? <div className="border-b border-line px-4 py-3 md:hidden">{nav}</div> : null}
        <motion.main
          key={location.pathname}
          className="px-4 py-6 md:px-8"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}
