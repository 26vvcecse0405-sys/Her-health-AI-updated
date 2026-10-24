import { useState } from 'react'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { screeningPoints } from '../data/catalog'
import { t } from '../i18n'

export function Screening() {
  const { snapshot, addSymptom, notify } = useHealth()
  const [question, setQuestion] = useState('')
  if (!snapshot) return null
  const lang = snapshot.profile.language
  return (
    <div>
      <PageIntro kicker={t(lang, { en: 'Screening', kn: 'ತಪಾಸಣೆ' })} title={t(lang, { en: 'Cancer awareness, not a risk score', kn: 'ಕ್ಯಾನ್ಸರ್ ಜಾಗೃತಿ, ಅಪಾಯದ ಅಂಕವಲ್ಲ' })} lede={t(lang, { en: 'Learn what screening is for and which changes deserve an examination. This page does not estimate your personal risk.', kn: 'ತಪಾಸಣೆ ಯಾವುದಕ್ಕೆ ಮತ್ತು ಯಾವ ಬದಲಾವಣೆಗೆ ಪರೀಕ್ಷೆ ಬೇಕು ಎಂದು ತಿಳಿಯಿರಿ. ಈ ಪುಟ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಅಪಾಯವನ್ನು ಅಂದಾಜಿಸುವುದಿಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <div className="grid gap-4">
        {screeningPoints.map((point) => (
          <article key={point.title.en} className="glass p-5">
            <h2 className="text-2xl">{t(lang, point.title)}</h2>
            <p className="mt-2 leading-7 text-muted">{t(lang, point.body)}</p>
            <p className="mt-2 text-sm text-muted">{t(lang, { en: 'Source themes: public screening education. Reviewed 24 Oct 2026.', kn: 'ಮೂಲ: ಸಾರ್ವಜನಿಕ ತಪಾಸಣೆ ಶಿಕ್ಷಣ. ಪರಿಶೀಲನೆ 24 ಅಕ್ಟೋಬರ್ 2026.' })}</p>
          </article>
        ))}
      </div>
      <form className="glass mt-6 p-5" onSubmit={(event) => {
        event.preventDefault()
        if (question.trim().length < 8) {
          notify(t(lang, { en: 'Write a question of at least 8 characters.', kn: 'ಕನಿಷ್ಠ 8 ಅಕ್ಷರದ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ.' }), 'warn')
          return
        }
        void addSymptom({ module: 'general', symptoms: ['screening-question'], severity: 0, notes: question.trim() })
        setQuestion('')
      }}>
        <h2 className="text-2xl">{t(lang, { en: 'Save a question for a clinician', kn: 'ವೈದ್ಯರಿಗೆ ಪ್ರಶ್ನೆ ಉಳಿಸಿ' })}</h2>
        <textarea className="area mt-3" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={400} />
        <button className="btn primary mt-3" type="submit">{t(lang, { en: 'Save question', kn: 'ಪ್ರಶ್ನೆ ಉಳಿಸಿ' })}</button>
      </form>
    </div>
  )
}
