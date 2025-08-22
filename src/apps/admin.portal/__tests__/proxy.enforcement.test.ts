/* <!-- BEGIN RBP GENERATED: tenant-admin-audit-proxy --> */
import { createCatalogApi } from '../CatalogPage';

describe('proxy wrapper enforcement', () => {
  it('list() calls the injected proxy fetch, not global fetch', async () => {
    const globalFetchSpy = jest.spyOn(global, 'fetch');
    const injectedFetch = jest.fn(async (url: RequestInfo | URL, _init?: RequestInit) => {
      // Ensure the path targets the proxy route
      expect(String(url)).toMatch(/^\/apps\/proxy\/api\/catalog\/products\?/);
      return new Response(JSON.stringify({ items: [], pageInfo: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const api = createCatalogApi(injectedFetch as unknown as typeof fetch);
    await api.list({ q: '', vendor: [], tags: [] });

    expect(injectedFetch).toHaveBeenCalled();
    // No direct global fetch to proxy endpoints
    expect(globalFetchSpy).not.toHaveBeenCalledWith(expect.stringMatching(/^\/apps\/proxy\//), expect.anything());
    globalFetchSpy.mockRestore();
  });

  it('setEnabled() calls the injected proxy fetch with PATCH, not global fetch', async () => {
    const globalFetchSpy = jest.spyOn(global, 'fetch');
    const injectedFetch = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      expect(String(url)).toMatch(/^\/apps\/proxy\/api\/catalog\/product\//);
      expect(init?.method).toBe('PATCH');
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const api = createCatalogApi(injectedFetch as unknown as typeof fetch);
    await api.setEnabled('p-123', true);

    expect(injectedFetch).toHaveBeenCalled();
    expect(globalFetchSpy).not.toHaveBeenCalledWith(expect.stringMatching(/^\/apps\/proxy\//), expect.anything());
    globalFetchSpy.mockRestore();
  });
});
/* <!-- END RBP GENERATED: tenant-admin-audit-proxy --> */
