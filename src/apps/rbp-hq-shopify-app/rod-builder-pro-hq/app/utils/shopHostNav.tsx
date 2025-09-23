// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
import * as React from "react";
import { useLocation, Link, type LinkProps } from "@remix-run/react";

function getParam(search: string, k: string) {
  const v = new URLSearchParams(search).get(k);
  return v || undefined;
}

function withShopHost(target: string, opts: { search: string; shop?: string; host?: string; ensureEmbedded?: boolean }) {
  const url = new URL(target, "http://localhost");
  const p = new URLSearchParams(opts.search);
  if (opts.shop) url.searchParams.set("shop", opts.shop);
  if (opts.host) url.searchParams.set("host", opts.host);
  if (opts.ensureEmbedded) url.searchParams.set("embedded", "1");
  // keep any original params from target
  p.forEach((val, key) => { if (!url.searchParams.has(key)) url.searchParams.set(key, val); });
  return url.pathname + (url.search ? url.search : "");
}

export function ShopHostLink({ to, as, ...rest }: (LinkProps & { as?: 'a' }) & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { search } = useLocation();
  const shop = getParam(search, 'shop');
  const host = getParam(search, 'host');
  const raw = (typeof to === 'string' && to) || ((to as any)?.pathname ?? '');
  const target = raw || '';
  const isAbsolute = /^https?:\/\//i.test(target);
  const href = isAbsolute ? target : withShopHost(target, { search, shop, host, ensureEmbedded: true });
  if (as === 'a') {
    const { children, ...anchorRest } = rest as any;
    return <a href={href} {...anchorRest}>{children}</a>;
  }
  return <Link to={href} {...(rest as any)} />;
}
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
