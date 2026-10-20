import { assessmentQuestions } from '../../data/assessmentBank.ts'
import { difficultyWeight } from '../../data/catalog.ts'
import { skillIds, type SkillScore } from '../../types.ts'

export interface ScoredAttempt {
  overall: number
  bySkill: SkillScore[]
}

export function scoreAnswers(answers: Record<string, number>): ScoredAttempt {
  const bySkill = skillIds.map((skillId) => {
    const questions = assessmentQuestions.filter((question) => question.skillId === skillId)
    const possible = questions.reduce((sum, question) => sum + difficultyWeight[question.difficulty], 0)
    const earned = questions.reduce(
      (sum, question) => sum + (answers[question.id] === question.correctIndex ? difficultyWeight[question.difficulty] : 0),
      0,
    )
    return {
      skillId,
      earned,
      possible,
      score: possible === 0 ? 0 : Math.round((earned / possible) * 100),
    }
  })
  const earned = bySkill.reduce((sum, item) => sum + item.earned, 0)
  const possible = bySkill.reduce((sum, item) => sum + item.possible, 0)
  return {
    overall: possible === 0 ? 0 : Math.round((earned / possible) * 100),
    bySkill,
  }
}
