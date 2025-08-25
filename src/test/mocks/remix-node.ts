/* <!-- BEGIN RBP GENERATED: mock-remix-node --> */
export const json = (data: any, init?: ResponseInit) =>
  new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
export const redirect = (url: string, init?: ResponseInit) =>
  new Response('', { status: init?.status ?? 302, headers: { Location: url, ...(init?.headers || {}) } });
/* <!-- END RBP GENERATED: mock-remix-node --> */
