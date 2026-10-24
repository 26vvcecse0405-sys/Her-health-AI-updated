import { t } from '../i18n'
import { notSaved, saveAsk, savePattern, savedNote, tiredAsk, tiredNext, tiredSummary } from '../i18n/sakhi'
import type { Lang } from '../types'

export type TiredGuide = {
  topic: 'tired'
  step: 'duration' | 'associated' | 'review'
  answers: { duration?: string; associated?: string }
}

const tiredPattern = /\b(tired|fatigue|exhausted|weary|ಆಯಾಸ|थकान|थकवा|થાક|சோர்வு|అలసట|ক্লান্ত|ക്ഷീണം|ਥਕਾਵਟ|ଥକ୍କା|تھکاوٹ)\b/i

export function startTiredGuide(message: string): TiredGuide | null {
  if (!tiredPattern.test(message)) return null
  return { topic: 'tired', step: 'duration', answers: {} }
}

export function tiredQuestion(lang: Lang) {
  return t(lang, tiredAsk)
}

export function advanceTiredGuide(guide: TiredGuide, answer: string, lang: Lang): { guide: TiredGuide | null; text: string; summary?: string } {
  if (guide.step === 'duration') {
    return {
      guide: { ...guide, step: 'associated', answers: { duration: answer } },
      text: t(lang, tiredNext),
    }
  }
  if (guide.step === 'associated') {
    const duration = guide.answers.duration ?? ''
    const summary = tiredSummary(lang, duration, answer)
    return {
      guide: { ...guide, step: 'review', answers: { ...guide.answers, associated: answer } },
      summary,
      text: `${summary}\n\n${t(lang, saveAsk)}`,
    }
  }
  const save = savePattern.test(answer.trim())
  return {
    guide: null,
    summary: save ? tiredSummary(lang, guide.answers.duration ?? '', guide.answers.associated ?? '') : undefined,
    text: t(lang, save ? savedNote : notSaved),
  }
}
