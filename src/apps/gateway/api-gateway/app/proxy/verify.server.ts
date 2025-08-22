import crypto from "node:crypto";

export type VerifyResult = {
	ok: boolean;
	reason?: string;
};

export type TenantResult = {
	tenant: string;
	verified: boolean;
	reason?: string;
};

function normalizeShop(shop?: string | null): string | null {
	if (!shop) return null;
	const s = shop.trim().toLowerCase();
	return s.endsWith(".myshopify.com") ? s : `${s}.myshopify.com`;
}

function getSecret(): string | null {
	const s = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_API_SECRET_KEY || null;
	return s && s.length > 0 ? s : null;
}

function timingSafeEq(a: string, b: string): boolean {
	try {
		const ab = Buffer.from(a, "hex");
		const bb = Buffer.from(b, "hex");
		if (ab.length !== bb.length) return false;
		return crypto.timingSafeEqual(ab, bb);
	} catch {
		return false;
	}
}

function buildBaseFromUrl(url: URL): string {
	// Only include pathname + serialized query WITHOUT signature param, preserving order
	const qp = new URLSearchParams();
	// Preserve incoming order
	for (const [k, v] of url.searchParams.entries()) {
		if (k === "signature") continue;
		qp.append(k, v);
	}
	const q = qp.toString();
	return q ? `${url.pathname}?${q}` : url.pathname;
}

export function verifyProxyRequest(request: Request): VerifyResult {
	try {
		// Local/dev bypass for tooling and tests when explicitly enabled
		if (process.env.RBP_PROXY_HMAC_BYPASS === "1") {
			return { ok: true, reason: "bypass" };
		}

		const secret = getSecret();
		if (!secret) return { ok: false, reason: "missing_secret" };

		const url = new URL(request.url);
		if (!url.pathname.startsWith("/apps/proxy")) return { ok: false, reason: "not_proxy_path" };

		const sig = url.searchParams.get("signature");
		if (!sig) return { ok: false, reason: "missing_signature" };

		const base = buildBaseFromUrl(url);
		const computed = crypto.createHmac("sha256", secret).update(base).digest("hex");

		if (!timingSafeEq(sig, computed)) {
			return { ok: false, reason: "bad_signature" };
		}

		// Optional: timestamp skew enforcement if present and configured
		const requireTs = process.env.RBP_PROXY_HMAC_REQUIRE_TS === "1";
		const tsParam = url.searchParams.get("ts");
		if (requireTs) {
			if (!tsParam) return { ok: false, reason: "missing_ts" };
		}
		if (tsParam) {
			const skewSec = Number(process.env.RBP_PROXY_HMAC_MAX_SKEW_SECONDS ?? 300);
			const now = Math.floor(Date.now() / 1000);
			const ts = Number(tsParam);
			if (!Number.isFinite(ts)) return { ok: false, reason: "invalid_ts" };
			if (Math.abs(now - ts) > Math.max(0, skewSec)) return { ok: false, reason: "ts_skew" };
		}

		return { ok: true };
	} catch (e) {
		return { ok: false, reason: "error" };
	}
}

export function getTenantFromRequest(request: Request): TenantResult {
	// Respect explicit local override first
	const force = process.env.RBP_TENANT_FORCE?.trim();
	if (force) {
		const tenant = normalizeShop(force)!;
		return { tenant, verified: true, reason: "forced" };
	}

	const url = new URL(request.url);
	const shopQ = normalizeShop(url.searchParams.get("shop"));
	const hdr = normalizeShop(request.headers.get("x-shopify-shop-domain"));
	const fallback = normalizeShop(process.env.RBP_SHOP_DOMAIN) || "demo.myshopify.com";

	const verify = verifyProxyRequest(request);
	const tenant = shopQ || hdr || fallback!;
	return { tenant, verified: verify.ok, reason: verify.reason };
}

export async function enforce(request: Request): Promise<Response | null> {
	const v = verifyProxyRequest(request);
	if (v.ok) return null;
	return new Response(
		JSON.stringify({ ok: false, code: "UNAUTHORIZED_PROXY_REQUEST", reason: v.reason }),
		{ status: 401, headers: { "content-type": "application/json", "cache-control": "no-store" } }
	);
}

