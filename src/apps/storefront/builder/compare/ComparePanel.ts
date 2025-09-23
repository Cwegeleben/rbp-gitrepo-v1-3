/* <!-- BEGIN RBP GENERATED: storefront-builder-m2-v1-0 --> */
import { renderCompareTable, type CompareItem } from './CompareTable';

export function mountComparePanel(host: HTMLElement, items: CompareItem[], onReplace: (item: CompareItem)=>void){
  const wrap = document.createElement('div');
  wrap.className = 'rbp-card rbp-compare-wrap';
  const h = document.createElement('div'); h.className = 'rbp-actions';
  const title = document.createElement('strong'); title.textContent = 'Compare (up to 4)';
  h.appendChild(title);
  wrap.appendChild(h);
  const table = renderCompareTable(items);
  wrap.appendChild(table);
  const actions = document.createElement('div'); actions.className = 'rbp-actions';
  const replace = document.createElement('button'); replace.className = 'rbp-btn'; replace.textContent = 'Replace selection with best match';
  replace.addEventListener('click', ()=>{ if(items[0]) onReplace(items[0]); });
  actions.appendChild(replace);
  wrap.appendChild(actions);
  host.appendChild(wrap);
}
/* <!-- END RBP GENERATED: storefront-builder-m2-v1-0 --> */
