import { languageMeta } from '../languages'
import { showSymptoms } from '../lib/format'
import type { LabEntry, Lang, MedicineCheck, ReportRecord, SymptomEntry } from '../types'

export type PassportInput = {
  lang: Lang
  displayName: string
  symptoms: SymptomEntry[]
  labs: LabEntry[]
  reports: ReportRecord[]
  medicines: MedicineCheck[]
  questions: string
  includeSamples: boolean
}

function kept<T extends { sample: boolean }>(rows: T[], includeSamples: boolean) {
  return includeSamples ? rows : rows.filter((row) => !row.sample)
}

export function buildPassport(input: PassportInput) {
  const symptoms = kept(input.symptoms, input.includeSamples)
  const labs = kept(input.labs, input.includeSamples)
  const reports = kept(input.reports, input.includeSamples)
  const medicines = kept(input.medicines, input.includeSamples)
  const lines = [
    'HerHealth AI — Care Passport',
    'Educational summary for a clinician. Not a diagnosis or a referral.',
    `Profile name on this device: ${input.displayName} (demonstration profile)`,
    `Language: ${languageMeta(input.lang).english}`,
    '',
    'Symptom notes the user chose to include:',
  ]
  if (symptoms.length === 0) lines.push('- None selected.')
  for (const entry of symptoms) {
    lines.push(`- ${entry.createdAt.slice(0, 10)} · ${entry.module} · severity ${entry.severity}/10 · ${showSymptoms(entry.symptoms) || 'no tagged symptom'} · ${entry.notes || 'no note'}`)
  }
  lines.push('', 'Laboratory values the user chose to include:')
  if (labs.length === 0) lines.push('- None selected.')
  for (const lab of labs) lines.push(`- ${lab.name}: ${lab.value} ${lab.unit} (printed reference ${lab.reference || 'not entered'}) — ${lab.context}`)
  lines.push('', 'Reviewed reports:')
  if (reports.length === 0) lines.push('- None selected.')
  for (const report of reports) {
    lines.push(`- ${report.title} · source ${report.source}`)
    for (const field of report.fields) lines.push(`  · ${field.label}: ${field.value} ${field.unit} ref ${field.reference} (${field.flag})`)
  }
  lines.push('', 'Medicine comparisons the user recorded:')
  if (medicines.length === 0) lines.push('- None selected.')
  for (const check of medicines) {
    lines.push(`- Pharmacist confirmed on this device: ${check.pharmacistConfirmed ? 'yes' : 'no'}`)
    for (const flag of check.flags) lines.push(`  · ${flag.text.en}`)
  }
  lines.push('', 'Questions for the clinician:', input.questions.trim() || '- None written.', '', 'Safety: this export was prepared by an educational prototype. It must not be used to start, stop, or change treatment.')
  return lines.join('\n')
}
