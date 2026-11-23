import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
fs.mkdirSync('test-results', { recursive: true });
const result = process.env.npm_execpath
  ? spawnSync(process.execPath, [process.env.npm_execpath, 'audit', '--json'], { encoding: 'utf8' })
  : spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['audit', '--json'], { encoding: 'utf8', shell: process.platform === 'win32' });
let audit;
try { audit = JSON.parse(result.stdout); }
catch {
  fs.writeFileSync('test-results/npm-audit.json', JSON.stringify({ error: result.stderr || 'Could not parse npm audit output.' }, null, 2));
  console.error('Dependency audit could not complete; inspect private CI artifact.');
  process.exit(1);
}
fs.writeFileSync('test-results/npm-audit.json', JSON.stringify(audit, null, 2));
const counts = audit.metadata?.vulnerabilities ?? {};
const high = Number(counts.high ?? 0) + Number(counts.critical ?? 0);
console.log('Dependency audit: ' + Number(counts.total ?? 0) + ' advisory item(s); ' + high + ' high/critical.');
if (high > 0) {
  console.error('High or critical dependency findings need review; detailed results are retained as a private artifact.');
  process.exit(1);
}
