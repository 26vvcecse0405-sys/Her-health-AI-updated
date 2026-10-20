export const skillIds = [
  'programming',
  'reasoning',
  'data',
  'communication',
  'problemSolving',
  'creativity',
] as const

export type SkillId = (typeof skillIds)[number]

export const careerIds = [
  'software',
  'aiml',
  'dataAnalyst',
  'uiux',
  'cyber',
  'entrepreneur',
  'consulting',
] as const

export type CareerId = (typeof careerIds)[number]

export const interestIds = [
  'coding',
  'ai',
  'data',
  'design',
  'business',
  'security',
  'communication',
  'product',
] as const

export type InterestId = (typeof interestIds)[number]

export const educationLevels = ['school', 'undergraduate', 'postgraduate', 'professional'] as const
export type EducationLevel = (typeof educationLevels)[number]

export const learningStyles = ['visual', 'reading', 'practice', 'mixed'] as const
export type LearningStyle = (typeof learningStyles)[number]

export const difficulties = ['foundation', 'intermediate', 'advanced'] as const
export type Difficulty = (typeof difficulties)[number]

export type ContentSource = 'local' | 'openai'

export interface SkillDef {
  id: SkillId
  label: string
  summary: string
  color: string
}

export interface CareerDef {
  id: CareerId
  label: string
  blurb: string
  targets: Record<SkillId, number>
  reasons: Record<SkillId, string>
  core: SkillId[]
}

export interface InterestDef {
  id: InterestId
  label: string
  skills: SkillId[]
}

export interface Mcq {
  id: string
  skillId: SkillId
  difficulty: Difficulty
  prompt: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
}

export interface TaskTemplate {
  id: string
  skillId: SkillId
  title: string
  summary: string
  minutes: number
  difficulty: Difficulty
  style: Exclude<LearningStyle, 'mixed'>
  resource: string
  href: string
  prerequisite: string | null
}

export interface CapstoneTemplate {
  career: CareerId
  title: string
  summary: string
  minutes: number
  skillId: SkillId
  resource: string
  href: string
}

export interface StudentProfile {
  id: string
  name: string
  educationLevel: EducationLevel
  confidence: Record<SkillId, number>
  interests: InterestId[]
  learningStyle: LearningStyle
  career: CareerId
  minutesPerDay: number
  durationWeeks: number
  createdAt: string
  isDemo: boolean
}

export interface SkillScore {
  skillId: SkillId
  earned: number
  possible: number
  score: number
}

export interface AssessmentAttempt {
  id: string
  startedAt: string
  completedAt: string
  answers: Record<string, number>
}

export interface AssessmentDraft {
  index: number
  answers: Record<string, number>
}

export interface GapInsight {
  skillId: SkillId
  demonstrated: number
  target: number
  gap: number
  priority: number
  severity: 'none' | 'small' | 'moderate' | 'large'
  why: string
}

export interface RoadmapTask {
  id: string
  skillId: SkillId
  title: string
  summary: string
  minutes: number
  difficulty: Difficulty
  resource: string
  href: string
  prerequisite: string | null
  reason: string
}

export interface RoadmapPhase {
  id: string
  title: string
  summary: string
  milestone: string
  tasks: RoadmapTask[]
}

export interface Roadmap {
  id: string
  generatedAt: string
  method: 'rules'
  methodNote: string
  narrative: string
  budgetMinutes: number
  phases: RoadmapPhase[]
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
  skillId: SkillId
  difficulty: Difficulty
}

export interface QuizAttempt {
  id: string
  topic: string
  focus: string
  skillId: SkillId
  difficulty: Difficulty
  at: string
  source: ContentSource
  sourceNote: string
  questions: QuizQuestion[]
  answers: number[]
}

export interface Flashcard {
  id: string
  skillId: SkillId
  front: string
  back: string
  known: boolean
  source: ContentSource
}

export interface CardReview {
  id: string
  cardId: string
  at: string
  known: boolean
}

export interface MissedQuestion {
  id: string
  question: QuizQuestion
  topic: string
  missedAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  at: string
  source: 'learner' | 'demo' | 'openai'
  note?: string
}

export interface Activity {
  id: string
  at: string
  day: string
  kind: 'assessment' | 'task' | 'quiz' | 'review'
  minutes: number
  label: string
  ref: string
}

export interface StoredLearning {
  version: 1
  profile: StudentProfile | null
  attempts: AssessmentAttempt[]
  draft: AssessmentDraft | null
  roadmap: Roadmap | null
  taskCompletedAt: Record<string, string>
  quizAttempts: QuizAttempt[]
  missed: MissedQuestion[]
  flashcards: Flashcard[]
  cardReviews: CardReview[]
  messages: ChatMessage[]
  activity: Activity[]
}

export interface AchievementView {
  id: string
  title: string
  description: string
  earnedAt: string | null
  progress: number
  target: number
}
