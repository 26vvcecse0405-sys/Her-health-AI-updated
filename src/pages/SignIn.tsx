import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Button, useTitle } from '../components/ui'
import { homeFor, useApp } from '../context/AppContext'

export function SignIn() {
  const { student, beginStudent, beginDemo } = useApp()
  const navigate = useNavigate()
  useTitle('Continue')
  const saved = Boolean(student.profile)

  return (
    <main className="mx-auto grid max-w-xl gap-6 px-4 py-10">
      <Logo />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">This browser</p>
        <h1 className="mt-2 text-4xl font-semibold">Continue your sprint.</h1>
        <p className="mt-3 leading-7 text-muted">
          SkillSprint does not ask for a password in this demo. A profile you create stays in this browser. The sample student, Ananya Rao, is stored separately.
        </p>
      </div>
      <section className="glass p-5">
        <h2 className="text-xl font-semibold">{saved ? `Welcome back, ${student.profile?.name}.` : 'No profile in this browser yet.'}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {saved ? 'Your assessment, roadmap, and quizzes are still here.' : 'Six short questions create a profile. The assessment comes next.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={() => { beginStudent(); navigate(saved ? homeFor(student) : '/onboarding') }}>
            {saved ? 'Continue my journey' : 'Create my profile'}
          </Button>
          <Button variant="ghost" onClick={() => { beginDemo(); navigate('/dashboard') }}>Try Live Demo</Button>
        </div>
      </section>
    </main>
  )
}
