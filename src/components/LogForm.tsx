import { useState, type ReactNode } from 'react'
import { noticeFor, textLooksUrgent, type SymptomChoice } from '../services/triage'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import type { Copy, Lang, ModuleId } from '../types'
import { Field } from './ui'

type Props = {
  lang: Lang
  module: ModuleId
  choices: SymptomChoice[]
  stage?: string
  stages?: { id: string; label: Copy }[]
  onStage?: (id: string) => void
  bodyArea?: string
  showCycle?: boolean
  showDiet?: boolean
  showSleep?: boolean
  showFlush?: boolean
  showBleeding?: boolean
  showDuration?: boolean
  showImpact?: boolean
  children?: ReactNode
}

export function LogForm(props: Props) {
  const { addSymptom } = useHealth()
  const [selected, setSelected] = useState<string[]>([])
  const [severity, setSeverity] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [dietNotes, setDietNotes] = useState('')
  const [duration, setDuration] = useState('')
  const [impact, setImpact] = useState('')
  const [bleeding, setBleeding] = useState('')
  const [cycleDay, setCycleDay] = useState('')
  const [sleepHours, setSleepHours] = useState('')
  const [hotFlashes, setHotFlashes] = useState('')
  const [error, setError] = useState('')

  const urgent = props.choices.filter((choice) => choice.level && selected.includes(choice.id))
  const typedUrgent = textLooksUrgent(notes)
  const lang = props.lang

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  async function save() {
    if (selected.length === 0 && notes.trim().length < 3) {
      setError(t(lang, { en: 'Choose a symptom or write a note of at least 3 characters.', kn: 'ಒಂದು ಲಕ್ಷಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಕನಿಷ್ಠ 3 ಅಕ್ಷರದ ಟಿಪ್ಪಣಿ ಬರೆಯಿರಿ.' }))
      return
    }
    if (severity === null) {
      setError(t(lang, { en: 'Choose a severity from 0 to 10.', kn: '0 ರಿಂದ 10ರ ತೀವ್ರತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.' }))
      return
    }
    const cycle = cycleDay ? Number(cycleDay) : undefined
    if (cycleDay && (!Number.isInteger(cycle) || cycle! < 1 || cycle! > 60)) {
      setError(t(lang, { en: 'Cycle day must be a whole number from 1 to 60, or left blank.', kn: 'ಋತುಚಕ್ರದ ದಿನ 1 ರಿಂದ 60ರ ಪೂರ್ಣ ಸಂಖ್ಯೆ ಆಗಿರಬೇಕು, ಅಥವಾ ಖಾಲಿ ಬಿಡಿ.' }))
      return
    }
    const sleep = sleepHours ? Number(sleepHours) : undefined
    if (sleepHours && (Number.isNaN(sleep) || sleep! < 0 || sleep! > 24)) {
      setError(t(lang, { en: 'Sleep hours must be between 0 and 24.', kn: 'ನಿದ್ರೆಯ ಗಂಟೆಗಳು 0 ರಿಂದ 24ರ ಒಳಗಿರಬೇಕು.' }))
      return
    }
    const flashes = hotFlashes ? Number(hotFlashes) : undefined
    if (hotFlashes && (!Number.isInteger(flashes) || flashes! < 0 || flashes! > 40)) {
      setError(t(lang, { en: 'Hot flushes must be a whole number from 0 to 40.', kn: 'ಬಿಸಿ ಉಕ್ಕುವಿಕೆ 0 ರಿಂದ 40ರ ಪೂರ್ಣ ಸಂಖ್ಯೆ ಆಗಿರಬೇಕು.' }))
      return
    }
    setError('')
    await addSymptom({
      module: props.module,
      symptoms: selected,
      severity,
      notes: notes.trim(),
      stage: props.stage,
      bodyArea: props.bodyArea,
      duration: duration.trim() || undefined,
      impact: impact.trim() || undefined,
      bleeding: bleeding || undefined,
      cycleDay: cycle,
      dietNotes: dietNotes.trim() || undefined,
      sleepHours: sleep,
      hotFlashes: flashes,
    })
    setSelected([])
    setSeverity(null)
    setNotes('')
    setDietNotes('')
    setDuration('')
    setImpact('')
    setBleeding('')
    setCycleDay('')
    setSleepHours('')
    setHotFlashes('')
  }

  return (
    <div className="grid gap-4">
      {urgent.map((choice) => (
        <div key={choice.id} className={choice.level === 'emergency' ? 'banner urgent' : 'banner prompt'} role="alert">
          <strong>{t(lang, choice.label)}. </strong>
          {t(lang, noticeFor(choice))}
        </div>
      ))}
      {typedUrgent ? (
        <div className="banner urgent" role="alert">
          {t(lang, noticeFor({ id: 'text', label: { en: '', kn: '' }, level: 'emergency' }))}
        </div>
      ) : null}
      {props.stages && props.onStage ? (
        <fieldset className="grid gap-2">
          <legend className="text-sm font-semibold">{t(lang, { en: 'Stage, if you want to say', kn: 'ಹಂತ, ಹೇಳಲು ಇಷ್ಟವಿದ್ದರೆ' })}</legend>
          <div className="flex flex-wrap gap-2">
            {props.stages.map((stage) => (
              <button key={stage.id} type="button" className="chip" aria-pressed={props.stage === stage.id} onClick={() => props.onStage?.(stage.id)}>
                {t(lang, stage.label)}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
      {props.children}
      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold">{t(lang, { en: 'What did you notice?', kn: 'ನೀವು ಏನು ಗಮನಿಸಿದಿರಿ?' })}</legend>
        <div className="flex flex-wrap gap-2">
          {props.choices.map((choice) => (
            <button key={choice.id} type="button" className="chip" aria-pressed={selected.includes(choice.id)} onClick={() => toggle(choice.id)}>
              {t(lang, choice.label)}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <p className="text-sm font-semibold">{t(lang, { en: 'How much did it affect you? 0 is none, 10 is extreme.', kn: 'ಎಷ್ಟು ಪರಿಣಾಮ ಬೀರಿತು? 0 ಇಲ್ಲ, 10 ಅತ್ಯಂತ ತೀವ್ರ.' })}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Array.from({ length: 11 }, (_, value) => (
            <button key={value} type="button" className="sev" aria-pressed={severity === value} aria-label={String(value)} onClick={() => setSeverity(value)}>
              {value}
            </button>
          ))}
        </div>
      </div>
      {props.showDuration ? <Field label={t(lang, { en: 'How long did it last?', kn: 'ಎಷ್ಟು ಹೊತ್ತು ಇತ್ತು?' })}><input className="field" value={duration} onChange={(event) => setDuration(event.target.value)} maxLength={80} /></Field> : null}
      {props.showImpact ? <Field label={t(lang, { en: 'Impact on your day', kn: 'ದಿನದ ಮೇಲಿನ ಪರಿಣಾಮ' })}><input className="field" value={impact} onChange={(event) => setImpact(event.target.value)} maxLength={120} /></Field> : null}
      {props.showBleeding ? (
        <Field label={t(lang, { en: 'Bleeding, if you want to record it', kn: 'ರಕ್ತಸ್ರಾವ, ದಾಖಲಿಸಲು ಇಷ್ಟವಿದ್ದರೆ' })}>
          <select className="field" value={bleeding} onChange={(event) => setBleeding(event.target.value)}>
            <option value="">{t(lang, { en: 'Not recorded', kn: 'ದಾಖಲಿಸಿಲ್ಲ' })}</option>
            <option value="none">{t(lang, { en: 'None', kn: 'ಇಲ್ಲ' })}</option>
            <option value="spotting">{t(lang, { en: 'Spotting', kn: 'ಚುಕ್ಕೆ' })}</option>
            <option value="moderate">{t(lang, { en: 'Moderate', kn: 'ಮಧ್ಯಮ' })}</option>
            <option value="heavy">{t(lang, { en: 'Heavy', kn: 'ಹೆಚ್ಚು' })}</option>
          </select>
        </Field>
      ) : null}
      {props.showCycle ? <Field label={t(lang, { en: 'Cycle day, optional', kn: 'ಋತುಚಕ್ರದ ದಿನ, ಐಚ್ಛಿಕ' })}><input className="field" inputMode="numeric" value={cycleDay} onChange={(event) => setCycleDay(event.target.value)} /></Field> : null}
      {props.showDiet ? <Field label={t(lang, { en: 'Food note, only if you want to share it', kn: 'ಆಹಾರ ಟಿಪ್ಪಣಿ, ಹಂಚಲು ಇಷ್ಟವಿದ್ದರೆ ಮಾತ್ರ' })} hint={t(lang, { en: 'This is not a diet prescription.', kn: 'ಇದು ಆಹಾರ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಲ್ಲ.' })}><textarea className="area" value={dietNotes} maxLength={300} onChange={(event) => setDietNotes(event.target.value)} /></Field> : null}
      {props.showSleep ? <Field label={t(lang, { en: 'Hours of sleep, optional', kn: 'ನಿದ್ರೆಯ ಗಂಟೆಗಳು, ಐಚ್ಛಿಕ' })}><input className="field" inputMode="decimal" value={sleepHours} onChange={(event) => setSleepHours(event.target.value)} /></Field> : null}
      {props.showFlush ? <Field label={t(lang, { en: 'Hot flushes today, optional', kn: 'ಇಂದಿನ ಬಿಸಿ ಉಕ್ಕುವಿಕೆ, ಐಚ್ಛಿಕ' })}><input className="field" inputMode="numeric" value={hotFlashes} onChange={(event) => setHotFlashes(event.target.value)} /></Field> : null}
      <Field label={t(lang, { en: 'Note in your own words', kn: 'ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ ಟಿಪ್ಪಣಿ' })} error={error}>
        <textarea className="area" value={notes} maxLength={500} onChange={(event) => setNotes(event.target.value)} />
      </Field>
      <button type="button" className="btn primary w-fit" onClick={() => void save()}>
        {t(lang, { en: 'Save on this device', kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿ' })}
      </button>
    </div>
  )
}
