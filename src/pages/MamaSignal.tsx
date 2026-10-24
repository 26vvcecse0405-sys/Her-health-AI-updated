import { useState } from 'react'
import { CareBridge } from '../components/CareBridge'
import { TrendChart } from '../components/Charts'
import { LogForm } from '../components/LogForm'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { mamaSymptoms, medicineQuestions, pregnancyStages, stageEducation, visitChecklist } from '../data/catalog'
import { t } from '../i18n'
import { formatWhen, showSymptoms } from '../lib/format'

export function MamaSignal() {
  const { snapshot } = useHealth()
  const [stage, setStage] = useState('trimester-2')
  const [checked, setChecked] = useState<string[]>([])
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const entries = snapshot.symptoms.filter((entry) => entry.module === 'mama')
  const education = stageEducation[stage] ?? stageEducation.unspecified!
  const urgent = entries.some((entry) => entry.symptoms.some((id) => mamaSymptoms.find((choice) => choice.id === id)?.level === 'emergency'))
  const summary = [
    'MamaSignal visit summary — educational, not a referral.',
    `Stage the user selected: ${stage}`,
    ...entries.map((entry) => `${entry.createdAt.slice(0, 10)} severity ${entry.severity}/10: ${showSymptoms(entry.symptoms)}. ${entry.notes}`),
    'Questions prepared:',
    ...medicineQuestions.map((item) => `- ${item.en}`),
  ].join('\n')
  return (
    <div>
      <PageIntro kicker="MamaSignal" title={t(lang, { en: 'Pregnancy support', kn: 'ಗರ್ಭಧಾರಣೆ ಬೆಂಬಲ' })} lede={t(lang, { en: 'Log what you notice. Urgent warning signs are fixed rules and appear as soon as you select them.', kn: 'ನೀವು ಗಮನಿಸಿದ್ದನ್ನು ದಾಖಲಿಸಿ. ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳು ನಿಗದಿತ ನಿಯಮಗಳು. ಆಯ್ಕೆಮಾಡಿದ ತಕ್ಷಣ ಕಾಣಿಸುತ್ತವೆ.' })} />
      <SafetyNote lang={lang} />
      <div className="glass p-5">
        <LogForm lang={lang} module="mama" choices={mamaSymptoms} stage={stage} stages={pregnancyStages} onStage={setStage} />
      </div>
      <section className="glass mt-6 p-5">
        <h2 className="text-2xl">{t(lang, { en: 'For the stage you selected', kn: 'ನೀವು ಆಯ್ಕೆಮಾಡಿದ ಹಂತಕ್ಕೆ' })}</h2>
        <p className="mt-3 leading-7">{t(lang, education.body)}</p>
        <p className="mt-2 text-sm text-muted">{education.source}</p>
      </section>
      <section className="glass mt-6 p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Visit preparation', kn: 'ಭೇಟಿ ಸಿದ್ಧತೆ' })}</h2>
        <ul className="mt-3 grid gap-2">
          {visitChecklist.map((item) => (
            <li key={item.en}>
              <label className="flex gap-2">
                <input type="checkbox" checked={checked.includes(item.en)} onChange={() => setChecked((current) => current.includes(item.en) ? current.filter((id) => id !== item.en) : [...current, item.en])} />
                {t(lang, item)}
              </label>
            </li>
          ))}
        </ul>
        <h3 className="mt-5 text-xl">{t(lang, { en: 'Questions about medicines you already have', kn: 'ನೀವು ಈಗಾಗಲೇ ಹೊಂದಿರುವ ಔಷಧಿಗಳ ಪ್ರಶ್ನೆಗಳು' })}</h3>
        <ul className="mt-2 list-disc pl-5 leading-7">
          {medicineQuestions.map((item) => <li key={item.en}>{t(lang, item)}</li>)}
        </ul>
        <p className="mt-3 text-sm text-muted">{t(lang, { en: 'Do not change how you take a medicine because it appears on this list.', kn: 'ಈ ಪಟ್ಟಿಯಲ್ಲಿದೆ ಎಂದು ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳುವ ವಿಧಾನವನ್ನು ಬದಲಾಯಿಸಬೇಡಿ.' })}</p>
      </section>
      <section className="glass mt-6 p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Timeline', kn: 'ಕಾಲರೇಖೆ' })}</h2>
        <div className="mt-4"><TrendChart entries={entries} metric="severity" label="Pregnancy note severity" /></div>
        {entries.length === 0 ? <p className="text-muted">{t(lang, { en: 'No pregnancy notes yet.', kn: 'ಇನ್ನೂ ಗರ್ಭಧಾರಣೆ ಟಿಪ್ಪಣಿಗಳಿಲ್ಲ.' })}</p> : (
          <ul className="mt-4 grid gap-3">
            {entries.map((entry) => <li key={entry.id}><strong>{formatWhen(entry.createdAt, lang)}</strong> · {entry.severity}/10 · {entry.notes}</li>)}
          </ul>
        )}
      </section>
      <CareBridge lang={lang} text={summary} need="pregnancy" urgent={urgent} />
    </div>
  )
}
