// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-v0-2 -->
import { importProductsFromFile } from "../libs/products";

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: pnpm hq:import <file.json|.csv>");
    process.exit(1);
  }
  const items = await importProductsFromFile(file);
  console.log(`[HQ Import] imported ${items.length} products from ${file}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
// <!-- END RBP GENERATED: rbp-hq-catalog-v0-2 -->
