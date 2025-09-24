// <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
type AdminClient = { graphql: (q: string, opts?: any) => Promise<any> };

type CreateProductInput = {
  canonical: Record<string, any>;
  images?: string[];
  tags?: string[];
};

export async function createProduct(admin: AdminClient, input: CreateProductInput): Promise<string> {
  const title = String(input.canonical.title || input.canonical.model || "Imported Product");
  const descriptionHtml = String(input.canonical.description || "");
  const tags = input.tags || (Array.isArray(input.canonical.tags) ? input.canonical.tags : []);

  const mProductCreate = `#graphql
    mutation RbpCreateProduct($title: String!, $desc: String!, $tags: [String!]) {
      productCreate(input: { title: $title, descriptionHtml: $desc, tags: $tags }) {
        product { id }
        userErrors { field message }
      }
    }
  `;
  const res = await admin.graphql(mProductCreate, { variables: { title, desc: descriptionHtml, tags } });
  const data = await res.json();
  const id: string | undefined = data?.data?.productCreate?.product?.id;
  if (!id) throw new Error("productCreate failed");

  const setSpecs = `#graphql
    mutation RbpSetSpecs($ownerId: ID!, $val: String!) {
      metafieldsSet(metafields: [{ ownerId: $ownerId, namespace: "rbp", key: "specs", type: "json", value: $val }]) {
        metafields { id }
        userErrors { field message }
      }
    }
  `;
  await admin.graphql(setSpecs, { variables: { ownerId: id, val: JSON.stringify(input.canonical) } });
  return id;
}
// <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
