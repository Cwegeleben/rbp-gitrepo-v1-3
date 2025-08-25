// <!-- BEGIN RBP GENERATED: admin-host-nav-v2 -->
import { useLocation } from 'react-router-dom';
import { getParam } from '../utils/url';

// Minimal shim for GET forms; integrate with your form library as needed.
export function useShopHostSubmit() {
  const { search } = useLocation();
  const shop = getParam(search, 'shop');
  const host = getParam(search, 'host');

  return (target: HTMLFormElement | FormData | URLSearchParams, options?: { method?: string; submit?: (body: any, opts?: any) => void }) => {
    const method = (options?.method || 'get').toLowerCase();
    if (method === 'get') {
      const params = target instanceof URLSearchParams ? target : new URLSearchParams(target as any);
      if (shop && !params.has('shop')) params.set('shop', shop);
      if (host && !params.has('host')) params.set('host', host);
      if (!params.has('embedded')) params.set('embedded', '1');
      return options?.submit ? options.submit(params, { method: 'get' }) : undefined;
    }
    return options?.submit ? options.submit(target as any, options) : undefined;
  };
}
// <!-- END RBP GENERATED: admin-host-nav-v2 -->
