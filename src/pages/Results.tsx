import { useState } from 'react'
import { assessmentQuestions } from '../data/assessmentBank'
import { careerById, difficultyLabels, skillById } from '../data/catalog'
import { GapBoard } from '../components/GapBoard'
import { SkillDna } from '../components/SkillDna'
import { SkillRing } from '../components/Visuals'
import { Picture } from '../components/Picture'
import { Button, Card, Meter, useTitle } from '../components/ui'
import { careerArt, scenes } from '../data/art'
import { useApp } from '../context/AppContext'
import { severityLabel } from '../services/learning/gaps'
import { scoreAnswers } from '../services/assessment/score'

export function Results() {
  const { state, view, setDraft } = useApp()
  const [review, setReview] = useState(false)
  const [confirm, setConfirm] = useState(false)
  useTitle('Skill DNA')
  const latest = view.latest
  const score = view.latestScore
  const profile = state.profile
  if (!latest || !score || !profile) {
    return (
      <Card>
        <Picture src={scenes.empty.src} alt={scenes.empty.alt} className="mb-4 h-40 w-full object-contain" />
        <h1 className="text-2xl font-semibold">No completed assessment yet</h1>
        <p className="mt-2 text-muted">Skill DNA appears after you submit every question. An unfinished draft is not treated as a result.</p>
        <Button className="mt-4" to="/assessment">Go to the assessment</Button>
      </Card>
    )
  }
  const attention = view.developing.filter((gap) => gap.severity === 'moderate' || gap.severity === 'large')
  const growing = view.developing.filter((gap) => gap.severity === 'small')
  const missed = assessmentQuestions.filter((question) => latest.answers[question.id] !== question.correctIndex)
  const career = careerById[profile.career]

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">Skill DNA</p>
          <h1 className="text-4xl font-semibold">Your demonstrated profile</h1>
          <Picture src={careerArt[profile.career].src} alt={careerArt[profile.career].alt} className="mt-4 h-36 w-full max-w-sm rounded-2xl object-cover" />
          <p className="mt-2 max-w-2xl text-muted">Built from attempt {state.attempts.length}, completed {new Date(latest.completedAt).toLocaleString()}. Targets belong to {career.label} and can be changed on the career map.</p>
        </div>
        <SkillRing score={score.overall} label="Overall weighted score" />
      </div>
      <Card>
        <p className="text-sm leading-6 text-muted">Foundation questions are worth 1, intermediate 2, and advanced 3. A skill score is earned weight divided by possible weight, rounded to the nearest whole number. Overall uses the same rule across every question. Your confidence rating is not included.</p>
      </Card>
      <Card>
        <SkillDna scores={score.bySkill} gaps={view.gaps} careerLabel={career.label} />
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="text-xl font-semibold">Strengths</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted">
            {view.mastered.length === 0 ? <li>No skill is at the configured target yet.</li> : null}
            {view.mastered.map((gap) => <li key={gap.skillId}>{skillById[gap.skillId].label} · {gap.demonstrated}. {skillById[gap.skillId].summary}</li>)}
          </ul>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Currently developing</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted">
            {growing.length === 0 ? <li>No small gaps. Open gaps are larger, or every skill is on target.</li> : null}
            {growing.map((gap) => <li key={gap.skillId}>{skillById[gap.skillId].label} · gap {gap.gap}. {career.reasons[gap.skillId]}</li>)}
          </ul>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Needs attention</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted">
            {attention.length === 0 ? <li>No moderate or large gaps for this target.</li> : null}
            {attention.map((gap) => <li key={gap.skillId}>{skillById[gap.skillId].label} · gap {gap.gap}. {career.reasons[gap.skillId]}</li>)}
          </ul>
        </Card>
      </div>
      <Card id="gaps">
        <h2 className="text-2xl font-semibold">Skill-gap engine</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Skill gap = max(0, target proficiency − demonstrated proficiency). Priority multiplies that gap by 1.3 when the skill is core for the career and by 1.15 when it matches an interest you picked. The order below is that priority. It is a study order, not a hiring score.</p>
        <div className="mt-4"><GapBoard gaps={view.gaps} tasks={view.tasks} /></div>
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
              <p className="mt-2 text-sm text-muted">You rated confidence {profile.confidence[item.skillId]} / 5. That number is not this score.</p>
              <p className="mt-2 text-sm leading-6 text-muted">{career.core.includes(item.skillId) ? 'Core for this career target. ' : 'Supporting for this career target. '}{career.reasons[item.skillId]}</p>
            </Card>
          )
        })}
      </div>
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
          <Button variant="ghost" onClick={() => { setDraft({ index: 0, answers: {} }); window.location.assign('/assessment') }}>Yes, start a new attempt</Button>
        ) : (
          <Button variant="ghost" onClick={() => setConfirm(true)}>Retake assessment</Button>
        )}
        <Button to="/roadmap">Open my roadmap</Button>
        <Button to="/careers" variant="ghost">Compare careers</Button>
      </div>
      <p className="sr-only">{scoreAnswers(latest.answers).overall}</p>
    </div>
  )
}
