/*
<!-- BEGIN RBP GENERATED: registry-health-ui-v1 -->
*/
import type { Meta, StoryObj } from '@storybook/react-vite';
import RegistryHealth, { type Health } from './RegistryHealth';

const meta: Meta<typeof RegistryHealth> = {
  title: 'Admin/Dev/RegistryHealth',
  component: RegistryHealth,
};
export default meta;
type Story = StoryObj<typeof RegistryHealth>;

const healthy: Health = {
  ok: true,
  errors: [],
  modules: {
    'rbp-shell': { ok: true, default: '0.2.0', version: '0.2.0', path: '/apps/proxy/modules/rbp-shell/0.2.0/index.js', pathPrefixOk: true, sameOriginOk: true, fileExists: true },
  },
};

const wrongPrefix: Health = {
  ok: false,
  errors: [{ code: 'WRONG_PREFIX', module: 'bad', path: '/bad/modules/bad/1.0.0/index.js' }],
  modules: {
    'bad': { ok: false, default: '1.0.0', version: '1.0.0', path: '/bad/modules/bad/1.0.0/index.js', pathPrefixOk: false, sameOriginOk: true, fileExists: true },
  },
};

const crossOrigin: Health = {
  ok: false,
  errors: [{ code: 'CROSS_ORIGIN', module: 'ext', path: 'https://cdn.example.com/modules/ext/1.0.0/index.js' }],
  modules: {
    'ext': { ok: false, default: '1.0.0', version: '1.0.0', path: 'https://cdn.example.com/modules/ext/1.0.0/index.js', pathPrefixOk: false, sameOriginOk: false, fileExists: true },
  },
};

const missingFile: Health = {
  ok: false,
  errors: [{ code: 'MISSING_FILE', module: 'miss', path: '/apps/proxy/modules/miss/0.0.1/index.js' }],
  modules: {
    'miss': { ok: false, default: '0.0.1', version: '0.0.1', path: '/apps/proxy/modules/miss/0.0.1/index.js', pathPrefixOk: true, sameOriginOk: true, fileExists: false },
  },
};

const empty: Health = { ok: true, errors: [], modules: {} };

export const Healthy: Story = { args: { data: healthy } };
export const WrongPrefix: Story = { args: { data: wrongPrefix } };
export const CrossOrigin: Story = { args: { data: crossOrigin } };
export const MissingFile: Story = { args: { data: missingFile } };
export const EmptyRegistry: Story = { args: { data: empty } };
export const ErrorFetch: Story = { args: { data: { ok: false, modules: {}, errors: [{ code: 'INTERNAL', module: '-', path: '-', message: 'Failed to load' }] } } };
/*
<!-- END RBP GENERATED: registry-health-ui-v1 -->
*/
