import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadCatalog } from '../../src/catalog.mjs';
import { renderRequirements } from '../../src/html.mjs';
// FSPEC scenario: Internal work is excluded from the public catalog.
// FSPEC scenario: Public and internal records produce the expected requirement catalog.
test('repository requirements become a linked, status-bearing public catalog', () => {
  // @step Given the FSPEC repository contains explicitly public portfolio requirements and internal setup records
  const catalog = loadCatalog();
  assert.equal(catalog.length, 19);
  assert.ok(catalog.every(item => item.status && item.description && item.acceptanceCriteria.length));
  assert.ok(catalog.find(item => item.id === 'PORT-002').relatesTo.includes('PORT-006'));
  // @step When the static catalog and evidence report are built
  const html = renderRequirements(catalog);
  // @step Then public requirements include their status and related links while internal records are omitted
  assert.match(html, /GitHub issue #2/);
  assert.doesNotMatch(html, /FOUND-001|Conduct Foundation Event Storm/);
});
// FSPEC scenario: Integration output includes quality evidence.
test('build emits requirements and evidence pages', () => {
  // @step Given source and dependencies are checked during the quality run
  assert.ok(!fs.existsSync('dist/requirements.html'));
  assert.ok(!fs.existsSync('dist/evidence.html'));
  assert.ok(fs.existsSync('dist/how-this-should-be-made.html'));
  assert.ok(fs.existsSync('dist/field-notes.html'));
  assert.ok(fs.existsSync('dist/blog.html'));
  assert.ok(fs.existsSync('dist/resume.html'));
  assert.ok(fs.existsSync('dist/leadership.html'));
  assert.ok(fs.existsSync('dist/manual-test-cases.csv'));
  assert.ok(fs.existsSync('dist/manual-test-cases.md'));
  assert.ok(fs.existsSync('dist/downloads/Brandon-Houle-Resume.pdf'));
  assert.ok(fs.existsSync('dist/commits.json'));
  assert.ok(JSON.parse(fs.readFileSync('dist/commits.json', 'utf8')).length > 0);
  assert.ok(fs.existsSync('dist/robots.txt'));
  assert.ok(fs.existsSync('dist/sitemap.xml'));
  assert.ok(fs.existsSync('dist/llms.txt'));
  const home = fs.readFileSync('dist/index.html', 'utf8');
  assert.match(home, /Technology Leader \/ Innovator/);
  assert.match(home, /case-studies/);
  assert.match(home, /field-notes/);
  assert.match(home, /AI is for routine work/);
  assert.doesNotMatch(home, /Development record|commit-list|Quality evidence/);
  assert.doesNotMatch(home, /<!--(?:CASE_STUDIES|FIELD_NOTES|BLOG_POSTS|SITE_HEADER|SITE_FOOTER)-->/);
  const notes = fs.readFileSync('dist/field-notes.html', 'utf8');
  const blog = fs.readFileSync('dist/blog.html', 'utf8');
  const resume = fs.readFileSync('dist/resume.html', 'utf8');
  const process = fs.readFileSync('dist/how-this-should-be-made.html', 'utf8');
  assert.match(notes, /rel="canonical" href="https:\/\/brandonhoule.com\/field-notes.html"/);
  assert.match(blog, /rel="canonical" href="https:\/\/brandonhoule.com\/blog.html"/);
  assert.match(resume, /brandonhoule@gmail.com/);
  assert.match(resume, /linkedin.com\/in\/brandon-houle/);
  assert.match(process, /Development record/);
  assert.match(process, /commit-list/);
  assert.match(process, /GitHub issue #20/);
  assert.match(process, /Security suggestions/);
  assert.match(fs.readFileSync('dist/_redirects', 'utf8'), /how-this-was-made\.html/);
  assert.match(fs.readFileSync('dist/_redirects', 'utf8'), /Brandon-Houle-AI-Enablement-Resume\.pdf/);
  // @step When security results are published
  assert.ok(JSON.parse(fs.readFileSync('dist/evidence.json', 'utf8')).checks);
  // @step Then the site shows every expected quality category and general owner-reviewable suggestions
  const evidence = JSON.parse(fs.readFileSync('dist/evidence.json', 'utf8'));
  assert.deepEqual(Object.keys(evidence.checks), ['Unit tests', 'Integration tests', 'Playwright GUI tests', 'Single-pass performance', 'Security review']);
  assert.ok(evidence.securitySuggestions.length);
});
