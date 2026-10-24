import { Link } from 'react-router-dom'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'

export function NotFound() {
  const { snapshot } = useHealth()
  const lang = snapshot?.profile.language ?? 'en'
  return (
    <div className="glass p-8">
      <h1 className="text-4xl">{t(lang, { en: 'That page is not in HerHealth.', kn: 'ಆ ಪುಟ HerHealthನಲ್ಲಿಲ್ಲ.' })}</h1>
      <Link className="btn primary mt-5" to="/">{t(lang, { en: 'Back to the dashboard', kn: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂದಿರುಗಿ' })}</Link>
    </div>
  )
}
