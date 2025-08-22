/*
<!-- BEGIN RBP GENERATED: tenant-admin-harden -->
*/
export const ui = {
  common: {
    loading: "Loading…",
    error: "Something went wrong.",
    prev: "Prev",
    next: "Next",
    close: "Close",
    copy: "Copy",
    copied: "Copied!",
  },
  /* <!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility --> */
  dashboard: {
    kpis: {
      builds: 'Builds',
      catalog: 'Catalog',
      pkg: 'Package',
    },
    package: {
      ok: 'OK',
      hints: (n: number) => `${n} hint${n === 1 ? '' : 's'}`,
      error: 'Error',
    },
  },
  /* <!-- END RBP GENERATED: tenant-admin-ui-visibility --> */
  catalog: {
    title: "Catalog",
    searchPlaceholder: "Search",
    vendorPlaceholder: "Vendors (comma-separated)",
    tagsPlaceholder: "Tags (comma-separated)",
  /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
  priceBandLabel: "Price Band",
  priceBandAll: "All",
  priceBandLow: "Low",
  priceBandMedium: "Medium",
  priceBandHigh: "High",
  /* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */
  /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
    enable: "Enable",
    disable: "Disable",
    clear: "Clear",
    selectedOf: (total: number) => `selected of ${total}`,
    sortedBy: (label: string) => `Sorted by ${label}`,
    bulkDone: (n: number) => `${n} updated`,
    bulkFailedSummary: (n: number) => `${n} failed, rolled back`,
    totalResults: (n: number) => `${n} results`,
    sortLabels: {
      vendor: (dir: 'asc' | 'desc') => `Vendor ${dir === 'asc' ? 'A→Z' : 'Z→A'}`,
      title: (dir: 'asc' | 'desc') => `Product ${dir === 'asc' ? 'A→Z' : 'Z→A'}`,
      priceBand: (dir: 'asc' | 'desc') => `Price ${dir === 'asc' ? 'Low→High' : 'High→Low'}`,
      enabled: (dir: 'asc' | 'desc') => `Enabled ${dir === 'asc' ? 'Off→On' : 'On→Off'}`,
    },
  /* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
    apply: "Apply",
    empty: "Nothing selected yet—use filters and enable items.",
    saving: "Saving…",
    toggleFailed: "Failed to update. Reverted.",
  },
  builds: {
    title: "Builds",
    empty: "No builds yet—come back after customers use the builder.",
    detailTitle: "Build Detail",
    notFound: "Not found",
    forbidden: "Forbidden",
    notAvailable: "Builds are not available for your plan.",
  /* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */
    duplicate: "Duplicate",
    duplicateUnavailable: "Not available on this plan/endpoints.",
    clearAll: "Clear All",
    confirmClearTitle: "Clear all items?",
    confirmClearMsg: "This will remove all items from this build.",
    importJson: "Import JSON",
    exportJson: "Export JSON",
    importApply: "Apply Import",
    importCancel: "Cancel",
    importInvalid: "Invalid import file.",
    importPreviewTitle: "Import Preview",
    moveUp: "Move up",
    moveDown: "Move down",
    saved: "Saved",
    saveFailed: "Save failed. Reverted.",
  /* <!-- BEGIN RBP GENERATED: packager-v2 --> */
  packageSummary: "Package Summary",
  subtotal: "Subtotal",
  estTax: "Est. tax",
  total: "Total",
  missingVariantHint: "Some items are missing variants:",
  /* <!-- END RBP GENERATED: packager-v2 --> */
  /* <!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility --> */
    preview: {
      title: 'Preview package',
      load: 'Loading preview…',
      loaded: 'Loaded preview',
      hintsTitle: 'Hints',
      error: 'Error loading preview',
      button: 'Preview package',
    },
  /* <!-- END RBP GENERATED: tenant-admin-ui-visibility --> */
  /* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */
  },
  settings: {
    title: "Settings",
    shopDomain: "Shop Domain",
    plan: "Plan",
    features: "Features",
    vendors: "Connected Vendors",
    noneConnected: "None connected",
    noFeatures: "No additional features enabled.",
    contact: "Contact RBP",
  },
  a11y: {
    toggle: (title: string, next: boolean) => `Toggle ${title} ${next ? 'on' : 'off'}`,
  }
} as const;
/*
<!-- END RBP GENERATED: tenant-admin-harden -->
*/
