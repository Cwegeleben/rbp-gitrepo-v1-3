/* <!-- BEGIN RBP GENERATED: storefront-builder-m2-v1-0 --> */
export type RecentItem = { id: string; title?: string; price?: number };

function k(tenantId: string|null){ return `RBP_RECENT::${tenantId||'anon'}`; }
function read(tenantId: string|null): RecentItem[]{ try{ const raw=localStorage.getItem(k(tenantId)); const arr=raw? JSON.parse(raw): []; return Array.isArray(arr)? arr: []; }catch{ return []; } }
function write(tenantId: string|null, list: RecentItem[]){ try{ localStorage.setItem(k(tenantId), JSON.stringify(list)); }catch{} }

export function pushRecent(tenantId: string|null, item: RecentItem){
  const arr = read(tenantId);
  const existing = arr.filter(x=>x.id!==item.id);
  existing.unshift({ id: item.id, title: item.title, price: item.price });
  write(tenantId, existing.slice(0,12));
}

export function listRecent(tenantId: string|null): RecentItem[]{ return read(tenantId).slice(0,12); }

export function mountRecentRail(host: HTMLElement, tenantId: string|null, onPick:(it:RecentItem)=>void){
  const rail = document.createElement('div');
  rail.className = 'rbp-rail';
  const title = document.createElement('div'); title.className = 'rbp-rail-title'; title.textContent='Recently viewed'; rail.appendChild(title);
  const pills = document.createElement('div'); pills.className = 'rbp-rail-pills'; rail.appendChild(pills);
  function draw(){
    pills.innerHTML='';
    for (const it of listRecent(tenantId)){
      const b = document.createElement('button'); b.className='rbp-pill'; b.textContent = it.title || 'Item'; b.title = 'Select'; b.addEventListener('click', ()=> onPick(it)); pills.appendChild(b);
    }
  }
  draw();
  host.appendChild(rail);
}
/* <!-- END RBP GENERATED: storefront-builder-m2-v1-0 --> */
