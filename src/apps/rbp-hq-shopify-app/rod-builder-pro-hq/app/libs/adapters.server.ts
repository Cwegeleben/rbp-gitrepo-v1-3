// <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
import type { SupplierOverride } from "./templates.server";

export type IngestCandidate = { productTypeId: string; raw: Record<string, any> };

export interface SupplierAdapter {
  canHandle(url: string): boolean;
  fetchRaw(url: string): Promise<{ html?: string; json?: any }>; // Simplified fetcher
  extractItems(raw: { html?: string; json?: any }, override: SupplierOverride): Promise<IngestCandidate[]>;
}

export class GenericAdapter implements SupplierAdapter {
  canHandle(_url: string): boolean { return true; }
  async fetchRaw(url: string): Promise<{ html?: string; json?: any }> {
    // For v0.3 we avoid external fetch for ToS; expect caller to provide data or use file upload.
    // If URL fetch is allowed in override, attempt fetch with timeout.
    return { html: undefined, json: { url } };
  }
  async extractItems(raw: { html?: string; json?: any }, override: SupplierOverride): Promise<IngestCandidate[]> {
    const out: IngestCandidate[] = [];
    const j = raw.json;
    if (j && typeof j === "object") {
      if (Array.isArray(j)) {
        j.forEach((r) => out.push({ productTypeId: override.productTypeId, raw: r }));
      } else if (j.items && Array.isArray(j.items)) {
        j.items.forEach((r: any) => out.push({ productTypeId: override.productTypeId, raw: r }));
      } else {
        out.push({ productTypeId: override.productTypeId, raw: j });
      }
    }
    return out;
  }
}

export const adapters: SupplierAdapter[] = [new GenericAdapter()];
// <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
