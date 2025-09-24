// <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
import type { ProductTypeTemplate, SupplierOverride } from "./templates.server";

export type NormalizeResult = { canonical: Record<string, any>; warnings: string[] };

export function normalizeSpecs(
  raw: Record<string, any>,
  template: ProductTypeTemplate,
  override?: SupplierOverride
): NormalizeResult {
  const warnings: string[] = [];
  const out: Record<string, any> = {};
  const fieldKeys = new Set(template.fields.map((f) => f.key));

  // Build mapping table from override fieldMap + synonyms
  const aliasToCanonical = new Map<string, string>();
  if (override?.fieldMap) {
    for (const [src, dst] of Object.entries(override.fieldMap)) {
      aliasToCanonical.set(src.toLowerCase(), dst);
    }
  }
  if (override?.synonyms) {
    for (const [canonical, syns] of Object.entries(override.synonyms)) {
      syns.forEach((s) => aliasToCanonical.set(s.toLowerCase(), canonical));
    }
  }

  // First, map raw keys to canonical
  const mapped: Record<string, any> = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = k.toLowerCase();
    const canonical = aliasToCanonical.get(key) || (fieldKeys.has(k) ? k : undefined);
    if (canonical) mapped[canonical] = v;
    else mapped[key] = v; // keep unknowns for reference
  }

  // Apply unit rules and type coercion
  for (const f of template.fields) {
    const v = mapped[f.key];
    if (v == null || v === "") {
      if (f.required) warnings.push(`Missing required: ${f.key}`);
      continue;
    }
    let val: any = v;
    try {
      switch (f.type) {
        case "number":
          val = coerceNumber(v, override?.unitRules?.[f.key]);
          if (Number.isNaN(val)) warnings.push(`Invalid number for ${f.key}: ${v}`);
          break;
        case "bool":
          val = coerceBool(v);
          break;
        case "range":
          // Parse "min-max" into two fields if present
          val = String(v);
          break;
        case "enum":
          val = String(v);
          if (f.enumValues && !f.enumValues.includes(val)) warnings.push(`Enum out of set for ${f.key}: ${val}`);
          break;
        default:
          val = String(v);
      }
    } catch (e: any) {
      warnings.push(`Coercion failed for ${f.key}: ${e?.message || String(e)}`);
    }
    out[f.key] = val;
    // Keep raw as *_raw if changed
    if (String(v) !== String(val)) out[`${f.key}_raw`] = v;
  }

  return { canonical: out, warnings };
}

function coerceBool(v: any): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase().trim();
  return s === "true" || s === "1" || s === "yes";
}

function coerceNumber(v: any, rule?: string): number {
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ""));
  if (!rule) return n;
  switch (rule) {
    case "mm->in":
      return round(n / 25.4, 3);
    case "g->oz":
      return round(n / 28.3495, 3);
    case "lb":
    case "oz":
    case "mm":
    default:
      return n;
  }
}

function round(n: number, d = 2) {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}
// <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
