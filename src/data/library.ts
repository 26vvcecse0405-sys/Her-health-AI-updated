import type { Copy } from '../types'

export const resources: { id: string; category: Copy; title: Copy; summary: Copy; publisher: string; href: string; reviewed: string }[] = [
  {
    id: 'who-anaemia',
    category: { en: 'Women’s health', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ' },
    title: { en: 'Anaemia fact sheet', kn: 'ರಕ್ತಹೀನತೆ ಮಾಹಿತಿ ಪುಟ' },
    summary: { en: 'World Health Organization overview of anaemia, who it affects, and why blood tests matter. This app does not apply that page as a personal diagnosis.', kn: 'ವಿಶ್ವ ಆರೋಗ್ಯ ಸಂಸ್ಥೆಯ ರಕ್ತಹೀನತೆ ಅವಲೋಕನ. ಈ ಅಪ್ಲಿಕೇಶನ್ ಅದನ್ನು ವೈಯಕ್ತಿಕ ರೋಗ ನಿರ್ಣಯವಾಗಿ ಬಳಸುವುದಿಲ್ಲ.' },
    publisher: 'World Health Organization',
    href: 'https://www.who.int/news-room/fact-sheets/detail/anaemia',
    reviewed: '24 Oct 2026',
  },
  {
    id: 'who-ec',
    category: { en: 'Pregnancy', kn: 'ಗರ್ಭಧಾರಣೆ' },
    title: { en: 'Emergency contraception fact sheet', kn: 'ತುರ್ತು ಗರ್ಭನಿರೋಧಕ ಮಾಹಿತಿ' },
    summary: { en: 'Time-sensitive options exist. A pharmacist or clinician should advise on what is suitable. This app does not prescribe.', kn: 'ಸಮಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಆಯ್ಕೆಗಳಿವೆ. ಔಷಧಿಕಾರರು ಅಥವಾ ವೈದ್ಯರು ಸಲಹೆ ನೀಡಬೇಕು. ಈ ಅಪ್ಲಿಕೇಶನ್ ಔಷಧಿ ಬರೆಯುವುದಿಲ್ಲ.' },
    publisher: 'World Health Organization',
    href: 'https://www.who.int/news-room/fact-sheets/detail/emergency-contraception',
    reviewed: '24 Oct 2026',
  },
  {
    id: 'nhs-iron',
    category: { en: 'Medicine safety', kn: 'ಔಷಧಿ ಸುರಕ್ಷತೆ' },
    title: { en: 'Iron deficiency anaemia', kn: 'ಕಬ್ಬಿಣ ಕೊರತೆ ರಕ್ತಹೀನತೆ' },
    summary: { en: 'NHS explanation of symptoms, tests, and why treatment is individual. Do not copy a dose from this page.', kn: 'ಲಕ್ಷಣ, ಪರೀಕ್ಷೆ ಮತ್ತು ಚಿಕಿತ್ಸೆ ವೈಯಕ್ತಿಕ ಎಂದು NHS ವಿವರಣೆ. ಇಲ್ಲಿಂದ ಡೋಸ್ ನಕಲಿಸಬೇಡಿ.' },
    publisher: 'National Health Service',
    href: 'https://www.nhs.uk/conditions/iron-deficiency-anaemia/',
    reviewed: '24 Oct 2026',
  },
  {
    id: 'telemanas',
    category: { en: 'Mental wellbeing', kn: 'ಮಾನಸಿಕ ಯೋಗಕ್ಷೇಮ' },
    title: { en: 'Tele-MANAS', kn: 'Tele-MANAS' },
    summary: { en: 'India’s public mental-health helpline. The published number in this app is 14416. This demo cannot place the call for you.', kn: 'ಭಾರತದ ಸಾರ್ವಜನಿಕ ಮಾನಸಿಕ ಆರೋಗ್ಯ ಸಹಾಯವಾಣಿ. ಈ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಪ್ರಕಟಿಸಿದ ಸಂಖ್ಯೆ 14416. ಈ ಮಾದರಿ ಕರೆ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.' },
    publisher: 'Ministry of Health and Family Welfare, India',
    href: 'https://telemanas.mohfw.gov.in/',
    reviewed: '24 Oct 2026',
  },
  {
    id: 'nci-cervical',
    category: { en: 'Preventive care', kn: 'ತಡೆಗಟ್ಟುವ ಆರೈಕೆ' },
    title: { en: 'Cervical screening overview', kn: 'ಗರ್ಭಕಂಠ ತಪಾಸಣೆ ಅವಲೋಕನ' },
    summary: { en: 'National Cancer Institute page on cervical screening. Screening decisions belong with a clinician. This is not a personal risk score.', kn: 'ಗರ್ಭಕಂಠ ತಪಾಸಣೆಯ ಬಗ್ಗೆ National Cancer Institute ಪುಟ. ನಿರ್ಧಾರ ವೈದ್ಯರದು. ಇದು ವೈಯಕ್ತಿಕ ಅಪಾಯದ ಅಂಕವಲ್ಲ.' },
    publisher: 'National Cancer Institute',
    href: 'https://www.cancer.gov/types/cervical/screening',
    reviewed: '24 Oct 2026',
  },
]

export const glossary: { term: string; meaning: Copy }[] = [
  { term: 'Haemoglobin', meaning: { en: 'A protein in red blood cells that carries oxygen. A number on a report is compared with that laboratory’s printed range. It is not, by itself, a diagnosis.', kn: 'ಕೆಂಪು ರಕ್ತ ಕಣಗಳಲ್ಲಿ ಆಮ್ಲಜನಕ ಒಯ್ಯುವ ಪ್ರೋಟೀನ್. ವರದಿಯ ಸಂಖ್ಯೆಯನ್ನು ಆ ಪ್ರಯೋಗಾಲಯದ ಮುದ್ರಿತ ವ್ಯಾಪ್ತಿಯೊಂದಿಗೆ ಹೋಲಿಸಿ. ಅದೇ ರೋಗ ನಿರ್ಣಯವಲ್ಲ.' } },
  { term: 'Ferritin', meaning: { en: 'A laboratory clue about stored iron. Ranges differ. This app will not turn a ferritin number into an iron-tablet dose.', kn: 'ಶೇಖರವಾದ ಕಬ್ಬಿಣದ ಬಗ್ಗೆ ಪ್ರಯೋಗಾಲಯ ಸುಳಿವು. ವ್ಯಾಪ್ತಿಗಳು ಬದಲಾಗುತ್ತವೆ. ಈ ಅಪ್ಲಿಕೇಶನ್ ಅದನ್ನು ಮಾತ್ರೆ ಡೋಸ್ ಆಗಿ ಮಾಡುವುದಿಲ್ಲ.' } },
  { term: 'Reference range', meaning: { en: 'The interval printed by the laboratory that produced the report. Another laboratory may print a different interval.', kn: 'ಆ ವರದಿ ಮಾಡಿದ ಪ್ರಯೋಗಾಲಯ ಮುದ್ರಿಸಿದ ವ್ಯಾಪ್ತಿ. ಬೇರೆ ಪ್ರಯೋಗಾಲಯ ಬೇರೆ ವ್ಯಾಪ್ತಿ ಮುದ್ರಿಸಬಹುದು.' } },
  { term: 'Primary health centre', meaning: { en: 'Often the first government clinic in a rural area. Services depend on the place and the staff on duty. The Malenahalli centre in this demo is fictional.', kn: 'ಹಲವು ಗ್ರಾಮ ಪ್ರದೇಶಗಳ ಮೊದಲ ಸರ್ಕಾರಿ ಚಿಕಿತ್ಸಾಲಯ. ಸೇವೆಗಳು ಊರು ಮತ್ತು ಸಿಬ್ಬಂದಿಯನ್ನು ಅವಲಂಬಿಸಿವೆ. ಈ ಮಾದರಿಯ ಮಾಲೇನಹಳ್ಳಿ ಕೇಂದ್ರ ಕಾಲ್ಪನಿಕ.' } },
  { term: 'Endometriosis', meaning: { en: 'A condition a clinician may consider when pain and bleeding follow a pattern. A symptom diary cannot confirm or exclude it.', kn: 'ನೋವು ಮತ್ತು ರಕ್ತಸ್ರಾವದ ಮಾದರಿಯನ್ನು ವೈದ್ಯರು ಪರಿಗಣಿಸಬಹುದಾದ ಸ್ಥಿತಿ. ಲಕ್ಷಣ ದಿನಚರಿ ಅದನ್ನು ಖಚಿತಪಡಿಸಲು ಅಥವಾ ತಳ್ಳಿಹಾಕಲು ಸಾಧ್ಯವಿಲ್ಲ.' } },
]
