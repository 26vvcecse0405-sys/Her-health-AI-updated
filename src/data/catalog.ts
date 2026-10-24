import type { Article, Copy } from '../types'
import type { SymptomChoice } from '../services/triage'

const reviewed = '24 Oct 2026'

export const mamaSymptoms: SymptomChoice[] = [
  { id: 'nausea', label: { en: 'Nausea', kn: 'ವಾಕರಿಕೆ' } },
  { id: 'heartburn', label: { en: 'Heartburn', kn: 'ಎದೆಯುರಿ' } },
  { id: 'back-pain', label: { en: 'Back pain', kn: 'ಬೆನ್ನು ನೋವು' } },
  { id: 'mild-headache', label: { en: 'Mild headache', kn: 'ಸೌಮ್ಯ ತಲೆನೋವು' } },
  { id: 'mood', label: { en: 'Mood change', kn: 'ಮನಸ್ಥಿತಿ ಬದಲಾವಣೆ' } },
  { id: 'swelling', label: { en: 'Swelling of feet', kn: 'ಪಾದದ ಊತ' } },
  {
    id: 'fever',
    label: { en: 'Fever', kn: 'ಜ್ವರ' },
    level: 'prompt',
    notice: {
      en: 'Fever in pregnancy needs prompt clinical advice today. If you are confused, very drowsy, or short of breath, contact emergency services now.',
      kn: 'ಗರ್ಭಾವಸ್ಥೆಯ ಜ್ವರಕ್ಕೆ ಇಂದು ವೈದ್ಯಕೀಯ ಸಲಹೆ ಬೇಕು. ಗೊಂದಲ, ತೀವ್ರ ನಿದ್ರೆ, ಅಥವಾ ಉಸಿರಾಟ ಕಷ್ಟವಿದ್ದರೆ ಈಗಲೇ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    },
  },
  {
    id: 'heavy-bleeding',
    label: { en: 'Heavy vaginal bleeding', kn: 'ತೀವ್ರ ಯೋನಿ ರಕ್ತಸ್ರಾವ' },
    level: 'emergency',
    notice: {
      en: 'Heavy vaginal bleeding in pregnancy is an emergency warning sign. Contact local emergency services now. Do not wait for this app to ask more questions.',
      kn: 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ತೀವ್ರ ಯೋನಿ ರಕ್ತಸ್ರಾವ ತುರ್ತು ಎಚ್ಚರಿಕೆ. ಈಗಲೇ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ಈ ಅಪ್ಲಿಕೇಶನ್ ಇನ್ನಷ್ಟು ಕೇಳುವವರೆಗೆ ಕಾಯಬೇಡಿ.',
    },
  },
  {
    id: 'headache-vision',
    label: { en: 'Severe headache with vision changes', kn: 'ತೀವ್ರ ತಲೆನೋವು ಮತ್ತು ದೃಷ್ಟಿ ಬದಲಾವಣೆ' },
    level: 'emergency',
    notice: {
      en: 'A severe headache with spots, blurring, or other vision change needs emergency care now, especially in the second half of pregnancy.',
      kn: 'ತೀವ್ರ ತಲೆನೋವಿನೊಂದಿಗೆ ಕಣ್ಣಲ್ಲಿ ಚುಕ್ಕೆ, ಮಸುಕು, ಅಥವಾ ದೃಷ್ಟಿ ಬದಲಾವಣೆ ಇದ್ದರೆ ಈಗಲೇ ತುರ್ತು ಆರೈಕೆ ಬೇಕು. ಗರ್ಭದ ಉತ್ತರಾರ್ಧದಲ್ಲಿ ಇದು ಮುಖ್ಯ.',
    },
  },
  {
    id: 'severe-pain',
    label: { en: 'Severe abdominal pain', kn: 'ತೀವ್ರ ಹೊಟ್ಟೆ ನೋವು' },
    level: 'emergency',
  },
  {
    id: 'reduced-movement',
    label: { en: 'Baby moving much less', kn: 'ಮಗು ತುಂಬಾ ಕಡಿಮೆ ಚಲಿಸುತ್ತಿದೆ' },
    level: 'emergency',
    notice: {
      en: 'A clear decrease in the baby’s movements needs same-hour assessment. Contact emergency care or the maternity unit now. Do not wait for a chatbot.',
      kn: 'ಮಗುವಿನ ಚಲನೆ ಸ್ಪಷ್ಟವಾಗಿ ಕಡಿಮೆಯಾದರೆ ಅದೇ ಗಂಟೆಯಲ್ಲಿ ಪರೀಕ್ಷೆ ಬೇಕು. ಈಗಲೇ ತುರ್ತು ಆರೈಕೆ ಅಥವಾ ಪ್ರಸವ ಘಟಕವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    },
  },
  { id: 'breathing', label: { en: 'Trouble breathing', kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ' }, level: 'emergency' },
  { id: 'seizure', label: { en: 'Seizure or collapse', kn: 'ಮೈಮರೆ ಅಥವಾ ಕುಸಿತ' }, level: 'emergency' },
  { id: 'self-harm', label: { en: 'Thoughts of self-harm', kn: 'ತನ್ನನ್ನು ನೋಯಿಸಿಕೊಳ್ಳುವ ಆಲೋಚನೆ' }, level: 'emergency' },
]

export const ironSymptoms: SymptomChoice[] = [
  { id: 'fatigue', label: { en: 'Fatigue', kn: 'ಆಯಾಸ' } },
  { id: 'dizziness', label: { en: 'Dizziness', kn: 'ತಲೆ ಸುತ್ತು' } },
  { id: 'cold', label: { en: 'Feeling unusually cold', kn: 'ಅಸಾಮಾನ್ಯ ಚಳಿ' } },
  { id: 'headache', label: { en: 'Headache', kn: 'ತಲೆನೋವು' } },
  { id: 'pale-self', label: { en: 'I look pale to myself', kn: 'ನನಗೆ ನಾನು ಬಿಳುಚಿಕೊಂಡಂತೆ ಕಾಣುತ್ತೇನೆ' } },
  { id: 'breathless', label: { en: 'Breathless on hills or stairs', kn: 'ಏರು ಅಥವಾ ಮೆಟ್ಟಿಲಲ್ಲಿ ಉಸಿರು ಕಟ್ಟುವಿಕೆ' } },
  { id: 'chest-pain', label: { en: 'Chest pain', kn: 'ಎದೆ ನೋವು' }, level: 'emergency' },
  { id: 'fainting', label: { en: 'Fainting', kn: 'ಮೂರ್ಛೆ' }, level: 'emergency' },
  { id: 'black-stools', label: { en: 'Black stools', kn: 'ಕಪ್ಪು ಮಲ' }, level: 'emergency', notice: { en: 'Black stools can be an emergency, especially with dizziness or fainting. Contact emergency services now. Do not start an iron medicine because of this screen.', kn: 'ಕಪ್ಪು ಮಲ, ವಿಶೇಷವಾಗಿ ತಲೆಸುತ್ತು ಅಥವಾ ಮೂರ್ಛೆಯೊಂದಿಗೆ, ತುರ್ತು ಆಗಬಹುದು. ಈಗಲೇ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ಈ ಪರದೆಯಿಂದ ಕಬ್ಬಿಣದ ಔಷಧ ಆರಂಭಿಸಬೇಡಿ.' } },
  { id: 'severe-breathless', label: { en: 'Severe breathlessness at rest', kn: 'ವಿಶ್ರಾಂತಿಯಲ್ಲಿಯೂ ತೀವ್ರ ಉಸಿರಾಟ ಕಷ್ಟ' }, level: 'emergency' },
]

export const endoSymptoms: SymptomChoice[] = [
  { id: 'pelvic-pain', label: { en: 'Pelvic pain', kn: 'ಶ್ರೋಣಿ ನೋವು' } },
  { id: 'period-pain', label: { en: 'Pain with a period', kn: 'ಮುಟ್ಟಿನ ನೋವು' } },
  { id: 'bowel-pain', label: { en: 'Pain with bowel movements', kn: 'ಮಲ ವಿಸರ್ಜನೆಯಾಗುವಾಗ ನೋವು' } },
  { id: 'fatigue', label: { en: 'Fatigue', kn: 'ಆಯಾಸ' } },
  { id: 'spotting', label: { en: 'Spotting', kn: 'ಚುಕ್ಕೆ ರಕ್ತಸ್ರಾವ' } },
  { id: 'back-pain', label: { en: 'Lower back pain', kn: 'ಸೊಂಟ ನೋವು' } },
  {
    id: 'heavy-bleeding',
    label: { en: 'Soaking through a pad every hour', kn: 'ಪ್ರತಿ ಗಂಟೆಗೆ ಪ್ಯಾಡ್ ನೆನೆಯುವಷ್ಟು ರಕ್ತ' },
    level: 'emergency',
    notice: {
      en: 'Bleeding that soaks through a pad every hour for several hours, or bleeding with fainting, needs emergency care now. A symptom log cannot tell whether this is endometriosis.',
      kn: 'ಹಲವು ಗಂಟೆಗಳ ಕಾಲ ಪ್ರತಿ ಗಂಟೆಗೆ ಪ್ಯಾಡ್ ನೆನೆಯುವ ರಕ್ತಸ್ರಾವ, ಅಥವಾ ಮೂರ್ಛೆಯೊಂದಿಗೆ ರಕ್ತಸ್ರಾವ, ಈಗಲೇ ತುರ್ತು ಆರೈಕೆ ಬೇಕು. ಲಕ್ಷಣ ದಾಖಲೆ ಎಂಡೋಮೆಟ್ರಿಯೋಸಿಸ್ ಎಂದು ಹೇಳಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    },
  },
  { id: 'fainting', label: { en: 'Fainting', kn: 'ಮೂರ್ಛೆ' }, level: 'emergency' },
]

export const menoSymptoms: SymptomChoice[] = [
  { id: 'hot-flash', label: { en: 'Hot flush', kn: 'ಬಿಸಿ ಉಕ್ಕುವಿಕೆ' } },
  { id: 'sleep', label: { en: 'Sleep change', kn: 'ನಿದ್ರೆ ಬದಲಾವಣೆ' } },
  { id: 'mood', label: { en: 'Mood change', kn: 'ಮನಸ್ಥಿತಿ ಬದಲಾವಣೆ' } },
  { id: 'irregular', label: { en: 'Cycle becoming irregular', kn: 'ಋತುಚಕ್ರ ಅನಿಯಮಿತವಾಗುತ್ತಿದೆ' } },
  { id: 'dryness', label: { en: 'Vaginal dryness', kn: 'ಯೋನಿ ಒಣಗುವಿಕೆ' } },
  {
    id: 'post-bleeding',
    label: { en: 'Bleeding after periods had stopped', kn: 'ಮುಟ್ಟು ನಿಂತ ನಂತರ ರಕ್ತಸ್ರಾವ' },
    level: 'prompt',
    notice: {
      en: 'Bleeding after the periods have stopped needs a clinician’s assessment. It is not something to explain away in an app. If the bleeding is heavy or you feel faint, use emergency services now.',
      kn: 'ಮುಟ್ಟು ನಿಂತ ನಂತರದ ರಕ್ತಸ್ರಾವಕ್ಕೆ ವೈದ್ಯರ ಪರೀಕ್ಷೆ ಬೇಕು. ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಅದನ್ನು ಬಿಡಿಸಿ ಹೇಳಬೇಡಿ. ರಕ್ತ ಹೆಚ್ಚಿದ್ದರೆ ಅಥವಾ ಮೂರ್ಛೆ ಬಂದರೆ ಈಗಲೇ ತುರ್ತು ಸೇವೆಗೆ ಹೋಗಿ.',
    },
  },
  { id: 'chest-pain', label: { en: 'Chest pain', kn: 'ಎದೆ ನೋವು' }, level: 'emergency' },
  { id: 'weakness', label: { en: 'Sudden one-sided weakness', kn: 'ಇದ್ದಕ್ಕಿದ್ದಂತೆ ಒಂದು ಬದಿಯ ದುರ್ಬಲತೆ' }, level: 'emergency' },
]

export const wellnessSymptoms: SymptomChoice[] = [
  { id: 'low-mood', label: { en: 'Low mood', kn: 'ಕುಗ್ಗಿದ ಮನಸ್ಸು' } },
  { id: 'anxiety', label: { en: 'Anxiety', kn: 'ಆತಂಕ' } },
  { id: 'stress', label: { en: 'Stress', kn: 'ಒತ್ತಡ' } },
  { id: 'sleep', label: { en: 'Poor sleep', kn: 'ಕಡಿಮೆ ನಿದ್ರೆ' } },
  {
    id: 'self-harm',
    label: { en: 'Thoughts of self-harm', kn: 'ತನ್ನನ್ನು ನೋಯಿಸಿಕೊಳ್ಳುವ ಆಲೋಚನೆ' },
    level: 'emergency',
    notice: {
      en: 'If you may act on thoughts of harming yourself, contact local emergency services now. In India you can also call Tele-MANAS at 14416. You deserve help from a person, not only an app.',
      kn: 'ನಿಮ್ಮನ್ನು ನೋಯಿಸಿಕೊಳ್ಳುವ ಆಲೋಚನೆಯ ಮೇಲೆ ನೀವು ವರ್ತಿಸಬಹುದು ಎನಿಸಿದರೆ ಈಗಲೇ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ಭಾರತದಲ್ಲಿ Tele-MANAS 14416 ಗೆ ಕರೆ ಮಾಡಬಹುದು. ನಿಮಗೆ ವ್ಯಕ್ತಿಯ ಸಹಾಯ ಬೇಕು, ಅಪ್ಲಿಕೇಶನ್ ಮಾತ್ರವಲ್ಲ.',
    },
  },
]

export const skinSymptoms: SymptomChoice[] = [
  { id: 'itch', label: { en: 'Itch', kn: 'ತುರಿಕೆ' } },
  { id: 'rash', label: { en: 'New rash', kn: 'ಹೊಸ ದದ್ದು' } },
  { id: 'colour', label: { en: 'Colour change', kn: 'ಬಣ್ಣ ಬದಲಾವಣೆ' } },
  { id: 'mole', label: { en: 'A mole that looks different to me', kn: 'ನನಗೆ ಬೇರೆಯಾಗಿ ಕಾಣುವ ಮಚ್ಚೆ' } },
]

export const bodyAreas = [
  { id: 'head', label: { en: 'Head', kn: 'ತಲೆ' } },
  { id: 'chest', label: { en: 'Chest', kn: 'ಎದೆ' } },
  { id: 'abdomen', label: { en: 'Abdomen', kn: 'ಹೊಟ್ಟೆ' } },
  { id: 'pelvis', label: { en: 'Pelvis', kn: 'ಶ್ರೋಣಿ' } },
  { id: 'back', label: { en: 'Lower back', kn: 'ಸೊಂಟ' } },
  { id: 'legs', label: { en: 'Legs', kn: 'ಕಾಲುಗಳು' } },
  { id: 'joints', label: { en: 'Joints', kn: 'ಕೀಲುಗಳು' } },
]

export const pregnancyStages = [
  { id: 'unspecified', label: { en: 'Prefer not to say', kn: 'ಹೇಳಲು ಇಷ್ಟವಿಲ್ಲ' } },
  { id: 'trying', label: { en: 'Planning a pregnancy', kn: 'ಗರ್ಭ ಯೋಜನೆ' } },
  { id: 'trimester-1', label: { en: 'First trimester', kn: 'ಮೊದಲ ತ್ರೈಮಾಸಿಕ' } },
  { id: 'trimester-2', label: { en: 'Second trimester', kn: 'ಎರಡನೇ ತ್ರೈಮಾಸಿಕ' } },
  { id: 'trimester-3', label: { en: 'Third trimester', kn: 'ಮೂರನೇ ತ್ರೈಮಾಸಿಕ' } },
  { id: 'postpartum', label: { en: 'After birth', kn: 'ಹೆರಿಗೆಯ ನಂತರ' } },
]

export const stageEducation: Record<string, { body: Copy; source: string }> = {
  unspecified: {
    body: {
      en: 'You can log symptoms without naming a stage. Bring the dates and the words you use to a clinician. This app will not estimate a due date or a risk score.',
      kn: 'ಹಂತವನ್ನು ಹೇಳದೆಯೂ ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸಬಹುದು. ದಿನಾಂಕಗಳನ್ನು ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ. ಈ ಅಪ್ಲಿಕೇಶನ್ ಹೆರಿಗೆ ದಿನ ಅಥವಾ ಅಪಾಯದ ಅಂಕವನ್ನು ಲೆಕ್ಕಿಸುವುದಿಲ್ಲ.',
    },
    source: 'Demo education. Not a personal care plan.',
  },
  trying: {
    body: {
      en: 'People planning a pregnancy are often offered a conversation about folic acid, existing medicines, and vaccines. Ask a clinician before starting or stopping any supplement. Do not use this page to time intercourse or to confirm a pregnancy.',
      kn: 'ಗರ್ಭ ಯೋಜಿಸುವವರಿಗೆ ಫೋಲಿಕ್ ಆಮ್ಲ, ಈಗಿನ ಔಷಧಿಗಳು ಮತ್ತು ಲಸಿಕೆಗಳ ಬಗ್ಗೆ ಮಾತುಕತೆ ಸಾಮಾನ್ಯ. ಯಾವುದೇ ಪೂರಕವನ್ನು ಆರಂಭಿಸುವ ಅಥವಾ ನಿಲ್ಲಿಸುವ ಮೊದಲು ವೈದ್ಯರನ್ನು ಕೇಳಿ.',
    },
    source: 'General preconception education. Reviewed 24 Oct 2026.',
  },
  'trimester-1': {
    body: {
      en: 'Nausea and tiredness are commonly discussed in early pregnancy. They still deserve care if they stop you drinking, eating, or standing safely. Bleeding, severe pain, fainting, or one-sided pain need urgent assessment, not a home explanation.',
      kn: 'ಆರಂಭಿಕ ಗರ್ಭದಲ್ಲಿ ವಾಕರಿಕೆ ಮತ್ತು ಆಯಾಸ ಸಾಮಾನ್ಯವಾಗಿ ಚರ್ಚೆಯಾಗುತ್ತವೆ. ನೀರು, ಆಹಾರ, ಅಥವಾ ಸುರಕ್ಷಿತವಾಗಿ ನಿಲ್ಲುವುದು ನಿಂತರೆ ಆರೈಕೆ ಬೇಕು. ರಕ್ತಸ್ರಾವ, ತೀವ್ರ ನೋವು, ಮೂರ್ಛೆಗೆ ತುರ್ತು ಪರೀಕ್ಷೆ ಬೇಕು.',
    },
    source: 'Educational themes from public antenatal warning signs. Reviewed 24 Oct 2026.',
  },
  'trimester-2': {
    body: {
      en: 'Many people feel movement become familiar in this stage. A clear, lasting drop in movement needs same-day maternity assessment. Headache with vision change, or sudden swelling of the face with headache, also needs urgent care.',
      kn: 'ಈ ಹಂತದಲ್ಲಿ ಮಗುವಿನ ಚಲನೆ ಪರಿಚಿತವಾಗಬಹುದು. ಚಲನೆ ಸ್ಪಷ್ಟವಾಗಿ ಕಡಿಮೆಯಾದರೆ ಅದೇ ದಿನ ಪ್ರಸವ ತಪಾಸಣೆ ಬೇಕು. ದೃಷ್ಟಿ ಬದಲಾವಣೆಯೊಂದಿಗೆ ತಲೆನೋವು ಇದ್ದರೆ ತುರ್ತು ಆರೈಕೆ ಬೇಕು.',
    },
    source: 'Educational themes from public antenatal warning signs. Reviewed 24 Oct 2026.',
  },
  'trimester-3': {
    body: {
      en: 'Write down contractions, fluid, bleeding, and the baby’s movements in your own words. This page cannot tell labour from an emergency. Trouble breathing, heavy bleeding, seizure, or a severe headache with vision change means emergency care now.',
      kn: 'ನೋವು, ನೀರು, ರಕ್ತಸ್ರಾವ ಮತ್ತು ಮಗುವಿನ ಚಲನೆಯನ್ನು ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ ಬರೆಯಿರಿ. ಈ ಪುಟ ಪ್ರಸವವನ್ನು ತುರ್ತಿನಿಂದ ಬೇರ್ಪಡಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಉಸಿರಾಟ ಕಷ್ಟ, ತೀವ್ರ ರಕ್ತ, ಅಥವಾ ದೃಷ್ಟಿ ಬದಲಾವಣೆಯೊಂದಿಗೆ ತಲೆನೋವು ಇದ್ದರೆ ಈಗಲೇ ತುರ್ತು ಆರೈಕೆ.',
    },
    source: 'Educational themes from public antenatal warning signs. Reviewed 24 Oct 2026.',
  },
  postpartum: {
    body: {
      en: 'After birth, heavy bleeding, chest pain, trouble breathing, a severe headache, a red painful leg, or thoughts of harm need urgent help. Mood changes are common and still worth saying aloud to a clinician or a trusted person.',
      kn: 'ಹೆರಿಗೆಯ ನಂತರ ತೀವ್ರ ರಕ್ತಸ್ರಾವ, ಎದೆ ನೋವು, ಉಸಿರಾಟ ಕಷ್ಟ, ತೀವ್ರ ತಲೆನೋವು, ಅಥವಾ ನೋಯಿಸಿಕೊಳ್ಳುವ ಆಲೋಚನೆಗೆ ತುರ್ತು ಸಹಾಯ ಬೇಕು. ಮನಸ್ಥಿತಿ ಬದಲಾವಣೆಯನ್ನು ವೈದ್ಯರಿಗೆ ಹೇಳಿ.',
    },
    source: 'Educational themes from public postnatal warning signs. Reviewed 24 Oct 2026.',
  },
}

export const visitChecklist: Copy[] = [
  { en: 'Dates of symptoms, in your own words.', kn: 'ಲಕ್ಷಣಗಳ ದಿನಾಂಕಗಳು, ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ.' },
  { en: 'Medicines and supplements you already take. Do not change them for this visit.', kn: 'ನೀವು ಈಗ ತೆಗೆದುಕೊಳ್ಳುವ ಔಷಧಿ ಮತ್ತು ಪೂರಕಗಳು. ಭೇಟಿಗಾಗಿ ಅವುಗಳನ್ನು ಬದಲಾಯಿಸಬೇಡಿ.' },
  { en: 'Questions you want answered before you leave.', kn: 'ಹೊರಡುವ ಮೊದಲು ಉತ್ತರ ಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು.' },
  { en: 'A person who can help you remember, if you want one.', kn: 'ನೆನಪಿಡಲು ಸಹಾಯ ಮಾಡುವ ವ್ಯಕ್ತಿ, ನಿಮಗೆ ಬೇಕಾದರೆ.' },
]

export const medicineQuestions: Copy[] = [
  { en: 'What is this medicine for, in plain words?', kn: 'ಈ ಔಷಧಿ ಯಾವುದಕ್ಕೆ, ಸರಳ ಮಾತಿನಲ್ಲಿ?' },
  { en: 'Should I take it with food?', kn: 'ಇದನ್ನು ಆಹಾರದೊಂದಿಗೆ ತೆಗೆದುಕೊಳ್ಳಬೇಕೇ?' },
  { en: 'Which new symptoms mean I should stop and call you?', kn: 'ಯಾವ ಹೊಸ ಲಕ್ಷಣ ಬಂದರೆ ನಿಲ್ಲಿಸಿ ನಿಮಗೆ ಕರೆ ಮಾಡಬೇಕು?' },
  { en: 'Are there shop-bought medicines I should avoid?', kn: 'ಅಂಗಡಿಯಲ್ಲಿ ಕೊಳ್ಳುವ ಯಾವ ಔಷಧಿಗಳನ್ನು ತಪ್ಪಿಸಬೇಕು?' },
]

export const hubCards: { href: string; kicker: string; title: Copy; body: Copy }[] = [
  { href: '/health/mama', kicker: 'MamaSignal', title: { en: 'Pregnancy symptom navigator', kn: 'ಗರ್ಭಧಾರಣೆ ಲಕ್ಷಣ ಸಹಾಯ' }, body: { en: 'Log stage and symptoms. Urgent warning signs appear immediately, before any chat.', kn: 'ಹಂತ ಮತ್ತು ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸಿ. ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳು ಚಾಟ್‌ಗಿಂತ ಮೊದಲು ಕಾಣಿಸುತ್ತವೆ.' } },
  { href: '/health/iron', kicker: 'IronWise', title: { en: 'Iron and anemia education', kn: 'ಕಬ್ಬಿಣ ಮತ್ತು ರಕ್ತಹೀನತೆ ಶಿಕ್ಷಣ' }, body: { en: 'Summarize fatigue, optional diet notes, and lab numbers you type from a report.', kn: 'ಆಯಾಸ, ಐಚ್ಛಿಕ ಆಹಾರ ಟಿಪ್ಪಣಿ, ಮತ್ತು ವರದಿಯಿಂದ ನೀವು ಟೈಪ್ ಮಾಡುವ ಪ್ರಯೋಗಾಲಯ ಸಂಖ್ಯೆಗಳು.' } },
  { href: '/health/endo', kicker: 'EndoLens', title: { en: 'Pain and cycle journal', kn: 'ನೋವು ಮತ್ತು ಋತುಚಕ್ರ ದಿನಚರಿ' }, body: { en: 'Map pain, flow, and impact. Patterns here cannot confirm endometriosis.', kn: 'ನೋವು, ರಕ್ತಸ್ರಾವ ಮತ್ತು ದೈನಂದಿನ ಪರಿಣಾಮವನ್ನು ದಾಖಲಿಸಿ. ಇದು ಎಂಡೋಮೆಟ್ರಿಯೋಸಿಸ್ ಖಚಿತಪಡಿಸುವುದಿಲ್ಲ.' } },
  { href: '/health/meno', kicker: 'MenoMap', title: { en: 'Menopause companion', kn: 'ರಜೋನಿವೃತ್ತಿ ಸಹಚರ' }, body: { en: 'Track sleep, mood, flushes, and cycle changes, with a calendar.', kn: 'ನಿದ್ರೆ, ಮನಸ್ಸು, ಬಿಸಿ ಉಕ್ಕುವಿಕೆ ಮತ್ತು ಋತುಚಕ್ರ ಬದಲಾವಣೆಯನ್ನು ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಇಡಿ.' } },
  { href: '/health/timeline', kicker: 'Timeline', title: { en: 'Women’s health timeline', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ಕಾಲರೇಖೆ' }, body: { en: 'Filter every saved note and choose what a summary may include.', kn: 'ಉಳಿಸಿದ ಎಲ್ಲಾ ಟಿಪ್ಪಣಿಗಳನ್ನು ಶೋಧಿಸಿ, ಸಾರಾಂಶದಲ್ಲಿ ಏನು ಇರಬೇಕು ಎಂದು ಆಯ್ಕೆಮಾಡಿ.' } },
  { href: '/health/skin', kicker: 'SkinTrack', title: { en: 'Skin change journal', kn: 'ಚರ್ಮ ಬದಲಾವಣೆ ದಿನಚರಿ' }, body: { en: 'Describe a change in words. Photos are stored only on this device and are not interpreted.', kn: 'ಬದಲಾವಣೆಯನ್ನು ಮಾತಿನಲ್ಲಿ ಬರೆಯಿರಿ. ಫೋಟೋ ಈ ಸಾಧನದಲ್ಲೇ ಉಳಿಯುತ್ತದೆ. ಅದನ್ನು ಓದಲಾಗುವುದಿಲ್ಲ.' } },
  { href: '/health/wellness', kicker: 'Wellness', title: { en: 'Mental wellness check-in', kn: 'ಮಾನಸಿಕ ಯೋಗಕ್ಷೇಮ' }, body: { en: 'A short mood note, plus immediate helplines if you select thoughts of self-harm.', kn: 'ಚಿಕ್ಕ ಮನಸ್ಥಿತಿ ಟಿಪ್ಪಣಿ. ಆತ್ಮಹಾನಿ ಆಲೋಚನೆ ಆರಿಸಿದರೆ ತಕ್ಷಣ ಸಹಾಯ ಸಂಖ್ಯೆಗಳು.' } },
  { href: '/health/screening', kicker: 'Screening', title: { en: 'Cancer awareness', kn: 'ಕ್ಯಾನ್ಸರ್ ಜಾಗೃತಿ' }, body: { en: 'What screening is for, and which changes should be examined. No personal risk score.', kn: 'ತಪಾಸಣೆ ಯಾವುದಕ್ಕೆ, ಯಾವ ಬದಲಾವಣೆಯನ್ನು ತೋರಿಸಬೇಕು. ವೈಯಕ್ತಿಕ ಅಪಾಯದ ಅಂಕವಿಲ್ಲ.' } },
  { href: '/health/nutrition', kicker: 'Nutrition', title: { en: 'Food across life stages', kn: 'ಜೀವನ ಹಂತಗಳ ಆಹಾರ' }, body: { en: 'Everyday food ideas. Not a diet prescription and not a supplement dose.', kn: 'ದೈನಂದಿನ ಆಹಾರ ಕಲ್ಪನೆಗಳು. ಆಹಾರ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಥವಾ ಪೂರಕದ ಡೋಸ್ ಅಲ್ಲ.' } },
  { href: '/health/anemia-lens', kicker: 'AnemiaLens', title: { en: 'Fingernail photo awareness', kn: 'ಉಗುರು ಫೋಟೋ ಜಾಗೃತಿ' }, body: { en: 'A guided photo check. The picture is not analysed and cannot diagnose anaemia.', kn: 'ಮಾರ್ಗದರ್ಶಿ ಫೋಟೋ ಪರಿಶೀಲನೆ. ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುವುದಿಲ್ಲ ಮತ್ತು ರಕ್ತಹೀನತೆ ನಿರ್ಣಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.' } },
  { href: '/health/reproductive', kicker: 'Private', title: { en: 'Pregnancy worry and contraception facts', kn: 'ಗರ್ಭದ ಚಿಂತೆ ಮತ್ತು ಗರ್ಭನಿರೋಧಕ ಮಾಹಿತಿ' }, body: { en: 'Time-sensitive emergency contraception and testing, without a personal prescription.', kn: 'ಸಮಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ತುರ್ತು ಗರ್ಭನಿರೋಧಕ ಮತ್ತು ಪರೀಕ್ಷೆ. ವೈಯಕ್ತಿಕ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಇಲ್ಲ.' } },
]

export const nutritionStages: { id: string; label: Copy; body: Copy }[] = [
  {
    id: 'adolescence',
    label: { en: 'Adolescence', kn: 'ಹರೆಯ' },
    body: {
      en: 'Regular meals, pulses, leafy greens, curd or milk if you use them, fruit, and iron-containing foods are common teaching points. Growth and heavy periods change what a clinician may discuss. This is not a meal plan for you.',
      kn: 'ನಿಯಮಿತ ಊಟ, ಬೇಳೆ, ಸೊಪ್ಪು, ಮೊಸರು ಅಥವಾ ಹಾಲು, ಹಣ್ಣು ಮತ್ತು ಕಬ್ಬಿಣವಿರುವ ಆಹಾರಗಳು ಸಾಮಾನ್ಯ ಬೋಧನೆ. ಇದು ನಿಮಗೆ ನಿಗದಿಪಡಿಸಿದ ಊಟದ ಯೋಜನೆಯಲ್ಲ.',
    },
  },
  {
    id: 'pregnancy',
    label: { en: 'Pregnancy', kn: 'ಗರ್ಭಧಾರಣೆ' },
    body: {
      en: 'Cooked food, safe water, and folic acid or iron decisions belong with a clinician. This app will not tell you how many tablets to take. Guava, amla, or citrus with a meal is a common education point about vitamin C and plant iron. It does not treat anemia.',
      kn: 'ಬೇಯಿಸಿದ ಆಹಾರ, ಸುರಕ್ಷಿತ ನೀರು, ಫೋಲಿಕ್ ಆಮ್ಲ ಅಥವಾ ಕಬ್ಬಿಣದ ನಿರ್ಧಾರ ವೈದ್ಯರದು. ಎಷ್ಟು ಮಾತ್ರೆ ಎಂದು ಈ ಅಪ್ಲಿಕೇಶನ್ ಹೇಳುವುದಿಲ್ಲ. ನೆಲ್ಲಿಕಾಯಿ ಅಥವಾ ನಿಂಬೆ ಜಾತಿಯ ಹಣ್ಣು ಊಟದೊಂದಿಗೆ ಸಾಮಾನ್ಯ ಶಿಕ್ಷಣ. ಅದು ರಕ್ತಹೀನತೆಯ ಚಿಕಿತ್ಸೆಯಲ್ಲ.',
    },
  },
  {
    id: 'menopause',
    label: { en: 'Menopause', kn: 'ರಜೋನಿವೃತ್ತಿ' },
    body: {
      en: 'Calcium-containing foods, protein, and a conversation about bones, bleeding, and sleep are common topics. New bleeding after periods stop still needs a clinician, whatever you eat.',
      kn: 'ಕ್ಯಾಲ್ಸಿಯಂ ಇರುವ ಆಹಾರ, ಪ್ರೋಟೀನ್, ಮೂಳೆ, ರಕ್ತಸ್ರಾವ ಮತ್ತು ನಿದ್ರೆಯ ಮಾತುಕತೆ ಸಾಮಾನ್ಯ. ಮುಟ್ಟು ನಿಂತ ನಂತರದ ಹೊಸ ರಕ್ತಸ್ರಾವಕ್ಕೆ ವೈದ್ಯರು ಬೇಕು.',
    },
  },
]

export const screeningPoints: { title: Copy; body: Copy }[] = [
  {
    title: { en: 'Cervical screening', kn: 'ಗರ್ಭಕಂಠ ತಪಾಸಣೆ' },
    body: {
      en: 'Cervical screening looks for changes before a person feels ill. The test, the age, and the interval depend on the local program. Ask a primary health centre which test is offered where you live. This page does not calculate your risk and does not read a photograph.',
      kn: 'ಗರ್ಭಕಂಠ ತಪಾಸಣೆ ಅನಾರೋಗ್ಯ ಕಾಣುವ ಮೊದಲು ಬದಲಾವಣೆಗಳನ್ನು ನೋಡುತ್ತದೆ. ಪರೀಕ್ಷೆ, ವಯಸ್ಸು ಮತ್ತು ಅಂತರ ಸ್ಥಳೀಯ ಕಾರ್ಯಕ್ರಮವನ್ನು ಅವಲಂಬಿಸಿವೆ. ನಿಮ್ಮ ಊರಿನಲ್ಲಿ ಯಾವ ಪರೀಕ್ಷೆ ಇದೆ ಎಂದು ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರದಲ್ಲಿ ಕೇಳಿ.',
    },
  },
  {
    title: { en: 'Breast changes', kn: 'ಸ್ತನ ಬದಲಾವಣೆಗಳು' },
    body: {
      en: 'Knowing what is usual for you is different from a diagnosis. A new lump, skin dimpling, nipple discharge, or a change that stays should be examined. This app does not interpret breast or skin photos.',
      kn: 'ನಿಮಗೆ ಸಾಮಾನ್ಯವಾದುದನ್ನು ತಿಳಿದಿರುವುದು ರೋಗ ನಿರ್ಣಯವಲ್ಲ. ಹೊಸ ಗಂಟು, ಚರ್ಮ ಸೆಳೆತ, ಮೊಲೆಯಿಂದ ಸ್ರಾವ, ಅಥವಾ ಉಳಿಯುವ ಬದಲಾವಣೆಯನ್ನು ತೋರಿಸಿ. ಈ ಅಪ್ಲಿಕೇಶನ್ ಫೋಟೋ ಓದುವುದಿಲ್ಲ.',
    },
  },
  {
    title: { en: 'Questions to ask', kn: 'ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು' },
    body: {
      en: 'Which screening, if any, is offered at my age? Where is it done? What will you do if the result is unclear? A paper result still belongs to a clinician’s explanation.',
      kn: 'ನನ್ನ ವಯಸ್ಸಿಗೆ ಯಾವ ತಪಾಸಣೆ ಇದೆ? ಅದು ಎಲ್ಲಿ ನಡೆಯುತ್ತದೆ? ಫಲಿತಾಂಶ ಸ್ಪಷ್ಟವಿಲ್ಲದಿದ್ದರೆ ಏನು ಮಾಡುತ್ತೀರಿ?',
    },
  },
]

export const ARTICLES: Article[] = [
  {
    kind: 'article',
    id: 'article-warning',
    title: { en: 'Pregnancy warning signs saved on this device', kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಗರ್ಭಧಾರಣೆ ಎಚ್ಚರಿಕೆಗಳು' },
    body: stageEducation['trimester-3']!.body,
    source: 'Public antenatal warning-sign themes. Not a complete protocol.',
    reviewed,
    href: '/health/mama',
  },
  {
    kind: 'article',
    id: 'article-iron',
    title: { en: 'Iron education saved on this device', kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಕಬ್ಬಿಣ ಶಿಕ್ಷಣ' },
    body: {
      en: 'Fatigue has many causes. Iron deficiency is one possibility a clinician can test. Leafy greens, pulses, and, for people who eat them, eggs, meat, or fish are common food sources. Tea or coffee with the meal can reduce absorption of plant iron. None of this diagnoses anemia or sets a tablet dose. WHO has published haemoglobin cutoffs used in public-health definitions; pregnancy uses different cutoffs, and your own laboratory’s printed interval is the one on your report.',
      kn: 'ಆಯಾಸಕ್ಕೆ ಹಲವು ಕಾರಣಗಳಿವೆ. ಕಬ್ಬಿಣ ಕೊರತೆ ಅವುಗಳಲ್ಲಿ ಒಂದು ಸಾಧ್ಯತೆ; ಅದನ್ನು ವೈದ್ಯರು ಪರೀಕ್ಷಿಸಬಹುದು. ಸೊಪ್ಪು, ಬೇಳೆ, ಮತ್ತು ತಿನ್ನುವವರಿಗೆ ಮೊಟ್ಟೆ ಅಥವಾ ಮಾಂಸ ಸಾಮಾನ್ಯ ಆಹಾರಗಳು. ಊಟದೊಂದಿಗೆ ಚಹಾ ಅಥವಾ ಕಾಫಿ ಸಸ್ಯ ಕಬ್ಬಿಣದ ಹೀರಿಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಬಹುದು. ಇದು ರಕ್ತಹೀನತೆಯ ನಿರ್ಣಯವಲ್ಲ, ಮಾತ್ರೆಯ ಡೋಸ್ ಅಲ್ಲ.',
    },
    source: 'General nutrition education and public haemoglobin-cutoff context. Reviewed 24 Oct 2026.',
    reviewed,
    href: '/health/iron',
  },
  {
    kind: 'article',
    id: 'article-visit',
    title: { en: 'What to carry to a visit', kn: 'ಭೇಟಿಗೆ ಏನು ತೆಗೆದುಕೊಳ್ಳಬಹುದು' },
    body: {
      en: 'Bring old reports, a list of medicines, your symptom dates, and your questions. A phone summary is a memory aid. It is not a referral letter.',
      kn: 'ಹಳೆಯ ವರದಿಗಳು, ಔಷಧಿ ಪಟ್ಟಿ, ಲಕ್ಷಣಗಳ ದಿನಾಂಕಗಳು ಮತ್ತು ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ತನ್ನಿ. ಫೋನ್ ಸಾರಾಂಶ ನೆನಪಿನ ಸಹಾಯ. ಅದು ರೆಫರಲ್ ಪತ್ರವಲ್ಲ.',
    },
    source: 'Demo visit-prep card. Reviewed 24 Oct 2026.',
    reviewed,
    href: '/passport',
  },
  {
    kind: 'article',
    id: 'article-phc',
    title: { en: 'What a primary health centre is', kn: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಎಂದರೇನು' },
    body: {
      en: 'A primary health centre is often the first government clinic in a rural area. Services vary by place and by day. The Malenahalli centre in this demo is fictional. For an emergency, use 112 or 108 rather than waiting for a clinic to open.',
      kn: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಹಲವು ಗ್ರಾಮ ಪ್ರದೇಶಗಳ ಮೊದಲ ಸರ್ಕಾರಿ ಚಿಕಿತ್ಸಾಲಯ. ಸೇವೆಗಳು ಊರಿಗೆ ಮತ್ತು ದಿನಕ್ಕೆ ಬದಲಾಗುತ್ತವೆ. ಈ ಮಾದರಿಯ ಮಾಲೇನಹಳ್ಳಿ ಕೇಂದ್ರ ಕಾಲ್ಪನಿಕ. ತುರ್ತಿನಲ್ಲಿ ಚಿಕಿತ್ಸಾಲಯ ತೆರೆಯುವವರೆಗೆ ಕಾಯದೆ 112 ಅಥವಾ 108 ಬಳಸಿ.',
    },
    source: 'Civic orientation for the demo. Not a government directory.',
    reviewed,
    href: '/offline',
  },
]

export const interests = [
  { id: 'pregnancy', label: { en: 'Pregnancy', kn: 'ಗರ್ಭಧಾರಣೆ' } },
  { id: 'iron', label: { en: 'Iron health', kn: 'ಕಬ್ಬಿಣದ ಆರೋಗ್ಯ' } },
  { id: 'endo', label: { en: 'Cycle pain', kn: 'ಋತುಚಕ್ರ ನೋವು' } },
  { id: 'menopause', label: { en: 'Menopause', kn: 'ರಜೋನಿವೃತ್ತಿ' } },
  { id: 'nutrition', label: { en: 'Food', kn: 'ಆಹಾರ' } },
  { id: 'wellness', label: { en: 'Mental wellness', kn: 'ಮಾನಸಿಕ ಯೋಗಕ್ಷೇಮ' } },
  { id: 'screening', label: { en: 'Screening', kn: 'ತಪಾಸಣೆ' } },
]
