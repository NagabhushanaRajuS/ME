"use client";

import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by ErrorBoundary:", error);
      console.error("Error info:", errorInfo);
    }

    // In production, you could send this to an error tracking service
    if (process.env.NODE_ENV === "production") {
      try {
        // Send to error tracking service (e.g., Sentry, LogRocket)
        // await fetch("/api/errors", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     error: error.message,
        //     stack: error.stack,
        //     componentStack: errorInfo.componentStack,
        //   }),
        // });
      } catch (e) {
        console.error("Failed to report error:", e);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 px-4"
          role="alert"
        >
          <div className="text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-400 mb-6 max-w-md">
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 bg-slate-800 rounded-lg p-4 text-left">
                <summary className="cursor-pointer text-slate-300 font-semibold">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-slate-400 overflow-auto max-h-48">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Reload the page"
              >
                Reload Page
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                aria-label="Go to home page"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
