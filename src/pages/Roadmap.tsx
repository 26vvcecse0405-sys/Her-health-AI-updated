import { scenes } from '../data/art'
import { careerById, difficultyLabels, skillById } from '../data/catalog'
import { EmptyState } from '../components/EmptyState'
import { Picture } from '../components/Picture'
import { Button, Card, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'
import { prerequisiteMet } from '../services/learning/roadmap'

export function Roadmap() {
  const { state, view, toggleRoadmapTask, regenerateRoadmap } = useApp()
  useTitle('Roadmap')
  const roadmap = state.roadmap
  const profile = state.profile
  if (!roadmap || !profile) {
    return <EmptyState kind="empty" title="No roadmap yet" text="Submit the assessment and SkillSprint will build a plan from the gaps." />
  }
  const planned = view.tasks.reduce((sum, task) => sum + task.minutes, 0)
  const doneIds = new Set(view.done.map((task) => task.id))

  return (
    <div className="grid gap-5">
      <div className="grid items-center gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">Roadmap · {careerById[profile.career].label}</p>
          <h1 className="mt-2 text-4xl font-semibold">A path built from the gaps.</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted">{roadmap.narrative}</p>
        </div>
        <Picture src={scenes.roadmap.src} alt={scenes.roadmap.alt} className="w-full rounded-[1.5rem]" />
      </div>
      <Card>
        <p className="text-sm leading-6 text-muted">{roadmap.methodNote}</p>
        <p className="mt-2 text-sm text-muted">{planned} minutes scheduled · {roadmap.budgetMinutes} minutes budgeted · {view.progress}% complete</p>
        <Button className="mt-4" variant="ghost" onClick={() => regenerateRoadmap()}>Rebuild from latest scores</Button>
      </Card>
      {view.tasks.length === 0 ? <EmptyState kind="empty" title="Nothing to schedule" text="Change the career target or retake the assessment to generate tasks." /> : null}
      <ol className="timeline">
        {roadmap.phases.map((phase) => {
          const phaseDone = phase.tasks.every((task) => doneIds.has(task.id))
          const current = phase.tasks.some((task) => task.id === view.nextTask?.id)
          return (
            <li key={phase.id} className="relative pl-12">
              <span className={`absolute left-2 top-2 h-4 w-4 rounded-full ${phaseDone ? 'bg-good' : current ? 'bg-cyan' : 'bg-line'}`} />
              <Card>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan">{phaseDone ? 'Completed' : current ? 'Current' : 'Upcoming'}</p>
                <h2 className="mt-1 text-2xl font-semibold">{phase.title}</h2>
                <p className="mt-1 text-sm text-muted">{phase.summary}</p>
                <p className="mt-2 text-sm font-medium">Milestone: {phase.milestone}</p>
                <ul className="mt-4 grid gap-3">
                  {phase.tasks.map((task) => {
                    const complete = Boolean(state.taskCompletedAt[task.id])
                    const open = prerequisiteMet(task, view.tasks, state.taskCompletedAt)
                    return (
                      <li key={task.id} className="rounded-2xl border border-line p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="mt-1 text-sm text-muted">{skillById[task.skillId].label} · {difficultyLabels[task.difficulty]} · {task.minutes} min</p>
                          </div>
                          <Button
                            variant={complete ? 'ghost' : 'primary'}
                            disabled={!complete && !open}
                            onClick={() => toggleRoadmapTask(task.id)}
                          >
                            {complete ? 'Mark not done' : open ? 'Mark complete' : 'Locked'}
                          </Button>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted">{task.summary}</p>
                        {!open && !complete ? <p className="mt-2 text-sm text-warn">Finish the previous task in this skill before starting this one.</p> : null}
                        <p className="mt-2 text-sm leading-6 text-muted">{task.reason}</p>
                        <a className="mt-3 inline-flex text-sm font-semibold text-cyan" href={task.href} target="_blank" rel="noreferrer">{task.resource}</a>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            </li>
          )
        })}
      </ol>
      {view.progress === 100 ? <EmptyState kind="success" title="This plan is complete" text="Retake the assessment or change the career target if you want a new set of gaps." /> : null}
    </div>
  )
}
