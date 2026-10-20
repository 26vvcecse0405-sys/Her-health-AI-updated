import { cardSeeds, quizBank } from '../../data/quizBank'
import { skillById } from '../../data/catalog'
import type { Difficulty, Flashcard, QuizQuestion, SkillId } from '../../types'

const rank: Record<Difficulty, number> = { foundation: 0, intermediate: 1, advanced: 2 }

export function localQuiz(input: { skillId: SkillId; difficulty: Difficulty; count: number; focus: string }) {
  const focus = input.focus.trim().toLowerCase()
  const sameSkill = quizBank.filter((question) => question.skillId === input.skillId)
  const exact = sameSkill.filter((question) => question.difficulty === input.difficulty)
  const nearby = sameSkill
    .filter((question) => question.difficulty !== input.difficulty)
    .slice()
    .sort((a, b) => Math.abs(rank[a.difficulty] - rank[input.difficulty]) - Math.abs(rank[b.difficulty] - rank[input.difficulty]))
  const pool = [...exact, ...nearby]
  const preferred = focus
    ? pool.slice().sort((a, b) => Number(b.prompt.toLowerCase().includes(focus)) - Number(a.prompt.toLowerCase().includes(focus)))
    : pool
  const picked = preferred.slice(0, input.count)
  const mixed = picked.some((question) => question.difficulty !== input.difficulty)
  const questions: QuizQuestion[] = picked.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    options: [...question.options],
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    skillId: question.skillId,
    difficulty: question.difficulty,
  }))
  const note = mixed
    ? `Local question bank for ${skillById[input.skillId].label}. Nearby difficulty levels were included because the bank did not have ${input.count} questions only at ${input.difficulty}.`
    : `Local question bank for ${skillById[input.skillId].label}. Questions are fixed for this topic and difficulty, then scored from the options you choose.`
  return { questions, note }
}

export function gradeQuiz(questions: QuizQuestion[], answers: number[]) {
  let correct = 0
  questions.forEach((question, index) => {
    if (answers[index] === question.correctIndex) correct += 1
  })
  return { correct, total: questions.length, percent: questions.length === 0 ? 0 : Math.round((correct / questions.length) * 100) }
}

export function localCards(skillId: SkillId): Flashcard[] {
  const seeds = cardSeeds.filter((card) => card.skillId === skillId)
  const extras = quizBank
    .filter((question) => question.skillId === skillId)
    .slice(0, Math.max(0, 6 - seeds.length))
    .map((question) => ({
      id: `card-${question.id}`,
      skillId,
      front: question.prompt,
      back: `${question.options[question.correctIndex]}. ${question.explanation}`,
      known: false,
      source: 'local' as const,
    }))
  return [...seeds.map((card) => ({ ...card, known: false, source: 'local' as const })), ...extras].slice(0, 6)
}
