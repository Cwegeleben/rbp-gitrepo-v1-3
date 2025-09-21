// <!-- BEGIN RBP GENERATED: pkg-json-sentinel-clean-v1-0 -->
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BEGIN = '<!-- BEGIN RBP GENERATED:';
const END = '<!-- END RBP GENERATED:';

function* walk(dir: string): Generator<string> {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'dist' || ent.name === 'build' || ent.name === '.copilot') continue;
      yield* walk(p);
    } else if (ent.isFile() && ent.name.endsWith('.json')) {
      yield p;
    }
  }
}

const offenders: string[] = [];
for (const file of walk(ROOT)) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes(BEGIN) || content.includes(END)) {
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(BEGIN) || line.includes(END)) {
        offenders.push(`${file}:${i + 1}: ${line.trim()}`);
      }
    }
  }
}

if (offenders.length) {
  console.error('Found JSON files containing sentinel strings. Remove them (JSON cannot contain comments):');
  console.error(offenders.join('\n'));
  process.exit(1);
}
console.log('preflight:no-json-sentinels PASS');
// <!-- END RBP GENERATED: pkg-json-sentinel-clean-v1-0 -->
