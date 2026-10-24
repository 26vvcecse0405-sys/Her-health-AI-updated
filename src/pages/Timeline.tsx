import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { formatWhen, showSymptoms } from '../lib/format'
import type { ModuleId } from '../types'

export function Timeline() {
  const { snapshot } = useHealth()
  const [module, setModule] = useState<'all' | ModuleId>('all')
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const entries = snapshot.symptoms.filter((entry) => (module === 'all' || entry.module === module) && `${entry.notes} ${showSymptoms(entry.symptoms)}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <div>
      <PageIntro kicker={t(lang, { en: 'Timeline', kn: 'ಕಾಲರೇಖೆ' })} title={t(lang, { en: 'Everything you chose to save', kn: 'ನೀವು ಉಳಿಸಲು ಆಯ್ಕೆಮಾಡಿದ್ದೆಲ್ಲ' })} lede={t(lang, { en: 'Filter notes, then send only the selected ones toward a Care Passport.', kn: 'ಟಿಪ್ಪಣಿಗಳನ್ನು ಶೋಧಿಸಿ, ಆಯ್ಕೆಮಾಡಿದವುಗಳನ್ನು ಮಾತ್ರ ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಕಡೆಗೆ ಕಳುಹಿಸಿ.' })} />
      <SafetyNote lang={lang} />
      <div className="mb-4 flex flex-wrap gap-2">
        <select className="field w-auto" value={module} onChange={(event) => setModule(event.target.value as 'all' | ModuleId)}>
          {['all', 'mama', 'iron', 'endo', 'meno', 'skin', 'wellness', 'nutrition'].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <input className="field max-w-xs" value={query} placeholder={t(lang, { en: 'Search notes', kn: 'ಟಿಪ್ಪಣಿ ಹುಡುಕಿ' })} onChange={(event) => setQuery(event.target.value)} />
      </div>
      {entries.length === 0 ? <p className="text-muted">{t(lang, { en: 'No notes match.', kn: 'ಯಾವ ಟಿಪ್ಪಣಿಯೂ ಹೊಂದಿಲ್ಲ.' })}</p> : (
        <ul className="grid gap-3">
          {entries.map((entry) => (
            <li key={entry.id} className="glass p-4">
              <label className="flex gap-3">
                <input type="checkbox" checked={picked.includes(entry.id)} onChange={() => setPicked((current) => current.includes(entry.id) ? current.filter((id) => id !== entry.id) : [...current, entry.id])} />
                <span>
                  <strong>{formatWhen(entry.createdAt, lang)}</strong> · {entry.module} · {entry.severity}/10
                  {entry.sample ? ` · ${t(lang, { en: 'sample', kn: 'ಮಾದರಿ' })}` : ''}
                  <span className="mt-1 block text-muted">{entry.notes}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
      <Link className="btn primary mt-4" to="/passport" onClick={() => sessionStorage.setItem('herhealth-passport-ids', JSON.stringify(picked))}>
        {t(lang, { en: `Use ${picked.length} selected notes in Care Passport`, kn: `ಆಯ್ಕೆಮಾಡಿದ ${picked.length} ಟಿಪ್ಪಣಿಗಳನ್ನು ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್‌ನಲ್ಲಿ ಬಳಸಿ` })}
      </Link>
    </div>
  )
}
