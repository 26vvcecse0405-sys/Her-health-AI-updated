import { useState } from 'react'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { SAMPLE_REPORT, clinicianQuestions, explainTerm, parseReport } from '../services/documents'
import { readImage } from '../services/ocr'
import type { ReportField } from '../types'

function paint(text: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 980
  canvas.height = 1280
  const context = canvas.getContext('2d')
  if (!context) return null
  context.fillStyle = '#f7f3ea'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#1c1917'
  context.font = '32px Georgia, serif'
  text.split('\n').forEach((line, index) => context.fillText(line.slice(0, 64), 48, 84 + index * 50))
  return canvas
}

export function Scanner() {
  const { snapshot, addReport, addLab } = useHealth()
  const [preview, setPreview] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [source, setSource] = useState<'demo-text' | 'ocr' | 'manual'>('manual')
  const [fields, setFields] = useState<ReportField[]>([])
  const [progress, setProgress] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [includeLabs, setIncludeLabs] = useState(false)
  if (!snapshot) return null
  const lang = snapshot.profile.language

  function applyText(next: string, nextSource: 'demo-text' | 'ocr' | 'manual') {
    const parsed = parseReport(next)
    setText(next)
    setSource(nextSource)
    setFields(parsed)
    setError(parsed.length === 0 ? t(lang, { en: 'No labeled values with a printed reference were found. You can type them below. This was not treated as a successful extraction.', kn: 'ಮುದ್ರಿತ ವ್ಯಾಪ್ತಿಯೊಂದಿಗೆ ಯಾವ ಲೇಬಲ್ ಮೌಲ್ಯವೂ ಸಿಗಲಿಲ್ಲ. ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಬಹುದು. ಇದನ್ನು ಯಶಸ್ವಿ ಓದುವಿಕೆ ಎಂದು ಪರಿಗಣಿಸಿಲ್ಲ.' }) : '')
  }

  async function runOcr(image: Blob | HTMLCanvasElement) {
    setBusy(true)
    setProgress(0)
    setError('')
    try {
      const read = await readImage(image, setProgress)
      if (read.trim().length < 20) {
        setError(t(lang, { en: 'Text extraction did not find enough text. Nothing was marked as read. Load the supplied sample or type the values.', kn: 'ಪಠ್ಯ ಓದುವಿಕೆ ಸಾಕಷ್ಟು ಪಠ್ಯ ಕಂಡುಹಿಡಿಯಲಿಲ್ಲ. ಏನನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿಲ್ಲ. ಮಾದರಿ ಪಠ್ಯ ತೆರೆಯಿರಿ ಅಥವಾ ಮೌಲ್ಯಗಳನ್ನು ಟೈಪ್ ಮಾಡಿ.' }))
        setText(read)
        setFields([])
        setSource('ocr')
      } else applyText(read, 'ocr')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t(lang, { en: 'OCR did not run. The sample text is still available.', kn: 'OCR ನಡೆಯಲಿಲ್ಲ. ಮಾದರಿ ಪಠ್ಯ ಇನ್ನೂ ಲಭ್ಯ.' }))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageIntro kicker="CareLens" title={t(lang, { en: 'Report scanner', kn: 'ವರದಿ ಸ್ಕ್ಯಾನರ್' })} lede={t(lang, { en: 'Upload an image or use the fictional sample. Review every field before it is saved. An out-of-range number is not a diagnosis.', kn: 'ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಕಾಲ್ಪನಿಕ ಮಾದರಿ ಬಳಸಿ. ಉಳಿಸುವ ಮೊದಲು ಪ್ರತಿ ಕ್ಷೇತ್ರವನ್ನು ನೋಡಿ. ವ್ಯಾಪ್ತಿಯ ಹೊರಗಿನ ಸಂಖ್ಯೆ ರೋಗ ನಿರ್ಣಯವಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <div className="glass grid gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn primary" onClick={() => { setPreview(''); setFile(null); applyText(SAMPLE_REPORT, 'demo-text') }}>{t(lang, { en: 'Use supplied sample text', kn: 'ನೀಡಿದ ಮಾದರಿ ಪಠ್ಯ ಬಳಸಿ' })}</button>
          <button type="button" className="btn ghost" onClick={() => {
            const canvas = paint(SAMPLE_REPORT)
            if (!canvas) return
            setPreview(canvas.toDataURL('image/png'))
            setFile(null)
            void runOcr(canvas)
          }}>{t(lang, { en: 'Read a generated sample image', kn: 'ರಚಿಸಿದ ಮಾದರಿ ಚಿತ್ರವನ್ನು ಓದಿ' })}</button>
        </div>
        <label className="text-sm font-semibold">
          {t(lang, { en: 'Or choose an image. It stays in the browser.', kn: 'ಅಥವಾ ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ. ಅದು ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಇರುತ್ತದೆ.' })}
          <input className="mt-2 block" type="file" accept="image/*" capture="environment" onChange={(event) => {
            const next = event.target.files?.[0]
            if (!next) return
            setFile(next)
            const reader = new FileReader()
            reader.onload = () => setPreview(String(reader.result || ''))
            reader.readAsDataURL(next)
            setText('')
            setFields([])
            setSource('manual')
            setError('')
          }} />
        </label>
        {preview ? <img src={preview} alt={t(lang, { en: 'Document preview', kn: 'ದಾಖಲೆ ಮುನ್ನೋಟ' })} className="max-h-80 rounded-2xl" /> : null}
        {file ? <button type="button" className="btn ghost w-fit" disabled={busy} onClick={() => void runOcr(file)}>{busy ? t(lang, { en: `Reading ${(progress * 100).toFixed(0)}%`, kn: `ಓದುತ್ತಿದೆ ${(progress * 100).toFixed(0)}%` }) : t(lang, { en: 'Extract printed text', kn: 'ಮುದ್ರಿತ ಪಠ್ಯ ತೆಗೆಯಿರಿ' })}</button> : null}
        {error ? <p className="banner prompt" role="status">{error}</p> : null}
        <p className="text-sm text-muted">{t(lang, { en: `Source: ${source === 'demo-text' ? 'supplied sample text, not OCR' : source === 'ocr' ? 'browser OCR, please review' : 'not extracted yet'}`, kn: `ಮೂಲ: ${source === 'demo-text' ? 'ನೀಡಿದ ಮಾದರಿ ಪಠ್ಯ, OCR ಅಲ್ಲ' : source === 'ocr' ? 'ಬ್ರೌಸರ್ OCR, ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ' : 'ಇನ್ನೂ ತೆಗೆದಿಲ್ಲ'}` })}</p>
        <label className="text-sm font-semibold">
          {t(lang, { en: 'Raw text', kn: 'ಕಚ್ಚಾ ಪಠ್ಯ' })}
          <textarea className="area mt-2" value={text} onChange={(event) => applyText(event.target.value, text === event.target.value ? source : 'manual')} />
        </label>
        <div className="grid gap-3">
          {fields.map((field, index) => {
            const glossary = explainTerm(field.label)
            return (
              <div key={field.id} className="rounded-2xl border border-line p-3">
                <div className="grid gap-2 sm:grid-cols-4">
                  <input className="field" aria-label="Label" value={field.label} onChange={(event) => setFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} />
                  <input className="field" aria-label="Value" value={field.value} onChange={(event) => setFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} />
                  <input className="field" aria-label="Unit" value={field.unit} onChange={(event) => setFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, unit: event.target.value } : item))} />
                  <input className="field" aria-label="Reference" value={field.reference} onChange={(event) => setFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, reference: event.target.value, flag: 'unclear' } : item))} />
                </div>
                <p className={`mt-2 text-sm ${field.flag === 'outside' ? 'text-warn' : 'text-muted'}`}>{field.flag} · {field.note}</p>
                {glossary ? <p className="mt-1 text-sm leading-6">{t(lang, glossary)}</p> : null}
              </div>
            )
          })}
        </div>
        <h2 className="text-xl">{t(lang, { en: 'Questions for a clinician', kn: 'ವೈದ್ಯರಿಗೆ ಪ್ರಶ್ನೆಗಳು' })}</h2>
        <ul className="list-disc pl-5 leading-7">{clinicianQuestions(fields).map((item) => <li key={item.en}>{t(lang, item)}</li>)}</ul>
        <label className="flex gap-2 text-sm">
          <input type="checkbox" checked={includeLabs} onChange={(event) => setIncludeLabs(event.target.checked)} />
          {t(lang, { en: 'Also add numeric fields to my lab timeline', kn: 'ಸಂಖ್ಯಾ ಕ್ಷೇತ್ರಗಳನ್ನು ನನ್ನ ಪ್ರಯೋಗಾಲಯ ಕಾಲರೇಖೆಗೂ ಸೇರಿಸಿ' })}
        </label>
        <button type="button" className="btn primary w-fit" disabled={!text.trim()} onClick={() => {
          void addReport({ title: source === 'demo-text' ? 'Fictional CBC sample' : 'Reviewed report text', docKind: 'report', source, rawText: text, fields, sample: source === 'demo-text' })
          if (includeLabs) {
            for (const field of fields) {
              const value = Number(field.value)
              if (!Number.isNaN(value)) void addLab({ name: field.label, value, unit: field.unit, reference: field.reference, context: field.note, source: 'report' })
            }
          }
        }}>{t(lang, { en: 'Save reviewed report', kn: 'ಪರಿಶೀಲಿಸಿದ ವರದಿ ಉಳಿಸಿ' })}</button>
      </div>
    </div>
  )
}
