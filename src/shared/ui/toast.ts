// <!-- BEGIN RBP GENERATED: BuildsQoL -->
type Kind = 'success' | 'error' | 'info';

function ensureHost(): HTMLElement {
  let el = document.getElementById('rbp-toast-host');
  if (!el) {
    el = document.createElement('div');
    el.id = 'rbp-toast-host';
    el.style.position = 'fixed';
    el.style.top = '16px';
    el.style.right = '16px';
    el.style.zIndex = '9999';
    document.body.appendChild(el);
  }
  return el;
}

export function toast(kind: Kind, text: string, ms = 3500) {
  const host = ensureHost();
  const card = document.createElement('div');
  card.style.marginBottom = '8px';
  card.style.padding = '10px 12px';
  card.style.background = '#fff';
  card.style.border = '1px solid #ddd';
  card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
  card.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  card.textContent = `[${kind}] ${text}`;
  host.appendChild(card);
  setTimeout(() => {
    if (card.parentElement === host) host.removeChild(card);
  }, ms);
}
// <!-- END RBP GENERATED: BuildsQoL -->
