import { useState } from 'react'
import { scenes } from '../data/art'
import { skillById } from '../data/catalog'
import { MinutesChart, ScoreLine, SkillCompareChart } from '../components/Charts'
import { Picture } from '../components/Picture'
import { SkillRing } from '../components/Visuals'
import { Card, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'
import { minutesByDay } from '../services/learning/derive'

const ranges = [7, 14, 30] as const

export function Analytics() {
  const { state, view } = useApp()
  const [days, setDays] = useState<(typeof ranges)[number]>(7)
  useTitle('Analytics')
  const score = view.latestScore
  if (!score || !state.profile) return null
  const compare = view.gaps.map((gap) => ({
    skill: skillById[gap.skillId].label.split(' ')[0] ?? skillById[gap.skillId].label,
    you: gap.demonstrated,
    target: gap.target,
  }))
  const quizzes = view.quizzes.map((quiz, index) => ({ label: `Q${index + 1}`, score: quiz.percent }))

  return (
    <div className="grid gap-5">
      <div className="grid items-center gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">Analytics</p>
          <h1 className="mt-2 text-4xl font-semibold">What the record actually shows.</h1>
          <p className="mt-2 max-w-2xl text-muted">Minutes are estimates saved when you submit an assessment, finish a task, take a quiz, or revise a miss. They are not from a background timer.</p>
        </div>
        <Picture src={scenes.analytics.src} alt={scenes.analytics.alt} className="w-full rounded-[1.5rem]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Estimated minutes</h2>
            <div className="flex gap-1" role="group" aria-label="Activity range">
              {ranges.map((range) => (
                <button key={range} type="button" className="chip" aria-pressed={days === range} onClick={() => setDays(range)}>{range}d</button>
              ))}
            </div>
          </div>
          <MinutesChart data={minutesByDay(state, days)} />
        </Card>
        <Card className="grid justify-items-center">
          <SkillRing score={view.progress} label="Roadmap complete" />
          <p className="text-sm text-muted">{view.streak} day streak · {view.quizAccuracy}% quiz accuracy</p>
        </Card>
      </div>
      <Card>
        <h2 className="text-xl font-semibold">Demonstrated score against the career target</h2>
        <p className="mt-1 text-sm text-muted">Violet bars are the configurable target for the selected career. They are study guidance.</p>
        <SkillCompareChart data={compare} />
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Quiz scores</h2>
        {quizzes.length === 0 ? <p className="mt-3 text-sm text-muted">No quiz has been submitted yet.</p> : <ScoreLine data={quizzes} />}
      </Card>
    </div>
  )
}
