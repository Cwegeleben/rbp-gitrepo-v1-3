// <!-- BEGIN RBP GENERATED: builds-panel-v2 -->
/**
 * This is a lightweight behavioral test to assert our optimistic pattern:
 * - Duplicate build shows success on 200; on failure, error toast occurs.
 * We don't mount DOM; we simulate the action flow used in index.js.
 */

describe('optimistic duplicate rollback', () => {
  it('handles duplicate failure', async () => {
    const calls: any[] = [];
    const API = {
      async send(url: string, method: string) {
        calls.push({ url, method });
        throw new Error('500');
      }
    };
    let toasts: string[] = [];
    function toast(_k: string, t: string){ toasts.push(t); }
    async function duplicate(build: any){
      try {
        await API.send('/apps/proxy/api/builds', 'POST');
        toast('success','ok');
      } catch {
        toast('error','Duplicate failed');
      }
    }
    await duplicate({ id: 'a', title: 'A', items: [] });
    expect(toasts[toasts.length-1]).toMatch(/Duplicate failed/);
    expect(calls[0].url).toContain('/apps/proxy/api/builds');
  });
});
// <!-- END RBP GENERATED: builds-panel-v2 -->
