import { scoreAnswers, type ScoredAttempt } from '../assessment/score.ts'
import type { AchievementView, QuizAttempt, RoadmapTask, StoredLearning } from '../../types.ts'
import { buildAchievements, pointBreakdown } from './achievements.ts'
import { skillGaps } from './gaps.ts'
import { flatTasks, prerequisiteMet } from './roadmap.ts'
import { localDay } from './time.ts'

export interface QuizSummary {
  attempt: QuizAttempt
  correct: number
  total: number
  percent: number
}

export interface LearningView {
  latest: StoredLearning['attempts'][number] | null
  latestScore: ScoredAttempt | null
  previousScore: ScoredAttempt | null
  gaps: ReturnType<typeof skillGaps>
  developing: ReturnType<typeof skillGaps>
  mastered: ReturnType<typeof skillGaps>
  tasks: RoadmapTask[]
  done: RoadmapTask[]
  nextTask: RoadmapTask | null
  progress: number
  streak: number
  quizzes: QuizSummary[]
  quizAccuracy: number
  achievements: AchievementView[]
  points: number
  pointNotes: string[]
}

export function homeFor(state: StoredLearning) {
  if (!state.profile) return '/onboarding'
  if (state.attempts.length === 0) return '/assessment'
  return '/dashboard'
}

export function minutesByDay(state: StoredLearning, days: number) {
  const rows: { day: string; minutes: number }[] = []
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - offset)
    const key = localDay(date)
    const minutes = state.activity.filter((item) => item.day === key).reduce((sum, item) => sum + item.minutes, 0)
    rows.push({ day: key.slice(5), minutes })
  }
  return rows
}

function streakDays(state: StoredLearning) {
  const days = new Set(state.activity.map((item) => item.day))
  const cursor = new Date()
  if (!days.has(localDay(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!days.has(localDay(cursor))) return [] as string[]
  }
  const found: string[] = []
  while (days.has(localDay(cursor))) {
    found.push(localDay(cursor))
    cursor.setDate(cursor.getDate() - 1)
  }
  return found.reverse()
}

function quizSummary(attempt: QuizAttempt): QuizSummary {
  const total = attempt.questions.length
  const correct = attempt.questions.filter((question, index) => attempt.answers[index] === question.correctIndex).length
  return {
    attempt,
    correct,
    total,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
  }
}

function activityOn(state: StoredLearning, day: string | undefined) {
  if (!day) return null
  return state.activity.find((item) => item.day === day)?.at ?? null
}

export function derive(state: StoredLearning): LearningView {
  const latest = state.attempts[state.attempts.length - 1] ?? null
  const previous = state.attempts[state.attempts.length - 2] ?? null
  const latestScore = latest ? scoreAnswers(latest.answers) : null
  const previousScore = previous ? scoreAnswers(previous.answers) : null
  const gaps = state.profile && latestScore ? skillGaps(state.profile, latestScore.bySkill) : []
  const tasks = flatTasks(state.roadmap)
  const done = tasks.filter((task) => state.taskCompletedAt[task.id])
  const nextTask = tasks.find((task) => !state.taskCompletedAt[task.id] && prerequisiteMet(task, tasks, state.taskCompletedAt)) ?? null
  const quizzes = state.quizAttempts.map(quizSummary)
  const quizCorrect = quizzes.reduce((sum, quiz) => sum + quiz.correct, 0)
  const quizTotal = quizzes.reduce((sum, quiz) => sum + quiz.total, 0)
  const streakList = streakDays(state)
  const completionTimes = Object.values(state.taskCompletedAt).sort()
  const passingQuiz = quizzes.find((quiz) => quiz.percent >= 80)
  const achievements = buildAchievements({
    attempts: state.attempts.length,
    skillsScored: latestScore?.bySkill.length ?? 0,
    streak: streakList.length,
    bestQuiz: quizzes.reduce((best, quiz) => Math.max(best, quiz.percent), 0),
    tasksDone: done.length,
    firstAttemptAt: latest ? state.attempts[0]?.completedAt ?? latest.completedAt : null,
    consistencyAt: activityOn(state, streakList[2]),
    quizMasterAt: passingQuiz?.attempt.at ?? null,
    runnerAt: completionTimes[3] ?? null,
    builderAt: completionTimes[2] ?? null,
  })
  const points = pointBreakdown({
    attempts: state.attempts.length,
    tasksDone: done.length,
    quizzes,
    revisions: state.activity.filter((item) => item.kind === 'review').length,
    badges: achievements.filter((item) => item.earnedAt).length,
  })
  return {
    latest,
    latestScore,
    previousScore,
    gaps,
    developing: gaps.filter((gap) => gap.gap > 0),
    mastered: gaps.filter((gap) => gap.gap === 0),
    tasks,
    done,
    nextTask,
    progress: tasks.length === 0 ? 0 : Math.round((done.length / tasks.length) * 100),
    streak: streakList.length,
    quizzes,
    quizAccuracy: quizTotal === 0 ? 0 : Math.round((quizCorrect / quizTotal) * 100),
    achievements,
    points: points.total,
    pointNotes: points.notes,
  }
}
