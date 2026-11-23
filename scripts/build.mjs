import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog } from '../src/catalog.mjs';
import { renderRequirements, renderEvidence, manualCases } from '../src/html.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const file of ['index.html', 'site.css']) fs.copyFileSync(path.join(root, 'public', file), path.join(out, file));
fs.mkdirSync(path.join(out, 'downloads'), { recursive: true });
const resume = path.join(root, 'public', 'downloads', 'Brandon-Houle-AI-Enablement-Resume.pdf');
if (fs.existsSync(resume)) fs.copyFileSync(resume, path.join(out, 'downloads', path.basename(resume)));
fs.mkdirSync(path.join(out, 'images'), { recursive: true });
const portrait = path.join(root, 'public', 'images', 'brandon-houle-linkedin.jpg');
if (fs.existsSync(portrait)) fs.copyFileSync(portrait, path.join(out, 'images', path.basename(portrait)));
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
fs.writeFileSync(path.join(out, 'how-this-was-made.html'), renderRequirements(requirements, report));
fs.mkdirSync(path.join(out, 'manual-test-cases'), { recursive: true });
const headers = ['ID','Category','Priority','Title','Preconditions','Steps','Expected result','Status'];
const csvCell = value => '"' + String(value).replaceAll('"', '""') + '"';
const csv = [headers, ...manualCases.map(c => [c.id,c.category,c.priority,c.title,c.pre,c.steps,c.expected,'Not run'])].map(row => row.map(csvCell).join(',')).join('\r\n');
fs.writeFileSync(path.join(out, 'manual-test-cases.csv'), csv + '\r\n');
const markdown = ['# Portfolio manual test cases','', 'Status: all cases are **Not run** until a human executes and records them. These are planned checks, not test evidence.', '', ...manualCases.flatMap(c => [`## ${c.id} — ${c.title}`, '', `- **Category:** ${c.category}`, `- **Priority:** ${c.priority}`, '- **Status:** Not run', `- **Preconditions:** ${c.pre}`, `- **Steps:** ${c.steps}`, `- **Expected result:** ${c.expected}`, ''])].join('\n');
fs.writeFileSync(path.join(out, 'manual-test-cases.md'), markdown);
