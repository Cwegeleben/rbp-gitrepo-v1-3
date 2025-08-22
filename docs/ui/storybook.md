<!-- BEGIN RBP GENERATED: docs-storybook -->
# Storybook for Tenant Admin Components

Build and test Tenant Admin UI in isolation, and use it as a living catalog for design and product reviews.

## Structure

- Stories live next to components: `src/apps/admin.portal/app/components/*.stories.tsx`.
- Keep `.storybook/preview.tsx` minimal: provide only global controls (no heavy providers). Use per-story decorators when you need routing or tenant context.
- Prefer per-story decorators for `MemoryRouter` and `TenantContext` as needed instead of global providers.

## Required stories per component

- Default/Success
- Loading
- Error
- Empty (if applicable)
- Interactive/failure (e.g., ToggleCell rollback with `aria-live`)

## A11y & UX

- Name interactive controls; ensure accessible names via labels and `aria-*`.
- Provide `role="status"` or `aria-live` for async state changes.
- Manage focus: opening a panel moves focus inside; closing restores focus to the trigger.

## Run commands

Use the repo scripts as-is:

```sh
pnpm storybook
pnpm build-storybook
```

Notes:
- Default dev port is 6006 (from the `storybook` script).

## Common patterns (snippets)

### Minimal `.storybook/preview.tsx` with a global toolbar control

```tsx
// .storybook/preview.tsx
import type { Preview } from '@storybook/react'

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
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/ },
    },
  },
}

export default preview
```

### ErrorState example

```tsx
// src/apps/admin.portal/app/components/ErrorState.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import ErrorState from 'src/apps/admin.portal/ErrorState'

const meta: Meta<typeof ErrorState> = {
  title: 'Admin/ErrorState',
  component: ErrorState,
}
export default meta

type Story = StoryObj<typeof ErrorState>

export const Default: Story = {
  args: { title: 'Something went wrong', hint: 'Try again in a moment' },
}
```

### LoadingSkeleton example

```tsx
// src/apps/admin.portal/app/components/LoadingSkeleton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import LoadingSkeleton from 'src/apps/admin.portal/LoadingSkeleton'

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Admin/LoadingSkeleton',
  component: LoadingSkeleton,
}
export default meta

export const Default: StoryObj<typeof LoadingSkeleton> = {}
```

### ToggleCell with failure + rollback and aria-live

```tsx
// src/apps/admin.portal/app/components/ToggleCell.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import ToggleCell from 'src/apps/admin.portal/app/components/ToggleCell'

function Demo({ fail = false }) {
  const [on, setOn] = useState(false)
  const [msg, setMsg] = useState('')
  async function onToggle(next: boolean) {
    setMsg('Saving…')
    setOn(next)
    await new Promise(r => setTimeout(r, 300))
    if (fail) {
      setMsg('Failed to save. Reverted.')
      setOn(!next)
      return
    }
    setMsg('Saved')
  }
  return (
    <div>
      <ToggleCell checked={on} onChange={onToggle} aria-label="Enable" />
      <div role="status" aria-live="polite" style={{ marginTop: 8 }}>{msg}</div>
    </div>
  )
}

const meta: Meta<typeof Demo> = { title: 'Admin/ToggleCell', component: Demo }
export default meta

export const Success: StoryObj<typeof Demo> = {}
export const FailureRollback: StoryObj<typeof Demo> = { args: { fail: true } }
```

### FilterBar with URL sync (MemoryRouter)

```tsx
// src/apps/admin.portal/app/components/FilterBar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import FilterBar from 'src/apps/admin.portal/app/components/FilterBar'

const meta: Meta<typeof FilterBar> = {
  title: 'Admin/FilterBar',
  component: FilterBar,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/catalog?q=&cursor="]}>
        <Story />
      </MemoryRouter>
    ),
  ],
}
export default meta

export const Default: StoryObj<typeof FilterBar> = {}
```

### BuildDetailPanel with 404 state

```tsx
// src/apps/admin.portal/app/components/BuildDetailPanel.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import BuildDetailPanel from 'src/apps/admin.portal/app/components/BuildDetailPanel'

const meta: Meta<typeof BuildDetailPanel> = {
  title: 'Admin/BuildDetailPanel',
  component: BuildDetailPanel,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/builds/does-not-exist"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
}
export default meta

export const NotFound: StoryObj<typeof BuildDetailPanel> = {}
```

## Review & CI

- Optional: publish Storybook using Chromatic for visual review.
- Add a CI job to `build-storybook` to catch story compilation errors.

Example GitHub Actions step:

```yaml
name: storybook-build
on:
  pull_request:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build-storybook
```

## Checklist (DoD for a new component)

- Component plus `.stories.tsx` next to it
- Stories cover loading, error, empty (or note N/A)
- A11y checked (labels, focus path, live regions)
- Optional: screenshot attached to PR
<!-- END RBP GENERATED: docs-storybook -->
