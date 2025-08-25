// <!-- BEGIN RBP GENERATED: builds-share-links-v1 -->
describe('rbp-share v1.0.0 preview', () => {
  beforeEach(() => { document.body.innerHTML = '<div id="root"></div>'; });
  it('shows invalid when missing token', async () => {
    const el = document.getElementById('root')! as HTMLElement;
    // @ts-ignore override href source used by module
    (window as any).__RBP_SHARE_URL__ = 'https://x/app';
  const mount = require('../index.js') as (el: HTMLElement)=>any;
    mount(el);
    expect(el.textContent || '').toMatch(/Invalid|Unable|expired/i);
  });
});
// <!-- END RBP GENERATED: builds-share-links-v1 -->
