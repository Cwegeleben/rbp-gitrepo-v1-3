/* <!-- BEGIN RBP GENERATED: storefront-builder-m2-v1-0 --> */
export type CompareField = { key: string; label: string; fmt?: (v:any)=>string };
export type CompareItem = Record<string, any> & { id: string; title?: string; price?: number };

export function renderCompareTable(items: CompareItem[], fields?: CompareField[]): HTMLElement {
  const table = document.createElement('table');
  table.className = 'rbp-compare';
  table.setAttribute('role','table');
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  const th = document.createElement('th'); th.textContent = 'Attribute'; trh.appendChild(th);
  for (const it of items.slice(0,4)){
    const c = document.createElement('th'); c.textContent = it.title || it.handle || 'Item'; c.setAttribute('scope','col'); trh.appendChild(c);
  }
  thead.appendChild(trh);
  const tbody = document.createElement('tbody');
  const autoFields = fields || inferFields(items);
  for (const f of autoFields){
    const tr = document.createElement('tr');
    const k = document.createElement('th'); k.textContent = f.label; k.setAttribute('scope','row'); tr.appendChild(k);
    for (const it of items.slice(0,4)){
      const td = document.createElement('td');
      const v = (it as any)[f.key];
      td.textContent = f.fmt ? f.fmt(v) : norm(v);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(thead); table.appendChild(tbody);
  return table;
}

function inferFields(items: CompareItem[]): CompareField[] {
  const keys = new Set<string>();
  const common = ['price','weight','length','material','model','rating'];
  for (const it of items) for (const k of Object.keys(it)) keys.add(k);
  const chosen = common.filter(k=>keys.has(k));
  return chosen.map(k=>({ key:k, label: labelize(k), fmt: k==='price'? (v)=> typeof v==='number'? `$${v.toFixed(2)}`: norm(v): undefined }));
}

function labelize(k:string){ return k.replace(/[-_]/g,' ').replace(/\b\w/g, c=>c.toUpperCase()); }
function norm(v:any){ if (v==null) return '—'; if (typeof v==='number') return String(v); if (typeof v==='boolean') return v? 'Yes':'No'; return String(v); }
/* <!-- END RBP GENERATED: storefront-builder-m2-v1-0 --> */
