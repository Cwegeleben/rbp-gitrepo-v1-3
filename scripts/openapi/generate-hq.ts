// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

const root = process.cwd();
const specPath = path.join(root, 'docs/openapi/hq.v0.yml');
const outDir = path.join(root, 'src/apps/hq.api/types');
const outFile = path.join(outDir, 'hq.ts');

function run() {
  const yml = fs.readFileSync(specPath, 'utf8');
  const doc = yaml.parse(yml);
  const schemas = doc?.components?.schemas ?? {};

  // Minimal, hand-rolled generator to TS types
  const header = `// AUTO-GENERATED from docs/openapi/hq.v0.yml. Do not edit by hand.\n`;
  const sentinelBegin = `// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->\n`;
  const sentinelEnd = `// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->\n`;

  const lines: string[] = [];
  lines.push(header);
  lines.push(sentinelBegin);
  for (const [name, schema] of Object.entries<any>(schemas)) {
    lines.push(renderType(name, schema));
  }
  // Common response unions
  lines.push('export type ModulesResponse = Module[];');
  lines.push('export type TenantModulesResponse = TenantModules;');
  lines.push('export type CatalogMasterResponse = CatalogMaster;');
  lines.push('export type PricingBookResponse = PricingBook;');
  lines.push('export type UsageResponse = Usage;');
  lines.push(sentinelEnd);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, lines.join('\n') + '\n', 'utf8');
  // eslint-disable-next-line no-console
  console.info(`[openapi:hq] wrote ${path.relative(root, outFile)}`);
}

function renderType(name: string, schema: any): string {
  if (schema.type === 'object') {
    const req: string[] = schema.required || [];
    const props: string[] = [];
    for (const [pname, pschema] of Object.entries<any>(schema.properties || {})) {
      const optional = req.includes(pname) ? '' : '?';
      props.push(`  ${pname}${optional}: ${tsType(pschema)};`);
    }
    return `export interface ${name} {\n${props.join('\n')}\n}`;
  }
  if (schema.type === 'array') {
    return `export type ${name} = ${tsType(schema)};`;
  }
  return `export type ${name} = any;`;
}

function tsType(schema: any): string {
  if (!schema) return 'any';
  if (schema.$ref) {
    const ref = String(schema.$ref);
    const m = /#\/components\/schemas\/(.+)$/.exec(ref);
    return m ? m[1] : 'any';
  }
  switch (schema.type) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'integer': return 'number';
    case 'boolean': return 'boolean';
    case 'array': return `${tsType(schema.items)}[]`;
    case 'object':
      if (schema.additionalProperties) {
        return `{ [key: string]: ${tsType(schema.additionalProperties)} }`;
      }
      const entries: string[] = [];
      const req: string[] = schema.required || [];
      for (const [pname, pschema] of Object.entries<any>(schema.properties || {})) {
        const optional = req.includes(pname) ? '' : '?';
        entries.push(`  ${pname}${optional}: ${tsType(pschema)};`);
      }
      return `{\n${entries.join('\n')}\n}`;
    default: return 'any';
  }
}

run();
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
