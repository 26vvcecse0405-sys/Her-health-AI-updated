import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadEnv, type Connect, type Plugin } from 'vite'
import { assistantRequestSchema, generatedCardsSchema, generatedQuizSchema, practiceRequestSchema } from '../src/services/persistence/schema.ts'

const windowMs = 60_000
const maxCalls = 20
const stamps: number[] = []

function limited() {
  const now = Date.now()
  while (stamps.length > 0 && now - stamps[0]! > windowMs) stamps.shift()
  if (stamps.length >= maxCalls) return true
  stamps.push(now)
  return false
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

async function readBody(req: IncomingMessage) {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > 20_000) throw new Error('body too large')
    chunks.push(buffer)
  }
  return Buffer.concat(chunks).toString('utf8')
}

async function complete(key: string, model: string, system: string, user: string, json: boolean) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal: AbortSignal.timeout(25_000),
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: json ? 0.3 : 0.4,
      max_tokens: json ? 900 : 420,
      response_format: json ? { type: 'json_object' } : undefined,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!response.ok) return null
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] }
  return data.choices?.[0]?.message?.content?.trim() || null
}

async function handle(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
  const url = req.url?.split('?')[0]
  if (req.method === 'GET' && url === '/api/health') {
    send(res, 200, { ok: true, ai: Boolean(env.OPENAI_API_KEY), mode: env.OPENAI_API_KEY ? 'openai' : 'demo' })
    return
  }
  if (req.method !== 'POST' || (url !== '/api/assistant' && url !== '/api/practice')) {
    send(res, 404, { error: 'Not found' })
    return
  }
  if (limited()) {
    send(res, 429, { source: 'demo', error: 'Too many requests.' })
    return
  }
  let payload: unknown = {}
  try {
    const raw = await readBody(req)
    payload = raw ? JSON.parse(raw) : {}
  } catch {
    send(res, 400, { source: 'demo', error: 'Invalid request.' })
    return
  }
  const key = env.OPENAI_API_KEY
  const model = env.OPENAI_MODEL || 'gpt-4o-mini'
  if (!key) {
    send(res, 200, { source: 'demo' })
    return
  }
  if (url === '/api/assistant') {
    const body = assistantRequestSchema.safeParse(payload)
    if (!body.success) {
      send(res, 400, { source: 'demo', error: 'Write a message between 1 and 2000 characters.' })
      return
    }
    try {
      const reply = await complete(
        key,
        model,
        'You are the SkillSprint tutor for one student. Use the learner brief. Be concrete, short, and honest about limits. Do not invent assessment scores. Plain text under 180 words.',
        `Learner brief:\n${body.data.brief ?? 'None'}\n\nStudent:\n${body.data.message}`,
        false,
      )
      if (!reply) {
        send(res, 200, { source: 'demo', error: 'The model returned an empty reply.' })
        return
      }
      send(res, 200, { source: 'openai', reply })
    } catch {
      send(res, 200, { source: 'demo', error: 'The model request failed.' })
    }
    return
  }
  const body = practiceRequestSchema.safeParse(payload)
  if (!body.success) {
    send(res, 400, { source: 'local', error: 'Choose a topic, skill, and difficulty.' })
    return
  }
  const count = body.data.count ?? 5
  try {
    if (body.data.kind === 'quiz') {
      const raw = await complete(
        key,
        model,
        `Return only JSON {"questions":[{"prompt":"string","options":["a","b","c","d"],"correctIndex":0,"explanation":"string"}]}. Write exactly ${count} questions. Options must be distinct. correctIndex is the correct option. Explanations must say why that option is right. No markdown.`,
        `Skill: ${body.data.skillId}. Difficulty: ${body.data.difficulty}. Topic: ${body.data.topic}. Focus: ${body.data.focus || 'general'}.`,
        true,
      )
      const parsed = raw ? generatedQuizSchema(count).safeParse(JSON.parse(raw)) : null
      if (!parsed?.success) {
        send(res, 200, { source: 'local', error: 'The model reply failed validation.' })
        return
      }
      send(res, 200, { source: 'openai', quiz: parsed.data })
      return
    }
    const raw = await complete(
      key,
      model,
      'Return only JSON {"cards":[{"front":"string","back":"string"}]}. Write exactly 6 flashcards. Front is a question. Back is the answer. No markdown.',
      `Skill: ${body.data.skillId}. Difficulty: ${body.data.difficulty}. Topic: ${body.data.topic}. Focus: ${body.data.focus || 'general'}.`,
      true,
    )
    const parsed = raw ? generatedCardsSchema.safeParse(JSON.parse(raw)) : null
    if (!parsed?.success) {
      send(res, 200, { source: 'local', error: 'The model reply failed validation.' })
      return
    }
    send(res, 200, { source: 'openai', cards: parsed.data })
  } catch {
    send(res, 200, { source: 'local', error: 'The model request failed.' })
  }
}

function attach(server: { middlewares: Connect.Server }, mode: string) {
  const env = loadEnv(mode, process.cwd(), '')
  server.middlewares.use((req, res, next) => {
    const url = req.url?.split('?')[0]
    if (!url?.startsWith('/api/')) {
      next()
      return
    }
    void handle(req, res, env).catch(() => {
      if (!res.headersSent) send(res, 500, { source: 'demo', error: 'Server error.' })
    })
  })
}

export function skillsprintApi(): Plugin {
  return {
    name: 'skillsprint-api',
    configureServer(server) {
      attach(server, server.config.mode)
    },
    configurePreviewServer(server) {
      attach(server, server.config.mode)
    },
  }
}
