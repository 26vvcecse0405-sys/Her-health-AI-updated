import type { AchievementView } from '../../types.ts'

export interface AchievementInput {
  attempts: number
  skillsScored: number
  streak: number
  bestQuiz: number
  tasksDone: number
  firstAttemptAt: string | null
  consistencyAt: string | null
  quizMasterAt: string | null
  runnerAt: string | null
  builderAt: string | null
}

export function buildAchievements(input: AchievementInput): AchievementView[] {
  const first = input.attempts >= 1
  const explorer = input.skillsScored >= 6
  const consistency = input.streak >= 3
  const quizMaster = input.bestQuiz >= 80
  const runner = input.tasksDone >= 4
  const builder = input.tasksDone >= 3
  return [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Submit a complete skill assessment.',
      earnedAt: first ? input.firstAttemptAt : null,
      progress: Math.min(input.attempts, 1),
      target: 1,
    },
    {
      id: 'skill-explorer',
      title: 'Skill Explorer',
      description: 'Receive a score for all six skills in one assessment.',
      earnedAt: explorer ? input.firstAttemptAt : null,
      progress: explorer ? 1 : 0,
      target: 1,
    },
    {
      id: 'consistency',
      title: 'Consistency Champion',
      description: 'Log learning activity on three days in a row.',
      earnedAt: consistency ? input.consistencyAt : null,
      progress: Math.min(input.streak, 3),
      target: 3,
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: 'Score at least 80% on a quiz.',
      earnedAt: quizMaster ? input.quizMasterAt : null,
      progress: Math.min(input.bestQuiz, 80),
      target: 80,
    },
    {
      id: 'roadmap-runner',
      title: 'Roadmap Runner',
      description: 'Mark four roadmap tasks complete.',
      earnedAt: runner ? input.runnerAt : null,
      progress: Math.min(input.tasksDone, 4),
      target: 4,
    },
    {
      id: 'skill-builder',
      title: 'Skill Builder',
      description: 'Mark three roadmap tasks complete.',
      earnedAt: builder ? input.builderAt : null,
      progress: Math.min(input.tasksDone, 3),
      target: 3,
    },
  ]
}

export function pointBreakdown(input: {
  attempts: number
  tasksDone: number
  quizzes: { percent: number }[]
  revisions: number
  badges: number
}) {
  const assessment = input.attempts * 40
  const tasks = input.tasksDone * 15
  const quizBase = input.quizzes.length * 10
  const quizBonus = input.quizzes.filter((quiz) => quiz.percent >= 80).length * 15
  const revisions = input.revisions * 5
  const badges = input.badges * 20
  const notes = [
    `${input.attempts} assessment${input.attempts === 1 ? '' : 's'} × 40 = ${assessment}`,
    `${input.tasksDone} completed task${input.tasksDone === 1 ? '' : 's'} × 15 = ${tasks}`,
    `${input.quizzes.length} quiz${input.quizzes.length === 1 ? '' : 'zes'} × 10 = ${quizBase}`,
    `${input.quizzes.filter((quiz) => quiz.percent >= 80).length} quiz score${input.quizzes.filter((quiz) => quiz.percent >= 80).length === 1 ? '' : 's'} at 80% or higher × 15 = ${quizBonus}`,
    `${input.revisions} revised miss${input.revisions === 1 ? '' : 'es'} × 5 = ${revisions}`,
    `${input.badges} earned badge${input.badges === 1 ? '' : 's'} × 20 = ${badges}`,
  ]
  return { total: assessment + tasks + quizBase + quizBonus + revisions + badges, notes }
}
