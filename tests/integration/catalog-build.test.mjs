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
  assert.equal(catalog.length, 15);
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
  assert.ok(fs.existsSync('dist/requirements.html'));
  assert.ok(fs.existsSync('dist/evidence.html'));
  assert.ok(fs.existsSync('dist/how-this-was-made.html'));
  assert.ok(fs.existsSync('dist/manual-test-cases.csv'));
  assert.ok(fs.existsSync('dist/manual-test-cases.md'));
  assert.ok(fs.existsSync('dist/downloads/Brandon-Houle-AI-Enablement-Resume.pdf'));
  // @step When security results are published
  assert.ok(JSON.parse(fs.readFileSync('dist/evidence.json', 'utf8')).checks);
  // @step Then the site shows every expected quality category and general owner-reviewable suggestions
  const evidence = JSON.parse(fs.readFileSync('dist/evidence.json', 'utf8'));
  assert.deepEqual(Object.keys(evidence.checks), ['Unit tests', 'Integration tests', 'Playwright GUI tests', 'Single-pass performance', 'Security review']);
  assert.ok(evidence.securitySuggestions.length);
});
