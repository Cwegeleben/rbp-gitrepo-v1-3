// <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
type AdminClient = { graphql: (q: string, opts?: any) => Promise<any> };

export type CanonicalField = {
  key: string;
  label: string;
  type: "string" | "number" | "enum" | "range" | "bool";
  unit?: "in" | "mm" | "oz" | "lb" | "g" | "N/A";
  required?: boolean;
  enumValues?: string[];
};

export type ProductTypeTemplate = {
  id: string; // slug, e.g. "blank"
  name: string; // display name
  fields: CanonicalField[]; // ordered
};

export type SupplierOverride = {
  id: string; // slug, e.g. "batson"
  productTypeId: string; // e.g. "blank"
  fieldMap: Record<string, string>; // supplier column/selector -> canonical key
  selectors?: Record<string, string>;
  unitRules?: Record<string, string>; // e.g., { length_in: "mm->in" }
  synonyms?: Record<string, string[]>; // canonical -> supplier name variants
  urlFetchDisabled?: boolean; // safety switch
};

export type SpecTemplates = {
  productTypes: ProductTypeTemplate[];
  supplierOverrides: SupplierOverride[];
  version: string; // e.g., "0.3.0"
};

const NS = "rbp";
const KEY = "spec_templates";

export async function getTemplates(admin: AdminClient) : Promise<SpecTemplates | null> {
  // Try Shopify shop metafield first
  try {
    const q = `#graphql
      query RbpGetTemplates($ns: String!, $key: String!) {
        shop { metafield(namespace: $ns, key: $key) { id value } }
      }
    `;
    const res = await admin.graphql(q, { variables: { ns: NS, key: KEY } });
    const data = await res.json();
    const v = data?.data?.shop?.metafield?.value;
    if (typeof v === "string" && v.trim()) {
      return JSON.parse(v);
    }
  } catch (e) {
    // fall through to file cache in dev if desired
    console.warn("[RBP HQ] getTemplates: metafield read failed (dev likely)", e);
  }
  // Dev fallback: none present
  return null;
}

export async function saveTemplates(admin: AdminClient, templates: SpecTemplates) : Promise<{ ok: true }>{
  const shopRes = await admin.graphql(`#graphql { shop { id } }`);
  const shopData = await shopRes.json();
  const ownerId = shopData?.data?.shop?.id;
  if (!ownerId) throw new Error("saveTemplates: unable to resolve shop id");
  const m = `#graphql
    mutation RbpSaveTemplates($ownerId: ID!, $ns: String!, $key: String!, $val: String!) {
      metafieldsSet(metafields: [{ ownerId: $ownerId, namespace: $ns, key: $key, type: "json", value: $val }]) {
        metafields { id }
        userErrors { field message }
      }
    }
  `;
  await admin.graphql(m, { variables: { ownerId, ns: NS, key: KEY, val: JSON.stringify(templates) } });
  return { ok: true } as const;
}

export async function ensureSeedTemplates(admin: AdminClient) : Promise<SpecTemplates> {
  const existing = await getTemplates(admin);
  if (existing?.productTypes?.length) return existing;
  const seed = seedTemplates();
  await saveTemplates(admin, seed);
  return seed;
}

export function seedTemplates(): SpecTemplates {
  const blank: ProductTypeTemplate = {
    id: "blank",
    name: "Blank",
    fields: [
      { key: "supplier", label: "Supplier", type: "string" },
      { key: "supplier_sku", label: "Supplier SKU", type: "string" },
      { key: "title", label: "Title", type: "string", required: true },
      { key: "description", label: "Description", type: "string" },
      { key: "images", label: "Images", type: "string" },
      { key: "price_cost", label: "Cost", type: "number" },
      { key: "price_map", label: "MAP", type: "number" },
      { key: "tags", label: "Tags", type: "string" },
      { key: "model", label: "Model", type: "string", required: true },
      { key: "length_in", label: "Length (in)", type: "number", unit: "in", required: true },
      { key: "pieces", label: "Pieces", type: "number" },
      { key: "power", label: "Power", type: "enum", enumValues: ["UL","L","ML","M","MH","H","XH"] },
      { key: "action", label: "Action", type: "enum", enumValues: ["Slow","Moderate","Fast","X-Fast"] },
      { key: "line_lb_min", label: "Line Min (lb)", type: "number", unit: "lb" },
      { key: "line_lb_max", label: "Line Max (lb)", type: "number", unit: "lb" },
      { key: "lure_oz_min", label: "Lure Min (oz)", type: "number", unit: "oz" },
      { key: "lure_oz_max", label: "Lure Max (oz)", type: "number", unit: "oz" },
      { key: "butt_od_mm", label: "Butt OD (mm)", type: "number", unit: "mm" },
      { key: "tip_od_mm", label: "Tip OD (mm)", type: "number", unit: "mm" },
      { key: "material", label: "Material", type: "string" },
      { key: "color", label: "Color", type: "string" },
      { key: "weight_oz", label: "Weight (oz)", type: "number", unit: "oz" }
    ]
  };

  const guide: ProductTypeTemplate = {
    id: "guide",
    name: "Guide",
    fields: [
      { key: "supplier", label: "Supplier", type: "string" },
      { key: "supplier_sku", label: "Supplier SKU", type: "string" },
      { key: "title", label: "Title", type: "string", required: true },
      { key: "ring_size", label: "Ring Size", type: "number" },
      { key: "ring_material", label: "Ring Material", type: "string" },
      { key: "frame_material", label: "Frame Material", type: "string" },
      { key: "height_mm", label: "Height (mm)", type: "number", unit: "mm" },
      { key: "weight_g", label: "Weight (g)", type: "number", unit: "g" },
      { key: "color", label: "Color", type: "string" }
    ]
  };

  const reelSeat: ProductTypeTemplate = {
    id: "reelseat",
    name: "Reel Seat",
    fields: [
      { key: "supplier", label: "Supplier", type: "string" },
      { key: "supplier_sku", label: "Supplier SKU", type: "string" },
      { key: "title", label: "Title", type: "string", required: true },
      { key: "size", label: "Size", type: "string" },
      { key: "id_model", label: "ID Model", type: "string" },
      { key: "material", label: "Material", type: "string" },
      { key: "bore_mm", label: "Bore (mm)", type: "number", unit: "mm" },
      { key: "color", label: "Color", type: "string" }
    ]
  };

  const grip: ProductTypeTemplate = {
    id: "grip",
    name: "Grip",
    fields: [
      { key: "supplier", label: "Supplier", type: "string" },
      { key: "supplier_sku", label: "Supplier SKU", type: "string" },
      { key: "title", label: "Title", type: "string", required: true },
      { key: "length_in", label: "Length (in)", type: "number", unit: "in" },
      { key: "od_in", label: "OD (in)", type: "number", unit: "in" },
      { key: "id_in", label: "ID (in)", type: "number", unit: "in" },
      { key: "material", label: "Material", type: "string" },
      { key: "shape", label: "Shape", type: "string" },
      { key: "color", label: "Color", type: "string" }
    ]
  };

  const batsonBlank: SupplierOverride = {
    id: "batson",
    productTypeId: "blank",
    fieldMap: {
      model: "model",
      length: "length_in",
      length_in: "length_in",
      power: "power",
      action: "action",
      line_min: "line_lb_min",
      line_max: "line_lb_max",
      lure_min: "lure_oz_min",
      lure_max: "lure_oz_max",
      butt_od: "butt_od_mm",
      tip_od: "tip_od_mm",
      weight: "weight_oz",
      material: "material",
      color: "color",
      sku: "supplier_sku",
      supplier: "supplier",
      title: "title"
    },
    unitRules: {
      length_in: "mm->in",
      butt_od_mm: "mm",
      tip_od_mm: "mm",
      weight_oz: "g->oz",
      line_lb_min: "lb",
      line_lb_max: "lb",
      lure_oz_min: "oz",
      lure_oz_max: "oz"
    },
    synonyms: {
      length_in: ["length", "len", "overall length"],
      power: ["pwr"],
      action: ["act"],
      butt_od_mm: ["butt od", "butt diameter"],
      tip_od_mm: ["tip od", "tip diameter"],
      weight_oz: ["weight", "wt"]
    }
  };

  return {
    version: "0.3.0",
    productTypes: [blank, guide, reelSeat, grip],
    supplierOverrides: [batsonBlank]
  };
}
// <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
