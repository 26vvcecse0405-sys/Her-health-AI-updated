import { practiceCards, practiceQuestions } from '../../data/practiceBank.ts'
import { hashString, uid } from '../learning/time.ts'
import type { Difficulty, Flashcard, QuizQuestion, SkillId } from '../../types.ts'

export interface PracticeRequest {
  skillId: SkillId
  difficulty: Difficulty
  topic: string
  focus?: string
  count?: number
}

function orderByTopic<T extends { id: string }>(items: T[], topic: string, focus: string) {
  return [...items].sort((a, b) => hashString(`${topic}|${focus}|${a.id}`) - hashString(`${topic}|${focus}|${b.id}`))
}

export function localQuiz(request: PracticeRequest) {
  const count = request.count ?? 5
  const focus = request.focus ?? ''
  const sameSkill = practiceQuestions.filter((item) => item.skillId === request.skillId)
  const exact = sameSkill.filter((item) => item.difficulty === request.difficulty)
  const ordered = [...orderByTopic(exact, request.topic, focus), ...orderByTopic(sameSkill.filter((item) => item.difficulty !== request.difficulty), request.topic, focus)]
  const picked = ordered.slice(0, count)
  const padded = picked.length < count
  const questions: QuizQuestion[] = picked.map((item) => ({
    id: `${item.id}-${hashString(request.topic)}`,
    prompt: item.prompt,
    options: [...item.options],
    correctIndex: item.correctIndex,
    explanation: item.explanation,
    skillId: item.skillId,
    difficulty: item.difficulty,
  }))
  const note = padded
    ? `Local question bank for “${request.topic}”. Not enough ${request.difficulty} items, so nearby difficulties were added. No live model was called.`
    : `Local question bank for “${request.topic}”. No live model was called.`
  return { questions, note }
}

export function localCards(request: PracticeRequest) {
  const focus = request.focus ?? ''
  const sameSkill = practiceCards.filter((item) => item.skillId === request.skillId)
  const ordered = orderByTopic(sameSkill.length >= 6 ? sameSkill : practiceCards, request.topic, focus)
  const cards: Flashcard[] = ordered.slice(0, 6).map((item) => ({
    id: `${item.id}-${hashString(`${request.topic}|${request.skillId}`)}`,
    skillId: item.skillId,
    front: item.front,
    back: item.back,
    known: false,
    source: 'local',
  }))
  return {
    cards,
    note: `Local flashcards for “${request.topic}”. No live model was called.`,
  }
}

export function newAttemptId() {
  return uid()
}
