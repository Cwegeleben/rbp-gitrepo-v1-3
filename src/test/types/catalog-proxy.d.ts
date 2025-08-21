/* <!-- BEGIN RBP GENERATED: dts-proxy-catalog --> */
declare module '../proxy/catalog.server' {
  export function readCatalogJson(): Promise<any>;
  export type Catalog = {
    collections: Array<{ id: string; handle: string; title: string; productIds?: string[] }>;
    products: Array<{
      id: string; title: string; handle: string; vendor: string; price: number;
      collections: string[]; tags?: string[];
    }>;
  };
  export function getCatalogPath(): string;
}
declare module '../../proxy/catalog.server' {
  export type Catalog = {
    collections: Array<{ id: string; handle: string; title: string; productIds?: string[] }>;
    products: Array<{
      id: string; title: string; handle: string; vendor: string; price: number;
      collections: string[]; tags?: string[];
    }>;
  };
  export function readCatalogJson(): Promise<Catalog>;
  export function getCatalogPath(): string;
}
declare module '*proxy/catalog.server' {
  export type Catalog = {
    collections: Array<{ id: string; handle: string; title: string; productIds?: string[] }>;
    products: Array<{
      id: string; title: string; handle: string; vendor: string; price: number;
      collections: string[]; tags?: string[];
    }>;
  };
  export function readCatalogJson(): Promise<Catalog>;
  export function getCatalogPath(): string;
}
/* <!-- END RBP GENERATED: dts-proxy-catalog --> */
