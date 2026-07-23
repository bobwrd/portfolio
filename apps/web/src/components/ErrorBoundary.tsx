import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of the children if a render error is thrown. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time errors in its subtree and shows `fallback` instead of
 * letting the error blank out the whole page. Used to isolate the WebGL globe
 * so a globe failure can never take down the Verdict page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
