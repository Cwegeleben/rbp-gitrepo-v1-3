/* <!-- BEGIN RBP GENERATED: storefront-builder-m1-v1-0 --> */
import { list, save as saveBuild, load as loadBuild, remove as removeBuild, rename as renameBuild } from './utils/storage';
import { get, set } from './state';

export function mountSavedBuildsRail(host: HTMLElement){
  const root = document.createElement('div');
  root.className = 'rbp-rail';
  const title = document.createElement('div');
  title.className = 'rbp-rail-title';
  title.textContent = 'Saved Builds';
  const pills = document.createElement('div');
  pills.className = 'rbp-rail-pills';
  const saveBtn = document.createElement('button');
  saveBtn.className = 'rbp-btn small';
  saveBtn.textContent = '+ Save current';
  saveBtn.addEventListener('click', ()=>{
    const name = prompt('Name this build:', 'My Build');
    if (!name) return;
    const { tenantId, slots } = get();
    saveBuild(tenantId, name, slots);
    renderPills();
  });
  root.appendChild(title); root.appendChild(pills); root.appendChild(saveBtn);
  host.appendChild(root);

  function renderPills(){
    pills.innerHTML = '';
    const { tenantId } = get();
    for (const e of list(tenantId)){
      const pill = document.createElement('button');
      pill.className = 'rbp-pill';
      pill.textContent = e.name;
      pill.title = 'Load';
      pill.addEventListener('click', ()=>{
        const hit = loadBuild(tenantId, e.id);
        if (hit){ set({ slots: { ...get().slots, ...hit.slots } }); }
      });
      const menu = document.createElement('span');
      menu.className = 'rbp-pill-menu';
      menu.textContent = '⋯';
      menu.title = 'More';
      menu.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        const action = prompt('Type: load, rename, delete', 'load');
        if (action === 'delete') { removeBuild(tenantId, e.id); renderPills(); }
        else if (action === 'rename') { const n = prompt('New name', e.name) || e.name; renameBuild(tenantId, e.id, n); renderPills(); }
        else if (action === 'load') { const hit = loadBuild(tenantId, e.id); if (hit) set({ slots: { ...get().slots, ...hit.slots } }); }
      });
      pill.appendChild(menu);
      pills.appendChild(pill);
    }
  }
  renderPills();
}
/* <!-- END RBP GENERATED: storefront-builder-m1-v1-0 --> */
