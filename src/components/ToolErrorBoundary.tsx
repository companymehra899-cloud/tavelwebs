"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  toolName: string;
}

interface State {
  hasError: boolean;
}

export class ToolErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("Tool error", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-semibold">
            {this.props.toolName} ran into a problem.
          </p>
          <p className="mt-1">
            The rest of the site is unaffected. Reload the page to try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 min-h-11 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
