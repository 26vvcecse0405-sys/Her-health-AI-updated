import { useState } from 'react'
import { Button, Card, Field, Kicker, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'
import { difficultyLabels, skillById, skills } from '../data/catalog'
import { requestPractice } from '../services/ai/client'
import { uid } from '../services/learning/time'
import { localCards, localQuiz } from '../services/practice/generate'
import type { Difficulty, QuizQuestion, SkillId } from '../types'

type Tab = 'quiz' | 'cards' | 'revision'

function gradeQuiz(questions: QuizQuestion[], answers: number[]) {
  const correct = questions.filter((question, index) => answers[index] === question.correctIndex).length
  return { correct, total: questions.length, percent: questions.length === 0 ? 0 : Math.round((correct / questions.length) * 100) }
}

export function Studio() {
  const { state, aiOn, saveQuizAttempt, clearMiss, saveFlashcards, markCard } = useApp()
  const [tab, setTab] = useState<Tab>('quiz')
  const [skillId, setSkillId] = useState<SkillId>(state.profile?.career === 'consulting' ? 'communication' : 'data')
  const [difficulty, setDifficulty] = useState<Difficulty>('foundation')
  const [count, setCount] = useState(5)
  const [focus, setFocus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [source, setSource] = useState<'local' | 'openai'>('local')
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [cursor, setCursor] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [saved, setSaved] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [missChoice, setMissChoice] = useState<number | null>(null)
  const [missNote, setMissNote] = useState('')
  useTitle('Practice studio')

  const question = questions?.[cursor]
  const finished = Boolean(questions && saved)
  const grade = questions && saved ? gradeQuiz(questions, answers) : null
  const card = state.flashcards[cardIndex]

  async function generateQuiz() {
    setLoading(true)
    setError('')
    setQuestions(null)
    setSaved(false)
    const topic = skillById[skillId].label
    const live = await requestPractice({ kind: 'quiz', topic, focus, skillId, difficulty, count })
    const liveQuestions = live.quiz?.questions ?? []
    if (live.source === 'openai' && liveQuestions.length === count) {
      setQuestions(liveQuestions.map((item, index) => ({
        id: `live-${index}`,
        prompt: item.prompt,
        options: item.options,
        correctIndex: item.correctIndex,
        explanation: item.explanation,
        skillId,
        difficulty,
      })))
      setSource('openai')
      setNote('Live model quiz. Each question was checked for four distinct options and a correct-answer index before it was shown.')
    } else {
      const local = localQuiz({ skillId, difficulty, count, focus, topic })
      if (!local.questions.length) {
        setError('The question bank has nothing for that skill.')
        setLoading(false)
        return
      }
      setQuestions(local.questions)
      setSource('local')
      setNote(live.error ? `${live.error} Showing the local question bank instead.` : local.note)
    }
    setCursor(0)
    setAnswers([])
    setPicked(null)
    setRevealed(false)
    setLoading(false)
  }

  function reveal() {
    if (picked === null || !question) {
      setError('Choose an answer first.')
      return
    }
    setError('')
    setAnswers((current) => {
      const next = [...current]
      next[cursor] = picked
      return next
    })
    setRevealed(true)
  }

  function advance() {
    if (!questions || !revealed) return
    if (cursor < questions.length - 1) {
      setCursor(cursor + 1)
      setPicked(null)
      setRevealed(false)
      return
    }
    const finalAnswers = answers.map((answer, index) => (index === cursor ? (picked ?? answer) : answer))
    saveQuizAttempt({
      id: uid(),
      topic: skillById[skillId].label,
      focus,
      skillId,
      difficulty,
      at: new Date().toISOString(),
      source,
      sourceNote: note,
      questions,
      answers: finalAnswers,
    })
    setAnswers(finalAnswers)
    setSaved(true)
  }

  async function generateCards() {
    setLoading(true)
    setError('')
    const topic = skillById[skillId].label
    const live = await requestPractice({ kind: 'cards', topic, skillId, difficulty, count: 6 })
    const liveCards = live.cards?.cards ?? []
    if (live.source === 'openai' && liveCards.length === 6) {
      saveFlashcards(
        liveCards.map((item) => ({
          id: uid(),
          skillId,
          front: item.front,
          back: item.back,
          known: false,
          source: 'openai' as const,
        })),
      )
      setNote('Live model flashcards. Front and back were checked before they replaced the deck.')
    } else {
      const local = localCards({ skillId, difficulty, topic, focus })
      saveFlashcards(local.cards)
      setNote(live.error ? `${live.error} Showing local cards instead.` : local.note)
    }
    setCardIndex(0)
    setFlipped(false)
    setLoading(false)
    setTab('cards')
  }

  function submitMiss(missedId: string) {
    if (missChoice === null) {
      setMissNote('Choose an answer.')
      return
    }
    const ok = clearMiss(missedId, missChoice)
    setMissNote(ok ? 'Correct. Removed from the revision list.' : 'Still not the keyed answer. The explanation is under the choices.')
    if (ok) setMissChoice(null)
  }

  return (
    <div className="grid gap-5">
      <div>
        <Kicker>Practice studio</Kicker>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Quizzes, cards, and revision</h1>
        <p className="mt-2 max-w-3xl text-muted">
          {aiOn ? 'A server key is configured. Model output is shown only after it matches the schema.' : 'AI demo mode. Quizzes and cards come from the local bank and are labelled as such.'}
        </p>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Practice modes">
        {([
          ['quiz', 'Quiz'],
          ['cards', 'Flashcards'],
          ['revision', 'Revision'],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className="chip" onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab !== 'revision' ? (
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Topic">
              <select className="field" value={skillId} onChange={(event) => setSkillId(event.target.value as SkillId)}>
                {skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.label}</option>)}
              </select>
            </Field>
            <Field label="Difficulty">
              <select className="field" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)}>
                {Object.entries(difficultyLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </Field>
            {tab === 'quiz' ? (
              <Field label="Number of questions">
                <select className="field" value={count} onChange={(event) => setCount(Number(event.target.value))}>
                  {[3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </Field>
            ) : null}
            <Field label="Optional focus" hint="Used to prefer matching local questions, or sent with a live request.">
              <input className="field" value={focus} maxLength={80} onChange={(event) => setFocus(event.target.value)} />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tab === 'quiz' ? <Button onClick={() => void generateQuiz()} disabled={loading}>{loading ? 'Generating…' : 'Generate quiz'}</Button> : null}
            <Button variant={tab === 'cards' ? 'primary' : 'ghost'} onClick={() => void generateCards()} disabled={loading}>
              {loading && tab === 'cards' ? 'Generating…' : 'Generate flashcards'}
            </Button>
          </div>
          {error ? <p className="mt-3 text-sm text-bad" role="alert">{error}</p> : null}
          {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
        </Card>
      ) : null}

      {tab === 'quiz' && loading ? <div className="skeleton h-56" /> : null}
      {tab === 'quiz' && question && !finished ? (
        <Card>
          <p className="text-sm text-muted">Question {cursor + 1} of {questions?.length} · {source === 'openai' ? 'Live model' : 'Local bank'}</p>
          <h2 className="mt-3 text-2xl font-semibold leading-snug">{question.prompt}</h2>
          <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Choices">
            {question.options.map((option, index) => (
              <button key={option} type="button" role="radio" aria-checked={picked === index} className="chip text-left" onClick={() => setPicked(index)} disabled={revealed}>
                <span className="mr-2 font-semibold text-cyan">{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            ))}
          </div>
          {revealed ? (
            <p className="mt-4 text-sm leading-6 text-muted">
              {picked === question.correctIndex ? 'Correct.' : `The keyed answer is ${question.options[question.correctIndex]}.`} {question.explanation}
            </p>
          ) : null}
          <div className="mt-4">
            {revealed ? <Button onClick={advance}>{cursor === (questions?.length ?? 1) - 1 ? 'Finish and score' : 'Next question'}</Button> : <Button onClick={reveal}>Check answer</Button>}
          </div>
        </Card>
      ) : null}
      {tab === 'quiz' && finished && grade ? (
        <Card>
          <h2 className="text-2xl font-semibold">{grade.correct} of {grade.total} correct · {grade.percent}%</h2>
          <p className="mt-2 text-sm text-muted">Saved to this browser. Missed questions are waiting in Revision.</p>
          <Button className="mt-4" variant="ghost" onClick={() => { setQuestions(null); setSaved(false); setNote('') }}>Start another</Button>
        </Card>
      ) : null}

      {tab === 'cards' ? (
        state.flashcards.length === 0 ? (
          <Card><p className="text-muted">No deck yet. Generate flashcards for a topic.</p></Card>
        ) : card ? (
          <Card>
            <p className="text-sm text-muted">Card {cardIndex + 1} of {state.flashcards.length} · {card.source === 'openai' ? 'Live model' : 'Local bank'} · {card.known ? 'Marked known' : 'Still learning'}</p>
            <button type="button" className="mt-4 w-full text-left" onClick={() => setFlipped(!flipped)} aria-pressed={flipped}>
              <div className={`flip relative min-h-48 ${flipped ? 'on' : ''}`}>
                <div className="flip-face glass absolute inset-0 grid place-items-center p-6">
                  <p className="text-xl font-semibold">{card.front}</p>
                </div>
                <div className="flip-face flip-back glass absolute inset-0 grid place-items-center p-6">
                  <p className="text-lg leading-7">{card.back}</p>
                </div>
              </div>
            </button>
            <p className="mt-3 text-sm text-muted">Click the card to flip it.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => markCard(card.id, true)}>I know this</Button>
              <Button variant="ghost" onClick={() => markCard(card.id, false)}>Still learning</Button>
              <Button variant="quiet" disabled={cardIndex === 0} onClick={() => { setCardIndex(cardIndex - 1); setFlipped(false) }}>Previous</Button>
              <Button variant="quiet" disabled={cardIndex === state.flashcards.length - 1} onClick={() => { setCardIndex(cardIndex + 1); setFlipped(false) }}>Next</Button>
            </div>
          </Card>
        ) : null
      ) : null}

      {tab === 'revision' ? (
        state.missed.length === 0 ? (
          <Card><p className="text-muted">No missed questions. They appear here after a quiz answer does not match the key.</p></Card>
        ) : (
          <div className="grid gap-4">
            {state.missed.map((miss) => (
              <Card key={miss.id}>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">{miss.topic}</p>
                <h2 className="mt-2 text-xl font-semibold">{miss.question.prompt}</h2>
                <div className="mt-3 grid gap-2">
                  {miss.question.options.map((option, index) => (
                    <button key={option} type="button" className="chip text-left" aria-pressed={missChoice === index} onClick={() => setMissChoice(index)}>
                      {option}
                    </button>
                  ))}
                </div>
                <Button className="mt-4" onClick={() => submitMiss(miss.id)}>Check revision</Button>
                {missNote ? <p className="mt-3 text-sm text-muted">{missNote} {miss.question.explanation}</p> : null}
              </Card>
            ))}
          </div>
        )
      ) : null}
    </div>
  )
}
