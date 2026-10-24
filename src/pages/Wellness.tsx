import { useEffect, useState } from 'react'
import { LogForm } from '../components/LogForm'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { wellnessSymptoms } from '../data/catalog'
import { t } from '../i18n'
import { formatWhen } from '../lib/format'

export function Wellness() {
  const { snapshot } = useHealth()
  const [breath, setBreath] = useState<'idle' | 'in' | 'hold' | 'out'>('idle')
  useEffect(() => {
    if (breath === 'idle') return
    const order = ['in', 'hold', 'out'] as const
    const timer = window.setTimeout(() => {
      const index = order.indexOf(breath)
      setBreath(index >= 2 ? 'idle' : order[index + 1]!)
    }, breath === 'hold' ? 2000 : 4000)
    return () => window.clearTimeout(timer)
  }, [breath])
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const entries = snapshot.symptoms.filter((entry) => entry.module === 'wellness')
  return (
    <div>
      <PageIntro kicker={t(lang, { en: 'Wellness', kn: 'ಯೋಗಕ್ಷೇಮ' })} title={t(lang, { en: 'A quiet check-in', kn: 'ಶಾಂತ ಚೆಕ್-ಇನ್' })} lede={t(lang, { en: 'Mood, sleep, and stress notes for you to show someone you trust. If you select thoughts of self-harm, helplines appear immediately.', kn: 'ನೀವು ನಂಬುವವರಿಗೆ ತೋರಿಸಲು ಮನಸ್ಸು, ನಿದ್ರೆ ಮತ್ತು ಒತ್ತಡದ ಟಿಪ್ಪಣಿಗಳು. ಆತ್ಮಹಾನಿ ಆಲೋಚನೆ ಆರಿಸಿದರೆ ಸಹಾಯ ಸಂಖ್ಯೆಗಳು ತಕ್ಷಣ ಕಾಣಿಸುತ್ತವೆ.' })} />
      <SafetyNote lang={lang} />
      <section className="light-panel mb-5">
        <h2 className="text-2xl">{t(lang, { en: 'One breathing cycle', kn: 'ಒಂದು ಉಸಿರಾಟದ ಸುತ್ತು' })}</h2>
        <p className="mt-2">{breath === 'idle' ? t(lang, { en: 'Ready when you are. This is a pause, not a treatment.', kn: 'ನೀವು ಸಿದ್ಧರಾದಾಗ. ಇದು ವಿರಾಮ, ಚಿಕಿತ್ಸೆಯಲ್ಲ.' }) : breath === 'in' ? t(lang, { en: 'Breathe in.', kn: 'ಒಳಗೆ ಉಸಿರೆಳೆಯಿರಿ.' }) : breath === 'hold' ? t(lang, { en: 'Hold gently.', kn: 'ಮೃದುವಾಗಿ ಹಿಡಿದಿಡಿ.' }) : t(lang, { en: 'Breathe out.', kn: 'ಹೊರಗೆ ಉಸಿರು ಬಿಡಿ.' })}</p>
        <button type="button" className="btn primary mt-3" disabled={breath !== 'idle'} onClick={() => setBreath('in')}>{t(lang, { en: 'Start one cycle', kn: 'ಒಂದು ಸುತ್ತು ಶುರು' })}</button>
      </section>
      <div className="glass p-5"><LogForm lang={lang} module="wellness" choices={wellnessSymptoms} showSleep /></div>
      <section className="glass mt-6 p-5">
        <h2 className="text-2xl">{t(lang, { en: 'If you need a person now', kn: 'ಈಗ ವ್ಯಕ್ತಿ ಬೇಕಾದರೆ' })}</h2>
        <p className="mt-2 leading-7">{t(lang, { en: 'Local emergency services, 112 or 108 in India, and Tele-MANAS 14416. This app is not a crisis counsellor.', kn: 'ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆ, ಭಾರತದಲ್ಲಿ 112 ಅಥವಾ 108, ಮತ್ತು Tele-MANAS 14416. ಈ ಅಪ್ಲಿಕೇಶನ್ ಬಿಕ್ಕಟ್ಟಿನ ಸಲಹೆಗಾರನಲ್ಲ.' })}</p>
        <div className="mt-3 flex gap-2">
          <a className="btn danger" href="tel:112">112</a>
          <a className="btn ghost" href="tel:14416">14416</a>
        </div>
      </section>
      <ul className="mt-6 grid gap-3">
        {entries.map((entry) => <li key={entry.id} className="glass p-4">{formatWhen(entry.createdAt, lang)} · {entry.severity}/10 · {entry.notes}</li>)}
      </ul>
    </div>
  )
}
