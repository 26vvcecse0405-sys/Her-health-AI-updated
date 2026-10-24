import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageIntro } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { formatWhen } from '../lib/format'

export function OfflineCare() {
  const { snapshot, offline, syncNow, notify, setSimulatedOffline } = useHealth()
  const [query, setQuery] = useState('')
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const rows = snapshot.hospitals.filter((hospital) => `${hospital.name} ${hospital.area} ${hospital.specialties.join(' ')} ${hospital.services.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="grid gap-5">
      <PageIntro kicker={t(lang, { en: 'Offline directory', kn: 'ಆಫ್‌ಲೈನ್ ಡೈರೆಕ್ಟರಿ' })} title={t(lang, { en: 'Cached care, clearly stale when it must be', kn: 'ಉಳಿಸಿದ ಆರೈಕೆ, ಹಳೆಯದಾದಾಗ ಸ್ಪಷ್ಟವಾಗಿ' })} lede={t(lang, { en: 'Search hospitals saved on this device. Phone numbers here are fictional. Beds, doctors, and traffic cannot be refreshed while you are offline.', kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ. ಇಲ್ಲಿನ ಫೋನ್ ಸಂಖ್ಯೆಗಳು ಕಾಲ್ಪನಿಕ. ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಹಾಸಿಗೆ, ವೈದ್ಯರು ಮತ್ತು ಸಂಚಾರವನ್ನು ನವೀಕರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.' })} />
      {offline ? <p className="banner sim">{t(lang, { en: 'You are in browser-offline or simulated-offline mode. The rows below are the last saved demo copy.', kn: 'ನೀವು ಬ್ರೌಸರ್ ಆಫ್‌ಲೈನ್ ಅಥವಾ ಅನುಕರಣೆ ಸ್ಥಿತಿಯಲ್ಲಿದ್ದೀರಿ. ಕೆಳಗಿನ ಸಾಲುಗಳು ಕೊನೆಯದಾಗಿ ಉಳಿಸಿದ ಮಾದರಿ ಪ್ರತಿ.' })}</p> : <p className="banner offline">{t(lang, { en: 'The browser is online. These rows are the fictional cache, including after a local sync. They are not a live hospital feed.', kn: 'ಬ್ರೌಸರ್ ಆನ್‌ಲೈನ್ ಇದೆ. ಸ್ಥಳೀಯ ಸಿಂಕ್ ನಂತರವೂ ಈ ಸಾಲುಗಳು ಕಾಲ್ಪನಿಕ ಸಂಗ್ರಹ. ಇದು ನೇರ ಆಸ್ಪತ್ರೆ ಫೀಡ್ ಅಲ್ಲ.' })}</p>}
      <p className="text-sm text-muted">
        {t(lang, { en: 'Last successful local sync', kn: 'ಕೊನೆಯ ಯಶಸ್ವಿ ಸ್ಥಳೀಯ ಸಿಂಕ್' })}: {snapshot.meta.lastSync ? formatWhen(snapshot.meta.lastSync, lang) : t(lang, { en: 'none', kn: 'ಇಲ್ಲ' })}
        {' · '}
        {t(lang, { en: 'Hospital cache', kn: 'ಆಸ್ಪತ್ರೆ ಸಂಗ್ರಹ' })}: {snapshot.meta.hospitalsCachedAt ? formatWhen(snapshot.meta.hospitalsCachedAt, lang) : t(lang, { en: 'none', kn: 'ಇಲ್ಲ' })}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn ghost" aria-pressed={snapshot.meta.simulatedOffline} onClick={() => void setSimulatedOffline(!snapshot.meta.simulatedOffline)}>
          {snapshot.meta.simulatedOffline ? t(lang, { en: 'Restore simulated connection', kn: 'ಅನುಕರಿಸಿದ ಸಂಪರ್ಕ ಮರಳಿಸಿ' }) : t(lang, { en: 'Simulate rural offline', kn: 'ಗ್ರಾಮೀಣ ಆಫ್‌ಲೈನ್ ಅನುಕರಿಸಿ' })}
        </button>
        <button type="button" className="btn primary" onClick={() => void syncNow().then((result) => notify(result.message, result.ok ? 'good' : 'warn'))}>
          {t(lang, { en: 'Retry local sync', kn: 'ಸ್ಥಳೀಯ ಸಿಂಕ್ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' })}
        </button>
      </div>
      <input className="field max-w-lg" value={query} placeholder={t(lang, { en: 'Search cached hospitals', kn: 'ಉಳಿಸಿದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ' })} onChange={(event) => setQuery(event.target.value)} />
      {rows.length === 0 ? <p className="text-muted">{t(lang, { en: 'No cached hospital matches.', kn: 'ಉಳಿಸಿದ ಆಸ್ಪತ್ರೆ ಹೊಂದಿಕೆಯಾಗಲಿಲ್ಲ.' })}</p> : rows.map((hospital) => {
        const route = hospital.routes[snapshot.profile.locationId][0]
        return (
          <article key={hospital.id} className="glass p-4">
            <h2 className="text-xl">{hospital.name}</h2>
            <p className="text-muted">{hospital.area}</p>
            <p className="mt-2">{t(lang, { en: 'Demo phone', kn: 'ಮಾದರಿ ಫೋನ್' })}: {hospital.phone}</p>
            <p>{hospital.specialties.join(', ')} · {hospital.services.join(', ')}</p>
            <p className="text-sm text-warn">{t(lang, { en: `Last known beds: ${hospital.bedsAvailable === null ? 'not in record' : hospital.bedsAvailable}. Last known doctors: ${hospital.doctors === null ? 'not verified' : 'see demo names'}. Dataset travel time before a new traffic check: about ${route?.baseMin ?? '—'} min. These may be outdated.`, kn: `ಕೊನೆಯ ತಿಳಿದ ಹಾಸಿಗೆ: ${hospital.bedsAvailable === null ? 'ದಾಖಲೆಯಲ್ಲಿ ಇಲ್ಲ' : hospital.bedsAvailable}. ಕೊನೆಯ ತಿಳಿದ ವೈದ್ಯರು: ${hospital.doctors === null ? 'ಖಚಿತಪಡಿಸಿಲ್ಲ' : 'ಮಾದರಿ ಹೆಸರುಗಳು ಇವೆ'}. ಹೊಸ ಸಂಚಾರ ಪರಿಶೀಲನೆಗೆ ಮೊದಲ ಪ್ರಯಾಣ ಸಮಯ ಸುಮಾರು ${route?.baseMin ?? '—'} ನಿಮಿಷ. ಇವು ಹಳೆಯದಾಗಿರಬಹುದು.` })}</p>
          </article>
        )
      })}
      <section className="glass p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Queued changes', kn: 'ಸರದಿಯ ಬದಲಾವಣೆಗಳು' })}</h2>
        {snapshot.outbox.length === 0 ? <p className="mt-2 text-muted">{t(lang, { en: 'Nothing is waiting.', kn: 'ಏನೂ ಕಾಯುತ್ತಿಲ್ಲ.' })}</p> : snapshot.outbox.map((item) => <p key={item.id} className="mt-2">{formatWhen(item.createdAt, lang)} · {item.label.replaceAll('aura-note', 'SAKHI note')}</p>)}
      </section>
      <section className="glass p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Education saved on this device', kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಶಿಕ್ಷಣ' })}</h2>
        <ul className="mt-3 grid gap-3">
          {snapshot.articles.map((article) => (
            <li key={article.id}>
              <Link className="font-semibold text-teal" to={article.href}>{t(lang, article.title)}</Link>
              <p className="text-sm leading-6 text-muted">{t(lang, article.body)}</p>
              <p className="text-xs text-muted">{article.source} · {article.reviewed}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
