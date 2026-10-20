import { z } from 'zod'
import {
  careerIds,
  difficulties,
  educationLevels,
  interestIds,
  learningStyles,
  skillIds,
} from '../../types.ts'

const skillEnum = z.enum(skillIds)
const difficultyEnum = z.enum(difficulties)

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(40),
  educationLevel: z.enum(educationLevels),
  confidence: z.object({
    programming: z.number().int().min(1).max(5),
    reasoning: z.number().int().min(1).max(5),
    data: z.number().int().min(1).max(5),
    communication: z.number().int().min(1).max(5),
    problemSolving: z.number().int().min(1).max(5),
    creativity: z.number().int().min(1).max(5),
  }),
  interests: z.array(z.enum(interestIds)).min(1),
  learningStyle: z.enum(learningStyles),
  career: z.enum(careerIds),
  minutesPerDay: z.number().int().min(15).max(180),
  durationWeeks: z.number().int().min(2).max(12),
})

const studentProfileSchema = profileSchema.extend({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  isDemo: z.boolean(),
})

const quizQuestionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  options: z.array(z.string()).min(2).max(6),
  correctIndex: z.number().int().min(0).max(5),
  explanation: z.string().min(1),
  skillId: skillEnum,
  difficulty: difficultyEnum,
})

const roadmapTaskSchema = z.object({
  id: z.string().min(1),
  skillId: skillEnum,
  title: z.string().min(1),
  summary: z.string().min(1),
  minutes: z.number().int().min(1),
  difficulty: difficultyEnum,
  resource: z.string().min(1),
  href: z.string().min(1),
  prerequisite: z.string().nullable(),
  reason: z.string().min(1),
})

export const learningSchema = z.object({
  version: z.literal(1),
  profile: studentProfileSchema.nullable(),
  attempts: z.array(z.object({
    id: z.string().min(1),
    startedAt: z.string().min(1),
    completedAt: z.string().min(1),
    answers: z.record(z.string(), z.number()),
  })),
  draft: z.object({
    index: z.number().int().min(0),
    answers: z.record(z.string(), z.number()),
  }).nullable(),
  roadmap: z.object({
    id: z.string().min(1),
    generatedAt: z.string().min(1),
    method: z.literal('rules'),
    methodNote: z.string().min(1),
    narrative: z.string().min(1),
    budgetMinutes: z.number().int().min(0),
    phases: z.array(z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      summary: z.string().min(1),
      milestone: z.string().min(1),
      tasks: z.array(roadmapTaskSchema),
    })),
  }).nullable(),
  taskCompletedAt: z.record(z.string(), z.string()),
  quizAttempts: z.array(z.object({
    id: z.string().min(1),
    topic: z.string().min(1),
    focus: z.string(),
    skillId: skillEnum,
    difficulty: difficultyEnum,
    at: z.string().min(1),
    source: z.enum(['local', 'openai']),
    sourceNote: z.string(),
    questions: z.array(quizQuestionSchema),
    answers: z.array(z.number()),
  })),
  missed: z.array(z.object({
    id: z.string().min(1),
    question: quizQuestionSchema,
    topic: z.string().min(1),
    missedAt: z.string().min(1),
  })),
  flashcards: z.array(z.object({
    id: z.string().min(1),
    skillId: skillEnum,
    front: z.string().min(1),
    back: z.string().min(1),
    known: z.boolean(),
    source: z.enum(['local', 'openai']),
  })),
  cardReviews: z.array(z.object({
    id: z.string().min(1),
    cardId: z.string().min(1),
    at: z.string().min(1),
    known: z.boolean(),
  })),
  messages: z.array(z.object({
    id: z.string().min(1),
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    at: z.string().min(1),
    source: z.enum(['learner', 'demo', 'openai']),
    note: z.string().optional(),
  })),
  activity: z.array(z.object({
    id: z.string().min(1),
    at: z.string().min(1),
    day: z.string().min(1),
    kind: z.enum(['assessment', 'task', 'quiz', 'review']),
    minutes: z.number().int().min(0),
    label: z.string().min(1),
    ref: z.string().min(1),
  })),
})

export const assistantRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  brief: z.string().max(4000).optional(),
})

export const practiceRequestSchema = z.object({
  kind: z.enum(['quiz', 'cards']),
  skillId: skillEnum,
  difficulty: difficultyEnum,
  topic: z.string().trim().min(2).max(120),
  focus: z.string().trim().max(200).optional(),
  count: z.number().int().min(3).max(8).optional(),
})

const generatedQuestion = z.object({
  prompt: z.string().trim().min(8),
  options: z.tuple([
    z.string().trim().min(1),
    z.string().trim().min(1),
    z.string().trim().min(1),
    z.string().trim().min(1),
  ]),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().trim().min(8),
}).refine((question) => new Set(question.options).size === 4, 'Options must be distinct.')

export function generatedQuizSchema(count: number) {
  return z.object({
    questions: z.array(generatedQuestion).length(count),
  })
}

export const generatedCardsSchema = z.object({
  cards: z.array(z.object({
    front: z.string().trim().min(3),
    back: z.string().trim().min(3),
  })).length(6),
})
