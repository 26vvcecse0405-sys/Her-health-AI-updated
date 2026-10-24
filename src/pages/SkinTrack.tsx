import { useState } from 'react'
import { LogForm } from '../components/LogForm'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { skinSymptoms } from '../data/catalog'
import { t } from '../i18n'
import { formatWhen } from '../lib/format'

export function SkinTrack() {
  const { snapshot } = useHealth()
  const [preview, setPreview] = useState('')
  const [message, setMessage] = useState('')
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const entries = snapshot.symptoms.filter((entry) => entry.module === 'skin')
  return (
    <div>
      <PageIntro kicker="SkinTrack" title={t(lang, { en: 'Skin change journal', kn: 'ಚರ್ಮ ಬದಲಾವಣೆ ದಿನಚರಿ' })} lede={t(lang, { en: 'Describe a change in words. A photo can sit beside the note on this device. No image analysis runs, and a photo cannot diagnose a skin condition or cancer.', kn: 'ಬದಲಾವಣೆಯನ್ನು ಮಾತಿನಲ್ಲಿ ಬರೆಯಿರಿ. ಫೋಟೋ ಈ ಸಾಧನದಲ್ಲಿ ಟಿಪ್ಪಣಿಯ ಪಕ್ಕದಲ್ಲಿ ಇರಬಹುದು. ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುವುದಿಲ್ಲ. ಫೋಟೋ ಚರ್ಮ ಸ್ಥಿತಿ ಅಥವಾ ಕ್ಯಾನ್ಸರ್ ನಿರ್ಣಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <div className="glass p-5">
        <label className="text-sm font-semibold">
          {t(lang, { en: 'Optional photo, stored only in this tab’s memory', kn: 'ಐಚ್ಛಿಕ ಫೋಟೋ, ಈ ಟ್ಯಾಬ್‌ನ ನೆನಪಿನಲ್ಲಿ ಮಾತ್ರ' })}
          <input className="mt-2 block" type="file" accept="image/*" onChange={(event) => {
            const file = event.target.files?.[0]
            if (!file) return
            if (file.size > 1_500_000) {
              setMessage(t(lang, { en: 'That image is over 1.5 MB. Choose a smaller one. Nothing was saved.', kn: 'ಆ ಚಿತ್ರ 1.5 MBಗಿಂತ ದೊಡ್ಡದು. ಚಿಕ್ಕದನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಏನೂ ಉಳಿಸಿಲ್ಲ.' }))
              return
            }
            const reader = new FileReader()
            reader.onload = () => {
              setPreview(String(reader.result || ''))
              setMessage(t(lang, { en: 'Preview only. The image was not analysed.', kn: 'ಮುನ್ನೋಟ ಮಾತ್ರ. ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಿಲ್ಲ.' }))
            }
            reader.readAsDataURL(file)
          }} />
        </label>
        {message ? <p className="mt-2 text-sm text-muted">{message}</p> : null}
        {preview ? <img src={preview} alt={t(lang, { en: 'Skin note preview, not analysed', kn: 'ಚರ್ಮ ಟಿಪ್ಪಣಿ ಮುನ್ನೋಟ, ವಿಶ್ಲೇಷಿಸಿಲ್ಲ' })} className="mt-3 max-h-56 rounded-2xl" /> : null}
        <div className="mt-4"><LogForm lang={lang} module="skin" choices={skinSymptoms} showDuration /></div>
      </div>
      <ul className="mt-6 grid gap-3">
        {entries.length === 0 ? <li className="text-muted">{t(lang, { en: 'No skin notes yet.', kn: 'ಇನ್ನೂ ಚರ್ಮ ಟಿಪ್ಪಣಿಗಳಿಲ್ಲ.' })}</li> : entries.map((entry) => <li key={entry.id} className="glass p-4">{formatWhen(entry.createdAt, lang)} · {entry.notes}</li>)}
      </ul>
    </div>
  )
}
