import { useState } from 'react'
import { BodyMap } from '../components/BodyMap'
import { CareBridge } from '../components/CareBridge'
import { TrendChart } from '../components/Charts'
import { LogForm } from '../components/LogForm'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { endoSymptoms } from '../data/catalog'
import { t } from '../i18n'
import { formatWhen, showSymptoms } from '../lib/format'

export function EndoLens() {
  const { snapshot } = useHealth()
  const [area, setArea] = useState('pelvis')
  const [filter, setFilter] = useState('all')
  const entries = snapshot?.symptoms.filter((entry) => entry.module === 'endo') ?? []
  const visible = entries.filter((entry) => filter === 'all' || entry.symptoms.includes(filter) || entry.bleeding === filter)
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const summary = [
    'EndoLens timeline — tracking cannot confirm or exclude endometriosis.',
    ...visible.map((entry) => `${entry.createdAt.slice(0, 10)} ${entry.bodyArea || 'area not set'} severity ${entry.severity}: ${showSymptoms(entry.symptoms)}. ${entry.notes}`),
  ].join('\n')
  return (
    <div>
      <PageIntro kicker="EndoLens" title={t(lang, { en: 'Symptom timeline', kn: 'ಲಕ್ಷಣ ಕಾಲರೇಖೆ' })} lede={t(lang, { en: 'Record where it hurts, how long, and how the day changed. Patterns on this page cannot confirm or exclude endometriosis.', kn: 'ಎಲ್ಲಿ ನೋವು, ಎಷ್ಟು ಹೊತ್ತು, ದಿನ ಹೇಗೆ ಬದಲಾಯಿತು ಎಂದು ದಾಖಲಿಸಿ. ಈ ಪುಟದ ಮಾದರಿಗಳು ಎಂಡೋಮೆಟ್ರಿಯೋಸಿಸ್ ಅನ್ನು ಖಚಿತಪಡಿಸಲೂ ತಳ್ಳಿಹಾಕಲೂ ಸಾಧ್ಯವಿಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <div className="glass p-5">
        <h2 className="mb-3 text-2xl">{t(lang, { en: 'Body area', kn: 'ದೇಹದ ಭಾಗ' })}</h2>
        <BodyMap lang={lang} value={area} onChange={setArea} />
        <div className="mt-5">
          <LogForm lang={lang} module="endo" choices={endoSymptoms} bodyArea={area} showCycle showBleeding showDuration showImpact />
        </div>
      </div>
      <section className="glass mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl">{t(lang, { en: 'Trends', kn: 'ಪ್ರವೃತ್ತಿಗಳು' })}</h2>
          <label className="text-sm">
            {t(lang, { en: 'Filter', kn: 'ಶೋಧಕ' })}
            <select className="field ml-2 w-auto" value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">{t(lang, { en: 'All notes', kn: 'ಎಲ್ಲಾ ಟಿಪ್ಪಣಿಗಳು' })}</option>
              <option value="pelvic-pain">{t(lang, { en: 'Pelvic pain', kn: 'ಶ್ರೋಣಿ ನೋವು' })}</option>
              <option value="fatigue">{t(lang, { en: 'Fatigue', kn: 'ಆಯಾಸ' })}</option>
              <option value="heavy">{t(lang, { en: 'Heavy bleeding', kn: 'ಹೆಚ್ಚು ರಕ್ತಸ್ರಾವ' })}</option>
            </select>
          </label>
        </div>
        <div className="mt-4"><TrendChart entries={visible} metric="severity" label="Pain severity" /></div>
        {visible.length === 0 ? <p className="text-muted">{t(lang, { en: 'Nothing matches this filter yet.', kn: 'ಈ ಶೋಧಕಕ್ಕೆ ಇನ್ನೂ ಏನೂ ಹೊಂದಿಲ್ಲ.' })}</p> : visible.map((entry) => (
          <p key={entry.id} className="mt-3">{formatWhen(entry.createdAt, lang)} · {entry.bodyArea} · {entry.severity}/10 · {entry.duration || ''} · {entry.impact || ''} · {entry.notes}</p>
        ))}
      </section>
      <CareBridge lang={lang} text={summary} need="gynecology" urgent={visible.some((entry) => entry.symptoms.includes('heavy-bleeding') || entry.symptoms.includes('fainting'))} />
    </div>
  )
}
