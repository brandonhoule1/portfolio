import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('build emits the independent study page and its resources', () => {
  const page = fs.readFileSync('dist/independent/index.html', 'utf8');
  assert.match(page, /rel="canonical" href="https:\/\/brandonhoule\.com\/independent\/"/);
  assert.match(page, /Independent studies/);
  assert.match(page, /Q3 2026 shareholder letter \(SEC\)/);
  assert.match(page, /This independent portfolio exercise was prepared with AI assistance/);
  assert.ok(fs.existsSync('dist/independent/independent.css'));
  assert.ok(fs.existsSync('dist/downloads/source-review-brief-template.md'));
  assert.ok(fs.existsSync('dist/downloads/duolingo-ai-review-sample.md'));
  assert.match(fs.readFileSync('dist/sitemap.xml', 'utf8'), /https:\/\/brandonhoule\.com\/independent\//);
  assert.match(fs.readFileSync('dist/llms.txt', 'utf8'), /Independent studies: https:\/\/brandonhoule\.com\/independent\//);
});
