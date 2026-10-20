import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, BarChart3, Brain, Layers, Route, Sparkles, Trophy } from 'lucide-react'
import { Logo } from '../components/Logo'
import { HeroArt, StepArt, WorldArt, type SceneKind } from '../components/Visuals'
import { Button, useTitle } from '../components/ui'
import { homeFor, useApp } from '../context/AppContext'
import { scenes } from '../data/art'

const steps = [
  { title: 'Discover', text: 'Assess your existing knowledge with scored questions, one at a time.' },
  { title: 'Analyze', text: 'Compare those answers with the skills your target career actually asks for.' },
  { title: 'Personalize', text: 'Build a roadmap from the gaps, your interests, and the time you have.' },
  { title: 'Improve', text: 'Practice, track what you finish, and retake the assessment when you are ready.' },
]

const features: { icon: typeof Brain; title: string; text: string; scene: SceneKind }[] = [
  { icon: Brain, scene: 'assess', title: 'Smart skill assessment', text: 'Multiple-choice items with a correct answer, a skill, a difficulty, and a weight. The score is the weight you earned.' },
  { icon: Route, scene: 'path', title: 'Personalized learning roadmaps', text: 'Phases, tasks, resources, and time estimates change when the career, the hours, or the assessment changes.' },
  { icon: Sparkles, scene: 'ai', title: 'AI-generated quizzes', text: 'A live model can write a quiz when a server key is set. Otherwise the local bank is used and labelled.' },
  { icon: Layers, scene: 'cards', title: 'Flashcards and revision', text: 'Flip a card, mark it known, and revisit questions you missed.' },
  { icon: BarChart3, scene: 'data', title: 'Learning analytics', text: 'Streaks, minutes, quiz accuracy, and skill scores come from what you actually did in this browser.' },
  { icon: Trophy, scene: 'badge', title: 'Gamified achievements', text: 'Badges unlock only when the matching condition is true. Points follow the same record.' },
]

const worlds: { scene: SceneKind; title: string; text: string }[] = [
  { scene: 'code', title: 'Coding', text: 'Trace a function, then change one behavior you can explain.' },
  { scene: 'ai', title: 'Artificial intelligence', text: 'Prepare the data, try a small model, and write where it fails.' },
  { scene: 'data', title: 'Data', text: 'State the comparison, the unit, and what the chart cannot support.' },
  { scene: 'design', title: 'Design', text: 'Shape a flow a person can finish, then say why it works.' },
  { scene: 'business', title: 'Business', text: 'Keep a few honest numbers and a next test, not a slogan.' },
  { scene: 'security', title: 'Security', text: 'Pause on urgency, check the sender, and write a calm note.' },
]

export function Landing() {
  const { student, beginStudent, beginDemo } = useApp()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [feature, setFeature] = useState(0)
  useTitle('Home')
  const saved = Boolean(student.profile)

  return (
    <div id="top">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Logo />
        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted" aria-label="Page">
          <a href="#top" className="hover:text-ink">Home</a>
          <a href="#how" className="hover:text-ink">How It Works</a>
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#about" className="hover:text-ink">About</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button to="/signin" variant="ghost">Sign In</Button>
          <Button onClick={() => { beginStudent(); navigate(homeFor(student)) }}>Get Started</Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <section className="grid items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="inline-flex rounded-full border border-line bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan">
              Discover Your Potential. Engineer Your Future.
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Your Skills. Your Future. Your Sprint.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              Discover your skill gaps, unlock a personalized learning path, and build the future you want — one sprint at a time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={() => { beginStudent(); navigate(saved ? homeFor(student) : '/onboarding') }}>
                {saved ? 'Continue my journey' : 'Start My Learning Journey'} <ArrowRight size={16} />
              </Button>
              <Button variant="ghost" onClick={() => { beginDemo(); navigate('/dashboard') }}>
                Explore Demo
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted">Explore Demo opens the interactive sample student. No account and no API key.</p>
          </motion.div>
          <HeroArt />
        </section>

        <section id="how" className="mt-8 scroll-mt-20">
          <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-2 max-w-2xl text-muted">Four steps. Each one uses the previous result instead of a generic course outline.</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="glass relative p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-blue/20 font-semibold text-cyan">{index + 1}</span>
                  {index < steps.length - 1 ? <span className="hidden h-px flex-1 bg-line md:block" /> : null}
                </div>
                <StepArt name={step.title} />
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="features" className="mt-16 scroll-mt-20">
          <h2 className="text-3xl font-semibold tracking-tight">Features</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <ul className="grid gap-2">
              {features.map((item, index) => {
                const Icon = item.icon
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      aria-pressed={feature === index}
                      className="glass flex w-full items-center gap-3 p-4 text-left"
                      onClick={() => setFeature(index)}
                    >
                      <Icon aria-hidden="true" className="text-cyan" size={18} />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <article className="glass flex min-h-64 flex-col justify-between overflow-hidden p-6">
              <div className="overflow-hidden rounded-2xl">
                <WorldArt kind={features[feature]?.scene ?? 'path'} />
              </div>
              <div className="mt-5">
                <h3 className="text-2xl font-semibold">{features[feature]?.title}</h3>
                <p className="mt-3 max-w-xl text-lg leading-8 text-muted">{features[feature]?.text}</p>
              </div>
              <p className="mt-4 text-sm text-muted">Select a feature to see the picture and what it does with your own answers.</p>
            </article>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="worlds-title">
          <h2 id="worlds-title" className="text-3xl font-semibold tracking-tight">Paths you can sprint toward</h2>
          <p className="mt-2 max-w-2xl text-muted">Original illustrations for the kinds of work the roadmap can point at. The plan itself still comes from your answers.</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {worlds.map((world) => (
              <li key={world.title} className="glass overflow-hidden">
                <WorldArt kind={world.scene} />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{world.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{world.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="about" className="mt-16 scroll-mt-20 grid gap-4 lg:grid-cols-2">
          <article className="glass p-6">
            <h2 className="text-3xl font-semibold tracking-tight">About</h2>
            <p className="mt-3 leading-7 text-muted">
              SkillSprint is a student project for an innovation competition at NIT Surathkal. It helps a learner see the difference between feeling confident and demonstrating a skill, then turns that difference into a study plan they can finish.
            </p>
            <p className="mt-3 leading-7 text-muted">
              Progress stays in this browser. It is not a secure multi-device account, and it is not an official institute product.
            </p>
          </article>
          <article className="glass overflow-hidden p-0">
            <img src={scenes.constellation.src} alt={scenes.constellation.alt} className="h-44 w-full object-cover" />
            <div className="p-6">
            <h2 className="text-3xl font-semibold tracking-tight">Impact</h2>
            <ul className="mt-4 grid gap-3 text-muted">
              <li>They can name a career and see which skills that career weights more heavily.</li>
              <li>They can see a gap as target proficiency minus demonstrated proficiency, never as a self-rating.</li>
              <li>They can mark tasks done, retake the assessment, and watch the roadmap and badges follow.</li>
              <li>They can practice without an API key. A live model is optional and labelled when it is actually used.</li>
            </ul>
            </div>
          </article>
        </section>

        <section className="glass mt-16 px-6 py-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Start with an honest picture of what you know.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">The sample student is ready for judges. Your own sprint starts with six short questions about you, then the assessment.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => { beginStudent(); navigate('/onboarding') }}>Start My Learning Journey</Button>
            <Button variant="ghost" onClick={() => { beginDemo(); navigate('/dashboard') }}>Try Interactive Demo</Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-line px-4 py-6 text-center text-sm text-muted">
        SkillSprint — personalized learning for the NIT Surathkal hackathon.
      </footer>
    </div>
  )
}
