import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { careerById, educationLabels, skillById, styleLabels } from '../data/catalog'
import { Picture } from '../components/Picture'
import { Button, Card, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'
import { careerArt } from '../data/art'

export function Profile() {
  const { state, view, resetStudent, regenerateRoadmap, mode } = useApp()
  const [confirm, setConfirm] = useState(false)
  const navigate = useNavigate()
  useTitle('Profile')
  const profile = state.profile
  if (!profile) return null

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">Profile</p>
        <h1 className="mt-2 text-4xl font-semibold">{profile.name}</h1>
        <Picture src={careerArt[profile.career].src} alt={careerArt[profile.career].alt} className="mt-4 h-44 w-full max-w-md rounded-[1.5rem] object-cover" />
        <p className="mt-4 max-w-2xl text-muted">
          {profile.isDemo ? 'This is the fictional demo student. Reset demo in the header restores her sample record.' : 'This profile lives in this browser. Clearing it does not affect the demo student.'}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Study setup</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">Education</dt><dd>{educationLabels[profile.educationLevel]}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Career target</dt><dd>{careerById[profile.career].label}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Style</dt><dd>{styleLabels[profile.learningStyle]}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Time</dt><dd>{profile.minutesPerDay} min/day · {profile.durationWeeks} weeks</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Record</dt><dd>{mode === 'demo' ? 'Demo' : 'Your browser'}</dd></div>
          </dl>
          <p className="mt-4 text-sm leading-6 text-muted">{careerById[profile.career].blurb} The target levels are planning guidance, not a hiring decision.</p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Confidence versus score</h2>
          <p className="mt-2 text-sm text-muted">The slider is how sure you felt. The score is what the assessment measured.</p>
          <ul className="mt-4 grid gap-3">
            {view.latestScore?.bySkill.map((item) => (
              <li key={item.skillId} className="flex items-center justify-between gap-3 text-sm">
                <span>{skillById[item.skillId].label}</span>
                <span className="text-muted">Felt {profile.confidence[item.skillId]}/5 · scored {item.score}</span>
              </li>
            )) ?? <li className="text-sm text-muted">Scores appear after the assessment.</li>}
          </ul>
        </Card>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button to="/onboarding" variant="ghost">Edit profile</Button>
        {state.attempts.length > 0 ? <Button variant="ghost" onClick={() => regenerateRoadmap()}>Rebuild roadmap</Button> : null}
        {mode === 'demo' ? null : confirm ? (
          <Button onClick={() => { resetStudent(); navigate('/') }}>Yes, clear my profile</Button>
        ) : (
          <Button variant="ghost" onClick={() => setConfirm(true)}>Clear my profile</Button>
        )}
      </div>
    </div>
  )
}
