// <!-- BEGIN RBP GENERATED: inventory-commit-phase2 -->
// Minimal structured logger with correlation id support
export function getCorrelationId(request?: Request): string {
  try {
    const h = request?.headers?.get("x-correlation-id") || request?.headers?.get("X-Request-Id");
    return h && h.trim().length > 0 ? h : randomId();
  } catch {
    return randomId();
  }
}

export function log(level: "debug" | "info" | "warn" | "error", message: string, fields: Record<string, any> = {}) {
  try {
    const base = {
      ts: new Date().toISOString(),
      level,
      msg: message,
      ...fields,
    };
    // eslint-disable-next-line no-console
    console[level === "debug" ? "log" : level](JSON.stringify(base));
  } catch {
    // ignore
  }
}
/* <!-- BEGIN RBP GENERATED: packager-v2 --> */
// Helper to attach common correlation and packager counters
export function logPackager(level: "debug" | "info" | "warn" | "error", message: string, opts: { correlationId?: string; lineCount?: number; hintCount?: number; [k: string]: any } = {}) {
  const { correlationId, lineCount, hintCount, ...rest } = opts || {};
  log(level, message, { correlationId, lineCount, hintCount, ...rest });
}
/* <!-- END RBP GENERATED: packager-v2 --> */

function randomId(): string {
  // 16-char url-safe id
  const bytes = new Uint8Array(12);
  if (typeof crypto !== "undefined" && (crypto as any).getRandomValues) {
    (crypto as any).getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Buffer.from(bytes).toString("base64url");
}
// <!-- END RBP GENERATED: inventory-commit-phase2 -->
