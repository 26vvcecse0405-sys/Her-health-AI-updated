import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'

const cards = [
  {
    title: { en: 'Pregnancy tests', kn: 'ಗರ್ಭ ಪರೀಕ್ಷೆಗಳು' },
    body: { en: 'A urine test looks for a hormone that rises after implantation. Testing too early can be negative even when a pregnancy later becomes detectable. Repeat timing and blood tests are questions for a clinician or pharmacist, not for this app.', kn: 'ಮೂತ್ರ ಪರೀಕ್ಷೆ ಗರ್ಭಧಾರಣೆಯ ನಂತರ ಏರುವ ಹಾರ್ಮೋನ್ ಹುಡುಕುತ್ತದೆ. ಬೇಗ ಪರೀಕ್ಷಿಸಿದರೆ ನಂತರ ಗರ್ಭ ಕಾಣಿಸಿದರೂ ಋಣಾತ್ಮಕ ಬರಬಹುದು. ಪುನರಾವರ್ತನೆ ಮತ್ತು ರಕ್ತ ಪರೀಕ್ಷೆ ವೈದ್ಯರ ಅಥವಾ ಔಷಧಿಕಾರರ ಪ್ರಶ್ನೆ.' },
  },
  {
    title: { en: 'Contraception is not one thing', kn: 'ಗರ್ಭನಿರೋಧಕ ಒಂದೇ ವಿಧವಲ್ಲ' },
    body: { en: 'Methods reduce the chance of pregnancy by different amounts, and none of the everyday methods is a personal guarantee. Effectiveness depends on the method and on how it is used. A clinician or family-planning clinic can match a method to your health.', kn: 'ವಿಧಾನಗಳು ಗರ್ಭದ ಸಾಧ್ಯತೆಯನ್ನು ಬೇರೆ ಬೇರೆ ಪ್ರಮಾಣದಲ್ಲಿ ಕಡಿಮೆ ಮಾಡುತ್ತವೆ. ದೈನಂದಿನ ಯಾವ ವಿಧಾನವೂ ವೈಯಕ್ತಿಕ ಖಾತರಿಯಲ್ಲ. ಹೊಂದಾಣಿಕೆ ವೈದ್ಯರ ಅಥವಾ ಕುಟುಂಬ ಯೋಜನೆ ಚಿಕಿತ್ಸಾಲಯದ್ದು.' },
  },
  {
    title: { en: 'Emergency contraception is time-sensitive', kn: 'ತುರ್ತು ಗರ್ಭನಿರೋಧಕ ಸಮಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ' },
    body: { en: 'Some options work better the sooner they are used. What is suitable depends on health, timing, and other medicines. Ask a pharmacist or clinician promptly. This app will not choose a product or a dose for you.', kn: 'ಕೆಲವು ಆಯ್ಕೆಗಳು ಬೇಗ ಬಳಸಿದಷ್ಟು ಉತ್ತಮ. ಯಾವುದು ಸೂಕ್ತವೋ ಎಂಬುದು ಆರೋಗ್ಯ, ಸಮಯ ಮತ್ತು ಇತರ ಔಷಧಿಗಳನ್ನು ಅವಲಂಬಿಸಿದೆ. ಬೇಗ ಔಷಧಿಕಾರರು ಅಥವಾ ವೈದ್ಯರನ್ನು ಕೇಳಿ. ಈ ಅಪ್ಲಿಕೇಶನ್ ಉತ್ಪನ್ನ ಅಥವಾ ಡೋಸ್ ಆಯ್ಕೆಮಾಡುವುದಿಲ್ಲ.' },
  },
  {
    title: { en: 'Worry is not a failing', kn: 'ಚಿಂತೆ ದೋಷವಲ್ಲ' },
    body: { en: 'Waiting, uncertainty, and fear are common. You can talk with someone you trust. If the worry includes thoughts of harming yourself, contact local emergency services or Tele-MANAS at 14416. This page is private on this device and is not a counselling session.', kn: 'ಕಾಯುವುದು, ಅನಿಶ್ಚಿತತೆ ಮತ್ತು ಭಯ ಸಾಮಾನ್ಯ. ನೀವು ನಂಬುವವರೊಂದಿಗೆ ಮಾತನಾಡಬಹುದು. ನಿಮ್ಮನ್ನು ನೋಯಿಸಿಕೊಳ್ಳುವ ಆಲೋಚನೆ ಇದ್ದರೆ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆ ಅಥವಾ Tele-MANAS 14416 ಸಂಪರ್ಕಿಸಿ. ಈ ಪುಟ ಈ ಸಾಧನದಲ್ಲಿ ಖಾಸಗಿ. ಇದು ಸಲಹೆ ಅವಧಿಯಲ್ಲ.' },
  },
]

export function Reproductive() {
  const { snapshot } = useHealth()
  if (!snapshot) return null
  const lang = snapshot.profile.language
  return (
    <div className="grid gap-5">
      <PageIntro kicker={t(lang, { en: 'Private education', kn: 'ಖಾಸಗಿ ಶಿಕ್ಷಣ' })} title={t(lang, { en: 'Pregnancy worry and reproductive health', kn: 'ಗರ್ಭದ ಚಿಂತೆ ಮತ್ತು ಪ್ರಜನನ ಆರೋಗ್ಯ' })} lede={t(lang, { en: 'Plain information, without judgment. It does not tell you that you are or are not pregnant, and it does not prescribe contraception.', kn: 'ನಿರ್ಣಯವಿಲ್ಲದ ಸರಳ ಮಾಹಿತಿ. ನೀವು ಗರ್ಭಿಣಿ ಅಥವಾ ಅಲ್ಲ ಎಂದು ಹೇಳುವುದಿಲ್ಲ ಮತ್ತು ಗರ್ಭನಿರೋಧಕ ಬರೆಯುವುದಿಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <article key={card.title.en} className="light-panel">
            <h2 className="text-2xl">{t(lang, card.title)}</h2>
            <p className="mt-2 leading-7">{t(lang, card.body)}</p>
          </article>
        ))}
      </div>
      <p className="text-sm text-muted">{t(lang, { en: 'Source themes: WHO emergency contraception fact sheet, reviewed for this demo on 24 Oct 2026. Open the Health library for the original page.', kn: 'ಮೂಲ: WHO ತುರ್ತು ಗರ್ಭನಿರೋಧಕ ಮಾಹಿತಿ ಪುಟ. ಈ ಪ್ರದರ್ಶನಕ್ಕೆ 24 ಅಕ್ಟೋ 2026 ರಂದು ನೋಡಲಾಗಿದೆ. ಮೂಲ ಪುಟಕ್ಕೆ ಆರೋಗ್ಯ ಗ್ರಂಥಾಲಯ ತೆರೆಯಿರಿ.' })}</p>
    </div>
  )
}
