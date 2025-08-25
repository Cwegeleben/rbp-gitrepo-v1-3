// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
describe('built-ins dispatch', () => {
  beforeEach(async () => {
    // @ts-ignore
    await import('../index.js');
  });
  afterEach(()=>{ document.body.innerHTML=''; });

  test('cart open event fires', () => {
    const spy = jest.fn();
    window.addEventListener('rbp:cart:open', spy as any);
    // @ts-ignore
    window.RBP_CMD.exec('open-cart-drawer');
    expect(spy).toHaveBeenCalled();
  });
});
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
