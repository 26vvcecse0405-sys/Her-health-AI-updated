import { languageMeta } from '../languages'
import type { Lang } from '../types'

export function formatWhen(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(languageMeta(lang).locale, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export function showSymptoms(ids: string[]) {
  return ids.map((id) => (id === 'aura-note' || id === 'sakhi-note' ? 'SAKHI note' : id)).join(', ')
}
