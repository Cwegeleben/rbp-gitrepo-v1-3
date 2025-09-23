// Gateway-local catalog helpers with env+mock fallback to avoid cross-app imports in runtime
// <!-- BEGIN RBP GENERATED: storefront-builder-m0-v1-0 -->
import path from "node:path";
import fs from "node:fs";

export const getCatalogPath = () =>
	process.env.RBP_CATALOG_PATH || path.join(process.cwd(), "config", "catalog.json");

export async function readCatalogJson(): Promise<any> {
	const p = getCatalogPath();
	try {
		const buf = await fs.promises.readFile(p, "utf8");
		return JSON.parse(buf);
	} catch {
		// Fallback to bundled mock to keep proxy routes healthy in staging
		try {
			const mock = path.join(__dirname, "catalog.mock.json");
			const buf2 = await fs.promises.readFile(mock, "utf8");
			return JSON.parse(buf2);
		} catch {
			return { products: [] };
		}
	}
}
// <!-- END RBP GENERATED: storefront-builder-m0-v1-0 -->
