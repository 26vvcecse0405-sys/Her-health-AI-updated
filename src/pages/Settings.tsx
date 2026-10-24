import { Link } from 'react-router-dom'
import { PageIntro } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { interests as interestOptions } from '../data/catalog'
import { origins } from '../data/hospitals'
import { chrome, t } from '../i18n'
import { isLang, languages } from '../languages'
import type { LifeStage } from '../types'

const stages: LifeStage[] = ['unspecified', 'adolescence', 'reproductive', 'pregnancy', 'postpartum', 'perimenopause', 'menopause']

export function Settings() {
  const health = useHealth()
  const { snapshot } = health
  if (!snapshot) return null
  const lang = snapshot.profile.language
  return (
    <div className="grid gap-5">
      <PageIntro kicker={t(lang, { en: 'Settings', kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು' })} title={t(lang, { en: 'Language and preferences', kn: 'ಭಾಷೆ ಮತ್ತು ಆದ್ಯತೆಗಳು' })} lede={t(lang, { en: 'English is the language until you choose another one here or in the header. The app does not follow the browser, device, or location.', kn: 'ನೀವು ಇಲ್ಲಿ ಅಥವಾ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಬೇರೆ ಭಾಷೆ ಆಯ್ಕೆಮಾಡುವವರೆಗೆ English ಇರುತ್ತದೆ. ಅಪ್ಲಿಕೇಶನ್ ಬ್ರೌಸರ್, ಸಾಧನ, ಅಥವಾ ಸ್ಥಳವನ್ನು ಅನುಸರಿಸುವುದಿಲ್ಲ.', hi: 'जब तक आप यहाँ या हेडर में दूसरी भाषा नहीं चुनते, अंग्रेज़ी रहती है। ऐप ब्राउज़र, डिवाइस, या स्थान का अनुसरण नहीं करता।' })} />
      <section className="light-panel grid gap-4">
        <label className="grid gap-1 text-sm font-semibold">
          {t(lang, chrome.language)}
          <select className="field max-w-md" value={lang} onChange={(event) => { if (isLang(event.target.value)) void health.setLanguage(event.target.value) }}>
            {languages.map((item) => <option key={item.id} value={item.id}>{item.native} — {item.english}</option>)}
          </select>
        </label>
        <p className="text-sm leading-6">{t(lang, chrome.demoDraft)}</p>
        <label className="grid gap-1 text-sm font-semibold">
          {t(lang, { en: 'Life stage for education', kn: 'ಶಿಕ್ಷಣಕ್ಕೆ ಜೀವನ ಹಂತ' })}
          <select className="field max-w-xs" value={snapshot.profile.lifeStage} onChange={(event) => void health.setLifeStage(event.target.value as LifeStage)}>
            {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
          </select>
        </label>
        <div>
          <p className="text-sm font-semibold">{t(lang, { en: 'Sample place', kn: 'ಮಾದರಿ ಸ್ಥಳ' })}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {origins.map((origin) => (
              <button key={origin.id} type="button" className="chip" aria-pressed={snapshot.profile.locationId === origin.id} onClick={() => void health.setLocation(origin.id)}>{t(lang, { en: origin.label, kn: origin.kn })}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">{t(lang, { en: 'Topics to emphasise', kn: 'ಒತ್ತು ನೀಡಬೇಕಾದ ವಿಷಯಗಳು' })}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {interestOptions.map((item) => {
              const on = snapshot.profile.interests.includes(item.id)
              return (
                <button key={item.id} type="button" className="chip" aria-pressed={on} onClick={() => {
                  const next = on ? snapshot.profile.interests.filter((id) => id !== item.id) : [...snapshot.profile.interests, item.id]
                  void health.setInterests(next)
                }}>{t(lang, item.label)}</button>
              )
            })}
          </div>
        </div>
        <Link className="btn ghost w-fit" to="/privacy">{t(lang, { en: 'Open privacy and deletion controls', kn: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಅಳಿಸುವ ನಿಯಂತ್ರಣ ತೆರೆಯಿರಿ' })}</Link>
      </section>
    </div>
  )
}
