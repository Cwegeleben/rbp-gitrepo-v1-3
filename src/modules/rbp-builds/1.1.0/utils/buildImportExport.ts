// <!-- BEGIN RBP GENERATED: builds-panel-v2 -->
export type BuildJson = { id?: string; name?: string; items: any[] };

export function parseBuildJson(text: string): { ok: true; data: BuildJson } | { ok: false; error: string } {
  try {
    const obj = JSON.parse(text);
    if (!obj || typeof obj !== 'object' || !Array.isArray(obj.items)) return { ok: false, error: 'Invalid schema' };
    return { ok: true, data: obj };
  } catch { return { ok: false, error: 'Invalid JSON' }; }
}

export function stringifyBuildJson(build: { id?: string; title?: string; items?: any[] }): string {
  return JSON.stringify({ id: build?.id, name: build?.title, items: build?.items||[] }, null, 2);
}
// <!-- END RBP GENERATED: builds-panel-v2 -->
