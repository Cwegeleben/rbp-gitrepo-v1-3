// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
import { normalizeManifest } from '../../v1.0.0/utils/manifest.js';

describe('templates manifest normalize', () => {
  it('keeps good entries and drops invalid', () => {
    const m = normalizeManifest({ version: 1, templates: [
      { id: 'a', title: 'A', slots: [{ type:'x', productId:'p' }] },
      { id: '', title: 'B', slots: [{ type:'x', productId:'p' }] },
      { id: 'c', title: '', slots: [{ type:'x', productId:'p' }] },
      { id: 'd', title: 'D', slots: [] },
    ] });
    expect(m.templates.map(t=>t.id)).toEqual(['a']);
  });
});
// <!-- END RBP GENERATED: builds-templates-v1 -->
