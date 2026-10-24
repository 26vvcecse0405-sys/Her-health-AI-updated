import { useState } from 'react'
import { CareBridge } from '../components/CareBridge'
import { TrendChart } from '../components/Charts'
import { LogForm } from '../components/LogForm'
import { Field, PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { ironSymptoms } from '../data/catalog'
import { t } from '../i18n'
import { formatWhen, showSymptoms } from '../lib/format'

function explain(name: string, value: number, low: number, high: number) {
  const place = value < low ? 'below' : value > high ? 'above' : 'inside'
  return {
    en: `${name} ${value} is ${place} a commonly cited educational interval of ${low}–${high}. Intervals change with the laboratory, pregnancy, and altitude. ${place === 'inside' ? 'Being inside that interval is not a clean bill of health.' : 'Being outside it is not a diagnosis.'} This app will not recommend an iron dose.`,
    kn: `${name} ${value} ಸಾಮಾನ್ಯವಾಗಿ ಹೇಳುವ ಶೈಕ್ಷಣಿಕ ವ್ಯಾಪ್ತಿ ${low}–${high}ರ ${place === 'below' ? 'ಕೆಳಗೆ' : place === 'above' ? 'ಮೇಲೆ' : 'ಒಳಗೆ'} ಇದೆ. ಪ್ರಯೋಗಾಲಯ, ಗರ್ಭಧಾರಣೆ ಮತ್ತು ಎತ್ತರದಿಂದ ವ್ಯಾಪ್ತಿ ಬದಲಾಗುತ್ತದೆ. ${place === 'inside' ? 'ಒಳಗಿರುವುದು ಸಂಪೂರ್ಣ ಆರೋಗ್ಯವಲ್ಲ.' : 'ಹೊರಗಿರುವುದು ರೋಗ ನಿರ್ಣಯವಲ್ಲ.'} ಈ ಅಪ್ಲಿಕೇಶನ್ ಕಬ್ಬಿಣದ ಡೋಸ್ ಹೇಳುವುದಿಲ್ಲ.`,
  }
}

export function IronWise() {
  const { snapshot, addLab } = useHealth()
  const [hb, setHb] = useState('')
  const [ferritin, setFerritin] = useState('')
  const [error, setError] = useState('')
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const entries = snapshot.symptoms.filter((entry) => entry.module === 'iron')
  const hbValue = hb ? Number(hb) : null
  const ferritinValue = ferritin ? Number(ferritin) : null
  const summary = [
    'IronWise summary — not a diagnosis of anemia.',
    ...entries.map((entry) => `${entry.createdAt.slice(0, 10)} severity ${entry.severity}: ${showSymptoms(entry.symptoms)}. ${entry.notes} Diet note: ${entry.dietNotes || 'none'}`),
    ...snapshot.labs.map((lab) => `${lab.name}: ${lab.value} ${lab.unit}. ${lab.context}`),
    'Ask a clinician: What could explain this fatigue? Do I need a blood test? Please do not let an app choose an iron dose.',
  ].join('\n')
  return (
    <div>
      <PageIntro kicker="IronWise" title={t(lang, { en: 'Iron health and anemia awareness', kn: 'ಕಬ್ಬಿಣದ ಆರೋಗ್ಯ ಮತ್ತು ರಕ್ತಹೀನತೆ ಅರಿವು' })} lede={t(lang, { en: 'Fatigue, diet notes, and numbers you type from a report. Fingernail color and photos are not used. This cannot diagnose anemia.', kn: 'ಆಯಾಸ, ಆಹಾರ ಟಿಪ್ಪಣಿಗಳು, ಮತ್ತು ವರದಿಯಿಂದ ನೀವು ಟೈಪ್ ಮಾಡುವ ಸಂಖ್ಯೆಗಳು. ಉಗುರಿನ ಬಣ್ಣ ಅಥವಾ ಫೋಟೋ ಬಳಸುವುದಿಲ್ಲ. ಇದು ರಕ್ತಹೀನತೆಯನ್ನು ನಿರ್ಣಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <div className="glass p-5">
        <LogForm lang={lang} module="iron" choices={ironSymptoms} showDiet />
      </div>
      <section className="glass mt-6 p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Optional numbers from a report', kn: 'ವರದಿಯಿಂದ ಐಚ್ಛಿಕ ಸಂಖ್ಯೆಗಳು' })}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label={t(lang, { en: 'Hemoglobin, g/dL', kn: 'ಹಿಮೋಗ್ಲೋಬಿನ್, g/dL' })} hint={t(lang, { en: 'Leave blank if you do not have a report.', kn: 'ವರದಿ ಇಲ್ಲದಿದ್ದರೆ ಖಾಲಿ ಬಿಡಿ.' })}>
            <input className="field" inputMode="decimal" value={hb} onChange={(event) => setHb(event.target.value)} />
          </Field>
          <Field label={t(lang, { en: 'Ferritin, ng/mL', kn: 'ಫೆರಿಟಿನ್, ng/mL' })}>
            <input className="field" inputMode="decimal" value={ferritin} onChange={(event) => setFerritin(event.target.value)} />
          </Field>
        </div>
        {error ? <p className="mt-2 text-bad" role="alert">{error}</p> : null}
        {hbValue !== null && !Number.isNaN(hbValue) ? <p className="mt-4 leading-7">{t(lang, explain('Hemoglobin', hbValue, 12, 15.5))}</p> : null}
        {ferritinValue !== null && !Number.isNaN(ferritinValue) ? <p className="mt-3 leading-7">{t(lang, explain('Ferritin', ferritinValue, 15, 150))}</p> : null}
        <button
          type="button"
          className="btn primary mt-4"
          onClick={() => {
            if (hb && Number.isNaN(Number(hb))) {
              setError(t(lang, { en: 'Hemoglobin must be a number.', kn: 'ಹಿಮೋಗ್ಲೋಬಿನ್ ಸಂಖ್ಯೆ ಆಗಿರಬೇಕು.' }))
              return
            }
            if (ferritin && Number.isNaN(Number(ferritin))) {
              setError(t(lang, { en: 'Ferritin must be a number.', kn: 'ಫೆರಿಟಿನ್ ಸಂಖ್ಯೆ ಆಗಿರಬೇಕು.' }))
              return
            }
            if (!hb && !ferritin) {
              setError(t(lang, { en: 'Enter at least one value, or skip this section.', kn: 'ಕನಿಷ್ಠ ಒಂದು ಮೌಲ್ಯ ನಮೂದಿಸಿ, ಅಥವಾ ಈ ಭಾಗವನ್ನು ಬಿಡಿ.' }))
              return
            }
            setError('')
            if (hbValue !== null && !Number.isNaN(hbValue)) {
              void addLab({ name: 'Hemoglobin', value: hbValue, unit: 'g/dL', reference: '12.0-15.5 educational', context: explain('Hemoglobin', hbValue, 12, 15.5).en, source: 'user' })
            }
            if (ferritinValue !== null && !Number.isNaN(ferritinValue)) {
              void addLab({ name: 'Ferritin', value: ferritinValue, unit: 'ng/mL', reference: '15-150 educational', context: explain('Ferritin', ferritinValue, 15, 150).en, source: 'user' })
            }
          }}
        >
          {t(lang, { en: 'Save typed values', kn: 'ಟೈಪ್ ಮಾಡಿದ ಮೌಲ್ಯಗಳನ್ನು ಉಳಿಸಿ' })}
        </button>
        <h3 className="mt-6 text-xl">{t(lang, { en: 'Questions for a clinician', kn: 'ವೈದ್ಯರಿಗೆ ಪ್ರಶ್ನೆಗಳು' })}</h3>
        <ul className="mt-2 list-disc pl-5 leading-7">
          <li>{t(lang, { en: 'Could tiredness like this need a blood test?', kn: 'ಇಂತಹ ಆಯಾಸಕ್ಕೆ ರಕ್ತ ಪರೀಕ್ಷೆ ಬೇಕೇ?' })}</li>
          <li>{t(lang, { en: 'Which reference interval applies to me, including if I am pregnant?', kn: 'ನಾನು ಗರ್ಭಿಣಿಯಾಗಿದ್ದರೆ ಸೇರಿ, ಯಾವ ವ್ಯಾಪ್ತಿ ನನಗೆ ಅನ್ವಯಿಸುತ್ತದೆ?' })}</li>
          <li>{t(lang, { en: 'Please decide any iron supplement yourself. I will not take a dose from an app.', kn: 'ಕಬ್ಬಿಣದ ಪೂರಕವನ್ನು ನೀವೇ ನಿರ್ಧರಿಸಿ. ಅಪ್ಲಿಕೇಶನ್‌ನ ಡೋಸ್ ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ.' })}</li>
        </ul>
      </section>
      <section className="glass mt-6 p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Symptom summary', kn: 'ಲಕ್ಷಣ ಸಾರಾಂಶ' })}</h2>
        <div className="mt-4"><TrendChart entries={entries} metric="severity" label="Iron note severity" /></div>
        {entries.length === 0 ? <p className="text-muted">{t(lang, { en: 'No iron notes yet. The chart appears after the first save.', kn: 'ಇನ್ನೂ ಕಬ್ಬಿಣದ ಟಿಪ್ಪಣಿಗಳಿಲ್ಲ. ಮೊದಲ ಉಳಿತಾಯದ ನಂತರ ಚಾರ್ಟ್ ಕಾಣಿಸುತ್ತದೆ.' })}</p> : entries.map((entry) => (
          <p key={entry.id} className="mt-3">{formatWhen(entry.createdAt, lang)} · {entry.severity}/10 · {entry.notes} {entry.dietNotes ? `· ${entry.dietNotes}` : ''}</p>
        ))}
      </section>
      <CareBridge lang={lang} text={summary} need="anemia" urgent={entries.some((entry) => entry.symptoms.includes('chest-pain') || entry.symptoms.includes('fainting') || entry.symptoms.includes('black-stools'))} />
    </div>
  )
}
