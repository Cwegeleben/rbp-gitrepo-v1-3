/*
<!-- BEGIN RBP GENERATED: admin-ssr-storage-guard-v1-0 -->
*/
import React from 'react';
import { render } from '@testing-library/react';
import { DevDebugPanel } from '../DevDebugPanel';

describe('DevDebugPanel SSR safety', () => {
  const realWindow = global.window as any;
  afterEach(() => {
    // @ts-ignore
    global.window = realWindow;
  });

  test('does not crash when window is undefined', () => {
    // @ts-ignore
    delete (global as any).window;
    expect(() => render(<DevDebugPanel />)).not.toThrow();
  });
});
/*
<!-- END RBP GENERATED: admin-ssr-storage-guard-v1-0 -->
*/
