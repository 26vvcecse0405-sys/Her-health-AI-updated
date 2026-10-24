import { Link } from 'react-router-dom'
import { t } from '../i18n'
import type { Lang } from '../types'
import { useHealth } from '../context/HealthContext'

export function CareBridge({ lang, text, need, urgent }: { lang: Lang; text: string; need: string; urgent: boolean }) {
  const { notify } = useHealth()
  return (
    <section className="glass mt-6 p-5">
      <h2 className="text-2xl">{t(lang, { en: 'Health-to-care bridge', kn: 'ಆರೋಗ್ಯದಿಂದ ಆರೈಕೆಗೆ ಸೇತು' })}</h2>
      <p className="mt-2 text-muted">
        {t(lang, {
          en: 'This is a neutral summary of what was recorded. It is not a diagnosis and it does not choose a treatment.',
          kn: 'ಇದು ದಾಖಲಿಸಿದ್ದರ ನಿರಪೇಕ್ಷ ಸಾರಾಂಶ. ಇದು ರೋಗ ನಿರ್ಣಯವಲ್ಲ ಮತ್ತು ಚಿಕಿತ್ಸೆಯನ್ನು ಆಯ್ಕೆಮಾಡುವುದಿಲ್ಲ.',
        })}
      </p>
      <pre className="paper mt-4 whitespace-pre-wrap font-sans text-sm">{text}</pre>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn ghost" onClick={() => void navigator.clipboard.writeText(text).then(() => notify(t(lang, { en: 'Summary copied.', kn: 'ಸಾರಾಂಶ ನಕಲಾಗಿದೆ.' })))}>
          {t(lang, { en: 'Copy summary', kn: 'ಸಾರಾಂಶ ನಕಲಿಸಿ' })}
        </button>
        <Link className="btn primary" to={`/hospitals?need=${need}${urgent ? '&urgent=1' : ''}`}>
          {t(lang, { en: 'Find fictional nearby care', kn: 'ಕಾಲ್ಪನಿಕ ಹತ್ತಿರದ ಆರೈಕೆ ಹುಡುಕಿ' })}
        </Link>
        <Link className="btn ghost" to="/passport">{t(lang, { en: 'Review in Care Passport', kn: 'ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್‌ನಲ್ಲಿ ನೋಡಿ' })}</Link>
      </div>
    </section>
  )
}
