import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error.message, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <main className="mx-auto max-w-lg px-4 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">HerHealth AI</p>
        <h1 className="mt-3 text-4xl">This screen hit a problem.</h1>
        <p className="mt-3 leading-7 text-muted">Your saved notes are still in this browser if storage opened. Reload, or return home. This is not a medical emergency screen — if you are in danger, contact local emergency services.</p>
        <Link to="/" className="btn primary mt-6">Back to HerHealth</Link>
      </main>
    )
  }
}
