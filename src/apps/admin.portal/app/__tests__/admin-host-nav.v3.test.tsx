// <!-- BEGIN RBP GENERATED: admin-host-nav-v3 -->
import { withShopHost } from '../utils/url';

describe('withShopHost v3 absolute URL guard', () => {
  test('strips absolute origin and outputs relative path with params', () => {
    const href = withShopHost('https://example.com/app/catalog', {
      search: '?shop=rbp-dev.myshopify.com&host=abc&embedded=1',
    });
    expect(href).toBe('/app/catalog?shop=rbp-dev.myshopify.com&host=abc&embedded=1');
  });

  test('appends embedded=1 when ensureEmbedded is true', () => {
    const href = withShopHost('/app/builds', {
      search: '?shop=rbp-dev.myshopify.com&host=abc',
      ensureEmbedded: true,
    });
    expect(href).toBe('/app/builds?shop=rbp-dev.myshopify.com&host=abc&embedded=1');
  });
});
// <!-- END RBP GENERATED: admin-host-nav-v3 -->
