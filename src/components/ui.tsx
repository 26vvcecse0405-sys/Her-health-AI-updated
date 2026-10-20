import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · SkillSprint`
  }, [title])
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  to?: string
  variant?: 'primary' | 'ghost' | 'quiet'
}

export function Button({ to, variant = 'primary', className, children, type = 'button', ...rest }: ButtonProps) {
  const names = cx('btn', variant, className)
  if (to) return <Link to={to} className={names}>{children}</Link>
  return (
    <button type={type} className={names} {...rest}>
      {children}
    </button>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx('glass p-5 md:p-6', className)}>{children}</section>
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">{children}</p>
}

export function Meter({ value }: { value: number }) {
  return (
    <div className="meter" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      {children}
      {hint ? <span className="font-normal text-muted">{hint}</span> : null}
    </label>
  )
}
