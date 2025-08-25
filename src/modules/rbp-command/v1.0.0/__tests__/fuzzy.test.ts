// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
import { score, highlight } from '../utils/fuzzy';

describe('fuzzy utils', () => {
  test('title outranks tags', () => {
    const a = { id:'1', title:'Open Catalog', tags:['catalog'] } as any;
    const b = { id:'2', title:'Open Stuff', tags:['catalog'] } as any;
    const qa = score(a, 'catalog');
    const qb = score(b, 'catalog');
    expect(qa).toBeGreaterThanOrEqual(qb);
  });
  test('highlight splits text', () => {
    const parts = highlight('Open Catalog', 'Cat');
    expect(parts.some(p=>p.h)).toBe(true);
  });
});
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
