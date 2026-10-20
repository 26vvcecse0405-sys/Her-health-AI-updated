import { Link } from 'react-router-dom'

export function Mark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
      <defs>
        <linearGradient id="ss-bolt" x1="6" y1="2" x2="30" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="11" fill="url(#ss-bolt)" />
      <path d="M19.2 5.5 10 20.2h6.3L15.4 30.5 26 15.2h-6.2L19.2 5.5Z" fill="#f8fbff" />
      <path d="M23.5 23.2c2.2.2 3.6 1.5 4.3 3.2" fill="none" stroke="#f8fbff" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M26.2 22.2 28.4 24.8 26.6 27" fill="none" stroke="#f8fbff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 font-semibold tracking-tight text-ink">
      <Mark />
      <span className="text-lg">SkillSprint</span>
    </Link>
  )
}
