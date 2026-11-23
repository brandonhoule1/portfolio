import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, parseCommitLog } from '../../src/history.mjs';

test('commit parser keeps valid revisions and drops malformed records', () => {
  const sha = 'a'.repeat(40);
  const commits = parseCommitLog(`${sha}\t2026-11-23\tA & <b> change\nnot-a-sha\t2026-11-23\tbad`);
  assert.equal(commits.length, 1);
  assert.equal(commits[0].shortSha, 'aaaaaaa');
  assert.equal(commits[0].subject, 'A & <b> change');
});

test('commit subject HTML is escaped before rendering', () => {
  assert.equal(escapeHtml('<script src="x">'), '&lt;script src=&quot;x&quot;&gt;');
});
