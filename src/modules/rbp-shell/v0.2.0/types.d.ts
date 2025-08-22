// <!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
export type RbpAccessCtx = {
  tenant: { domain: string };
  plan: string;
  flags?: Record<string, boolean>;
  timestamp?: string;
};

export type RbpRegistry = {
  modules?: Record<string, {
    default?: string;
    latest?: string;
    versions?: Record<string, { path: string }>;
  }>;
};
// <!-- END RBP GENERATED: rbp-shell-mvp -->
