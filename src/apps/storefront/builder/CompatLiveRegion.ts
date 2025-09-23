/* <!-- BEGIN RBP GENERATED: storefront-builder-m1-v1-0 --> */
import { get, subscribe } from './state';

export function mountCompatLiveRegion(host: HTMLElement){
  const box = document.createElement('div');
  box.className = 'rbp-live';
  box.setAttribute('aria-live', 'polite');
  box.setAttribute('aria-atomic', 'false');
  host.appendChild(box);

  function render(){
    const { warnings } = get();
    box.innerHTML = warnings && warnings.length ? warnings.map(w => `<div class="rbp-live-item">${w.message || String(w)}</div>`).join('') : '';
  }
  render();
  subscribe(render);
}
/* <!-- END RBP GENERATED: storefront-builder-m1-v1-0 --> */
