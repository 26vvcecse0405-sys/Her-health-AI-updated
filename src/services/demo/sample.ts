import { assessmentQuestions } from '../../data/assessmentBank.ts'
import { demoReply } from '../assistant/demo.ts'
import {
  addMessage,
  applyProfile,
  emptyLearning,
  recordQuiz,
  replaceCards,
  reviewCard,
  saveDraft,
  submitAssessment,
  toggleTask,
} from '../learning/actions.ts'
import { atDaysAgo, localDay } from '../learning/time.ts'
import { localCards, localQuiz } from '../practice/generate.ts'
import type { StoredLearning } from '../../types.ts'

const wrongIds = new Set(['reasoning-1', 'data-2', 'communication-2', 'creativity-1'])

function stamp(state: StoredLearning): StoredLearning {
  const assessmentAt = atDaysAgo(3, 18)
  const taskTimes = [atDaysAgo(2, 19), atDaysAgo(1, 17)]
  const today = atDaysAgo(0, 16)
  let taskIndex = 0
  const activity = state.activity.map((item) => {
    if (item.kind === 'assessment') return { ...item, at: assessmentAt, day: localDay(new Date(assessmentAt)) }
    if (item.kind === 'task') {
      const at = taskTimes[Math.min(taskIndex, taskTimes.length - 1)] ?? today
      taskIndex += 1
      return { ...item, at, day: localDay(new Date(at)) }
    }
    return { ...item, at: today, day: localDay(new Date(today)) }
  })
  const taskCompletedAt = { ...state.taskCompletedAt }
  for (const item of activity) {
    if (item.kind === 'task') taskCompletedAt[item.ref] = item.at
  }
  return {
    ...state,
    activity,
    taskCompletedAt,
    attempts: state.attempts.map((attempt, index) => (
      index === state.attempts.length - 1 ? { ...attempt, startedAt: atDaysAgo(3, 17), completedAt: assessmentAt } : attempt
    )),
    quizAttempts: state.quizAttempts.map((quiz, index) => (index === state.quizAttempts.length - 1 ? { ...quiz, at: today } : quiz)),
    missed: state.missed.map((item) => ({ ...item, missedAt: today })),
    cardReviews: state.cardReviews.map((item) => ({ ...item, at: today })),
    messages: state.messages.map((item, index) => ({ ...item, at: atDaysAgo(0, 16 + index) })),
    profile: state.profile ? { ...state.profile, createdAt: atDaysAgo(3, 9) } : null,
  }
}

export function buildSample(): StoredLearning {
  let state = applyProfile(emptyLearning(), {
    id: 'demo-ananya',
    name: 'Ananya Rao',
    educationLevel: 'undergraduate',
    confidence: { programming: 4, reasoning: 3, data: 3, communication: 4, problemSolving: 4, creativity: 3 },
    interests: ['ai', 'coding', 'data'],
    learningStyle: 'practice',
    career: 'aiml',
    minutesPerDay: 60,
    durationWeeks: 8,
    createdAt: atDaysAgo(3, 9),
    isDemo: true,
  })
  const answers = Object.fromEntries(assessmentQuestions.map((question) => [
    question.id,
    wrongIds.has(question.id) ? (question.correctIndex + 1) % 4 : question.correctIndex,
  ]))
  state = saveDraft(state, { index: assessmentQuestions.length - 1, answers })
  state = submitAssessment(state)
  const taskIds = state.roadmap?.phases.flatMap((phase) => phase.tasks).map((task) => task.id) ?? []
  if (taskIds[0]) state = toggleTask(state, taskIds[0])
  if (taskIds[1]) state = toggleTask(state, taskIds[1])
  const quiz = localQuiz({ skillId: 'data', difficulty: 'foundation', topic: 'Reading charts', focus: 'averages', count: 5 })
  const quizAnswers = quiz.questions.map((question, index) => (index < 2 ? (question.correctIndex + 1) % question.options.length : question.correctIndex))
  state = recordQuiz(state, {
    id: 'demo-quiz-charts',
    topic: 'Reading charts',
    focus: 'averages',
    skillId: 'data',
    difficulty: 'foundation',
    at: new Date().toISOString(),
    source: 'local',
    sourceNote: quiz.note,
    questions: quiz.questions,
    answers: quizAnswers,
  })
  const cards = localCards({ skillId: 'data', difficulty: 'foundation', topic: 'Reading charts', focus: 'averages' })
  state = replaceCards(state, cards.cards)
  const firstCard = state.flashcards[0]
  if (firstCard) state = reviewCard(state, firstCard.id, true)
  const question = 'What should I study next?'
  state = addMessage(state, {
    id: 'demo-msg-user',
    role: 'user',
    content: question,
    at: new Date().toISOString(),
    source: 'learner',
  })
  state = addMessage(state, {
    id: 'demo-msg-tutor',
    role: 'assistant',
    content: demoReply(question, state),
    at: new Date().toISOString(),
    source: 'demo',
    note: 'Demo reply. No live model was used.',
  })
  return stamp(state)
}
