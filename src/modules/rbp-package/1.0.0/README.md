<!-- BEGIN RBP GENERATED: package-cta-v1 -->
rbp-package v1.0.0 — Package & Cart Flow v1

This module provides a storefront panel to package the active build and go to cart with hints and totals.

- default export: function mount(rootEl, { ctx, navigate }?)
- listens to rbp:active-build, rbp:build-updated, rbp:part-selected
- uses /apps/proxy/api/checkout/package

Files:
- index.js — DOM implementation for shell loader
- components/* — TSX building blocks used in Storybook and tests
- hooks/usePackager.ts — simple fetch hook
- utils/formatTotals.ts — formatting helper
- PackagePanel.stories.tsx — mocked scenarios
- __tests__ — jest unit tests
<!-- END RBP GENERATED: package-cta-v1 -->
