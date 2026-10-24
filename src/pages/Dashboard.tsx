import { Link } from 'react-router-dom'
import { Hospital, MessageCircle, ScanLine, Stethoscope } from 'lucide-react'
import { TrendChart } from '../components/Charts'
import { useHealth } from '../context/HealthContext'
import { ARTICLES } from '../data/catalog'
import { origins } from '../data/hospitals'
import { SakhiMark } from '../components/SakhiMark'
import { chrome, t } from '../i18n'
import { sakhiWelcome } from '../i18n/sakhi'
import { formatWhen, showSymptoms } from '../lib/format'
import { concernFor, rankHospitals } from '../services/rank'
import type { Lang } from '../types'

const steps = [
  { href: '/', en: 'Open this dashboard and choose a language. English stays until you choose.', kn: 'ಈ ಮುಖಪುಟವನ್ನು ತೆರೆಯಿರಿ. ನೀವು ಆಯ್ಕೆಮಾಡುವವರೆಗೆ English ಇರುತ್ತದೆ.' },
  { href: '/health/mama', en: 'Open MamaSignal or IronWise and save a fictional symptom.', kn: 'MamaSignal ಅಥವಾ IronWise ತೆರೆದು ಕಾಲ್ಪನಿಕ ಲಕ್ಷಣವನ್ನು ಉಳಿಸಿ.' },
  { href: '/scan', en: 'Load the sample lab text or read a generated image.', kn: 'ಮಾದರಿ ಪ್ರಯೋಗಾಲಯ ಪಠ್ಯವನ್ನು ತೆರೆಯಿರಿ ಅಥವಾ ರಚಿಸಿದ ಚಿತ್ರವನ್ನು ಓದಿ.' },
  { href: '/assistant', en: 'Ask SAKHI to explain a word, then try a dose question it must refuse.', kn: 'SAKHIಗೆ ಒಂದು ಪದ ವಿವರಿಸಲು ಕೇಳಿ, ನಂತರ ಅದು ನಿರಾಕರಿಸಬೇಕಾದ ಡೋಸ್ ಪ್ರಶ್ನೆ ಕೇಳಿ.' },
  { href: '/offline', en: 'Turn on simulated offline, ask a saved FAQ, and search cached hospitals.', kn: 'ಆಫ್‌ಲೈನ್ ಅನುಕರಣೆ ಆನ್ ಮಾಡಿ, ಉಳಿಸಿದ ಪ್ರಶ್ನೆ ಕೇಳಿ, ಉಳಿಸಿದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ.' },
  { href: '/hospitals?need=pregnancy', en: 'Restore the connection, compare hospitals, and open Why this match.', kn: 'ಸಂಪರ್ಕ ಮರಳಿಸಿ, ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹೋಲಿಸಿ, ಏಕೆ ಈ ಹೊಂದಾಣಿಕೆ ಎಂದು ತೆರೆಯಿರಿ.' },
  { href: '/passport', en: 'Preview a Care Passport and export only after you review it.', kn: 'ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್ ನೋಡಿ. ಪರಿಶೀಲಿಸಿದ ನಂತರ ಮಾತ್ರ ರಫ್ತು ಮಾಡಿ.' },
]

export function Dashboard() {
  const { snapshot } = useHealth()
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const origin = origins.find((item) => item.id === snapshot.profile.locationId) ?? origins[0]!
  const ranked = rankHospitals(snapshot.profile.locationId, 'heavy', concernFor('pregnancy', false), snapshot.hospitals)
  const top = ranked[0]
  const recent = snapshot.symptoms.slice(0, 4)
  return (
    <div className="grid gap-6">
      <header className="glass p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">SAKHI AI</p>
        <h1 className="mt-2 text-4xl sm:text-6xl">{t(lang, { en: `Welcome, ${snapshot.profile.displayName}`, kn: `ಸ್ವಾಗತ, ${snapshot.profile.displayName}`, hi: `स्वागत है, ${snapshot.profile.displayName}`, ur: `خوش آمدید، ${snapshot.profile.displayName}` })}</h1>
        <div className="sakhi-hello mt-4">
          <SakhiMark />
          <p className="leading-7">{t(lang, sakhiWelcome)}</p>
        </div>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-muted">{t(lang, chrome.tagline)}</p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-warn">{t(lang, chrome.sample)}</p>
        <Link className="btn primary mt-5" to="/demo">{t(lang, { en: 'Start demo', kn: 'ಪ್ರದರ್ಶನ ಶುರು' })}</Link>
      </header>
      <div className="light-panel grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { href: '/scan', icon: ScanLine, label: { en: 'Scan report', kn: 'ವರದಿ ಸ್ಕ್ಯಾನ್' } },
          { href: '/health/mama', icon: Stethoscope, label: { en: 'Log symptoms', kn: 'ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸಿ' } },
          { href: '/assistant', icon: MessageCircle, label: chrome.ask },
          { href: '/hospitals?need=pregnancy', icon: Hospital, label: { en: 'Find hospital', kn: 'ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ' } },
        ].map((action) => (
          <Link key={action.href} to={action.href} className="glass card-link flex items-center gap-3">
            <action.icon aria-hidden="true" />
            <span className="text-lg font-semibold">{t(lang, action.label)}</span>
          </Link>
        ))}
      </div>
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="glass p-5">
          <h2 className="text-2xl">{t(lang, { en: 'Women’s health overview', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ನೋಟ' })}</h2>
          <p className="mt-2 text-muted">{t(lang, { en: 'Life stage on this sample profile: pregnancy. Counts below are saved notes, not a diagnosis.', kn: 'ಈ ಮಾದರಿ ಪ್ರೊಫೈಲ್‌ನ ಜೀವನ ಹಂತ: ಗರ್ಭಧಾರಣೆ. ಕೆಳಗಿನ ಎಣಿಕೆಗಳು ಉಳಿಸಿದ ಟಿಪ್ಪಣಿಗಳು, ರೋಗ ನಿರ್ಣಯವಲ್ಲ.' })}</p>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            {[
              ['notes', snapshot.symptoms.length, { en: 'Notes', kn: 'ಟಿಪ್ಪಣಿಗಳು' }],
              ['reports', snapshot.reports.length, { en: 'Reports', kn: 'ವರದಿಗಳು' }],
              ['queued', snapshot.outbox.length, { en: 'Queued', kn: 'ಸರದಿ' }],
            ].map(([key, value, label]) => (
              <div key={key as string} className="rounded-2xl border border-line p-3">
                <dt className="text-sm text-muted">{t(lang, label as { en: string; kn: string })}</dt>
                <dd className="text-3xl">{value as number}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <TrendChart entries={snapshot.symptoms} metric="severity" label={t(lang, { en: 'Severity of saved notes', kn: 'ಉಳಿಸಿದ ಟಿಪ್ಪಣಿಗಳ ತೀವ್ರತೆ' })} />
          </div>
        </article>
        <article className="glass p-5">
          <h2 className="text-2xl">{t(lang, { en: 'Nearby demo hospital', kn: 'ಹತ್ತಿರದ ಮಾದರಿ ಆಸ್ಪತ್ರೆ' })}</h2>
          {top ? (
            <>
              <p className="mt-3 text-xl">{top.hospital.name}</p>
              <p className="mt-1 text-sm text-muted">{t(lang, { en: origin.label, kn: origin.kn })} · {t(lang, { en: 'heavy simulated traffic', kn: 'ಭಾರೀ ಅನುಕರಿಸಿದ ಸಂಚಾರ' })}</p>
              <p className="mt-3">{t(lang, { en: `About ${top.etaMinutes} min · score ${top.score}`, kn: `ಸುಮಾರು ${top.etaMinutes} ನಿಮಿಷ · ಅಂಕ ${top.score}` })}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{top.reasons[0] ? t(lang, top.reasons[0]) : null}</p>
              <Link className="btn ghost mt-4" to="/hospitals?need=pregnancy">{t(lang, { en: 'See why it ranked here', kn: 'ಇದು ಏಕೆ ಮೇಲಿದೆ ನೋಡಿ' })}</Link>
            </>
          ) : null}
        </article>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="glass p-5">
          <h2 className="text-2xl">{t(lang, { en: 'Recent symptom timeline', kn: 'ಇತ್ತೀಚಿನ ಲಕ್ಷಣ ಕಾಲರೇಖೆ' })}</h2>
          <div className="timeline mt-4">
            {recent.map((entry) => (
              <article key={entry.id} className="pl-8">
                <p className="text-sm text-muted">{formatWhen(entry.createdAt, lang)} · {entry.sample ? t(lang, { en: 'sample', kn: 'ಮಾದರಿ' }) : t(lang, { en: 'saved', kn: 'ಉಳಿಸಿದ' })}</p>
                <h3 className="text-lg">{showSymptoms(entry.symptoms) || entry.module}</h3>
                <p className="text-muted">{entry.notes}</p>
              </article>
            ))}
          </div>
        </article>
        <article className="glass p-5">
          <h2 className="text-2xl">{t(lang, { en: 'Medicine reminders', kn: 'ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು' })}</h2>
          <ul className="mt-3 grid gap-2">
            {snapshot.doses.length === 0 ? <li className="text-muted">{t(lang, { en: 'No medicine reminders yet.', kn: 'ಇನ್ನೂ ಔಷಧಿ ಜ್ಞಾಪನೆ ಇಲ್ಲ.' })}</li> : snapshot.doses.slice(0, 3).map((dose) => (
              <li key={dose.id}><Link className="text-teal" to="/reminders">{dose.name} · {dose.time}{dose.sample ? ` · ${t(lang, { en: 'sample', kn: 'ಮಾದರಿ' })}` : ''}</Link></li>
            ))}
          </ul>
          <h2 className="mt-6 text-2xl">{t(lang, { en: 'Reminders', kn: 'ಜ್ಞಾಪನೆಗಳು' })}</h2>
          <ul className="mt-3 grid gap-3">
            {snapshot.reminders.map((reminder) => (
              <li key={reminder.id} className="flex items-start justify-between gap-3">
                <Link to={reminder.href} className={reminder.done ? 'text-muted line-through' : ''}>{t(lang, reminder.title)}</Link>
                <ReminderButton id={reminder.id} done={reminder.done} lang={lang} />
              </li>
            ))}
          </ul>
          <h2 className="mt-6 text-2xl">{t(lang, { en: 'Saved education', kn: 'ಉಳಿಸಿದ ಶಿಕ್ಷಣ' })}</h2>
          <ul className="mt-3 grid gap-2">
            {ARTICLES.slice(0, 3).map((article) => (
              <li key={article.id}><Link className="text-teal" to={article.href}>{t(lang, article.title)}</Link></li>
            ))}
          </ul>
        </article>
      </section>
      <section className="glass p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Privacy and sync', kn: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಸಿಂಕ್' })}</h2>
        <p className="mt-2 leading-7 text-muted">
          {t(lang, {
            en: `Notes stay in IndexedDB on this browser. Last local sync: ${snapshot.meta.lastSync ? formatWhen(snapshot.meta.lastSync, lang) : 'not yet'}. Online models are ${snapshot.profile.onlineModelConsent ? 'allowed' : 'off'}.`,
            kn: `ಟಿಪ್ಪಣಿಗಳು ಈ ಬ್ರೌಸರ್‌ನ IndexedDBಯಲ್ಲಿವೆ. ಕೊನೆಯ ಸ್ಥಳೀಯ ಸಿಂಕ್: ${snapshot.meta.lastSync ? formatWhen(snapshot.meta.lastSync, lang) : 'ಇನ್ನೂ ಇಲ್ಲ'}. ಆನ್‌ಲೈನ್ ಮಾದರಿಗಳು ${snapshot.profile.onlineModelConsent ? 'ಅನುಮತಿಸಿದೆ' : 'ಆಫ್'}.`,
          })}
        </p>
        <Link className="btn ghost mt-4" to="/privacy">{t(lang, { en: 'Open privacy controls', kn: 'ಗೌಪ್ಯತೆ ನಿಯಂತ್ರಣ ತೆರೆಯಿರಿ' })}</Link>
      </section>
      <section className="glass p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Three-minute demo path', kn: 'ಮೂರು ನಿಮಿಷದ ಪ್ರದರ್ಶನ' })}</h2>
        <ol className="mt-3 grid gap-2">
          {steps.map((step, index) => (
            <li key={step.href}>
              <Link to={step.href}>{index + 1}. {t(lang, step)}</Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function ReminderButton({ id, done, lang }: { id: string; done: boolean; lang: Lang }) {
  const { toggleReminder } = useHealth()
  return (
    <button type="button" className="btn quiet" onClick={() => void toggleReminder(id)}>
      {done ? t(lang, { en: 'Reopen', kn: 'ಮತ್ತೆ ತೆರೆಯಿರಿ' }) : t(lang, { en: 'Done', kn: 'ಆಯಿತು' })}
    </button>
  )
}
