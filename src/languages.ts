import type { Lang } from './types'

export const languages: { id: Lang; native: string; english: string; locale: string; dir: 'ltr' | 'rtl' }[] = [
  { id: 'en', native: 'English', english: 'English', locale: 'en-IN', dir: 'ltr' },
  { id: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', locale: 'kn-IN', dir: 'ltr' },
  { id: 'hi', native: 'हिन्दी', english: 'Hindi', locale: 'hi-IN', dir: 'ltr' },
  { id: 'gu', native: 'ગુજરાતી', english: 'Gujarati', locale: 'gu-IN', dir: 'ltr' },
  { id: 'mr', native: 'मराठी', english: 'Marathi', locale: 'mr-IN', dir: 'ltr' },
  { id: 'ta', native: 'தமிழ்', english: 'Tamil', locale: 'ta-IN', dir: 'ltr' },
  { id: 'te', native: 'తెలుగు', english: 'Telugu', locale: 'te-IN', dir: 'ltr' },
  { id: 'bn', native: 'বাংলা', english: 'Bengali', locale: 'bn-IN', dir: 'ltr' },
  { id: 'ml', native: 'മലയാളം', english: 'Malayalam', locale: 'ml-IN', dir: 'ltr' },
  { id: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', locale: 'pa-IN', dir: 'ltr' },
  { id: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia', locale: 'or-IN', dir: 'ltr' },
  { id: 'ur', native: 'اردو', english: 'Urdu', locale: 'ur-IN', dir: 'rtl' },
]

export function isLang(value: string): value is Lang {
  return languages.some((item) => item.id === value)
}

export function languageMeta(lang: Lang) {
  return languages.find((item) => item.id === lang) ?? languages[0]!
}
