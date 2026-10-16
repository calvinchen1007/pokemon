import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    return {
      hasError: true,
      errorMessage: error?.message || 'Failed to load comments',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[Disqus] Error trapped by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-2xl py-6 px-4 my-6 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-zinc-400">
          <p>Disqus comments could not be loaded directly.</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            If you are using an ad-blocker or strict tracking protection, try pausing it for comments to appear.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
