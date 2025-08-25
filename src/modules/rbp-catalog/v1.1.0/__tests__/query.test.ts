/* <!-- BEGIN RBP GENERATED: catalog-picker-v2 --> */
import { parseQuery, writeQuery } from '../utils/query';

describe('catalog v2 query utils', () => {
  it('round-trips query params', () => {
    const u = new URL('https://x.test/?type=Rod&slot=guid-1&q=abc&page=2&sort=title:desc&vendor=Shimano&tag=bass');
    const parsed = parseQuery(u.search);
    expect(parsed).toEqual({ type: 'Rod', slot: 'guid-1', q: 'abc', page: 2, sort: 'title:desc', vendor: 'Shimano', tag: 'bass' });
    const u2 = new URL('https://x.test/');
    writeQuery(u2 as any, parsed);
    expect(u2.searchParams.get('type')).toBe('Rod');
    expect(u2.searchParams.get('slot')).toBe('guid-1');
    expect(u2.searchParams.get('q')).toBe('abc');
    expect(u2.searchParams.get('page')).toBe('2');
    expect(u2.searchParams.get('sort')).toBe('title:desc');
    expect(u2.searchParams.get('vendor')).toBe('Shimano');
    expect(u2.searchParams.get('tag')).toBe('bass');
  });
});
/* <!-- END RBP GENERATED: catalog-picker-v2 --> */
