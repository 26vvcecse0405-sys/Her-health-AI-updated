import type { BillReview, Copy, MedicineFlag, MedicineRow, ReportField } from '../types'

export const SAMPLE_REPORT = `MALENAHALLI DEMO LABORATORY
FICTIONAL REPORT — NOT A REAL PATIENT

Name: Meera H. (sample)
Date: 20 Oct 2026

Hemoglobin: 10.8 g/dL Ref: 12.0-15.5
Hematocrit: 33 % Ref: 36-46
Ferritin: 9 ng/mL Ref: 15-150
MCV: 74 fL Ref: 80-96
WBC: 7.2 x10e9/L Ref: 4.0-11.0
Platelets: 240 x10e9/L Ref: 150-450

This page was written for a student demonstration.`

export const SAMPLE_PRESCRIPTION = `FICTIONAL PRESCRIPTION — DEMO ONLY
Prescriber: Dr. L. Shetty (fictional)

1. Tablet Paracetamol 500 mg
2. Capsule Omeprazole 20 mg`

export const SAMPLE_PACKAGE = `FICTIONAL PACKAGE — DEMO ONLY
Paracetamol Tablets 650 mg`

export const SAMPLE_BILL = `FICTIONAL HOSPITAL BILL — DEMO ONLY
Room charge 2 x 1500 = 3000
CBC test 450
CBC test 450
Doctor visit 800
Pharmacy 1200
Printed total: 6400`

const FIELD = /^([A-Za-z][A-Za-z ]+):\s*([0-9]+(?:\.[0-9]+)?)\s+(\S+)\s+Ref:\s*([0-9]+(?:\.[0-9]+)?)\s*-\s*([0-9]+(?:\.[0-9]+)?)\s*$/

export function parseReport(text: string): ReportField[] {
  const fields: ReportField[] = []
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    const match = FIELD.exec(line)
    if (!match) continue
    const label = match[1]!.trim()
    const value = Number(match[2])
    const low = Number(match[4])
    const high = Number(match[5])
    const outside = value < low || value > high
    fields.push({
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      value: match[2]!,
      unit: match[3]!,
      reference: `${match[4]}-${match[5]}`,
      flag: outside ? 'outside' : 'inside',
      note: outside
        ? 'Outside the reference interval printed in this text. That is a reason to ask a clinician. It is not a diagnosis.'
        : 'Inside the reference interval printed in this text. Intervals differ by laboratory. This is not a clean bill of health.',
    })
  }
  return fields
}

export function explainTerm(label: string): Copy | null {
  const key = label.toLowerCase()
  const terms: { test: (name: string) => boolean; copy: Copy }[] = [
    {
      test: (name) => name.includes('hemoglobin') || name.includes('haemoglobin'),
      copy: {
        en: 'Hemoglobin is a protein in red blood cells that carries oxygen. The interval printed on a report is the one to compare. A value outside it is not, by itself, a diagnosis of anemia.',
        kn: 'ಹಿಮೋಗ್ಲೋಬಿನ್ ಕೆಂಪು ರಕ್ತ ಕಣಗಳಲ್ಲಿ ಆಮ್ಲಜನಕವನ್ನು ಒಯ್ಯುವ ಪ್ರೋಟೀನ್. ವರದಿಯಲ್ಲಿ ಮುದ್ರಿತವಾದ ವ್ಯಾಪ್ತಿಯೊಂದಿಗೆ ಹೋಲಿಸಿ. ವ್ಯಾಪ್ತಿಯ ಹೊರಗಿನ ಸಂಖ್ಯೆ ಏಕಾಂಗಿಯಾಗಿ ರಕ್ತಹೀನತೆಯ ನಿರ್ಣಯವಲ್ಲ.',
      },
    },
    {
      test: (name) => name.includes('hematocrit') || name.includes('haematocrit'),
      copy: {
        en: 'Hematocrit is the share of blood made up of red blood cells. Ask a clinician how to read it together with hemoglobin.',
        kn: 'ಹೆಮಟೋಕ್ರಿಟ್ ರಕ್ತದಲ್ಲಿ ಕೆಂಪು ರಕ್ತ ಕಣಗಳ ಪಾಲು. ಇದನ್ನು ಹಿಮೋಗ್ಲೋಬಿನ್ ಜೊತೆ ಹೇಗೆ ಓದುವುದು ಎಂದು ವೈದ್ಯರನ್ನು ಕೇಳಿ.',
      },
    },
    {
      test: (name) => name.includes('ferritin'),
      copy: {
        en: 'Ferritin is often used as a clue to stored iron. Ranges differ, and infection or inflammation can change the number. This app will not tell you to start iron tablets.',
        kn: 'ಫೆರಿಟಿನ್ ಅನ್ನು ದೇಹದಲ್ಲಿ ಶೇಖರವಾದ ಕಬ್ಬಿಣದ ಸುಳಿವಾಗಿ ಬಳಸುತ್ತಾರೆ. ವ್ಯಾಪ್ತಿಗಳು ಬದಲಾಗುತ್ತವೆ. ಈ ಅಪ್ಲಿಕೇಶನ್ ಕಬ್ಬಿಣದ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಲು ಹೇಳುವುದಿಲ್ಲ.',
      },
    },
    {
      test: (name) => name === 'mcv' || name.includes('mcv'),
      copy: {
        en: 'MCV describes the average size of red blood cells. It is context for a clinician, not a diagnosis.',
        kn: 'MCV ಕೆಂಪು ರಕ್ತ ಕಣಗಳ ಸರಾಸರಿ ಗಾತ್ರವನ್ನು ವಿವರಿಸುತ್ತದೆ. ಇದು ವೈದ್ಯರಿಗೆ ಸನ್ನಿವೇಶ, ರೋಗ ನಿರ್ಣಯವಲ್ಲ.',
      },
    },
    {
      test: (name) => name === 'wbc' || name.includes('wbc'),
      copy: {
        en: 'WBC is a white blood cell count. High or low values have many possible explanations. Ask what this result means for you.',
        kn: 'WBC ಬಿಳಿ ರಕ್ತ ಕಣಗಳ ಎಣಿಕೆ. ಹೆಚ್ಚು ಅಥವಾ ಕಡಿಮೆ ಆಗಲು ಹಲವು ಕಾರಣಗಳಿರಬಹುದು. ಇದರ ಅರ್ಥವೇನು ಎಂದು ಕೇಳಿ.',
      },
    },
    {
      test: (name) => name.includes('platelet'),
      copy: {
        en: 'Platelets help blood clot. Only a clinician can interpret your count.',
        kn: 'ಪ್ಲೇಟ್‌ಲೆಟ್‌ಗಳು ರಕ್ತ ಹೆಪ್ಪುಗಟ್ಟಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ. ನಿಮ್ಮ ಎಣಿಕೆಯನ್ನು ವೈದ್ಯರು ಮಾತ್ರ ವಿವರಿಸಬಹುದು.',
      },
    },
  ]
  return terms.find((term) => term.test(key))?.copy ?? null
}

export function clinicianQuestions(fields: ReportField[]): Copy[] {
  const questions: Copy[] = fields
    .filter((field) => field.flag === 'outside')
    .map((field) => ({
      en: `What does my ${field.label} of ${field.value} ${field.unit} mean compared with the reference interval printed on this report?`,
      kn: `ಈ ವರದಿಯ ಮುದ್ರಿತ ವ್ಯಾಪ್ತಿಗೆ ಹೋಲಿಸಿದರೆ ನನ್ನ ${field.label} ${field.value} ${field.unit} ಅಂದರೆ ಏನು?`,
    }))
  questions.push({
    en: 'Do you want this test repeated, and if so, when?',
    kn: 'ಈ ಪರೀಕ್ಷೆಯನ್ನು ಮತ್ತೆ ಮಾಡಬೇಕೇ? ಬೇಕಾದರೆ ಯಾವಾಗ?',
  })
  questions.push({
    en: 'Should any medicine or supplement change because of this result? I will not change it based on an app.',
    kn: 'ಈ ಫಲಿತಾಂಶದಿಂದ ಯಾವುದೇ ಔಷಧಿ ಅಥವಾ ಪೂರಕ ಬದಲಾಯಿಸಬೇಕೇ? ಅಪ್ಲಿಕೇಶನ್ ಹೇಳಿದ್ದಕ್ಕೆ ನಾನು ಅದನ್ನು ಬದಲಾಯಿಸುವುದಿಲ್ಲ.',
  })
  return questions
}

const STRENGTH = /\b(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml|iu)\b/i
const FORM = /\b(tablets?|capsules?|syrups?|injections?|drops?)\b/i

function medicineLine(raw: string, source: MedicineRow['source'], index: number): MedicineRow | null {
  const strength = STRENGTH.exec(raw)
  if (!strength) return null
  const form = FORM.exec(raw)
  const name = raw
    .replace(/^\d+\.\s*/, '')
    .replace(STRENGTH, '')
    .replace(FORM, '')
    .replace(/fictional package — demo only|fictional prescription — demo only/i, '')
    .replace(/[^A-Za-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!name) return null
  return {
    id: `${source}-${index}`,
    source,
    name,
    form: form ? form[1]!.toLowerCase().replace(/s$/, '') : '',
    strength: `${strength[1]} ${strength[2]!.toLowerCase()}`,
    raw: raw.trim(),
  }
}

export function extractMedicines(text: string, source: MedicineRow['source']) {
  return text
    .split(/\r?\n/)
    .map((line, index) => medicineLine(line, source, index))
    .filter((row): row is MedicineRow => Boolean(row))
}

function tokens(name: string) {
  return name.toLowerCase().split(/\s+/).filter((token) => token.length > 2 && !['tablet', 'capsule', 'syrup'].includes(token))
}

export function compareMedicines(prescription: MedicineRow[], pack: MedicineRow[]) {
  const flags: MedicineFlag[] = []
  const used = new Set<string>()
  for (const item of prescription) {
    const words = tokens(item.name)
    const match = pack.find((row) => !used.has(row.id) && words.some((word) => tokens(row.name).includes(word)))
    if (!match) {
      flags.push({
        level: 'missing',
        text: {
          en: `${item.name} ${item.strength} is on the prescription text and was not found on the package text.`,
          kn: `${item.name} ${item.strength} ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಪಠ್ಯದಲ್ಲಿದೆ, ಪ್ಯಾಕೇಜ್ ಪಠ್ಯದಲ್ಲಿ ಸಿಗಲಿಲ್ಲ.`,
        },
      })
      continue
    }
    used.add(match.id)
    if (match.strength !== item.strength) {
      flags.push({
        level: 'mismatch',
        text: {
          en: `Possible strength discrepancy for ${item.name}: prescription text says ${item.strength}, package text says ${match.strength}. Ask a pharmacist to confirm. Do not swap the medicine because an app noticed a difference.`,
          kn: `${item.name} ಬಲದಲ್ಲಿ ವ್ಯತ್ಯಾಸ ಕಾಣಿಸುತ್ತದೆ: ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ${item.strength}, ಪ್ಯಾಕೇಜ್ ${match.strength}. ಔಷಧವನ್ನು ಬದಲಾಯಿಸಬೇಡಿ. ಔಷಧಿಕಾರರನ್ನು ಕೇಳಿ.`,
        },
      })
    } else {
      flags.push({
        level: 'match',
        text: {
          en: `The printed name and strength for ${item.name} (${item.strength}) look the same on both texts. A text match is not proof the medicine is genuine, safe, or right for you.`,
          kn: `${item.name} (${item.strength}) ಹೆಸರು ಮತ್ತು ಬಲ ಎರಡು ಪಠ್ಯಗಳಲ್ಲಿ ಒಂದೇ ರೀತಿ ಕಾಣುತ್ತದೆ. ಪಠ್ಯ ಹೊಂದಾಣಿಕೆ ಔಷಧ ನಿಜವೆಂದು ಅಥವಾ ಸುರಕ್ಷಿತವೆಂದು ಸಾಬೀತಲ್ಲ.`,
        },
      })
    }
  }
  for (const row of pack) {
    if (used.has(row.id)) continue
    flags.push({
      level: 'extra',
      text: {
        en: `${row.name} ${row.strength} appears on the package text and was not matched to a prescription line.`,
        kn: `${row.name} ${row.strength} ಪ್ಯಾಕೇಜ್ ಪಠ್ಯದಲ್ಲಿದೆ, ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸಾಲಿಗೆ ಹೊಂದಿಕೆಯಾಗಲಿಲ್ಲ.`,
      },
    })
  }
  if (prescription.length === 0 && pack.length === 0) {
    flags.push({
      level: 'missing',
      text: {
        en: 'No medicine name and strength could be read. Nothing was verified.',
        kn: 'ಔಷಧದ ಹೆಸರು ಮತ್ತು ಬಲ ಓದಲು ಸಿಗಲಿಲ್ಲ. ಏನನ್ನೂ ಖಚಿತಪಡಿಸಿಲ್ಲ.',
      },
    })
  }
  return flags
}

function amountLine(line: string): { description: string; amount: number; note: string } | null {
  if (/printed total/i.test(line)) return null
  const product = /^(.+?)\s+(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)\s*$/i.exec(line)
  if (product) {
    const expected = Number(product[2]) * Number(product[3])
    const printed = Number(product[4])
    const mismatch = Math.abs(expected - printed) > 0.009
    return {
      description: product[1]!.trim(),
      amount: printed,
      note: mismatch ? `The printed line result ${printed} does not equal ${product[2]} × ${product[3]}.` : '',
    }
  }
  const simple = /^(.+?)\s+(\d+(?:\.\d+)?)\s*$/.exec(line)
  if (!simple || /fictional|demo only|name:/i.test(line)) return null
  return { description: simple[1]!.replace(/^\d+\.\s*/, '').trim(), amount: Number(simple[2]), note: '' }
}

export function reviewBill(text: string): BillReview {
  const lines = text
    .split(/\r?\n/)
    .map((line, index) => {
      const parsed = amountLine(line.trim())
      return parsed ? { id: `line-${index}`, ...parsed } : null
    })
    .filter((line): line is BillReview['lines'][number] => Boolean(line))
  const totalMatch = /printed total:\s*(\d+(?:\.\d+)?)/i.exec(text)
  const printedTotal = totalMatch ? Number(totalMatch[1]) : null
  const computedTotal = Math.round(lines.reduce((sum, line) => sum + line.amount, 0) * 100) / 100
  const flags: Copy[] = []
  const seen = new Map<string, number>()
  for (const line of lines) {
    const key = line.description.toLowerCase().replace(/\s+/g, ' ')
    seen.set(key, (seen.get(key) ?? 0) + 1)
    if (line.note) {
      flags.push({ en: `Possible arithmetic inconsistency: ${line.note}`, kn: `ಲೆಕ್ಕದ ವ್ಯತ್ಯಾಸವಿರಬಹುದು: ${line.note}` })
    }
  }
  for (const [description, count] of seen) {
    if (count > 1) {
      flags.push({
        en: `Possible duplicate description: “${description}” appears ${count} times. This is not proof of an incorrect bill.`,
        kn: `ಪುನರಾವರ್ತಿತ ವಿವರಣೆ ಇರಬಹುದು: “${description}” ${count} ಬಾರಿ ಬಂದಿದೆ. ಇದು ತಪ್ಪು ಬಿಲ್ ಎಂಬ ಸಾಬೀತಲ್ಲ.`,
      })
    }
  }
  if (printedTotal !== null && Math.abs(printedTotal - computedTotal) > 0.009) {
    flags.push({
      en: `The lines add up to ${computedTotal}. The printed total is ${printedTotal}. The difference is ${Math.round((printedTotal - computedTotal) * 100) / 100}. Ask the billing desk to explain it. This is not proof of fraud.`,
      kn: `ಸಾಲುಗಳ ಮೊತ್ತ ${computedTotal}. ಮುದ್ರಿತ ಒಟ್ಟು ${printedTotal}. ವ್ಯತ್ಯಾಸ ${Math.round((printedTotal - computedTotal) * 100) / 100}. ಬಿಲ್ಲಿಂಗ್ ವಿಭಾಗದಲ್ಲಿ ಕೇಳಿ. ಇದು ವಂಚನೆಯ ಸಾಬೀತಲ್ಲ.`,
    })
  }
  if (lines.length === 0) {
    flags.push({
      en: 'No itemized amounts were read. No total was checked.',
      kn: 'ವಿವರವಾದ ಮೊತ್ತಗಳು ಸಿಗಲಿಲ್ಲ. ಒಟ್ಟು ಮೊತ್ತವನ್ನು ಪರಿಶೀಲಿಸಿಲ್ಲ.',
    })
  }
  return { lines, computedTotal, printedTotal, flags }
}

export function billQuestions(review: BillReview): Copy[] {
  const questions: Copy[] = review.flags.map((flag) => ({
    en: `Could you walk me through this line on my bill? ${flag.en}`,
    kn: `ನನ್ನ ಬಿಲ್ಲಿನ ಈ ಸಾಲನ್ನು ವಿವರಿಸಬಹುದೇ? ${flag.kn}`,
  }))
  questions.push({
    en: 'Which items, if any, were charged twice, and can I see the supporting slip?',
    kn: 'ಯಾವ ವಸ್ತುಗಳಿಗೆ ಎರಡು ಬಾರಿ ಶುಲ್ಕ ಹಾಕಿದ್ದೀರಿ? ಬೆಂಬಲ ಚೀಟಿ ತೋರಿಸಬಹುದೇ?',
  })
  return questions
}
