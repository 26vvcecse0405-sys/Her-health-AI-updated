import { careerById, interestById, skillById } from '../../data/catalog'
import type { CareerId, GapInsight, InterestId, SkillScore } from '../../types'

function severity(gap: number): GapInsight['severity'] {
  if (gap <= 0) return 'none'
  if (gap <= 15) return 'small'
  if (gap <= 35) return 'moderate'
  return 'large'
}

export function analyzeGaps(scores: SkillScore[], careerId: CareerId, interests: InterestId[]): GapInsight[] {
  const career = careerById[careerId]
  const boosted = new Set(interests.flatMap((interest) => interestById[interest].skills))
  return scores
    .map((item) => {
      const target = career.targets[item.skillId]
      const gap = Math.max(0, target - item.score)
      const interestBoost = boosted.has(item.skillId) ? 1.1 : 1
      const priority = Math.round(gap * (target / 100) * interestBoost * 10) / 10
      const skill = skillById[item.skillId]
      const interestLine = boosted.has(item.skillId)
        ? ' Your selected interests also touch this skill, so the priority is 10% higher.'
        : ''
      const why = `${skill.label} has a target of ${target} for ${career.label} because ${career.reasons[item.skillId]} Your assessment score is ${item.score}, from weighted correct answers. Skill gap = max(0, ${target} − ${item.score}) = ${gap}. Priority rises when the gap is large and the career target is high.${interestLine}`
      return {
        skillId: item.skillId,
        demonstrated: item.score,
        target,
        gap,
        priority,
        severity: severity(gap),
        why,
      }
    })
    .sort((a, b) => b.priority - a.priority || b.gap - a.gap)
}
