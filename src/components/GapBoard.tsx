import { skillById } from '../data/catalog'
import { severityLabel } from '../services/learning/gaps'
import type { GapInsight, RoadmapTask } from '../types'
import { Meter } from './ui'

const tone = {
  none: 'text-good',
  small: 'text-cyan',
  moderate: 'text-warn',
  large: 'text-bad',
} as const

export function GapBoard({ gaps, tasks = [] }: { gaps: GapInsight[]; tasks?: RoadmapTask[] }) {
  const open = gaps.filter((gap) => gap.gap > 0)
  if (open.length === 0) {
    return <p className="text-sm text-muted">Every assessed skill is at or above the configured target. The roadmap keeps a stretch task so there is still a next step.</p>
  }
  return (
    <ol className="grid gap-4">
      {open.map((gap, index) => {
        const related = tasks.filter((task) => task.skillId === gap.skillId).slice(0, 2)
        return (
          <li key={gap.skillId} className="rounded-2xl border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">{index + 1}. {skillById[gap.skillId].label}</h3>
              <span className={`text-sm font-semibold ${tone[gap.severity]}`}>{severityLabel[gap.severity]} · priority {gap.priority}</span>
            </div>
            <div className="relative mt-3">
              <Meter value={gap.demonstrated} />
              <span className="target-tick" style={{ left: `${gap.target}%` }} />
            </div>
            <p className="mt-2 flex justify-between text-xs text-muted">
              <span>Demonstrated {gap.demonstrated}</span>
              <span>Target {gap.target}</span>
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">{gap.why}</p>
            {related.length > 0 ? (
              <ul className="mt-3 grid gap-2">
                {related.map((task) => (
                  <li key={task.id} className="text-sm text-muted">Recommended task: {task.title} · {task.minutes} min</li>
                ))}
              </ul>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
