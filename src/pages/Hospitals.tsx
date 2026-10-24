import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HospitalMap } from '../components/HospitalMap'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { HOSPITALS, origins } from '../data/hospitals'
import { t } from '../i18n'
import { concernFor, rankHospitals, type RankedHospital } from '../services/rank'
import type { CareNeed, Lang, TrafficLevel } from '../types'

const needs: { id: CareNeed; label: { en: string; kn: string } }[] = [
  { id: 'pregnancy', label: { en: 'Pregnancy care', kn: 'ಗರ್ಭಧಾರಣೆ ಆರೈಕೆ' } },
  { id: 'gynecology', label: { en: 'Gynecology', kn: 'ಸ್ತ್ರೀರೋಗ' } },
  { id: 'anemia', label: { en: 'Anemia / hematology', kn: 'ರಕ್ತಹೀನತೆ / ರಕ್ತಶಾಸ್ತ್ರ' } },
  { id: 'mental', label: { en: 'Mental health', kn: 'ಮಾನಸಿಕ ಆರೋಗ್ಯ' } },
  { id: 'general', label: { en: 'General medicine', kn: 'ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ' } },
  { id: 'emergency', label: { en: 'Emergency', kn: 'ತುರ್ತು' } },
  { id: 'any', label: { en: 'Any listed care', kn: 'ನಮೂದಿಸಿದ ಯಾವುದೇ ಆರೈಕೆ' } },
]

export function Hospitals() {
  const { snapshot, setLocation, setLocationEnabled, notify } = useHealth()
  const [params, setParams] = useSearchParams()
  const [traffic, setTraffic] = useState<TrafficLevel>('heavy')
  const [active, setActive] = useState('greenfield')
  const [picked, setPicked] = useState<string[]>(['greenfield', 'taluk', 'phc'])
  const [query, setQuery] = useState('')
  const [geoNote, setGeoNote] = useState('')
  if (!snapshot) return null
  const lang = snapshot.profile.language
  const need = (params.get('need') as CareNeed) || 'pregnancy'
  const urgent = params.get('urgent') === '1' || need === 'emergency'
  const list = snapshot.hospitals.length ? snapshot.hospitals : HOSPITALS
  const ranked = rankHospitals(snapshot.profile.locationId, traffic, concernFor(need, urgent), list)
  const nearest = [...ranked].sort((a, b) => a.etaMinutes - b.etaMinutes)[0]
  const visible = ranked.filter((row) => `${row.hospital.name} ${row.hospital.area} ${row.hospital.specialties.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  const compared = ranked.filter((row) => picked.includes(row.hospital.id)).slice(0, 3)
  const origin = origins.find((item) => item.id === snapshot.profile.locationId) ?? origins[0]!

  function toggle(id: string) {
    setPicked((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= 3) {
        notify(t(lang, { en: 'Compare up to three hospitals.', kn: 'ಮೂರು ಆಸ್ಪತ್ರೆಗಳವರೆಗೆ ಹೋಲಿಸಿ.' }), 'warn')
        return current
      }
      return [...current, id]
    })
  }

  return (
    <div className="grid gap-5">
      <PageIntro kicker={t(lang, { en: 'Smart hospital finder', kn: 'ಸ್ಮಾರ್ಟ್ ಆಸ್ಪತ್ರೆ ಹುಡುಕಾಟ' })} title={t(lang, { en: 'Explainable, traffic-aware matches', kn: 'ವಿವರಿಸಬಹುದಾದ, ಸಂಚಾರ-ಅರಿವಿನ ಹೊಂದಾಣಿಕೆಗಳು' })} lede={t(lang, { en: 'Fictional hospitals and simulated traffic. A farther hospital can rank above a nearer one when the route is faster or the needed service is listed. Missing data does not earn points.', kn: 'ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ಅನುಕರಿಸಿದ ಸಂಚಾರ. ಬೇಕಾದ ಸೇವೆ ಇದ್ದರೆ ಅಥವಾ ದಾರಿ ವೇಗವಾಗಿದ್ದರೆ ದೂರದ ಆಸ್ಪತ್ರೆ ಮೇಲೆ ಬರಬಹುದು. ಇಲ್ಲದ ಮಾಹಿತಿಗೆ ಅಂಕ ಸಿಗುವುದಿಲ್ಲ.' })} />
      <SafetyNote lang={lang} />
      {urgent ? <p className="banner urgent" role="alert">{t(lang, { en: 'If this is an emergency, contact local services now. The list below is a fictional demo, not dispatch.', kn: 'ಇದು ತುರ್ತಾದರೆ ಈಗಲೇ ಸ್ಥಳೀಯ ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ಕೆಳಗಿನ ಪಟ್ಟಿ ಕಾಲ್ಪನಿಕ ಪ್ರದರ್ಶನ, ರವಾನೆಯಲ್ಲ.' })}</p> : null}
      {snapshot.meta.simulatedOffline || !navigator.onLine ? <p className="banner sim">{t(lang, { en: 'Offline or simulated offline: ETAs are the on-device traffic model, not a live road service. Beds and doctors are last-synced demo values and may be stale.', kn: 'ಆಫ್‌ಲೈನ್ ಅಥವಾ ಅನುಕರಣೆ: ETA ಸಾಧನದ ಸಂಚಾರ ಮಾದರಿ, ನೇರ ರಸ್ತೆ ಸೇವೆಯಲ್ಲ. ಹಾಸಿಗೆ ಮತ್ತು ವೈದ್ಯರು ಕೊನೆಯ ಸಿಂಕ್‌ನ ಮಾದರಿ ಮೌಲ್ಯಗಳು. ಹಳೆಯದಾಗಿರಬಹುದು.' })}</p> : null}
      <div className="glass grid gap-4 p-4">
        <div className="flex flex-wrap gap-2">
          {origins.map((item) => (
            <button key={item.id} type="button" className="chip" aria-pressed={snapshot.profile.locationId === item.id} onClick={() => void setLocation(item.id)}>{t(lang, { en: item.label, kn: item.kn })}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {needs.map((item) => (
            <button key={item.id} type="button" className="chip" aria-pressed={need === item.id} onClick={() => setParams({ need: item.id, urgent: urgent ? '1' : '0' })}>{t(lang, item.label)}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(['light', 'moderate', 'heavy'] as TrafficLevel[]).map((level) => (
            <button key={level} type="button" className="chip" aria-pressed={traffic === level} onClick={() => setTraffic(level)}>{level}</button>
          ))}
          <button type="button" className="btn ghost" onClick={() => {
            if (!snapshot.profile.locationEnabled) {
              void setLocationEnabled(true)
            }
            if (!navigator.geolocation) {
              setGeoNote(t(lang, { en: 'This browser has no geolocation. Use a sample place.', kn: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸ್ಥಳ ಸೌಲಭ್ಯ ಇಲ್ಲ. ಮಾದರಿ ಸ್ಥಳ ಬಳಸಿ.' }))
              return
            }
            navigator.geolocation.getCurrentPosition(
              () => setGeoNote(t(lang, { en: 'A browser location was received and was not sent to a server. These hospitals stay fictional. They are not results for that GPS point.', kn: 'ಬ್ರೌಸರ್ ಸ್ಥಳ ಬಂದಿದೆ. ಅದನ್ನು ಸರ್ವರ್‌ಗೆ ಕಳುಹಿಸಿಲ್ಲ. ಈ ಆಸ್ಪತ್ರೆಗಳು ಕಾಲ್ಪನಿಕ. ಅವು ಆ GPS ಬಿಂದುವಿನ ಫಲಿತಾಂಶಗಳಲ್ಲ.' })),
              () => setGeoNote(t(lang, { en: 'Location permission was denied. Choose a sample place.', kn: 'ಸ್ಥಳ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಮಾದರಿ ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ.' })),
            )
          }}>{t(lang, { en: 'Use browser location', kn: 'ಬ್ರೌಸರ್ ಸ್ಥಳ ಬಳಸಿ' })}</button>
        </div>
        <input className="field max-w-md" value={query} placeholder={t(lang, { en: 'Filter by name or specialty', kn: 'ಹೆಸರು ಅಥವಾ ವಿಭಾಗದಿಂದ ಶೋಧಿಸಿ' })} onChange={(event) => setQuery(event.target.value)} />
        {geoNote ? <p className="text-sm text-muted">{geoNote}</p> : null}
        <p className="text-sm text-muted">{t(lang, { en: `Order: matching urgent and specialty needs first, then the partial score. ${nearest && ranked[0] && nearest.hospital.id !== ranked[0].hospital.id ? `${nearest.hospital.name} has the shorter estimate and is not first.` : 'The first result is also the shorter estimate in this run.'} Dataset updated 23 Oct 2026. Last local cache: ${snapshot.meta.hospitalsCachedAt ? new Date(snapshot.meta.hospitalsCachedAt).toLocaleString() : 'not saved'}.`, kn: 'ಕ್ರಮ: ತುರ್ತು ಮತ್ತು ವಿಭಾಗ ಹೊಂದಾಣಿಕೆ ಮೊದಲು, ನಂತರ ಭಾಗಶಃ ಅಂಕ. ಡೇಟಾ 23 ಅಕ್ಟೋಬರ್ 2026. ಇದು ನೇರ ಮಾಹಿತಿಯಲ್ಲ.' })}</p>
      </div>
      <HospitalMap originId={snapshot.profile.locationId} ranked={visible} activeId={active} onPick={setActive} />
      <p className="text-sm text-muted">{t(lang, { en: origin.label, kn: origin.kn })} · {t(lang, { en: 'simulated', kn: 'ಅನುಕರಣೆ' })} {traffic}</p>
      {visible.length === 0 ? <p className="text-muted">{t(lang, { en: 'No fictional hospital in this demo matches that search. An empty list is not proof that care is unavailable.', kn: 'ಈ ಹುಡುಕಾಟಕ್ಕೆ ಈ ಮಾದರಿಯಲ್ಲಿ ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆ ಇಲ್ಲ. ಖಾಲಿ ಪಟ್ಟಿ ಆರೈಕೆ ಇಲ್ಲ ಎಂಬ ಸಾಬೀತಲ್ಲ.' })}</p> : null}
      <div className="grid gap-4">
        {visible.map((row, index) => (
          <HospitalCard key={row.hospital.id} row={row} index={index} lang={lang} active={active === row.hospital.id} picked={picked.includes(row.hospital.id)} onOpen={() => setActive(row.hospital.id)} onToggle={() => toggle(row.hospital.id)} />
        ))}
      </div>
      <section className="glass p-5">
        <h2 className="text-2xl">{t(lang, { en: 'Compare', kn: 'ಹೋಲಿಕೆ' })}</h2>
        {compared.length < 2 ? <p className="mt-2 text-muted">{t(lang, { en: 'Choose two or three hospitals.', kn: 'ಎರಡು ಅಥವಾ ಮೂರು ಆಸ್ಪತ್ರೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.' })}</p> : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr>
                  <th>{t(lang, { en: 'Hospital', kn: 'ಆಸ್ಪತ್ರೆ' })}</th>
                  <th>ETA</th>
                  <th>{t(lang, { en: 'Score', kn: 'ಅಂಕ' })}</th>
                  <th>{t(lang, { en: 'Specialty', kn: 'ವಿಭಾಗ' })}</th>
                  <th>{t(lang, { en: 'Beds', kn: 'ಹಾಸಿಗೆ' })}</th>
                  <th>{t(lang, { en: 'Doctors', kn: 'ವೈದ್ಯರು' })}</th>
                </tr>
              </thead>
              <tbody>
                {compared.map((row) => (
                  <tr key={row.hospital.id} className="align-top">
                    <td className="py-2 pr-3">{row.hospital.name}</td>
                    <td>{row.etaMinutes} min · {row.distanceKm} km</td>
                    <td>{row.score}{row.partial ? t(lang, { en: ' partial', kn: ' ಭಾಗಶಃ' }) : ''}</td>
                    <td>{row.hospital.specialties.join(', ')}</td>
                    <td>{row.hospital.bedsAvailable === null ? t(lang, { en: 'Not in record', kn: 'ದಾಖಲೆಯಲ್ಲಿ ಇಲ್ಲ' }) : `${row.hospital.bedsAvailable}/${row.hospital.bedsTotal}`}</td>
                    <td>{row.hospital.doctors === null ? t(lang, { en: 'Not verified', kn: 'ಖಚಿತಪಡಿಸಿಲ್ಲ' }) : row.hospital.doctors.map((doctor) => `${doctor.name} (${doctor.onDuty ? 'on duty' : 'not on duty'})`).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function HospitalCard({ row, index, lang, active, picked, onOpen, onToggle }: { row: RankedHospital; index: number; lang: Lang; active: boolean; picked: boolean; onOpen: () => void; onToggle: () => void }) {
  const hospital = row.hospital
  return (
    <article id={`hospital-${hospital.id}`} className="glass p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-teal">{t(lang, { en: `Match ${index + 1}`, kn: `ಹೊಂದಾಣಿಕೆ ${index + 1}` })} · {t(lang, { en: 'Fictional', kn: 'ಕಾಲ್ಪನಿಕ' })}</p>
          <h2 className="text-2xl">{hospital.name}</h2>
          <p className="text-muted">{hospital.area}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl">{row.etaMinutes}<span className="text-base"> min</span></p>
          <p className="text-sm text-muted">{row.distanceKm} km · {row.traffic}</p>
        </div>
      </div>
      <p className="mt-3">{row.partial
        ? t(lang, { en: `Partial score ${row.score} from ${row.factorsUsed.join(', ')}.`, kn: `ಭಾಗಶಃ ಅಂಕ ${row.score}. ಬಳಸಿದ ಅಂಶಗಳು: ${row.factorsUsed.join(', ')}.` })
        : t(lang, { en: `Score ${row.score} from ${row.factorsUsed.join(', ')}.`, kn: `ಅಂಕ ${row.score}. ಬಳಸಿದ ಅಂಶಗಳು: ${row.factorsUsed.join(', ')}.` })}{' '}{row.factorsMissing.length ? t(lang, { en: `Not scored, because the record lacks them: ${row.factorsMissing.join(', ')}.`, kn: `ಅಂಕ ನೀಡಿಲ್ಲ, ಏಕೆಂದರೆ ದಾಖಲೆಯಲ್ಲಿ ಇಲ್ಲ: ${row.factorsMissing.join(', ')}.` }) : null}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {hospital.specialties.map((item) => <span key={item} className="pill info">{item}</span>)}
        {hospital.services.includes('Emergency') ? <span className="pill warn">Emergency</span> : null}
      </div>
      <p className="mt-3 text-sm leading-6">
        {t(lang, { en: 'Beds', kn: 'ಹಾಸಿಗೆ' })}: {hospital.bedsAvailable === null ? t(lang, { en: 'not in the demo record', kn: 'ಮಾದರಿ ದಾಖಲೆಯಲ್ಲಿ ಇಲ್ಲ' }) : `${hospital.bedsAvailable}/${hospital.bedsTotal}`}
        {' · '}
        {t(lang, { en: 'Doctors', kn: 'ವೈದ್ಯರು' })}: {hospital.doctors === null ? t(lang, { en: 'not verified', kn: 'ಖಚಿತಪಡಿಸಿಲ್ಲ' }) : hospital.doctors.map((doctor) => `${doctor.name}, ${doctor.specialty}, ${doctor.onDuty ? 'on duty in demo' : 'on-duty not confirmed'}`).join('; ')}
        {' · '}
        {t(lang, { en: 'Cost band', kn: 'ವೆಚ್ಚದ ಗುಂಪು' })}: {hospital.costBand ?? t(lang, { en: 'unknown', kn: 'ತಿಳಿದಿಲ್ಲ' })}
      </p>
      <p className="mt-2 text-sm text-muted">{hospital.accessibility.join(' · ')} · {t(lang, { en: 'Demo phone, not a real switchboard:', kn: 'ಮಾದರಿ ಫೋನ್, ನಿಜವಾದ ಕೇಂದ್ರವಲ್ಲ:' })} {hospital.phone}</p>
      <p className="mt-1 text-sm text-muted">{t(lang, { en: `Record timestamp ${hospital.updatedAt}. Source: bundled fictional dataset.`, kn: `ದಾಖಲೆ ಸಮಯ ${hospital.updatedAt}. ಮೂಲ: ಜೋಡಿಸಿದ ಕಾಲ್ಪನಿಕ ಡೇಟಾ.` })}</p>
      <div className="mt-3 grid gap-2">
        {row.routes.map((route) => (
          <p key={route.id} className={route.id === row.chosenRoute.id ? 'text-teal' : 'text-muted'}>
            {route.label}: {route.km} km, ~{route.etaMinutes} min {route.id === row.chosenRoute.id ? t(lang, { en: '(chosen estimate)', kn: '(ಆಯ್ಕೆಯ ಅಂದಾಜು)' }) : ''}
          </p>
        ))}
      </div>
      {active ? (
        <div className="mt-4 rounded-2xl border border-line p-3">
          <h3 className="text-lg">{t(lang, { en: 'Why this match?', kn: 'ಏಕೆ ಈ ಹೊಂದಾಣಿಕೆ?' })}</h3>
          <ul className="mt-2 list-disc pl-5 leading-7">
            {row.reasons.map((reason) => <li key={reason.code}>{t(lang, reason)}</li>)}
          </ul>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn ghost" onClick={onOpen}>{t(lang, { en: 'Why this match?', kn: 'ಏಕೆ ಈ ಹೊಂದಾಣಿಕೆ?' })}</button>
        <button type="button" className="btn ghost" aria-pressed={picked} onClick={onToggle}>{picked ? t(lang, { en: 'Remove from compare', kn: 'ಹೋಲಿಕೆಯಿಂದ ತೆಗೆಯಿರಿ' }) : t(lang, { en: 'Add to compare', kn: 'ಹೋಲಿಕೆಗೆ ಸೇರಿಸಿ' })}</button>
        <button type="button" className="btn quiet" onClick={() => void navigator.clipboard.writeText(hospital.phone)}>{t(lang, { en: 'Copy demo number', kn: 'ಮಾದರಿ ಸಂಖ್ಯೆ ನಕಲಿಸಿ' })}</button>
      </div>
    </article>
  )
}
