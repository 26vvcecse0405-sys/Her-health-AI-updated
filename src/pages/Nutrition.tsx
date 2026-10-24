import { useState } from 'react'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { nutritionStages } from '../data/catalog'
import { t } from '../i18n'

export function Nutrition() {
  const { snapshot, addSymptom, notify } = useHealth()
  const [stage, setStage] = useState(nutritionStages[1]!.id)
  const [note, setNote] = useState('')
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const current = nutritionStages.find((item) => item.id === stage) ?? nutritionStages[0]!
  return (
    <div>
      <PageIntro kicker={t(lang, { en: 'Nutrition', kn: 'ಪೋಷಣೆ' })} title={t(lang, { en: 'Food ideas across life stages', kn: 'ಜೀವನ ಹಂತಗಳ ಆಹಾರ ಕಲ್ಪನೆಗಳು' })} lede={t(lang, { en: 'Everyday education. Not a meal plan, not a supplement dose, and not a treatment for anemia.', kn: 'ದೈನಂದಿನ ಶಿಕ್ಷಣ. ಊಟದ ಯೋಜನೆಯಲ್ಲ, ಪೂರಕದ ಡೋಸ್ ಅಲ್ಲ, ರಕ್ತಹೀನತೆಯ ಚಿಕಿತ್ಸೆಯಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <div className="flex flex-wrap gap-2">
        {nutritionStages.map((item) => (
          <button key={item.id} type="button" className="chip" aria-pressed={stage === item.id} onClick={() => setStage(item.id)}>{t(lang, item.label)}</button>
        ))}
      </div>
      <article className="glass mt-4 p-5">
        <h2 className="text-2xl">{t(lang, current.label)}</h2>
        <p className="mt-3 leading-7">{t(lang, current.body)}</p>
        <p className="mt-2 text-sm text-muted">{t(lang, { en: 'Reviewed for this demo: 24 Oct 2026. General nutrition education.', kn: 'ಈ ಪ್ರದರ್ಶನಕ್ಕೆ ಪರಿಶೀಲನೆ: 24 ಅಕ್ಟೋಬರ್ 2026. ಸಾಮಾನ್ಯ ಪೋಷಣಾ ಶಿಕ್ಷಣ.' })}</p>
      </article>
      <form className="glass mt-4 p-5" onSubmit={(event) => {
        event.preventDefault()
        if (note.trim().length < 3) {
          notify(t(lang, { en: 'Write a short food note first.', kn: 'ಮೊದಲು ಚಿಕ್ಕ ಆಹಾರ ಟಿಪ್ಪಣಿ ಬರೆಯಿರಿ.' }), 'warn')
          return
        }
        void addSymptom({ module: 'nutrition', symptoms: [stage], severity: 0, notes: note.trim() })
        setNote('')
      }}>
        <label className="text-sm font-semibold" htmlFor="food-note">{t(lang, { en: 'Save a food note to your timeline', kn: 'ನಿಮ್ಮ ಕಾಲರೇಖೆಗೆ ಆಹಾರ ಟಿಪ್ಪಣಿ ಉಳಿಸಿ' })}</label>
        <textarea id="food-note" className="area mt-2" value={note} maxLength={300} onChange={(event) => setNote(event.target.value)} />
        <button className="btn primary mt-3" type="submit">{t(lang, { en: 'Save note', kn: 'ಟಿಪ್ಪಣಿ ಉಳಿಸಿ' })}</button>
      </form>
    </div>
  )
}
