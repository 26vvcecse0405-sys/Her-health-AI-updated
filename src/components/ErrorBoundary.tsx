import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

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
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">SkillSprint</p>
        <h1 className="mt-3 text-4xl font-semibold">This screen hit a problem.</h1>
        <p className="mt-3 leading-7 text-muted">Your saved progress is still in this browser. Reload the page, or return to the start.</p>
        <Link to="/" className="btn primary mt-6">Back to SkillSprint</Link>
      </main>
    )
  }
}
