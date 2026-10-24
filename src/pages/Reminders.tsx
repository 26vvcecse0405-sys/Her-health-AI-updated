import { useState } from 'react'
import { PageIntro, SafetyNote, Suggest } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { formatWhen } from '../lib/format'
import type { DosePeriod } from '../types'

const periods: DosePeriod[] = ['morning', 'afternoon', 'evening', 'night']

export function Reminders() {
  const { snapshot, addDose, logDose, notify } = useHealth()
  const [name, setName] = useState('')
  const [time, setTime] = useState('08:00')
  const [period, setPeriod] = useState<DosePeriod>('morning')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [suggest, setSuggest] = useState(false)
  const [due, setDue] = useState(false)
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const taken = snapshot.doseLogs.filter((row) => row.status === 'taken').length
  const total = Math.max(snapshot.doses.length, 1)
  const progress = Math.min(100, Math.round((taken / total) * 100))

  async function notifyDemo() {
    if (!('Notification' in window)) {
      notify(t(lang, { en: 'This browser has no notification API. The in-app reminder below still works.', kn: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಅಧಿಸೂಚನೆ ಇಲ್ಲ. ಕೆಳಗಿನ ಜ್ಞಾಪನೆ ಇನ್ನೂ ಕೆಲಸ ಮಾಡುತ್ತದೆ.' }), 'warn')
      setDue(true)
      return
    }
    const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
    if (permission === 'granted') {
      new Notification('HerHealth AI', { body: 'Sample reminder: fictional folic acid tablet. This does not change a prescription.' })
    } else {
      notify(t(lang, { en: 'Notification permission was not granted. The reminder still appears in the page.', kn: 'ಅಧಿಸೂಚನೆ ಅನುಮತಿ ಸಿಗಲಿಲ್ಲ. ಜ್ಞಾಪನೆ ಪುಟದಲ್ಲೇ ಕಾಣಿಸುತ್ತದೆ.' }), 'warn')
    }
    setDue(true)
  }

  return (
    <div className="grid gap-5">
      <PageIntro kicker={t(lang, { en: 'Medicine reminders', kn: 'ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು' })} title={t(lang, { en: 'Day and night check-in', kn: 'ಹಗಲು ಮತ್ತು ರಾತ್ರಿ ಚೆಕ್-ಇನ್' })} lede={t(lang, { en: 'Copy the timing from a clinician’s instruction. A reminder tracks what you log. It does not change the dose, and it will not tell you to take an extra dose after a miss.', kn: 'ವೈದ್ಯರ ಸೂಚನೆಯ ಸಮಯವನ್ನು ನಕಲಿಸಿ. ಜ್ಞಾಪನೆ ನೀವು ದಾಖಲಿಸಿದ್ದನ್ನು ಇಡುತ್ತದೆ. ಅದು ಡೋಸ್ ಬದಲಾಯಿಸುವುದಿಲ್ಲ ಮತ್ತು ತಪ್ಪಿದ ನಂತರ ಹೆಚ್ಚುವರಿ ಡೋಸ್ ಹೇಳುವುದಿಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <section className="light-panel grid gap-4">
        <p className="text-sm">{t(lang, { en: 'Browser notifications work only after you allow them, and only while this page can run. Closing the laptop can delay them. The list below is the reliable record.', kn: 'ಬ್ರೌಸರ್ ಅಧಿಸೂಚನೆ ನೀವು ಅನುಮತಿಸಿದ ನಂತರ ಮತ್ತು ಈ ಪುಟ ಚಾಲನೆಯಲ್ಲಿರುವಾಗ ಮಾತ್ರ. ಲ್ಯಾಪ್‌ಟಾಪ್ ಮುಚ್ಚಿದರೆ ಅವು ತಡವಾಗಬಹುದು. ಕೆಳಗಿನ ಪಟ್ಟಿ ನಂಬಬಹುದಾದ ದಾಖಲೆ.' })}</p>
        <div>
          <p className="text-sm font-semibold">{t(lang, { en: 'Logged doses', kn: 'ದಾಖಲಿಸಿದ ಡೋಸ್‌ಗಳು' })} {progress}%</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full bg-teal" style={{ width: `${progress}%` }} /></div>
        </div>
        <form className="grid gap-3" onSubmit={(event) => {
          event.preventDefault()
          if (name.trim().length < 2) {
            setError(t(lang, { en: 'Enter the medicine name from the prescription, at least 2 characters.', kn: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ನ ಔಷಧಿ ಹೆಸರನ್ನು ಕನಿಷ್ಠ 2 ಅಕ್ಷರದಲ್ಲಿ ಬರೆಯಿರಿ.' }))
            return
          }
          setError('')
          void addDose({ name: name.trim(), time, period, notes: notes.trim() })
          setName('')
          setNotes('')
        }}>
          <label className="grid gap-1 text-sm font-semibold">{t(lang, { en: 'Medicine name', kn: 'ಔಷಧಿ ಹೆಸರು' })}<input className="field" value={name} onChange={(event) => setName(event.target.value)} /></label>
          <div className="flex flex-wrap gap-2">
            {periods.map((item) => (
              <button key={item} type="button" className="chip" aria-pressed={period === item} onClick={() => setPeriod(item)}>{t(lang, { en: item, kn: item === 'morning' ? 'ಬೆಳಗ್ಗೆ' : item === 'afternoon' ? 'ಮಧ್ಯಾಹ್ನ' : item === 'evening' ? 'ಸಂಜೆ' : 'ರಾತ್ರಿ' })}</button>
            ))}
          </div>
          <label className="grid gap-1 text-sm font-semibold">{t(lang, { en: 'Reminder time', kn: 'ಜ್ಞಾಪನೆ ಸಮಯ' })}<input className="field max-w-xs" type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
          <label className="grid gap-1 text-sm font-semibold">{t(lang, { en: 'Optional note', kn: 'ಐಚ್ಛಿಕ ಟಿಪ್ಪಣಿ' })}<input className="field" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
          {error ? <p className="text-sm text-rose-700" role="alert">{error}</p> : null}
          <button className="btn primary w-fit" type="submit">{t(lang, { en: 'Save reminder', kn: 'ಜ್ಞಾಪನೆ ಉಳಿಸಿ' })}</button>
        </form>
        <button type="button" className="btn ghost w-fit" onClick={() => void notifyDemo()}>{t(lang, { en: 'Simulate a due reminder', kn: 'ಬಾಕಿ ಜ್ಞಾಪನೆಯನ್ನು ಅನುಕರಿಸಿ' })}</button>
        {due ? (
          <div className="rounded-2xl bg-white p-4">
            <p className="font-semibold">{t(lang, { en: 'Sample reminder is due', kn: 'ಮಾದರಿ ಜ್ಞಾಪನೆ ಬಾಕಿ ಇದೆ' })}</p>
            <p className="mt-1 text-sm">{snapshot.doses[0]?.name ?? t(lang, { en: 'Fictional folic acid tablet', kn: 'ಕಾಲ್ಪನಿಕ ಫೋಲಿಕ್ ಆಮ್ಲ ಮಾತ್ರೆ' })}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['taken', 'missed', 'skipped'] as const).map((status) => (
                <button key={status} type="button" className="btn ghost" onClick={() => {
                  const plan = snapshot.doses[0]
                  void logDose({ planId: plan?.id ?? 'demo', name: plan?.name ?? 'Sample reminder', status, note: '' })
                  setDue(false)
                  setSuggest(true)
                }}>{t(lang, { en: status === 'taken' ? 'Taken' : status === 'missed' ? 'Not taken' : 'Skip / not applicable', kn: status === 'taken' ? 'ತೆಗೆದುಕೊಂಡೆ' : status === 'missed' ? 'ತೆಗೆದುಕೊಳ್ಳಲಿಲ್ಲ' : 'ಬಿಡಿ / ಅನ್ವಯಿಸುವುದಿಲ್ಲ' })}</button>
              ))}
            </div>
          </div>
        ) : null}
        {suggest ? <Suggest title={t(lang, { en: 'Would you like to view your reminder history?', kn: 'ಜ್ಞಾಪನೆ ಇತಿಹಾಸ ನೋಡಬೇಕೇ?' })} action={t(lang, { en: 'It is on this page', kn: 'ಅದು ಈ ಪುಟದಲ್ಲಿದೆ' })} href="/reminders" dismiss={t(lang, { en: 'Dismiss', kn: 'ಮುಚ್ಚಿ' })} onDismiss={() => setSuggest(false)} /> : null}
      </section>
      <section className="glass p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Schedules', kn: 'ವೇಳಾಪಟ್ಟಿಗಳು' })}</h2>
        {snapshot.doses.length === 0 ? <p className="mt-2 text-muted">{t(lang, { en: 'No reminders yet. Add one from a prescription you already have.', kn: 'ಇನ್ನೂ ಜ್ಞಾಪನೆ ಇಲ್ಲ. ನಿಮ್ಮ ಬಳಿ ಇರುವ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ನಿಂದ ಒಂದನ್ನು ಸೇರಿಸಿ.' })}</p> : snapshot.doses.map((dose) => (
          <article key={dose.id} className="mt-3 border-t border-line pt-3">
            <h3 className="text-lg">{dose.name}</h3>
            <p className="text-sm text-muted">{dose.period} · {dose.time} · {dose.sample ? t(lang, { en: 'sample', kn: 'ಮಾದರಿ' }) : t(lang, { en: 'yours', kn: 'ನಿಮ್ಮದು' })}</p>
            <p className="mt-1">{dose.notes}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(['taken', 'missed', 'skipped'] as const).map((status) => (
                <button key={status} type="button" className="btn quiet" onClick={() => void logDose({ planId: dose.id, name: dose.name, status, note: '' })}>{t(lang, { en: status === 'taken' ? 'Taken' : status === 'missed' ? 'Not taken' : 'Skip', kn: status === 'taken' ? 'ತೆಗೆದುಕೊಂಡೆ' : status === 'missed' ? 'ತೆಗೆದುಕೊಳ್ಳಲಿಲ್ಲ' : 'ಬಿಡಿ' })}</button>
              ))}
            </div>
          </article>
        ))}
      </section>
      <section className="glass p-5">
        <h2 className="text-2xl">{t(lang, { en: 'History', kn: 'ಇತಿಹಾಸ' })}</h2>
        {snapshot.doseLogs.length === 0 ? <p className="mt-2 text-muted">{t(lang, { en: 'No doses logged yet.', kn: 'ಇನ್ನೂ ಡೋಸ್ ದಾಖಲಾಗಿಲ್ಲ.' })}</p> : snapshot.doseLogs.map((row) => (
          <p key={row.id} className="mt-2">{formatWhen(row.createdAt, lang)} · {row.name} · {row.status}</p>
        ))}
      </section>
    </div>
  )
}
