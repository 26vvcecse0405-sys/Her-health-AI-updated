import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadEnv, type Connect, type Plugin } from 'vite'

const windowMs = 60_000
const maxCalls = 20
const stamps: number[] = []

const languageNames: Record<string, string> = {
  en: 'English',
  kn: 'Kannada',
  hi: 'Hindi',
  gu: 'Gujarati',
  mr: 'Marathi',
  ta: 'Tamil',
  te: 'Telugu',
  bn: 'Bengali',
  ml: 'Malayalam',
  pa: 'Punjabi',
  or: 'Odia',
  ur: 'Urdu',
}

const systemPrompt = `You are SAKHI, a warm educational women's health companion in HerHealth AI, a student prototype.
Reply in the requested language. Use plain words a village health visitor could read aloud. Stay under 150 words.
Do not diagnose, exclude a disease, prescribe, give a dose, or change a treatment plan.
If the person may be in danger, tell them to contact local emergency services now (112 or 108 in India) and stop the diagnostic interview.
Separate general education from their own body. If unsure, say so and offer a question for a clinician.
Do not invent hospital beds, traffic, or laboratory results.
You are not a doctor.`

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

function unsafe(text: string) {
  return /you have (anemia|anaemia|endometriosis|cancer)|i prescribe|take \d+\s*mg|diagnos(is|e):|start iron \d+/i.test(text)
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

async function fromOllama(base: string, model: string, user: string) {
  const response = await fetch(new URL('/api/chat', base), {
    method: 'POST',
    signal: AbortSignal.timeout(8000),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!response.ok) return null
  const data = (await response.json()) as { message?: { content?: string } }
  return data.message?.content?.trim() || null
}

async function fromChatCompletions(base: string, model: string, key: string, user: string) {
  const response = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    signal: AbortSignal.timeout(12_000),
    headers: {
      'Content-Type': 'application/json',
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 360,
      messages: [
        { role: 'system', content: systemPrompt },
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
  const localBase = env.LOCAL_LLM_BASE_URL || ''
  const ollama = env.OLLAMA_BASE_URL || ''
  if (req.method === 'GET' && url === '/api/health') {
    send(res, 200, { ok: true, openai: Boolean(env.OPENAI_API_KEY), local: Boolean(localBase || ollama) })
    return
  }
  if (req.method !== 'POST' || url !== '/api/assistant') {
    send(res, 404, { error: 'Not found' })
    return
  }
  if (limited()) {
    send(res, 429, { source: 'fallback', error: 'Too many requests. The saved answers still work.' })
    return
  }
  let payload: unknown
  try {
    const raw = await readBody(req)
    payload = raw ? JSON.parse(raw) : {}
  } catch {
    send(res, 400, { source: 'fallback', error: 'Invalid request.' })
    return
  }
  const body = payload as { message?: unknown; language?: unknown; consent?: unknown }
  if (typeof body.message !== 'string' || body.message.trim().length < 1 || body.message.length > 2000) {
    send(res, 400, { source: 'fallback', error: 'Write a question between 1 and 2000 characters.' })
    return
  }
  if (typeof body.language !== 'string' || !(body.language in languageNames)) {
    send(res, 400, { source: 'fallback', error: 'Language is not one of the supported codes.' })
    return
  }
  if (body.consent !== true) {
    send(res, 200, { source: 'fallback', error: 'Online and local models stay off without consent.' })
    return
  }
  const user = `Language: ${languageNames[body.language]}. Reply only in that language.\n\nQuestion:\n${body.message.trim()}`
  try {
    if (localBase) {
      const reply = await fromChatCompletions(localBase, env.LOCAL_LLM_MODEL || 'local-model', env.LOCAL_LLM_API_KEY || '', user)
      if (reply && !unsafe(reply)) {
        send(res, 200, { source: 'local', reply })
        return
      }
    } else if (ollama) {
      const reply = await fromOllama(ollama, env.OLLAMA_MODEL || 'qwen2.5:0.5b', user)
      if (reply && !unsafe(reply)) {
        send(res, 200, { source: 'local', reply })
        return
      }
    }
    if (env.OPENAI_API_KEY) {
      const reply = await fromChatCompletions('https://api.openai.com/v1', env.OPENAI_MODEL || 'gpt-4o-mini', env.OPENAI_API_KEY, user)
      if (reply && !unsafe(reply)) {
        send(res, 200, { source: 'online', reply })
        return
      }
    }
  } catch {
    send(res, 200, { source: 'fallback', error: 'The configured model did not answer. Use the saved reply.' })
    return
  }
  send(res, 200, { source: 'fallback' })
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
      if (!res.headersSent) send(res, 500, { source: 'fallback', error: 'Server error.' })
    })
  })
}

export function herhealthApi(): Plugin {
  return {
    name: 'herhealth-api',
    configureServer(server) {
      attach(server, server.config.mode)
    },
    configurePreviewServer(server) {
      attach(server, server.config.mode)
    },
  }
}
