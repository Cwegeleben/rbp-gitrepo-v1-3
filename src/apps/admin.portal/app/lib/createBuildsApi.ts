/*
<!-- BEGIN RBP GENERATED: tenant-admin-builds-qol -->
*/
import { fetchProxy } from '../../fetchProxy.server';

export type BuildListItem = {
  id: string;
  title?: string;
  createdAt?: string;
  itemsCount?: number;
};

export type BuildDetail = {
  id: string;
  title?: string;
  createdAt?: string;
  items?: Array<{ type?: string; name?: string; qty?: number; [k: string]: any }>;
};

export type BuildsListResponse = {
  items: BuildListItem[];
  pageInfo?: { nextCursor?: string; prevCursor?: string; total?: number };
};

export function createBuildsApi(fetchImpl: typeof fetch = fetchProxy as any) {
  return {
    async list(params: { q?: string; cursor?: string }): Promise<BuildsListResponse> {
      const sp = new URLSearchParams();
      if (params.q) sp.set('q', params.q);
      if (params.cursor) sp.set('cursor', params.cursor);
      const res = await fetchImpl(`/apps/proxy/api/builds?${sp.toString()}`);
      if (!res.ok) throw new Error(`Failed to load builds: ${res.status}`);
      return (await res.json()) as BuildsListResponse;
    },
    async get(id: string): Promise<BuildDetail> {
      const res = await fetchImpl(`/apps/proxy/api/builds/${id}`);
      if (!res.ok) {
        const err: any = new Error(`Failed to load: ${res.status}`);
        err.status = res.status;
        throw err;
      }
      return (await res.json()) as BuildDetail;
    },
    async patch(id: string, payload: Partial<BuildDetail>): Promise<BuildDetail> {
      const res = await fetchImpl(`/apps/proxy/api/builds/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to update: ${res.status}`);
      return (await res.json()) as BuildDetail;
    },
    async duplicate(id: string): Promise<BuildDetail> {
      const res = await fetchImpl(`/apps/proxy/api/builds/${id}/duplicate`, { method: 'POST' });
      if (res.status === 404 || res.status === 405) {
        const err: any = new Error('Not implemented');
        err.code = 'ENOTIMPL';
        throw err;
      }
      if (!res.ok) throw new Error(`Failed to duplicate: ${res.status}`);
      return (await res.json()) as BuildDetail;
    },
  };
}
/*
<!-- END RBP GENERATED: tenant-admin-builds-qol -->
*/
