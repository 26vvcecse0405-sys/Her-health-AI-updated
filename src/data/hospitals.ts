import type { Hospital, OriginId } from '../types'

export const DATASET_UPDATED = '2026-10-23T18:00:00+05:30'

export const origins: { id: OriginId; label: string; kn: string; map: { x: number; y: number } }[] = [
  { id: 'malenahalli', label: 'Malenahalli (sample village)', kn: 'ಮಾಲೇನಹಳ್ಳಿ (ಮಾದರಿ ಗ್ರಾಮ)', map: { x: 22, y: 68 } },
  { id: 'nelamangala', label: 'Nelamangala (sample town)', kn: 'ನೆಲಮಂಗಲ (ಮಾದರಿ ಪಟ್ಟಣ)', map: { x: 48, y: 30 } },
  { id: 'junction', label: 'Highway junction (sample)', kn: 'ಹೆದ್ದಾರಿ ಜಂಕ್ಷನ್ (ಮಾದರಿ)', map: { x: 78, y: 46 } },
]

const base = {
  kind: 'hospital' as const,
  fictional: true as const,
  updatedAt: DATASET_UPDATED,
}

export const HOSPITALS: Hospital[] = [
  {
    ...base,
    id: 'phc',
    name: 'Malenahalli Primary Health Centre',
    area: 'Village main lane, Malenahalli',
    phone: '080-4100-0101',
    specialties: ['General medicine', 'Maternal health counseling'],
    services: ['Outpatient', 'Antenatal clinic', 'Pharmacy', 'Immunization'],
    bedsAvailable: 2,
    bedsTotal: 6,
    doctors: [{ name: 'Dr. S. Patil', specialty: 'General medicine', onDuty: true }],
    costBand: 'lower',
    accessibility: ['Step-free entrance listed in the demo record'],
    map: { x: 28, y: 62 },
    routes: {
      malenahalli: [{ id: 'lane', label: 'Village lane', km: 2.4, baseMin: 8, sensitivity: 0.35 }],
      nelamangala: [{ id: 'road', label: 'Town road', km: 14, baseMin: 30, sensitivity: 0.7 }],
      junction: [{ id: 'road', label: 'Link road', km: 18, baseMin: 34, sensitivity: 0.6 }],
    },
  },
  {
    ...base,
    id: 'lakeside',
    name: 'Lakeside Community Clinic',
    area: 'Market road, Malenahalli outskirts',
    phone: '080-4100-0102',
    specialties: ['General medicine'],
    services: ['Outpatient'],
    bedsAvailable: 0,
    bedsTotal: 0,
    doctors: [{ name: 'Dr. K. Nair', specialty: 'General medicine', onDuty: true }],
    costBand: 'lower',
    accessibility: ['Ground-floor clinic listed in the demo record'],
    map: { x: 34, y: 80 },
    routes: {
      malenahalli: [{ id: 'market', label: 'Market road', km: 4.5, baseMin: 12, sensitivity: 0.92 }],
      nelamangala: [{ id: 'market', label: 'Market road', km: 12, baseMin: 26, sensitivity: 0.8 }],
      junction: [{ id: 'market', label: 'Market road', km: 15, baseMin: 28, sensitivity: 0.75 }],
    },
  },
  {
    ...base,
    id: 'taluk',
    name: 'Nelamangala Taluk Hospital',
    area: 'Taluk campus, sample town',
    phone: '080-4100-0144',
    specialties: ['General medicine', 'Obstetrics and gynecology'],
    services: ['Emergency', 'Outpatient', 'Laboratory', 'Antenatal clinic', 'Pharmacy'],
    bedsAvailable: 4,
    bedsTotal: 30,
    doctors: [
      { name: 'Dr. R. Gowda', specialty: 'General medicine', onDuty: true },
      { name: 'Dr. M. Iqbal', specialty: 'Obstetrics and gynecology', onDuty: false },
    ],
    costBand: 'lower',
    accessibility: ['Ramp listed in the demo record', 'Female clinician listed, on-duty status not confirmed'],
    map: { x: 50, y: 24 },
    routes: {
      malenahalli: [
        { id: 'main', label: 'Main road', km: 16, baseMin: 24, sensitivity: 0.9 },
        { id: 'service', label: 'Service road', km: 18, baseMin: 28, sensitivity: 0.25 },
      ],
      nelamangala: [{ id: 'campus', label: 'Campus road', km: 2, baseMin: 7, sensitivity: 0.2 }],
      junction: [{ id: 'link', label: 'Town highway', km: 20, baseMin: 32, sensitivity: 0.55 }],
    },
  },
  {
    ...base,
    id: 'greenfield',
    name: 'Greenfield Women’s Hospital',
    area: 'Outer highway medical belt',
    phone: '080-4100-0210',
    specialties: ['Obstetrics and gynecology', 'Hematology', 'Mental health'],
    services: ['Emergency', 'Laboratory', 'Ultrasound', 'Pharmacy', 'Outpatient'],
    bedsAvailable: 6,
    bedsTotal: 40,
    doctors: [
      { name: 'Dr. Anitha Rao', specialty: 'Obstetrics and gynecology', onDuty: true },
      { name: 'Dr. H. Desai', specialty: 'Hematology', onDuty: true },
    ],
    costBand: 'moderate',
    accessibility: ['Wheelchair entrance listed', 'Female obstetric clinician listed on duty in the demo record'],
    map: { x: 76, y: 40 },
    routes: {
      malenahalli: [
        { id: 'town', label: 'Through town roads', km: 14, baseMin: 20, sensitivity: 0.95 },
        { id: 'highway', label: 'Outer highway', km: 19, baseMin: 25, sensitivity: 0.22 },
      ],
      nelamangala: [{ id: 'link', label: 'Highway link', km: 22, baseMin: 44, sensitivity: 0.35 }],
      junction: [{ id: 'spur', label: 'Junction spur', km: 5, baseMin: 9, sensitivity: 0.2 }],
    },
  },
  {
    ...base,
    id: 'cauvery',
    name: 'Cauvery Multi-Speciality',
    area: 'Ring road, sample district',
    phone: '080-4100-0330',
    specialties: ['Obstetrics and gynecology', 'Hematology', 'General surgery'],
    services: ['Emergency', 'Laboratory', 'Intensive care'],
    bedsAvailable: null,
    bedsTotal: null,
    doctors: null,
    costBand: 'higher',
    accessibility: ['Accessibility is not stated in the demo record'],
    map: { x: 70, y: 74 },
    routes: {
      malenahalli: [{ id: 'ring', label: 'Ring road', km: 24, baseMin: 36, sensitivity: 0.75 }],
      nelamangala: [{ id: 'ring', label: 'Ring road', km: 20, baseMin: 34, sensitivity: 0.7 }],
      junction: [{ id: 'ring', label: 'Ring road', km: 18, baseMin: 30, sensitivity: 0.6 }],
    },
  },
  {
    ...base,
    id: 'sahyadri',
    name: 'Sahyadri Mother and Child Centre',
    area: 'North corridor, sample district',
    phone: '080-4100-0288',
    specialties: ['Obstetrics and gynecology', 'Pediatrics'],
    services: ['Emergency', 'Ultrasound', 'Antenatal clinic', 'Pharmacy'],
    bedsAvailable: 3,
    bedsTotal: 25,
    doctors: [{ name: 'Dr. P. Shenoy', specialty: 'Obstetrics and gynecology', onDuty: true }],
    costBand: 'moderate',
    accessibility: ['Lift listed in the demo record'],
    map: { x: 58, y: 12 },
    routes: {
      malenahalli: [{ id: 'state', label: 'State highway', km: 31, baseMin: 46, sensitivity: 0.4 }],
      nelamangala: [{ id: 'state', label: 'State highway', km: 28, baseMin: 42, sensitivity: 0.45 }],
      junction: [{ id: 'state', label: 'State highway', km: 24, baseMin: 36, sensitivity: 0.4 }],
    },
  },
]

export function hospitalById(id: string) {
  return HOSPITALS.find((hospital) => hospital.id === id) ?? null
}
