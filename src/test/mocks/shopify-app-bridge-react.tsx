// Minimal mock for @shopify/app-bridge-react used in tests
import * as React from 'react';

export const NavMenu: React.FC<{ children?: React.ReactNode }> = ({ children }) => <nav data-testid="ab-nav">{children}</nav>;
export const TitleBar: React.FC<{ title?: string; children?: React.ReactNode }> = ({ children }) => <div data-testid="ab-titlebar">{children}</div>;
export const useAppBridge = () => ({}) as any;

export default { NavMenu, TitleBar, useAppBridge };
