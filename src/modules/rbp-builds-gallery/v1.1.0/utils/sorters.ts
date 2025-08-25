// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
export function stableSort(items: any[], key: string){
  const [k, dir] = (key||'').split(':');
  const mul = dir === 'asc' ? 1 : -1;
  return items
    .map((v, i) => ({ v, i }))
    .sort((a,b) => {
      let av: any; let bv: any;
      if (k === 'name') { av = (a.v.title||'').toLowerCase(); bv = (b.v.title||'').toLowerCase(); }
      else if (k === 'updated') { av = +new Date(a.v.updatedAt||0); bv = +new Date(b.v.updatedAt||0); }
      else if (k === 'items') { const cnt = (x:any)=> Array.isArray(x.items)? x.items.reduce((n: number, it: any)=>n+Math.max(1,+it.quantity||1),0):0; av = cnt(a.v); bv = cnt(b.v); }
      else { av = a.v[k]; bv = b.v[k]; }
      if (av < bv) return -1*mul;
      if (av > bv) return 1*mul;
      return a.i - b.i;
    })
    .map(x => x.v);
}
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
