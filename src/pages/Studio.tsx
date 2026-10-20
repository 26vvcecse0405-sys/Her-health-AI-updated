import { useEffect, useState } from 'react'
import { scenes } from '../data/art'
import { difficultyLabels, skillById, skills } from '../data/catalog'
import { EmptyState } from '../components/EmptyState'
import { Picture } from '../components/Picture'
import { Button, Meter, cx, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'
import { requestPractice } from '../services/ai/client'
import { uid } from '../services/learning/time'
import { localCards, localQuiz } from '../services/practice/generate'
import { difficulties, type ContentSource, type Difficulty, type Flashcard, type QuizQuestion, type SkillId } from '../types'

const tabs = ['Quiz', 'Flashcards', 'Revision'] as const

export function Studio() {
  const { state, view, saveQuizAttempt, saveFlashcards, markCard, clearMiss } = useApp()
  const [tab, setTab] = useState<(typeof tabs)[number]>('Quiz')
  const [skillId, setSkillId] = useState<SkillId>(view.developing[0]?.skillId ?? 'data')
  const [difficulty, setDifficulty] = useState<Difficulty>('foundation')
  const [topic, setTopic] = useState(view.nextTask?.title ?? 'Core practice')
  const [focus, setFocus] = useState('')
  const [pending, setPending] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null)
  const [source, setSource] = useState<ContentSource>('local')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [finished, setFinished] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [revisionChoice, setRevisionChoice] = useState<Record<string, number>>({})
  const [revisionNote, setRevisionNote] = useState('')
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  useTitle('Studio')

  const card = state.flashcards[Math.min(cardIndex, Math.max(state.flashcards.length - 1, 0))]

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
      if (tab === 'Flashcards' && card) {
        if (event.key === 'ArrowRight') setCardIndex((value) => Math.min(state.flashcards.length - 1, value + 1))
        if (event.key === 'ArrowLeft') setCardIndex((value) => Math.max(0, value - 1))
        if (event.key === ' ') {
          event.preventDefault()
          setFlipped((value) => !value)
        }
      }
      if (tab === 'Quiz' && quiz && !finished) {
        const choice = Number(event.key) - 1
        const question = quiz[index]
        if (question && choice >= 0 && choice < question.options.length) {
          setAnswers((current) => {
            const next = [...current]
            next[index] = choice
            return next
          })
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tab, card, quiz, finished, index, state.flashcards.length])

  async function generate(kind: 'quiz' | 'cards') {
    if (topic.trim().length < 2) {
      setError('Add a topic of at least 2 characters.')
      return
    }
    setPending(true)
    setError('')
    const remote = await requestPractice({ kind, skillId, difficulty, topic: topic.trim(), focus: focus.trim(), count: 5 })
    if (kind === 'quiz') {
      if (remote.source === 'openai' && remote.quiz) {
        setQuiz(remote.quiz.questions.map((item, itemIndex) => ({
          id: `live-${itemIndex}-${uid()}`,
          prompt: item.prompt,
          options: item.options,
          correctIndex: item.correctIndex,
          explanation: item.explanation,
          skillId,
          difficulty,
        })))
        setSource('openai')
        setNote('Live model. The key stayed on the server.')
      } else {
        const local = localQuiz({ skillId, difficulty, topic: topic.trim(), focus: focus.trim(), count: 5 })
        setQuiz(local.questions)
        setSource('local')
        setNote(remote.error ? `${remote.error} ${local.note}` : local.note)
      }
      setIndex(0)
      setAnswers([])
      setFinished(false)
    } else if (remote.source === 'openai' && remote.cards) {
      const cards: Flashcard[] = remote.cards.cards.map((item) => ({
        id: uid(),
        skillId,
        front: item.front,
        back: item.back,
        known: false,
        source: 'openai',
      }))
      saveFlashcards(cards)
      setSource('openai')
      setNote('Live model flashcards. The key stayed on the server.')
      setCardIndex(0)
      setFlipped(false)
    } else {
      const local = localCards({ skillId, difficulty, topic: topic.trim(), focus: focus.trim() })
      saveFlashcards(local.cards)
      setSource('local')
      setNote(remote.error ? `${remote.error} ${local.note}` : local.note)
      setCardIndex(0)
      setFlipped(false)
    }
    setPending(false)
  }

  function finish() {
    if (!quiz || answers.length !== quiz.length || answers.some((answer) => answer === undefined)) {
      setError('Answer every question before scoring.')
      return
    }
    saveQuizAttempt({
      id: uid(),
      topic: topic.trim(),
      focus: focus.trim(),
      skillId,
      difficulty,
      at: new Date().toISOString(),
      source,
      sourceNote: note,
      questions: quiz,
      answers,
    })
    setFinished(true)
    setError('')
  }

  const question = quiz?.[index]
  const correct = quiz ? quiz.filter((item, itemIndex) => answers[itemIndex] === item.correctIndex).length : 0

  return (
    <div className="grid gap-5">
      <div className="grid items-center gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">AI learning studio</p>
          <h1 className="mt-2 text-4xl font-semibold">Practice with a labelled source.</h1>
          <p className="mt-2 max-w-2xl text-muted">Generate a quiz, flip flashcards, or revise a miss. A live model is used only when the server accepts the reply. Otherwise you get the local bank, and the label says so.</p>
        </div>
        <Picture src={scenes.companion.src} alt={scenes.companion.alt} className="w-full rounded-[1.5rem]" />
      </div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Studio">
        {tabs.map((item) => (
          <button key={item} type="button" className="chip" role="tab" aria-selected={tab === item} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>
      <section className="glass grid gap-4 p-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">Topic
          <input className="field" value={topic} maxLength={120} onChange={(event) => setTopic(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">Focus <span className="font-normal text-muted">(optional)</span>
          <input className="field" value={focus} maxLength={200} onChange={(event) => setFocus(event.target.value)} />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Skill">
          {skills.map((skill) => (
            <button key={skill.id} type="button" className="chip" aria-pressed={skillId === skill.id} onClick={() => setSkillId(skill.id)}>{skill.label}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Difficulty">
          {difficulties.map((item) => (
            <button key={item} type="button" className="chip" aria-pressed={difficulty === item} onClick={() => setDifficulty(item)}>{difficultyLabels[item]}</button>
          ))}
        </div>
      </section>
      {error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}
      {note ? <p className="text-sm text-muted">{source === 'openai' ? 'Live model. ' : 'Local bank. '}{note}</p> : null}
      {pending ? <div className="skeleton h-40" aria-label="Generating practice" /> : null}

      {tab === 'Quiz' ? (
        <section className="glass p-5">
          {!quiz ? (
            <>
              <EmptyState kind="empty" title="No quiz yet" text="Choose a skill and generate five questions. The score uses the answers you submit." />
              <Button onClick={() => void generate('quiz')}>Generate quiz</Button>
            </>
          ) : null}
          {quiz && question && !finished ? (
            <>
              <div className="flex items-center justify-between gap-3 text-sm text-muted">
                <span>Question {index + 1} of {quiz.length}</span>
                <span>{skillById[question.skillId].label}</span>
              </div>
              <Meter value={((index + (answers[index] === undefined ? 0 : 1)) / quiz.length) * 100} />
              <h2 className="mt-4 text-2xl font-semibold">{question.prompt}</h2>
              <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Answers">
                {question.options.map((option, optionIndex) => (
                  <button key={option} type="button" role="radio" aria-checked={answers[index] === optionIndex} className="chip text-left" onClick={() => setAnswers((current) => { const next = [...current]; next[index] = optionIndex; return next })}>
                    <span className="mr-2 font-semibold text-cyan">{optionIndex + 1}</span>{option}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">Keys 1–4 select an answer. The explanation appears after you score the quiz.</p>
              <div className="mt-4 flex justify-between gap-3">
                <Button variant="ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</Button>
                {index === quiz.length - 1 ? <Button onClick={finish}>Score quiz</Button> : <Button onClick={() => setIndex(index + 1)}>Next</Button>}
              </div>
            </>
          ) : null}
          {quiz && finished ? (
            <div>
              <h2 className="text-3xl font-semibold">{correct} of {quiz.length} correct · {Math.round((correct / quiz.length) * 100)}%</h2>
              <p className="mt-2 text-sm text-muted">{skillById[skillId].label} accuracy on this quiz: {Math.round((correct / quiz.length) * 100)}%. Misses were added to Revision.</p>
              <ul className="mt-4 grid gap-4">
                {quiz.map((item, itemIndex) => {
                  const right = answers[itemIndex] === item.correctIndex
                  return (
                    <li key={item.id}>
                      <p className="font-medium">{item.prompt}</p>
                      <p className={cx('mt-1 text-sm', right ? 'text-good' : 'text-bad')}>{right ? 'Correct' : `Your answer: ${item.options[answers[itemIndex] ?? 0]}. Keyed answer: ${item.options[item.correctIndex]}.`}</p>
                      <p className="text-sm text-muted">{item.explanation}</p>
                    </li>
                  )
                })}
              </ul>
              <Button className="mt-4" variant="ghost" onClick={() => void generate('quiz')}>Generate another</Button>
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === 'Flashcards' ? (
        <section className="glass p-5">
          {state.flashcards.length === 0 || !card ? (
            <>
              <EmptyState kind="empty" title="No flashcards yet" text="Generate six cards. Space flips a card. Arrow keys move." />
              <Button onClick={() => void generate('cards')}>Generate flashcards</Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted">Card {Math.min(cardIndex, state.flashcards.length - 1) + 1} of {state.flashcards.length} · {card.known ? 'Known' : 'Still reviewing'} · {card.source === 'openai' ? 'Live model' : 'Local bank'}</p>
              <div className="flip-scene mx-auto mt-4 h-64 max-w-xl">
                <button type="button" className={cx('flip relative h-full w-full text-left', flipped && 'on')} aria-pressed={flipped} onClick={() => setFlipped((value) => !value)}>
                  <span className="flip-face glass absolute inset-0 grid place-items-center p-6 text-xl font-semibold">{card.front}</span>
                  <span className="flip-back glass absolute inset-0 grid place-items-center p-6 text-lg">{card.back}</span>
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => { setCardIndex((value) => Math.max(0, value - 1)); setFlipped(false) }}>Previous</Button>
                <Button variant="ghost" onClick={() => { setCardIndex((value) => Math.min(state.flashcards.length - 1, value + 1)); setFlipped(false) }}>Next</Button>
                <Button onClick={() => markCard(card.id, true)}>Mark known</Button>
                <Button variant="ghost" onClick={() => markCard(card.id, false)}>Keep reviewing</Button>
                <Button variant="ghost" onClick={() => void generate('cards')}>New deck</Button>
              </div>
            </>
          )}
        </section>
      ) : null}

      {tab === 'Revision' ? (
        <section className="glass p-5">
          {state.missed.length === 0 ? (
            <EmptyState kind="success" title="No misses waiting" text="Incorrect quiz answers land here. A correct revision removes that item." />
          ) : (
            <ul className="grid gap-4">
              {state.missed.map((miss) => (
                <li key={miss.id} className="rounded-2xl border border-line p-4">
                  <p className="text-xs text-muted">{miss.topic} · {skillById[miss.question.skillId].label}</p>
                  <h2 className="mt-1 text-lg font-semibold">{miss.question.prompt}</h2>
                  <div className="mt-3 grid gap-2">
                    {miss.question.options.map((option, optionIndex) => (
                      <button key={option} type="button" className="chip text-left" aria-pressed={revisionChoice[miss.id] === optionIndex} onClick={() => setRevisionChoice({ ...revisionChoice, [miss.id]: optionIndex })}>
                        {option}
                      </button>
                    ))}
                  </div>
                  <Button className="mt-3" onClick={() => {
                    const choice = revisionChoice[miss.id]
                    if (choice === undefined) {
                      setRevisionNote('Choose an answer first.')
                      return
                    }
                    const cleared = clearMiss(miss.id, choice)
                    setRevealed((current) => ({ ...current, [miss.id]: true }))
                    setRevisionNote(cleared ? 'Cleared. The answer matched the key.' : 'Not yet. The explanation is open now.')
                  }}>Check revision</Button>
                  {revealed[miss.id] ? <p className="mt-2 text-sm text-muted">{miss.question.explanation}</p> : null}
                </li>
              ))}
            </ul>
          )}
          {revisionNote ? <p className="mt-3 text-sm text-muted" role="status">{revisionNote}</p> : null}
        </section>
      ) : null}
    </div>
  )
}
