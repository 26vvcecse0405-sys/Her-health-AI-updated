import type { AchievementView, StoredLearning } from '../../types'
import { gradeQuiz } from '../quizzes/local'
import { scoreAnswers } from '../assessment/score'
import { shiftDay } from '../learning/time'

export function currentStreak(activityDays: string[], today: string) {
  const days = new Set(activityDays)
  let cursor = days.has(today) ? today : shiftDay(today, -1)
  if (!days.has(cursor)) return 0
  let count = 0
  while (days.has(cursor)) {
    count += 1
    cursor = shiftDay(cursor, -1)
  }
  return count
}

function streakReached(activityDays: string[], today: string, target: number) {
  const days = [...new Set(activityDays)].sort()
  for (const day of days) {
    if (day > today) continue
    const streak = currentStreak(days.filter((item) => item <= day), day)
    if (streak >= target) return day
  }
  return null
}

export function skillImprovement(state: StoredLearning) {
  const attempts = state.attempts
  if (attempts.length < 2) return null
  let best: { skillId: string; delta: number; at: string } | null = null
  for (let later = 1; later < attempts.length; later += 1) {
    const before = scoreAnswers(attempts[later - 1]!.answers).bySkill
    const after = scoreAnswers(attempts[later]!.answers).bySkill
    for (const score of after) {
      const previous = before.find((item) => item.skillId === score.skillId)?.score ?? 0
      const delta = score.score - previous
      if (delta >= 10 && (!best || delta > best.delta)) {
        best = { skillId: score.skillId, delta, at: attempts[later]!.completedAt }
      }
    }
  }
  return best
}

export function evaluateAchievements(state: StoredLearning, today: string): AchievementView[] {
  const days = state.activity.map((item) => item.day)
  const streak = currentStreak(days, today)
  const streakDay = streak >= 3 ? streakReached(days, today, 3) : null
  const quizzes = state.quizAttempts.map((attempt) => ({ attempt, grade: gradeQuiz(attempt.questions, attempt.answers) }))
  const quizHit = quizzes.find((item) => item.grade.total >= 5 && item.grade.percent >= 80)
  const phaseDone = state.roadmap?.phases.find((phase) => phase.tasks.length > 0 && phase.tasks.every((task) => state.taskCompletedAt[task.id]))
  const phaseAt = phaseDone ? phaseDone.tasks.map((task) => state.taskCompletedAt[task.id]).sort().at(-1) ?? null : null
  const improvement = skillImprovement(state)
  const catalog = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete onboarding with a career, a study rhythm, and at least one interest.',
      earnedAt: state.profile ? state.profile.createdAt : null,
      progress: state.profile ? 1 : 0,
      target: 1,
    },
    {
      id: 'skill-explorer',
      title: 'Skill Explorer',
      description: 'Finish a full assessment. The score comes from the answers you submit.',
      earnedAt: state.attempts[0]?.completedAt ?? null,
      progress: Math.min(state.attempts.length, 1),
      target: 1,
    },
    {
      id: 'consistency',
      title: 'Consistency Champion',
      description: 'Keep a learning streak of 3 days. A day counts when you assess, finish a task, or take a quiz.',
      earnedAt: streakDay ? `${streakDay}T12:00:00.000Z` : null,
      progress: Math.min(streak, 3),
      target: 3,
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: 'Score at least 80% on a quiz with 5 or more questions.',
      earnedAt: quizHit?.attempt.at ?? null,
      progress: quizHit ? 1 : 0,
      target: 1,
    },
    {
      id: 'roadmap-runner',
      title: 'Roadmap Runner',
      description: 'Complete every task in a roadmap phase.',
      earnedAt: phaseAt,
      progress: phaseDone ? 1 : 0,
      target: 1,
    },
    {
      id: 'skill-builder',
      title: 'Skill Builder',
      description: 'Raise a skill by at least 10 points on a later assessment.',
      earnedAt: improvement?.at ?? null,
      progress: improvement ? 1 : state.attempts.length > 1 ? 0 : Math.min(state.attempts.length, 1),
      target: state.attempts.length > 1 ? 1 : 2,
    },
  ] satisfies AchievementView[]
  return catalog
}

export function pointsFor(state: StoredLearning, achievements: AchievementView[]) {
  const assessmentPoints = state.attempts.length * 40
  const liveTasks = new Set(state.roadmap?.phases.flatMap((phase) => phase.tasks.map((task) => task.id)) ?? [])
  const taskPoints = Object.keys(state.taskCompletedAt).filter((id) => liveTasks.has(id)).length * 15
  const quizPoints = state.quizAttempts.reduce((sum, attempt) => sum + gradeQuiz(attempt.questions, attempt.answers).correct * 8, 0)
  const badgePoints = achievements.filter((item) => item.earnedAt).length * 20
  return assessmentPoints + taskPoints + quizPoints + badgePoints
}
