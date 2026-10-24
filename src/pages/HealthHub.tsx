import { Link } from 'react-router-dom'
import { hubCards } from '../data/catalog'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { PageIntro, SafetyNote } from '../components/ui'

export function HealthHub() {
  const { snapshot } = useHealth()
  if (!snapshot) return null
  const lang = snapshot.profile.language
  return (
    <div>
      <PageIntro
        kicker="SAKHI"
        title={t(lang, { en: 'Women’s health hub', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ಕೇಂದ್ರ' })}
        lede={t(lang, { en: 'Each card opens a working journal or lesson. None of them can diagnose a condition from symptoms or a photo.', kn: 'ಪ್ರತಿ ಕಾರ್ಡ್ ಕೆಲಸ ಮಾಡುವ ದಿನಚರಿ ಅಥವಾ ಪಾಠವನ್ನು ತೆರೆಯುತ್ತದೆ. ಲಕ್ಷಣ ಅಥವಾ ಫೋಟೋದಿಂದ ಯಾವುದೂ ರೋಗ ನಿರ್ಣಯ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.' })}
      />
      <SafetyNote lang={lang} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hubCards.map((card) => (
          <Link key={card.href} to={card.href} className="glass card-link">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lavender">{card.kicker}</p>
            <h2 className="mt-2 text-2xl">{t(lang, card.title)}</h2>
            <p className="mt-2 leading-7 text-muted">{t(lang, card.body)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
