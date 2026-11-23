import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog } from '../src/catalog.mjs';
import { renderRequirements, renderEvidence } from '../src/html.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const file of ['index.html', 'site.css']) fs.copyFileSync(path.join(root, 'public', file), path.join(out, file));
const requirements = loadCatalog(root);
fs.writeFileSync(path.join(out, 'requirements.json'), JSON.stringify(requirements, null, 2));
fs.writeFileSync(path.join(out, 'requirements.html'), renderRequirements(requirements));
const reportPath = path.join(root, 'public/evidence.json');
const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : {
  generatedAt: null,
  revision: 'local',
  checks: {},
  securitySuggestions: [
    'Keep direct and transitive dependencies current; review npm audit details before upgrading.',
    'Use the CI browser report and source scan to review regressions before deployment.'
  ]
};
fs.writeFileSync(path.join(out, 'evidence.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(out, 'evidence.html'), renderEvidence(report));
