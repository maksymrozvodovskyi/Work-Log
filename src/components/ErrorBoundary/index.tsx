import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import css from "./ErrorBoundary.module.css";

type ErrorBoundaryPropsType = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryStateType = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryPropsType,
  ErrorBoundaryStateType
> {
  constructor(props: ErrorBoundaryPropsType) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryStateType {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={css.errorContainer}>
          <h2 className={css.errorTitle}>Something went wrong</h2>
          <p className={css.errorMessage}>
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            className={css.errorButton}
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
