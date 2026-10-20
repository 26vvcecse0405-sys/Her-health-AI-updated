import { Check } from 'lucide-react'
import { Button, Card, Kicker, Meter, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'
import { scenes } from '../data/art'
import { difficultyLabels, skillById } from '../data/catalog'

export function Roadmap() {
  const { state, view, toggleRoadmapTask, regenerateRoadmap } = useApp()
  useTitle('Roadmap')
  const roadmap = state.roadmap
  if (!roadmap || !state.profile) return null

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Kicker>Personalized roadmap</Kicker>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your sprint path</h1>
          <p className="mt-2 max-w-3xl text-muted">{roadmap.narrative}</p>
        </div>
        <div className="grid w-full max-w-sm gap-3">
          <img src={scenes.roadmap.src} alt={scenes.roadmap.alt} className="aspect-[16/9] w-full rounded-3xl border border-line object-cover" />
          <div className="flex flex-wrap gap-2">
            <Button to="/profile" variant="ghost">Adjust goals</Button>
            <Button onClick={regenerateRoadmap}>Regenerate plan</Button>
          </div>
        </div>
      </div>
      <Card>
        <p className="text-sm leading-6 text-muted">{roadmap.methodNote}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="text-sm text-muted">{view.done.length} of {view.tasks.length} tasks done · budget {roadmap.budgetMinutes} minutes</p>
          <div className="min-w-40 flex-1"><Meter value={view.progress} /></div>
        </div>
      </Card>
      <ol className="timeline">
        {roadmap.phases.map((phase) => {
          const done = phase.tasks.filter((task) => state.taskCompletedAt[task.id]).length
          const complete = phase.tasks.length > 0 && done === phase.tasks.length
          return (
            <li key={phase.id} className="relative pl-12">
              <span className={`absolute left-2 top-5 grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${complete ? 'bg-good text-canvas' : 'bg-blue text-white'}`} aria-hidden="true">
                {complete ? <Check size={14} /> : done}
              </span>
              <Card>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan">{complete ? 'Completed' : done > 0 ? 'In progress' : 'Upcoming'}</p>
                <h2 className="mt-1 text-2xl font-semibold">{phase.title}</h2>
                <p className="mt-1 text-sm text-muted">{phase.summary}</p>
                <p className="mt-2 text-sm font-medium">Milestone: {phase.milestone}</p>
                <ul className="mt-4 grid gap-3">
                  {phase.tasks.map((task) => {
                    const checked = Boolean(state.taskCompletedAt[task.id])
                    const current = view.nextTask?.id === task.id
                    return (
                      <li key={task.id} className={`rounded-2xl border p-4 ${checked ? 'border-good/40 bg-good/10' : current ? 'border-cyan/50' : 'border-line'}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.14em] text-muted">
                              {checked ? 'Completed' : current ? 'Current' : 'Upcoming'} · {skillById[task.skillId].label}
                            </p>
                            <h3 className="mt-1 text-lg font-semibold">{task.title}</h3>
                          </div>
                          <button
                            type="button"
                            className="chip"
                            aria-pressed={checked}
                            onClick={() => toggleRoadmapTask(task.id)}
                          >
                            {checked ? 'Mark open' : 'Mark complete'}
                          </button>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted">{task.summary}</p>
                        <p className="mt-2 text-sm text-muted">
                          {task.minutes} min · {difficultyLabels[task.difficulty]}
                          {task.prerequisite ? ` · Prerequisite: ${task.prerequisite}` : ''}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted">{task.reason}</p>
                        <a className="mt-2 inline-flex text-sm font-medium text-cyan underline-offset-4 hover:underline" href={task.href} target="_blank" rel="noreferrer">
                          {task.resource}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
