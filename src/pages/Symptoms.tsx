import { useState } from 'react'
import { TrendChart } from '../components/Charts'
import { PageIntro, SafetyNote, Suggest } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'

export function Symptoms() {
  const { snapshot, addSymptom } = useHealth()
  const [symptom, setSymptom] = useState('')
  const [severity, setSeverity] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState<'edit' | 'follow' | 'review'>('edit')
  const [duration, setDuration] = useState('')
  const [error, setError] = useState('')
  const [suggest, setSuggest] = useState(false)
  if (!snapshot) return null
  const lang = snapshot.profile.language

  return (
    <div className="grid gap-5">
      <PageIntro kicker={t(lang, { en: 'Symptom tracker', kn: 'ಲಕ್ಷಣ ಟ್ರ್ಯಾಕರ್' })} title={t(lang, { en: 'A conversation, then a record', kn: 'ಮಾತುಕತೆ, ನಂತರ ದಾಖಲೆ' })} lede={t(lang, { en: 'Describe what you noticed. SAKHI asks one follow-up, then you review the note before it is saved. A pattern here is not a diagnosis.', kn: 'ನೀವು ಗಮನಿಸಿದ್ದನ್ನು ಬರೆಯಿರಿ. SAKHI ಒಂದು ಪ್ರಶ್ನೆ ಕೇಳುತ್ತದೆ, ನಂತರ ಉಳಿಸುವ ಮೊದಲು ನೀವು ಟಿಪ್ಪಣಿ ನೋಡುತ್ತೀರಿ. ಇಲ್ಲಿನ ಮಾದರಿ ರೋಗ ನಿರ್ಣಯವಲ್ಲ.', hi: 'जो दिखा वह लिखें। SAKHI एक सवाल पूछती है, फिर नोट सहेजने से पहले आप उसे देखते हैं। यहाँ का पैटर्न निदान नहीं है।' })} />
      <SafetyNote lang={lang} />
      <p className="text-sm text-muted">{t(lang, { en: `Step ${step === 'edit' ? 1 : step === 'follow' ? 2 : 3} of 3`, kn: `3ರಲ್ಲಿ ${step === 'edit' ? 1 : step === 'follow' ? 2 : 3}ನೇ ಹಂತ` })}</p>
      {step === 'edit' ? (
        <form className="glass grid gap-3 p-5" onSubmit={(event) => {
          event.preventDefault()
          if (symptom.trim().length < 2 || severity === null) {
            setError(t(lang, { en: 'Name the symptom and choose a severity from 0 to 10.', kn: 'ಲಕ್ಷಣದ ಹೆಸರು ಮತ್ತು 0 ರಿಂದ 10ರ ತೀವ್ರತೆ ಬೇಕು.' }))
            return
          }
          setError('')
          setStep('follow')
        }}>
          <label className="grid gap-1 text-sm font-semibold">{t(lang, { en: 'Symptom', kn: 'ಲಕ್ಷಣ' })}<input className="field" value={symptom} onChange={(event) => setSymptom(event.target.value)} /></label>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t(lang, { en: 'Severity', kn: 'ತೀವ್ರತೆ' })}>
            {Array.from({ length: 11 }, (_, value) => (
              <button key={value} type="button" className="sev" aria-pressed={severity === value} onClick={() => setSeverity(value)}>{value}</button>
            ))}
          </div>
          <label className="grid gap-1 text-sm font-semibold">{t(lang, { en: 'Notes', kn: 'ಟಿಪ್ಪಣಿ' })}<textarea className="area" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
          {error ? <p role="alert" className="text-sm text-warn">{error}</p> : null}
          <button className="btn primary w-fit" type="submit">{t(lang, { en: 'Continue', kn: 'ಮುಂದೆ' })}</button>
        </form>
      ) : null}
      {step === 'follow' ? (
        <form className="glass grid gap-3 p-5" onSubmit={(event) => { event.preventDefault(); if (duration.trim().length < 2) { setError(t(lang, { en: 'Say when it began, even roughly.', kn: 'ಅದು ಯಾವಾಗ ಶುರುವಾಯಿತು ಎಂದು ಸ್ಥೂಲವಾಗಿ ಹೇಳಿ.' })); return }; setError(''); setStep('review') }}>
          <p>{t(lang, { en: `You noted ${symptom}. When did it begin, and is it changing?`, kn: `ನೀವು ${symptom} ಬರೆದಿದ್ದೀರಿ. ಅದು ಯಾವಾಗ ಶುರುವಾಯಿತು, ಬದಲಾಗುತ್ತಿದೆಯೇ?` })}</p>
          <textarea className="area" value={duration} onChange={(event) => setDuration(event.target.value)} />
          {error ? <p role="alert" className="text-sm text-warn">{error}</p> : null}
          <div className="flex gap-2">
            <button type="button" className="btn ghost" onClick={() => setStep('edit')}>{t(lang, { en: 'Back', kn: 'ಹಿಂದೆ' })}</button>
            <button className="btn primary" type="submit">{t(lang, { en: 'Review', kn: 'ಪರಿಶೀಲಿಸಿ' })}</button>
          </div>
        </form>
      ) : null}
      {step === 'review' ? (
        <section className="glass grid gap-3 p-5">
          <h2 className="text-2xl">{t(lang, { en: 'Review before saving', kn: 'ಉಳಿಸುವ ಮೊದಲು ನೋಡಿ' })}</h2>
          <p>{symptom} · {severity}/10</p>
          <p>{notes}</p>
          <p>{duration}</p>
          <p className="text-sm text-muted">{t(lang, { en: 'Saving keeps this note on this device. It does not send it to a hospital.', kn: 'ಉಳಿಸುವುದು ಈ ಟಿಪ್ಪಣಿಯನ್ನು ಈ ಸಾಧನದಲ್ಲಿ ಇಡುತ್ತದೆ. ಅದು ಆಸ್ಪತ್ರೆಗೆ ಹೋಗುವುದಿಲ್ಲ.' })}</p>
          <div className="flex gap-2">
            <button type="button" className="btn ghost" onClick={() => setStep('follow')}>{t(lang, { en: 'Edit', kn: 'ಬದಲಾಯಿಸಿ' })}</button>
            <button type="button" className="btn primary" onClick={() => {
              void addSymptom({ module: 'general', symptoms: [symptom.trim()], severity: severity ?? 0, notes: `${notes} ${duration}`.trim(), duration })
              setSymptom('')
              setNotes('')
              setDuration('')
              setSeverity(null)
              setStep('edit')
              setSuggest(true)
            }}>{t(lang, { en: 'Save on this device', kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿ' })}</button>
          </div>
        </section>
      ) : null}
      {suggest ? <Suggest title={t(lang, { en: 'Would you like to add this to your health timeline?', kn: 'ಇದನ್ನು ಆರೋಗ್ಯ ಕಾಲರೇಖೆಗೆ ಸೇರಿಸಲು ನೋಡಬೇಕೇ?' })} action={t(lang, { en: 'Open timeline', kn: 'ಕಾಲರೇಖೆ ತೆರೆಯಿರಿ' })} href="/health/timeline" dismiss={t(lang, { en: 'Dismiss', kn: 'ಮುಚ್ಚಿ' })} onDismiss={() => setSuggest(false)} /> : null}
      <section className="glass p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Recorded pattern', kn: 'ದಾಖಲಾದ ಮಾದರಿ' })}</h2>
        <TrendChart entries={snapshot.symptoms} metric="severity" label={t(lang, { en: 'Severity of saved notes', kn: 'ಉಳಿಸಿದ ಟಿಪ್ಪಣಿಗಳ ತೀವ್ರತೆ' })} />
      </section>
    </div>
  )
}
