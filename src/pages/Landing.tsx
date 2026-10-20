import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Brain, ChartBar, Layers, Route, Sparkles, Trophy } from 'lucide-react'
import { careerArt, scenes } from '../data/art'
import { careers } from '../data/catalog'
import { Logo } from '../components/Logo'
import { HeroArt } from '../components/Visuals'
import { Picture } from '../components/Picture'
import { Button, useTitle } from '../components/ui'
import { homeFor, useApp } from '../context/AppContext'

const steps = [
  { title: 'Discover', text: 'A scored assessment measures what you can already do. Confidence sliders stay separate from the score.' },
  { title: 'Diagnose', text: 'Each gap is max(0, career target − demonstrated score). You can see the arithmetic.' },
  { title: 'Personalize', text: 'The roadmap uses those gaps, your interests, your learning style, and the hours you have.' },
  { title: 'Evolve', text: 'Quizzes, tasks, and a retake update the same record. Badges unlock only when the condition is true.' },
]

const features = [
  { icon: Brain, title: 'Skill assessment', text: 'Weighted questions. Foundation counts once, intermediate twice, advanced three times.' },
  { icon: Sparkles, title: 'AI learning studio', text: 'A live model answers only when a server key is set. Otherwise the local tutor and question bank are labelled.' },
  { icon: Route, title: 'Adaptive roadmaps', text: 'Tasks, projects, and time estimates change when the career, the score, or the study budget changes.' },
  { icon: Layers, title: 'Quizzes and flashcards', text: 'Submit real answers. Misses go to revision. Cards flip and remember what you marked known.' },
  { icon: ChartBar, title: 'Learning analytics', text: 'Streaks, minutes, and quiz accuracy come from actions saved in this browser.' },
  { icon: Trophy, title: 'Achievements', text: 'Six badges. None of them are awarded for opening a page.' },
]

const journey = ['Skill Discovery', 'Skill DNA', 'Gap Map', 'Roadmap', 'Career Ready']

export function Landing() {
  const { student, beginStudent, beginDemo } = useApp()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  useTitle('Home')
  const saved = Boolean(student.profile)

  return (
    <div id="top" className="relative overflow-x-clip">
      <div className="knowledge-bg pointer-events-none absolute inset-x-0 top-0 h-[42rem] opacity-70" aria-hidden="true">
        <svg viewBox="0 0 1200 700" className="h-full w-full">
          <g stroke="#22d3ee" strokeOpacity="0.35">
            <path d="M80 120L240 220L420 140L640 260L860 160L1080 240" />
            <path d="M120 420L300 300L520 460L760 320L980 440" />
          </g>
          <g fill="#8b5cf6">
            <circle cx="80" cy="120" r="4" /><circle cx="240" cy="220" r="5" /><circle cx="420" cy="140" r="4" />
            <circle cx="640" cy="260" r="6" /><circle cx="860" cy="160" r="4" /><circle cx="1080" cy="240" r="5" />
            <circle cx="300" cy="300" r="4" /><circle cx="760" cy="320" r="5" />
          </g>
        </svg>
      </div>
      <header className="sticky top-0 z-20 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-b border-line/60 bg-[color-mix(in_srgb,var(--color-canvas)_78%,transparent)] px-4 py-4 backdrop-blur-xl">
        <Logo />
        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted" aria-label="Page">
          <a href="#top" className="hover:text-ink">Home</a>
          <a href="#how" className="hover:text-ink">How It Works</a>
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#paths" className="hover:text-ink">Career Paths</a>
          <a href="#about" className="hover:text-ink">About</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => { beginDemo(); navigate('/dashboard') }}>Try Demo</Button>
          <Button onClick={() => { beginStudent(); navigate(homeFor(student)) }}>Get Started</Button>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-4 pb-20">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">Discover Your Potential. Engineer Your Future.</p>
            <h1 className="mt-4 max-w-xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">Your Future Isn't One-Size-Fits-All.</h1>
            <p className="mt-4 max-w-xl text-xl text-ink">Discover your strengths. Close your skill gaps. Build your own path to success.</p>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted">SkillSprint transforms the way students learn by combining intelligent skill assessment, personalized learning roadmaps, AI-powered practice, and real progress tracking.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={() => { beginStudent(); navigate(saved ? homeFor(student) : '/onboarding') }}>
                {saved ? 'Continue my journey' : 'Start My Journey'} <ArrowRight size={16} />
              </Button>
              <Button variant="ghost" onClick={() => { beginDemo(); navigate('/dashboard') }}>Explore Interactive Demo</Button>
            </div>
            <p className="mt-3 text-sm text-muted">The demo opens Ananya Rao, a fictional student. No account and no API key.</p>
          </motion.div>
          <div className="relative">
            <Picture
              src={scenes.hero.src}
              alt={scenes.hero.alt}
              eager
              className="w-full rounded-[1.75rem]"
              fallback={<HeroArt />}
            />
            <article className="glass float mt-4 p-3 sm:absolute sm:left-3 sm:top-8 sm:mt-0 sm:w-40">
              <p className="text-[10px] uppercase tracking-[0.14em] text-cyan">Illustrative</p>
              <p className="mt-1 text-sm font-semibold">Programming</p>
              <p className="text-2xl font-semibold text-cyan">72</p>
            </article>
            <article className="glass float-card delay mt-3 p-3 sm:absolute sm:right-2 sm:top-28 sm:mt-0 sm:w-40">
              <p className="text-[10px] uppercase tracking-[0.14em] text-cyan">Illustrative</p>
              <p className="mt-1 text-sm font-semibold">5-day streak</p>
              <p className="text-xs text-muted">Sample study rhythm</p>
            </article>
          </div>
        </section>

        <section className="glass grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="journey-title">
          <Picture src={scenes.roadmap.src} alt={scenes.roadmap.alt} className="w-full rounded-2xl" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Illustrative demo content</p>
            <h2 id="journey-title" className="mt-2 text-3xl font-semibold">From Skill Discovery to Career Ready.</h2>
            <p className="mt-2 text-muted">A sample arc. Your own milestones come from the assessment, not from this picture.</p>
            <ol className="mt-5 grid gap-3">
              {journey.map((label, index) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-blue/20 text-sm font-semibold text-cyan">{index + 1}</span>
                  <span className="font-medium">{label}</span>
                  {index < journey.length - 1 ? <span className="h-px flex-1 bg-line" /> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="how" className="mt-16 scroll-mt-24">
          <h2 className="text-3xl font-semibold">How it works</h2>
          <p className="mt-2 max-w-2xl text-muted">Four connected steps. Each one uses the result of the one before it.</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="glass p-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue/20 font-semibold text-cyan">{index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="features" className="mt-16 scroll-mt-24">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-semibold">What you can actually do</h2>
              <p className="mt-2 max-w-2xl text-muted">Every card is a working part of the product, not a promise sitting on a static screen.</p>
            </div>
            <Picture src={scenes.constellation.src} alt={scenes.constellation.alt} className="w-full rounded-[1.5rem]" />
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <li key={feature.title} className="glass p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue/15 text-cyan"><Icon size={18} aria-hidden="true" /></span>
                  <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{feature.text}</p>
                </li>
              )
            })}
          </ul>
        </section>

        <section id="paths" className="mt-16 scroll-mt-24">
          <h2 className="text-3xl font-semibold">Career paths</h2>
          <p className="mt-2 max-w-2xl text-muted">Each path has a configurable target profile. Changing it changes the gaps and the roadmap. It does not predict a job.</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
              <li key={career.id} className="glass overflow-hidden">
                <Picture src={careerArt[career.id].src} alt={careerArt[career.id].alt} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{career.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{career.blurb}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="about" className="mt-16 scroll-mt-24 grid gap-4 lg:grid-cols-2">
          <article className="glass p-6">
            <h2 className="text-3xl font-semibold">About</h2>
            <p className="mt-3 leading-7 text-muted">SkillSprint is a student project for an innovation competition at NIT Surathkal. It helps a learner see the difference between feeling confident and demonstrating a skill, then turns that difference into a study plan.</p>
            <p className="mt-3 leading-7 text-muted">Progress stays in this browser. It is not a secure multi-device account, and it is not an official institute product.</p>
          </article>
          <article className="glass p-6">
            <Picture src={scenes.constellation.src} alt="" className="mb-4 h-36 w-full rounded-2xl object-cover" />
            <h2 className="text-2xl font-semibold">Skill DNA</h2>
            <p className="mt-2 leading-7 text-muted">After the assessment, six skills become a radar chart and a constellation. Strengths, skills in progress, and skills that need attention all come from the same scored answers.</p>
          </article>
        </section>

        <section className="glass mt-16 overflow-hidden px-6 py-10 text-center">
          <Picture src={scenes.companion.src} alt="" className="mx-auto h-40 w-full max-w-md object-contain" />
          <h2 className="mt-4 text-4xl font-semibold">Your Next Breakthrough Starts Here.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">Start with your own profile, or walk Ananya’s record from the dashboard through Skill DNA, the gap map, the roadmap, and a quiz.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => { beginStudent(); navigate('/onboarding') }}>Start My Journey</Button>
            <Button variant="ghost" onClick={() => { beginDemo(); navigate('/dashboard') }}>Try Live Demo</Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-line px-4 py-6 text-center text-sm text-muted">
        SkillSprint — Discover Your Potential. Engineer Your Future.
      </footer>
    </div>
  )
}
