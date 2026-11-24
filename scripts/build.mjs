import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog } from '../src/catalog.mjs';
import { renderRequirements, manualCases, escapeHtml } from '../src/html.mjs';
import { readPublishedHistory, renderCommitList } from '../src/history.mjs';
import { applySiteShell } from '../src/site-shell.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const file of ['site.css']) fs.copyFileSync(path.join(root, 'public', file), path.join(out, file));
let home = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
const commits = await readPublishedHistory(root);
home = applySiteShell(home, '');
fs.writeFileSync(path.join(out, 'index.html'), home);
for (const [name, active, marker, fragment] of [
  ['leadership.html', 'leadership', null, null],
  ['first-90-days.html', 'first-90-days', null, null],
  ['case-studies.html', 'case-studies', '<!--CASE_STUDIES-->', 'case-studies.htmlfrag'],
  ['resume.html', 'resume', null, null],
]) {
  let page = fs.readFileSync(path.join(root, 'public', name), 'utf8');
  if (marker) page = page.replace(marker, fs.readFileSync(path.join(root, 'public', fragment), 'utf8'));
  fs.writeFileSync(path.join(out, name), applySiteShell(page, active));
}
const contactPage = fs.readFileSync(path.join(root, 'public', 'contact', 'index.html'), 'utf8');
fs.mkdirSync(path.join(out, 'contact'), { recursive: true });
fs.writeFileSync(path.join(out, 'contact', 'index.html'), applySiteShell(contactPage, 'contact'));
const blogRoot = path.join(root, 'public', 'blog');
const blogIndex = fs.readFileSync(path.join(blogRoot, 'index.html'), 'utf8');
fs.mkdirSync(path.join(out, 'blog'), { recursive: true });
fs.writeFileSync(path.join(out, 'blog', 'index.html'), applySiteShell(blogIndex, 'blog'));
for (const entry of fs.readdirSync(blogRoot, { withFileTypes: true })) {
  if (entry.isDirectory()) fs.cpSync(path.join(blogRoot, entry.name), path.join(out, 'blog', entry.name), { recursive: true });
}
fs.writeFileSync(path.join(out, 'commits.json'), JSON.stringify(commits, null, 2));
fs.copyFileSync(path.join(root, 'public', 'robots.txt'), path.join(out, 'robots.txt'));
fs.copyFileSync(path.join(root, 'public', 'sitemap.xml'), path.join(out, 'sitemap.xml'));
fs.copyFileSync(path.join(root, 'public', 'llms.txt'), path.join(out, 'llms.txt'));
fs.mkdirSync(path.join(out, 'downloads'), { recursive: true });
const resume = path.join(root, 'public', 'downloads', 'Brandon-Houle-Resume.pdf');
if (fs.existsSync(resume)) fs.copyFileSync(resume, path.join(out, 'downloads', path.basename(resume)));
fs.mkdirSync(path.join(out, 'images'), { recursive: true });
const portrait = path.join(root, 'public', 'images', 'brandon-houle-linkedin.jpg');
if (fs.existsSync(portrait)) fs.copyFileSync(portrait, path.join(out, 'images', path.basename(portrait)));
const requirements = loadCatalog(root);
fs.writeFileSync(path.join(out, 'requirements.json'), JSON.stringify(requirements, null, 2));
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
let processPage = renderRequirements(requirements, report)
  .replaceAll('How this was made', 'How this should be made')
  .replaceAll('/how-this-was-made.html', '/how-this-should-be-made.html')
  .replace('<section><div class="section-heading">', '<section id="requirements"><div class="section-heading">')
  .replace('<section class="section evidence-block">', '<section class="section evidence-block" id="quality-evidence">')
  .replace('<link rel="stylesheet" href="/site.css">', '<link rel="stylesheet" href="/site.css"><link rel="canonical" href="https://brandonhoule.com/how-this-should-be-made.html"><meta name="robots" content="index,follow">')
  .replace('</main>', `<section class="section" id="security-suggestions"><p class="eyebrow">SECURITY REVIEW</p><h2>Security suggestions</h2><ul>${(report.securitySuggestions ?? []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul><p class="note">These are general owner-reviewable suggestions; detailed scanner evidence remains in CI artifacts.</p></section><section class="section log-section" id="commits"><p class="eyebrow">REPOSITORY HISTORY</p><h2>Development record.</h2><p class="section-lede">Commits reachable from the production branch. Each entry links to the exact revision; author email and CI logs are not published.</p><ol class="commit-list" id="commit-list">${renderCommitList(commits)}</ol></section></main>`);
processPage = applySiteShell(processPage, 'process');
fs.writeFileSync(path.join(out, 'how-this-should-be-made.html'), processPage);
fs.mkdirSync(path.join(out, 'manual-test-cases'), { recursive: true });
const headers = ['ID','Category','Priority','Title','Preconditions','Steps','Expected result','Status'];
const csvCell = value => '"' + String(value).replaceAll('"', '""') + '"';
const csv = [headers, ...manualCases.map(c => [c.id,c.category,c.priority,c.title,c.pre,c.steps,c.expected,'Not run'])].map(row => row.map(csvCell).join(',')).join('\r\n');
fs.writeFileSync(path.join(out, 'manual-test-cases.csv'), csv + '\r\n');
const markdown = ['# Portfolio manual test cases','', 'Status: all cases are **Not run** until a human executes and records them. These are planned checks, not test evidence.', '', ...manualCases.flatMap(c => [`## ${c.id} — ${c.title}`, '', `- **Category:** ${c.category}`, `- **Priority:** ${c.priority}`, '- **Status:** Not run', `- **Preconditions:** ${c.pre}`, `- **Steps:** ${c.steps}`, `- **Expected result:** ${c.expected}`, ''])].join('\n');
fs.writeFileSync(path.join(out, 'manual-test-cases.md'), markdown);
fs.writeFileSync(path.join(out, '_redirects'), [
  '/how-this-was-made.html /how-this-should-be-made.html 301',
  '/requirements.html /how-this-should-be-made.html#requirements 301',
  '/evidence.html /how-this-should-be-made.html#quality-evidence 301',
  '/downloads/Brandon-Houle-AI-Enablement-Resume.pdf /downloads/Brandon-Houle-Resume.pdf 301',
  '/blog.html /blog/ 301',
  '/contact.html /contact/ 301'
].join('\n') + '\n');
