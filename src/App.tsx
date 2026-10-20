import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Shell } from './components/Shell'
import { useApp } from './context/AppContext'
import { Achievements } from './pages/Achievements'
import { Analytics } from './pages/Analytics'
import { Assessment } from './pages/Assessment'
import { Careers } from './pages/Careers'
import { Assistant } from './pages/Assistant'
import { Dashboard } from './pages/Dashboard'
import { Landing } from './pages/Landing'
import { NotFound } from './pages/NotFound'
import { Onboarding } from './pages/Onboarding'
import { Profile } from './pages/Profile'
import { Results } from './pages/Results'
import { Roadmap } from './pages/Roadmap'
import { SignIn } from './pages/SignIn'
import { Studio } from './pages/Studio'

function Gate({ children, assessed = false }: { children: ReactNode; assessed?: boolean }) {
  const { state } = useApp()
  if (!state.profile) return <Navigate to="/onboarding" replace />
  if (assessed && state.attempts.length === 0) return <Navigate to="/assessment" replace />
  return children
}

export function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/assessment" element={<Gate><Assessment /></Gate>} />
        <Route element={<Shell />}>
          <Route path="/dashboard" element={<Gate assessed><Dashboard /></Gate>} />
          <Route path="/results" element={<Gate assessed><Results /></Gate>} />
          <Route path="/roadmap" element={<Gate assessed><Roadmap /></Gate>} />
          <Route path="/studio" element={<Gate assessed><Studio /></Gate>} />
          <Route path="/assistant" element={<Gate><Assistant /></Gate>} />
          <Route path="/careers" element={<Gate assessed><Careers /></Gate>} />
          <Route path="/analytics" element={<Gate assessed><Analytics /></Gate>} />
          <Route path="/achievements" element={<Gate><Achievements /></Gate>} />
          <Route path="/profile" element={<Gate><Profile /></Gate>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  )
}
