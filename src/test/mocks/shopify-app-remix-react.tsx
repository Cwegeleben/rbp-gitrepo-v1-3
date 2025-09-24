// Minimal mock for @shopify/shopify-app-remix/react used in tests
import * as React from 'react';

export const AppProvider: React.FC<{ apiKey?: string; isEmbeddedApp?: boolean; children?: React.ReactNode }>
  = ({ children }) => <>{children}</>;

export default { AppProvider };
