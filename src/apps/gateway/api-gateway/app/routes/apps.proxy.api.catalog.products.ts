import { json } from "@remix-run/node";
import { enforce } from "../proxy/verify.server";
import { readCatalogJson } from "../proxy/catalog.server";
import { loadRankingConfig, scoreProduct } from "../proxy/ranking.server";
export const loader = async ({ request }: { request: Request }) => {
	const block = await enforce(request);
	if (block) return block;
	// <!-- BEGIN RBP GENERATED: CatalogV2 -->
	const url = new URL(request.url);
	const qp = url.searchParams;

	// Parse v2 params (all optional)
	const vendorQ = (qp.get("vendor") ?? "")
		.split(/[,]/)
		.map((s) => s.trim())
		.filter(Boolean)
		.map((s) => s.toLowerCase());
	const tagsQ = (qp.get("tags") ?? "")
		.split(/[,]/)
		.map((s) => s.trim())
		.filter(Boolean)
		.map((s) => s.toLowerCase());
	const priceBandQ = qp.get("priceBand") ?? undefined; // LT100 | 100to250 | GT250
	const sortQ = (qp.get("sort") ?? "rank").toString(); // rank | priceAsc | priceDesc | titleAsc | titleDesc
	const limitRaw = Number(qp.get("limit") ?? 20);
	const cursorQ = qp.get("cursor") ?? undefined;

	// Back-compat legacy params still supported (additive only)
	const legacyCollection = qp.get("collection") ?? undefined;
	const legacyTagParams = qp.getAll("tag").map((t) => t.toLowerCase());
	const legacyVendor = (qp.get("vendor") ?? "").toLowerCase();
	const legacyPriceMin = qp.get("priceMin") ? Number(qp.get("priceMin")) : undefined;
	const legacyPriceMax = qp.get("priceMax") ? Number(qp.get("priceMax")) : undefined;

	// Validation and normalization
	const limit = Math.max(1, Math.min(100, isNaN(limitRaw) ? 20 : limitRaw));
	const validSort = new Set(["rank", "priceAsc", "priceDesc", "titleAsc", "titleDesc"]);
	const sort = validSort.has(sortQ) ? (sortQ as any) : "rank";
	const validBands = new Set(["LT100", "100to250", "GT250"]);
	const priceBand = priceBandQ && validBands.has(priceBandQ) ? (priceBandQ as any) : undefined;

	// Load data
	let data: any;
	try {
		data = await readCatalogJson();
	} catch (e: any) {
		console.error("catalog route error:", e);
		return json({ error: "INTERNAL", message: e?.message ?? "Failed to read catalog.json" }, {
			status: 500,
			headers: { "content-type": "application/json", "Cache-Control": "no-store" },
		});
	}

	type ProductLite = {
		id: string;
		title: string;
		handle: string;
		vendor: string;
		price: number;
		collections: string[];
		tags: string[];
		images?: string[];
	};

	const products: ProductLite[] = Array.isArray(data.products)
		? data.products.map((p: any) => ({
				id: typeof p.id === "string" || typeof p.id === "number" ? String(p.id) : "",
				title: typeof p.title === "string" ? p.title : "",
				handle: typeof p.handle === "string" ? p.handle : "",
				vendor: typeof p.vendor === "string" ? p.vendor : "",
				price: typeof p.price === "number" ? p.price : 0,
				collections: Array.isArray(p.collections) ? p.collections.map(String) : [],
				tags: Array.isArray(p.tags) ? p.tags.map((t: any) => String(t)) : [],
				images: Array.isArray(p.images) ? p.images.map(String) : undefined,
			}))
		: [];

	// Apply filters
	const applied = {
		vendor: vendorQ.filter(Boolean),
		tags: [...new Set([...tagsQ, ...legacyTagParams])].filter(Boolean),
		priceBand: priceBand as undefined | "LT100" | "100to250" | "GT250",
		sort,
		limit,
	};

	const vendorSet = new Set(applied.vendor);
	const tagsSet = new Set(applied.tags);
	const priceBandMatch = (price: number) => {
		if (!priceBand) return true;
		if (priceBand === "LT100") return price < 100;
		if (priceBand === "100to250") return price >= 100 && price <= 250;
		if (priceBand === "GT250") return price > 250;
		return true;
	};

	let filtered = products.filter((p) => {
		const pVendor = (p.vendor ?? "").toLowerCase();
		const pTags = (p.tags ?? []).map((t) => String(t).toLowerCase());

		// vendor: exact match on any provided vendor
		const vendorOk = vendorSet.size === 0 ? true : vendorSet.has(pVendor);
		// tags: match if any tag overlaps
		const tagsOk = tagsSet.size === 0 ? true : pTags.some((t) => tagsSet.has(t));
		// price band
		const priceOk = priceBandMatch(p.price ?? 0);
		// legacy single vendor and tag-all filter remain additive
		const legacyVendorOk = !legacyVendor || legacyVendor === pVendor;
		const legacyTagsAllOk = legacyTagParams.length === 0 || legacyTagParams.every((t) => pTags.includes(t));
		// legacy collection filter
		const legacyCollectionOk = !legacyCollection || (p.collections ?? []).map(String).includes(String(legacyCollection));
		// legacy price min/max
		const legacyPriceMinOk = legacyPriceMin === undefined || (p.price ?? 0) >= legacyPriceMin;
		const legacyPriceMaxOk = legacyPriceMax === undefined || (p.price ?? 0) <= legacyPriceMax;

		return vendorOk && tagsOk && priceOk && legacyVendorOk && legacyTagsAllOk && legacyCollectionOk && legacyPriceMinOk && legacyPriceMaxOk;
	});

	// Ranking and sorting
	const ranking = await loadRankingConfig();
	const withScore = filtered.map((p) => ({
		p,
		score: scoreProduct(p, ranking, { tagsSet }),
	}));

	let sorted: ProductLite[];
	switch (sort) {
		case "priceAsc":
			sorted = withScore.sort((a, b) => (a.p.price ?? 0) - (b.p.price ?? 0)).map((x) => x.p);
			break;
		case "priceDesc":
			sorted = withScore.sort((a, b) => (b.p.price ?? 0) - (a.p.price ?? 0)).map((x) => x.p);
			break;
		case "titleAsc":
			sorted = withScore.sort((a, b) => (a.p.title ?? "").localeCompare(b.p.title ?? "")).map((x) => x.p);
			break;
		case "titleDesc":
			sorted = withScore.sort((a, b) => (b.p.title ?? "").localeCompare(a.p.title ?? "")).map((x) => x.p);
			break;
		case "rank":
		default:
			sorted = withScore
				.sort((a, b) => {
					if (b.score !== a.score) return b.score - a.score;
					return (a.p.title ?? "").localeCompare(b.p.title ?? "");
				})
				.map((x) => x.p);
			break;
	}

	// Forward-only cursor
	const filtersForHash = {
		vendor: applied.vendor,
		tags: applied.tags,
		priceBand: applied.priceBand ?? null,
		sort: applied.sort,
		limit: applied.limit,
	};
	const filtersHash = Buffer.from(JSON.stringify(filtersForHash)).toString("base64");
	let offset = 0;
	if (cursorQ) {
		try {
			const decoded = JSON.parse(Buffer.from(String(cursorQ), "base64").toString("utf8"));
			if (decoded && decoded.h === filtersHash && typeof decoded.o === "number" && decoded.o >= 0) {
				offset = decoded.o;
			}
		} catch {}
	}

	const slice = sorted.slice(offset, offset + limit);
	const nextOffset = offset + slice.length;
	const nextCursor = nextOffset < sorted.length ? Buffer.from(JSON.stringify({ o: nextOffset, h: filtersHash })).toString("base64") : null;

	// Back-compat: if no v2 params were provided at all, fall back to v1 behavior (array of first 20)
	const noV2Params = vendorSet.size === 0 && tagsSet.size === 0 && !priceBand && !cursorQ && sort === "rank" && limit === 20 && !legacyCollection && legacyTagParams.length === 0 && !legacyVendor && legacyPriceMin === undefined && legacyPriceMax === undefined;
	if (noV2Params) {
		return json(products.slice(0, 20), {
			headers: {
				"content-type": "application/json",
				"Cache-Control": "no-store",
			},
		});
	}

	return json(
		{
			items: slice,
			nextCursor,
			applied,
		},
		{
			headers: {
				"content-type": "application/json",
				"Cache-Control": "no-store",
			},
		}
	);
	// <!-- END RBP GENERATED: CatalogV2 -->
};
