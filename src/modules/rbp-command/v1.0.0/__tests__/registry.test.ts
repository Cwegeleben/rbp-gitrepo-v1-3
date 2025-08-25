// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
import { act } from '@testing-library/react';

describe('rbp-command registry', () => {
  beforeEach(async () => {
    // import side-effect module (mounts event bridge + builtins)
  // @ts-ignore
    await import('../index.js');
  });
  afterEach(()=>{ document.body.innerHTML=''; });

  test('register, unregister, exec', () => {
    const execSpy = jest.fn();
    window.addEventListener('foo:event', execSpy as any);

    act(()=>{
      window.dispatchEvent(new CustomEvent('rbp:cmd:register', { detail: { actions: [
        { id:'a1', title:'Alpha', exec:{ type:'event', value:'foo:event', payload:{ ok:true } } }
      ] } }));
    });
    // Execute via public API
    // @ts-ignore
    expect(window.RBP_CMD.exec('a1')).toBe(true);
    expect(execSpy).toHaveBeenCalled();

    act(()=>{ window.dispatchEvent(new CustomEvent('rbp:cmd:unregister', { detail: { ids: ['a1'] } })); });
    // @ts-ignore
    expect(window.RBP_CMD.exec('a1')).toBe(false);
  });
});
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
