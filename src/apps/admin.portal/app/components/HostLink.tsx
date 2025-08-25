/* <!-- BEGIN RBP GENERATED: admin-host-nav-v1 --> */
import React from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import { withHost } from '../utils/url';

export type HostLinkProps = Omit<LinkProps, 'to'> & { to: string };

const HostLink: React.FC<HostLinkProps> = ({ to, ...rest }) => {
  const loc = useLocation();
  const href = withHost(to, { search: loc.search, ensureEmbedded: true });
  return <Link {...rest} to={href} />;
};

export default HostLink;
/* <!-- END RBP GENERATED: admin-host-nav-v1 --> */
