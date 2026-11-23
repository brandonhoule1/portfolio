import test from 'node:test';
import assert from 'node:assert/strict';
import { projectRequirements } from '../../src/catalog.mjs';
import { escapeHtml } from '../../src/html.mjs';
// FSPEC scenario: Public catalog projection preserves source status.
test('catalog projects only explicitly public, existing PORT requirements', () => {
  // @step Given a unit test provides public and internal work units
  const catalog = projectRequirements({ workUnits: { 'PORT-001': { title: 'Public', status: 'backlog', description: 'D' }, 'FOUND-001': { title: 'Internal', status: 'backlog', description: 'secret' } } }, [
    { id: 'PORT-001', githubIssue: 1, acceptanceCriteria: ['A'] }, { id: 'PORT-404', githubIssue: 404, acceptanceCriteria: ['missing'] }, { id: 'FOUND-001', githubIssue: 99, acceptanceCriteria: ['internal'] }
  ]);
  // @step When the catalog projection runs
  // @step Then only explicitly public requirements are returned with their current status
  assert.deepEqual(catalog.map(item => item.id), ['PORT-001']);
  assert.equal(catalog[0].status, 'backlog');
});
// FSPEC scenario: HTML output escapes markup.
test('HTML escaping encodes markup and quotes', () => {
  // @step Given a requirement includes markup characters in its text
  const text = "<script a=\"x\">'&";
  // @step When the catalog HTML is rendered
  const rendered = escapeHtml(text);
  // @step Then markup characters are escaped before output
  assert.equal(rendered, '&lt;script a=&quot;x&quot;&gt;&#39;&amp;');
});
