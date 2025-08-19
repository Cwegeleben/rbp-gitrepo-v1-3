(async () => {
  const base = "/apps/rbp";
  try {
    const res = await fetch(`${base}/modules/registry.json`, { credentials: "include" });
    if (!res.ok) throw new Error("registry");
    const reg = await res.json();
    const src = reg?.modules?.["rbp-shell"]?.versions?.["0.1.0"]?.path;
    if (!src) { console.warn("[RBP] shell module disabled"); return; }
    const s = document.createElement("script");
    s.type = "module";
    s.src = src; // e.g. /apps/rbp/modules/rbp-shell/0.1.0/index.js
    s.onload = () => console.log("[RBP] shell module loaded via <script type=module>");
    s.onerror = (e) => console.warn("[RBP] module load error", e);
    document.head.appendChild(s);
  } catch (e) {
    console.warn("[RBP] bootstrap failed", e);
  }
})();
