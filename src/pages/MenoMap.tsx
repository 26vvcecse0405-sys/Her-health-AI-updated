import { useState } from 'react'
import { CareBridge } from '../components/CareBridge'
import { TrendChart } from '../components/Charts'
import { LogForm } from '../components/LogForm'
import { Field, PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { interests, menoSymptoms } from '../data/catalog'
import { t } from '../i18n'
import { formatWhen } from '../lib/format'
import { languageMeta } from '../languages'

export function MenoMap() {
  const { snapshot, setInterests, setLifeStage, addLab } = useHealth()
  const [day, setDay] = useState<string | null>(null)
  const [lab, setLab] = useState('')
  const [error, setError] = useState('')
  const [today] = useState(() => new Date())
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const entries = snapshot.symptoms.filter((entry) => entry.module === 'meno' && (!day || entry.createdAt.slice(0, 10) === day))
  const all = snapshot.symptoms.filter((entry) => entry.module === 'meno')
  const first = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  const count = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const summary = ['MenoMap notes — not a diagnosis of menopause.', ...all.map((entry) => `${entry.createdAt.slice(0, 10)} sleep ${entry.sleepHours ?? '—'} flushes ${entry.hotFlashes ?? '—'} severity ${entry.severity}. ${entry.notes}`)].join('\n')
  return (
    <div>
      <PageIntro kicker="MenoMap" title={t(lang, { en: 'Menopause and the wider timeline', kn: 'ರಜೋನಿವೃತ್ತಿ ಮತ್ತು ವಿಶಾಲ ಕಾಲರೇಖೆ' })} lede={t(lang, { en: 'Sleep, mood, cycle changes, and hot flushes. You choose which interests shape the short lessons.', kn: 'ನಿದ್ರೆ, ಮನಸ್ಸು, ಋತುಚಕ್ರ ಬದಲಾವಣೆ ಮತ್ತು ಬಿಸಿ ಉಕ್ಕುವಿಕೆ. ಚಿಕ್ಕ ಪಾಠಗಳನ್ನು ಯಾವ ಆಸಕ್ತಿಗಳು ರೂಪಿಸಬೇಕು ಎಂದು ನೀವು ಆಯ್ಕೆಮಾಡುತ್ತೀರಿ.' })} />
      <SafetyNote lang={lang} />
      <section className="glass p-5">
        <h2 className="text-xl">{t(lang, { en: 'Life stage on this profile', kn: 'ಈ ಪ್ರೊಫೈಲ್‌ನ ಜೀವನ ಹಂತ' })}</h2>
        <select className="field mt-3 max-w-sm" value={snapshot.profile.lifeStage} onChange={(event) => void setLifeStage(event.target.value as typeof snapshot.profile.lifeStage)}>
          {['unspecified', 'adolescence', 'reproductive', 'pregnancy', 'postpartum', 'perimenopause', 'menopause'].map((stage) => <option key={stage} value={stage}>{stage}</option>)}
        </select>
        <div className="mt-4 flex flex-wrap gap-2">
          {interests.map((item) => {
            const on = snapshot.profile.interests.includes(item.id)
            return (
              <button key={item.id} type="button" className="chip" aria-pressed={on} onClick={() => void setInterests(on ? snapshot.profile.interests.filter((id) => id !== item.id) : [...snapshot.profile.interests, item.id])}>
                {t(lang, item.label)}
              </button>
            )
          })}
        </div>
      </section>
      <div className="glass mt-6 p-5">
        <LogForm lang={lang} module="meno" choices={menoSymptoms} showSleep showFlush showBleeding />
      </div>
      <section className="glass mt-6 p-5">
        <h2 className="text-2xl">{today.toLocaleDateString(languageMeta(lang).locale, { month: 'long', year: 'numeric' })}</h2>
        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm">
          {Array.from({ length: first }, (_, index) => <span key={`pad-${index}`} />)}
          {Array.from({ length: count }, (_, index) => {
            const date = new Date(today.getFullYear(), today.getMonth(), index + 1).toISOString().slice(0, 10)
            const marked = all.some((entry) => entry.createdAt.slice(0, 10) === date)
            return (
              <button key={date} type="button" className="chip" aria-pressed={day === date} onClick={() => setDay(day === date ? null : date)}>
                {index + 1}{marked ? ' •' : ''}
              </button>
            )
          })}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <TrendChart entries={all} metric="hotFlashes" label="Hot flushes" />
          <TrendChart entries={all} metric="sleepHours" label="Sleep hours" />
        </div>
        {entries.length === 0 ? <p className="mt-3 text-muted">{t(lang, { en: 'No menopause notes for this view yet.', kn: 'ಈ ನೋಟಕ್ಕೆ ಇನ್ನೂ ರಜೋನಿವೃತ್ತಿ ಟಿಪ್ಪಣಿಗಳಿಲ್ಲ.' })}</p> : entries.map((entry) => <p key={entry.id} className="mt-3">{formatWhen(entry.createdAt, lang)} · {entry.notes}</p>)}
      </section>
      <section className="glass mt-6 p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Optional lab note', kn: 'ಐಚ್ಛಿಕ ಪ್ರಯೋಗಾಲಯ ಟಿಪ್ಪಣಿ' })}</h2>
        <Field label={t(lang, { en: 'A value you want to remember, with its name', kn: 'ನೆನಪಿಡಲು ಬಯಸುವ ಮೌಲ್ಯ, ಅದರ ಹೆಸರಿನೊಂದಿಗೆ' })} error={error} hint={t(lang, { en: 'Example: TSH 2.4 mIU/L. Ranges vary. This is not an interpretation.', kn: 'ಉದಾಹರಣೆ: TSH 2.4 mIU/L. ವ್ಯಾಪ್ತಿಗಳು ಬದಲಾಗುತ್ತವೆ. ಇದು ವಿವರಣೆಯಲ್ಲ.' })}>
          <input className="field" value={lab} maxLength={80} onChange={(event) => setLab(event.target.value)} />
        </Field>
        <button type="button" className="btn primary mt-3" onClick={() => {
          if (lab.trim().length < 3) {
            setError(t(lang, { en: 'Write at least 3 characters, or skip this.', kn: 'ಕನಿಷ್ಠ 3 ಅಕ್ಷರ ಬರೆಯಿರಿ, ಅಥವಾ ಇದನ್ನು ಬಿಡಿ.' }))
            return
          }
          setError('')
          void addLab({ name: lab.trim(), value: 0, unit: 'see note', reference: '', context: 'User-typed note. Not interpreted by the app.', source: 'user' })
          setLab('')
        }}>{t(lang, { en: 'Save lab note', kn: 'ಪ್ರಯೋಗಾಲಯ ಟಿಪ್ಪಣಿ ಉಳಿಸಿ' })}</button>
        {snapshot.profile.interests.includes('menopause') ? <p className="mt-4 leading-7">{t(lang, { en: 'Because menopause is one of your selected interests: flushes and sleep changes are worth showing a clinician. Bleeding after periods have stopped still needs assessment, whatever the pattern of flushes.', kn: 'ರಜೋನಿವೃತ್ತಿ ನಿಮ್ಮ ಆಯ್ಕೆಗಳಲ್ಲಿದೆ: ಬಿಸಿ ಉಕ್ಕುವಿಕೆ ಮತ್ತು ನಿದ್ರೆ ಬದಲಾವಣೆಯನ್ನು ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ. ಮುಟ್ಟು ನಿಂತ ನಂತರದ ರಕ್ತಸ್ರಾವಕ್ಕೆ ಪರೀಕ್ಷೆ ಬೇಕು.' })}</p> : null}
      </section>
      <CareBridge lang={lang} text={summary} need="gynecology" urgent={all.some((entry) => entry.symptoms.includes('chest-pain') || entry.symptoms.includes('weakness'))} />
    </div>
  )
}
