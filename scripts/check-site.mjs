// The pull-request check of this test site: every page is a complete HTML document, every local link and
// asset points at a file in the repo, and nothing loads over plain http. Node built-ins only.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, extname } from 'node:path';

const root = process.cwd();
const skip = new Set(['.git', '.github', 'node_modules', 'scripts']);

function pages(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...pages(p));
    else if (extname(name) === '.html') out.push(p);
  }
  return out;
}

const problems = [];
const files = pages(root);
if (!files.some((f) => relative(root, f) === 'index.html')) problems.push('index.html is missing');

for (const file of files) {
  const rel = relative(root, file);
  const html = readFileSync(file, 'utf8');
  if (!/^<!doctype html>/i.test(html.trimStart())) problems.push(`${rel}: does not start with <!doctype html>`);
  if (!/<html[^>]*\blang="[a-z-]+"/i.test(html)) problems.push(`${rel}: <html> has no lang`);
  if (!/<title>[^<]+<\/title>/i.test(html)) problems.push(`${rel}: no <title>`);
  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/gi)) {
    const ref = m[1];
    if (/^http:\/\//i.test(ref)) problems.push(`${rel}: loads over plain http: ${ref}`);
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/i.test(ref)) continue;
    const path = ref.split('#')[0].split('?')[0];
    if (!path) continue;
    const target = path.startsWith('/') ? join(root, path) : join(dirname(file), path);
    if (!existsSync(target)) problems.push(`${rel}: ${ref} does not exist`);
  }
}

if (problems.length) {
  console.error(`Site check failed (${problems.length}):`);
  for (const p of problems) console.error(`- ${p}`);
  process.exit(1);
}
console.log(`Site check passed: ${files.length} pages.`);
