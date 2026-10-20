import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assessmentQuestions } from '../data/assessmentBank'
import { difficultyLabels, skillById } from '../data/catalog'
import { Logo } from '../components/Logo'
import { Button, Meter, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'

export function Assessment() {
  const { state, setDraft, submitCurrentAssessment } = useApp()
  const navigate = useNavigate()
  const draft = state.draft
  const [error, setError] = useState('')
  useTitle('Assessment')

  useEffect(() => {
    if (!state.draft) setDraft({ index: 0, answers: {} })
  }, [state.draft, setDraft])

  if (!draft) return <main className="mx-auto max-w-3xl px-4 py-8"><div className="skeleton h-64" /></main>

  const question = assessmentQuestions[Math.min(draft.index, assessmentQuestions.length - 1)]
  if (!question) return null
  const selected = draft.answers[question.id]
  const answered = assessmentQuestions.filter((item) => draft.answers[item.id] !== undefined).length

  function choose(optionIndex: number) {
    setError('')
    setDraft({ ...draft!, answers: { ...draft!.answers, [question!.id]: optionIndex } })
  }

  function go(nextIndex: number) {
    if (nextIndex > draft!.index && selected === undefined) {
      setError('Choose an answer before continuing.')
      return
    }
    setError('')
    setDraft({ ...draft!, index: nextIndex })
  }

  function submit() {
    if (selected === undefined) {
      setError('Choose an answer before submitting.')
      return
    }
    const missing = assessmentQuestions.filter((item) => draft!.answers[item.id] === undefined)
    if (missing.length) {
      setError('Answer every question before submitting.')
      return
    }
    const ok = submitCurrentAssessment()
    if (ok) navigate('/results')
    else setError('The assessment was not saved. Check that every question has an answer.')
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <Logo />
        <p className="text-sm text-muted">Question {draft.index + 1} of {assessmentQuestions.length}</p>
      </div>
      <div className="mt-4"><Meter value={(answered / assessmentQuestions.length) * 100} /></div>
      <p className="mt-2 text-sm text-muted">{answered} answered. Scores are saved only after you submit.</p>
      <section className="glass mt-5 p-5">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-blue/15 px-2 py-1">{skillById[question.skillId].label}</span>
          <span className="rounded-full border border-line px-2 py-1 text-muted">{difficultyLabels[question.difficulty]}</span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold leading-snug">{question.prompt}</h1>
        <div className="mt-5 grid gap-2" role="radiogroup" aria-label="Answers">
          {question.options.map((option, index) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected === index}
              className="chip text-left"
              onClick={() => choose(index)}
            >
              <span className="mr-2 font-semibold text-cyan">{String.fromCharCode(65 + index)}</span>
              {option}
            </button>
          ))}
        </div>
        {error ? <p className="mt-4 text-sm text-bad" role="alert">{error}</p> : null}
        <div className="mt-6 flex justify-between gap-3">
          <Button variant="ghost" disabled={draft.index === 0} onClick={() => go(draft.index - 1)}>Previous</Button>
          {draft.index === assessmentQuestions.length - 1 ? (
            <Button onClick={submit}>Submit assessment</Button>
          ) : (
            <Button onClick={() => go(draft.index + 1)}>Next</Button>
          )}
        </div>
      </section>
      <div className="mt-4 flex flex-wrap gap-1" aria-label="Question progress">
        {assessmentQuestions.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="h-8 w-8 rounded-full border border-line text-xs"
            aria-current={index === draft.index ? 'step' : undefined}
            aria-label={`Question ${index + 1}${draft.answers[item.id] === undefined ? ', unanswered' : ', answered'}`}
            disabled={index > answered}
            onClick={() => go(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </main>
  )
}
