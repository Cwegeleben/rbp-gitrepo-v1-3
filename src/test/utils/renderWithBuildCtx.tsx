// <!-- BEGIN RBP GENERATED: package-tests-stable-v1 -->
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

type Options = {
  live?: boolean;
};

/**
 * Renders a component inside a minimal wrapper that also injects
 * an aria-live region used by our modules in tests.
 */
export function renderWithBuildCtx(ui: React.ReactElement, opts: Options = {}) {
  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
      <div>
        {opts.live !== false && <div id="rbp-aria-live" aria-live="polite" aria-atomic="true" />}
        {children}
      </div>
    );
  };
  return render(ui, { wrapper: Wrapper } as RenderOptions);
}
// <!-- END RBP GENERATED: package-tests-stable-v1 -->
