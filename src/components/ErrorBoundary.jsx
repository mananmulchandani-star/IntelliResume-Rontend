import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // You can also log error messages to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>We're sorry, but there was an error loading this page.</p>
            
            {this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <div className="error-message">
                  {this.state.error.toString()}
                </div>
                {this.state.errorInfo && (
                  <div className="error-stack">
                    {this.state.errorInfo.componentStack}
                  </div>
                )}
              </details>
            )}
            
            <div className="error-actions">
              <button onClick={this.handleReset} className="retry-btn">
                Try Again
              </button>
              <button onClick={this.handleReload} className="reload-btn">
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;