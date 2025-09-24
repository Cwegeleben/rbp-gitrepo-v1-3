declare module '@shopify/shopify-app-remix/react' {
  import * as React from 'react';
  export const AppProvider: React.ComponentType<any>;
  const _default: any;
  export default _default;
}

declare module '@shopify/app-bridge-react' {
  import * as React from 'react';
  export const NavMenu: React.ComponentType<any>;
  export const TitleBar: React.ComponentType<any>;
  export function useAppBridge(): any;
}
