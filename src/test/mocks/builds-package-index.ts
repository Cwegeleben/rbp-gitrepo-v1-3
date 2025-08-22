/* <!-- BEGIN RBP GENERATED: packager-v2 --> */
export async function computeBOM(buildId: string) {
  return [{ sku: 'SKU1', qty: 1 }, { sku: 'SKU2', qty: 1 }];
}
export async function smartChoiceV1(bom: Array<{ sku: string; qty: number }>) {
  return { plan: bom.map(b => ({ sku: b.sku, qty: b.qty, locationId: 'RBP1' })), locationsUsed: ['RBP1'] };
}
export async function jitRecheckRbpAvailability(plan: any[]) {
  return { adjustedPlan: plan, rbpOut: [] };
}
export async function upsertSourcingPlan(_buildId: string, plan: any, _status?: any) { return { id: 'sp1', plan }; }
export async function createSoftReservations() { return [{ sku: 'SKU1', qty: 1, locationId: 'RBP1', expiresAt: new Date().toISOString() }]; }
export async function ensurePackagedSku() { return { productId: 'gid://shopify/Product/1', variantId: 'gid://shopify/ProductVariant/10' }; }
export function buildCartPath(vid: string, q: number) { return `/cart/${vid}:${q}`; }
/* <!-- END RBP GENERATED: packager-v2 --> */