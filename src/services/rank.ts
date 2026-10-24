import { HOSPITALS } from '../data/hospitals'
import type { Concern, Hospital, OriginId, RouteDef, TrafficLevel } from '../types'

export type FactorId = 'travel' | 'specialty' | 'beds' | 'doctor' | 'affordability'

export type Reason = { code: string; en: string; kn: string }

export type ScoredRoute = RouteDef & { etaMinutes: number }

export type RankedHospital = {
  hospital: Hospital
  etaMinutes: number
  distanceKm: number
  traffic: TrafficLevel
  chosenRoute: ScoredRoute
  routes: ScoredRoute[]
  score: number
  partial: boolean
  factorsUsed: FactorId[]
  factorsMissing: Array<'beds' | 'doctor' | 'affordability'>
  clinicalTier: number
  reasons: Reason[]
}

const WEIGHTS: Record<FactorId, number> = {
  travel: 36,
  specialty: 26,
  beds: 16,
  doctor: 14,
  affordability: 8,
}

export function routeEta(route: RouteDef, traffic: TrafficLevel) {
  const bump = traffic === 'light' ? 0 : traffic === 'moderate' ? 0.28 : 0.62
  return Math.round(route.baseMin * (1 + bump * route.sensitivity))
}

function travelPoints(eta: number) {
  return Math.max(0, Math.min(100, 100 - eta))
}

export function concernFor(need: string, urgent: boolean): Concern {
  if (need === 'pregnancy' || need === 'gynecology') {
    return { specialty: 'Obstetrics and gynecology', service: null, urgent }
  }
  if (need === 'anemia') return { specialty: 'Hematology', service: null, urgent }
  if (need === 'mental') return { specialty: 'Mental health', service: null, urgent }
  if (need === 'emergency') return { specialty: null, service: 'Emergency', urgent: true }
  if (need === 'general') return { specialty: 'General medicine', service: null, urgent }
  return { specialty: null, service: null, urgent }
}

function doctorScore(hospital: Hospital, specialty: string | null) {
  if (hospital.doctors === null) {
    return { skip: true as const, points: 0, reason: reason('doctor-unknown', 'On-duty doctors are not in this demo record, so doctor availability added no points.', 'ಈ ಮಾದರಿ ದಾಖಲೆಯಲ್ಲಿ ಕರ್ತವ್ಯದಲ್ಲಿರುವ ವೈದ್ಯರ ಮಾಹಿತಿ ಇಲ್ಲ. ಅದಕ್ಕೆ ಅಂಕ ಸೇರಿಸಿಲ್ಲ.') }
  }
  if (specialty) {
    const relevant = hospital.doctors.filter((doctor) => doctor.specialty === specialty)
    if (relevant.some((doctor) => doctor.onDuty === true)) {
      return { skip: false as const, points: 100, reason: reason('doctor-on', `A ${specialty} clinician is listed on duty in the demo record.`, `ಮಾದರಿ ದಾಖಲೆಯಲ್ಲಿ ${specialty} ವೈದ್ಯರು ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ ಎಂದು ನಮೂದಿಸಿದೆ.`) }
    }
    if (relevant.length > 0) {
      return { skip: false as const, points: 35, reason: reason('doctor-off', `${specialty} is listed, but that clinician is not marked on duty. Treat this as unverified.`, `${specialty} ಹೆಸರಿದೆ, ಆದರೆ ಆ ವೈದ್ಯರು ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ ಎಂದು ಗುರುತಿಸಿಲ್ಲ. ಇದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಂಡಿಲ್ಲ ಎಂದು ಪರಿಗಣಿಸಿ.`) }
    }
    if (hospital.doctors.some((doctor) => doctor.onDuty)) {
      return { skip: false as const, points: 30, reason: reason('doctor-other', 'A clinician is listed on duty, but not in the requested specialty.', 'ಒಬ್ಬ ವೈದ್ಯರು ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ ಎಂದು ನಮೂದಿಸಿದೆ, ಆದರೆ ಕೇಳಿದ ವಿಭಾಗದಲ್ಲಿ ಅಲ್ಲ.') }
    }
  } else if (hospital.doctors.some((doctor) => doctor.onDuty)) {
    return { skip: false as const, points: 100, reason: reason('doctor-on', 'A clinician is listed on duty in the demo record.', 'ಮಾದರಿ ದಾಖಲೆಯಲ್ಲಿ ಒಬ್ಬ ವೈದ್ಯರು ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ ಎಂದು ನಮೂದಿಸಿದೆ.') }
  }
  return { skip: false as const, points: 15, reason: reason('doctor-off', 'No clinician is marked on duty in the demo record.', 'ಮಾದರಿ ದಾಖಲೆಯಲ್ಲಿ ಯಾರೂ ಕರ್ತವ್ಯದಲ್ಲಿಲ್ಲ ಎಂದು ಗುರುತಿಸಿದೆ.') }
}

function reason(code: string, en: string, kn: string): Reason {
  return { code, en, kn }
}

export function rankHospitals(origin: OriginId, traffic: TrafficLevel, concern: Concern, hospitals = HOSPITALS): RankedHospital[] {
  const ranked = hospitals.map((hospital) => {
    const routes = hospital.routes[origin].map((route) => ({ ...route, etaMinutes: routeEta(route, traffic) }))
    const chosenRoute = [...routes].sort((a, b) => a.etaMinutes - b.etaMinutes || a.km - b.km)[0]!
    const reasons: Reason[] = []
    const factorsUsed: FactorId[] = []
    const factorsMissing: Array<'beds' | 'doctor' | 'affordability'> = []
    let weighted = 0
    let weight = 0

    const add = (factor: FactorId, points: number) => {
      factorsUsed.push(factor)
      weighted += WEIGHTS[factor] * points
      weight += WEIGHTS[factor]
    }

    add('travel', travelPoints(chosenRoute.etaMinutes))
    const slowerShorter = routes.find((route) => route.km < chosenRoute.km && route.etaMinutes > chosenRoute.etaMinutes)
    if (slowerShorter) {
      reasons.push(reason('longer-faster', `The longer ${chosenRoute.label} (${chosenRoute.km} km, about ${chosenRoute.etaMinutes} min) is faster in this ${traffic} traffic simulation than the shorter ${slowerShorter.label} (${slowerShorter.km} km, about ${slowerShorter.etaMinutes} min).`, `ಈ ${traffic} ಸಂಚಾರ ಅನುಕರಣೆಯಲ್ಲಿ ಉದ್ದವಾದ ${chosenRoute.label} (${chosenRoute.km} ಕಿ.ಮೀ., ಸುಮಾರು ${chosenRoute.etaMinutes} ನಿಮಿಷ) ಚಿಕ್ಕ ${slowerShorter.label}ಗಿಂತ ವೇಗವಾಗಿದೆ.`))
    } else {
      reasons.push(reason('route', `${chosenRoute.label}: about ${chosenRoute.etaMinutes} min, ${chosenRoute.km} km, using simulated ${traffic} traffic. This is not a live road service.`, `${chosenRoute.label}: ಸುಮಾರು ${chosenRoute.etaMinutes} ನಿಮಿಷ, ${chosenRoute.km} ಕಿ.ಮೀ. ಇದು ಅನುಕರಿಸಿದ ಸಂಚಾರ, ನೇರ ಸಂಚಾರ ಸೇವೆಯಲ್ಲ.`))
    }

    const hasSpecialty = !concern.specialty || hospital.specialties.includes(concern.specialty)
    if (concern.specialty) {
      add('specialty', hasSpecialty ? 100 : 0)
      if (hasSpecialty) {
        reasons.push(reason('specialty-match', `${concern.specialty} is listed in the demo record.`, `ಮಾದರಿ ದಾಖಲೆಯಲ್ಲಿ ${concern.specialty} ಇದೆ.`))
      } else if (concern.specialty === 'Obstetrics and gynecology' && hospital.specialties.includes('Maternal health counseling')) {
        reasons.push(reason('related-only', 'Maternal health counseling is listed. Obstetrics and gynecology is not. Those are not the same service.', 'ತಾಯಿ-ಆರೋಗ್ಯ ಸಲಹೆ ನಮೂದಿಸಿದೆ. ಪ್ರಸೂತಿ ಮತ್ತು ಸ್ತ್ರೀರೋಗ ಇಲ್ಲ. ಇವು ಒಂದೇ ಸೇವೆಯಲ್ಲ.'))
      } else {
        reasons.push(reason('specialty-missing', `${concern.specialty} is not listed, so this hospital is ordered below records that list it.`, `${concern.specialty} ನಮೂದಿಸಿಲ್ಲ. ಅದನ್ನು ನಮೂದಿಸಿರುವ ದಾಖಲೆಗಳ ನಂತರ ಇದನ್ನು ಇಡಲಾಗಿದೆ.`))
      }
    }

    if (hospital.bedsAvailable === null || hospital.bedsTotal === null) {
      factorsMissing.push('beds')
      reasons.push(reason('beds-unknown', 'Bed counts are missing. No bed points were added or removed.', 'ಹಾಸಿಗೆ ಸಂಖ್ಯೆ ಇಲ್ಲ. ಹಾಸಿಗೆಗೆ ಅಂಕ ಸೇರಿಸಿಲ್ಲ ಅಥವಾ ಕಳೆಯಲಿಲ್ಲ.'))
    } else {
      const points = hospital.bedsAvailable >= 5 ? 100 : hospital.bedsAvailable >= 1 ? 55 : 10
      add('beds', points)
      reasons.push(
        hospital.bedsAvailable === 0
          ? reason('beds-none', 'The demo record lists no available inpatient bed.', 'ಮಾದರಿ ದಾಖಲೆಯಲ್ಲಿ ಖಾಲಿ ಒಳರೋಗಿ ಹಾಸಿಗೆ ಇಲ್ಲ ಎಂದು ನಮೂದಿಸಿದೆ.')
          : reason('beds-listed', `Demo record: ${hospital.bedsAvailable} of ${hospital.bedsTotal} beds marked available. This is not a live census.`, `ಮಾದರಿ ದಾಖಲೆ: ${hospital.bedsTotal}ರಲ್ಲಿ ${hospital.bedsAvailable} ಹಾಸಿಗೆಗಳು ಖಾಲಿ ಎಂದು ಗುರುತಿಸಿದೆ. ಇದು ನೇರ ಎಣಿಕೆಯಲ್ಲ.`),
      )
    }

    const doctor = doctorScore(hospital, concern.specialty)
    if (doctor.skip) factorsMissing.push('doctor')
    else add('doctor', doctor.points)
    reasons.push(doctor.reason)

    if (!hospital.costBand) {
      factorsMissing.push('affordability')
      reasons.push(reason('cost-unknown', 'No cost band is recorded, so affordability added no points.', 'ವೆಚ್ಚದ ಮಾಹಿತಿ ಇಲ್ಲ. ಅದಕ್ಕೆ ಅಂಕ ಸೇರಿಸಿಲ್ಲ.'))
    } else {
      const points = hospital.costBand === 'lower' ? 100 : hospital.costBand === 'moderate' ? 65 : 35
      add('affordability', points)
      reasons.push(reason('cost', `Demo cost band: ${hospital.costBand}. This is not a quote.`, `ಮಾದರಿ ವೆಚ್ಚದ ಗುಂಪು: ${hospital.costBand}. ಇದು ಬೆಲೆ ಉಲ್ಲೇಖವಲ್ಲ.`))
    }

    const hasEmergency = hospital.services.includes('Emergency')
    if (concern.urgent) {
      reasons.push(
        hasEmergency
          ? reason('emergency-yes', 'Emergency services are listed. For an urgent concern, that comes before the numeric score.', 'ತುರ್ತು ಸೇವೆ ನಮೂದಿಸಿದೆ. ತುರ್ತು ಅಗತ್ಯದಲ್ಲಿ ಇದು ಅಂಕಸಂಖ್ಯೆಗಿಂತ ಮೊದಲು ಬರುತ್ತದೆ.')
          : reason('emergency-no', 'Emergency services are not listed. For an urgent concern, this record is ordered after hospitals that list them.', 'ತುರ್ತು ಸೇವೆ ನಮೂದಿಸಿಲ್ಲ. ತುರ್ತು ಅಗತ್ಯದಲ್ಲಿ ಇದನ್ನು ತುರ್ತು ಸೇವೆ ಇರುವ ಆಸ್ಪತ್ರೆಗಳ ನಂತರ ಇಡಲಾಗಿದೆ.'),
      )
    }

    let clinicalTier = 0
    if (concern.urgent && !hasEmergency) clinicalTier += 4
    if (concern.specialty && !hasSpecialty) clinicalTier += 2
    if (concern.service && !hospital.services.includes(concern.service)) clinicalTier += 2

    const score = weight === 0 ? 0 : Math.round(weighted / weight)
    return {
      hospital,
      etaMinutes: chosenRoute.etaMinutes,
      distanceKm: chosenRoute.km,
      traffic,
      chosenRoute,
      routes,
      score,
      partial: factorsMissing.length > 0,
      factorsUsed,
      factorsMissing,
      clinicalTier,
      reasons,
    }
  })

  ranked.sort((a, b) => a.clinicalTier - b.clinicalTier || b.score - a.score || a.etaMinutes - b.etaMinutes || a.hospital.name.localeCompare(b.hospital.name))
  return ranked
}
