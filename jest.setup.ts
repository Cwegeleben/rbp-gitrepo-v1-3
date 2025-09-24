/* <!-- BEGIN RBP GENERATED: jest-setup --> */
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
// Increase default async wait timeout for findBy*/waitFor to stabilize async UI
/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
configure({ asyncUtilTimeout: 3000 });
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */
// Polyfill fetch and related Web APIs for tests
import 'whatwg-fetch';
// TextEncoder/Decoder for libs that expect them (e.g., react-router v7)
import { TextEncoder, TextDecoder } from 'node:util';
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder as any;

jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
process.env.NODE_ENV = 'test';
/* <!-- END RBP GENERATED: jest-setup --> */

// Polaris depends on window.matchMedia for responsive behavior; provide a test polyfill
if (typeof window !== 'undefined' && !(window as any).matchMedia) {
	// @ts-ignore
	window.matchMedia = (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	});
}
