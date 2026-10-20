import { useState } from 'react'
import { Button, Card, Kicker, useTitle } from '../components/ui'
import { scenes } from '../data/art'
import { useApp } from '../context/AppContext'

const prompts = [
  'What should I learn next?',
  'Break my biggest gap into smaller steps',
  'Give me two practice questions',
  'Explain a question I got wrong',
]

export function Assistant() {
  const { state, aiOn, coachPending, sendCoach } = useApp()
  const [text, setText] = useState('')
  useTitle('Assistant')

  async function send(message = text) {
    const next = message.trim()
    if (!next) return
    setText('')
    await sendCoach(next)
  }

  return (
    <div className="grid gap-5">
      <div>
        <Kicker>Learning assistant</Kicker>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Ask about the work in front of you</h1>
        <p className="mt-2 max-w-3xl text-muted">
          {aiOn
            ? 'A live model is available. Replies that come from it are marked. If the request fails, the on-device reply is used and marked too.'
            : 'AI demo mode. Replies are written on this device from your profile, gaps, and the question bank. No live model is being called.'}
        </p>
        <img src={scenes.companion.src} alt={scenes.companion.alt} className="mt-4 max-h-48 w-full rounded-3xl border border-line object-cover" />
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button key={prompt} type="button" className="chip" onClick={() => void send(prompt)} disabled={coachPending}>
            {prompt}
          </button>
        ))}
      </div>
      <Card className="grid gap-4">
        {state.messages.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            Try a suggested prompt. A useful question names a skill, asks for smaller steps, or asks what to do next. The demo student already has an example conversation about confidence versus the data score.
          </p>
        ) : null}
        <ol className="grid gap-3">
          {state.messages.map((message) => (
            <li key={message.id} className={message.role === 'user' ? 'ml-auto max-w-3xl rounded-2xl bg-blue/15 px-4 py-3' : 'max-w-3xl rounded-2xl border border-line px-4 py-3'}>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                {message.role === 'user' ? 'You' : message.source === 'openai' ? 'Live model' : 'Demo reply'}
              </p>
              <p className="mt-2 whitespace-pre-wrap leading-7">{message.content}</p>
              {message.note ? <p className="mt-2 text-xs text-muted">{message.note}</p> : null}
            </li>
          ))}
        </ol>
        {coachPending ? <div className="skeleton h-16" aria-hidden="true" /> : null}
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            void send()
          }}
        >
          <label className="grid gap-2 text-sm font-medium">
            Message
            <textarea className="field min-h-28" value={text} maxLength={2000} onChange={(event) => setText(event.target.value)} />
          </label>
          <div>
            <Button type="submit" disabled={coachPending || !text.trim()}>{coachPending ? 'Thinking…' : 'Send'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
