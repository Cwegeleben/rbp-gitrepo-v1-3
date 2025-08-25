// <!-- BEGIN RBP GENERATED: builds-share-links-v1 -->
import { buildShareUrlFromToken } from '../utils/shareUrl';

describe('share links v1', () => {
  it('builds absolute URL with token', () => {
    const url = buildShareUrlFromToken('abc', 'https://example.com/apps/proxy?x=1');
    expect(url.includes('?')).toBeTruthy();
    expect(url.includes('share=abc')).toBeTruthy();
  });
});
// <!-- END RBP GENERATED: builds-share-links-v1 -->
