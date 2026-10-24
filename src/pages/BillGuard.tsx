import { useState } from 'react'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { SAMPLE_BILL, billQuestions, reviewBill } from '../services/documents'
import { readImage } from '../services/ocr'

export function BillGuard() {
  const { snapshot, addReport } = useHealth()
  const [text, setText] = useState('')
  const [source, setSource] = useState<'demo-text' | 'ocr' | 'manual'>('manual')
  const [error, setError] = useState('')
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const review = text.trim() ? reviewBill(text) : null
  return (
    <div>
      <PageIntro kicker="BillGuard" title={t(lang, { en: 'Hospital bill check', kn: 'ಆಸ್ಪತ್ರೆ ಬಿಲ್ ಪರಿಶೀಲನೆ' })} lede={t(lang, { en: 'Add the lines and compare them with the printed total. Flags are possible discrepancies to ask about, not proof of fraud.', kn: 'ಸಾಲುಗಳನ್ನು ಸೇರಿಸಿ ಮುದ್ರಿತ ಒಟ್ಟು ಮೊತ್ತದೊಂದಿಗೆ ಹೋಲಿಸಿ. ಗುರುತುಗಳು ಕೇಳಬೇಕಾದ ಸಾಧ್ಯ ವ್ಯತ್ಯಾಸಗಳು, ವಂಚನೆಯ ಸಾಬೀತಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <div className="glass grid gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn primary" onClick={() => { setText(SAMPLE_BILL); setSource('demo-text'); setError('') }}>{t(lang, { en: 'Load fictional bill', kn: 'ಕಾಲ್ಪನಿಕ ಬಿಲ್ ತೆರೆಯಿರಿ' })}</button>
          <label className="btn ghost">
            {t(lang, { en: 'Upload bill image', kn: 'ಬಿಲ್ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್' })}
            <input className="sr-only" type="file" accept="image/*" onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              void readImage(file, () => undefined).then((read) => {
                if (read.trim().length < 12) {
                  setError(t(lang, { en: 'OCR did not find enough text. The bill was not marked as read.', kn: 'OCR ಸಾಕಷ್ಟು ಪಠ್ಯ ಕಂಡುಹಿಡಿಯಲಿಲ್ಲ. ಬಿಲ್ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿಲ್ಲ.' }))
                  return
                }
                setText(read)
                setSource('ocr')
                setError('')
              }).catch(() => setError(t(lang, { en: 'OCR did not run.', kn: 'OCR ನಡೆಯಲಿಲ್ಲ.' })))
            }} />
          </label>
        </div>
        {error ? <p className="banner prompt" role="status">{error}</p> : null}
        <textarea className="area" value={text} onChange={(event) => { setText(event.target.value); setSource('manual') }} />
        <p className="text-sm text-muted">{t(lang, { en: `Source: ${source}`, kn: `ಮೂಲ: ${source}` })}</p>
        {review ? (
          <>
            <table className="w-full text-left text-sm">
              <caption className="mb-2 text-left text-base font-semibold">{t(lang, { en: 'Line breakdown', kn: 'ಸಾಲುಗಳ ವಿಭಜನೆ' })}</caption>
              <thead><tr><th>{t(lang, { en: 'Description', kn: 'ವಿವರ' })}</th><th>{t(lang, { en: 'Amount', kn: 'ಮೊತ್ತ' })}</th></tr></thead>
              <tbody>
                {review.lines.map((line) => <tr key={line.id}><td className="py-1">{line.description} {line.note}</td><td>{line.amount}</td></tr>)}
              </tbody>
            </table>
            <p>{t(lang, { en: `Lines add up to ${review.computedTotal}. Printed total: ${review.printedTotal ?? 'not found'}.`, kn: `ಸಾಲುಗಳ ಮೊತ್ತ ${review.computedTotal}. ಮುದ್ರಿತ ಒಟ್ಟು: ${review.printedTotal ?? 'ಸಿಗಲಿಲ್ಲ'}.` })}</p>
            <ul className="grid gap-2">{review.flags.map((flag) => <li key={flag.en} className="pill warn">{t(lang, flag)}</li>)}</ul>
            <h2 className="text-xl">{t(lang, { en: 'Polite questions for the billing desk', kn: 'ಬಿಲ್ಲಿಂಗ್ ವಿಭಾಗಕ್ಕೆ ಸೌಮ್ಯ ಪ್ರಶ್ನೆಗಳು' })}</h2>
            <ul className="list-disc pl-5">{billQuestions(review).map((item) => <li key={item.en}>{t(lang, item)}</li>)}</ul>
            <button type="button" className="btn primary w-fit" onClick={() => void addReport({ title: 'Reviewed bill', docKind: 'bill', source, rawText: text, fields: [], sample: source === 'demo-text', bill: review })}>
              {t(lang, { en: 'Save bill review', kn: 'ಬಿಲ್ ಪರಿಶೀಲನೆ ಉಳಿಸಿ' })}
            </button>
          </>
        ) : <p className="text-muted">{t(lang, { en: 'Paste a bill or load the sample to see the arithmetic.', kn: 'ಲೆಕ್ಕ ನೋಡಲು ಬಿಲ್ ಅಂಟಿಸಿ ಅಥವಾ ಮಾದರಿ ತೆರೆಯಿರಿ.' })}</p>}
      </div>
    </div>
  )
}
