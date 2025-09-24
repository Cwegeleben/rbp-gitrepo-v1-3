// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-inventory-v0-4 -->
type AdminClient = { graphql: (q: string, opts?: any) => Promise<any> };

export type HQSettings = { defaultLocationId?: string };
const NS = "rbp";
const KEY = "settings";

export async function getSettings(admin: AdminClient): Promise<HQSettings> {
  try {
    const q = `#graphql
      query RbpGetSettings($ns: String!, $key: String!) {
        shop { metafield(namespace: $ns, key: $key) { value } }
      }
    `;
    const res = await admin.graphql(q, { variables: { ns: NS, key: KEY } });
    const data = await res.json();
    const v = data?.data?.shop?.metafield?.value;
    if (typeof v === "string" && v) return JSON.parse(v);
  } catch {}
  return {};
}

export async function saveSettings(admin: AdminClient, settings: HQSettings): Promise<{ ok: true }>{
  const shopRes = await admin.graphql(`#graphql { shop { id } }`);
  const shopData = await shopRes.json();
  const ownerId = shopData?.data?.shop?.id;
  if (!ownerId) throw new Error("saveSettings: missing shop id");
  const m = `#graphql
    mutation RbpSaveSettings($ownerId: ID!, $ns: String!, $key: String!, $val: String!) {
      metafieldsSet(metafields: [{ ownerId: $ownerId, namespace: $ns, key: $key, type: "json", value: $val }]) {
        metafields { id }
        userErrors { field message }
      }
    }
  `;
  await admin.graphql(m, { variables: { ownerId, ns: NS, key: KEY, val: JSON.stringify(settings) } });
  return { ok: true } as const;
}
// <!-- END RBP GENERATED: rbp-hq-catalog-inventory-v0-4 -->
