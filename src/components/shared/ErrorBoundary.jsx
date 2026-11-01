import React from 'react';
import { ShieldAlert, RotateCcw, Home, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    try {
      // Clear potentially corrupted workspace cache items
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  handleCopyError = () => {
    const text = `Error: ${this.state.error?.message || 'Unknown'}\nStack: ${this.state.error?.stack || ''}`;
    navigator.clipboard?.writeText(text);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-neutral-200 p-6 sm:p-8 text-center animate-scale-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-5">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 mb-3">
              Application Notice
            </div>

            <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Temporary Dashboard View Issue
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
              We encountered an unexpected display issue while rendering this section. Your account, data, and session are safe.
            </p>

            <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-wrap gap-2.5 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reload Workspace
              </button>
              <button
                onClick={this.handleResetAndReload}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Return to Home
              </button>
            </div>

            {/* Error Diagnostics Toggle */}
            <div className="mt-6 text-left border-t border-neutral-100 pt-4">
              <button
                type="button"
                onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                className="flex items-center justify-between w-full text-xs text-neutral-500 hover:text-neutral-700 font-medium py-1"
              >
                <span>Diagnostic Information</span>
                {this.state.showDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-3 bg-neutral-900 text-neutral-100 rounded-lg text-[11px] font-mono overflow-x-auto relative">
                  <button
                    onClick={this.handleCopyError}
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] text-neutral-300 flex items-center gap-1"
                  >
                    {this.state.copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {this.state.copied ? 'Copied' : 'Copy'}
                  </button>
                  <p className="text-rose-400 font-semibold mb-1">
                    {this.state.error?.toString()}
                  </p>
                  <pre className="whitespace-pre-wrap text-[10px] text-neutral-400">
                    {this.state.errorInfo?.componentStack || this.state.error?.stack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
