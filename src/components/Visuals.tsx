import type { ReactNode } from 'react'
import { badgeArt, scenes } from '../data/art'
import type { GapInsight, SkillId } from '../types'
import { skillById } from '../data/catalog'

export function SkillRing({ score, label, color = '#22d3ee', size = 132 }: { score: number; label: string; color?: string; size?: number }) {
  const radius = 46
  const length = 2 * Math.PI * radius
  const offset = length - (Math.max(0, Math.min(100, score)) / 100) * length
  return (
    <figure className="grid justify-items-center gap-2" aria-label={`${label}: ${score} out of 100`}>
      <svg width={size} height={size} viewBox="0 0 120 120" role="img">
        <defs>
          <linearGradient id="ring-glow" x1="20" y1="20" x2="100" y2="100">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="52" fill="none" stroke="url(#ring-glow)" strokeOpacity="0.25" strokeWidth="10" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="64" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="700">
          {score}
        </text>
      </svg>
      <figcaption className="text-sm text-muted">{label}</figcaption>
    </figure>
  )
}

function Stage({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 360 220" className="h-full w-full" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#10182e" />
          <stop offset="1" stopColor="#1c1442" />
        </linearGradient>
        <linearGradient id={`${id}-bolt`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="360" height="220" rx="28" fill={`url(#${id}-sky)`} />
      <circle cx="312" cy="28" r="54" fill="#22d3ee" opacity="0.14" />
      <circle cx="28" cy="190" r="42" fill="#8b5cf6" opacity="0.16" />
      {children}
    </svg>
  )
}

export type SceneKind = 'code' | 'ai' | 'data' | 'design' | 'business' | 'career' | 'security' | 'assess' | 'cards' | 'badge' | 'path'

export function WorldArt({ kind }: { kind: SceneKind }) {
  if (kind === 'code') {
    return (
      <Stage id="code" label="Illustration of a laptop with a short function and a rising learning path.">
        <ellipse cx="180" cy="186" rx="120" ry="16" fill="#0b1020" opacity="0.7" />
        <rect x="78" y="58" width="168" height="108" rx="12" fill="#0c1326" stroke="#33456e" />
        <rect x="88" y="68" width="148" height="78" rx="6" fill="#070b16" />
        <text x="98" y="90" fill="#22d3ee" fontSize="11" fontFamily="ui-monospace, monospace">def sprint(score):</text>
        <text x="108" y="108" fill="#c4b5fd" fontSize="11" fontFamily="ui-monospace, monospace">gap = target - score</text>
        <text x="108" y="126" fill="#e8eefc" fontSize="11" fontFamily="ui-monospace, monospace">return next_task</text>
        <path d="M70 168h190l-16 16H86l-16-16Z" fill="#243356" />
        <path d="M250 150c18-26 28-22 42-46" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
        <circle cx="294" cy="100" r="7" fill="#34d399" />
      </Stage>
    )
  }
  if (kind === 'ai') {
    return (
      <Stage id="ai" label="Illustration of a neural network with a bright center node.">
        <circle cx="180" cy="110" r="28" fill="url(#ai-bolt)" />
        <path d="M188 96 172 114h10l-4 16 18-20h-10l2-14Z" fill="#f8fbff" />
        {[
          [70, 60],
          [70, 160],
          [290, 54],
          [296, 160],
          [180, 36],
          [180, 188],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <line x1="180" y1="110" x2={x} y2={y} stroke="#22d3ee" strokeOpacity="0.55" />
            <circle cx={x} cy={y} r="10" fill="#8b5cf6" />
          </g>
        ))}
      </Stage>
    )
  }
  if (kind === 'data') {
    return (
      <Stage id="data" label="Illustration of a bar chart with a trend line and one highlighted point.">
        <line x1="58" y1="170" x2="310" y2="170" stroke="#8ea0c8" />
        <line x1="58" y1="40" x2="58" y2="170" stroke="#8ea0c8" />
        <rect x="84" y="120" width="28" height="50" rx="6" fill="#3b82f6" />
        <rect x="128" y="96" width="28" height="74" rx="6" fill="#22d3ee" />
        <rect x="172" y="78" width="28" height="92" rx="6" fill="#8b5cf6" />
        <rect x="216" y="108" width="28" height="62" rx="6" fill="#3b82f6" />
        <rect x="260" y="64" width="28" height="106" rx="6" fill="#22d3ee" />
        <path d="M90 128c40-30 70-8 110-36 28 10 48-6 78-28" fill="none" stroke="#f8fbff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="278" cy="62" r="6" fill="#fbbf24" />
      </Stage>
    )
  }
  if (kind === 'design') {
    return (
      <Stage id="design" label="Illustration of overlapping interface frames and a cursor.">
        <rect x="48" y="40" width="150" height="140" rx="18" fill="#12182c" stroke="#3b82f6" />
        <rect x="70" y="58" width="90" height="12" rx="6" fill="#22d3ee" />
        <rect x="70" y="82" width="110" height="8" rx="4" fill="#8ea0c8" />
        <rect x="70" y="100" width="70" height="48" rx="10" fill="#1c1442" />
        <rect x="150" y="70" width="160" height="110" rx="18" fill="#182242" stroke="#8b5cf6" />
        <circle cx="176" cy="98" r="10" fill="#22d3ee" />
        <rect x="196" y="90" width="80" height="8" rx="4" fill="#e8eefc" />
        <rect x="196" y="108" width="90" height="8" rx="4" fill="#8ea0c8" />
        <path d="M250 140l16 28 6-14 16 4-38-18Z" fill="#f8fbff" />
      </Stage>
    )
  }
  if (kind === 'business') {
    return (
      <Stage id="biz" label="Illustration of ascending steps leading to a small flag.">
        <rect x="56" y="150" width="52" height="30" rx="6" fill="#1d4ed8" />
        <rect x="116" y="122" width="52" height="58" rx="6" fill="#3b82f6" />
        <rect x="176" y="94" width="52" height="86" rx="6" fill="#22d3ee" />
        <rect x="236" y="66" width="52" height="114" rx="6" fill="#8b5cf6" />
        <path d="M262 66v-28" stroke="#f8fbff" strokeWidth="3" />
        <path d="M262 38h28l-8 8 8 8h-28" fill="#22d3ee" />
      </Stage>
    )
  }
  if (kind === 'security') {
    return (
      <Stage id="sec" label="Illustration of a shield with a lock, for careful digital work.">
        <path d="M180 36 250 62v48c0 42-30 68-70 82-40-14-70-40-70-82V62L180 36Z" fill="#12182c" stroke="#22d3ee" strokeWidth="4" />
        <rect x="158" y="96" width="44" height="36" rx="8" fill="#8b5cf6" />
        <path d="M168 96v-10a12 12 0 0 1 24 0v10" fill="none" stroke="#f8fbff" strokeWidth="4" />
        <circle cx="180" cy="112" r="4" fill="#f8fbff" />
      </Stage>
    )
  }
  if (kind === 'assess') {
    return (
      <Stage id="assess" label="Illustration of a scored question with one selected answer.">
        <rect x="54" y="36" width="252" height="148" rx="20" fill="#0c1326" stroke="#33456e" />
        <rect x="74" y="54" width="150" height="12" rx="6" fill="#22d3ee" />
        {['A', 'B', 'C'].map((letter, index) => (
          <g key={letter}>
            <rect x="74" y={80 + index * 30} width="210" height="24" rx="12" fill={index === 1 ? '#3b82f6' : '#182242'} />
            <text x="90" y={97 + index * 30} fill="#f8fbff" fontSize="12" fontWeight="700">{letter}</text>
          </g>
        ))}
      </Stage>
    )
  }
  if (kind === 'cards') {
    return (
      <Stage id="cards" label="Illustration of two flashcards, one showing the question and one the answer.">
        <rect x="58" y="48" width="140" height="130" rx="18" fill="#182242" transform="rotate(-8 128 113)" />
        <rect x="150" y="40" width="150" height="136" rx="18" fill="#0c1326" stroke="#22d3ee" />
        <text x="170" y="78" fill="#22d3ee" fontSize="12" fontWeight="700">Question</text>
        <rect x="170" y="92" width="110" height="8" rx="4" fill="#8ea0c8" />
        <rect x="170" y="110" width="80" height="8" rx="4" fill="#8b5cf6" />
        <text x="170" y="148" fill="#e8eefc" fontSize="13">Flip for the answer</text>
      </Stage>
    )
  }
  if (kind === 'badge') {
    return (
      <Stage id="badge" label="Illustration of an achievement medal with a ribbon.">
        <path d="M150 70h20l14 70H136L150 70Z" fill="#3b82f6" />
        <path d="M190 70h20l14 70H204L190 70Z" fill="#8b5cf6" />
        <circle cx="180" cy="92" r="48" fill="url(#badge-bolt)" />
        <path d="M180 68 188 90h22l-18 12 8 22-20-14-20 14 8-22-18-12h22L180 68Z" fill="#f8fbff" />
      </Stage>
    )
  }
  if (kind === 'path') {
    return (
      <Stage id="path" label="Illustration of a connected learning path with three milestones.">
        <path d="M48 160C110 160 110 70 180 70s70 90 132 70" fill="none" stroke="url(#path-bolt)" strokeWidth="8" strokeLinecap="round" />
        <circle cx="48" cy="160" r="12" fill="#22d3ee" />
        <circle cx="180" cy="70" r="12" fill="#3b82f6" />
        <circle cx="312" cy="140" r="14" fill="#8b5cf6" />
        <text x="36" y="188" fill="#e8eefc" fontSize="12">Now</text>
        <text x="158" y="52" fill="#e8eefc" fontSize="12">Gap</text>
        <text x="286" y="172" fill="#e8eefc" fontSize="12">Role</text>
      </Stage>
    )
  }
  return (
    <Stage id="career" label="Illustration of a career path climbing toward a lightning mark.">
      <path d="M40 176c40-10 50-48 90-48s40 36 80 20 50-70 110-78" fill="none" stroke="url(#career-bolt)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="40" cy="176" r="8" fill="#22d3ee" />
      <circle cx="130" cy="128" r="8" fill="#3b82f6" />
      <circle cx="210" cy="148" r="8" fill="#8b5cf6" />
      <circle cx="312" cy="70" r="22" fill="url(#career-bolt)" />
      <path d="M316 58 308 72h6l-2 10 10-14h-6l0-10Z" fill="#f8fbff" />
    </Stage>
  )
}

export function HeroArt() {
  return (
    <div className="relative">
      <img src={scenes.hero.src} alt={scenes.hero.alt} className="w-full rounded-[28px] border border-line" />
      <article className="float-card glass absolute left-0 top-6 w-40 p-3 text-left">
        <p className="text-[10px] uppercase tracking-[0.14em] text-cyan">Example</p>
        <p className="mt-1 text-sm font-semibold">Programming</p>
        <p className="text-2xl font-semibold text-cyan">72%</p>
      </article>
      <article className="float-card delay glass absolute right-0 top-16 w-36 p-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-cyan">Example</p>
        <p className="mt-1 text-sm font-semibold">5-day streak</p>
        <p className="text-xs text-muted">Study logged each day</p>
      </article>
      <article className="float-card glass absolute bottom-2 left-8 w-52 p-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-cyan">Example</p>
        <p className="mt-1 text-sm font-semibold">Next milestone</p>
        <p className="text-xs text-muted">Close the data-analysis gap</p>
      </article>
    </div>
  )
}

const nodes: { id: SkillId; x: number; y: number }[] = [
  { id: 'creativity', x: 70, y: 150 },
  { id: 'reasoning', x: 70, y: 40 },
  { id: 'programming', x: 230, y: 120 },
  { id: 'data', x: 230, y: 200 },
  { id: 'problemSolving', x: 390, y: 70 },
  { id: 'communication', x: 390, y: 180 },
]

export function SkillTree({ gaps }: { gaps: GapInsight[] }) {
  const gapFor = (id: string) => gaps.find((gap) => gap.skillId === id)
  return (
    <svg viewBox="0 0 470 250" className="w-full" role="img" aria-label="Skill tree. Node color shows the size of the career gap.">
      <line x1="70" y1="150" x2="230" y2="120" stroke="currentColor" strokeOpacity="0.35" />
      <line x1="70" y1="150" x2="230" y2="200" stroke="currentColor" strokeOpacity="0.35" />
      <line x1="70" y1="40" x2="390" y2="70" stroke="currentColor" strokeOpacity="0.35" />
      <line x1="230" y1="120" x2="390" y2="180" stroke="currentColor" strokeOpacity="0.25" />
      {nodes.map((node) => {
        const gap = gapFor(node.id)
        const skill = skillById[node.id]
        const fill = !gap || gap.gap === 0 ? '#34d399' : gap.severity === 'large' ? '#fb7185' : gap.severity === 'moderate' ? '#fbbf24' : '#22d3ee'
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="28" fill={fill} opacity="0.9" />
            <text x={node.x} y={node.y + 46} textAnchor="middle" fill="currentColor" fontSize="11">
              {skill.label.split(' ')[0]}
            </text>
            <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#041018" fontSize="12" fontWeight="700">
              {gap ? gap.gap : '–'}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const stepScene: Record<string, SceneKind> = {
  Discover: 'assess',
  Analyze: 'data',
  Personalize: 'path',
  Improve: 'career',
}

export function StepArt({ name }: { name: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl">
      <WorldArt kind={stepScene[name] ?? 'path'} />
    </div>
  )
}

export function BadgeArt({ id }: { id: string }) {
  const art = badgeArt[id] ?? badgeArt['first-steps']
  return <img src={art.src} alt={art.alt} className="mx-auto h-16 w-16 rounded-2xl object-cover" />
}
