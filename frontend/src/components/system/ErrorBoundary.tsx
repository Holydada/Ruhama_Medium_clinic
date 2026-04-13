import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../ui/Button';

type Props = { children: ReactNode };
type State = { hasError: boolean; message: string };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Something went wrong.' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error boundary:', error, info.componentStack);

    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/dac8830c-c6e9-467c-9b36-cca0e5931c46', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'a30468' },
      body: JSON.stringify({
        sessionId: 'a30468',
        runId: 'debug',
        hypothesisId: 'H1',
        location: 'src/components/system/ErrorBoundary.tsx:componentDidCatch',
        message: 'Client render crash',
        data: { errorMessage: error.message, componentStack: info.componentStack },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center space-y-4">
            <h1 className="text-xl font-semibold text-slate-50">Application error</h1>
            <p className="text-sm text-slate-400">
              The page hit an unexpected error. Reload to continue. If this persists, contact your system
              administrator and mention the time and screen you were using.
            </p>
            <p className="text-xs font-mono text-red-300/90 break-words">{this.state.message}</p>
            <Button variant="primary" className="w-full" type="button" onClick={() => window.location.reload()}>
              Reload application
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
