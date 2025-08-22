// <!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
import React from "react";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" aria-live="polite" className="p-6">
          <div className="rounded-2xl shadow p-6 grid gap-4">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <button onClick={() => location.reload()} className="inline-flex items-center justify-center rounded-lg px-4 py-2 ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-offset-2">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}
// <!-- END RBP GENERATED: rbp-shell-mvp -->
