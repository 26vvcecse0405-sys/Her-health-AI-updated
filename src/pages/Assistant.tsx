import { useState } from 'react'
import { scenes } from '../data/art'
import { Picture } from '../components/Picture'
import { Button, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'

const prompts = [
  'What should I study next?',
  'Explain my largest gap',
  'Give me a step-by-step on the next skill',
  'Are you a live model?',
]

export function Assistant() {
  const { state, sendCoach, coachPending, aiOn } = useApp()
  const [text, setText] = useState('')
  useTitle('Coach')

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="glass h-fit p-5">
        <Picture src={scenes.companion.src} alt={scenes.companion.alt} className="w-full rounded-2xl" />
        <h1 className="mt-4 text-3xl font-semibold">Learning coach</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {aiOn
            ? 'A live model is configured. Replies from it are labelled Live model. The key stays on the server.'
            : 'No API key is configured. Every reply on this page is from the local demo tutor and is labelled that way.'}
        </p>
      </aside>
      <section className="glass flex min-h-[32rem] flex-col p-4">
        <div className="flex-1 space-y-3 overflow-auto">
          {state.messages.length === 0 ? (
            <p className="text-sm text-muted">Ask about a gap, the next task, or a concept from the roadmap. The tutor can only use numbers already in your record.</p>
          ) : null}
          {state.messages.map((message) => (
            <article key={message.id} className={message.role === 'user' ? 'ml-8 rounded-2xl bg-blue/15 p-3' : 'mr-8 rounded-2xl border border-line p-3'}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan">
                {message.role === 'user' ? 'You' : message.source === 'openai' ? 'Live model' : 'Demo tutor'}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.content}</p>
              {message.note ? <p className="mt-2 text-xs text-muted">{message.note}</p> : null}
            </article>
          ))}
          {coachPending ? <div className="skeleton h-16" aria-label="The tutor is writing" /> : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button key={prompt} type="button" className="chip" disabled={coachPending} onClick={() => void sendCoach(prompt)}>{prompt}</button>
          ))}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            const next = text
            setText('')
            void sendCoach(next)
          }}
        >
          <label className="sr-only" htmlFor="coach">Message</label>
          <input id="coach" className="field" value={text} maxLength={2000} placeholder="Ask about a skill or the next task" onChange={(event) => setText(event.target.value)} />
          <Button type="submit" disabled={coachPending || text.trim().length === 0}>Send</Button>
        </form>
      </section>
    </div>
  )
}
