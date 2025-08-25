/* <!-- BEGIN RBP GENERATED: mock-shopify-server --> */
export const authenticate = {
  admin: async (request: Request) => {
    const url = new URL(request.url);
    if (url.searchParams.has('noauth')) {
      // Simulate Shopify OAuth redirect by throwing a Response
      throw new Response('', { status: 302, headers: { Location: '/auth/start' } });
    }
    return {
      admin: {},
      session: { shop: 'rbp-dev.myshopify.com' },
      redirect: (to: string) => new Response('', { status: 302, headers: { Location: to || '/auth/start' } }),
    } as any;
  },
};
/* <!-- END RBP GENERATED: mock-shopify-server --> */
