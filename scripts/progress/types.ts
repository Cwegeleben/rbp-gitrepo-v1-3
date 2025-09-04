/* <!-- BEGIN RBP GENERATED: rbp-progress-ledger-v1 --> */
/**
 * Lightweight shared types for Progress Ledger CLI tools
 */

export type TestStatus = "PASS" | "FAIL" | "N/A";

export interface ProgressEntry {
  date: string; // ISO string
  feature: string;
  change: string; // e.g., "ADD" | "CHANGE" | "FIX" | "BREAKING"
  sentinel: string; // slug to associate with sentinel blocks
  apps: string[]; // logical app/package buckets
  files: string[]; // relative file paths
  tests: TestStatus;
  preflight: TestStatus;
  notes: string; // <= 120 chars
}

export interface ScanRecord {
  sentinel: string;
  files: string[]; // relative file paths that contain the sentinel block
  firstSeenIso: string; // earliest time we observed this sentinel
  lastSeenIso: string; // latest scan timestamp
}

export interface GapItem {
  sentinel: string;
  kind: "tests" | "stories" | "preflight" | "adr";
  message: string;
  hint: string; // one-liner next BUILD prompt stub
  breaking: boolean;
}

export interface GapReport {
  generatedAt: string; // ISO
  gaps: GapItem[];
}
/* <!-- END RBP GENERATED: rbp-progress-ledger-v1 --> */
