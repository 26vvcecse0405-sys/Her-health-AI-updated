import { Link } from 'react-router-dom'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'

const demos = [
  {
    href: '/medicines',
    title: { en: 'Demo A — CareLens', kn: 'ಪ್ರದರ್ಶನ A — CareLens' },
    body: { en: 'Open the fictional prescription and package, compare 500 mg with 650 mg, and stop for pharmacist confirmation.', kn: 'ಕಾಲ್ಪನಿಕ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಪ್ಯಾಕೇಜ್ ತೆರೆಯಿರಿ, 500 ಮಿಗ್ರಾಂ ಮತ್ತು 650 ಮಿಗ್ರಾಂ ಹೋಲಿಸಿ, ಔಷಧಿಕಾರರ ಖಚಿತತೆಗೆ ನಿಲ್ಲಿಸಿ.' },
  },
  {
    href: '/assistant',
    title: { en: 'Demo B — Symptom conversation', kn: 'ಪ್ರದರ್ಶನ B — ಲಕ್ಷಣ ಸಂಭಾಷಣೆ' },
    body: { en: 'Tell SAKHI you have been feeling tired. Answer one question at a time, then choose whether to save the summary.', kn: 'ನೀವು ಆಯಾಸದಿಂದಿದ್ದೀರಿ ಎಂದು SAKHIಗೆ ಹೇಳಿ. ಒಂದೊಂದೇ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿ, ನಂತರ ಸಾರಾಂಶ ಉಳಿಸಬೇಕೇ ಎಂದು ಆಯ್ಕೆಮಾಡಿ.', hi: 'SAKHI को बताएँ कि थकान हो रही है। एक-एक सवाल का जवाब दें, फिर सार सहेजना है या नहीं चुनें।' },
  },
  {
    href: '/hospitals?need=pregnancy',
    title: { en: 'Demo C — Hospital match', kn: 'ಪ್ರದರ್ಶನ C — ಆಸ್ಪತ್ರೆ ಹೊಂದಾಣಿಕೆ' },
    body: { en: 'Compare fictional hospitals by service, simulated travel, beds, and doctors. Open Why this match. These are not real hospitals.', kn: 'ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಸೇವೆ, ಅನುಕರಿಸಿದ ಪ್ರಯಾಣ, ಹಾಸಿಗೆ ಮತ್ತು ವೈದ್ಯರಿಂದ ಹೋಲಿಸಿ. ಏಕೆ ಈ ಹೊಂದಾಣಿಕೆ ತೆರೆಯಿರಿ. ಇವು ನಿಜವಾದ ಆಸ್ಪತ್ರೆಗಳಲ್ಲ.' },
  },
  {
    href: '/reminders',
    title: { en: 'Demo D — Medicine reminder', kn: 'ಪ್ರದರ್ಶನ D — ಔಷಧಿ ಜ್ಞಾಪನೆ' },
    body: { en: 'Use the sample folic acid reminder, simulate that it is due, and mark it taken. The message confirms the log. It does not change a dose.', kn: 'ಮಾದರಿ ಫೋಲಿಕ್ ಆಮ್ಲ ಜ್ಞಾಪನೆ ಬಳಸಿ, ಅದು ಬಾಕಿ ಎಂದು ಅನುಕರಿಸಿ, ತೆಗೆದುಕೊಂಡೆ ಎಂದು ಗುರುತಿಸಿ. ಸಂದೇಶ ದಾಖಲೆ ಖಚಿತಪಡಿಸುತ್ತದೆ. ಡೋಸ್ ಬದಲಾಯಿಸುವುದಿಲ್ಲ.' },
  },
]

export function Demo() {
  const { snapshot } = useHealth()
  if (!snapshot) return null
  const lang = snapshot.profile.language
  return (
    <div className="grid gap-5">
      <PageIntro kicker={t(lang, { en: 'Guided demo', kn: 'ಮಾರ್ಗದರ್ಶಿ ಪ್ರದರ್ಶನ' })} title={t(lang, { en: 'Four scenes, fictional data', kn: 'ನಾಲ್ಕು ದೃಶ್ಯಗಳು, ಕಾಲ್ಪನಿಕ ಡೇಟಾ' })} lede={t(lang, { en: 'Nothing here asks for a real medical history. Each scene opens a working page.', kn: 'ಇಲ್ಲಿ ನಿಜವಾದ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ ಕೇಳುವುದಿಲ್ಲ. ಪ್ರತಿ ದೃಶ್ಯ ಕೆಲಸ ಮಾಡುವ ಪುಟವನ್ನು ತೆರೆಯುತ್ತದೆ.' })} />
      <SafetyNote lang={lang} />
      <ol className="grid gap-4">
        {demos.map((demo, index) => (
          <li key={demo.href} className="glass p-5">
            <p className="text-sm text-teal">{index + 1}</p>
            <h2 className="text-2xl">{t(lang, demo.title)}</h2>
            <p className="mt-2 leading-7 text-muted">{t(lang, demo.body)}</p>
            <Link className="btn primary mt-4" to={demo.href}>{t(lang, { en: 'Open this scene', kn: 'ಈ ದೃಶ್ಯ ತೆರೆಯಿರಿ' })}</Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
