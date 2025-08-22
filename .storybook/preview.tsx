/* <!-- BEGIN RBP GENERATED: tenant-admin-storybook --> */
import type { Preview } from '@storybook/react';

export const globalTypes = {
  buildsReadonly: {
    name: 'Builds Readonly',
    description: 'Enable read-only Builds section',
    defaultValue: true,
    toolbar: {
      icon: 'lock',
      items: [
        { value: true, title: 'Enabled' },
        { value: false, title: 'Hidden' },
      ],
    },
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
/* <!-- END RBP GENERATED: tenant-admin-storybook --> */
