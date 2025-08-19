(function(){
  const root = document.getElementById("rbp-root") || document.body;
  const wrap = document.createElement("div");
  wrap.id = "rbp-shell";
  wrap.style.padding = "12px";
  wrap.style.border = "1px solid #ddd";
  wrap.style.borderRadius = "12px";
  wrap.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  wrap.innerHTML = "<b>Rod Builder Pro</b> shell loaded (v0.1.0)";
  root.appendChild(wrap);
  console.log("[RBP] shell module loaded");
})();
