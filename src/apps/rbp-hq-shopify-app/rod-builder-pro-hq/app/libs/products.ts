// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-v0-2 -->
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

export type ProductStub = {
  id: string;
  title: string;
  vendor?: string;
  image?: string;
  approved?: boolean;
};

const DATA_FILE = resolve(process.cwd(), "tmp/hq-products.json");

function load(): ProductStub[] {
  try {
    if (existsSync(DATA_FILE)) {
      const raw = readFileSync(DATA_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as ProductStub[];
    }
  } catch {}
  // Seed with a couple of pending items
  return [
    { id: "p-1001", title: "Graphite Spinning Rod", vendor: "Acme Co", image: "", approved: false },
    { id: "p-1002", title: "Carbon Fiber Casting Rod", vendor: "RodWorks", image: "", approved: false }
  ];
}

function save(items: ProductStub[]): void {
  mkdirSync(dirname(DATA_FILE), { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

let cache: ProductStub[] | null = null;

function getCache(): ProductStub[] {
  if (!cache) cache = load();
  return cache;
}

export function listProducts(): ProductStub[] {
  return getCache();
}

export function listApprovedProducts(): ProductStub[] {
  return getCache().filter((p) => !!p.approved);
}

export function markApproved(id: string): { ok: true; id: string } {
  const items = getCache();
  const idx = items.findIndex((p) => p.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], approved: true };
    save(items);
  }
  return { ok: true, id } as const;
}

export async function importProductsFromFile(filePath: string): Promise<ProductStub[]> {
  const abs = resolve(process.cwd(), filePath);
  const raw = readFileSync(abs, "utf8");
  let items: ProductStub[] = [];
  if (filePath.endsWith(".json")) {
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : parsed.items || [];
    items = (arr as any[]).map((r, i) => normalizeRecord(r, i));
  } else if (filePath.endsWith(".csv")) {
    items = parseCsv(raw).map((r, i) => normalizeRecord(r, i));
  } else {
    throw new Error(`Unsupported file type: ${filePath}`);
  }
  // ensure ids unique
  const seen = new Set<string>();
  items = items.map((p, i) => {
    let id = p.id || `imp-${i + 1}`;
    while (seen.has(id)) id = `${id}-${i}`;
    seen.add(id);
    return { ...p, id, approved: !!p.approved };
  });
  cache = items;
  save(items);
  return items;
}

function normalizeRecord(r: any, i: number): ProductStub {
  return {
    id: String(r.id ?? ""),
    title: String(r.title ?? r.name ?? `Imported Product ${i + 1}`),
    vendor: r.vendor ? String(r.vendor) : undefined,
    image: r.image ? String(r.image) : undefined,
    approved: !!r.approved
  };
}

function parseCsv(raw: string): any[] {
  const [headerLine, ...lines] = raw.split(/\r?\n/).filter(Boolean);
  const headers = headerLine.split(",").map((h) => h.trim());
  return lines.map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const obj: any = {};
    headers.forEach((h, idx) => (obj[h] = cols[idx] ?? ""));
    return obj;
  });
}
// <!-- END RBP GENERATED: rbp-hq-catalog-v0-2 -->
