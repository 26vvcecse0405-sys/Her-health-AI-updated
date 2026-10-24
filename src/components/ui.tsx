import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Copy, Lang } from '../types'
import { t } from '../i18n'

export function PageIntro({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <header className="mb-6 max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">{kicker}</p>
      <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 text-lg leading-8 text-muted">{lede}</p>
    </header>
  )
}

export function Suggest({ title, action, href, dismiss, onDismiss }: { title: string; action: string; href: string; dismiss: string; onDismiss: () => void }) {
  return (
    <aside className="banner prompt flex flex-wrap items-center justify-between gap-3">
      <p>{title}</p>
      <div className="flex gap-2">
        <Link className="btn primary" to={href}>{action}</Link>
        <button type="button" className="btn ghost" onClick={onDismiss}>{dismiss}</button>
      </div>
    </aside>
  )
}

export function SafetyNote({ lang }: { lang: Lang }) {
  return (
    <p className="mb-5 text-sm leading-6 text-muted">
      {t(lang, {
        en: 'Educational prototype, not a medical device. It does not diagnose, prescribe, or change a treatment plan.',
        kn: 'ಶೈಕ್ಷಣಿಕ ಮಾದರಿ, ವೈದ್ಯಕೀಯ ಸಾಧನವಲ್ಲ. ಇದು ರೋಗ ನಿರ್ಣಯ ಮಾಡುವುದಿಲ್ಲ, ಔಷಧಿ ಬರೆಯುವುದಿಲ್ಲ, ಚಿಕಿತ್ಸೆಯನ್ನು ಬದಲಾಯಿಸುವುದಿಲ್ಲ.',
      })}
    </p>
  )
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-semibold">{label}</span>
      {children}
      {hint ? <span className="text-muted">{hint}</span> : null}
      {error ? <span className="text-bad" role="alert">{error}</span> : null}
    </label>
  )
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="modal-back" onMouseDown={onClose}>
      <div className="modal glass" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <h2 className="text-2xl">{title}</h2>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  )
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="glass p-6">
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-2 leading-7 text-muted">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function Bilingual({ lang, copy }: { lang: Lang; copy: Copy }) {
  return <>{t(lang, copy)}</>
}
