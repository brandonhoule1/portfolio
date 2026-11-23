import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const npmCli = process.env.npm_execpath;
const checks = {};
function run(name, script, summary) {
  const result = npmCli
    ? spawnSync(process.execPath, [npmCli, 'run', script], { encoding: 'utf8' })
    : spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', script], { encoding: 'utf8', shell: process.platform === 'win32' });
  const output = (result.stdout ?? '') + (result.stderr ?? '');
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  const details = output.split(/\r?\n/).flatMap(line => {
    const nodeTest = line.match(/^[✔✓]\s+(.+?)\s+\([^)]*\)$/);
    if (nodeTest) return [nodeTest[1]];
    const browserTest = line.match(/^\s*ok\s+\d+.*›\s+(.+?)\s+\(\d+ms\)$/);
    return browserTest ? [browserTest[1]] : [];
  });
  const count = output.match(/# tests\s+(\d+)/)?.[1] ?? output.match(/(\d+) passed(?:\s|\()/)?.[1];
  const countedSummary = count && name.includes('tests') ? count + ' checks passed.' : summary;
  checks[name] = { status: result.status === 0 ? 'passed' : 'failed', summary: result.status === 0 ? countedSummary : 'Check failed; see private CI artifact.', details };
  return result.status === 0;
}
fs.rmSync('dist', { recursive: true, force: true });
fs.rmSync('test-results', { recursive: true, force: true });
fs.mkdirSync('test-results', { recursive: true });
// Give first-build browser tests the complete page shape without implying that
// checks have passed before they run. The final build replaces this seed.
fs.writeFileSync('public/evidence.json', JSON.stringify({
  generatedAt: null,
  revision: process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? 'local',
  checks: {
    'Unit tests': { status: 'pending', summary: 'This check has not run yet.' },
    'Integration tests': { status: 'pending', summary: 'This check has not run yet.' },
    'Playwright GUI tests': { status: 'pending', summary: 'This check has not run yet.' },
    'Single-pass performance': { status: 'pending', summary: 'This check has not run yet.' },
    'Security review': { status: 'pending', summary: 'This check has not run yet.' }
  },
  securitySuggestions: [
    'Keep direct and transitive dependencies current; review npm audit details before upgrading.',
    'Use the CI browser report and source scan to review regressions before deployment.'
  ]
}, null, 2));
const unit = run('Unit tests', 'test:unit', 'Deterministic Node unit suite passed.');
const source = run('Source security review', 'security:source', 'Static source pattern review passed.');
const deps = run('Dependency security review', 'security:deps', 'Dependency audit found no high or critical advisories.');
const built = run('Build', 'build', 'Static portfolio and evidence pages built.');
const integration = built && run('Integration tests', 'test:integration', 'Public catalog and evidence build integration passed.');
if (!built) checks['Integration tests'] = { status: 'skipped', summary: 'Build did not complete.' };
const e2e = built && run('Playwright GUI tests', 'test:e2e', 'Browser checks passed for requirements and evidence pages.');
if (!built) checks['Playwright GUI tests'] = { status: 'skipped', summary: 'Build did not complete.' };
const perf = built && run('Single-pass performance', 'test:performance', 'One browser navigation recorded; this is not a load test or benchmark.');
if (!built) checks['Single-pass performance'] = { status: 'skipped', summary: 'Build did not complete.' };
const observation = fs.existsSync('test-results/performance-observation.json') ? JSON.parse(fs.readFileSync('test-results/performance-observation.json', 'utf8')) : null;
if (observation && checks['Single-pass performance']?.status === 'passed') {
  checks['Single-pass performance'].summary = 'One pass: HTTP ' + observation.status + ', load ' + observation.loadMs + ' ms, transfer ' + observation.transferBytes + ' bytes.';
}
let audit = {};
try { audit = JSON.parse(fs.readFileSync('test-results/npm-audit.json', 'utf8')); } catch {}
const vuln = audit.metadata?.vulnerabilities ?? {};
const total = Number(vuln.total ?? 0);
const suggestions = [
  'Keep direct and transitive dependencies current; review npm audit details before upgrading.',
  'Use the CI browser report and source scan to review regressions before deployment.',
  ...(total > 0 ? ['Dependency audit reported ' + total + ' advisory item(s); review the private artifact and update affected packages.'] : [])
];
const report = {
  generatedAt: new Date().toISOString(),
  revision: process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? 'local',
  checks: {
    'Unit tests': checks['Unit tests'],
    'Integration tests': checks['Integration tests'] ?? { status: 'skipped', summary: 'Not run.' },
    'Playwright GUI tests': checks['Playwright GUI tests'] ?? { status: 'skipped', summary: 'Not run.' },
    'Single-pass performance': checks['Single-pass performance'] ?? { status: 'skipped', summary: 'Not run.' },
    'Security review': { status: source && deps ? 'passed' : 'failed', summary: 'Source review ' + (source ? 'passed' : 'failed') + '; dependency audit ' + (deps ? 'passed' : 'failed') + ' (' + total + ' advisory item(s)).' }
  },
  performance: observation,
  securitySuggestions: suggestions
};
fs.writeFileSync('public/evidence.json', JSON.stringify(report, null, 2));
const finalBuild = run('Publishable build', 'build', 'Public pages include this run’s check evidence.');
if (!unit || !source || !deps || !built || !integration || !e2e || !perf || !finalBuild) process.exitCode = 1;
