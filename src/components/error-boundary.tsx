// ═══════════════════════════════════════════════════════════
// strQ — Error Boundary
// Catches React render crashes, reports to Sentry, shows
// a friendly recovery screen instead of a white page.
// ═══════════════════════════════════════════════════════════

'use client';

import { Component, type ReactNode } from 'react';
import { reportError } from '@/lib/error-reporting';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    reportError(error, { component: 'ErrorBoundary' });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1A1A2E',
            color: '#fff',
            fontFamily: 'Inter, -apple-system, sans-serif',
            padding: 24,
            textAlign: 'center',
          }}
        >
          {/* Q resting — something went wrong */}
          <div style={{ fontSize: 64, marginBottom: 16 }}>🐢</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
            Oeps, er ging iets mis
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 24px' }}>
            Q is even gaan zitten. Probeer de pagina te herladen.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            style={{
              background: '#6C3483',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 28px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Herladen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
