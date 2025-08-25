// <!-- BEGIN RBP GENERATED: admin-host-nav-v2 -->
import * as React from 'react';
import { Link, useLocation, type LinkProps } from 'react-router-dom';
import { withShopHost, getParam } from '../utils/url';

export default function ShopHostLink({ to, ...rest }: LinkProps) {
  const { search } = useLocation();
  const shop = getParam(search, 'shop');
  const host = getParam(search, 'host');
  const href = withShopHost(typeof to === 'string' ? to : (to as any).pathname ?? '', {
    search,
    shop,
    host,
    ensureEmbedded: true,
  });
  return <Link to={href} {...rest} />;
}
// <!-- END RBP GENERATED: admin-host-nav-v2 -->
