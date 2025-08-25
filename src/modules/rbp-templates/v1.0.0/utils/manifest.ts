// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
export type TemplateSlot = { type?: string; productId?: string; variantId?: string; qty?: number };
export type TemplateEntry = { id: string; title: string; tags?: string[]; species?: string; build?: string; notes?: string; slots?: TemplateSlot[]; image?: string; _recency?: number };
export type TemplateManifest = { version: number; templates: TemplateEntry[] };

export function normalizeManifest(input: any): TemplateManifest {
  const version = Number(input?.version ?? 1) || 1;
  const arr = Array.isArray(input?.templates) ? input.templates : [];
  const templates: TemplateEntry[] = [];
  for (const raw of arr){
    const id = typeof raw?.id === 'string' && raw.id.trim() ? raw.id.trim() : '';
    const title = typeof raw?.title === 'string' && raw.title.trim() ? raw.title.trim() : '';
    const slots = Array.isArray(raw?.slots) ? raw.slots.filter(Boolean) : [];
    if (!id || !title || slots.length === 0) continue; // require id, title, slot
    templates.push({
      id,
      title,
      tags: Array.isArray(raw?.tags) ? raw.tags.filter((t:any)=>typeof t==='string') : [],
      species: typeof raw?.species === 'string' ? raw.species : undefined,
      build: typeof raw?.build === 'string' ? raw.build : undefined,
      notes: typeof raw?.notes === 'string' ? raw.notes : undefined,
      slots: slots.map((s:any)=>({ type: s?.type, productId: s?.productId, variantId: s?.variantId, qty: typeof s?.qty==='number'?s.qty: (typeof s?.quantity==='number'?s.quantity: undefined) })),
      image: typeof raw?.image === 'string' ? raw.image : undefined,
      _recency: Number(raw?._recency ?? 0) || 0,
    });
  }
  return { version, templates };
}
// <!-- END RBP GENERATED: builds-templates-v1 -->
