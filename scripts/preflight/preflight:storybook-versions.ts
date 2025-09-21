// <!-- BEGIN RBP GENERATED: storybook-version-pin-v1-0 -->
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const WANT = '^8.6.14';
const OVERRIDE = '8.6.14';

function* walk(dir: string): Generator<string> {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'build'].includes(ent.name)) continue;
      yield* walk(p);
    } else if (ent.isFile() && ent.name === 'package.json') {
      yield p;
    }
  }
}

const offenders: string[] = [];
for (const pkg of walk(ROOT)) {
  const json = JSON.parse(fs.readFileSync(pkg, 'utf8')) as any;
  const deps = { ...(json.dependencies||{}), ...(json.devDependencies||{}) } as Record<string,string>;
  const usedStorybookPkgs = Object.keys(deps).filter(n => n.startsWith('@storybook/') || n === 'storybook');
  for (const name of usedStorybookPkgs) {
    const spec = deps[name];
    if (spec !== WANT) offenders.push(`${pkg}: ${name}@${spec} (want ${WANT})`);
  }
  // If package.json has pnpm.overrides, ensure any overrides for used storybook packages are exactly 8.6.14
  const overrides = (json.pnpm && json.pnpm.overrides) ? json.pnpm.overrides as Record<string,string> : {};
  for (const name of usedStorybookPkgs) {
    if (name in overrides) {
      const ov = overrides[name];
      if (ov !== OVERRIDE) offenders.push(`${pkg}: override ${name}@${ov} (want ${OVERRIDE})`);
    }
  }
}

if (offenders.length) {
  console.error('Storybook version preflight failed. Expected deps to be', WANT, 'and overrides to be', OVERRIDE);
  console.error(offenders.join('\n'));
  process.exit(1);
}
console.log('preflight:storybook-versions PASS');
// <!-- END RBP GENERATED: storybook-version-pin-v1-0 -->
