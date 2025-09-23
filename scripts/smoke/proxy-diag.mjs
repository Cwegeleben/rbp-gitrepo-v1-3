// <!-- BEGIN RBP GENERATED: proxy-misroute-detect-v1 -->
import https from 'node:https';
import http from 'node:http';

const base = process.env.STAGING_BASE || process.argv[2];
if (!base) {
  console.error('Usage: node scripts/smoke/proxy-diag.mjs <BASE_URL>');
  process.exit(1);
}

const url = new URL('/apps/proxy/_diag', base);

function fetch(u) {
  return new Promise((resolve, reject) => {
    const isHttps = u.protocol === 'https:';
    const lib = isHttps ? https : http;
    const req = lib.request(u, { method: 'GET', headers: { 'accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

const res = await fetch(url);
try {
  const parsed = JSON.parse(res.body);
  console.log(JSON.stringify(parsed, null, 2));
} catch {
  console.log(res.body);
}
// <!-- END RBP GENERATED: proxy-misroute-detect-v1 -->
