// <!-- BEGIN RBP GENERATED: proxy-registry-shell-v1-1 -->
import type { LoaderFunctionArgs } from "@remix-run/node";
import { shouldEnforceProxySignature, verifyShopifyProxySignature } from "../utils/appProxy";
import { getProxyDiag } from "../utils/getProxyDiag";

const VERSION = "0.1.0";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const version = String(params.version || "");

  // Enforce Shopify proxy signature in production
  if (shouldEnforceProxySignature()) {
    if (!verifyShopifyProxySignature(url)) {
      const d = getProxyDiag(url);
      const diagHeader = `p=${d.path};b=${d.bypass ? 1 : 0};e=${d.enforce ? 1 : 0};sp=${d.signaturePresent ? 1 : 0};sv=${d.signatureValid ? 1 : 0};s=${d.secretUsed === "SHOPIFY_API_SECRET" ? "API" : d.secretUsed === "PROXY_HMAC_SECRET" ? "FALLBACK" : "NONE"}`;
      return new Response("unauthorized", {
        status: 401,
        headers: {
          "cache-control": "no-store",
          "content-type": "text/plain; charset=utf-8",
          "X-RBP-Proxy": "fail",
          "X-RBP-Proxy-Diag": diagHeader,
        },
      });
    }
  }

  if (version !== VERSION) {
    const d = getProxyDiag(url);
    const diagHeader = `p=${d.path};ver=${encodeURIComponent(version)};expected=${VERSION}`;
    return new Response("not found", {
      status: 404,
      headers: {
        "cache-control": "no-store",
        "content-type": "text/plain; charset=utf-8",
        "X-RBP-Proxy": "ok",
        "X-RBP-Proxy-Diag": diagHeader,
      },
    });
  }

  // Minimal ESM shell module body (attached to window.RBP.shell)
  const body = `// ESM module: rbp-shell ${VERSION}\n` +
  `// exports nothing; just attaches a shell to window for bootstrap compatibility.\n` +
  `(function(){\n` +
  `  const api = {\n` +
  `    mount(host){\n` +
  `      const el = document.createElement('div');\n` +
  `      el.id = 'rbp-shell';\n` +
  `      el.style.padding = '12px';\n` +
  `      el.style.border = '1px solid #e5e7eb';\n` +
  `      el.style.borderRadius = '10px';\n` +
  `      el.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';\n` +
  `      el.innerHTML = \`\n` +
  "        <div style=\"display:flex;align-items:center;gap:8px;margin-bottom:8px;\">\n" +
  "          <strong>Rod Builder Pro</strong><span style=\"opacity:.6;\">(Storefront Shell)</span>\n" +
  "        </div>\n" +
  "        <div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;\">\n" +
  "          <div style=\"border:1px solid #e5e7eb;padding:10px;border-radius:8px;\">\n" +
  "            <div style=\"font-weight:600;margin-bottom:6px;\">Start a Build</div>\n" +
  "            <div style=\"font-size:14px;opacity:.8;\">Pick blank, seat, grips, guides.</div>\n" +
  "            <button id=\"rbp-start-build\" style=\"margin-top:8px;padding:8px 10px;border-radius:8px;border:1px solid #111;\">Open Builder</button>\n" +
  "          </div>\n" +
  "          <div style=\"border:1px solid #e5e7eb;padding:10px;border-radius:8px;\">\n" +
  "            <div style=\"font-weight:600;margin-bottom:6px;\">Browse Parts</div>\n" +
  "            <div style=\"font-size:14px;opacity:.8;\">See catalog by type.</div>\n" +
  "            <button id=\"rbp-browse\" style=\"margin-top:8px;padding:8px 10px;border-radius:8px;border:1px solid #111;\">Open Catalog</button>\n" +
  "          </div>\n" +
  "        </div>\n" +
  "      \`;\n" +
  `      host.appendChild(el);\n` +
  `      // wire simple clicks (no SPA dependency):\n` +
  `      const go = (path)=>{ try { window.location.href = path; } catch {} };\n` +
  `      el.querySelector('#rbp-start-build')?.addEventListener('click', ()=>go('/apps/proxy?view=builder'));\n` +
  `      el.querySelector('#rbp-browse')?.addEventListener('click', ()=>go('/apps/proxy?view=catalog'));\n` +
  `    },\n` +
  `    unmount(){\n` +
  `      const el = document.getElementById('rbp-shell');\n` +
  `      if (el && el.parentNode) el.parentNode.removeChild(el);\n` +
  `    }\n` +
  `  };\n` +
  `  // @ts-ignore\n` +
  `  window.RBP = window.RBP || {};\n` +
  `  // @ts-ignore\n` +
  `  window.RBP.shell = api;\n` +
  `})();\n`;

  const d = getProxyDiag(url);
  const diagHeader = `p=${d.path};b=${d.bypass ? 1 : 0};e=${d.enforce ? 1 : 0};sp=${d.signaturePresent ? 1 : 0};sv=${d.signatureValid ? 1 : 0};s=${d.secretUsed === "SHOPIFY_API_SECRET" ? "API" : d.secretUsed === "PROXY_HMAC_SECRET" ? "FALLBACK" : "NONE"}`;
  return new Response(body, {
    headers: {
      "cache-control": "no-store",
      "content-type": "text/javascript; charset=utf-8",
      "X-RBP-Proxy": "ok",
      "X-RBP-Proxy-Diag": diagHeader,
    },
  });
}
// <!-- END RBP GENERATED: proxy-registry-shell-v1-1 -->
