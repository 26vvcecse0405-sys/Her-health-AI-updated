import { useState } from 'react'
import { Modal, PageIntro } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { buildPassport } from '../services/passport'

export function Privacy() {
  const health = useHealth()
  const { snapshot } = health
  const [confirmClear, setConfirmClear] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null)
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const rows = [
    ...snapshot.symptoms.map((entry) => ({ id: entry.id, label: `${entry.module}: ${entry.notes}` })),
    ...snapshot.labs.map((entry) => ({ id: entry.id, label: `${entry.name} ${entry.value}` })),
    ...snapshot.reports.map((entry) => ({ id: entry.id, label: entry.title })),
    ...snapshot.medicines.map((entry) => ({ id: entry.id, label: entry.flags.map((flag) => flag.text.en).join(' ') || 'Medicine check' })),
    ...snapshot.doses.map((entry) => ({ id: entry.id, label: `Reminder: ${entry.name}` })),
    ...snapshot.doseLogs.map((entry) => ({ id: entry.id, label: `Dose log: ${entry.name} ${entry.status}` })),
    ...snapshot.outbox.map((entry) => ({ id: entry.id, label: `Queued: ${entry.label}` })),
  ]
  return (
    <div>
      <PageIntro kicker={t(lang, { en: 'Privacy', kn: 'ಗೌಪ್ಯತೆ' })} title={t(lang, { en: 'Your notes stay here until you move them', kn: 'ನೀವು ಸರಿಸುವವರೆಗೆ ಟಿಪ್ಪಣಿಗಳು ಇಲ್ಲೇ ಇರುತ್ತವೆ' })} lede={t(lang, { en: 'HerHealth stores this demonstration in IndexedDB on this browser. It does not ask for your real name. Health text is not sent to a model unless you turn that permission on.', kn: 'HerHealth ಈ ಪ್ರದರ್ಶನವನ್ನು ಈ ಬ್ರೌಸರ್‌ನ IndexedDBಯಲ್ಲಿ ಇಡುತ್ತದೆ. ನಿಮ್ಮ ನಿಜವಾದ ಹೆಸರು ಕೇಳುವುದಿಲ್ಲ. ನೀವು ಅನುಮತಿ ನೀಡದ ಹೊರತು ಆರೋಗ್ಯ ಪಠ್ಯ ಮಾದರಿಗೆ ಹೋಗುವುದಿಲ್ಲ.' })} />
      <div className="glass grid gap-3 p-5">
        <label className="flex gap-2">
          <input type="checkbox" checked={snapshot.profile.locationEnabled} onChange={(event) => void health.setLocationEnabled(event.target.checked)} />
          {t(lang, { en: 'Allow this page to request browser location. Coordinates are not uploaded.', kn: 'ಈ ಪುಟ ಬ್ರೌಸರ್ ಸ್ಥಳ ಕೇಳಲು ಅನುಮತಿಸಿ. ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುವುದಿಲ್ಲ.' })}
        </label>
        <label className="flex gap-2">
          <input type="checkbox" checked={snapshot.profile.onlineModelConsent} onChange={(event) => void health.setOnlineConsent(event.target.checked)} />
          {t(lang, { en: 'Allow a configured local or online model to receive the question text. Do not type names, phone numbers, or report identifiers.', kn: 'ಹೊಂದಿಸಿದ ಸ್ಥಳೀಯ ಅಥವಾ ಆನ್‌ಲೈನ್ ಮಾದರಿಗೆ ಪ್ರಶ್ನೆಯ ಪಠ್ಯ ಹೋಗಲು ಅನುಮತಿಸಿ. ಹೆಸರು, ಫೋನ್, ಅಥವಾ ವರದಿ ಗುರುತುಗಳನ್ನು ಟೈಪ್ ಮಾಡಬೇಡಿ.' })}
        </label>
        <button type="button" className="btn ghost w-fit" onClick={() => {
          const text = buildPassport({ lang, displayName: snapshot.profile.displayName, symptoms: snapshot.symptoms, labs: snapshot.labs, reports: snapshot.reports, medicines: snapshot.medicines, questions: '', includeSamples: true })
          void navigator.clipboard.writeText(text).then(() => health.notify(t(lang, { en: 'Full summary copied. It is still fictional where marked.', kn: 'ಪೂರ್ಣ ಸಾರಾಂಶ ನಕಲಾಗಿದೆ. ಗುರುತಿಸಿದೆಡೆ ಅದು ಕಾಲ್ಪನಿಕ.' })))
        }}>{t(lang, { en: 'Copy everything saved', kn: 'ಉಳಿಸಿದ್ದೆಲ್ಲ ನಕಲಿಸಿ' })}</button>
      </div>
      <ul className="mt-5 grid gap-2">
        {rows.length === 0 ? <li className="text-muted">{t(lang, { en: 'No health entries stored.', kn: 'ಯಾವ ಆರೋಗ್ಯ ನಮೂದೂ ಇಲ್ಲ.' })}</li> : rows.map((row) => (
          <li key={row.id} className="glass flex items-center justify-between gap-3 p-3">
            <span>{row.label}</span>
            <button type="button" className="btn quiet" onClick={() => setPendingDelete(row)}>{t(lang, { en: 'Delete', kn: 'ಅಳಿಸಿ' })}</button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn danger mt-5" onClick={() => setConfirmClear(true)}>{t(lang, { en: 'Clear health data and restore the sample', kn: 'ಆರೋಗ್ಯ ಡೇಟಾ ಅಳಿಸಿ ಮಾದರಿ ಮರಳಿಸಿ' })}</button>
      {pendingDelete ? (
        <Modal title={t(lang, { en: 'Delete this entry?', kn: 'ಈ ನಮೂದು ಅಳಿಸುವುದೇ?' })} onClose={() => setPendingDelete(null)}>
          <p>{pendingDelete.label}</p>
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn danger" onClick={() => { void health.deleteById(pendingDelete.id); setPendingDelete(null) }}>{t(lang, { en: 'Delete', kn: 'ಅಳಿಸಿ' })}</button>
            <button type="button" className="btn ghost" onClick={() => setPendingDelete(null)}>{t(lang, { en: 'Keep', kn: 'ಇರಲಿ' })}</button>
          </div>
        </Modal>
      ) : null}
      {confirmClear ? (
        <Modal title={t(lang, { en: 'Restore the sample profile?', kn: 'ಮಾದರಿ ಪ್ರೊಫೈಲ್ ಮರಳಿಸುವುದೇ?' })} onClose={() => setConfirmClear(false)}>
          <p>{t(lang, { en: 'This removes notes, reports, medicine checks, and the sync queue from this browser, then loads the fictional Meera profile again.', kn: 'ಇದು ಈ ಬ್ರೌಸರ್‌ನಿಂದ ಟಿಪ್ಪಣಿಗಳು, ವರದಿಗಳು, ಔಷಧಿ ಪರಿಶೀಲನೆಗಳು ಮತ್ತು ಸಿಂಕ್ ಸರದಿಯನ್ನು ತೆಗೆಯುತ್ತದೆ, ನಂತರ ಕಾಲ್ಪನಿಕ ಮೀರಾ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಮತ್ತೆ ತುಂಬುತ್ತದೆ.' })}</p>
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn danger" onClick={() => { void health.clearHealthData(); setConfirmClear(false) }}>{t(lang, { en: 'Clear and restore', kn: 'ಅಳಿಸಿ ಮರಳಿಸಿ' })}</button>
            <button type="button" className="btn ghost" onClick={() => setConfirmClear(false)}>{t(lang, { en: 'Cancel', kn: 'ರದ್ದು' })}</button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
