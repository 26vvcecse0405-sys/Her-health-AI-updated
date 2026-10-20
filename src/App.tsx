import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Shell } from './components/Shell'
import { useApp } from './context/AppContext'
import { Landing } from './pages/Landing'

const Achievements = lazy(() => import('./pages/Achievements').then((module) => ({ default: module.Achievements })))
const Analytics = lazy(() => import('./pages/Analytics').then((module) => ({ default: module.Analytics })))
const Assessment = lazy(() => import('./pages/Assessment').then((module) => ({ default: module.Assessment })))
const Assistant = lazy(() => import('./pages/Assistant').then((module) => ({ default: module.Assistant })))
const Careers = lazy(() => import('./pages/Careers').then((module) => ({ default: module.Careers })))
const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })))
const NotFound = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFound })))
const Onboarding = lazy(() => import('./pages/Onboarding').then((module) => ({ default: module.Onboarding })))
const Profile = lazy(() => import('./pages/Profile').then((module) => ({ default: module.Profile })))
const Results = lazy(() => import('./pages/Results').then((module) => ({ default: module.Results })))
const Roadmap = lazy(() => import('./pages/Roadmap').then((module) => ({ default: module.Roadmap })))
const SignIn = lazy(() => import('./pages/SignIn').then((module) => ({ default: module.SignIn })))
const Studio = lazy(() => import('./pages/Studio').then((module) => ({ default: module.Studio })))

function Gate({ children, assessed = false }: { children: ReactNode; assessed?: boolean }) {
  const { state } = useApp()
  if (!state.profile) return <Navigate to="/onboarding" replace />
  if (assessed && state.attempts.length === 0) return <Navigate to="/assessment" replace />
  return children
}

export function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="skeleton mx-auto mt-16 h-64 max-w-3xl" aria-label="Loading" />}>
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
      </Suspense>
    </ErrorBoundary>
  )
}
