// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
export type Builtin = { id:string; title:string; subtitle?:string; tags?:string[]; group?:string; shortcut?:string; exec:{ type:'event'|'url', value:string, payload?:any } };

export function builtins(): Builtin[] {
  return [
    { id: 'open-builds-gallery', title: 'Open Builds Gallery', group: 'Navigation', exec: { type: 'event', value: 'rbp:builds:gallery:open' } },
    { id: 'open-templates', title: 'Open Templates', group: 'Navigation', exec: { type: 'event', value: 'rbp:templates:open' } },
    { id: 'open-catalog', title: 'Open Catalog', group: 'Navigation', exec: { type: 'event', value: 'rbp:catalog:open' } },
    { id: 'package-build', title: 'Package Build', group: 'Builds', exec: { type: 'event', value: 'rbp:package:open' } },
    { id: 'open-cart-drawer', title: 'Open Cart Drawer', group: 'Cart', exec: { type: 'event', value: 'rbp:cart:open' } },
    { id: 'share-active-build', title: 'Share Active Build', group: 'Builds', exec: { type: 'event', value: 'rbp:share:open' } },
    { id: 'new-build', title: 'New Build', group: 'Builds', exec: { type: 'event', value: 'rbp:build:new' } },
  ];
}
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
