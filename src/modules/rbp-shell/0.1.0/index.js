export default function init(ctx) {
  console.log("[rbp-shell] v0.1.0 loaded", ctx);
  if (typeof window !== "undefined") {
    window.__RBP_SHELL_LOADED__ = true;
  }
}
