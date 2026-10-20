import { assessmentQuestions } from './data/assessmentBank.ts'
import { careerById } from './data/catalog.ts'
import { scoreAnswers } from './services/assessment/score.ts'
import { buildSample } from './services/demo/sample.ts'
import { derive } from './services/learning/derive.ts'
import { skillGaps } from './services/learning/gaps.ts'
import { learningSchema } from './services/persistence/schema.ts'

function check(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const sample = buildSample()
const parsed = learningSchema.safeParse(sample)
if (!parsed.success) throw new Error(`Sample failed schema: ${parsed.error.issues.slice(0, 3).map((issue) => issue.message).join('; ')}`)

const view = derive(sample)
const score = view.latestScore
check(Boolean(score), 'Sample has no score')
check(score?.overall === 67, `Expected overall 67, got ${score?.overall}`)
check(score?.bySkill.find((item) => item.skillId === 'programming')?.score === 100, 'Programming should be 100')
check(score?.bySkill.find((item) => item.skillId === 'data')?.score === 33, 'Data should be 33')
check(score?.bySkill.find((item) => item.skillId === 'reasoning')?.score === 67, 'Reasoning should be 67')

const dataGap = view.gaps.find((gap) => gap.skillId === 'data')
check(dataGap?.gap === Math.max(0, careerById.aiml.targets.data - 33), 'Data gap formula drifted')
check(dataGap?.gap === 52, 'Data gap should be 52')
check(view.developing[0]?.skillId === 'data', 'Data should be the first priority')
check(view.mastered.some((gap) => gap.skillId === 'programming'), 'Programming should be on target')
check((sample.roadmap?.phases.length ?? 0) > 0, 'Roadmap missing')
check(sample.roadmap?.method === 'rules', 'Roadmap should say it is rules-based')
check(view.done.length === 2, `Expected 2 completed tasks, got ${view.done.length}`)
check(view.quizAccuracy === 60, `Expected quiz accuracy 60, got ${view.quizAccuracy}`)
check(sample.missed.length === 2, 'Expected two quiz misses')
check(view.streak >= 3, `Expected a streak of at least 3, got ${view.streak}`)
check(view.achievements.find((item) => item.id === 'first-steps')?.earnedAt != null, 'First Steps should be earned')
check(view.achievements.find((item) => item.id === 'consistency')?.earnedAt != null, 'Consistency should be earned')
check(view.achievements.find((item) => item.id === 'quiz-master')?.earnedAt == null, 'Quiz Master should still be locked')
check(view.achievements.find((item) => item.id === 'skill-builder')?.earnedAt == null, 'Skill Builder should still be locked')

const blank = Object.fromEntries(assessmentQuestions.map((question) => [question.id, (question.correctIndex + 1) % 4]))
check(scoreAnswers(blank).overall === 0, 'All-wrong assessment should score 0')
if (sample.profile) {
  const gaps = skillGaps(sample.profile, scoreAnswers(blank).bySkill)
  check(gaps.every((gap) => gap.gap === gap.target), 'A zero score should leave a gap equal to the target')
}

console.log(`SkillSprint self-check passed. Ananya overall ${score?.overall}, data gap ${dataGap?.gap}, streak ${view.streak}, points ${view.points}.`)
