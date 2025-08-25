/* <!-- BEGIN RBP GENERATED: admin-host-nav-v1 --> */
import { useCallback } from 'react';
import { useLocation, useNavigate, To, NavigateOptions } from 'react-router-dom';
import { withHost } from '../utils/url';

export function useHostNavigate() {
  const nav = useNavigate();
  const loc = useLocation();
  return useCallback(
    (to: To, options?: NavigateOptions) => {
      const raw = typeof to === 'string' ? to : (to as any).pathname || String(to);
      const href = withHost(raw, { search: loc.search, ensureEmbedded: true });
      nav(href, options);
    },
    [nav, loc.search]
  );
}
/* <!-- END RBP GENERATED: admin-host-nav-v1 --> */
