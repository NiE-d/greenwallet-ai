import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Top-level error boundary that catches unhandled rendering errors anywhere
 * in the component tree and shows a minimal recovery screen instead of a
 * blank white page. This is a safety net only — it does not change any
 * existing behavior and has no effect unless a component actually throws
 * during render.
 *
 * React error boundaries must be class components; there is no hooks-based
 * equivalent as of React 18.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Logged to the console only — this app has no analytics or error
    // reporting service, consistent with its zero-data-transmission design.
    console.error('GreenWallet AI encountered an unexpected error:', error, errorInfo)
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Something went wrong.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Your data was never sent anywhere — it's safe. Reloading should fix this.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '999px',
              padding: '0.75rem 2rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
