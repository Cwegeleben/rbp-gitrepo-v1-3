/* <!-- BEGIN RBP GENERATED: storefront-builder-m1-v1-0 --> */
// URL-safe encode/decode for build payloads
export function encodeBuild(slots: Record<string, any>): string {
  try {
    const json = JSON.stringify(slots ?? {});
    const bytes = new TextEncoder().encode(json);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bytes).toString('base64');
    const b64url = b64.replace(/=+$/,'').replace(/\+/g,'-').replace(/\//g,'_');
    // 4KB cap
    if (b64url.length > 4096) return '';
    return b64url;
  } catch { return ''; }
}

export function decodeBuild(s: string | null): Record<string, any> | null {
  if (!s || typeof s !== 'string') return null;
  if (s.length > 4096) return null; // guard
  try {
    const b64 = s.replace(/-/g,'+').replace(/_/g,'/');
    const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
    const full = b64 + pad;
    const bin = typeof atob === 'function' ? atob(full) : Buffer.from(full, 'base64').toString('binary');
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const obj = JSON.parse(json);
    // Only allow known keys to future-proof
    const out: Record<string, any> = {};
    const allowed = ['blank','reelSeat','rearGrip','foregrip','guides','tipTop'];
    for (const k of allowed) if (k in obj) out[k] = obj[k];
    return out;
  } catch { return null; }
}
/* <!-- END RBP GENERATED: storefront-builder-m1-v1-0 --> */
