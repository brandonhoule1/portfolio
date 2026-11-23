import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist', 'test-results', 'playwright-report'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.mjs') || entry.name.endsWith('.html')) files.push(file);
  }
}
for (const dir of ['src', 'scripts', 'public']) walk(path.join(root, dir));
const checks = [[/\beval\s*\(/, 'Avoid dynamic code evaluation; use explicit data handling.'], [/new\s+Function\s*\(/, 'Avoid dynamic function construction; use explicit functions.'], [/innerHTML\s*=/, 'Prefer textContent or escaped rendering for untrusted values.']];
const findings = [];
for (const file of files) for (const [pattern, suggestion] of checks) if (pattern.test(fs.readFileSync(file, 'utf8'))) findings.push({ file: path.relative(root, file), suggestion });
if (findings.length) { console.error('Source review found ' + findings.length + ' item(s):'); for (const item of findings) console.error(item.file + ': ' + item.suggestion); process.exitCode = 1; }
else console.log('Source review passed (' + files.length + ' source files checked); no high-risk dynamic rendering patterns found.');
