import { useState } from 'react'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { buildPassport } from '../services/passport'

function storedIds() {
  try {
    const raw = sessionStorage.getItem('herhealth-passport-ids')
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function Passport() {
  const { snapshot, notify } = useHealth()
  const [picked, setPicked] = useState<string[]>(storedIds)
  const [includeSamples, setIncludeSamples] = useState(true)
  const [questions, setQuestions] = useState('What do these notes mean for me? Please do not change my medicines based on this app.')
  const [reviewed, setReviewed] = useState(false)
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const symptoms = snapshot.symptoms.filter((entry) => picked.includes(entry.id))
  const text = buildPassport({
    lang,
    displayName: snapshot.profile.displayName,
    symptoms,
    labs: snapshot.labs,
    reports: snapshot.reports,
    medicines: snapshot.medicines,
    questions,
    includeSamples,
  })

  function download() {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'herhealth-care-passport.txt'
    link.click()
    URL.revokeObjectURL(url)
    notify(t(lang, { en: 'Passport file downloaded.', kn: 'ಪಾಸ್‌ಪೋರ್ಟ್ ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ.' }))
  }

  return (
    <div>
      <PageIntro kicker={t(lang, { en: 'Care Passport', kn: 'ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್' })} title={t(lang, { en: 'Review, then export', kn: 'ನೋಡಿ, ನಂತರ ರಫ್ತು ಮಾಡಿ' })} lede={t(lang, { en: 'Choose the notes that may leave this device. The file stays on your computer only when you download it. It is not a diagnosis.', kn: 'ಈ ಸಾಧನವನ್ನು ಬಿಡಬಹುದಾದ ಟಿಪ್ಪಣಿಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ. ನೀವು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿದಾಗ ಮಾತ್ರ ಫೈಲ್ ನಿಮ್ಮ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿರುತ್ತದೆ. ಇದು ರೋಗ ನಿರ್ಣಯವಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <button type="button" className="btn ghost mb-4" onClick={() => setPicked(snapshot.symptoms.map((entry) => entry.id))}>
        {t(lang, { en: 'Select the fictional timeline', kn: 'ಕಾಲ್ಪನಿಕ ಕಾಲರೇಖೆ ಆಯ್ಕೆಮಾಡಿ' })}
      </button>
      <ul className="grid gap-2">
        {snapshot.symptoms.map((entry) => (
          <li key={entry.id}>
            <label className="flex gap-2">
              <input type="checkbox" checked={picked.includes(entry.id)} onChange={() => { setPicked((current) => current.includes(entry.id) ? current.filter((id) => id !== entry.id) : [...current, entry.id]); setReviewed(false) }} />
              <span>{entry.module} · {entry.sample ? t(lang, { en: 'sample', kn: 'ಮಾದರಿ' }) : t(lang, { en: 'yours', kn: 'ನಿಮ್ಮದು' })} · {entry.notes}</span>
            </label>
          </li>
        ))}
      </ul>
      <label className="mt-4 flex gap-2">
        <input type="checkbox" checked={includeSamples} onChange={(event) => { setIncludeSamples(event.target.checked); setReviewed(false) }} />
        {t(lang, { en: 'Include fictional sample entries that are selected', kn: 'ಆಯ್ಕೆಮಾಡಿದ ಕಾಲ್ಪನಿಕ ಮಾದರಿ ನಮೂದುಗಳನ್ನು ಸೇರಿಸಿ' })}
      </label>
      <p className="mt-4 text-sm text-muted">{t(lang, { en: `Labs (${snapshot.labs.length}), reports (${snapshot.reports.length}), and medicine checks (${snapshot.medicines.length}) currently saved are included when the sample switch allows them.`, kn: `ಉಳಿಸಿದ ಪ್ರಯೋಗಾಲಯ (${snapshot.labs.length}), ವರದಿ (${snapshot.reports.length}) ಮತ್ತು ಔಷಧಿ ಪರಿಶೀಲನೆ (${snapshot.medicines.length}) ಮಾದರಿ ಸ್ವಿಚ್ ಅನುಮತಿಸಿದಾಗ ಸೇರುತ್ತವೆ.` })}</p>
      <label className="mt-4 grid gap-2 text-sm font-semibold">
        {t(lang, { en: 'Questions to include', kn: 'ಸೇರಿಸಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು' })}
        <textarea className="area" value={questions} onChange={(event) => { setQuestions(event.target.value); setReviewed(false) }} />
      </label>
      <h2 className="mt-6 text-2xl">{t(lang, { en: 'Preview', kn: 'ಮುನ್ನೋಟ' })}</h2>
      <pre className="paper mt-3 whitespace-pre-wrap font-sans text-sm">{text}</pre>
      <label className="mt-4 flex gap-2">
        <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} />
        {t(lang, { en: 'I read this summary. I know it is not a diagnosis or a prescription.', kn: 'ನಾನು ಈ ಸಾರಾಂಶವನ್ನು ಓದಿದ್ದೇನೆ. ಇದು ರೋಗ ನಿರ್ಣಯ ಅಥವಾ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಲ್ಲ ಎಂದು ನನಗೆ ಗೊತ್ತು.' })}
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn primary" disabled={!reviewed} onClick={download}>{t(lang, { en: 'Download text', kn: 'ಪಠ್ಯ ಡೌನ್‌ಲೋಡ್' })}</button>
        <button type="button" className="btn ghost" disabled={!reviewed} onClick={() => void navigator.clipboard.writeText(text).then(() => notify(t(lang, { en: 'Copied.', kn: 'ನಕಲಾಗಿದೆ.' })))}>{t(lang, { en: 'Copy', kn: 'ನಕಲಿಸಿ' })}</button>
        <button type="button" className="btn ghost" disabled={!reviewed} onClick={() => window.print()}>{t(lang, { en: 'Print', kn: 'ಮುದ್ರಿಸಿ' })}</button>
      </div>
    </div>
  )
}
