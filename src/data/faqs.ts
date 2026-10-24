import type { Copy } from '../types'

export type Faq = {
  id: string
  keywords: string[]
  title: Copy
  body: Copy
  href: string
  link: Copy
}

export const FAQS: Faq[] = [
  {
    id: 'phc',
    keywords: ['phc', 'primary health', 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ', 'ಆರೋಗ್ಯ ಕೇಂದ್ರ'],
    title: { en: 'What is a primary health centre?', kn: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಎಂದರೇನು?' },
    body: {
      en: 'It is often the first government clinic in a rural area. What it can do changes by place and by the staff on duty. The Malenahalli centre in this demo is fictional. If someone is in danger, call 112 or 108 instead of waiting for the clinic.',
      kn: 'ಇದು ಹಲವು ಗ್ರಾಮಗಳ ಮೊದಲ ಸರ್ಕಾರಿ ಚಿಕಿತ್ಸಾಲಯ. ಅಲ್ಲಿ ಏನು ಸಿಗುತ್ತದೆ ಎಂಬುದು ಊರು ಮತ್ತು ಆ ದಿನದ ಸಿಬ್ಬಂದಿಯನ್ನು ಅವಲಂಬಿಸಿದೆ. ಈ ಮಾದರಿಯ ಮಾಲೇನಹಳ್ಳಿ ಕೇಂದ್ರ ಕಾಲ್ಪನಿಕ. ಅಪಾಯವಿದ್ದರೆ ಚಿಕಿತ್ಸಾಲಯಕ್ಕಾಗಿ ಕಾಯದೆ 112 ಅಥವಾ 108 ಕರೆ ಮಾಡಿ.',
    },
    href: '/offline',
    link: { en: 'Open cached demo hospitals', kn: 'ಉಳಿಸಿದ ಮಾದರಿ ಆಸ್ಪತ್ರೆಗಳನ್ನು ತೆರೆಯಿರಿ' },
  },
  {
    id: 'period',
    keywords: ['heavy period', 'soaking', 'ಮುಟ್ಟಿನ ರಕ್ತ', 'ಋತುಚಕ್ರ'],
    title: { en: 'When is period bleeding urgent?', kn: 'ಮುಟ್ಟಿನ ರಕ್ತ ಯಾವಾಗ ತುರ್ತು?' },
    body: {
      en: 'Soaking through a pad every hour for several hours, fainting, or severe pain needs emergency care now. Other heavy or painful periods should be written down — dates, clots, and how many pads — and shown to a clinician. A log cannot tell the cause, including endometriosis.',
      kn: 'ಹಲವು ಗಂಟೆಗಳ ಕಾಲ ಪ್ರತಿ ಗಂಟೆಗೆ ಪ್ಯಾಡ್ ನೆನೆಯುವುದು, ಮೂರ್ಛೆ, ಅಥವಾ ತೀವ್ರ ನೋವು ಇದ್ದರೆ ಈಗಲೇ ತುರ್ತು ಆರೈಕೆ. ಬೇರೆ ಭಾರಿ ಅಥವಾ ನೋವಿನ ಮುಟ್ಟನ್ನು ದಿನಾಂಕ ಸಹಿತ ಬರೆದು ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ. ದಾಖಲೆ ಕಾರಣವನ್ನು ಹೇಳಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    },
    href: '/health/endo',
    link: { en: 'Open the symptom journal', kn: 'ಲಕ್ಷಣ ದಿನಚರಿ ತೆರೆಯಿರಿ' },
  },
  {
    id: 'bag',
    keywords: ['what to carry', 'what should i bring', 'visit bag', 'ಭೇಟಿಗೆ', 'ಏನು ತೆಗೆದುಕೊಳ್ಳ'],
    title: { en: 'What should I carry to a visit?', kn: 'ಭೇಟಿಗೆ ಏನು ತೆಗೆದುಕೊಳ್ಳಬಹುದು?' },
    body: {
      en: 'Bring old reports, the names of medicines you take, a list of symptoms with dates, your questions, and a water bottle. A Care Passport from this demo is a memory aid for a fictional profile. It is not a referral.',
      kn: 'ಹಳೆಯ ವರದಿಗಳು, ಔಷಧಿಗಳ ಹೆಸರು, ದಿನಾಂಕಗಳೊಂದಿಗೆ ಲಕ್ಷಣಗಳು, ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ನೀರಿನ ಬಾಟಲಿ ತನ್ನಿ. ಈ ಮಾದರಿಯ ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್ ನೆನಪಿನ ಸಹಾಯ. ಅದು ರೆಫರಲ್ ಅಲ್ಲ.',
    },
    href: '/passport',
    link: { en: 'Prepare a Care Passport', kn: 'ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಸಿದ್ಧಪಡಿಸಿ' },
  },
  {
    id: 'foods',
    keywords: ['iron-rich', 'iron rich', 'leafy', 'foods with iron', 'ಕಬ್ಬಿಣದ ಆಹಾರ', 'ಸೊಪ್ಪು'],
    title: { en: 'Which foods are often discussed for iron?', kn: 'ಕಬ್ಬಿಣದ ಬಗ್ಗೆ ಯಾವ ಆಹಾರಗಳನ್ನು ಹೇಳುತ್ತಾರೆ?' },
    body: {
      en: 'Leafy greens, lentils, beans, and, for people who eat them, eggs, meat, and fish are common examples. Guava, amla, or citrus with a meal is often mentioned because vitamin C helps the body take up iron from plants. Tea and coffee with the meal can reduce that uptake. This is general education. It is not a treatment and it is not a dose.',
      kn: 'ಸೊಪ್ಪು, ಬೇಳೆ, ಮತ್ತು ತಿನ್ನುವವರಿಗೆ ಮೊಟ್ಟೆ ಅಥವಾ ಮಾಂಸ ಸಾಮಾನ್ಯ ಉದಾಹರಣೆಗಳು. ನೆಲ್ಲಿಕಾಯಿ ಅಥವಾ ನಿಂಬೆ ಜಾತಿಯ ಹಣ್ಣನ್ನು ಊಟದೊಂದಿಗೆ ಹೇಳುವುದುಂಟು. ಊಟದೊಂದಿಗೆ ಚಹಾ ಅಥವಾ ಕಾಫಿ ಹೀರಿಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಬಹುದು. ಇದು ಸಾಮಾನ್ಯ ಶಿಕ್ಷಣ. ಚಿಕಿತ್ಸೆ ಅಥವಾ ಡೋಸ್ ಅಲ್ಲ.',
    },
    href: '/health/nutrition',
    link: { en: 'Open nutrition notes', kn: 'ಆಹಾರ ಟಿಪ್ಪಣಿಗಳನ್ನು ತೆರೆಯಿರಿ' },
  },
  {
    id: 'limits',
    keywords: ['what can you', 'what can this', 'cannot do', 'ನೀವು ಏನು', 'ಮಿತಿ'],
    title: { en: 'What can this assistant not do?', kn: 'ಈ ಸಹಾಯಕಿ ಏನು ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ?' },
    body: {
      en: 'It cannot diagnose, exclude a disease, read a photo as proof, prescribe, choose a dose, or change a clinician’s plan. Urgent rules on this device override any generated sentence. If you may be in danger, contact local emergency services.',
      kn: 'ಇದು ರೋಗ ನಿರ್ಣಯ ಮಾಡಲು, ರೋಗವನ್ನು ತಳ್ಳಿಹಾಕಲು, ಫೋಟೋವನ್ನು ಸಾಬೀತಾಗಿ ಓದಲು, ಔಷಧಿ ಬರೆಯಲು, ಡೋಸ್ ಆಯ್ಕೆಮಾಡಲು, ಅಥವಾ ವೈದ್ಯರ ಯೋಜನೆ ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಅಪಾಯವಿದ್ದರೆ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    },
    href: '/privacy',
    link: { en: 'Open privacy controls', kn: 'ಗೌಪ್ಯತೆ ನಿಯಂತ್ರಣ ತೆರೆಯಿರಿ' },
  },
  {
    id: 'offline-hospital',
    keywords: ['cached hospital', 'offline hospital', 'saved hospital', 'ಆಫ್‌ಲೈನ್ ಆಸ್ಪತ್ರೆ', 'ಉಳಿಸಿದ ಆಸ್ಪತ್ರೆ'],
    title: { en: 'Can I search hospitals without internet?', kn: 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಆಸ್ಪತ್ರೆ ಹುಡುಕಬಹುದೇ?' },
    body: {
      en: 'You can search the fictional directory that was last saved on this device. Phone numbers in that list are fake demo numbers. Bed counts, doctors, and traffic cannot be refreshed while you are offline. Read the last sync time before you rely on a number.',
      kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಕೊನೆಯದಾಗಿ ಉಳಿಸಿದ ಕಾಲ್ಪನಿಕ ಪಟ್ಟಿಯನ್ನು ಹುಡುಕಬಹುದು. ಆ ಸಂಖ್ಯೆಗಳು ನಕಲಿ ಮಾದರಿ ಸಂಖ್ಯೆಗಳು. ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಹಾಸಿಗೆ, ವೈದ್ಯರು, ಅಥವಾ ಸಂಚಾರವನ್ನು ನವೀಕರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಸಂಖ್ಯೆಯನ್ನು ನಂಬುವ ಮೊದಲು ಕೊನೆಯ ಸಿಂಕ್ ಸಮಯವನ್ನು ಓದಿ.',
    },
    href: '/offline',
    link: { en: 'Search the offline directory', kn: 'ಆಫ್‌ಲೈನ್ ಡೈರೆಕ್ಟರಿ ಹುಡುಕಿ' },
  },
  {
    id: 'anemia-word',
    keywords: ['what is anemia', 'what is anaemia', 'ರಕ್ತಹೀನತೆ ಎಂದರೇನು', 'ಅನೀಮಿಯಾ'],
    title: { en: 'What does anemia mean, in plain words?', kn: 'ರಕ್ತಹೀನತೆ ಎಂದರೆ ಸರಳವಾಗಿ ಏನು?' },
    body: {
      en: 'People use the word anemia when there are fewer healthy red blood cells, or less hemoglobin, than a reference expects. Only a clinician can say whether that word fits you. Symptoms such as tiredness overlap with many other conditions. A fingernail photo cannot decide it.',
      kn: 'ಉಲ್ಲೇಖಕ್ಕಿಂತ ಆರೋಗ್ಯಕರ ಕೆಂಪು ರಕ್ತ ಕಣಗಳು ಅಥವಾ ಹಿಮೋಗ್ಲೋಬಿನ್ ಕಡಿಮೆ ಇದ್ದಾಗ ರಕ್ತಹೀನತೆ ಎಂಬ ಪದವನ್ನು ಬಳಸುತ್ತಾರೆ. ಆ ಪದ ನಿಮಗೆ ಹೊಂದುತ್ತದೆಯೇ ಎಂದು ವೈದ್ಯರು ಮಾತ್ರ ಹೇಳಬಹುದು. ಆಯಾಸ ಬೇರೆ ಹಲವು ಸ್ಥಿತಿಗಳಲ್ಲಿಯೂ ಇರುತ್ತದೆ. ಉಗುರಿನ ಫೋಟೋ ಇದನ್ನು ನಿರ್ಧರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    },
    href: '/health/iron',
    link: { en: 'Open IronWise', kn: 'IronWise ತೆರೆಯಿರಿ' },
  },
  {
    id: 'flush',
    keywords: ['hot flash', 'hot flush', 'menopause', 'perimenopause', 'ಬಿಸಿ ಉಕ್ಕು', 'ರಜೋನಿವೃತ್ತಿ'],
    title: { en: 'What is a hot flush note for?', kn: 'ಬಿಸಿ ಉಕ್ಕುವಿಕೆಯ ಟಿಪ್ಪಣಿ ಯಾವುದಕ್ಕೆ?' },
    body: {
      en: 'Writing down sleep, mood, and flushes gives a clinician a timeline. It does not prove menopause. Bleeding after periods have stopped for a year should be assessed by a clinician, even if flushes are your main concern.',
      kn: 'ನಿದ್ರೆ, ಮನಸ್ಸು ಮತ್ತು ಬಿಸಿ ಉಕ್ಕುವಿಕೆಯನ್ನು ಬರೆದಿಡುವುದು ವೈದ್ಯರಿಗೆ ಕಾಲರೇಖೆ ಕೊಡುತ್ತದೆ. ಅದು ರಜೋನಿವೃತ್ತಿ ಎಂದು ಸಾಬೀತುಪಡಿಸುವುದಿಲ್ಲ. ಮುಟ್ಟು ಒಂದು ವರ್ಷ ನಿಂತ ನಂತರ ರಕ್ತಸ್ರಾವವಿದ್ದರೆ ವೈದ್ಯರ ಪರೀಕ್ಷೆ ಬೇಕು.',
    },
    href: '/health/meno',
    link: { en: 'Open MenoMap', kn: 'MenoMap ತೆರೆಯಿರಿ' },
  },
]

export function matchFaq(message: string) {
  const text = message.toLowerCase()
  let best: { faq: Faq; score: number } | null = null
  for (const faq of FAQS) {
    const score = faq.keywords.reduce((count, word) => count + (text.includes(word.toLowerCase()) ? 1 : 0), 0)
    if (score > 0 && (!best || score > best.score)) best = { faq, score }
  }
  return best?.faq ?? null
}

export function suggestLinks(message: string) {
  const text = message.toLowerCase()
  const links: { href: string; label: Copy }[] = []
  if (/hospital|ಆಸ್ಪತ್ರೆ|bed|traffic/.test(text)) links.push({ href: '/hospitals', label: { en: 'Open hospital finder', kn: 'ಆಸ್ಪತ್ರೆ ಹುಡುಕಾಟ ತೆರೆಯಿರಿ' } })
  if (/pregnan|ಗರ್ಭ|trimester/.test(text)) links.push({ href: '/health/mama', label: { en: 'Open MamaSignal', kn: 'MamaSignal ತೆರೆಯಿರಿ' } })
  if (/iron|anemia|anaemia|ಕಬ್ಬಿಣ|ರಕ್ತಹೀನ/.test(text)) links.push({ href: '/health/iron', label: { en: 'Open IronWise', kn: 'IronWise ತೆರೆಯಿರಿ' } })
  if (/report|hemoglobin|ಹಿಮೋಗ್ಲೋಬಿನ್|scan/.test(text)) links.push({ href: '/scan', label: { en: 'Open the report scanner', kn: 'ವರದಿ ಸ್ಕ್ಯಾನರ್ ತೆರೆಯಿರಿ' } })
  return links.slice(0, 3)
}

export const defaultFaqBody: Copy = {
  en: 'I can explain the health topics saved on this device, such as iron-rich foods, what to carry to a visit, or how the fictional hospital list works. I cannot diagnose or prescribe. If you feel very unwell, contact local emergency services.',
  kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ವಿಷಯಗಳನ್ನು ನಾನು ವಿವರಿಸಬಲ್ಲೆ — ಕಬ್ಬಿಣದ ಆಹಾರ, ಭೇಟಿಗೆ ಏನು ತೆಗೆದುಕೊಳ್ಳಬಹುದು, ಅಥವಾ ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆ ಪಟ್ಟಿ. ನಾನು ರೋಗ ನಿರ್ಣಯ ಮಾಡಲು ಅಥವಾ ಔಷಧಿ ಬರೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ. ತುಂಬಾ ಅಸ್ವಸ್ಥರಾಗಿದ್ದರೆ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
}
