# Catalog Products API (v2 additions)

<!-- BEGIN RBP GENERATED: CatalogV2 -->
GET `/apps/proxy/api/catalog/products`

New optional query params (additive):
- vendor: exact or CSV; case-insensitive
- tags: CSV; case-insensitive; match if any tag overlaps
- priceBand: LT100 | 100to250 | GT250
- limit: default 20, max 100
- cursor: opaque forward-only cursor
- sort: rank | priceAsc | priceDesc | titleAsc | titleDesc (default rank)

Response additions (when any v2 param is used):
{
  "items": ProductLite[],
  "nextCursor": string | null,
  "applied": { "vendor": string[]; "tags": string[]; "priceBand?": string; "sort": string; "limit": number; }
}

Behavior:
- Ranking uses optional `config/catalog_ranking.json`. If missing, defaults are applied.
- Cache-Control: no-store on responses.
- Store-relative URLs only.
- Back-compat: if no filters are provided, returns the original array of up to 20 items like v1.

Ranking config example at `src/config/catalog_ranking.example.json`.
<!-- END RBP GENERATED: CatalogV2 -->
