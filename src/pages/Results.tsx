import { useState } from 'react'
import { assessmentQuestions } from '../data/assessmentBank'
import { difficultyLabels, skillById } from '../data/catalog'
import { SkillRing } from '../components/Visuals'
import { Button, Card, Meter, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'
import { scoreAnswers } from '../services/assessment/score'

const severityLabel = { none: 'On target', small: 'Small gap', moderate: 'Moderate gap', large: 'Large gap' }

export function Results() {
  const { state, view, setDraft } = useApp()
  const [review, setReview] = useState(false)
  const [confirm, setConfirm] = useState(false)
  useTitle('Results')
  const latest = view.latest
  const score = view.latestScore
  if (!latest || !score || !state.profile) {
    return (
      <Card>
        <h1 className="text-2xl font-semibold">No completed assessment yet</h1>
        <p className="mt-2 text-muted">Scores appear after you submit every question. An unfinished draft is not treated as a result.</p>
        <Button className="mt-4" to="/assessment">Go to the assessment</Button>
      </Card>
    )
  }
  const strongest = [...score.bySkill].sort((a, b) => b.score - a.score).slice(0, 2)
  const missed = assessmentQuestions.filter((question) => latest.answers[question.id] !== question.correctIndex)

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-cyan">Assessment results</p>
          <h1 className="text-3xl font-semibold">Your demonstrated skills</h1>
        </div>
        <SkillRing score={score.overall} label="Overall weighted score" />
      </div>
      <Card>
        <p className="text-sm text-muted">
          Foundation questions are worth 1, intermediate 2, and advanced 3. The skill score is earned weight divided by possible weight. Overall is the same rule across every question. Confidence ratings are not included.
        </p>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        {score.bySkill.map((item) => {
          const gap = view.gaps.find((entry) => entry.skillId === item.skillId)
          const prior = view.previousScore?.bySkill.find((entry) => entry.skillId === item.skillId)?.score
          return (
            <Card key={item.skillId}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">{skillById[item.skillId].label}</h2>
                <span className="text-xl font-semibold">{item.score}</span>
              </div>
              <Meter value={item.score} />
              <p className="mt-2 text-sm text-muted">{item.earned} of {item.possible} points. {gap ? severityLabel[gap.severity] : ''}</p>
              {prior !== undefined ? <p className="text-sm text-muted">Previous attempt: {prior}. Change: {item.score - prior}.</p> : null}
              <p className="mt-2 text-sm text-muted">You rated your confidence {state.profile?.confidence[item.skillId]} / 5. That number is not this score.</p>
            </Card>
          )
        })}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Strongest skills</h2>
          <ul className="mt-3 grid gap-2 text-muted">
            {strongest.map((item) => <li key={item.skillId}>{skillById[item.skillId].label} · {item.score}</li>)}
          </ul>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Skills that need improvement</h2>
          <ul className="mt-3 grid gap-2 text-muted">
            {view.developing.length === 0 ? <li>Every assessed skill is at or above the career target.</li> : null}
            {view.developing.slice(0, 3).map((gap) => (
              <li key={gap.skillId}>{skillById[gap.skillId].label} · gap {gap.gap} · {severityLabel[gap.severity]}</li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <h2 className="text-xl font-semibold">Suggested next steps</h2>
        <ol className="mt-3 grid gap-3">
          {view.developing.slice(0, 3).map((gap) => (
            <li key={gap.skillId} className="text-sm leading-6 text-muted">{gap.why}</li>
          ))}
        </ol>
        <Button className="mt-4" to="/roadmap">Open my roadmap</Button>
      </Card>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Review missed questions</h2>
          <Button variant="ghost" onClick={() => setReview(!review)}>{review ? 'Hide' : `Show ${missed.length}`}</Button>
        </div>
        {review ? (
          <ul className="mt-4 grid gap-4">
            {missed.map((question) => (
              <li key={question.id}>
                <p className="font-medium">{question.prompt}</p>
                <p className="mt-1 text-sm text-muted">Your answer: {question.options[latest.answers[question.id] ?? 0]}. Keyed answer: {question.options[question.correctIndex]}. {question.explanation}</p>
                <p className="text-xs text-muted">{skillById[question.skillId].label} · {difficultyLabels[question.difficulty]}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </Card>
      <div className="flex flex-wrap gap-3">
        {confirm ? (
          <Button
            variant="ghost"
            onClick={() => {
              setDraft({ index: 0, answers: {} })
              window.location.assign('/assessment')
            }}
          >
            Yes, start a new attempt
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => setConfirm(true)}>Retake assessment</Button>
        )}
        <Button to="/dashboard">Go to dashboard</Button>
      </div>
      <p className="text-sm text-muted">Attempt {state.attempts.length}. Completed {new Date(latest.completedAt).toLocaleString()}.</p>
      <p className="sr-only">{scoreAnswers(latest.answers).overall}</p>
    </div>
  )
}
