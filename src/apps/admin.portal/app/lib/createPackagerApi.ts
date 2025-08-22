/*
<!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility -->
*/
import { fetchProxy } from '../../fetchProxy.server';

export type PackagerDryRunResult = {
  ok: boolean;
  lines?: Array<any>;
  meta?: { totals?: { subtotal: number; estTax?: number; total: number; currency?: string } };
  hints?: Array<{ type: string; sku?: string; message?: string }>;
  code?: string;
};

export function createPackagerApi(fetchImpl: typeof fetch = fetchProxy as any) {
  return {
    async packageDryRun(params?: { buildId?: string; body?: any }): Promise<PackagerDryRunResult> {
      const url = new URL('/apps/proxy/api/checkout/package', window.location.origin);
      const init: RequestInit = {
        method: params?.body ? 'POST' : 'GET',
        headers: { 'X-RBP-Dry-Run': '1', ...(params?.body ? { 'Content-Type': 'application/json' } : {}) },
        ...(params?.body ? { body: JSON.stringify(params!.body) } : {}),
      };
      if (params?.buildId) {
        // When supported, pass buildId as query or body passthrough; prefer query to avoid mutation
        url.searchParams.set('buildId', params.buildId);
      }
      const res = await (fetchImpl as any)(url.pathname + url.search, init);
      // Preserve error shapes but normalize to PackagerDryRunResult
      if (!res.ok) {
        let code = `HTTP_${res.status}`;
        try { const data = await res.json(); code = (data && (data.code || data.error || code)) as string; } catch {}
        return { ok: false, code };
      }
      try {
        const data = await res.json();
        return {
          ok: !!data?.ok,
          lines: data?.lines || data?.items,
          meta: data?.meta,
          hints: data?.hints || [],
          code: data?.code,
        } as PackagerDryRunResult;
      } catch {
        return { ok: false, code: 'INVALID_JSON' };
      }
    },
  };
}
/*
<!-- END RBP GENERATED: tenant-admin-ui-visibility -->
*/
