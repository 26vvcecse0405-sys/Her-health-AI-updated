import type { Lang } from '../types'
import { bodyAreas } from '../data/catalog'
import { t } from '../i18n'

export function BodyMap({ lang, value, onChange }: { lang: Lang; value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[180px_1fr] sm:items-center">
      <svg viewBox="0 0 120 220" className="mx-auto w-36" aria-hidden="true">
        <circle cx="60" cy="28" r="16" fill={value === 'head' ? '#5eead4' : '#1c2944'} stroke="#5eead4" />
        <rect x="38" y="50" width="44" height="36" rx="10" fill={value === 'chest' ? '#5eead4' : '#1c2944'} stroke="#7dd3fc" />
        <rect x="40" y="90" width="40" height="28" rx="8" fill={value === 'abdomen' ? '#5eead4' : '#1c2944'} stroke="#7dd3fc" />
        <rect x="42" y="122" width="36" height="26" rx="8" fill={value === 'pelvis' ? '#d8b4fe' : '#1c2944'} stroke="#d8b4fe" />
        <rect x="28" y="156" width="22" height="48" rx="8" fill={value === 'legs' ? '#5eead4' : '#1c2944'} stroke="#5eead4" />
        <rect x="70" y="156" width="22" height="48" rx="8" fill={value === 'legs' ? '#5eead4' : '#1c2944'} stroke="#5eead4" />
        <circle cx="30" cy="78" r="7" fill={value === 'joints' ? '#fcd34d' : '#1c2944'} stroke="#fcd34d" />
        <circle cx="90" cy="78" r="7" fill={value === 'joints' ? '#fcd34d' : '#1c2944'} stroke="#fcd34d" />
      </svg>
      <div className="flex flex-wrap gap-2">
        {bodyAreas.map((area) => (
          <button key={area.id} type="button" className="chip" aria-pressed={value === area.id} onClick={() => onChange(area.id)}>
            {t(lang, area.label)}
          </button>
        ))}
      </div>
    </div>
  )
}
