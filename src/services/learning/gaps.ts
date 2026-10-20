import { careerById, interestById, skillById } from '../../data/catalog.ts'
import type { ScoredAttempt } from '../assessment/score.ts'
import type { GapInsight, StudentProfile } from '../../types.ts'

export const severityLabel = {
  none: 'On target',
  small: 'Small gap',
  moderate: 'Moderate gap',
  large: 'Large gap',
} as const

export function skillGaps(profile: StudentProfile, bySkill: ScoredAttempt['bySkill']): GapInsight[] {
  const career = careerById[profile.career]
  const interestSkills = new Set(profile.interests.flatMap((interest) => interestById[interest].skills))
  const rows = bySkill.map((item) => {
    const target = career.targets[item.skillId]
    const demonstrated = item.score
    const gap = Math.max(0, target - demonstrated)
    const relevance = career.core.includes(item.skillId) ? 1.3 : 1
    const interest = interestSkills.has(item.skillId) ? 1.15 : 1
    const raw = gap * relevance * interest
    const priority = Math.round(raw * 10) / 10
    const severity: GapInsight['severity'] = gap === 0 ? 'none' : gap <= 15 ? 'small' : gap <= 35 ? 'moderate' : 'large'
    const skill = skillById[item.skillId]
    const why = [
      `${skill.label} matters for this target. ${career.reasons[item.skillId]}`,
      `You demonstrated ${demonstrated}. The configurable target for ${career.label} is ${target}.`,
      `Skill gap = max(0, ${target} − ${demonstrated}) = ${gap}.`,
      `Priority = ${gap} × ${relevance} career relevance × ${interest} interest match = ${priority}.`,
      interest > 1 ? 'This skill also matches an interest you selected.' : 'This skill is not in the interests you selected.',
      relevance > 1 ? 'It is marked as a core skill for this career target.' : 'It is a supporting skill for this career target.',
      'The target is guidance for study planning, not an employment prediction.',
    ].join(' ')
    return { skillId: item.skillId, demonstrated, target, gap, priority, severity, why }
  })
  return rows.sort((a, b) => b.priority - a.priority || a.skillId.localeCompare(b.skillId))
}
