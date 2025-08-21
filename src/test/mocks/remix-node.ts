/* <!-- BEGIN RBP GENERATED: mock-remix-node --> */
export const json = (data: any, init?: ResponseInit) =>
  new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
/* <!-- END RBP GENERATED: mock-remix-node --> */
