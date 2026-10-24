import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mic, Volume2 } from 'lucide-react'
import { SakhiMark } from '../components/SakhiMark'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { FAQS } from '../data/faqs'
import { chrome, t } from '../i18n'
import { sakhiWelcome } from '../i18n/sakhi'
import { languageMeta } from '../languages'
import { answerQuestion, modelStatus, type ModelStatus } from '../services/assistant'
import { advanceTiredGuide, startTiredGuide, tiredQuestion, type TiredGuide } from '../services/guide'
import { textLooksUrgent } from '../services/triage'
import type { AssistantAnswer } from '../types'

type Turn = { role: 'user' | 'sakhi'; text: string; answer?: AssistantAnswer }

export function Assistant() {
  const { snapshot, offline, addSymptom } = useHealth()
  const [status, setStatus] = useState<ModelStatus | null>(null)
  const [message, setMessage] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)
  const [voiceNote, setVoiceNote] = useState('')
  const [guide, setGuide] = useState<TiredGuide | null>(null)
  const lang = snapshot?.profile.language ?? 'en'

  useEffect(() => {
    let live = true
    void modelStatus().then((next) => { if (live) setStatus(next) })
    return () => { live = false }
  }, [offline])

  if (!snapshot) return null
  const consent = snapshot.profile.onlineModelConsent

  async function ask(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setBusy(true)
    setTurns((current) => [...current, { role: 'user', text: trimmed }])
    setMessage('')
    if (!textLooksUrgent(trimmed)) {
      if (guide) {
        const wasReview = guide.step === 'review'
        const next = advanceTiredGuide(guide, trimmed, lang)
        if (wasReview && next.summary) {
          await addSymptom({ module: 'general', symptoms: ['tiredness'], severity: 0, notes: next.summary })
        }
        setGuide(next.guide)
        setTurns((current) => [...current, { role: 'sakhi', text: next.text }])
        setBusy(false)
        return
      }
      const started = startTiredGuide(trimmed)
      if (started) {
        setGuide(started)
        setTurns((current) => [...current, { role: 'sakhi', text: tiredQuestion(lang) }])
        setBusy(false)
        return
      }
    } else {
      setGuide(null)
    }
    const answer = await answerQuestion({ message: trimmed, lang, consent, offline })
    setTurns((current) => [...current, { role: 'sakhi', text: answer.text, answer }])
    setBusy(false)
  }

  function listen() {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Ctor) {
      setVoiceNote(t(lang, { en: 'This browser has no speech recognition. Type the question instead.', kn: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಇಲ್ಲ. ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ.' }))
      return
    }
    const rec = new Ctor()
    rec.lang = languageMeta(lang).locale
    rec.interimResults = false
    rec.onresult = (event) => setMessage(event.results[0]?.[0]?.transcript ?? '')
    rec.start()
  }

  function speak(text: string) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = languageMeta(lang).locale
    window.speechSynthesis.speak(utterance)
  }

  const sourceLabel = (answer: AssistantAnswer) => {
    const map = {
      'urgent-rule': { en: 'Fixed urgent rule', kn: 'ನಿಗದಿತ ತುರ್ತು ನಿಯಮ' },
      curated: { en: 'Curated on this device', kn: 'ಈ ಸಾಧನದ ಸಿದ್ಧ ಉತ್ತರ' },
      'local-model': { en: 'Local model', kn: 'ಸ್ಥಳೀಯ ಮಾದರಿ' },
      'online-model': { en: 'Online model', kn: 'ಆನ್‌ಲೈನ್ ಮಾದರಿ' },
      fallback: { en: 'Saved fallback', kn: 'ಉಳಿಸಿದ ಪರ್ಯಾಯ' },
    } as const
    return `${t(lang, map[answer.source])}. ${t(lang, answer.detail)}`
  }

  return (
    <div>
      <PageIntro kicker="SAKHI AI" title={t(lang, { en: 'Your health companion', kn: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಚರಿ', hi: 'आपकी स्वास्थ्य साथी', gu: 'તમારી તબિયત સાથી', mr: 'तुमची आरोग्य सोबती', ta: 'உங்கள் உடல்நல துணை', te: 'మీ ఆరోగ్య సహచరి', bn: 'আপনার স্বাস্থ্য সঙ্গী', ml: 'നിങ്ങളുടെ ആരോഗ്യ കൂട്ടുകാരി', pa: 'ਤੁਹਾਡੀ ਸਿਹਤ ਸਾਥਣ', or: 'ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ', ur: 'آپ کی صحت کی ساتھی' })} lede={t(lang, { en: 'SAKHI answers in the language you chose. Urgent wording is answered by a fixed rule before any model. Saved answers work with no API key.', kn: 'ನೀವು ಆಯ್ಕೆಮಾಡಿದ ಭಾಷೆಯಲ್ಲಿ SAKHI ಉತ್ತರಿಸುತ್ತದೆ. ತುರ್ತು ಮಾತುಗಳಿಗೆ ಯಾವುದೇ ಮಾದರಿಗಿಂತ ಮೊದಲು ನಿಗದಿತ ನಿಯಮ ಉತ್ತರಿಸುತ್ತದೆ. API ಕೀ ಇಲ್ಲದೆ ಉಳಿಸಿದ ಉತ್ತರಗಳು ಕೆಲಸ ಮಾಡುತ್ತವೆ.', hi: 'SAKHI आपकी चुनी भाषा में जवाब देती है। आपातकालीन शब्द किसी मॉडल से पहले एक निश्चित नियम से आते हैं। सहेजे जवाब बिना API कुंजी के काम करते हैं।' })} />
      <SafetyNote lang={lang} />
      <p className="mb-4 text-sm text-muted">
        {offline
          ? t(lang, { en: 'Connection for models: paused. Answers come from this device.', kn: 'ಮಾದರಿಗಳ ಸಂಪರ್ಕ: ನಿಲ್ಲಿಸಿದೆ. ಉತ್ತರಗಳು ಈ ಸಾಧನದಿಂದ.' })
          : status
            ? t(lang, { en: `App server ${status.reachable ? 'reachable' : 'not reachable'}. Local model ${status.local ? 'configured' : 'not configured'}. Online model ${status.openai ? 'configured' : 'not configured'}. Consent ${snapshot.profile.onlineModelConsent ? 'on' : 'off'}.`, kn: `ಅಪ್ಲಿಕೇಶನ್ ಸರ್ವರ್ ${status.reachable ? 'ಸಿಗುತ್ತದೆ' : 'ಸಿಗುತ್ತಿಲ್ಲ'}. ಸ್ಥಳೀಯ ಮಾದರಿ ${status.local ? 'ಹೊಂದಿಸಿದೆ' : 'ಹೊಂದಿಸಿಲ್ಲ'}. ಆನ್‌ಲೈನ್ ಮಾದರಿ ${status.openai ? 'ಹೊಂದಿಸಿದೆ' : 'ಹೊಂದಿಸಿಲ್ಲ'}. ಅನುಮತಿ ${snapshot.profile.onlineModelConsent ? 'ಆನ್' : 'ಆಫ್'}.` })
            : t(lang, { en: 'Checking the app server…', kn: 'ಅಪ್ಲಿಕೇಶನ್ ಸರ್ವರ್ ಪರಿಶೀಲಿಸುತ್ತಿದೆ…' })}
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { en: 'I have been feeling tired lately.', kn: 'ಇತ್ತೀಚೆಗೆ ನನಗೆ ಆಯಾಸವಾಗುತ್ತಿದೆ.', hi: 'इधर मुझे थकान हो रही है।', gu: 'આજકાલ મને થાક લાગે છે.', mr: 'आता मला थकवा येतो आहे.', ta: 'சமீபத்தில் எனக்கு சோர்வு ஏற்படுகிறது.', te: 'ఇటీవల నాకు అలసటగా ఉంది.', bn: 'ইদানীং আমার ক্লান্তি লাগছে।', ml: 'ഈയിടെ എനിക്ക് ക്ഷീണം ഉണ്ട്.', pa: 'ਇਹਨਾਂ ਦਿਨਾਂ ਮੈਨੂੰ ਥਕਾਵਟ ਹੋ ਰਹੀ ਹੈ।', or: 'ଏବେ ମୋତେ ଥକ୍କା ଲାଗୁଛି।', ur: 'آج کل مجھے تھکاوٹ ہو رہی ہے۔' },
          { en: 'Help me prepare for a doctor’s appointment.', kn: 'ವೈದ್ಯರ ಭೇಟಿಗೆ ಸಿದ್ಧವಾಗಲು ಸಹಾಯ ಮಾಡಿ.' },
          { en: 'Find a hospital with the service I need.', kn: 'ನನಗೆ ಬೇಕಾದ ಸೇವೆ ಇರುವ ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ.' },
          { en: 'Help me understand women’s health.', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡಿ.' },
        ].map((prompt) => (
          <button key={prompt.en} type="button" className="chip" onClick={() => void ask(t(lang, prompt))}>{t(lang, prompt)}</button>
        ))}
        {FAQS.slice(0, 2).map((faq) => (
          <button key={faq.id} type="button" className="chip" onClick={() => void ask(t(lang, faq.title))}>{t(lang, faq.title)}</button>
        ))}
        <button type="button" className="chip" onClick={() => void ask(t(lang, { en: 'How many iron tablets should I take?', kn: 'ನಾನು ಎಷ್ಟು ಕಬ್ಬಿಣದ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಬೇಕು?', hi: 'मुझे कितनी लोहे की गोलियाँ लेनी चाहिए?', gu: 'મારે કેટલી લોખંડની ગોળી લેવી?', mr: 'मी किती लोह गोळ्या घ्याव्यात?', ta: 'நான் எத்தனை இரும்பு மாத்திரை எடுக்க வேண்டும்?', te: 'నేను ఎన్ని ఇనుప మాత్రలు తీసుకోవాలి?', bn: 'আমি কতগুলো লোহার ট্যাবলেট নেব?', ml: 'ഞാൻ എത്ര ഇരുമ്പ് ഗുളിക എടുക്കണം?', pa: 'ਮੈਂ ਕਿੰਨੀਆਂ ਲੋਹੇ ਦੀਆਂ ਗੋਲੀਆਂ ਲਵਾਂ?', or: 'ମୁଁ କେତେ ଲୌହ ବଟିକା ନେବି?', ur: 'میں کتنی لوہے کی گولیاں لوں؟' }))}>
          {t(lang, { en: 'Ask for a dose (refused)', kn: 'ಡೋಸ್ ಕೇಳಿ (ನಿರಾಕರಣೆ)', hi: 'खुराक पूछें (मना)', gu: 'માત્રા પૂછો (ના)', mr: 'मात्रा विचारा (नाकार)', ta: 'அளவு கேளுங்கள் (மறுப்பு)', te: 'మోతాదు అడగండి (నిరాకరణ)', bn: 'ডোজ জিজ্ঞাসা (প্রত্যাখ্যান)', ml: 'ഡോസ് ചോദിക്കുക (നിരസനം)', pa: 'ਖੁਰਾਕ ਪੁੱਛੋ (ਇਨਕਾਰ)', or: 'ଡୋଜ୍ ପଚାରନ୍ତୁ (ମନା)', ur: 'خوراک پوچھیں (انکار)' })}
        </button>
      </div>
      <section className="sakhi-hello mb-4">
        <SakhiMark />
        <div>
          <p className="text-sm font-semibold text-teal">SAKHI</p>
          <p className="mt-1 leading-7">{t(lang, sakhiWelcome)}</p>
          <p className="mt-2 text-sm text-muted">{t(lang, chrome.demoDraft)}</p>
        </div>
      </section>
      <p className="mb-3 text-sm text-muted">{t(lang, { en: 'Follow-up questions about tiredness are a labelled script until you allow a configured model. SAKHI does not diagnose.', kn: 'ಆಯಾಸದ ಮುಂದಿನ ಪ್ರಶ್ನೆಗಳು ಲೇಬಲ್ ಮಾಡಿದ ಲಿಪಿ. ನೀವು ಮಾದರಿಗೆ ಅನುಮತಿಸುವವರೆಗೆ ಹಾಗೆಯೇ. SAKHI ರೋಗ ನಿರ್ಣಯ ಮಾಡುವುದಿಲ್ಲ.', hi: 'थकान के आगे के सवाल एक लेबल वाली स्क्रिप्ट हैं, जब तक आप मॉडल की अनुमति नहीं देते। SAKHI निदान नहीं करती।' })}</p>
      <div className="grid gap-3">
        {turns.length === 0 ? <p className="text-muted">{t(lang, { en: 'Choose a starter or type a question.', kn: 'ಒಂದು ಪ್ರಾರಂಭ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ.' })}</p> : null}
        {turns.map((turn, index) => (
          <article key={`${turn.role}-${index}`} className={turn.role === 'sakhi' ? 'sakhi-bubble p-4' : 'glass p-4'}>
            <p className="text-sm text-muted">{turn.role === 'user' ? t(lang, { en: 'You', kn: 'ನೀವು', hi: 'आप', gu: 'તમે', mr: 'तुम्ही', ta: 'நீங்கள்', te: 'మీరు', bn: 'আপনি', ml: 'നിങ്ങൾ', pa: 'ਤੁਸੀਂ', or: 'ଆପଣ', ur: 'آپ' }) : 'SAKHI'}</p>
            <p className="mt-1 leading-7">{turn.text}</p>
            {turn.answer ? (
              <>
                <p className="mt-2 text-sm text-teal">{sourceLabel(turn.answer)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {turn.answer.links.map((link) => <Link key={link.href} className="btn ghost" to={link.href}>{t(lang, link.label)}</Link>)}
                  <button type="button" className="btn ghost" onClick={() => speak(turn.text)}><Volume2 size={16} /> {t(lang, { en: 'Read aloud', kn: 'ಓದಿ ಹೇಳಿ' })}</button>
                  <button type="button" className="btn ghost" onClick={() => void addSymptom({ module: 'general', symptoms: ['sakhi-note'], severity: 0, notes: turn.text.slice(0, 500) })}>
                    {t(lang, { en: 'Save as a note', kn: 'ಟಿಪ್ಪಣಿಯಾಗಿ ಉಳಿಸಿ' })}
                  </button>
                </div>
              </>
            ) : null}
          </article>
        ))}
      </div>
      <form className="mt-4 flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); void ask(message) }}>
        <label className="sr-only" htmlFor="sakhi-q">{t(lang, { en: 'Question', kn: 'ಪ್ರಶ್ನೆ', hi: 'सवाल', gu: 'પ્રશ્ન', mr: 'प्रश्न', ta: 'கேள்வி', te: 'ప్రశ్న', bn: 'প্রশ্ন', ml: 'ചോദ്യം', pa: 'ਸਵਾਲ', or: 'ପ୍ରଶ୍ନ', ur: 'سوال' })}</label>
        <input id="sakhi-q" className="field min-w-0 flex-1" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} />
        <button type="button" className="btn ghost" onClick={listen}><Mic size={16} /> {t(lang, { en: 'Voice', kn: 'ಧ್ವನಿ' })}</button>
        <button className="btn primary" type="submit" disabled={busy}>{t(lang, { en: 'Ask', kn: 'ಕೇಳಿ' })}</button>
      </form>
      {voiceNote ? <p className="mt-3 text-sm text-warn" role="status">{voiceNote}</p> : null}
      <p className="mt-3 text-sm text-muted">{t(lang, { en: 'Voice input and read-aloud depend on this browser. If Kannada speech is not installed, the device voice may stay in another language.', kn: 'ಧ್ವನಿ ಮತ್ತು ಓದುವಿಕೆ ಈ ಬ್ರೌಸರ್ ಅನ್ನು ಅವಲಂಬಿಸಿದೆ. ಕನ್ನಡ ಧ್ವನಿ ಸ್ಥಾಪಿತವಿಲ್ಲದಿದ್ದರೆ ಸಾಧನದ ಧ್ವನಿ ಬೇರೆ ಭಾಷೆಯಲ್ಲಿರಬಹುದು.' })}</p>
    </div>
  )
}
