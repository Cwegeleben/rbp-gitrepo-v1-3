// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
import { fireEvent } from '@testing-library/react';

describe('rbp-command keyboard', () => {
  beforeEach(async () => {
    // @ts-ignore
    await import('../index.js');
  });
  afterEach(()=>{ document.body.innerHTML=''; });

  function isOpen(){
    // @ts-ignore
    return !!window.RBP_CMD?._store?.open;
  }

  test('⌘K opens and Esc closes', () => {
    expect(isOpen()).toBe(false);
    fireEvent.keyDown(window, { key:'k', metaKey:true });
    expect(isOpen()).toBe(true);
    fireEvent.keyDown(window, { key:'Escape' });
    expect(isOpen()).toBe(false);
  });

  test('does not open while typing in inputs', () => {
    const input = document.createElement('input'); document.body.appendChild(input); input.focus();
    fireEvent.keyDown(window, { key:'k', ctrlKey:true });
    expect(isOpen()).toBe(false);
  });
});
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
