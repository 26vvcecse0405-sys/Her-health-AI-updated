import { assessmentQuestions } from '../../data/assessmentBank.ts'
import { buildRoadmap } from './roadmap.ts'
import { localDay, uid } from './time.ts'
import type {
  Activity,
  AssessmentDraft,
  ChatMessage,
  Flashcard,
  QuizAttempt,
  StoredLearning,
  StudentProfile,
} from '../../types.ts'

export function emptyLearning(): StoredLearning {
  return {
    version: 1,
    profile: null,
    attempts: [],
    draft: null,
    roadmap: null,
    taskCompletedAt: {},
    quizAttempts: [],
    missed: [],
    flashcards: [],
    cardReviews: [],
    messages: [],
    activity: [],
  }
}

function withRoadmap(state: StoredLearning): StoredLearning {
  return { ...state, roadmap: buildRoadmap(state) }
}

function log(state: StoredLearning, activity: Omit<Activity, 'id' | 'day'> & { day?: string }): StoredLearning {
  const at = activity.at
  return {
    ...state,
    activity: [
      ...state.activity,
      {
        id: uid(),
        at,
        day: activity.day ?? localDay(new Date(at)),
        kind: activity.kind,
        minutes: activity.minutes,
        label: activity.label,
        ref: activity.ref,
      },
    ],
  }
}

export function applyProfile(state: StoredLearning, profile: StudentProfile) {
  return withRoadmap({ ...state, profile })
}

export function saveDraft(state: StoredLearning, draft: AssessmentDraft) {
  return { ...state, draft }
}

export function submitAssessment(state: StoredLearning) {
  if (!state.profile || !state.draft) return state
  const missing = assessmentQuestions.some((question) => state.draft?.answers[question.id] === undefined)
  if (missing) return state
  const completedAt = new Date().toISOString()
  const attempt = {
    id: uid(),
    startedAt: state.draft.index === 0 ? completedAt : state.profile.createdAt,
    completedAt,
    answers: state.draft.answers,
  }
  const next = log(
    { ...state, attempts: [...state.attempts, attempt], draft: null },
    { at: completedAt, kind: 'assessment', minutes: 12, label: 'Skill assessment', ref: attempt.id },
  )
  return withRoadmap(next)
}

export function toggleTask(state: StoredLearning, taskId: string) {
  const task = state.roadmap?.phases.flatMap((phase) => phase.tasks).find((item) => item.id === taskId)
  if (!task) return state
  if (state.taskCompletedAt[taskId]) {
    const rest = { ...state.taskCompletedAt }
    delete rest[taskId]
    return {
      ...state,
      taskCompletedAt: rest,
      activity: state.activity.filter((item) => !(item.kind === 'task' && item.ref === taskId)),
    }
  }
  const at = new Date().toISOString()
  const next = log(
    { ...state, taskCompletedAt: { ...state.taskCompletedAt, [taskId]: at } },
    { at, kind: 'task', minutes: task.minutes, label: task.title, ref: taskId },
  )
  return next
}

export function rebuild(state: StoredLearning) {
  return withRoadmap(state)
}

export function recordQuiz(state: StoredLearning, attempt: QuizAttempt) {
  const missed = attempt.questions.flatMap((question, index) => {
    if (attempt.answers[index] === question.correctIndex) return []
    return [{ id: uid(), question, topic: attempt.topic, missedAt: attempt.at }]
  })
  return log(
    { ...state, quizAttempts: [...state.quizAttempts, attempt], missed: [...state.missed, ...missed] },
    { at: attempt.at, kind: 'quiz', minutes: Math.max(6, attempt.questions.length * 2), label: attempt.topic, ref: attempt.id },
  )
}

export function resolveMiss(state: StoredLearning, missedId: string, chosen: number) {
  const miss = state.missed.find((item) => item.id === missedId)
  if (!miss || chosen !== miss.question.correctIndex) return state
  const at = new Date().toISOString()
  return log(
    { ...state, missed: state.missed.filter((item) => item.id !== missedId) },
    { at, kind: 'review', minutes: 3, label: `Revised: ${miss.topic}`, ref: missedId },
  )
}

export function replaceCards(state: StoredLearning, cards: Flashcard[]) {
  return { ...state, flashcards: cards }
}

export function reviewCard(state: StoredLearning, cardId: string, known: boolean) {
  const card = state.flashcards.find((item) => item.id === cardId)
  if (!card) return state
  const at = new Date().toISOString()
  return {
    ...state,
    flashcards: state.flashcards.map((item) => (item.id === cardId ? { ...item, known } : item)),
    cardReviews: [...state.cardReviews, { id: uid(), cardId, at, known }],
  }
}

export function addMessage(state: StoredLearning, message: ChatMessage) {
  return { ...state, messages: [...state.messages, message] }
}
