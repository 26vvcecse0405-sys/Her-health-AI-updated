import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { careers, educationLabels, interests, skills, styleLabels } from '../data/catalog'
import { Logo } from '../components/Logo'
import { Picture } from '../components/Picture'
import { Button, Field, Meter, useTitle } from '../components/ui'
import { careerArt, scenes } from '../data/art'
import { useApp } from '../context/AppContext'
import { profileSchema } from '../services/persistence/schema'
import { uid } from '../services/learning/time'
import type { CareerId, EducationLevel, InterestId, LearningStyle, SkillId } from '../types'

const steps = ['You', 'Skills', 'Interests', 'Style', 'Career', 'Time']

export function Onboarding() {
  const { student, beginStudent, saveProfile } = useApp()
  const navigate = useNavigate()
  const existing = student.profile?.isDemo ? null : student.profile
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [name, setName] = useState(existing?.name ?? '')
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>(existing?.educationLevel ?? '')
  const [confidence, setConfidence] = useState<Record<SkillId, number>>(
    existing?.confidence ?? { programming: 3, reasoning: 3, data: 3, communication: 3, problemSolving: 3, creativity: 3 },
  )
  const [picked, setPicked] = useState<InterestId[]>(existing?.interests ?? [])
  const [learningStyle, setLearningStyle] = useState<LearningStyle | ''>(existing?.learningStyle ?? '')
  const [career, setCareer] = useState<CareerId | ''>(existing?.career ?? '')
  const [minutesPerDay, setMinutesPerDay] = useState(existing?.minutesPerDay ?? 45)
  const [durationWeeks, setDurationWeeks] = useState(existing?.durationWeeks ?? 6)
  useTitle('Onboarding')

  function toggleInterest(id: InterestId) {
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  function validate() {
    if (step === 0 && (name.trim().length < 2 || !educationLevel)) return 'Add a name of at least 2 characters and an education level.'
    if (step === 2 && picked.length === 0) return 'Choose at least one interest.'
    if (step === 3 && !learningStyle) return 'Choose a learning style.'
    if (step === 4 && !career) return 'Choose a target career.'
    return ''
  }

  function next() {
    const message = validate()
    setError(message)
    if (message) return
    if (step < steps.length - 1) {
      setStep(step + 1)
      return
    }
    const draft = { name, educationLevel, confidence, interests: picked, learningStyle, career, minutesPerDay, durationWeeks }
    const parsed = profileSchema.safeParse(draft)
    if (!parsed.success) {
      setError('Check the answers before continuing.')
      return
    }
    beginStudent()
    saveProfile({
      ...parsed.data,
      id: existing?.id ?? uid(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      isDemo: false,
    })
    navigate('/assessment')
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <Logo />
      <p className="mt-8 text-sm text-muted">Step {step + 1} of {steps.length}</p>
      <h1 className="mt-1 text-3xl font-semibold">{steps[step]}</h1>
      <Meter value={((step + 1) / steps.length) * 100} />
      <Picture
        src={step === 1 ? scenes.constellation.src : step === 4 && career ? careerArt[career].src : step === 5 ? scenes.streak.src : scenes.roadmap.src}
        alt={step === 4 && career ? careerArt[career].alt : 'Illustration for this step of your learning profile'}
        className="mt-6 h-44 w-full rounded-[1.5rem] border border-line object-cover"
      />
      <section className="glass mt-6 p-5">
        {step === 0 ? (
          <div className="grid gap-4">
            <Field label="Name or nickname" hint="This stays in this browser.">
              <input className="field" value={name} maxLength={40} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Field label="Education level">
              <select className="field" value={educationLevel} onChange={(event) => setEducationLevel(event.target.value as EducationLevel)}>
                <option value="">Choose one</option>
                {Object.entries(educationLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </Field>
          </div>
        ) : null}
        {step === 1 ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted">These ratings are confidence, not your score. The assessment measures demonstrated skill separately.</p>
            {skills.map((skill) => (
              <Field key={skill.id} label={`${skill.label}: ${confidence[skill.id]} / 5`}>
                <input
                  className="w-full"
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={confidence[skill.id]}
                  aria-valuetext={`${confidence[skill.id]} out of 5`}
                  onChange={(event) => setConfidence({ ...confidence, [skill.id]: Number(event.target.value) })}
                />
              </Field>
            ))}
          </div>
        ) : null}
        {step === 2 ? (
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <button key={interest.id} type="button" className="chip" aria-pressed={picked.includes(interest.id)} onClick={() => toggleInterest(interest.id)}>
                {interest.label}
              </button>
            ))}
          </div>
        ) : null}
        {step === 3 ? (
          <div className="grid gap-2">
            {Object.entries(styleLabels).map(([id, label]) => (
              <button key={id} type="button" className="chip text-left" aria-pressed={learningStyle === id} onClick={() => setLearningStyle(id as LearningStyle)}>
                {label}
              </button>
            ))}
          </div>
        ) : null}
        {step === 4 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {careers.map((item) => (
              <button key={item.id} type="button" className="overflow-hidden rounded-2xl border border-line bg-card/70 text-left" aria-pressed={career === item.id} onClick={() => setCareer(item.id)}>
                <Picture src={careerArt[item.id].src} alt="" className="h-24 w-full object-cover" />
                <span className="block p-3">
                  <span className="block font-semibold">{item.label}</span>
                  <span className="mt-1 block text-sm font-normal text-muted">{item.blurb}</span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
        {step === 5 ? (
          <div className="grid gap-4">
            <Field label={`Available time: ${minutesPerDay} minutes a day`}>
              <input className="w-full" type="range" min={15} max={180} step={15} value={minutesPerDay} onChange={(event) => setMinutesPerDay(Number(event.target.value))} />
            </Field>
            <Field label={`Desired duration: ${durationWeeks} weeks`}>
              <input className="w-full" type="range" min={2} max={12} step={1} value={durationWeeks} onChange={(event) => setDurationWeeks(Number(event.target.value))} />
            </Field>
            <p className="text-sm text-muted">The roadmap budget is minutes per day, times weeks, times 6 study days.</p>
          </div>
        ) : null}
        {error ? <p className="mt-4 text-sm text-bad" role="alert">{error}</p> : null}
        <div className="mt-6 flex justify-between gap-3">
          <Button variant="ghost" disabled={step === 0} onClick={() => { setError(''); setStep(step - 1) }}>Back</Button>
          <Button onClick={next}>{step === steps.length - 1 ? 'Create my profile' : 'Continue'}</Button>
        </div>
      </section>
    </main>
  )
}
