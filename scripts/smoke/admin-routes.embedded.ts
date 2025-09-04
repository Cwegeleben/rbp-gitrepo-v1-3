// <!-- BEGIN RBP GENERATED: admin-embed-fix-v3 -->
/**
 * Lightweight HTTP smoke that fetches /app routes with embedded=1 & host/shop present
 * and asserts some expected HTML markers exist.
 */
import http from 'node:http';

const PORT = Number(process.env.PORT || 51544);
const HOST = 'localhost';
const shop = process.env.SMOKE_SHOP || 'rbp-dev.myshopify.com';
const hostParam = Buffer.from(`${HOST}:${PORT}`).toString('base64');

async function fetchPath(p: string) {
  const url = `http://${HOST}:${PORT}${p}`;
  return new Promise<string>((resolve, reject) => {
    http.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    }).on('error', reject);
  });
}

(async () => {
  const paths = ['/app', '/app/catalog', '/app/builds', '/app/settings'];
  const failures: string[] = [];
  for (const base of paths) {
    const p = `${base}?embedded=1&shop=${encodeURIComponent(shop)}&host=${encodeURIComponent(hostParam)}`;
    try {
      const html = await fetchPath(p);
      const ok = /<h1>|role="main"|Polaris-Page|TitleBar/.test(html);
      if (!ok) failures.push(`${base} missing landmarks`);
    } catch (e: any) {
      failures.push(`${base} fetch failed: ${e?.message}`);
    }
  }
  if (failures.length) {
    console.error('embedded smoke failed:\n' + failures.join('\n'));
    process.exit(1);
  }
  console.log('embedded routes smoke ok');
})();
// <!-- END RBP GENERATED: admin-embed-fix-v3 -->
