import { useState } from 'react'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { SAMPLE_PACKAGE, SAMPLE_PRESCRIPTION, compareMedicines, extractMedicines } from '../services/documents'
import { readImage } from '../services/ocr'

export function Medicine() {
  const { snapshot, addMedicine, notify } = useHealth()
  const [prescription, setPrescription] = useState('')
  const [pack, setPack] = useState('')
  const [rxSource, setRxSource] = useState<'demo-text' | 'ocr' | 'manual'>('manual')
  const [packSource, setPackSource] = useState<'demo-text' | 'ocr' | 'manual'>('manual')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const rows = [...extractMedicines(prescription, 'prescription'), ...extractMedicines(pack, 'package')]
  const flags = prescription || pack ? compareMedicines(extractMedicines(prescription, 'prescription'), extractMedicines(pack, 'package')) : []

  async function readInto(file: File, side: 'rx' | 'pack') {
    setError('')
    try {
      const text = await readImage(file, () => undefined)
      if (text.trim().length < 8) {
        setError(t(lang, { en: 'That image did not yield enough text. The field was not filled from OCR.', kn: 'ಆ ಚಿತ್ರದಿಂದ ಸಾಕಷ್ಟು ಪಠ್ಯ ಸಿಗಲಿಲ್ಲ. OCRನಿಂದ ಕ್ಷೇತ್ರ ತುಂಬಿಲ್ಲ.' }))
        return
      }
      if (side === 'rx') { setPrescription(text); setRxSource('ocr') } else { setPack(text); setPackSource('ocr') }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'OCR failed')
    }
  }

  return (
    <div>
      <PageIntro kicker={t(lang, { en: 'Medicine check', kn: 'ಔಷಧಿ ಪರಿಶೀಲನೆ' })} title={t(lang, { en: 'Compare a prescription with a package', kn: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಪ್ಯಾಕೇಜ್ ಹೋಲಿಸಿ' })} lede={t(lang, { en: 'This looks for name and strength differences in text you provide. A photo cannot prove a medicine is genuine, and this page will not suggest a substitute or a new dose.', kn: 'ನೀವು ನೀಡಿದ ಪಠ್ಯದಲ್ಲಿ ಹೆಸರು ಮತ್ತು ಬಲದ ವ್ಯತ್ಯಾಸವನ್ನು ನೋಡುತ್ತದೆ. ಫೋಟೋ ಔಷಧ ನಿಜವೆಂದು ಸಾಬೀತುಪಡಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಈ ಪುಟ ಬದಲಿ ಅಥವಾ ಹೊಸ ಡೋಸ್ ಸೂಚಿಸುವುದಿಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="glass grid gap-2 p-4 text-sm">
          {t(lang, { en: 'Prescription text', kn: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಪಠ್ಯ' })}
          <textarea className="area" value={prescription} onChange={(event) => { setPrescription(event.target.value); setRxSource('manual'); setConfirmed(false) }} />
          <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readInto(file, 'rx') }} />
        </label>
        <label className="glass grid gap-2 p-4 text-sm">
          {t(lang, { en: 'Package text', kn: 'ಪ್ಯಾಕೇಜ್ ಪಠ್ಯ' })}
          <textarea className="area" value={pack} onChange={(event) => { setPack(event.target.value); setPackSource('manual'); setConfirmed(false) }} />
          <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readInto(file, 'pack') }} />
        </label>
      </div>
      <button type="button" className="btn ghost mt-4" onClick={() => { setPrescription(SAMPLE_PRESCRIPTION); setPack(SAMPLE_PACKAGE); setRxSource('demo-text'); setPackSource('demo-text'); setConfirmed(false) }}>
        {t(lang, { en: 'Load fictional prescription and package', kn: 'ಕಾಲ್ಪನಿಕ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಪ್ಯಾಕೇಜ್ ತೆರೆಯಿರಿ' })}
      </button>
      {error ? <p className="banner prompt mt-4" role="status">{error}</p> : null}
      <section className="glass mt-4 p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Extracted lines', kn: 'ತೆಗೆದ ಸಾಲುಗಳು' })}</h2>
        {rows.length === 0 ? <p className="mt-2 text-muted">{t(lang, { en: 'No name and strength yet.', kn: 'ಇನ್ನೂ ಹೆಸರು ಮತ್ತು ಬಲ ಇಲ್ಲ.' })}</p> : rows.map((row) => (
          <p key={row.id} className="mt-2">{row.source}: {row.name} · {row.form || 'form not read'} · {row.strength}</p>
        ))}
        <ul className="mt-4 grid gap-2">
          {flags.map((flag) => <li key={flag.text.en} className={flag.level === 'match' ? 'pill good' : 'pill warn'}>{t(lang, flag.text)}</li>)}
        </ul>
        <p className="mt-3 text-sm text-muted">{t(lang, { en: `Sources: prescription ${rxSource}, package ${packSource}.`, kn: `ಮೂಲ: ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ${rxSource}, ಪ್ಯಾಕೇಜ್ ${packSource}.` })}</p>
        <label className="mt-4 flex gap-2">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
          {t(lang, { en: 'A pharmacist or the prescriber should confirm this before any medicine is taken. I understand a photo is not proof.', kn: 'ಯಾವುದೇ ಔಷಧ ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ಔಷಧಿಕಾರರು ಅಥವಾ ಬರೆದ ವೈದ್ಯರು ಇದನ್ನು ಖಚಿತಪಡಿಸಬೇಕು. ಫೋಟೋ ಸಾಬೀತಲ್ಲ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ.' })}
        </label>
        <button type="button" className="btn primary mt-4" disabled={!confirmed || flags.length === 0} onClick={() => {
          if (!confirmed) {
            notify(t(lang, { en: 'Confirm the pharmacist step first.', kn: 'ಮೊದಲು ಔಷಧಿಕಾರರ ಹಂತವನ್ನು ಖಚಿತಪಡಿಸಿ.' }), 'warn')
            return
          }
          void addMedicine({ rows, flags, pharmacistConfirmed: true, source: rxSource === 'demo-text' && packSource === 'demo-text' ? 'demo-text' : rxSource === 'ocr' || packSource === 'ocr' ? 'ocr' : 'manual', sample: rxSource === 'demo-text' })
        }}>{t(lang, { en: 'Save comparison', kn: 'ಹೋಲಿಕೆ ಉಳಿಸಿ' })}</button>
      </section>
    </div>
  )
}
