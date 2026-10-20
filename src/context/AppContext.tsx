import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { requestAssistant, aiConfigured } from '../services/ai/client'
import { demoReply, learnerBrief } from '../services/assistant/demo'
import { buildSample } from '../services/demo/sample'
import {
  addMessage,
  applyProfile,
  emptyLearning,
  rebuild,
  recordQuiz,
  replaceCards,
  resolveMiss,
  reviewCard,
  saveDraft,
  submitAssessment,
  toggleTask,
} from '../services/learning/actions'
import { derive, homeFor } from '../services/learning/derive'
import { uid } from '../services/learning/time'
import { browserRepository, demoKey, modeKey, studentKey, themeKey } from '../services/persistence/repository'
import type { AssessmentDraft, Flashcard, QuizAttempt, StoredLearning, StudentProfile } from '../types'

type Mode = 'student' | 'demo'
type Theme = 'dark' | 'light'

interface AppContextValue {
  mode: Mode
  theme: Theme
  aiOn: boolean
  coachPending: boolean
  state: StoredLearning
  student: StoredLearning
  view: ReturnType<typeof derive>
  setTheme: (theme: Theme) => void
  beginStudent: () => void
  beginDemo: () => void
  saveProfile: (profile: StudentProfile) => void
  setDraft: (draft: AssessmentDraft) => void
  submitCurrentAssessment: () => boolean
  toggleRoadmapTask: (taskId: string) => void
  regenerateRoadmap: () => void
  saveQuizAttempt: (attempt: QuizAttempt) => void
  clearMiss: (missedId: string, chosen: number) => boolean
  saveFlashcards: (cards: Flashcard[]) => void
  markCard: (cardId: string, known: boolean) => void
  sendCoach: (message: string) => Promise<void>
  resetDemo: () => void
  resetStudent: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const studentRepo = useMemo(() => browserRepository(studentKey), [])
  const demoRepo = useMemo(() => browserRepository(demoKey), [])
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem(modeKey) === 'demo' ? 'demo' : 'student'))
  const [student, setStudent] = useState<StoredLearning>(() => studentRepo.load() ?? emptyLearning())
  const [demo, setDemo] = useState<StoredLearning>(() => demoRepo.load() ?? emptyLearning())
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem(themeKey) === 'light' ? 'light' : 'dark'))
  const [aiOn, setAiOn] = useState(false)
  const [coachPending, setCoachPending] = useState(false)
  const modeRef = useRef(mode)
  const studentRef = useRef(student)
  const demoRef = useRef(demo)

  const state = mode === 'demo' ? demo : student
  const view = useMemo(() => derive(state), [state])

  useEffect(() => {
    modeRef.current = mode
    studentRef.current = student
    demoRef.current = demo
  }, [mode, student, demo])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem(themeKey, theme)
  }, [theme])

  useEffect(() => {
    void aiConfigured().then(setAiOn)
  }, [])

  function commit(next: StoredLearning, target = modeRef.current) {
    if (target === 'demo') {
      demoRef.current = next
      demoRepo.save(next)
      setDemo(next)
      return
    }
    studentRef.current = next
    studentRepo.save(next)
    setStudent(next)
  }

  function current() {
    return modeRef.current === 'demo' ? demoRef.current : studentRef.current
  }

  function activate(next: Mode) {
    modeRef.current = next
    localStorage.setItem(modeKey, next)
    setMode(next)
  }

  function beginStudent() {
    activate('student')
  }

  function beginDemo() {
    if (!demoRef.current.profile) commit(buildSample(), 'demo')
    activate('demo')
  }

  function saveProfile(profile: StudentProfile) {
    commit(applyProfile(current(), profile))
  }

  function setDraft(draft: AssessmentDraft) {
    commit(saveDraft(current(), draft))
  }

  function submitCurrentAssessment() {
    const next = submitAssessment(current())
    if (next === current() || next.attempts.length === current().attempts.length) return false
    commit(next)
    return true
  }

  function toggleRoadmapTask(taskId: string) {
    commit(toggleTask(current(), taskId))
  }

  function regenerateRoadmap() {
    commit(rebuild(current()))
  }

  function saveQuizAttempt(attempt: QuizAttempt) {
    commit(recordQuiz(current(), attempt))
  }

  function clearMiss(missedId: string, chosen: number) {
    const before = current().missed.length
    const next = resolveMiss(current(), missedId, chosen)
    commit(next)
    return next.missed.length < before
  }

  function saveFlashcards(cards: Flashcard[]) {
    commit(replaceCards(current(), cards))
  }

  function markCard(cardId: string, known: boolean) {
    commit(reviewCard(current(), cardId, known))
  }

  async function sendCoach(message: string) {
    const trimmed = message.trim()
    if (!trimmed || coachPending) return
    const target = modeRef.current
    const userMessage = {
      id: uid(),
      role: 'user' as const,
      content: trimmed,
      at: new Date().toISOString(),
      source: 'learner' as const,
    }
    const withUser = addMessage(current(), userMessage)
    commit(withUser, target)
    setCoachPending(true)
    const live = await requestAssistant(trimmed, learnerBrief(withUser))
    const reply =
      live.source === 'openai' && live.reply
        ? {
            id: uid(),
            role: 'assistant' as const,
            content: live.reply,
            at: new Date().toISOString(),
            source: 'openai' as const,
            note: 'Live model reply. The key stayed on the server.',
          }
        : {
            id: uid(),
            role: 'assistant' as const,
            content: demoReply(trimmed, withUser),
            at: new Date().toISOString(),
            source: 'demo' as const,
            note: live.error ?? 'Demo reply. No live model was used.',
          }
    const base = target === 'demo' ? demoRef.current : studentRef.current
    commit(addMessage(base, reply), target)
    setCoachPending(false)
  }

  function resetDemo() {
    commit(buildSample(), 'demo')
    activate('demo')
  }

  function resetStudent() {
    studentRepo.clear()
    const next = emptyLearning()
    studentRef.current = next
    setStudent(next)
    activate('student')
  }

  const value: AppContextValue = {
    mode,
    theme,
    aiOn,
    coachPending,
    state,
    student,
    view,
    setTheme: setThemeState,
    beginStudent,
    beginDemo,
    saveProfile,
    setDraft,
    submitCurrentAssessment,
    toggleRoadmapTask,
    regenerateRoadmap,
    saveQuizAttempt,
    clearMiss,
    saveFlashcards,
    markCard,
    sendCoach,
    resetDemo,
    resetStudent,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useApp must be used inside AppProvider')
  return value
}

export { homeFor }
