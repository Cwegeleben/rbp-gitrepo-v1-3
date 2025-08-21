import { jest } from '@jest/globals';
/* <!-- BEGIN RBP GENERATED: mock-catalog-server --> */
type Catalog = {
  collections: Array<{ id: string; handle: string; title: string; productIds?: string[] }>;
  products: Array<{
    id: string; title: string; handle: string; vendor: string; price: number;
    collections: string[]; tags?: string[];
  }>;
};

// Mock getCatalogPath to avoid path dependencies
export const getCatalogPath = (): string => '/test/catalog.json';

// Mock readCatalogJson as jest.fn() to allow temporary mocking in tests
export async function readCatalogJson(): Promise<any> {
  return {
    collections: [
      { id: 'c.salmon', handle: 'salmon', title: 'Salmon', productIds: ['p1', 'p2'] },
      { id: 'c.bass', handle: 'bass', title: 'Bass', productIds: ['p3'] },
    ],
    products: [
      { id: 'p1', title: 'Pro Salmon 9ft', handle: 'pro-salmon-9', vendor: 'Prolite', price: 399, collections: ['salmon'], tags: ['featured','graphite'] },
      { id: 'p2', title: 'Salmon Ultra 10ft', handle: 'salmon-ultra-10', vendor: 'Prolite', price: 449, collections: ['salmon'], tags: ['graphite'] },
      { id: 'p3', title: 'Bass Classic 7ft', handle: 'bass-classic-7', vendor: 'RBP',    price: 199, collections: ['bass'],   tags: ['classic'] },
    ],
  };
}
/* <!-- END RBP GENERATED: mock-catalog-server --> */
