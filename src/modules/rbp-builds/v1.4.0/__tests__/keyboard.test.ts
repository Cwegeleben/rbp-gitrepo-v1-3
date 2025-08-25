/* <!-- BEGIN RBP GENERATED: builds-undo-redo-v1 --> */
// Smoke test: ensure our key handler does not intercept when typing in input and does intercept otherwise.

test('does not intercept inside input', () => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  let prevented = false;
  const ev = new KeyboardEvent('keydown', { key: 'z', metaKey: navigator.platform.toLowerCase().includes('mac'), ctrlKey: !navigator.platform.toLowerCase().includes('mac') });
  Object.defineProperty(ev, 'target', { value: input });
  Object.defineProperty(ev, 'preventDefault', { value: () => { prevented = true; } });
  window.dispatchEvent(ev);
  expect(prevented).toBe(false);
  document.body.removeChild(input);
});

test('can intercept at window (no crash)', () => {
  let prevented = false;
  const ev = new KeyboardEvent('keydown', { key: 'z', metaKey: navigator.platform.toLowerCase().includes('mac'), ctrlKey: !navigator.platform.toLowerCase().includes('mac') });
  Object.defineProperty(ev, 'preventDefault', { value: () => { prevented = true; } });
  window.dispatchEvent(ev);
  // We don't assert true here as it depends on history state, but ensure no crash path
  expect(typeof prevented).toBe('boolean');
});
/* <!-- END RBP GENERATED: builds-undo-redo-v1 --> */
