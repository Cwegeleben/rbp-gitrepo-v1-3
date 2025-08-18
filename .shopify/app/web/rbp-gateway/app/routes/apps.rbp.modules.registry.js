import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function loader() {
  const root = process.cwd();
  const regPath = join(root, "src", "config", "registry.json");
  const raw = await readFile(regPath, "utf8");
  return new Response(raw, { headers: { "content-type": "application/json" } });
}
