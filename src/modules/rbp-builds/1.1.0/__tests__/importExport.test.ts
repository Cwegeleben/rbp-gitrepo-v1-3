// <!-- BEGIN RBP GENERATED: builds-panel-v2 -->
import { parseBuildJson, stringifyBuildJson } from '../utils/buildImportExport';

describe('build import/export utils', () => {
  it('round-trips a build JSON', () => {
    const src = { id: 'x', title: 'Demo', items: [{ type: 'Blanks', label: 'A', quantity: 1 }] };
    const text = stringifyBuildJson(src);
    const parsed = parseBuildJson(text);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.data.items.length).toBe(1);
      expect(parsed.data.name).toBe('Demo');
    }
  });
  it('rejects invalid JSON and schema', () => {
    const bad = parseBuildJson('{');
    expect(bad.ok).toBe(false);
    const bad2 = parseBuildJson(JSON.stringify({ foo: 'bar' }));
    expect(bad2.ok).toBe(false);
  });
});
// <!-- END RBP GENERATED: builds-panel-v2 -->
