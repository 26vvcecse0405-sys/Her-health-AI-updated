import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'

export function AnemiaLens() {
  const { snapshot, addSymptom } = useHealth()
  const [preview, setPreview] = useState('')
  const [light, setLight] = useState(false)
  const [nail, setNail] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const ready = light && nail && Boolean(preview)

  return (
    <div className="grid gap-5">
      <PageIntro kicker="AnemiaLens" title={t(lang, { en: 'Fingernail photo awareness', kn: 'ಉಗುರು ಫೋಟೋ ಜಾಗೃತಿ' })} lede={t(lang, { en: 'This is an educational camera exercise. Nail colour cannot diagnose anaemia. Nothing on this page reads the photograph or estimates a blood value.', kn: 'ಇದು ಶೈಕ್ಷಣಿಕ ಕ್ಯಾಮೆರಾ ಅಭ್ಯಾಸ. ಉಗುರಿನ ಬಣ್ಣ ರಕ್ತಹೀನತೆಯನ್ನು ನಿರ್ಣಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಈ ಪುಟ ಫೋಟೋ ಓದುವುದಿಲ್ಲ ಅಥವಾ ರಕ್ತದ ಸಂಖ್ಯೆ ಅಂದಾಜು ಮಾಡುವುದಿಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <p className="banner urgent" role="note">{t(lang, { en: 'Experimental and unvalidated. A pale nail has many explanations, including lighting. Only a blood test interpreted by a clinician can assess anaemia.', kn: 'ಇದು ಪ್ರಾಯೋಗಿಕ ಮತ್ತು ಪರಿಶೀಲಿಸದ ವಿಷಯ. ತಿಳಿ ಉಗುರಿಗೆ ಬೆಳಕು ಸೇರಿದಂತೆ ಹಲವು ಕಾರಣಗಳಿವೆ. ರಕ್ತಹೀನತೆಯನ್ನು ವೈದ್ಯರು ಓದುವ ರಕ್ತ ಪರೀಕ್ಷೆ ಮಾತ್ರ ನೋಡಬಹುದು.' })}</p>
      <section className="glass grid gap-3 p-5">
        <label className="btn ghost w-fit">
          {t(lang, { en: 'Upload a fingernail photo', kn: 'ಉಗುರಿನ ಫೋಟೋ ಅಪ್‌ಲೋಡ್' })}
          <input className="sr-only" type="file" accept="image/*" capture="environment" onChange={(event) => {
            const file = event.target.files?.[0]
            if (!file) return
            setPreview(URL.createObjectURL(file))
            setLight(false)
            setNail(false)
          }} />
        </label>
        {preview ? <img src={preview} alt={t(lang, { en: 'Your uploaded fingernail photo. The app does not analyse it.', kn: 'ನೀವು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಉಗುರಿನ ಫೋಟೋ. ಅಪ್ಲಿಕೇಶನ್ ಅದನ್ನು ವಿಶ್ಲೇಷಿಸುವುದಿಲ್ಲ.' })} className="max-h-64 rounded-2xl object-contain" /> : <p className="text-muted">{t(lang, { en: 'No photo yet. The preview stays in this browser tab and is not uploaded.', kn: 'ಇನ್ನೂ ಫೋಟೋ ಇಲ್ಲ. ಮುನ್ನೋಟ ಈ ಟ್ಯಾಬ್‌ನಲ್ಲೇ ಇರುತ್ತದೆ. ಅದನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುವುದಿಲ್ಲ.' })}</p>}
        <label className="flex gap-2"><input type="checkbox" checked={light} onChange={(event) => setLight(event.target.checked)} />{t(lang, { en: 'The light is even, without a strong colour cast.', kn: 'ಬೆಳಕು ಸಮವಾಗಿದೆ, ಬಲವಾದ ಬಣ್ಣದ ಛಾಯೆ ಇಲ್ಲ.' })}</label>
        <label className="flex gap-2"><input type="checkbox" checked={nail} onChange={(event) => setNail(event.target.checked)} />{t(lang, { en: 'The nail is in focus and fills most of the frame.', kn: 'ಉಗುರು ಸ್ಪಷ್ಟವಾಗಿದೆ ಮತ್ತು ಚೌಕಟ್ಟಿನ ಹೆಚ್ಚಿನ ಭಾಗ ತುಂಬಿದೆ.' })}</label>
        <label className="grid gap-1 text-sm font-semibold">{t(lang, { en: 'What you want to remember, in your words', kn: 'ನೀವು ನೆನಪಿಡಬೇಕಾದುದು, ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ' })}<textarea className="area" value={note} onChange={(event) => setNote(event.target.value)} /></label>
        {error ? <p role="alert" className="text-sm text-warn">{error}</p> : null}
        <button type="button" className="btn primary w-fit" disabled={!ready} onClick={() => {
          if (note.trim().length < 8) {
            setError(t(lang, { en: 'Write at least a short note. The photo itself is not saved as a result.', kn: 'ಚಿಕ್ಕ ಟಿಪ್ಪಣಿ ಬರೆಯಿರಿ. ಫೋಟೋವನ್ನು ಫಲಿತಾಂಶವಾಗಿ ಉಳಿಸಲಾಗುವುದಿಲ್ಲ.' }))
            return
          }
          void addSymptom({ module: 'iron', symptoms: ['nail-photo-note'], severity: 0, notes: `AnemiaLens note, not an analysis: ${note.trim()}` })
          setNote('')
          setError('')
        }}>{t(lang, { en: 'Save my words only', kn: 'ನನ್ನ ಮಾತನ್ನು ಮಾತ್ರ ಉಳಿಸಿ' })}</button>
        <Link className="btn ghost w-fit" to="/health/iron">{t(lang, { en: 'Continue with symptom and lab questions', kn: 'ಲಕ್ಷಣ ಮತ್ತು ಪ್ರಯೋಗಾಲಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ಮುಂದುವರಿಸಿ' })}</Link>
      </section>
    </div>
  )
}
