import { ARTICLES } from '../data/catalog'
import { HOSPITALS } from '../data/hospitals'
import type { AnyRecord, Article, DoseLog, DosePlan, Hospital, LabEntry, MedicineCheck, Meta, OutboxItem, Profile, Reminder, ReportRecord, SymptomEntry } from '../types'

const DB_NAME = 'herhealth-aura'
const STORE = 'records'

export type Snapshot = {
  profile: Profile
  meta: Meta
  symptoms: SymptomEntry[]
  labs: LabEntry[]
  reports: ReportRecord[]
  medicines: MedicineCheck[]
  reminders: Reminder[]
  doses: DosePlan[]
  doseLogs: DoseLog[]
  articles: Article[]
  hospitals: Hospital[]
  outbox: OutboxItem[]
  persistent: boolean
}

function daysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(9, 30, 0, 0)
  return date.toISOString()
}

export function seedRows(now = new Date().toISOString()): AnyRecord[] {
  const profile: Profile = {
    kind: 'profile',
    id: 'profile',
    displayName: 'Meera H.',
    language: 'en',
    languageChosen: false,
    lifeStage: 'pregnancy',
    interests: ['pregnancy', 'iron'],
    locationId: 'malenahalli',
    locationEnabled: false,
    onlineModelConsent: false,
    sample: true,
  }
  const meta: Meta = {
    kind: 'meta',
    id: 'meta',
    lastSync: now,
    hospitalsCachedAt: now,
    educationCachedAt: now,
    simulatedOffline: false,
  }
  const symptoms: SymptomEntry[] = [
    { kind: 'symptom', id: 'sym-m1', module: 'mama', createdAt: daysAgo(18), severity: 3, symptoms: ['nausea'], notes: 'Fictional sample. Evening nausea, still able to drink water.', sample: true, stage: 'trimester-2' },
    { kind: 'symptom', id: 'sym-m2', module: 'mama', createdAt: daysAgo(11), severity: 4, symptoms: ['back-pain'], notes: 'Fictional sample. Aching after a bus ride.', sample: true, stage: 'trimester-2' },
    { kind: 'symptom', id: 'sym-m3', module: 'mama', createdAt: daysAgo(4), severity: 3, symptoms: ['swelling', 'mild-headache'], notes: 'Fictional sample. Feet swollen by evening. Headache eased after rest.', sample: true, stage: 'trimester-2' },
    { kind: 'symptom', id: 'sym-i1', module: 'iron', createdAt: daysAgo(15), severity: 5, symptoms: ['fatigue', 'dizziness'], notes: 'Fictional sample. Tired on the walk to the lane.', sample: true, dietNotes: 'Vegetarian meals. Tea with lunch most days.' },
    { kind: 'symptom', id: 'sym-i2', module: 'iron', createdAt: daysAgo(6), severity: 4, symptoms: ['fatigue'], notes: 'Fictional sample. Needed a rest after chores.', sample: true, dietNotes: 'Added extra greens twice this week.' },
    { kind: 'symptom', id: 'sym-e1', module: 'endo', createdAt: daysAgo(21), severity: 6, symptoms: ['pelvic-pain', 'period-pain'], notes: 'Fictional sample from before this pregnancy timeline. Missed a morning class.', sample: true, bodyArea: 'pelvis', duration: 'Most of the day', impact: 'Missed class', bleeding: 'moderate', cycleDay: 2 },
    { kind: 'symptom', id: 'sym-w1', module: 'wellness', createdAt: daysAgo(8), severity: 4, symptoms: ['anxiety', 'sleep'], notes: 'Fictional sample. Woke twice, worried about the bus fare to town.', sample: true },
  ]
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)
  const reminders: Reminder[] = [
    { kind: 'reminder', id: 'rem-visit', title: { en: 'Write questions before the sample antenatal note', kn: 'ಮಾದರಿ ಗರ್ಭ ಟಿಪ್ಪಣಿಗೆ ಮೊದಲು ಪ್ರಶ್ನೆಗಳನ್ನು ಬರೆಯಿರಿ' }, due: tomorrow.toISOString(), href: '/health/mama', done: false },
    { kind: 'reminder', id: 'rem-pass', title: { en: 'Preview a Care Passport before you share it', kn: 'ಹಂಚುವ ಮೊದಲು ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಅನ್ನು ನೋಡಿ' }, due: tomorrow.toISOString(), href: '/passport', done: false },
    { kind: 'reminder', id: 'rem-cache', title: { en: 'Look at cached demo hospital numbers while you have time', kn: 'ಸಮಯವಿದ್ದಾಗ ಉಳಿಸಿದ ಮಾದರಿ ಆಸ್ಪತ್ರೆ ಸಂಖ್ಯೆಗಳನ್ನು ನೋಡಿ' }, due: now, href: '/offline', done: false },
  ]
  const doses: DosePlan[] = [
    {
      kind: 'dose',
      id: 'dose-folic',
      name: 'Folic acid tablet (fictional prescription)',
      time: '08:00',
      period: 'morning',
      notes: 'Reminder copied from a fictional clinician instruction. This app does not set or change a dose.',
      repeat: 'daily',
      createdAt: now,
      sample: true,
    },
  ]
  const hospitals: Hospital[] = HOSPITALS.map((hospital) => ({ ...hospital, cachedAt: now }))
  const articles = ARTICLES.map((article) => ({ ...article }))
  return [profile, meta, ...symptoms, ...reminders, ...doses, ...hospitals, ...articles]
}

function partition(rows: AnyRecord[], persistent: boolean): Snapshot {
  const profile = rows.find((row): row is Profile => row.kind === 'profile')
  const meta = rows.find((row): row is Meta => row.kind === 'meta')
  if (!profile || !meta) throw new Error('Health record is incomplete.')
  return {
    profile,
    meta,
    symptoms: rows.filter((row): row is SymptomEntry => row.kind === 'symptom').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    labs: rows.filter((row): row is LabEntry => row.kind === 'lab').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    reports: rows.filter((row): row is ReportRecord => row.kind === 'report').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    medicines: rows.filter((row): row is MedicineCheck => row.kind === 'medicine').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    reminders: rows.filter((row): row is Reminder => row.kind === 'reminder'),
    doses: rows.filter((row): row is DosePlan => row.kind === 'dose'),
    doseLogs: rows.filter((row): row is DoseLog => row.kind === 'dose-log').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    articles: rows.filter((row): row is Article => row.kind === 'article'),
    hospitals: rows.filter((row): row is Hospital => row.kind === 'hospital'),
    outbox: rows.filter((row): row is OutboxItem => row.kind === 'outbox' && row.status === 'pending'),
    persistent,
  }
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB did not open.'))
  })
}

function transactionDone(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed.'))
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted.'))
  })
}

async function readAll(db: IDBDatabase) {
  const tx = db.transaction(STORE, 'readonly')
  const request = tx.objectStore(STORE).getAll()
  const rows = await new Promise<AnyRecord[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as AnyRecord[])
    request.onerror = () => reject(request.error)
  })
  await transactionDone(tx)
  return rows
}

async function putAll(db: IDBDatabase, rows: AnyRecord[]) {
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)
  for (const row of rows) store.put(row)
  await transactionDone(tx)
}

export async function loadSnapshot(): Promise<Snapshot> {
  const db = await openDb()
  let rows = await readAll(db)
  if (!rows.some((row) => row.kind === 'profile')) {
    rows = seedRows()
    await putAll(db, rows)
  } else {
    const missing = seedRows().filter((row) => row.kind === 'dose' && !rows.some((existing) => existing.id === row.id))
    if (missing.length) {
      await putAll(db, missing)
      rows = [...rows, ...missing]
    }
  }
  return partition(rows, true)
}

export async function saveRecord(record: AnyRecord) {
  const db = await openDb()
  await putAll(db, [record])
}

export async function saveRecords(records: AnyRecord[]) {
  const db = await openDb()
  await putAll(db, records)
}

export async function removeRecord(id: string) {
  const db = await openDb()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).delete(id)
  await transactionDone(tx)
}

export async function resetSnapshot() {
  const db = await openDb()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).clear()
  await transactionDone(tx)
  const rows = seedRows()
  await putAll(db, rows)
  return partition(rows, true)
}

export function memorySnapshot(): Snapshot {
  return partition(seedRows(), false)
}
