import { useState } from 'react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import { skillById } from '../data/catalog'
import { severityLabel } from '../services/learning/gaps'
import { skillIds, type GapInsight, type SkillId, type SkillScore } from '../types'
import { useApp } from '../context/AppContext'

const spots: { id: SkillId; x: number; y: number }[] = [
  { id: 'programming', x: 210, y: 70 },
  { id: 'reasoning', x: 360, y: 110 },
  { id: 'data', x: 300, y: 210 },
  { id: 'communication', x: 90, y: 150 },
  { id: 'problemSolving', x: 430, y: 220 },
  { id: 'creativity', x: 150, y: 250 },
]

const links: [SkillId, SkillId][] = [
  ['programming', 'reasoning'],
  ['programming', 'data'],
  ['reasoning', 'problemSolving'],
  ['data', 'communication'],
  ['data', 'creativity'],
  ['communication', 'creativity'],
  ['problemSolving', 'data'],
]

export function SkillDna({
  scores,
  gaps,
  careerLabel,
}: {
  scores: SkillScore[]
  gaps: GapInsight[]
  careerLabel: string
}) {
  const { theme } = useApp()
  const [selected, setSelected] = useState<SkillId>(gaps.find((gap) => gap.gap > 0)?.skillId ?? 'programming')
  const gapFor = (id: SkillId) => gaps.find((gap) => gap.skillId === id)
  const scoreFor = (id: SkillId) => scores.find((item) => item.skillId === id)?.score ?? 0
  const short: Record<SkillId, string> = {
    programming: 'Code',
    reasoning: 'Logic',
    data: 'Data',
    communication: 'Voice',
    problemSolving: 'Solve',
    creativity: 'Create',
  }
  const chart = skillIds.map((id) => ({
    skill: short[id],
    you: scoreFor(id),
    target: gapFor(id)?.target ?? 0,
  }))
  const active = gapFor(selected)
  const tip = theme === 'light'
    ? { background: '#ffffff', border: '1px solid #d5deee', borderRadius: 12, color: '#0f172a' }
    : { background: '#12182c', border: '1px solid #2a3658', borderRadius: 12, color: '#e8eefc' }
  const point = Object.fromEntries(spots.map((spot) => [spot.id, spot])) as Record<SkillId, { x: number; y: number }>

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chart} cx="50%" cy="50%" outerRadius="68%">
              <PolarGrid stroke="currentColor" strokeOpacity={0.2} />
              <PolarAngleAxis dataKey="skill" tick={{ fill: 'currentColor', fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip contentStyle={tip} />
              <Radar name="Demonstrated" dataKey="you" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.35} />
              <Radar name="Career target" dataKey="target" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.12} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted">Cyan is the demonstrated score. Violet is the configurable target for {careerLabel}. Neither line is an employment forecast.</p>
      </div>
      <div>
        <svg viewBox="0 0 500 320" className="w-full" role="img" aria-label="Skill constellation. Choose a node to read the score and the gap.">
          {links.map(([from, to]) => (
            <line key={`${from}-${to}`} x1={point[from].x} y1={point[from].y} x2={point[to].x} y2={point[to].y} stroke="currentColor" strokeOpacity="0.28" />
          ))}
          {spots.map((spot) => {
            const gap = gapFor(spot.id)
            const radius = 18 + scoreFor(spot.id) / 8
            return (
              <g key={spot.id}>
                <circle cx={spot.x} cy={spot.y} r={radius} fill={skillById[spot.id].color} opacity={selected === spot.id ? 1 : 0.78} />
                <text x={spot.x} y={spot.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#041018">{gap ? gap.gap : 0}</text>
              </g>
            )
          })}
        </svg>
        <div className="flex flex-wrap gap-2">
          {skillIds.map((id) => (
            <button key={id} type="button" className="chip" aria-pressed={selected === id} onClick={() => setSelected(id)}>
              {skillById[id].label}
            </button>
          ))}
        </div>
        {active ? (
          <div className="mt-4">
            <p className="font-semibold">{skillById[active.skillId].label}</p>
            <p className="mt-1 text-sm text-muted">{skillById[active.skillId].summary} {severityLabel[active.severity]}.</p>
            <p className="mt-2 text-sm leading-6 text-muted">{active.why}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
