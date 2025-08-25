<!-- BEGIN RBP GENERATED: qa-validate-v1 -->
# QA Validation: rbp-package

## Commands

- Run rbp-package tests only:
  - pnpm test:rbp-package
- Run full test suite 3× (fail fast on any flake):
  - pnpm test:full:3x
- Storybook (visual smoke on five stories):
  - pnpm storybook -p 6007

## Verify in Storybook (rbp-package)

- EmptyBuild: CTA disabled; no totals/hints.
- SuccessWithCart: totals visible; Go to Cart enabled; Copy JSON present.
- SuccessNoCartWithHints: hints listed; Go to Cart disabled.
- NetworkError: toast/message shown; retry succeeds.
- KeyboardOnly: tab order reaches CTA, then Go to Cart/Copy JSON post-package.

## Triage Tips

- Use presence → enabled waits (findByRole + waitFor(() => toBeEnabled())).
- Verify dry-run vs final packaging mocks (X-RBP-Dry-Run header).
- Prefer RTL queries (findByRole, getByRole) over querySelector.
- Use aria-live text for status asserts to avoid duplicate text ambiguity.

_No production behavior changes included._
<!-- END RBP GENERATED: qa-validate-v1 -->
