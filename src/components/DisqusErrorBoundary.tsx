import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class DisqusErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Disqus embed caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center text-zinc-300">
          <h4 className="font-semibold text-amber-400">Unable to render Disqus Discussion</h4>
          <p className="mt-2 text-xs text-zinc-400">
            Disqus script could not be initialized in this sandbox or was blocked by browser privacy settings.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
            className="mt-4 px-4 py-1.5 text-xs font-medium text-zinc-900 bg-amber-400 rounded-lg hover:bg-amber-300"
          >
            Retry Loading
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
