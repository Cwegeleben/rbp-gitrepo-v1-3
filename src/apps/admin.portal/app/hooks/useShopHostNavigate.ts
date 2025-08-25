// <!-- BEGIN RBP GENERATED: admin-host-nav-v2 -->
import { useLocation, useNavigate } from 'react-router-dom';
import { withShopHost, getParam } from '../utils/url';

export function useShopHostNavigate() {
  const nav = useNavigate();
  const { search } = useLocation();
  const shop = getParam(search, 'shop');
  const host = getParam(search, 'host');
  return (to: string, opts?: { replace?: boolean }) => {
    nav(withShopHost(to, { search, shop, host, ensureEmbedded: true }), { replace: opts?.replace });
  };
}
// <!-- END RBP GENERATED: admin-host-nav-v2 -->
