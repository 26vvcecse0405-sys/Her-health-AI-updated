import { useState } from 'react'
import { Button, Card, Kicker, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'
import { careerArt } from '../data/art'
import { careerById, careers, skillById } from '../data/catalog'
import type { CareerId } from '../types'

export function Careers() {
  const { state, saveProfile } = useApp()
  const profile = state.profile
  const [picked, setPicked] = useState<CareerId>(profile?.career ?? 'software')
  const [note, setNote] = useState('')
  useTitle('Careers')
  if (!profile) return null
  const current = profile
  const career = careerById[picked]
  const art = careerArt[picked]

  function aim() {
    saveProfile({ ...current, career: picked })
    setNote(`Roadmap rebuilt for ${career.label} from the same demonstrated scores.`)
  }

  return (
    <div className="grid gap-5">
      <div>
        <Kicker>Career paths</Kicker>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Choose the future the sprint is aimed at</h1>
        <p className="mt-2 max-w-3xl text-muted">
          Each path has its own skill targets. Changing the aim rebuilds the roadmap from the assessment you already submitted. It does not change those scores.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {careers.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={picked === item.id}
                className="glass flex w-full items-center gap-3 overflow-hidden p-2 text-left"
                onClick={() => { setPicked(item.id); setNote('') }}
              >
                <img src={careerArt[item.id].src} alt="" className="h-16 w-24 rounded-2xl object-cover" />
                <span>
                  <span className="block font-semibold">{item.label}</span>
                  <span className="block text-sm text-muted">{item.id === profile.career ? 'Current aim' : item.blurb}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Card className="overflow-hidden p-0">
          <img src={art.src} alt={art.alt} className="h-56 w-full object-cover" />
          <div className="grid gap-4 p-5">
            <div>
              <h2 className="text-2xl font-semibold">{career.label}</h2>
              <p className="mt-2 text-muted">{career.blurb}</p>
            </div>
            <ul className="grid gap-2">
              {career.core.map((skillId) => (
                <li key={skillId} className="flex items-center justify-between gap-3 text-sm">
                  <span>{skillById[skillId].label}</span>
                  <span className="text-muted">Target {career.targets[skillId]}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-6 text-muted">{career.reasons[career.core[0]]}</p>
            <Button onClick={aim} disabled={picked === profile.career}>
              {picked === profile.career ? 'This is the current aim' : `Aim for ${career.label}`}
            </Button>
            {note ? <p className="text-sm text-cyan">{note}</p> : null}
          </div>
        </Card>
      </div>
    </div>
  )
}
