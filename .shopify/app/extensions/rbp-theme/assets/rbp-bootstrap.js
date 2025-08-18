(async () => {
  const base = "/apps/rbp";
  try {
    const res = await fetch(`${base}/modules/registry.json`, { credentials: "include" });
    if (!res.ok) throw new Error("registry");
    const reg = await res.json();
    const shell = reg?.modules?.["rbp-shell"]?.versions?.["0.1.0"]?.path;
    if (!shell) { console.warn("[RBP] shell module disabled"); return; }
    await import(shell);
  } catch (e) {
    console.warn("[RBP] bootstrap failed", e);
  }
})();
