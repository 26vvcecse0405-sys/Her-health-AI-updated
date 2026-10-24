import { useState } from 'react'
import { PageIntro } from '../components/ui'
import { glossary, resources } from '../data/library'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'

export function Library() {
  const { snapshot } = useHealth()
  const [query, setQuery] = useState('')
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const needle = query.trim().toLowerCase()
  const rows = resources.filter((item) => `${item.title.en} ${item.summary.en} ${item.category.en}`.toLowerCase().includes(needle))
  const words = glossary.filter((item) => item.term.toLowerCase().includes(needle) || item.meaning.en.toLowerCase().includes(needle))
  return (
    <div className="grid gap-5">
      <PageIntro kicker={t(lang, { en: 'Trusted library', kn: 'ನಂಬಲರ್ಹ ಗ್ರಂಥಾಲಯ' })} title={t(lang, { en: 'Sources you can open', kn: 'ನೀವು ತೆರೆಯಬಹುದಾದ ಮೂಲಗಳು' })} lede={t(lang, { en: 'Each card names a publisher and links to that publisher’s page. Dates are the day this demo was reviewed, not a claim that the page was rewritten then.', kn: 'ಪ್ರತಿ ಕಾರ್ಡ್ ಪ್ರಕಾಶಕರನ್ನು ಹೆಸರಿಸಿ ಅವರ ಪುಟಕ್ಕೆ ಕೊಂಡಿ ನೀಡುತ್ತದೆ. ದಿನಾಂಕಗಳು ಈ ಪ್ರದರ್ಶನವನ್ನು ನೋಡಿದ ದಿನ, ಆ ಪುಟವನ್ನು ಆಗ ಬರೆದರು ಎಂದಲ್ಲ.' })} />
      <input className="field max-w-lg" value={query} placeholder={t(lang, { en: 'Search topics or terms', kn: 'ವಿಷಯ ಅಥವಾ ಪದ ಹುಡುಕಿ' })} onChange={(event) => setQuery(event.target.value)} />
      <div className="grid gap-4">
        {rows.length === 0 ? <p className="text-muted">{t(lang, { en: 'No matching resource. Try “anaemia” or “screening”.', kn: 'ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ. “anaemia” ಅಥವಾ “screening” ಪ್ರಯತ್ನಿಸಿ.' })}</p> : rows.map((item) => (
          <article key={item.id} className="light-panel">
            <p className="text-sm font-semibold uppercase tracking-wide">{t(lang, item.category)}</p>
            <h2 className="mt-1 text-2xl">{t(lang, item.title)}</h2>
            <p className="mt-2 leading-7">{t(lang, item.summary)}</p>
            <p className="mt-2 text-sm">{item.publisher} · {t(lang, { en: 'Demo review', kn: 'ಪ್ರದರ್ಶನ ಪರಿಶೀಲನೆ' })} {item.reviewed}</p>
            <a className="mt-3 inline-block font-semibold underline" href={item.href} target="_blank" rel="noreferrer">{t(lang, { en: 'Open the original page', kn: 'ಮೂಲ ಪುಟ ತೆರೆಯಿರಿ' })}</a>
          </article>
        ))}
      </div>
      <section>
        <h2 className="text-2xl">{t(lang, { en: 'Glossary', kn: 'ಪದಕೋಶ' })}</h2>
        {words.length === 0 ? <p className="mt-2 text-muted">{t(lang, { en: 'No glossary match.', kn: 'ಪದಕೋಶದಲ್ಲಿ ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ.' })}</p> : words.map((item) => (
          <article key={item.term} className="glass mt-3 p-4">
            <h3 className="text-xl">{item.term}</h3>
            <p className="mt-1 leading-7">{t(lang, item.meaning)}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
