import { readFile } from "node:fs/promises";
import { join } from "node:path";
export async function loader() {
  const raw = await readFile(join(process.cwd(), "src", "config", "registry.json"), "utf8");
  return new Response(raw, { headers: { "content-type": "application/json" } });
}
