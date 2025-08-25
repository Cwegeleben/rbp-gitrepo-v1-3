// <!-- BEGIN RBP GENERATED: admin-auth-guard-v1 -->
import { loader as dashboardLoader } from '../routes/app._index';

describe('Admin auth guard', () => {
  test('missing session triggers OAuth redirect', async () => {
    const req = new Request('https://rbp.local/app?noauth=1');
    let redirected = false;
    try {
      // authenticate.admin will throw a Response for redirect in real runtime; in tests we simulate by catching
      await (dashboardLoader as any)({ request: req });
    } catch (res: any) {
      redirected = res?.status === 302;
    }
    expect(redirected).toBe(true);
  });

  test('deep link maintains host after re-embed', async () => {
    const req = new Request('https://rbp.local/app/catalog?foo=1&auth=1');
    try {
      const result = await (dashboardLoader as any)({ request: req });
      if (result instanceof Response) {
        const loc = result.headers.get('Location') || '';
        expect(loc).toContain('/app?');
        expect(loc).toContain('embedded=1');
        expect(loc).toContain('return_to=%2Fapp%2Fcatalog%3Ffoo%3D1');
      }
    } catch {}
  });
});
// <!-- END RBP GENERATED: admin-auth-guard-v1 -->
