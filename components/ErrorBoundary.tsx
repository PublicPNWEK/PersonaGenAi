import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from './icons/FeatureIcons';
import { sleep } from '../utils';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  reportStatus: 'idle' | 'sending' | 'sent';
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    reportStatus: 'idle',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, reportStatus: 'idle' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real application, you would log this to an error reporting service
    // like Sentry, LogRocket, or a custom API endpoint.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleSendReport = async () => {
    this.setState({ reportStatus: 'sending' });
    // Simulate sending the report to a logging service
    console.log("Simulating sending error report:", {
        error: this.state.error?.toString(),
        stack: this.state.error?.stack,
    });
    await sleep(1500); // Simulate network delay
    this.setState({ reportStatus: 'sent' });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-slate-800/50 border border-red-500/50 p-8 rounded-2xl shadow-2xl">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-300">Oops! Something went wrong.</h1>
            <p className="text-slate-400 mt-2 mb-6">
              An unexpected error occurred in the application. Please try reloading the page.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                <ArrowPathIcon className="w-5 h-5" />
                Reload Application
              </button>
              <button
                onClick={this.handleSendReport}
                disabled={this.state.reportStatus !== 'idle'}
                className="w-full sm:w-auto bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-slate-700 disabled:cursor-not-allowed"
              >
                {this.state.reportStatus === 'idle' && 'Send Anonymous Error Report'}
                {this.state.reportStatus === 'sending' && 'Sending...'}
                {this.state.reportStatus === 'sent' && 'Report Sent!'}
              </button>
            </div>
             {this.state.error && (
                <details className="mt-6 text-left">
                    <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-400">Error Details</summary>
                    <pre className="mt-2 text-xs text-red-300 bg-slate-900/50 p-2 rounded-md whitespace-pre-wrap overflow-auto max-h-32">
                        {this.state.error.toString()}
                    </pre>
                </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;