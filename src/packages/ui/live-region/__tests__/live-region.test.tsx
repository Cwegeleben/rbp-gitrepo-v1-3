// <!-- BEGIN RBP GENERATED: ui-polish-v1 -->
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LiveRegion } from '../LiveRegion';

test('LiveRegion.announce updates polite region', () => {
  jest.useFakeTimers();
  render(<LiveRegion />);
  act(() => { LiveRegion.announce('Hello'); });
  const region = screen.getByRole('status');
  expect(region).toHaveAttribute('aria-live', 'polite');
  expect(region).toHaveTextContent('Hello');
  act(() => { jest.advanceTimersByTime(1200); });
  expect(region).toHaveTextContent('');
});
// <!-- END RBP GENERATED: ui-polish-v1 -->
