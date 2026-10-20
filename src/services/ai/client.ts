export async function aiConfigured() {
  try {
    const response = await fetch('/api/health')
    if (!response.ok) return false
    const data = (await response.json()) as { ai?: boolean }
    return Boolean(data.ai)
  } catch {
    return false
  }
}

export async function requestAssistant(message: string, brief: string) {
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, brief }),
    })
    const data = (await response.json()) as { source?: string; reply?: string; error?: string }
    if (data.source === 'openai' && data.reply) return { source: 'openai' as const, reply: data.reply }
    return { source: 'demo' as const, error: data.error ?? 'Demo tutor. No live model was used.' }
  } catch {
    return { source: 'demo' as const, error: 'The assistant request could not reach the server.' }
  }
}

export interface PracticePayload {
  kind: 'quiz' | 'cards'
  skillId: string
  difficulty: string
  topic: string
  focus?: string
  count?: number
}

export async function requestPractice(payload: PracticePayload) {
  try {
    const response = await fetch('/api/practice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = (await response.json()) as {
      source?: string
      error?: string
      quiz?: { questions: { prompt: string; options: string[]; correctIndex: number; explanation: string }[] }
      cards?: { cards: { front: string; back: string }[] }
    }
    if (data.source === 'openai' && (data.quiz || data.cards)) {
      return { source: 'openai' as const, quiz: data.quiz, cards: data.cards, error: undefined }
    }
    return { source: 'local' as const, error: data.error ?? 'No live model was used.' }
  } catch {
    return { source: 'local' as const, error: 'The practice request could not reach the server.' }
  }
}
