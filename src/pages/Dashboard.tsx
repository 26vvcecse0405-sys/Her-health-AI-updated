import { useState } from 'react'
import { ArrowRight, Flame, Target } from 'lucide-react'
import { scenes } from '../data/art'
import { careerById, difficultyLabels, skillById } from '../data/catalog'
import { MinutesChart } from '../components/Charts'
import { Picture } from '../components/Picture'
import { SkillDna } from '../components/SkillDna'
import { BadgeArt, SkillRing } from '../components/Visuals'
import { Button, Card, Kicker, Meter, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'
import { severityLabel } from '../services/learning/gaps'
import { minutesByDay } from '../services/learning/derive'

const ranges = [7, 14, 30] as const

export function Dashboard() {
  const { state, view, mode } = useApp()
  const [days, setDays] = useState<(typeof ranges)[number]>(7)
  useTitle('Dashboard')
  const profile = state.profile
  const score = view.latestScore
  if (!profile || !score) return null
  const activity = minutesByDay(state, days)
  const recent = view.quizzes.slice(-3).reverse()
  const openPhases = state.roadmap?.phases.filter((phase) => phase.tasks.some((task) => !state.taskCompletedAt[task.id])) ?? []
  const earned = view.achievements.filter((item) => item.earnedAt)

  return (
    <div className="grid gap-5">
      {mode === 'demo' ? (
        <p className="rounded-2xl border border-violet/40 bg-violet/15 px-4 py-3 text-sm">
          Sample data. {profile.name} is a fictional student. Her scores, roadmap, quiz, and badges are calculated from saved answers in a separate browser record. Reset demo restores that record.
        </p>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Kicker>Dashboard</Kicker>
          <h1 className="mt-2 text-4xl font-semibold">Welcome back, {profile.name}.</h1>
          <p className="mt-2 max-w-2xl text-muted">
            You are preparing for {careerById[profile.career].label}. The numbers below come from assessments, finished tasks, quizzes, and revisions stored in this browser.
          </p>
        </div>
      </div>
      <Card className="flex flex-wrap items-center justify-between gap-4 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-blue)_28%,transparent),color-mix(in_srgb,var(--color-violet)_24%,transparent))]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">Continue learning</p>
          <h2 className="mt-1 text-2xl font-semibold">{view.nextTask ? view.nextTask.title : 'Review the plan'}</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">{view.nextTask ? `${view.nextTask.minutes} min · ${skillById[view.nextTask.skillId].label}` : 'Every current task is checked.'}</p>
        </div>
        <Button to="/roadmap">Continue Learning <ArrowRight size={16} /></Button>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center gap-2 text-sm text-muted"><Flame size={16} className="text-warn" /> Learning streak</div>
          <p className="mt-2 text-3xl font-semibold">{view.streak} day{view.streak === 1 ? '' : 's'}</p>
          <p className="mt-1 text-sm text-muted">A day counts when you assess, finish a task, take a quiz, or revise a miss.</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Roadmap progress</p>
          <p className="mt-2 text-3xl font-semibold">{view.progress}%</p>
          <Meter value={view.progress} />
          <p className="mt-2 text-sm text-muted">{view.done.length} of {view.tasks.length} tasks checked.</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Latest assessment</p>
          <p className="mt-2 text-3xl font-semibold">{score.overall}</p>
          <p className="mt-1 text-sm text-muted">Weighted score from submitted answers. Attempt {state.attempts.length}.</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Quiz accuracy</p>
          <p className="mt-2 text-3xl font-semibold">{state.quizAttempts.length ? `${view.quizAccuracy}%` : '—'}</p>
          <p className="mt-1 text-sm text-muted">{state.quizAttempts.length} attempt{state.quizAttempts.length === 1 ? '' : 's'} · {state.missed.length} still to revise.</p>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Skill DNA</h2>
            <p className="text-sm text-muted">Calculated from the latest assessment. The constellation number is the gap, not a random rating.</p>
          </div>
          <Picture src={scenes.constellation.src} alt={scenes.constellation.alt} className="h-24 w-40 rounded-2xl object-cover" />
        </div>
        <SkillDna scores={score.bySkill} gaps={view.gaps} careerLabel={careerById[profile.career].label} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Learning activity</h2>
              <p className="text-sm text-muted">Estimated minutes saved with each completed action. Not a background timer.</p>
            </div>
            <div className="flex gap-1" role="group" aria-label="Activity range">
              {ranges.map((range) => (
                <button key={range} type="button" className="chip" aria-pressed={days === range} onClick={() => setDays(range)}>{range}d</button>
              ))}
            </div>
          </div>
          <div className="mt-4"><MinutesChart data={activity} /></div>
        </Card>
        <Card className="flex flex-col items-center justify-center">
          <SkillRing score={score.overall} label="Overall assessment" />
          <Button className="mt-4" to="/results" variant="ghost">Open Skill DNA</Button>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">On target</h2>
          <p className="mt-1 text-sm text-muted">Demonstrated score is at or above the career target. Confidence ratings are not used.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {view.mastered.length === 0 ? <li className="text-sm text-muted">None yet. The targets for {careerById[profile.career].label} are still ahead.</li> : null}
            {view.mastered.map((gap) => (
              <li key={gap.skillId} className="rounded-full bg-good/15 px-3 py-1 text-sm">{skillById[gap.skillId].label} · {gap.demonstrated}</li>
            ))}
          </ul>
          <h3 className="mt-5 font-semibold">Needs attention</h3>
          <ul className="mt-3 grid gap-3">
            {view.developing.slice(0, 3).map((gap) => (
              <li key={gap.skillId}>
                <div className="flex items-center justify-between text-sm">
                  <span>{skillById[gap.skillId].label}</span>
                  <span className="text-muted">{severityLabel[gap.severity]} · gap {gap.gap}</span>
                </div>
                <Meter value={gap.demonstrated} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="flex items-start gap-3">
            <Target className="mt-1 text-cyan" size={18} />
            <div>
              <h2 className="text-xl font-semibold">Recommended next action</h2>
              {view.nextTask ? (
                <>
                  <p className="mt-2 font-medium">{view.nextTask.title}</p>
                  <p className="mt-1 text-sm text-muted">{view.nextTask.summary}</p>
                  <p className="mt-2 text-sm text-muted">{view.nextTask.minutes} min · {difficultyLabels[view.nextTask.difficulty]} · {skillById[view.nextTask.skillId].label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{view.nextTask.reason}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted">Every task in the current plan is checked. Retake the assessment or rebuild the roadmap from your profile.</p>
              )}
              <Button className="mt-4" to="/roadmap">Continue Learning</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-semibold">Upcoming milestones</h2>
          <ul className="mt-3 grid gap-3">
            {openPhases.length === 0 ? <li className="text-sm text-muted">No open milestone. The current phases are complete.</li> : null}
            {openPhases.slice(0, 3).map((phase) => {
              const done = phase.tasks.filter((task) => state.taskCompletedAt[task.id]).length
              return (
                <li key={phase.id}>
                  <p className="font-medium">{phase.milestone}</p>
                  <p className="text-sm text-muted">{done} of {phase.tasks.length} tasks in {phase.title}</p>
                </li>
              )
            })}
          </ul>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Recent quizzes</h2>
          <ul className="mt-3 grid gap-3">
            {recent.length === 0 ? <li className="text-sm text-muted">No quiz yet. The studio scores the answers you submit.</li> : null}
            {recent.map((item) => (
              <li key={item.attempt.id} className="text-sm">
                <p className="font-medium">{item.attempt.topic}</p>
                <p className="text-muted">{item.correct} of {item.total} correct · {item.percent}% · {item.attempt.source === 'openai' ? 'Live model' : 'Local bank'}</p>
              </li>
            ))}
          </ul>
          <Button className="mt-4" to="/studio" variant="ghost">Open learning studio</Button>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Achievements</h2>
          <p className="mt-1 text-sm text-muted">{view.points} points from recorded work.</p>
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {view.achievements.map((item) => (
              <li key={item.id} className={item.earnedAt ? '' : 'opacity-40'} title={item.title}>
                <BadgeArt id={item.id} />
                <p className="text-center text-xs">{item.earnedAt ? item.title : 'Locked'}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted">{earned.length} of {view.achievements.length} earned.</p>
          <Button className="mt-3" to="/achievements" variant="ghost">Open gallery</Button>
        </Card>
      </div>
    </div>
  )
}
